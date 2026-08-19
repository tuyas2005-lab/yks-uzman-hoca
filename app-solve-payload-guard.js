(()=>{
  const TARGET_CHARS=650000;
  const HARD_LIMIT_CHARS=850000;

  function loadDataImage(data){
    return new Promise((resolve,reject)=>{
      const img=new Image();
      img.onload=()=>resolve(img);
      img.onerror=()=>reject(new Error('Fotoğraf çözüme hazırlanamadı. Lütfen tekrar çek.'));
      img.src=data;
    });
  }

  async function shrinkForSolve(data){
    data=String(data||'');
    if(!data||!data.startsWith('data:image/'))return data;
    if(data.length<=TARGET_CHARS)return data;

    const img=await loadDataImage(data);
    const iw=img.naturalWidth||img.width||1;
    const ih=img.naturalHeight||img.height||1;
    let maxEdge=Math.min(1450,Math.max(iw,ih));
    let quality=.82;
    let out=data;

    for(let i=0;i<7;i++){
      const scale=Math.min(1,maxEdge/Math.max(iw,ih));
      const w=Math.max(1,Math.round(iw*scale));
      const h=Math.max(1,Math.round(ih*scale));
      const canvas=document.createElement('canvas');
      canvas.width=w;canvas.height=h;
      const ctx=canvas.getContext('2d',{alpha:false});
      if(!ctx)throw new Error('Fotoğraf işlenemedi.');
      ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);ctx.drawImage(img,0,0,w,h);
      out=canvas.toDataURL('image/jpeg',quality);
      if(out.length<=TARGET_CHARS)return out;
      maxEdge=Math.max(900,Math.round(maxEdge*.84));
      quality=Math.max(.58,quality-.06);
    }

    if(out.length>HARD_LIMIT_CHARS)throw new Error('Fotoğraf hâlâ çok büyük. Soruyu biraz daha yakından çekip tekrar dene.');
    return out;
  }

  function installGuard(){
    const original=window.liveSolve;
    if(typeof original!=='function'||original.__yksPayloadGuard)return false;
    const guarded=async function(args={}){
      const next={...args};
      if(next.image)next.image=await shrinkForSolve(next.image);
      return original(next);
    };
    guarded.__yksPayloadGuard=true;
    guarded.__yksOriginal=original;
    window.liveSolve=guarded;
    return true;
  }

  if(!installGuard()){
    let tries=0;
    const timer=setInterval(()=>{
      tries++;
      if(installGuard()||tries>80)clearInterval(timer);
    },100);
  }
})();