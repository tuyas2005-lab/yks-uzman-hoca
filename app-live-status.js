(()=>{
  let runId=0;
  const textEl=()=>document.getElementById('liveText');
  const stripEl=()=>document.getElementById('liveStrip');
  const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));

  function setLiveFlag(value){
    try{liveApi=!!value}catch{window.liveApi=!!value}
  }

  function setUi(text,kind='checking'){
    const t=textEl(),s=stripEl();
    if(t)t.textContent=text;
    if(s){
      s.classList.toggle('live',kind==='live');
      s.dataset.status=kind;
    }
  }

  function setCounselorStatus(isLive,text=''){
    const el=document.getElementById('counselorStatus');
    if(!el)return;
    el.textContent=isLive?'Canlı • MEB rehberlik kılavuzlu AI':(text||'Canlı bağlantı kontrol ediliyor…');
  }

  function applyStatus(info){
    const isLive=!!info?.live;
    setLiveFlag(isLive);
    if(isLive){
      const model=info?.model||info?.solveModel||'Canlı AI';
      setUi(`Canlı • Skill + ${model}`,'live');
      setCounselorStatus(true);
      const skill=document.getElementById('skillStatus');
      if(skill){
        skill.className='tip blue';
        skill.innerHTML='<b>Canlı mod:</b> YKS Uzman Hoca skill ve resmî kaynak katmanı aktif.';
      }
      return true;
    }
    setUi('Sunucu açık • AI yapılandırması bekleniyor','offline');
    setCounselorStatus(false,'Sunucu açık • AI yapılandırması bekleniyor');
    return false;
  }

  async function probe(){
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),4500);
    try{
      const r=await fetch(`/api/status?ui=${Date.now()}`,{
        cache:'no-store',
        headers:{'Accept':'application/json'},
        signal:controller.signal
      });
      if(!r.ok)throw new Error(`HTTP ${r.status}`);
      return await r.json();
    }finally{clearTimeout(timer)}
  }

  async function robustDetectLive(){
    const token=++runId;
    if(location.protocol==='file:'){
      setLiveFlag(false);
      setUi('Yerel dosya • Canlı AI kapalı','offline');
      setCounselorStatus(false,'Yerel dosya • Canlı AI kapalı');
      return false;
    }
    if(!navigator.onLine){
      setLiveFlag(false);
      setUi('Çevrimdışı • Yerel veriler kullanılabilir','offline');
      setCounselorStatus(false,'Çevrimdışı');
      return false;
    }

    setUi('Canlı bağlantı kontrol ediliyor…','checking');
    setCounselorStatus(false,'Canlı bağlantı kontrol ediliyor…');
    const delays=[0,700,1800];
    for(let i=0;i<delays.length;i++){
      if(delays[i])await wait(delays[i]);
      if(token!==runId)return false;
      try{
        const info=await probe();
        if(token!==runId)return false;
        return applyStatus(info);
      }catch{
        if(i<delays.length-1){
          setUi('Canlı durum yeniden deneniyor…','checking');
          setCounselorStatus(false,'Canlı durum yeniden deneniyor…');
        }
      }
    }

    if(token!==runId)return false;
    setLiveFlag(false);
    setUi('Canlı bağlantı geçici olarak doğrulanamadı • tekrar denenecek','checking');
    setCounselorStatus(false,'Canlı bağlantı yeniden deneniyor…');
    setTimeout(()=>{if(navigator.onLine&&token===runId)void robustDetectLive()},5000);
    return false;
  }

  try{detectLive=robustDetectLive}catch{}
  window.detectLive=robustDetectLive;
  window.refreshLiveStatus=robustDetectLive;
  window.addEventListener('online',()=>void robustDetectLive());
  setTimeout(()=>void robustDetectLive(),60);
})();
