(()=>{
  const PDFJS='https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs';
  const PDFWORKER='https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs';
  const C=()=>window.YKSQuestionCatalogV1;
  let pdfjs=null;
  const docs=new Map(),cropJobs=new Map();
  const SUPPORTED_YEARS=new Set([2024,2025,2026]);

  const pdfKeyFor=x=>x?.access?.pdfKey||x?.asset?.pdfKey||`osym-${Number(x?.year||0)}-tyt`;
  const eligible=x=>x?.provider==='OSYM'&&SUPPORTED_YEARS.has(Number(x?.year))&&x?.exam==='TYT'&&x?.answerKey&&x?.access?.page;
  const hasManual=x=>!!((x?.asset?.crop||x?.asset?.parts)&&String(x?.asset?.kind||'').startsWith('cached-pdf'));

  async function getPdfJs(){if(pdfjs)return pdfjs;pdfjs=await import(PDFJS);pdfjs.GlobalWorkerOptions.workerSrc=PDFWORKER;return pdfjs}
  function getDoc(key){if(docs.has(key))return docs.get(key);const p=(async()=>{const lib=await getPdfJs();return await lib.getDocument({url:`/api/source-question?key=${encodeURIComponent(key)}`,rangeChunkSize:131072,disableAutoFetch:false,disableStream:false}).promise})();docs.set(key,p);return p}
  const markerRe=q=>new RegExp(`^\\s*${String(q)}\\s*\\.\\s*$`);
  const anyMarker=/^\d{1,2}\s*\.\s*$/;

  async function detectCrop(item){
    if(hasManual(item)||item?.asset?.crop||item?.asset?.parts)return item.asset;
    if(cropJobs.has(item.id))return cropJobs.get(item.id);
    const job=(async()=>{
      const pdfKey=pdfKeyFor(item),doc=await getDoc(pdfKey);
      const pageNo=Number(item.access.page),page=await doc.getPage(pageNo),vp=page.getViewport({scale:1}),tc=await page.getTextContent();
      const W=vp.width,H=vp.height,q=String(item.questionNo||''),markers=[];
      for(const t of tc.items||[]){
        const s=String(t.str||'').trim();if(!anyMarker.test(s))continue;
        const m=s.match(/^(\d{1,2})\s*\.\s*$/);if(!m)continue;
        const x=Number(t.transform?.[4]||0),y=Number(t.transform?.[5]||0),h=Math.max(7,Math.abs(Number(t.height||t.transform?.[3]||10)));
        markers.push({q:m[1],x,y,h,s});
      }
      let cur=markers.find(m=>m.q===q);
      if(!cur){
        for(const t of tc.items||[]){
          const s=String(t.str||'').trim();if(!markerRe(q).test(s))continue;
          cur={q,x:Number(t.transform?.[4]||0),y:Number(t.transform?.[5]||0),h:Math.max(7,Math.abs(Number(t.height||t.transform?.[3]||10))),s};break;
        }
      }
      if(!cur){item.asset={status:'pending',kind:'auto-text-crop-error',pdfKey,page:pageNo,error:'question-marker-not-found'};throw new Error(`Soru ${q} sayfa ${pageNo} üzerinde bulunamadı.`)}
      const right=cur.x>W*.48;
      const same=markers.filter(m=>(m.x>W*.48)===right&&m.y<cur.y-4).sort((a,b)=>b.y-a.y);
      const next=same[0]||null;
      const top=Math.max(.045,(H-cur.y-cur.h*1.7)/H);
      let bottom=next?Math.min(.965,(H-next.y+next.h*.9)/H):.955;
      if(bottom<=top+.06)bottom=Math.min(.965,top+.32);
      const x=right ? .515 : .055,w=right ? .43 : .44;
      const crop={x,y:Math.max(.035,top-.012),w,h:Math.max(.10,bottom-top+.015)};
      item.asset={status:'ready',kind:'auto-text-crop',pdfKey,page:pageNo,crop};item.answerVerified=true;return item.asset;
    })().finally(()=>cropJobs.delete(item.id));
    cropJobs.set(item.id,job);return job;
  }

  function decorate(){for(const x of C()?.all?.()||[]){if(!eligible(x)||hasManual(x))continue;const old=x.asset||{},pdfKey=pdfKeyFor(x);x.asset={status:'ready',kind:'auto-text-crop',pdfKey,page:Number(x.access.page),crop:old.crop};x.answerVerified=true}}

  function install(tries=0){
    if(!C()?.all||typeof window.openSourceQuestion!=='function'){if(tries<120)setTimeout(()=>install(tries+1),50);return}
    decorate();if(window.__sourceAutoCropInstalled)return;window.__sourceAutoCropInstalled=true;
    const baseOpen=window.openSourceQuestion,basePrepare=window.prepareSourceQuestions,baseReady=window.isSourceQuestionReady;
    window.isSourceQuestionReady=item=>eligible(item)||baseReady?.(item)||false;
    window.openSourceQuestion=async function(item,ctx={}){try{if(eligible(item)&&!hasManual(item))await detectCrop(item);return baseOpen(item,ctx)}catch(e){console.error('auto crop open',e);alert(`Bu sorunun tek-soru görüntüsü hazırlanamadı: ${e.message||'kırpma hatası'}`)}};
    window.prepareSourceQuestions=async function(items=[]){const list=(items||[]).filter(Boolean),auto=list.filter(x=>eligible(x)&&!hasManual(x));for(const x of auto){try{await detectCrop(x)}catch(e){console.warn('auto crop prewarm',x.id,e)}}return basePrepare?.(list)};
    setTimeout(()=>{if(!navigator.connection?.saveData){const visible=(C()?.all?.()||[]).filter(eligible);window.prepareSourceQuestions(visible.slice(0,20))}},900);
  }
  install();
})();
