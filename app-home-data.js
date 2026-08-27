(()=>{
  const start=()=>{
    const data=()=>window.YKSDataV5;
    const model=()=>data()?.getLearningModel?.()||{topics:[],metrics:[],todayCount:0,questionCount:0,studyEvents:[]};
    const todayKey=()=>data()?.todayKey?.()||new Date().toLocaleDateString('sv-SE');

    function priorityRows(m=model()){
      return (m.topics||[]).map(t=>{
        const base=t.score===null?(t.recentSignals?55:85):t.score;
        const need=(100-base)+(t.recentWrong||0)*8+(t.recentSignals||0)*10+Math.min(10,t.staleDays||0)-(t.todayCount>=5?24:0);
        return{...t,priorityIndex:need};
      }).sort((a,b)=>b.priorityIndex-a.priorityIndex||b.total-a.total||a.topic.localeCompare(b.topic,'tr'));
    }
    function snapshot(){const m=model(),metrics=priorityRows(m);return{...m,metrics,topics:metrics,coachWeak:null}}
    function refreshLearningModel(){
      const s=snapshot(),legacy={};
      for(const x of s.metrics){if(x.score===null)continue;if(!(x.topic in legacy)||x.score<legacy[x.topic])legacy[x.topic]=x.score}
      state.topicMastery=legacy;
      return s;
    }
    window.getLearningSnapshot=snapshot;window.refreshLearningModel=refreshLearningModel;

    const topicFn=()=>refreshLearningModel().metrics.filter(x=>x.score!==null).map(x=>[x.topic,x.score]);
    window.topicEntries=topicFn;try{topicEntries=topicFn}catch{}

    function todaySolved(){return Number(model().todayCount||0)}
    function recordStudyActivity(a={}){
      const x=data();if(!x)return null;
      const subject=String(a.subject||''),exam=/^\s*AYT\b/i.test(subject)?'AYT':'TYT';
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
      const recentWrong=(s.events||s.studyEvents||[]).filter(x=>x.result==='wrong').slice(-12).length;
      if(!focus){
        return[
          {id:'measure',title:'5 soruluk seviye ölçümü',desc:'Kişisel Öğretmen için gerçek konu verisi oluştur',done:false,go:'tests'},
          {id:'solve',title:'1 soru çöz ve çalışma kaydı oluştur',desc:'Fotoğraf veya metinle soru çöz',done:todaySolved()>0,go:'upload'}
        ];
      }
      const testedToday=(focus.events||[]).filter(x=>x.source==='mini-test'&&x.dateKey===k).reduce((a,x)=>a+Number(x.questionCount||1),0)>=5;
      return[
        {id:'test:'+focus.topic,title:`Gerçek kaynak soruları • ${focus.topic}`,desc:focus.total<3?'Veri az; önce seviyeyi ölç':'Öğretmenin seçtiği zorlukta çalış',done:testedToday,go:'tests',topic:focus.topic,subject:`${focus.exam} ${focus.subject}`},
        {id:'wrong',title:recentWrong?`Gerçek yanlışlarını kapat • ${Math.min(3,recentWrong)} öncelik`:'Yanlış çıkarsa düzelt',desc:'Yalnız soru bazında kaydedilmiş hataları kapat',done:teacherDaily?.date===k&&!!teacherDaily?.wrongDone,go:'wrong'}
      ];
    }

    function setText(id,value){const el=document.getElementById(id);if(el)el.textContent=value}
    function homeRender(){
      const s=refreshLearningModel(),p=state.profile||{},done=todaySolved(),goal=Math.max(0,Number(p.goal||0)),left=Math.max(0,goal-done),pct=goal?Math.min(100,done/goal*100):0;
      state.todayCount=done;
      setText('hello',`Merhaba ${p.name||'Öğrenci'}! 👋`);
      const av=document.querySelector('#home .avatar');if(av)av.textContent=(p.name||'Ö')[0].toUpperCase();
      setText('goalText',`${done} / ${goal} soru tamamlandı`);
      const bar=document.getElementById('goalBar');if(bar)bar.style.width=`${pct}%`;
      setText('goalMotivation',left?`Bugünkü hedefe ulaşmana sadece ${left} soru kaldı.`:'Bugünkü hedef tamamlandı. Güzel iş!');

      const scored=s.metrics.filter(x=>x.score!==null),avg=scored.length?Math.round(scored.reduce((a,x)=>a+Number(x.score||0),0)/scored.length):null;
      const wrong=(s.studyEvents||s.events||[]).filter(x=>x.result==='wrong').length;
      setText('homeGoalStat',`${done} / ${goal}`);
      setText('homeTopicStat',String(s.metrics.length));
      setText('homeWrongStat',String(wrong));
      setText('homeMasteryStat',avg===null?'—':`%${avg}`);

      const focus=currentFocus(s);
      if(focus){
        setText('homeTeacherTopic',focus.topic||'Bugünkü odak');
        const evidence=focus.score===null?'Henüz yeterli doğru/yanlış ölçümü yok.':`Başarı düzeyin %${focus.score}.`;
        const action=focus.total<3?'Önce 5 gerçek kaynak sorusuyla seviyeni netleştirelim.':'Kısa bir tekrarın ardından hedefli mini test iyi bir sonraki adım.';
        setText('homeTeacherAdvice',`${evidence} ${action}`);
      }else{
        setText('homeTeacherTopic','İlk ölçümünü yap');
        setText('homeTeacherAdvice','İlk Mini Testten sonra gerçek performans verine göre kişisel önerin burada oluşacak.');
      }

      const w=document.getElementById('weakList');
      if(w){
        w.innerHTML=s.metrics.length?s.metrics.slice(0,4).map(m=>{
          const score=m.score===null?'—':`%${m.score}`;
          const width=m.score===null?5:Math.max(3,Math.min(100,m.score));
          const warn=m.score!==null&&m.score<60;
          const status=m.score===null?'Ölçüm gerekli':warn?'Tekrar öneriliyor':'Gelişiyor';
          return `<div class="home-topic-row"><span>${esc(m.topic)}</span><div class="bar ${warn?'warning':''}"><i style="width:${width}%"></i></div><b>${score}</b><span class="home-topic-status ${warn||m.score===null?'warn':''}">${status}</span></div>`;
        }).join(''):'<div class="home-empty">Henüz ölçülmüş konu yok. Mini Test veya Soru Çöz ile ilk gerçek performans verini oluşturabilirsin.</div>';
      }

      const tasks=dailyTasks(s);state.plan=tasks.map(x=>({title:x.title,desc:x.desc,done:x.done}));
    }
    window.renderHome=homeRender;try{renderHome=homeRender}catch{}

    function topicsRender(){
      const s=refreshLearningModel(),box=document.getElementById('topicRows');if(!box)return;
      box.innerHTML=s.metrics.length?s.metrics.map(m=>`<div class="weak-row"><span><b>${esc(`${m.exam} ${m.subject} • ${m.topic}`)}</b><small class="weak-evidence">${m.total} ölçüm • ${m.correct} doğru • ${m.wrong} yanlış • ${m.confidence}${m.recentSignals?` • ${m.recentSignals} zorlanma sinyali`:''}</small></span><div class="bar ${m.score!==null&&m.score<60?'warning':''}"><i style="width:${m.score===null?5:Math.max(3,m.score)}%"></i></div><b>${m.score===null?'—':`%${m.score}`}</b></div>`).join(''):'<div class="home-empty">Konu Takip, V5 StudyEvent kayıtlarından otomatik oluşur. Henüz konu verisi yok.</div>';
    }
    window.renderTopics=topicsRender;try{renderTopics=topicsRender}catch{}

    function wrongRender(){
      const rows=(model().studyEvents||[]).filter(x=>x.result==='wrong').slice(-40).reverse(),table=document.getElementById('wrongTable');if(!table)return;
      table.innerHTML=rows.map(x=>`<tr><td>${esc(`${x.exam} ${x.subject}`)}</td><td>${esc(x.topic||'—')}</td><td>${esc(x.curriculumOutcome||x.topic||'—')}</td><td><span class="pill orange">${esc(x.difficulty||'Tekrar')}</span></td><td>${x.source==='mini-test'?'Mini Test':'Soru Çöz'}</td></tr>`).join('')||'<tr><td colspan="5">Henüz yanlış olarak işaretlenmiş soru yok 🎉</td></tr>';
    }
    window.renderWrong=wrongRender;try{renderWrong=wrongRender}catch{}

    try{data()?.syncLegacy?.()}catch{};homeRender();topicsRender();wrongRender();
  };
  if(window.YKSDataV5)start();
  else{const s=document.createElement('script');s.src='/app-data-v5.js?v=2';s.onload=start;document.body.appendChild(s)}
})();
