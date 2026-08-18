(()=>{
  const root=document.getElementById('teacher');
  if(!root)return;

  const css=document.createElement('style');
  css.textContent=`
    .pt-perf-head{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:13px}.pt-perf-head h2{margin:0}.pt-perf-score{font-size:12px;font-weight:850;padding:6px 10px;border-radius:999px;background:#eeeaff;color:#5943d4}.pt-perf-score.good{background:#e5f6ec;color:#147848}.pt-perf-score.bad{background:#fff0f1;color:#bb3040}
    .pt-perf-list{display:grid;gap:8px}.pt-perf-row{display:grid;grid-template-columns:36px 1fr;gap:10px;align-items:center;border:1px solid var(--line);border-radius:13px;padding:9px 11px;background:var(--surface)}.pt-perf-row.ok{border-color:#c7ead5;background:#f8fdf9}.pt-perf-row.bad{border-color:#ffd0d4;background:#fff9f9}.pt-perf-mark{width:30px;height:30px;border-radius:9px;display:grid;place-items:center;font-weight:900;background:#f1eff8}.pt-perf-row.ok .pt-perf-mark{background:#dff5e8;color:#147848}.pt-perf-row.bad .pt-perf-mark{background:#ffe6e8;color:#bd3342}.pt-perf-row b{display:block;font-size:13px}.pt-perf-row small{display:block;color:var(--muted);font-size:11px;margin-top:2px}
    .pt-perf-summary{margin-top:12px;padding:12px 13px;border-radius:14px;background:#f7f6fc;border:1px solid #e9e6f4}.pt-perf-summary b{display:block;margin-bottom:4px}.pt-perf-summary span{font-size:12px;color:var(--muted);line-height:1.45}.pt-perf-source{font-size:11px;color:var(--muted);margin:11px 2px 0;line-height:1.45}.pt-perf-empty{padding:18px;border:1px dashed var(--line);border-radius:14px;text-align:center;color:var(--muted)}
    @media(max-width:700px){.pt-perf-head{align-items:flex-start}.pt-perf-row{grid-template-columns:34px 1fr}}
  `;
  document.head.appendChild(css);

  function timeNow(){return new Date().toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'})}
  function wrapSessionPush(){
    const arr=state.sessions;if(!Array.isArray(arr)||arr.__yksTimePush)return;
    const base=Array.prototype.push;
    Object.defineProperty(arr,'push',{configurable:true,writable:true,enumerable:false,value:function(...items){
      const baseTs=Date.now();
      items.forEach((x,i)=>{if(x&&x.source==='mini-test'){if(!x.time)x.time=timeNow();if(!x.createdAt)x.createdAt=baseTs+i}});
      return base.apply(this,items);
    }});
    Object.defineProperty(arr,'__yksTimePush',{value:true,configurable:true,enumerable:false});
  }

  function sourceLabel(x){
    if(x?.source==='mini-test')return'Mini Test';
    if(x?.source==='teacher-check')return'Kişisel Öğretmen';
    return'Ölçüm';
  }
  function displayTime(x){
    if(x?.time)return String(x.time);
    if(Number(x?.createdAt)){try{return new Date(Number(x.createdAt)).toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'})}catch{}}
    return'';
  }
  function commentFor(rows,pct){
    if(rows.length<3)return'Veri henüz az. Bir 5 soruluk Mini Test daha çözülürse öğretmenin daha güvenilir yönlendirme yapabilir.';
    if(pct>=80)return'Konu iyi gidiyor. Yeni yüklenmek yerine kısa aralıklı tekrar yeterli.';
    if(pct>=60)return'Temel oluşmuş. Bir kısa tekrar ve 5 soruluk pekiştirme testi konuyu sağlamlaştırır.';
    return'Bu konu tekrar istiyor. 5 dakikalık hızlı tekrarın ardından 5 soruluk Mini Test öneriyorum.';
  }

  function decorate(){
    wrapSessionPush();
    const topic=root.querySelector('.pt-focus-main h1')?.textContent?.trim();if(!topic)return;
    const h=[...root.querySelectorAll('.card h2')].find(x=>x.textContent.trim()==='Bu Konudaki Son Performans');if(!h)return;
    const card=h.closest('.card');if(!card)return;
    const rows=(state.sessions||[]).filter(x=>x?.topic===topic&&typeof x.correct==='boolean').slice(-5).reverse();
    if(!rows.length){
      card.innerHTML=`<div class="pt-perf-head"><h2>Bu Konudaki Son Performans</h2><span class="muted">Son 5 ölçüm</span></div><div class="pt-perf-empty">Bu konuda henüz ölçülmüş soru yok. Mini Test tamamlandığında doğru/yanlış sonuçları burada görünür.</div><p class="pt-perf-source">Ölçüm kaynağı: doğru/yanlış sonucu bilinen Mini Testler. Normal Soru Çöz kayıtları başarı yüzdesine katılmaz.</p>`;
      return;
    }
    const correct=rows.filter(x=>x.correct).length,pct=Math.round(correct/rows.length*100),cls=pct>=70?'good':pct<50?'bad':'';
    card.innerHTML=`<div class="pt-perf-head"><h2>Bu Konudaki Son Performans</h2><span class="pt-perf-score ${cls}">%${pct} başarı</span></div>
      <div class="pt-perf-list">${rows.map(x=>{const tm=displayTime(x);return`<div class="pt-perf-row ${x.correct?'ok':'bad'}"><span class="pt-perf-mark">${x.correct?'✓':'✕'}</span><div><b>${esc(sourceLabel(x))}</b><small>${esc(x.date||'Tarih yok')}${tm?` • ${esc(tm)}`:''}</small></div></div>`}).join('')}</div>
      <div class="pt-perf-summary"><b>Son ${rows.length} ölçüm: ${correct} doğru • ${rows.length-correct} yanlış</b><span>${esc(commentFor(rows,pct))}</span></div>
      <p class="pt-perf-source">Ölçüm kaynağı: doğru/yanlış sonucu bilinen Mini Testler. Normal Soru Çöz kayıtları başarı yüzdesine katılmaz.</p>`;
  }

  if(typeof window.renderTeacher==='function'&&!window.renderTeacher.__performanceWrapped){
    const base=window.renderTeacher;
    const wrapped=function(...args){const r=base.apply(this,args);setTimeout(decorate,0);return r};
    wrapped.__performanceWrapped=true;window.renderTeacher=wrapped;try{renderTeacher=wrapped}catch{}
  }
  root.addEventListener('click',e=>{if(e.target.closest('[data-pt-topic]'))setTimeout(decorate,0)},true);
  wrapSessionPush();setTimeout(decorate,50);
})();
