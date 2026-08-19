(()=>{
  let origin='';
  const root=()=>document.getElementById('sqRoot');
  const sourceScreen=()=>document.getElementById('sourceQuestion');

  function resultIsEmpty(){
    const r=root()?.querySelector('#sqResult');
    return !r || !String(r.textContent||'').trim();
  }
  function resetFreshQuestion(){
    const r=root();
    if(r&&resultIsEmpty()) delete r.dataset.done;
  }
  function showPreservedTests(){
    const tests=document.getElementById('tests');
    if(!tests)return;
    document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active',s===tests));
    document.querySelectorAll('[data-go]').forEach(b=>b.classList.toggle('active',b.dataset.go==='tests'));
    window.scrollTo({top:0,behavior:'smooth'});
  }

  // Viewer'ın click yakalayıcısından önce hangi ekrandan geldiğimizi kaydet.
  document.addEventListener('pointerdown',e=>{
    if(e.target.closest('.mts-open')) origin='tests';
    else if(e.target.closest('.official-open')) origin='similar';
    if(e.target.closest('.sq-answer,.sq-unable,.sq-check')) resetFreshQuestion();
  },true);

  // Yeni soru DOM'a basıldığında önceki sorudan kalan done bayrağını temizle.
  const mo=new MutationObserver(()=>resetFreshQuestion());
  const boot=()=>{
    const r=root();
    if(!r){setTimeout(boot,80);return}
    mo.observe(r,{childList:true,subtree:true});
    resetFreshQuestion();
  };
  boot();

  // Mini testten açılan kaynak soruda geri dönüş mevcut 3/5/10'luk seti korusun.
  document.addEventListener('click',e=>{
    const returnBtn=e.target.closest('#sqReturn');
    const backBtn=e.target.closest('#sqBack');
    if(origin!=='tests'||(!returnBtn&&!backBtn)||!sourceScreen()?.classList.contains('active'))return;
    e.preventDefault();
    e.stopImmediatePropagation();
    showPreservedTests();
  },true);
})();
