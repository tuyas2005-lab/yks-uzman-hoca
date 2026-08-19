(()=>{
  const source=()=>document.getElementById('sourceQuestion');
  const hideSource=()=>source()?.classList.remove('active');

  // Normal menü/geri navigasyonunda kaynak soru ekranda kalmasın.
  document.addEventListener('click',e=>{
    const nav=e.target.closest('[data-go]');
    if(nav&&nav.dataset.go!=='sourceQuestion')hideSource();
  },true);

  function patchGo(tries=0){
    const current=window.go;
    if(typeof current!=='function'){
      if(tries<120)setTimeout(()=>patchGo(tries+1),50);
      return;
    }
    if(current.__sourceScreenAware)return;
    const wrapped=function(id){
      if(id!=='sourceQuestion')hideSource();
      return current(id);
    };
    wrapped.__sourceScreenAware=true;
    window.go=wrapped;
    try{go=wrapped}catch{}
  }
  patchGo();

  // Güvenlik ağı: başka bir ekran aktif hale geldiyse Kaynak Soru aktif kalamaz.
  const observer=new MutationObserver(records=>{
    const sq=source();
    if(!sq?.classList.contains('active'))return;
    const other=[...document.querySelectorAll('.screen.active')].find(x=>x!==sq);
    if(other)sq.classList.remove('active');
  });
  observer.observe(document.body,{subtree:true,attributes:true,attributeFilter:['class']});
})();
