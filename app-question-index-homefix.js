(()=>{
  const title=[...document.querySelectorAll('#home .section-title')].find(x=>x.querySelector('h2')?.textContent.trim()==='Dersler');
  if(!title)return;
  let b=document.getElementById('qiHomeLink');
  if(!b){b=document.createElement('button');b.id='qiHomeLink';b.className='qi-home-link';b.textContent='🗂️ Soru İndeksi'}
  b.onclick=()=>window.go?.('questionIndex');
  title.appendChild(b);
})();
