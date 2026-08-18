(()=>{
  if(typeof go==='function'&&!window.__costNavFinalFix){
    const base=go;
    go=function(id){document.getElementById('costNavButton')?.classList.remove('active');return base(id)};
    window.go=go;window.__costNavFinalFix=true;
  }
  function wrapAction(selector){
    const btn=document.querySelector(selector);if(!btn||btn.onclick?.__lowCostFinal)return;
    const original=btn.onclick;
    const fn=async e=>{e.preventDefault();const x=await window.ensureSolutionDetails?.();if(x)original?.call(btn,e)};
    fn.__lowCostFinal=true;btn.onclick=fn;
  }
  function apply(){wrapAction('#solution [data-go="tips"]');wrapAction('#solution [data-go="stuck"]')}
  apply();setTimeout(apply,500);setTimeout(apply,1500);setTimeout(apply,3000);
})();
