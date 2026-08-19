(()=>{
  if(window.__favoritesSidebarNavFix)return;
  window.__favoritesSidebarNavFix=true;

  document.addEventListener('click',e=>{
    const shell=document.getElementById('favoritesLibrary');
    if(!shell?.classList.contains('open'))return;

    const nav=e.target.closest('.sidebar [data-go], .bottom [data-go]');
    if(!nav)return;

    const target=nav.dataset.go;
    if(!target)return;

    e.preventDefault();
    e.stopImmediatePropagation();

    shell.classList.remove('open');
    document.body.style.overflow='';

    if(typeof window.go==='function')window.go(target);
    else if(typeof go==='function')go(target);
  },true);
})();
