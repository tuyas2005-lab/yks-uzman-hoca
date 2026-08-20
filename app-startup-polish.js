(()=>{
  if(window.__yksStartupPolish)return;window.__yksStartupPolish=true;
  const html=document.documentElement;
  let finished=false;

  function finish(reason='ready'){
    if(finished)return;finished=true;
    try{window.renderHome?.();window.renderTopics?.()}catch(e){console.warn('Başlangıç son render:',e)}
    html.classList.remove('yks-booting');
    html.classList.add('yks-ready');
    html.dataset.bootReason=reason;
  }

  function essentialsReady(){
    return typeof window.getLearningSnapshot==='function'&&
      window.__topicUiV5===true&&
      window.__connectedGo===true;
  }

  function check(){
    if(finished)return;
    if(essentialsReady()){finish('essential-modules-ready');return}
    setTimeout(check,50);
  }

  setTimeout(()=>finish('failsafe'),8000);
  check();
})();
