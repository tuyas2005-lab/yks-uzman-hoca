(()=>{
  const root=document.getElementById('stats');
  if(!root)return;

  const norm=s=>String(s||'').toLocaleLowerCase('tr-TR').replace(/[^a-z0-9çğıöşü]+/g,' ').trim();
  const dateKey=v=>{
    const s=String(v||'');
    if(/^\d{4}-\d{2}-\d{2}$/.test(s))return s;
    const m=s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
    return m?`${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`:'';
  };
  const todayKey=()=>new Date().toLocaleDateString('sv-SE');
  const trDate=k=>{try{return new Date(k+'T12:00:00').toLocaleDateString('tr-TR',{day:'2-digit',month:'2-digit'})}catch{return k}};

  function activityRelevant(x){
    const track=window.getYksTrack?.();
    const policy=window.getYksTrackPolicy?.();
    if(!track||!policy)return true;
    const subject=String(x?.subject||'').trim();
    if(!/^AYT\b/i.test(subject))return true;
    const s=norm(subject).replace(/^ayt\s+/,'');
    return (policy.allowedSubjects||[]).some(a=>s===norm(a)||s.includes(norm(a))||norm(a).includes(s));
  }

  function data(){
    const measured=(state.sessions||[]).filter(x=>typeof x?.correct==='boolean');
    const activities=(state.activityLog||[]).filter(activityRelevant);
    const solves=activities.filter(x=>x.type==='question-solve'||['question-solve','photo-question','text-question'].includes(x.source));
    const solveCount=solves.reduce((a,x)=>a+Number(x.count||1),0);
    const photoCount=solves.filter(x=>x.source==='photo-question').reduce((a,x)=>a+Number(x.count||1),0);
    const textCount=solves.filter(x=>x.source==='text-question').reduce((a,x)=>a+Number(x.count||1),0);
    const legacySolve=Math.max(0,solveCount-photoCount-textCount);
    const mini=measured.filter(x=>x.source==='mini-test');
    const teacher=measured.filter(x=>x.source==='teacher-check');
    const otherMeasured=measured.filter(x=>!['mini-test','teacher-check'].includes(x.source));
    const measuredCount=measured.length;
    const correct=measured.filter(x=>x.correct).length;
    const wrong=measuredCount-correct;
    const accuracy=measuredCount?Math.round(correct/measuredCount*100):0;
    const total=solveCount+measuredCount;
    const trials=(state.trials||[]).length;
    const days=new Set([
      ...measured.map(x=>dateKey(x.date)),
      ...activities.map(x=>x.dateKey||dateKey(x.date))
    ].filter(Boolean));
    return{measured,activities,solves,solveCount,photoCount,textCount,legacySolve,mini,teacher,otherMeasured,measuredCount,correct,wrong,accuracy,total,trials,days};
  }

  function last7(d){
    const map=new Map();
    for(let i=6;i>=0;i--){const x=new Date();x.setHours(12,0,0,0);x.setDate(x.getDate()-i);const k=x.toLocaleDateString('sv-SE');map.set(k,0)}
    d.measured.forEach(x=>{const k=dateKey(x.date);if(map.has(k))map.set(k,map.get(k)+1)});
    d.activities.forEach(x=>{const k=x.dateKey||dateKey(x.date);if(map.has(k))map.set(k,map.get(k)+Number(x.count||1))});
    return [...map.entries()];
  }

  function sourceCard(icon,title,value,sub){return `<div class="stats-source-item"><span class="stats-source-icon">${icon}</span><div><b>${value}</b><strong>${title}</strong><small>${sub}</small></div></div>`}

  const css=document.createElement('style');
  css.textContent=`
    .stats-v2-note{margin:-2px 0 15px;color:var(--muted);font-size:12px;line-height:1.45}
    .stats-source-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:14px}.stats-source-item{display:grid;grid-template-columns:42px 1fr;gap:10px;align-items:center;border:1px solid var(--line);border-radius:16px;padding:13px;background:var(--surface)}.stats-source-icon{width:38px;height:38px;border-radius:12px;background:#eeeaff;display:grid;place-items:center;font-size:19px}.stats-source-item b{font-size:23px;display:block}.stats-source-item strong{display:block;font-size:12px;margin-top:1px}.stats-source-item small{display:block;color:var(--muted);font-size:10px;margin-top:2px;line-height:1.3}
    .stats-week{display:grid;gap:8px;margin-top:12px}.stats-day{display:grid;grid-template-columns:58px 1fr 34px;gap:9px;align-items:center;font-size:12px}.stats-day-bar{height:9px;background:#eeecf5;border-radius:999px;overflow:hidden}.stats-day-bar i{display:block;height:100%;background:linear-gradient(90deg,#6747eb,#5367ff);border-radius:inherit}.stats-measure-note{margin-top:12px;padding:11px 13px;border-radius:13px;background:#f7f6fc;border:1px solid #e9e6f4;font-size:12px;color:var(--muted);line-height:1.45}
    @media(max-width:900px){.stats-source-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:560px){.stats-source-grid{grid-template-columns:1fr}}
  `;
  document.head.appendChild(css);

  function render(){
    const d=data();
    const grid=root.querySelector('.stats-grid');
    const cards=grid?[...grid.querySelectorAll('.stat')]:[];
    if(cards[0]){cards[0].querySelector('b').textContent=d.total;cards[0].querySelector('small').textContent='Çalışılan soru'}
    if(cards[1]){cards[1].querySelector('b').textContent=d.measuredCount?`${d.accuracy}%`:'—';cards[1].querySelector('small').textContent='Ölçümlü doğruluk'}
    if(cards[2]){cards[2].querySelector('b').textContent=d.wrong;cards[2].querySelector('small').textContent='Ölçümlü yanlış'}
    if(cards[3]){cards[3].querySelector('b').textContent=d.days.size;cards[3].querySelector('small').textContent='Aktif gün'}

    let note=root.querySelector('.stats-v2-note');
    if(!note&&grid){note=document.createElement('div');note.className='stats-v2-note';grid.insertAdjacentElement('beforebegin',note)}
    if(note)note.textContent='Toplam çalışma; fotoğraflı/yazılı Soru Çöz + Mini Test ve doğru/yanlış sonucu bilinen ölçüm sorularından oluşur. Doğruluk yüzdesi yalnız sonucu ölçülen sorulardan hesaplanır.';

    let source=root.querySelector('.stats-source-card');
    if(!source&&grid){source=document.createElement('div');source.className='card stats-source-card';grid.insertAdjacentElement('afterend',source)}
    if(source){
      const solveSub=d.photoCount||d.textCount?`${d.photoCount} fotoğraf • ${d.textCount} yazılı${d.legacySolve?` • ${d.legacySolve} eski`:''}`:'Fotoğraf + yazılı sorular';
      source.innerHTML=`<div class="section-title" style="margin-top:0"><h2>Çalışma Kaynakları</h2><span class="muted">Gerçek kayıtlar</span></div><div class="stats-source-grid">
        ${sourceCard('📷','Soru Çöz',d.solveCount,solveSub)}
        ${sourceCard('🧪','Mini Test',d.mini.length,`${state.miniTests?.history?.length||0} tamamlanan test`)}
        ${sourceCard('🧠','Öğretmen Kontrolü',d.teacher.length,'Doğru/yanlış ölçülen kontrol soruları')}
        ${sourceCard('🧭','Deneme',d.trials,'YKS Koçu deneme kayıtları')}
      </div>${d.legacySolve?'<div class="stats-measure-note">Önceki Soru Çöz kayıtlarında fotoğraf/yazı ayrımı tutulmadığı için bunlar yalnız Soru Çöz toplamında görünür. Yeni sorular bundan sonra ayrı etiketlenir.</div>':''}`;
    }

    let week=root.querySelector('.stats-week-card');
    const dash=root.querySelector('.dash-grid');
    if(!week&&dash){week=document.createElement('div');week.className='card stats-week-card';dash.insertAdjacentElement('beforebegin',week)}
    if(week){const rows=last7(d),mx=Math.max(1,...rows.map(x=>x[1]));week.innerHTML=`<div class="section-title" style="margin-top:0"><h2>Son 7 Gün</h2><span class="muted">Soru adedi</span></div><div class="stats-week">${rows.map(([k,v])=>`<div class="stats-day"><span>${trDate(k)}</span><div class="stats-day-bar"><i style="width:${v?Math.max(5,Math.round(v/mx*100)):0}%"></i></div><b>${v}</b></div>`).join('')}</div>`}

    const s=window.refreshLearningModel?.()||{metrics:[]};
    const box=document.getElementById('statsTopics');
    if(box)box.innerHTML=s.metrics?.length?s.metrics.map(m=>`<div class="weak-row"><span>${esc(m.topic)}<small class="weak-evidence">${m.total} ölçülen soru</small></span><div class="bar ${m.score<60?'warning':''}"><i style="width:${Math.max(3,m.score)}%"></i></div><b>%${m.score}</b></div>`).join(''):'<div class="home-empty">Konu performansı için önce Mini Test gibi doğru/yanlış sonucu ölçülen sorular gerekli.</div>';
    const comment=document.getElementById('statsComment');
    if(comment){
      const weak=s.metrics?.[0],strong=[...(s.metrics||[])].sort((a,b)=>b.score-a.score)[0];
      let txt=`Toplam <b>${d.total}</b> soru çalışıldı: <b>${d.solveCount}</b> Soru Çöz, <b>${d.mini.length}</b> Mini Test sorusu`;
      if(d.teacher.length)txt+=`, <b>${d.teacher.length}</b> öğretmen kontrolü`;
      txt+='.';
      if(d.measuredCount)txt+=` Ölçümlü ${d.measuredCount} soruda doğruluk <b>%${d.accuracy}</b>.`;
      else txt+=' Henüz doğru/yanlış sonucu ölçülen yeterli soru yok.';
      if(strong)txt+=` En güçlü ölçülen konu <b>${esc(strong.topic)}</b> (%${strong.score}).`;
      if(weak)txt+=` Öncelikli gelişim alanı <b>${esc(weak.topic)}</b> (%${weak.score}).`;
      comment.innerHTML=txt;
    }
  }

  function tagSolveMode(){
    if(window.__statsSolveModeWrapped)return;
    if(typeof liveSolve!=='function'){setTimeout(tagSolveMode,120);return}
    const base=liveSolve;
    liveSolve=async args=>{
      const before=(state.activityLog||[]).length;
      const ok=await base(args);
      if(ok){
        const added=(state.activityLog||[]).slice(before).filter(x=>x?.type==='question-solve'||x?.source==='question-solve');
        const mode=args?.image?'photo-question':args?.text?'text-question':'question-solve';
        added.forEach(x=>{x.source=mode;x.mode=mode==='photo-question'?'photo':mode==='text-question'?'text':''});
        if(added.length)save();
      }
      return ok;
    };
    window.liveSolve=liveSolve;window.__statsSolveModeWrapped=true;
  }

  window.renderStats=render;try{renderStats=render}catch{}
  if(typeof go==='function'&&!window.__statsGoWrapped){const base=go;go=function(id){const r=base(id);if(id==='stats')setTimeout(render,0);return r};window.go=go;window.__statsGoWrapped=true}
  tagSolveMode();
  if(root.classList.contains('active'))render();
})();
