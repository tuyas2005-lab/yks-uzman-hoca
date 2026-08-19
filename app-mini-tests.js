(()=>{
  const root=document.getElementById('tests');
  if(!root||window.__miniTestLegacyRetired)return;
  window.__miniTestLegacyRetired=true;
  state.miniTests??={history:[]};

  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  function historyHtml(){
    const h=(state.miniTests?.history||[]).filter(x=>x.sourceOnly).slice(0,5);
    return h.length?h.map(x=>`<div style="display:grid;grid-template-columns:1fr auto;gap:12px;align-items:center;padding:13px 0;border-bottom:1px solid var(--line)"><div><b>${esc(x.exam&&x.subject?`${x.exam} • ${x.subject}`:(x.title||'Kaynak Seti'))}</b><br><small class="muted">${esc(x.topic||'')} ${x.date?`• ${esc(x.date)}`:''}</small></div><span class="pill ${x.percent>=70?'green':'orange'}">%${Number(x.percent)||0}</span></div>`).join(''):'<div class="muted">Henüz kaynak seti tamamlanmadı.</div>';
  }

  function renderShell(){
    if(typeof window.renderMiniTestHome==='function'&&window.renderMiniTestHome!==renderShell){
      window.renderMiniTestHome();
      return;
    }
    root.innerHTML=`<div class="screen-head"><button class="back" id="mtsShellBack">←</button><h1>Mini Testler</h1></div>
      <div style="padding:18px;border:1px solid #ddd7ff;border-radius:20px;background:linear-gradient(135deg,#f5f2ff,#fff);margin-bottom:14px">
        <h2 style="margin:0 0 6px">📚 Kaynak Kütüphanesinden Çalışma Setleri</h2>
        <p class="muted" style="margin:0;line-height:1.5">AI soru üretmez. Mini Testler yalnız doğrulanmış ÖSYM, MEB, OGM/MEBİ kaynak havuzundan hazırlanır.</p>
      </div>
      <div class="card">
        <h3 style="margin-top:0">🎯 Konu Seçerek Set</h3>
        <p class="muted">Kaynak kataloğu hazırlanıyor. Hazır olduğunda sınav, ders, konu ve soru sayısını buradan seçeceksin.</p>
        <div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-top:14px">
          <label style="display:grid;gap:6px;font-weight:800;font-size:12px">Sınav<select disabled style="height:42px;border:1px solid var(--line);border-radius:11px;padding:0 10px"><option>Hazırlanıyor…</option></select></label>
          <label style="display:grid;gap:6px;font-weight:800;font-size:12px">Ders<select disabled style="height:42px;border:1px solid var(--line);border-radius:11px;padding:0 10px"><option>—</option></select></label>
          <label style="display:grid;gap:6px;font-weight:800;font-size:12px">Konu<select disabled style="height:42px;border:1px solid var(--line);border-radius:11px;padding:0 10px"><option>—</option></select></label>
          <label style="display:grid;gap:6px;font-weight:800;font-size:12px">Soru sayısı<select disabled style="height:42px;border:1px solid var(--line);border-radius:11px;padding:0 10px"><option>5</option></select></label>
        </div>
        <button class="primary full" disabled style="margin-top:12px">Kaynaklar hazırlanıyor…</button>
      </div>
      <div class="card" style="margin-top:14px"><h3 style="margin-top:0">Son Kaynak Setleri</h3>${historyHtml()}</div>`;
    root.querySelector('#mtsShellBack').onclick=()=>go('home');
  }

  window.renderMiniTestShell=renderShell;
  document.addEventListener('click',e=>{if(e.target.closest('[data-go="tests"]'))setTimeout(renderShell,0)},true);
  renderShell();
})();
