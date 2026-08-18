(()=>{
  function cleanup(){
    const card=document.querySelector('#weakList')?.closest('.card');
    if(!card)return;
    const title=card.querySelector('.section-title');
    const hints=[...card.querySelectorAll('.home-owner')];
    if(!hints.length&&title){
      const n=document.createElement('div');
      n.className='home-owner';
      n.textContent='Kişisel Öğretmen • Mini Test verisi + Koç ders önceliği';
      title.insertAdjacentElement('afterend',n);
      return;
    }
    hints.slice(1).forEach(x=>x.remove());
  }

  cleanup();
  if(typeof window.renderHome==='function'&&!window.__homeHintsFixed){
    const base=window.renderHome;
    const wrapped=function(){const r=base.apply(this,arguments);cleanup();return r};
    window.renderHome=wrapped;
    try{renderHome=wrapped}catch{}
    window.__homeHintsFixed=true;
  }
  setTimeout(cleanup,100);
  setTimeout(cleanup,600);
})();
