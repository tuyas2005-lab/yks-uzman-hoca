(()=>{
  let scheduled=false,working=false;
  const css=document.createElement('style');
  css.textContent=`
    .wrong2-section-label{display:flex;align-items:center;gap:8px;margin:12px 2px 7px;color:var(--muted);font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:.04em}
    .wrong2-section-label:after{content:"";height:1px;background:var(--line);flex:1}
    .wrong2-section-label.today{color:#5c43d0}
    .wrong2-section-label.today:after{background:#dcd4ff}
  `;
  document.head.appendChild(css);

  const ids=()=> (window.getWrongReviewTargets?.()||[]).map(x=>x?.id).filter(Boolean);
  const cardId=card=>card?.querySelector?.('[data-wrong-id]')?.dataset?.wrongId||'';

  function arrange(){
    scheduled=false;
    if(working)return;
    const list=document.querySelector('#wrong2Host .wrong2-list');
    if(!list)return;
    const cards=[...list.querySelectorAll(':scope > .wrong2-item')];
    if(!cards.length)return;

    const map=new Map(cards.map(c=>[cardId(c),c]).filter(([id])=>id));
    if(!map.size){setTimeout(schedule,30);return}
    const wanted=ids().filter(id=>map.has(id));
    const wantedSet=new Set(wanted);
    const priority=wanted.map(id=>map.get(id));
    const others=cards.filter(c=>!wantedSet.has(cardId(c)));
    const desired=[...priority,...others].map(cardId);
    const current=cards.map(cardId);
    const labels=[...list.querySelectorAll(':scope > .wrong2-section-label')];
    const labelsOk=(priority.length?labels.some(x=>x.classList.contains('today')):true)&&(others.length?labels.some(x=>x.classList.contains('others')):true);
    if(desired.join('|')===current.join('|')&&labelsOk)return;

    working=true;
    try{
      labels.forEach(x=>x.remove());
      const frag=document.createDocumentFragment();
      if(priority.length){
        const h=document.createElement('div');h.className='wrong2-section-label today';h.textContent=`🎯 Bugünün görevleri • ${priority.length}`;frag.appendChild(h);
        priority.forEach(c=>frag.appendChild(c));
      }
      if(others.length){
        const h=document.createElement('div');h.className='wrong2-section-label others';h.textContent='Diğer yanlışlar';frag.appendChild(h);
        others.forEach(c=>frag.appendChild(c));
      }
      list.appendChild(frag);
    }finally{working=false}
  }

  function schedule(){
    if(scheduled||working)return;
    scheduled=true;
    requestAnimationFrame(()=>setTimeout(arrange,0));
  }

  const boot=()=>{
    const host=document.getElementById('wrong2Host');
    if(!host){setTimeout(boot,100);return}
    new MutationObserver(()=>schedule()).observe(host,{childList:true,subtree:true});
    host.addEventListener('input',schedule,true);
    host.addEventListener('change',schedule,true);
    schedule();
  };
  boot();
})();
