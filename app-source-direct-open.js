(()=>{
  let warmTimer=0,bindTimer=0,lastWarmKey='';

  const resolve=card=>window.resolveSourceQuestionCard?.(card)||null;

  function openDirect(btn,card,item,mini){
    if(typeof window.openSourceQuestion!=='function'){
      alert('Tek-soru görüntüleyici henüz yüklenmedi. Sayfayı bir kez yenileyip tekrar dene.');return;
    }
    const ready=typeof window.isSourceQuestionReady==='function'&&window.isSourceQuestionReady(item);
    const preparable=typeof window.isSourceQuestionPreparable==='function'&&window.isSourceQuestionPreparable(item);
    if(!ready&&!preparable){
      alert('Bu soru henüz tek-soru görüntüsü olarak hazırlanmadı.');return;
    }
    window.openSourceQuestion(item,{type:mini?'mini':'official',card,returnScreen:mini?'tests':'similar'});
  }

  // Viewer'ın eski document-capture dinleyicisi preparable sorularda autocrop zincirini atlayabiliyor.
  // Window capture, document'tan önce çalışır ve tıklamayı daima güncel window.openSourceQuestion zincirine yönlendirir.
  window.addEventListener('click',e=>{
    const btn=e.target?.closest?.('.mts-open,.official-open');if(!btn)return;
    const card=btn.closest('.mts-q,.official-source-card');if(!card)return;
    const item=resolve(card);if(!item)return;
    const mini=card.classList.contains('mts-q');
    e.preventDefault();e.stopImmediatePropagation();
    openDirect(btn,card,item,mini);
  },true);

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
        openDirect(btn,card,item,mini);
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
