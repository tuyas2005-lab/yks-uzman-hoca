(()=>{
  if(window.__yksUiCleanupV1)return;window.__yksUiCleanupV1=true;
  function cleanup(){
    const subjects=document.querySelector('#home .subjects');
    if(subjects){
      const title=subjects.previousElementSibling;
      if(title?.classList.contains('section-title')&&/dersler/i.test(title.textContent||''))title.remove();
      subjects.remove();
    }
  }
  cleanup();
  const mo=new MutationObserver(cleanup);mo.observe(document.body,{childList:true,subtree:true});
})();