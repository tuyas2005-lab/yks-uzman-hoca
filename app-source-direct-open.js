(()=>{
  const C=()=>window.YKSQuestionCatalogV1;
  const norm=s=>String(s||'').toLocaleLowerCase('tr-TR');
  let warmTimer=0,bindTimer=0,lastWarmKey='';

  function resolve(card){
    const all=C()?.all?.()||[];
    const id=card?.dataset?.catalogId;
    if(id){const hit=all.find(x=>x.id===id);if(hit)return hit}
    const text=card?.innerText||'';
    const q=(text.match(/Soru\s*(\d+)/i)||[])[1]||'';
    let rows=all.filter(x=>q&&String(x.questionNo||'')===q&&text.includes(x.collection||''));
    if(rows.length===1)return rows[0];
    rows=all.filter(x=>q&&String(x.questionNo||'')===q&&text.includes(x.subject||'')&&text.includes(x.topic||''));
    if(rows.length===1)return rows[0];
    const z=norm(text);
    return all.find(x=>q&&String(x.questionNo||'')===q&&z.includes(norm(x.subject))&&z.includes(norm(x.topic)))||null;
  }

  function recordOpen(item){
    try{window.YKSDataV5?.record?.({source:'official-question-open',exam:item.exam,subject:item.subject,topic:item.topic,curriculumOutcome:(item.subtopics||[]).join(' • '),result:'unknown',interaction:'opened-source',questionCount:0,signals:[],meta:{catalogId:item.id,provider:item.provider,collection:item.collection,questionNo:item.questionNo,url:item.access?.url,visual:item.visual}},{persistNow:true})}catch{}
  }

  function bind(){
    const items=[];
    document.querySelectorAll('.mts-q,.official-source-card').forEach(card=>{
      const item=resolve(card);if(!item)return;
      if(card.dataset.catalogId!==item.id)card.dataset.catalogId=item.id;
      items.push(item);
      const mini=card.classList.contains('mts-q');
      const btn=card.querySelector(mini?'.mts-open':'.official-open');if(!btn)return;
      if(btn.textContent!=='Soruyu Çöz →')btn.textContent='Soruyu Çöz →';
      if(btn.dataset.singleQuestionDirect==='1')return;
      btn.dataset.singleQuestionDirect='1';
      btn.onclick=e=>{
        e.preventDefault();e.stopPropagation();
        if(typeof window.openSourceQuestion!=='function'){
          alert('Tek-soru görüntüleyici henüz yüklenmedi. Sayfayı bir kez yenileyip tekrar dene.');return;
        }
        if(window.isSourceQuestionReady&&!window.isSourceQuestionReady(item)){
          alert('Bu soru henüz tek-soru görüntüsü olarak hazırlanmadı.');return;
        }
        recordOpen(item);
        window.openSourceQuestion(item,{type:mini?'mini':'official',card,returnScreen:mini?'tests':'similar'});
      };
    });
    const warmKey=[...new Set(items.map(x=>x.id))].sort().join('|');
    if(warmKey&&warmKey!==lastWarmKey){
      lastWarmKey=warmKey;
      clearTimeout(warmTimer);
      warmTimer=setTimeout(()=>{if(!navigator.connection?.saveData)window.prepareSourceQuestions?.(items)},120);
    }
  }

  function scheduleBind(){clearTimeout(bindTimer);bindTimer=setTimeout(bind,20)}
  const mo=new MutationObserver(muts=>{
    if(muts.some(m=>[...m.addedNodes].some(n=>n.nodeType===1&&(n.matches?.('.mts-q,.official-source-card')||n.querySelector?.('.mts-q,.official-source-card')))))scheduleBind();
  });
  mo.observe(document.body,{childList:true,subtree:true});
  bind();
  navigator.serviceWorker?.getRegistration?.().then(r=>r?.update?.()).catch(()=>{});
  window.rebindSourceQuestionButtons=bind;
})();
