(()=>{
  const demo=[['02.08.2026','TYT Deneme 1',51.5],['09.08.2026','TYT Deneme 2',57],['16.08.2026','TYT Deneme 3',61.25]];
  function purgeDemo(){
    if(Array.isArray(state.trials)&&state.trials.length===3&&demo.every(([d,n,net],i)=>state.trials[i]?.date===d&&state.trials[i]?.name===n&&Number(state.trials[i]?.net)===net)){state.trials=[];save()}
  }
  function bindFirst(){const b=document.getElementById('ycFirst');if(b&&!b.dataset.bound){b.dataset.bound='1';b.onclick=()=>document.getElementById('ycAdd')?.click()}}
  purgeDemo();bindFirst();
  const base=window.renderCoach;
  if(typeof base==='function'){
    window.renderCoach=function(){purgeDemo();base();setTimeout(bindFirst,0)};
    try{renderCoach=window.renderCoach}catch{}
  }
  const observer=new MutationObserver(()=>bindFirst());observer.observe(document.getElementById('coach'),{childList:true,subtree:true});
})();
