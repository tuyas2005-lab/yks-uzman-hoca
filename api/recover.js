export default function handler(req,res){
  if(req.method!=="GET") return res.status(405).send("Method not allowed");

  res.setHeader("Content-Type","text/html; charset=utf-8");
  res.setHeader("Cache-Control","no-store, no-cache, must-revalidate, max-age=0");
  res.setHeader("Pragma","no-cache");
  res.setHeader("Expires","0");
  res.setHeader("Clear-Site-Data",'"cache"');

  return res.status(200).send(`<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>YKS Uzman Hoca — Güncelleme</title>
<style>
body{font-family:system-ui,-apple-system,sans-serif;background:#f6f7fb;color:#111827;margin:0;display:grid;place-items:center;min-height:100vh;padding:24px;box-sizing:border-box}
.card{max-width:560px;background:white;border:1px solid #e5e7eb;border-radius:20px;padding:26px;box-shadow:0 16px 45px rgba(17,24,39,.08);text-align:center}
h1{font-size:24px;margin:0 0 10px}.muted{color:#667085;line-height:1.5}.ok{color:#047857;font-weight:800}.err{color:#b42318;font-weight:700}
</style>
</head>
<body>
<div class="card">
  <h1>YKS Uzman Hoca güncelleniyor</h1>
  <p id="msg" class="muted">Eski uygulama önbelleği güvenli şekilde temizleniyor. Çalışma verilerin silinmez.</p>
</div>
<script>
(async()=>{
  const msg=document.getElementById('msg');
  try{
    if('serviceWorker' in navigator){
      const regs=await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r=>r.unregister()));
    }
    if('caches' in window){
      const keys=await caches.keys();
      await Promise.all(keys.filter(k=>k.indexOf('yks-uzman-hoca-')===0).map(k=>caches.delete(k)));
    }
    msg.className='ok';
    msg.textContent='Güncelleme tamamlandı. Uygulama yeniden açılıyor…';
    setTimeout(()=>location.replace('/?recovered='+Date.now()),900);
  }catch(e){
    msg.className='err';
    msg.textContent='Otomatik güncelleme tamamlanamadı. Sayfayı bir kez yenileyip tekrar deneyin.';
  }
})();
</script>
</body>
</html>`);
}
