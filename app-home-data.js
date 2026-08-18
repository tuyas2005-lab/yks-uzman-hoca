(()=>{
  const DEMO=[
    [1,'18.08.2026','TYT Matematik','Üslü Sayılar',true],[2,'18.08.2026','TYT Matematik','Köklü Sayılar',false],[3,'17.08.2026','TYT Matematik','Problemler',true],[4,'17.08.2026','Fizik','Hareket',false],[5,'16.08.2026','TYT Matematik','Köklü Sayılar',false],[6,'16.08.2026','Türkçe','Paragraf',true],[7,'15.08.2026','TYT Matematik','Problemler',true],[8,'15.08.2026','TYT Matematik','Üslü Sayılar',true],[9,'14.08.2026','TYT Matematik','Köklü Sayılar',true],[10,'14.08.2026','Fizik','Hareket',true]
  ];
  const norm=s=>String(s||'').toLocaleLowerCase('tr-TR').replace(/[^a-z0-9çğıöşü]+/g,' ').trim();
  const todayKey=()=>new Date().toLocaleDateString('sv-SE');
  const dateKey=v=>{const s=String(v||'');if(/^\d{4}-\d{2}-\d{2}$/.test(s))return s;const m=s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);return m?`${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`:''};
  const isDemo=x=>DEMO.some(d=>Number(x?.id)===d[0]&&x?.date===d[1]&&x?.subject===d[2]&&x?.topic===d[3]&&x?.correct===d[4]&&!x?.source);

  function migrate(){
    state.meta??={};state.activityLog??=[];state.sessions??=[];state.teacher??={selectedTopic:'',lessonCache:{},daily:null};
    if(state.meta.realHomeDataV1)return;
    const before=state.sessions.filter(x=>!isDemo(x));
    const miniToday=before.filter(x=>x.source==='mini-test'&&dateKey(x.date)===todayKey()).length;
    const legacyExtra=Math.max(0,Number(state.todayCount||0)-7-miniToday);
    if(legacyExtra>0)state.activityLog.push({id:Date.now(),dateKey:todayKey(),type:'legacy-solved',count:legacyExtra,source:'migration'});
    state.sessions=before;
    state.topicMastery={};
    state.plan=[];
    state.todayCount=0;
    state.meta.realHomeDataV1=true;
    save();
  }

  function weakCoachSubject(){
    const trials=[...(state.trials||[])].sort((a,b)=>String(a.date||'').localeCompare(String(b.date||''))||Number(a.id||0)-Number(b.id||0));
    const t=trials.at(-1);if(!t?.subjects)return null;
    const labels={turkce:'Türkçe',sosyal:'Sosyal',matematik:'Matematik',fen:'Fen',edebiyat:'Edebiyat',tarih1:'Tarih',tarih2:'Tarih',cografya1:'Coğrafya',cografya2:'Coğrafya',fizik:'Fizik',kimya:'Kimya',biyoloji:'Biyoloji',felsefe:'Felsefe',din:'Din',yabancidil:'Yabancı Dil'};
    const rows=Object.entries(t.subjects).map(([k,v])=>({key:k,label:labels[k]||k,ratio:Number(v?.net||0)/Math.max(1,Number(v?.total||1)),net:Number(v?.net||0)}));
    rows.sort((a,b)=>a.ratio-b.ratio);return rows[0]||null;
  }

  function snapshot(){
    const groups=new Map();
    (state.sessions||[]).filter(x=>x&&x.topic&&typeof x.correct==='boolean').forEach((x,idx)=>{
      const k=String(x.topic).trim();if(!k)return;let g=groups.get(k);if(!g){g={topic:k,rows:[]};groups.set(k,g)}g.rows.push({...x,_idx:idx});
    });
    const coachWeak=weakCoachSubject();
    const metrics=[...groups.values()].map(g=>{
      const rows=g.rows.slice(-12),total=rows.length,correct=rows.filter(x=>x.correct).length,wrong=total-correct,score=total?Math.round(correct/total*100):0,recentWrong=rows.slice(-5).filter(x=>!x.correct).length;
      const subject=String(rows.at(-1)?.subject||'');
      const coachMatch=coachWeak?norm(subject).includes(norm(coachWeak.label)):false;
      const confidence=total>=5?'Güçlü veri':total>=3?'Orta veri':'Veri az';
      const priorityIndex=score+(total<3?15:0)-recentWrong*3-(coachMatch?7:0);
      return{topic:g.topic,score,total,correct,wrong,recentWrong,subject,confidence,coachMatch,priorityIndex,lastDate:dateKey(rows.at(-1)?.date)};
    }).sort((a,b)=>a.priorityIndex-b.priorityIndex||b.total-a.total||a.topic.localeCompare(b.topic,'tr'));
    return{metrics,coachWeak};
  }

  function refreshLearningModel(){
    const s=snapshot();state.topicMastery=Object.fromEntries(s.metrics.map(x=>[x.topic,x.score]));return s;
  }
  window.getLearningSnapshot=snapshot;window.refreshLearningModel=refreshLearningModel;
  const topicFn=()=>refreshLearningModel().metrics.map(x=>[x.topic,x.score]);window.topicEntries=topicFn;try{topicEntries=topicFn}catch{}

  function todaySolved(){
    const k=todayKey();
    const mini=(state.sessions||[]).filter(x=>x.source==='mini-test'&&dateKey(x.date)===k).length;
    const activity=(state.activityLog||[]).filter(x=>x.dateKey===k).reduce((a,x)=>a+Number(x.count||1),0);
    return mini+activity;
  }
  function recordStudyActivity(a={}){
    state.activityLog??=[];state.activityLog.push({id:Date.now()+Math.random(),dateKey:todayKey(),type:a.type||'question-solve',count:Number(a.count||1),subject:a.subject||'',topic:a.topic||'',source:a.source||'question-solve'});
    state.todayCount=todaySolved();save();try{renderHome()}catch{}
  }
  window.recordStudyActivity=recordStudyActivity;

  function dailyTasks(s){
    const weak=s.metrics[0],k=todayKey(),teacherDaily=state.teacher?.daily,wrongRecent=(state.sessions||[]).filter(x=>!x.correct).slice(-12).length;
    if(!weak){
      const subject=s.coachWeak?.label;
      return[
        {id:'measure',title:subject?`5 soru • ${subject} seviye ölçümü`:'5 soruluk seviye ölçümü',desc:'Kişisel Öğretmen için gerçek konu verisi oluştur',done:false,go:'tests'},
        {id:'solve',title:'1 soru çöz ve konu kaydı oluştur',desc:'Çalışma geçmişini başlat',done:todaySolved()>0,go:'upload'}
      ];
    }
    const testedToday=(state.sessions||[]).filter(x=>x.source==='mini-test'&&x.topic===weak.topic&&dateKey(x.date)===k).length>=5;
    return[
      {id:'recap:'+weak.topic,title:`5 dk hızlı tekrar • ${weak.topic}`,desc:'Kişisel Öğretmen önerisi',done:teacherDaily?.date===k&&teacherDaily?.topic===weak.topic&&!!teacherDaily?.recapDone,go:'teacher',topic:weak.topic},
      {id:'test:'+weak.topic,title:`5 soru mini test • ${weak.topic}`,desc:'Başarı yüzdesini gerçek sorularla güncelle',done:testedToday,go:'tests',topic:weak.topic},
      {id:'wrong',title:wrongRecent?`Son yanlışlarını tekrar et • ${Math.min(3,wrongRecent)} öncelik`:'Yanlışlarını kontrol et',desc:'Hatalı kazanımları kapat',done:teacherDaily?.date===k&&!!teacherDaily?.wrongOpened,go:'wrong'}
    ];
  }

  function ensureHomeHints(){
    const goal=document.querySelector('#home .goal-card');if(goal&&!goal.querySelector('.home-source')){const n=document.createElement('div');n.className='home-source';n.textContent='Hedef: Ayarlar • Sayım: çözülen sorular + tamamlanan mini testler';goal.querySelector('div[style]')?.appendChild(n)}
    const weakTitle=document.querySelector('#weakList')?.closest('.card')?.querySelector('.section-title');if(weakTitle&&!weakTitle.querySelector('.home-owner')){const n=document.createElement('div');n.className='home-owner';n.textContent='Kişisel Öğretmen • Mini Test verisi + Koç ders önceliği';weakTitle.insertAdjacentElement('afterend',n)}
  }

  const css=document.createElement('style');css.textContent=`.home-source,.home-owner{font-size:11px;color:var(--muted);margin-top:7px}.home-owner{margin:-3px 0 11px}.weak-evidence{display:block;font-size:11px;color:var(--muted);margin-top:2px}.weak-owner-chip{font-size:10px;padding:2px 6px;border-radius:999px;background:#eeeaff;color:#5a42d3;margin-left:5px}.home-plan-action{margin-left:auto;min-width:64px}.home-empty{padding:18px;border:1px dashed var(--line);border-radius:14px;color:var(--muted);text-align:center}`;document.head.appendChild(css);

  function homeRender(){
    migrate();const s=refreshLearningModel(),p=state.profile||{},done=todaySolved(),left=Math.max(0,Number(p.goal||0)-done);state.todayCount=done;
    const hello=document.getElementById('hello');if(hello)hello.textContent=`Merhaba ${p.name||'Öğrenci'}! 👋`;const av=document.querySelector('.avatar');if(av)av.textContent=(p.name||'Ö')[0].toUpperCase();
    if(window.goalText)goalText.textContent=`${done} / ${p.goal||0} soru tamamlandı`;if(window.goalBar)goalBar.style.width=`${p.goal?Math.min(100,done/p.goal*100):0}%`;if(window.goalMotivation)goalMotivation.textContent=left?`Sadece ${left} soru kaldı 💪`:'🎉 Bugünkü hedef tamam!';
    const weak=s.metrics[0];
    if(window.teacherTip){teacherTip.textContent=weak?`${weak.topic}: ${weak.total} ölçülen soruda başarı %${weak.score}. ${weak.coachMatch?'Son denemedeki zayıf ders de bu alanı destekliyor. ':''}Hızlı tekrar + 5 soruluk test öneriyorum.`:(s.coachWeak?`${s.coachWeak.label} son denemede en çok gelişim alanı gösteriyor. Önce 5 soruluk Mini Test ile hangi konunun öncelikli olduğunu ölçelim.`:'Henüz konu başarısı ölçülmedi. 5 soruluk bir Mini Test çözersen Kişisel Öğretmen önceliği gerçek veriden belirler.');}
    const w=document.getElementById('weakList');if(w){w.innerHTML=s.metrics.length?s.metrics.slice(0,4).map(m=>`<div class="weak-row"><span><b>${esc(m.topic)}</b>${m.coachMatch?'<span class="weak-owner-chip">Koç etkisi</span>':''}<small class="weak-evidence">${m.total} ölçülen soru • ${m.correct} doğru • ${m.wrong} yanlış • ${m.confidence}</small></span><div class="bar ${m.score<60?'warning':''}"><i style="width:${Math.max(3,m.score)}%"></i></div><b>%${m.score}</b></div>`).join(''):`<div class="home-empty">Henüz ölçülmüş konu yok. Öncelik yüzdesi göstermek için önce Mini Test verisi gerekli.</div>`}
    const tasks=dailyTasks(s),plan=document.getElementById('dailyPlan');if(plan){plan.innerHTML=tasks.map((x,i)=>`<div class="plan-item ${x.done?'done':''}" data-home-task="${i}"><div class="check">${x.done?'✓':i+1}</div><div><strong>${esc(x.title)}</strong><small>${esc(x.desc)}</small></div><span class="pill ${x.done?'green':'orange'}">${x.done?'Tamam':'Başla'}</span></div>`).join('');plan.querySelectorAll('[data-home-task]').forEach(el=>el.onclick=()=>{const x=tasks[Number(el.dataset.homeTask)];if(x.topic&&x.go==='teacher'){state.teacher??={};state.teacher.selectedTopic=x.topic;state.teacher.daily=null;save()}go(x.go)})}
    const badge=document.querySelector('#dailyPlan')?.closest('.card')?.querySelector('.section-title .pill');if(badge)badge.textContent=`${tasks.length} görev`;
    const quickMini=[...document.querySelectorAll('#home .quick')].find(b=>b.dataset.go==='tests');if(quickMini){const sm=quickMini.querySelector('small');if(sm)sm.textContent=weak?`${weak.topic} • 5 soru`:'Seviyeni ölç • 5 soru'}
    document.querySelectorAll('#home .subject').forEach(btn=>{btn.onclick=()=>{state.miniTests??={history:[]};state.miniTests.prefillSubject=btn.textContent.trim();save();go('tests')}});
    ensureHomeHints();
  }
  window.renderHome=homeRender;try{renderHome=homeRender}catch{}

  function topicsRender(){
    migrate();const s=refreshLearningModel(),box=document.getElementById('topicRows');if(!box)return;box.innerHTML=s.metrics.length?s.metrics.map(m=>`<div class="weak-row"><span><b>${esc(m.topic)}</b><small class="weak-evidence">${m.total} ölçüm • ${m.correct} doğru • ${m.wrong} yanlış${m.coachMatch?' • Koç: zayıf ders':''}</small></span><div class="bar ${m.score<60?'warning':''}"><i style="width:${Math.max(3,m.score)}%"></i></div><b>%${m.score}</b></div>`).join(''):'<div class="home-empty">Konu Takip, tamamlanan Mini Testlerden otomatik oluşur. Henüz ölçüm yok.</div>';
  }
  window.renderTopics=topicsRender;try{renderTopics=topicsRender}catch{}

  function statsRender(){
    migrate();const real=(state.sessions||[]).filter(x=>typeof x.correct==='boolean'),n=real.length,c=real.filter(x=>x.correct).length,w=n-c,r=n?Math.round(c/n*100):0,s=refreshLearningModel();
    if(window.statTotal)statTotal.textContent=n;if(window.statAcc)statAcc.textContent=n?r+'%':'—';if(window.statStuck)statStuck.textContent=w;
    const stats=document.querySelectorAll('#stats .stat');if(stats[3]){const days=new Set([...real.map(x=>dateKey(x.date)),...(state.activityLog||[]).map(x=>x.dateKey)].filter(Boolean));stats[3].querySelector('b').textContent=days.size;stats[3].querySelector('small').textContent='Aktif gün'}
    const box=document.getElementById('statsTopics');if(box)box.innerHTML=s.metrics.length?s.metrics.map(m=>`<div class="weak-row"><span>${esc(m.topic)}</span><div class="bar ${m.score<60?'warning':''}"><i style="width:${Math.max(3,m.score)}%"></i></div><b>%${m.score}</b></div>`).join(''):'<div class="home-empty">Henüz ölçüm yok.</div>';
    const comment=document.getElementById('statsComment');if(comment){const weak=s.metrics[0],strong=[...s.metrics].sort((a,b)=>b.score-a.score)[0];comment.innerHTML=n?`Ölçülen ${n} mini test sorusunda genel doğruluk <b>%${r}</b>. ${strong?`En güçlü ölçülen konu <b>${esc(strong.topic)}</b> (%${strong.score}), `:''}${weak?`öncelikli gelişim alanı <b>${esc(weak.topic)}</b> (%${weak.score}).`:''}`:'İstatistikler Mini Test sonuçları geldikçe otomatik oluşacak.'}
  }
  window.renderStats=statsRender;try{renderStats=statsRender}catch{}

  function wrapLiveSolve(){
    if(window.__homeSolveWrapped)return;if(typeof liveSolve!=='function'){setTimeout(wrapLiveSolve,120);return}
    const prev=liveSolve;liveSolve=async args=>{const ok=await prev(args);if(ok){const x=lastLiveResult||{};recordStudyActivity({type:'question-solve',count:1,subject:[x.exam,x.subject].filter(Boolean).join(' '),topic:x.topic||'',source:'question-solve'})}return ok};window.liveSolve=liveSolve;window.__homeSolveWrapped=true;
  }

  migrate();homeRender();topicsRender();try{statsRender()}catch{};wrapLiveSolve();
})();