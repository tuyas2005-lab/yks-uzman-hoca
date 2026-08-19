(()=>{
  let stopped=false;
  const textEl=()=>document.getElementById('liveText');
  const stripEl=()=>document.getElementById('liveStrip');

  function setUi(text,kind='checking'){
    const t=textEl(),s=stripEl();
    if(t)t.textContent=text;
    if(s){
      s.classList.toggle('live',kind==='live');
      s.dataset.status=kind;
    }
  }

  function applyStatus(info){
    const isLive=!!info?.live;
    try{liveApi=isLive}catch{window.liveApi=isLive}
    if(isLive){
      const model=info?.model||info?.solveModel||'Canlı AI';
      setUi(`Canlı • Skill + ${model}`,'live');
      const skill=document.getElementById('skillStatus');
      if(skill){
        skill.className='tip blue';
        skill.innerHTML='<b>Canlı mod:</b> YKS Uzman Hoca skill ve resmî kaynak katmanı aktif.';
      }
      return true;
    }
    setUi('Sunucu açık • AI yapılandırması eksik','offline');
    return false;
  }

  async function check(attempt=0){
    if(stopped)return;
    if(!navigator.onLine){setUi('Çevrimdışı • Yerel veriler kullanılabilir','offline');return}
    if(attempt===0)setUi('Canlı durum kontrol ediliyor…','checking');
    try{
      const r=await fetch(`/api/status?ui=${Date.now()}`,{cache:'no-store',headers:{'Accept':'application/json'}});
      if(!r.ok)throw new Error(`HTTP ${r.status}`);
      const info=await r.json();
      applyStatus(info);
      stopped=true;
    }catch(e){
      const delays=[700,1800,4000];
      if(attempt<delays.length){
        setUi('Canlı durum yeniden deneniyor…','checking');
        setTimeout(()=>check(attempt+1),delays[attempt]);
      }else{
        setUi('Canlı bağlantı geçici olarak doğrulanamadı','offline');
      }
    }
  }

  window.refreshLiveStatus=()=>{stopped=false;check(0)};
  window.addEventListener('online',()=>window.refreshLiveStatus());
  setTimeout(()=>check(0),80);
})();
