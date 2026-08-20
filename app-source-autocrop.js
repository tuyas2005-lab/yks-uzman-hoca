(()=>{
  const PDFJS='https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs';
  const PDFWORKER='https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs';
  const C=()=>window.YKSQuestionCatalogV1;
  let pdfjs=null;
  const docs=new Map(),cropJobs=new Map(),pageLayouts=new Map();
  const SUPPORTED_YEARS=new Set([2024,2025,2026]);

  const pdfKeyFor=x=>x?.access?.pdfKey||x?.asset?.pdfKey||`osym-${Number(x?.year||0)}-tyt`;
  const eligible=x=>x?.provider==='OSYM'&&SUPPORTED_YEARS.has(Number(x?.year))&&x?.exam==='TYT'&&x?.answerKey&&x?.access?.page;
  const hasGeometry=x=>!!(x?.asset?.crop||(Array.isArray(x?.asset?.parts)&&x.asset.parts.length));
  const hasManual=x=>hasGeometry(x)&&String(x?.asset?.kind||'').startsWith('cached-pdf');
  const canAutoPrepare=x=>eligible(x)&&!hasManual(x)&&!hasGeometry(x)&&x?.asset?.status!=='pending';

  async function getPdfJs(){if(pdfjs)return pdfjs;pdfjs=await import(PDFJS);pdfjs.GlobalWorkerOptions.workerSrc=PDFWORKER;return pdfjs}
  function getDoc(key){if(docs.has(key))return docs.get(key);const p=(async()=>{const lib=await getPdfJs();return await lib.getDocument({url:`/api/source-question?key=${encodeURIComponent(key)}`,rangeChunkSize:131072,disableAutoFetch:false,disableStream:false}).promise})();docs.set(key,p);return p}
  const markerRe=q=>new RegExp(`^\\s*${String(q)}\\s*\\.\\s*$`);
  const anyMarker=/^\d{1,2}\s*\.\s*$/;

  function getPageLayout(pdfKey,pageNo){
    const key=`${pdfKey}:${pageNo}`;if(pageLayouts.has(key))return pageLayouts.get(key);
    const p=(async()=>{
      const doc=await getDoc(pdfKey),page=await doc.getPage(pageNo),vp=page.getViewport({scale:1}),tc=await page.getTextContent(),markers=[];
      for(const t of tc.items||[]){
        const s=String(t.str||'').trim();if(!anyMarker.test(s))continue;
        const m=s.match(/^(\d{1,2})\s*\.\s*$/);if(!m)continue;
        markers.push({q:m[1],x:Number(t.transform?.[4]||0),y:Number(t.transform?.[5]||0),h:Math.max(7,Math.abs(Number(t.height||t.transform?.[3]||10))),s});
      }
      return{W:vp.width,H:vp.height,markers,items:tc.items||[]};
    })();pageLayouts.set(key,p);return p
  }

  async function detectCrop(item){
    if(hasManual(item)||hasGeometry(item)){if(item?.asset)item.asset.status='ready';return item.asset}
    if(cropJobs.has(item.id))return cropJobs.get(item.id);
    const job=(async()=>{
      const pdfKey=pdfKeyFor(item),pageNo=Number(item.access.page),q=String(item.questionNo||'');
      item.asset={...(item.asset||{}),status:'preparing',kind:'auto-text-crop',pdfKey,page:pageNo};
      const {W,H,markers,items}=await getPageLayout(pdfKey,pageNo);
      let cur=markers.find(m=>m.q===q);
      if(!cur){
        for(const t of items){const s=String(t.str||'').trim();if(!markerRe(q).test(s))continue;cur={q,x:Number(t.transform?.[4]||0),y:Number(t.transform?.[5]||0),h:Math.max(7,Math.abs(Number(t.height||t.transform?.[3]||10))),s};break}
      }
      if(!cur){item.asset={status:'pending',kind:'auto-text-crop-error',pdfKey,page:pageNo,error:'question-marker-not-found'};throw new Error(`Soru ${q} sayfa ${pageNo} üzerinde bulunamadı.`)}
      const right=cur.x>W*.48,same=markers.filter(m=>(m.x>W*.48)===right&&m.y<cur.y-4).sort((a,b)=>b.y-a.y),next=same[0]||null;
      const top=Math.max(.045,(H-cur.y-cur.h*1.7)/H);let bottom=next?Math.min(.965,(H-next.y+next.h*.9)/H):.955;if(bottom<=top+.06)bottom=Math.min(.965,top+.32);
      const crop={x:right ? .515 : .055,y:Math.max(.035,top-.012),w:right ? .43 : .44,h:Math.max(.10,bottom-top+.015)};
      const valid=[crop.x,crop.y,crop.w,crop.h].every(Number.isFinite)&&crop.x>=0&&crop.y>=0&&crop.w>.1&&crop.h>.08&&crop.x+crop.w<=1.001&&crop.y+crop.h<=1.001;
      if(!valid){item.asset={status:'pending',kind:'auto-text-crop-error',pdfKey,page:pageNo,error:'invalid-crop-geometry'};throw new Error(`Soru ${q} için geçerli crop geometrisi üretilemedi.`)}
      item.asset={status:'ready',kind:'auto-text-crop',pdfKey,page:pageNo,crop};item.answerVerified=true;item.verification={...(item.verification||{}),crop:'pdfjs-question-marker'};return item.asset;
    })().finally(()=>cropJobs.delete(item.id));
    cropJobs.set(item.id,job);return job;
  }

  function decorate(){
    for(const x of C()?.all?.()||[]){
      if(!eligible(x)||hasManual(x))continue;
      const old=x.asset||{},pdfKey=pdfKeyFor(x),ready=hasGeometry(x);
      x.asset={...old,status:ready?'ready':'preparable',kind:'auto-text-crop',pdfKey,page:Number(x.access.page)};
      if(x.answerKey)x.answerVerified=true;
    }
  }

  function install(tries=0){
    if(!C()?.all||typeof window.openSourceQuestion!=='function'){if(tries<120)setTimeout(()=>install(tries+1),50);return}
    decorate();if(window.__sourceAutoCropInstalled)return;window.__sourceAutoCropInstalled=true;
    const baseOpen=window.openSourceQuestion,basePrepare=window.prepareSourceQuestions,baseReady=window.isSourceQuestionReady;
    window.isSourceQuestionReady=item=>(eligible(item)&&item?.asset?.status==='ready'&&hasGeometry(item))||baseReady?.(item)||false;
    window.isSourceQuestionPreparable=item=>canAutoPrepare(item)||false;
    window.openSourceQuestion=async function(item,ctx={}){try{if(canAutoPrepare(item))await detectCrop(item);return baseOpen(item,ctx)}catch(e){console.error('auto crop open',e);alert(`Bu sorunun tek-soru görüntüsü hazırlanamadı: ${e.message||'kırpma hatası'}`)}};
    window.prepareSourceQuestions=async function(items=[]){const list=(items||[]).filter(Boolean),auto=list.filter(canAutoPrepare);for(const x of auto){try{await detectCrop(x)}catch(e){console.warn('auto crop prewarm',x.id,e)}}return basePrepare?.(list)};
    setTimeout(()=>{if(!navigator.connection?.saveData){const visible=(C()?.all?.()||[]).filter(canAutoPrepare);window.prepareSourceQuestions(visible.slice(0,20))}},900);
  }
  install();
})();
