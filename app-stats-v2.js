(()=>{
  const root=document.getElementById('stats');if(!root)return;
  const data=()=>window.YKSDataV5;
  const model=()=>data()?.getLearningModel?.()||{events:[],studyEvents:[],topics:[],questionCount:0,measuredCount:0,correct:0,wrong:0,accuracy:null,activeDays:new Set(),sourceCounts:{solve:0,miniTest:0,teacher:0,other:0,trials:0}};
  const trDate=k=>{try{return new Date(k+'T12:00:00').toLocaleDateString('tr-TR',{day:'2-digit',month:'2-digit'})}catch{return k}};
  const sourceCard=(icon,title,value,sub)=>`<div class="stats-source-item"><span class="stats-source-icon">${icon}</span><div><b>${value}</b><strong>${title}</strong><small>${sub}</small></div></div>`;

  const css=document.createElement('style');css.textContent=`
    .stats-v2-note{margin:-2px 0 15px;color:var(--muted);font-size:12px;line-height:1.45}.stats-source-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:14px}.stats-source-item{display:grid;grid-template-columns:42px 1fr;gap:10px;align-items:center;border:1px solid var(--line);border-radius:16px;padding:13px;background:var(--surface)}.stats-source-icon{width:38px;height:38px;border-radius:12px;background:#eeeaff;display:grid;place-items:center;font-size:19px}.stats-source-item b{font-size:23px;display:block}.stats-source-item strong{display:block;font-size:12px;margin-top:1px}.stats-source-item small{display:block;color:var(--muted);font-size:10px;margin-top:2px;line-height:1.3}.stats-week{display:grid;gap:8px;margin-top:12px}.stats-day{display:grid;grid-template-columns:58px 1fr 34px;gap:9px;align-items:center;font-size:12px}.stats-day-bar{height:9px;background:#eeecf5;border-radius:999px;overflow:hidden}.stats-day-bar i{display:block;height:100%;background:linear-gradient(90deg,#6747eb,#5367ff);border-radius:inherit}.stats-measure-note{margin-top:12px;padding:11px 13px;border-radius:13px;background:#f7f6fc;border:1px solid #e9e6f4;font-size:12px;color:var(--muted);line-height:1.45}@media(max-width:900px){.stats-source-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:560px){.stats-source-grid{grid-template-columns:1fr}}
  `;document.head.appendChild(css);

  function last7(m){
    const map=new Map();for(let i=6;i>=0;i--){const x=new Date();x.setHours(12,0,0,0);x.setDate(x.getDate()-i);map.set(x.toLocaleDateString('sv-SE'),0)}
    (m.studyEvents||[]).forEach(x=>{if(map.has(x.dateKey))map.set(x.dateKey,map.get(x.dateKey)+Number(x.questionCount||0))});return[...map.entries()];
  }
  function render(){
    const m=model(),grid=root.querySelector('.stats-grid'),cards=grid?[...grid.querySelectorAll('.stat')]:[];
    if(cards[0]){cards[0].querySelector('b').textContent=m.questionCount;cards[0].querySelector('small').textContent='Çalışılan soru'}
    if(cards[1]){cards[1].querySelector('b').textContent=m.accuracy===null?'—':`${m.accuracy}%`;cards[1].querySelector('small').textContent='Ölçümlü doğruluk'}
    if(cards[2]){cards[2].querySelector('b').textContent=m.wrong;cards[2].querySelector('small').textContent='Ölçümlü yanlış'}
    if(cards[3]){cards[3].querySelector('b').textContent=m.activeDays?.size||0;cards[3].querySelector('small').textContent='Aktif gün'}
    let note=root.querySelector('.stats-v2-note');if(!note&&grid){note=document.createElement('div');note.className='stats-v2-note';grid.insertAdjacentElement('beforebegin',note)}if(note)note.textContent='V5 StudyEvent defteri tüm gerçek çalışma kaynaklarını tek yerde toplar. Doğruluk yalnız doğru/yanlış sonucu bilinen sorulardan hesaplanır; “Yapamadım” sinyali önceliklendirmeyi etkiler ama başarı yüzdesini bozmaz.';

    let source=root.querySelector('.stats-source-card');if(!source&&grid){source=document.createElement('div');source.className='card stats-source-card';grid.insertAdjacentElement('afterend',source)}
    if(source){const c=m.sourceCounts||{};source.innerHTML=`<div class="section-title" style="margin-top:0"><h2>Çalışma Kaynakları</h2><span class="muted">V5 tek veri modeli</span></div><div class="stats-source-grid">${sourceCard('📷','Soru Çöz',c.solve||0,'Fotoğraf + yazılı sorular')}${sourceCard('🧪','Mini Test',c.miniTest||0,'Doğru/yanlış ölçümlü test soruları')}${sourceCard('📚','Konu Testi',c.topicTest||0,'Dış kaynak toplu test soruları')}${sourceCard('🧠','Öğretmen Kontrolü',c.teacher||0,'Kişisel Öğretmen ölçümleri')}${sourceCard('🧭','Deneme',c.trials||0,'YKS Koçu deneme kayıtları')}</div>${c.other?`<div class="stats-measure-note">Diğer çalışma kayıtları: ${c.other} soru. Eski sürümden taşınan aktiviteler burada korunur.</div>`:''}`}

    let week=root.querySelector('.stats-week-card'),dash=root.querySelector('.dash-grid');if(!week&&dash){week=document.createElement('div');week.className='card stats-week-card';dash.insertAdjacentElement('beforebegin',week)}
    if(week){const rows=last7(m),mx=Math.max(1,...rows.map(x=>x[1]));week.innerHTML=`<div class="section-title" style="margin-top:0"><h2>Son 7 Gün</h2><span class="muted">Gerçek soru adedi</span></div><div class="stats-week">${rows.map(([k,v])=>`<div class="stats-day"><span>${trDate(k)}</span><div class="stats-day-bar"><i style="width:${v?Math.max(5,Math.round(v/mx*100)):0}%"></i></div><b>${v}</b></div>`).join('')}</div>`}

    const box=document.getElementById('statsTopics');if(box)box.innerHTML=m.topics?.length?m.topics.map(t=>`<div class="weak-row"><span>${esc(`${t.exam} ${t.subject} • ${t.topic}`)}<small class="weak-evidence">${t.total} ölçüm • ${t.recentSignals||0} zorlanma sinyali • ${t.confidence}</small></span><div class="bar ${t.score!==null&&t.score<60?'warning':''}"><i style="width:${t.score===null?5:Math.max(3,t.score)}%"></i></div><b>${t.score===null?'—':`%${t.score}`}</b></div>`).join(''):'<div class="home-empty">Konu performansı için henüz yeterli StudyEvent yok.</div>';
    const comment=document.getElementById('statsComment');if(comment){const measured=(m.topics||[]).filter(x=>x.score!==null),weak=[...measured].sort((a,b)=>a.score-b.score||b.recentSignals-a.recentSignals)[0],strong=[...measured].sort((a,b)=>b.score-a.score)[0];let txt=`Toplam <b>${m.questionCount}</b> soru çalışıldı.`;txt+=m.measuredCount?` Ölçümlü <b>${m.measuredCount}</b> soruda doğruluk <b>%${m.accuracy}</b>.`:' Henüz doğru/yanlış sonucu ölçülen yeterli soru yok.';if(strong)txt+=` En güçlü ölçülen alan <b>${esc(strong.topic)}</b> (%${strong.score}).`;if(weak)txt+=` En fazla gelişim fırsatı <b>${esc(weak.topic)}</b> (%${weak.score}).`;comment.innerHTML=txt}
  }
  window.renderStats=render;try{renderStats=render}catch{};if(root.classList.contains('active'))render();
})();
