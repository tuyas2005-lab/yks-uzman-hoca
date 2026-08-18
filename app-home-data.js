(()=>{
  const start=()=>{

  const data=()=>window.YKSDataV5;
  const model=()=>data()?.getLearningModel?.()||{topics:[],metrics:[],todayCount:0,questionCount:0};
  const todayKey=()=>data()?.todayKey?.()||new Date().toLocaleDateString('sv-SE');
  const norm=s=>data()?.norm?.(s)||String(s||'').toLocaleLowerCase('tr-TR').trim();

  function priorityRows(m=model()){
    return (m.topics||[]).map(t=>{
      const base=t.score===null?(t.recentSignals?55:85):t.score;
      const need=(100-base)+(t.recentWrong||0)*8+(t.recentSignals||0)*10+Math.min(10,t.staleDays||0)-(t.todayCount>=5?24:0);
      return{...t,priorityIndex:need};
    }).sort((a,b)=>b.priorityIndex-a.priorityIndex||b.total-a.total||a.topic.localeCompare(b.topic,'tr'));
  }
  function snapshot(){const m=model(),metrics=priorityRows(m);return{...m,metrics,topics:metrics,coachWeak:null}}
  function refreshLearningModel(){
    const s=snapshot();
    const legacy={};for(const x of s.metrics){if(x.score===null)continue;if(!(x.topic in legacy)||x.score<legacy[x.topic])legacy[x.topic]=x.score}
    state.topicMastery=legacy;return s;
  }
  window.getLearningSnapshot=snapshot;window.refreshLearningModel=refreshLearningModel;

  const topicFn=()=>refreshLearningModel().metrics.filter(x=>x.score!==null).map(x=>[x.topic,x.score]);window.topicEntries=topicFn;try{topicEntries=topicFn}catch{}

  function todaySolved(){return Number(model().todayCount||0)}
  function recordStudyActivity(a={}){
    const x=data();if(!x)return null;
    const subject=String(a.subject||'');const exam=/^\s*AYT\b/i.test(subject)?'AYT':'TYT';
    const e=x.record({source:a.source||a.type||'study',exam,subject:subject.replace(/^\s*(TYT|AYT)\s+/i,'')||'Genel',topic:a.topic||'',curriculumOutcome:a.curriculumOutcome||a.curriculum_outcome||'',result:typeof a.correct==='boolean'?(a.correct?'correct':'wrong'):'unknown',difficulty:a.difficulty||'',interaction:a.interaction||'studied',questionCount:Number(a.count||1),signals:a.signals||[]});
    state.todayCount=todaySolved();try{renderHome()}catch{};return e;
  }
  window.recordStudyActivity=recordStudyActivity;

  function currentFocus(s){
    try{const f=window.getStudentStrategy?.()?.focus?.primary;if(f)return f}catch{}
    return s.metrics?.[0]||null;
  }
  function dailyTasks(s){
    const focus=currentFocus(s),k=todayKey(),teacherDaily=state.teacher?.daily;
    const recentWrong=(s.events||[]).filter(x=>x.result==='wrong').slice(-12).length;
    if(!focus){
      return[
        {id:'measure',title:'5 soruluk seviye ölçümü',desc:'Kişisel Öğretmen için gerçek konu verisi oluştur',done:false,go:'tests'},
        {id:'solve',title:'1 soru çöz ve çalışma kaydı oluştur',desc:'Fotoğraf veya metinle soru çöz',done:todaySolved()>0,go:'upload'}
      ];
    }
    const testedToday=(focus.events||[]).filter(x=>x.source==='mini-test'&&x.dateKey===k).reduce((a,x)=>a+Number(x.questionCount||1),0)>=5;
    const diagnostic=focus.total<3;
    return[
      diagnostic
        ?{id:'test:'+focus.topic,title:`5 soru seviye ölçümü • ${focus.topic}`,desc:'Veri az; önce seviyeyi ölç',done:testedToday,go:'tests',topic:focus.topic,subject:`${focus.exam} ${focus.subject}`}
        :{id:'recap:'+focus.topic,title:`5 dk hızlı tekrar • ${focus.topic}`,desc:'Kişisel Öğretmen önerisi',done:teacherDaily?.date===k&&teacherDaily?.topic===focus.topic&&!!teacherDaily?.recapDone,go:'teacher',topic:focus.topic,subject:`${focus.exam} ${focus.subject}`},
      diagnostic
        ?{id:'recap:'+focus.topic,title:`Sonuca göre hızlı tekrar • ${focus.topic}`,desc:'Ölçümden sonra yalnız eksik noktaya dön',done:teacherDaily?.date===k&&teacherDaily?.topic===focus.topic&&!!teacherDaily?.recapDone,go:'teacher',topic:focus.topic,subject:`${focus.exam} ${focus.subject}`}
        :{id:'test:'+focus.topic,title:`5 soru mini test • ${focus.topic}`,desc:'Başarı yüzdesini güncelle',done:testedToday,go:'tests',topic:focus.topic,subject:`${focus.exam} ${focus.subject}`},
      {id:'wrong',title:recentWrong?`Son yanlışlarını tekrar et • ${Math.min(3,recentWrong)} öncelik`:'Yanlışlarını kontrol et',desc:'Hatalı kazanımları kapat',done:teacherDaily?.date===k&&!!teacherDaily?.wrongOpened,go:'wrong'}
    ];
  }

  const css=document.createElement('style');css.textContent=`.home-source,.home-owner{font-size:11px;color:var(--muted);margin-top:7px}.home-owner{margin:-3px 0 11px}.weak-evidence{display:block;font-size:11px;color:var(--muted);margin-top:2px}.weak-owner-chip{font-size:10px;padding:2px 6px;border-radius:999px;background:#eeeaff;color:#5a42d3;margin-left:5px}.home-plan-action{margin-left:auto;min-width:64px}.home-empty{padding:18px;border:1px dashed var(--line);border-radius:14px;color:var(--muted);text-align:center}`;document.head.appendChild(css);

  function homeRender(){
    const s=refreshLearningModel(),p=state.profile||{},done=todaySolved(),left=Math.max(0,Number(p.goal||0)-done);state.todayCount=done;
    const hello=document.getElementById('hello');if(hello)hello.textContent=`Merhaba ${p.name||'Öğrenci'}! 👋`;const av=document.querySelector('.avatar');if(av)av.textContent=(p.name||'Ö')[0].toUpperCase();
    if(window.goalText)goalText.textContent=`${done} / ${p.goal||0} soru tamamlandı`;if(window.goalBar)goalBar.style.width=`${p.goal?Math.min(100,done/p.goal*100):0}%`;if(window.goalMotivation)goalMotivation.textContent=left?`Sadece ${left} soru kaldı 💪`:'🎉 Bugünkü hedef tamam!';
    const focus=currentFocus(s);
    if(window.teacherTip){
      if(focus){const evidence=focus.total?`${focus.total} ölçümde ${focus.score===null?'başarı henüz oluşmadı':`başarı %${focus.score}`}`:'henüz doğru/yanlış ölçümü yok';const signal=focus.recentSignals?` Son 7 günde ${focus.recentSignals} zorlanma sinyali var.`:'';teacherTip.textContent=`${focus.topic}: ${evidence}.${signal} ${focus.total<3?'Önce 5 soruluk seviye ölçümü öneriyorum.':'Kısa tekrar + 5 soru öneriyorum.'}`}
      else teacherTip.textContent='Henüz yeterli konu verisi yok. Bir Mini Test veya soru çözümüyle çalışma modelini başlatalım.';
    }
    const w=document.getElementById('weakList');if(w){w.innerHTML=s.metrics.length?s.metrics.slice(0,4).map(m=>`<div class="weak-row"><span><b>${esc(m.topic)}</b>${m.recentSignals?'<span class="weak-owner-chip">Zorlanma sinyali</span>':''}<small class="weak-evidence">${m.total} ölçüm • ${m.correct} doğru • ${m.wrong} yanlış • ${m.confidence}${m.recentSignals?` • ${m.recentSignals} sinyal`:''}</small></span><div class="bar ${m.score!==null&&m.score<60?'warning':''}"><i style="width:${m.score===null?5:Math.max(3,m.score)}%"></i></div><b>${m.score===null?'—':`%${m.score}`}</b></div>`).join(''):`<div class="home-empty">Henüz ölçülmüş konu yok. Mini Test veya soru çözümündeki geri bildirimlerle otomatik oluşacak.</div>`}
    const card=w?.closest('.card');if(card){let owner=card.querySelector('.home-owner');if(!owner){owner=document.createElement('div');owner.className='home-owner';card.querySelector('.section-title')?.insertAdjacentElement('afterend',owner)}owner.textContent='Tek veri kaynağı: V5 Öğrenme Modeli • Mini Test + Soru Çöz sinyalleri + Koç stratejisi'}
    const tasks=dailyTasks(s);state.plan=tasks.map(x=>({title:x.title,desc:x.desc,done:x.done}));const plan=document.getElementById('dailyPlan');if(plan){plan.innerHTML=tasks.map((x,i)=>`<div class="plan-item ${x.done?'done':''}" data-home-task="${i}"><div class="check">${x.done?'✓':i+1}</div><div><strong>${esc(x.title)}</strong><small>${esc(x.desc)}</small></div><span class="pill ${x.done?'green':'orange'}">${x.done?'Tamam':'Başla'}</span></div>`).join('');plan.querySelectorAll('[data-home-task]').forEach(el=>el.onclick=()=>{const x=tasks[Number(el.dataset.homeTask)];if(x.topic){state.teacher??={};state.teacher.selectedTopic=x.topic;if(x.go==='tests'){state.miniTests??={history:[]};state.miniTests.prefillSubject=x.subject||'';state.miniTests.prefillTopic=x.topic}}save();go(x.go)})}
    const badge=document.querySelector('#dailyPlan')?.closest('.card')?.querySelector('.section-title .pill');if(badge)badge.textContent=`${tasks.length} görev`;
    const quickMini=[...document.querySelectorAll('#home .quick')].find(b=>b.dataset.go==='tests');if(quickMini){const sm=quickMini.querySelector('small');if(sm)sm.textContent=focus?`${focus.topic} • 5 soru`:'Seviyeni ölç • 5 soru'}
    const goal=document.querySelector('#home .goal-card');if(goal){let src=goal.querySelector('.home-source');if(!src){src=document.createElement('div');src.className='home-source';goal.querySelector('div[style]')?.appendChild(src)}src.textContent='Hedef: Ayarlar • Sayım: V5 StudyEvent defterindeki gerçek çalışma soruları'}
    document.querySelectorAll('#home .subject').forEach(btn=>{btn.onclick=()=>{state.miniTests??={history:[]};state.miniTests.prefillSubject=btn.textContent.trim();save();go('tests')}});
  }
  window.renderHome=homeRender;try{renderHome=homeRender}catch{}

  function topicsRender(){
    const s=refreshLearningModel(),box=document.getElementById('topicRows');if(!box)return;box.innerHTML=s.metrics.length?s.metrics.map(m=>`<div class="weak-row"><span><b>${esc(`${m.exam} ${m.subject} • ${m.topic}`)}</b><small class="weak-evidence">${m.total} ölçüm • ${m.correct} doğru • ${m.wrong} yanlış • ${m.confidence}${m.recentSignals?` • ${m.recentSignals} zorlanma sinyali`:''}</small></span><div class="bar ${m.score!==null&&m.score<60?'warning':''}"><i style="width:${m.score===null?5:Math.max(3,m.score)}%"></i></div><b>${m.score===null?'—':`%${m.score}`}</b></div>`).join(''):'<div class="home-empty">Konu Takip, V5 StudyEvent kayıtlarından otomatik oluşur. Henüz konu verisi yok.</div>';
  }
  window.renderTopics=topicsRender;try{renderTopics=topicsRender}catch{}

  function wrongRender(){
    const rows=(model().studyEvents||[]).filter(x=>x.result==='wrong').slice(-40).reverse();const table=document.getElementById('wrongTable');if(!table)return;
    table.innerHTML=rows.map(x=>`<tr><td>${esc(`${x.exam} ${x.subject}`)}</td><td>${esc(x.topic||'—')}</td><td>${esc(x.curriculumOutcome||x.topic||'—')}</td><td><span class="pill orange">${esc(x.difficulty||'Tekrar')}</span></td><td>${x.source==='mini-test'?'Mini Test':'Soru Çöz'}</td></tr>`).join('')||'<tr><td colspan="5">Henüz yanlış olarak işaretlenmiş soru yok 🎉</td></tr>';
  }
  window.renderWrong=wrongRender;try{renderWrong=wrongRender}catch{}

  try{data()?.syncLegacy?.()}catch{};homeRender();topicsRender();wrongRender();

  };
  if(window.YKSDataV5)start();
  else{const s=document.createElement('script');s.src='/app-data-v5.js?v=1';s.onload=start;document.body.appendChild(s)}
})();
