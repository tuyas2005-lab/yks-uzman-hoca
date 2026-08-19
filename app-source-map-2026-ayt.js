(()=>{
  const PDFJS='https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs';
  const PDFWORKER='https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs';
  let pdfjs=null,docPromise=null,activated=false;
  const scanPromises=new Map();

  function cfg(item){
    const id=String(item?.id||'');
    if(item?.year!==2026||item?.exam!=='AYT')return null;
    if(/^osym-2026-ayt-(?:tde1|tar1|cog1)-/.test(id))return{key:'tde1',start:3,end:14};
    if(/^osym-2026-ayt-(?:tar2|cog2|fel2|din2)-/.test(id))return{key:'soc2',start:15,end:27};
    if(/^osym-2026-ayt-mat-/.test(id))return{key:'mat',start:28,end:38};
    if(/^osym-2026-ayt-(?:fiz|kim|biy)-/.test(id))return{key:'fen',start:39,end:48};
    return null;
  }
  async function lib(){if(pdfjs)return pdfjs;pdfjs=await import(PDFJS);pdfjs.GlobalWorkerOptions.workerSrc=PDFWORKER;return pdfjs}
  async function doc(){if(docPromise)return docPromise;docPromise=(async()=>{const L=await lib();return await L.getDocument({url:'/api/source-question?key=osym-2026-ayt',rangeChunkSize:131072,disableAutoFetch:false,disableStream:false}).promise})();return docPromise}
  const colOf=x=>x<.5?0:1;
  const colStart=c=>c===0?.055:.52;
  const colWidth=c=>c===0?.45:.43;

  async function scan(range){
    if(scanPromises.has(range.key))return scanPromises.get(range.key);
    const p=(async()=>{
      const d=await doc();
      const pageSets=await Promise.all(Array.from({length:range.end-range.start+1},(_,i)=>range.start+i).map(async pageNo=>{
        const page=await d.getPage(pageNo),vp=page.getViewport({scale:1}),tc=await page.getTextContent();
        const labels=[];
        for(const it of tc.items||[]){
          const m=/^\s*(\d{1,2})\.\s*$/.exec(String(it.str||''));if(!m)continue;
          const q=Number(m[1]);if(q<1||q>46)continue;
          const x=(it.transform?.[4]||0)/vp.width,top=1-(it.transform?.[5]||0)/vp.height;
          const left=Math.abs(x-.065)<.075,right=Math.abs(x-.535)<.075;if(!left&&!right)continue;
          if(top<.07||top>.91)continue;
          if(pageNo===range.start&&q<=2&&top<.18)continue;
          labels.push({q,page:pageNo,x,top,col:colOf(x),score:Math.min(Math.abs(x-.065),Math.abs(x-.535))});
        }
        return labels;
      }));
      const all=pageSets.flat().sort((a,b)=>a.page-b.page||a.col-b.col||a.top-b.top);
      const canonical=new Map();let expected=1;
      for(const c of all){if(c.q===expected){canonical.set(expected,c);expected++;if(expected>46)break}}
      for(let q=1;q<=46;q++)if(!canonical.has(q)){
        const choices=all.filter(c=>c.q===q).sort((a,b)=>(a.score+(a.page===range.start&&q<=2&&a.top<.2?.3:0))-(b.score+(b.page===range.start&&q<=2&&b.top<.2?.3:0))||a.page-b.page||a.top-b.top);
        if(choices[0])canonical.set(q,choices[0]);
      }
      return canonical;
    })();
    scanPromises.set(range.key,p);return p;
  }

  async function resolveAsset(item){
    const range=cfg(item);if(!range||item?.cancelled)return item;
    if(item.asset?.crop&&item.asset?.page)return item;
    const q=Number(item.questionNo),map=await scan(range),pos=map.get(q);if(!pos)throw new Error(`${range.key} soru ${q} PDF üzerinde bulunamadı.`);
    const same=[...map.values()].filter(x=>x.page===pos.page&&x.col===pos.col&&x.top>pos.top+.025).sort((a,b)=>a.top-b.top);
    const bottom=same[0]?Math.min(.905,same[0].top-.012):.905;
    const top=Math.max(.065,pos.top-.022);let h=bottom-top;if(h<.12)h=.22;if(h>.78)h=.78;
    item.asset={status:'ready',kind:'cached-pdf-crop',pdfKey:'osym-2026-ayt',page:pos.page,crop:{x:colStart(pos.col),y:top,w:colWidth(pos.col),h}};
    item.answerVerified=!!item.answerKey&&!item.cancelled;if(item.answerKey&&!item.answer)item.answer=item.answerKey;
    item.access??={};item.access.page=pos.page;
    return item;
  }

  function activate(){
    const C=window.YKSQuestionCatalogV1;if(!C?.all)return false;
    window.apply2026AytOfficialAnswerFixes?.();let changed=false;
    for(const item of C.all()){
      const range=cfg(item);if(!range)continue;
      if(item.cancelled||!item.answerKey){item.asset={status:item.cancelled?'cancelled':'pending'};item.answerVerified=false;continue}
      if(!item.asset?.crop)item.asset={status:'ready',kind:'auto-pdf-crop',pdfKey:'osym-2026-ayt',auto:{...range,q:Number(item.questionNo)}};
      item.answerVerified=true;if(!item.answer)item.answer=item.answerKey;changed=true;
    }
    if(changed&&!activated){activated=true;setTimeout(()=>{try{window.renderQuestionIndex?.()}catch{}},0)}
    return changed;
  }

  function wrap(){
    if(window.__aytAutoCropWrapped)return true;
    if(typeof window.openSourceQuestion!=='function'||typeof window.prepareSourceQuestions!=='function')return false;
    const baseOpen=window.openSourceQuestion,basePrepare=window.prepareSourceQuestions,baseGet=window.getSourceQuestionCropUrl;
    window.openSourceQuestion=async(item,ctx)=>{try{if(cfg(item))await resolveAsset(item);return baseOpen(item,ctx)}catch(e){console.error('AYT crop',e);alert('Bu AYT sorusunun tek-soru görüntüsü hazırlanamadı. Lütfen tekrar dene.')}};
    window.prepareSourceQuestions=async(items=[])=>{const ok=[];for(const item of items){try{if(cfg(item))await resolveAsset(item);ok.push(item)}catch(e){console.warn('AYT prewarm',item?.id,e)}}return basePrepare(ok)};
    window.getSourceQuestionCropUrl=async id=>{const item=window.YKSQuestionCatalogV1?.all?.().find(x=>x.id===id);if(item&&cfg(item))await resolveAsset(item);return baseGet?baseGet(id):''};
    window.resolve2026AytSourceAsset=resolveAsset;window.__aytAutoCropWrapped=true;return true;
  }

  // Viewer'ın ilk TYT prewarm turuna çarpmamak için normal açılışta kısa gecikme kullan.
  setTimeout(()=>{activate();wrap()},1800);
  document.addEventListener('pointerdown',e=>{if(e.target.closest('#mtsBuild,#mtsWeak,#mtsCurrent,#solution [data-go="similar"]')){activate();wrap()}},true);
  let tries=0;const t=setInterval(()=>{if(wrap()&&activated||++tries>50)clearInterval(t)},100);
  window.activate2026Ayt=()=>{const r=activate();wrap();return r};
})();