(()=>{
  const root=document.getElementById('teacher');if(!root)return;
  const D=()=>window.YKSDataV5,C=()=>window.YKSQuestionCatalogV1;
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#039;'}[c]));
  const norm=s=>D()?.norm?.(s)||String(s||'').toLocaleLowerCase('tr-TR').replace(/[^a-z0-9çğıöşü]+/g,' ').trim();
  const today=()=>D()?.todayKey?.()||new Date().toLocaleDateString('sv-SE');
  state.teacher??={};state.miniTests??={history:[]};

  const modeInfo={
    diagnostic:{label:'Önce ölç',title:'Veriyi netleştir',count:5},
    foundation:{label:'Temel kur',title:'Temelden güven oluştur',count:5},
    repair:{label:'Onarım',title:'Eksik noktayı kapat',count:5},
    reinforce:{label:'Pekiştir',title:'Bilgiyi sağlamlaştır',count:5},
    challenge:{label:'Meydan okuma',title:'Zorluğu kontrollü artır',count:5},
    spaced:{label:'Aralıklı tekrar',title:'Unutmadan kısa kontrol',count:3},
    maintain:{label:'Koru',title:'Kısa kontrol yeterli',count:3},
    complete:{label:'Hedef tamam',title:'Bugün yeni yük yok',count:0}
  };

  function candidates(){
    const s=window.getStudentStrategy?.();
    if(s?.topics?.length){
      const list=(s.focus?[s.focus.primary,...(s.focus.alternatives||[])]:s.topics).filter(Boolean),seen=new Set();
      return list.filter(x=>window.YKSTeacherPilotV1?.resolveTopic?.(x)).filter(x=>{const k=`${x.exam}|${x.subject}|${x.topic}`;if(seen.has(k))return false;seen.add(k);return true}).slice(0,8);
    }
    return (D()?.getLearningModel?.()?.topics||[]).filter(x=>window.YKSTeacherPilotV1?.resolveTopic?.(x)).map(x=>({...x,priority:(100-(x.score??70))+(x.recentWrong||0)*8+(x.recentSignals||0)*10})).sort((a,b)=>b.priority-a.priority);
  }
  function focus(){
    const list=candidates(),manual=state.strategy?.manualTopicDate===today()?state.strategy?.manualTopic:'',daily=state.teacher.daily;
    const wanted=manual||((daily?.date===today()&&!daily?.sessionDone)?daily.topic:'')||state.teacher.selectedTopic;
    if(wanted){const hit=list.find(x=>norm(x.topic)===norm(wanted));if(hit)return hit}
    return list[0]||{exam:'TYT',subject:'Matematik',topic:'Problemler',topicKey:'tyt.matematik.problemler',score:null,total:0,wrong:0,recentWrong:0,recentSignals:0,staleDays:999,confidence:'Veri yok'};
  }
  function todayQuestions(){return Number(D()?.getLearningModel?.()?.todayCount||0)}
  function reviewsToday(){return (state.studyEvents||[]).filter(x=>x?.source==='wrong-review'&&x?.dateKey===today()).length}
  function memoryFor(f){
    const P=window.YKSTeacherPilotV1,id=P?.resolveTopic?.(f)?.id;if(!id)return null;
    let memory=state.teacher?.topicMemory?.[id]||null;
    if(!memory){const outcome=(state.studyEvents||[]).filter(x=>x?.source==='teacher-session-outcome'&&(x.topicKey===id||x.meta?.topicId===id)).sort((a,b)=>Number(b.timestamp||0)-Number(a.timestamp||0))[0];if(outcome){const m=outcome.meta||{},sessionId=m.sessionId||'',mistakes=Number(m.wrongCount||0)+Number(m.unableCount||0),wrongRows=(state.studyEvents||[]).filter(x=>x?.meta?.teacherSessionId===sessionId&&x?.meta?.wrongKind);memory={topicId:id,exam:f.exam,subject:f.subject,topic:f.topic,lastSessionDate:outcome.dateKey||'',previousMode:m.adaptation?.previousMode||'',nextMode:m.adaptation?.nextMode||'',nextReview:m.nextReview||{},closureComplete:mistakes===0||(wrongRows.length>=mistakes&&wrongRows.every(x=>x.meta?.wrongClosed===true)),lastAccuracy:m.accuracy,lastCompletedAt:m.completedAt||outcome.timestamp||0,derivedFromOutcome:true}}}
    const self=(state.miniTests?.history||[]).filter(x=>x?.studentInitiated&&x.exam===f.exam&&norm(x.subject)===norm(f.subject)&&norm(x.topic)===norm(f.topic)).sort((a,b)=>Number(b.completedAt||b.id||0)-Number(a.completedAt||a.id||0))[0],selfAt=Number(self?.completedAt||self?.id||0);
    if(self&&selfAt>Number(memory?.studentEvidenceAt||memory?.lastCompletedAt||0)){const previous=memory?.nextMode||memory?.previousMode||'diagnostic',raw=P?.decideTeacherSession?.({total:Number(self.count)||0,score:Number(self.percent)||0,recentWrong:Number(self.wrong)||0,recentSignals:Number(self.unable)||0,staleDays:0}),nextMode=P?.transitionMode?.(previous,raw?.mode||'repair')||raw?.mode||'repair',dateKey=new Date(selfAt).toLocaleDateString('sv-SE'),nextReview=P?.nextReview?.({dateKey,answered:Number(self.count)||0,correct:Number(self.correct)||0})||{};memory={...(memory||{}),topicId:id,exam:f.exam,subject:f.subject,topic:f.topic,lastSessionDate:dateKey,previousMode:previous,nextMode,nextReview,closureComplete:Number(self.wrong||0)+Number(self.unable||0)===0,lastAccuracy:Number(self.percent)||0,lastCompletedAt:selfAt,studentEvidenceAt:selfAt,studentInitiated:true}}
    const newerOpenWrong=(state.studyEvents||[]).filter(x=>x?.source==='source-question-result'&&x?.meta?.wrongRecord===true&&!x?.meta?.wrongClosed&&(x.topicKey===id||x.meta?.topicId===id)&&Number(x.timestamp||0)>Number(memory?.lastCompletedAt||0)).sort((a,b)=>Number(b.timestamp||0)-Number(a.timestamp||0))[0];
    if(memory&&newerOpenWrong)memory={...memory,closureComplete:false,reopenedByWrongAt:Number(newerOpenWrong.timestamp||0),reopenedByWrongId:newerOpenWrong.id};
    return memory
  }
  function selfMiniInsight(f){return(state.miniTests?.history||[]).filter(x=>x?.studentInitiated&&x.exam===f.exam&&norm(x.subject)===norm(f.subject)&&norm(x.topic)===norm(f.topic)).sort((a,b)=>Number(b.completedAt||b.id||0)-Number(a.completedAt||a.id||0))[0]||null}
  function baseMode(f){
    const existing=state.teacher.daily,P=window.YKSTeacherPilotV1,mem=memoryFor(f);
    if(mem?.lastSessionDate&&mem.lastSessionDate<today()){const resumed=P?.resumeMode?.({previousMode:mem.previousMode,nextMode:mem.nextMode,nextReviewDate:mem.nextReview?.dateKey,today:today(),closureComplete:mem.closureComplete});if(resumed)return resumed}
    return P?.decideTeacherSession?.({...f,todayCount:todayQuestions(),dailyGoal:Math.max(1,Number(state.profile?.goal||10)),sessionInProgress:existing?.date===today()&&existing.testDone})?.mode||'diagnostic';
  }
  function ensureDaily(f){
    let d=state.teacher.daily;
    if(!d||d.date!==today()||norm(d.topic)!==norm(f.topic)){
      const mode=baseMode(f),info=modeInfo[mode];
      d={date:today(),topic:f.topic,mode,desiredCount:info.count,strictTopic:true,testDone:false,wrongDone:false,testSummary:null,sessionDone:false};
      state.teacher.daily=d;save();
    }
    d.mode=d.mode||baseMode(f);d.desiredCount=Number(d.desiredCount??modeInfo[d.mode]?.count??5);d.strictTopic=true;
    const mistakes=Number(d.testSummary?.mistakes||0);
    if(d.testDone&&mistakes===0)d.wrongDone=true;
    if(d.testDone&&mistakes>0&&reviewsToday()>Number(d.wrongReviewBaseline||0))d.wrongDone=true;
    d.decisionEvidence={measuredCount:Number(f.total||0),score:f.score==null?null:Number(f.score),recentWrong:Number(f.recentWrong||0),recentSignals:Number(f.recentSignals||0),staleDays:Number(f.staleDays||0),todayCount:todayQuestions(),dailyGoal:Math.max(1,Number(state.profile?.goal||10)),confidence:String(f.confidence||'')};
    d.reasonText=reason(f,d);
    d.sessionDone=isSessionDone(d);return d;
  }
  function isSessionDone(d){
    if(d.mode==='complete')return true;
    return !!(d.testDone&&d.wrongDone);
  }
  function exactReady(f,limit=5){try{return C()?.findNextBatch?.({exam:f.exam,subject:f.subject,topic:f.topic,visualPreferred:true},Math.max(5,limit))||[]}catch{return[]}}
  function usableCount(f,d){const n=exactReady(f,d.desiredCount).length;if(d.desiredCount>=5)return n>=5?5:n>=3?3:0;return n>=3?3:0}
  function recent(f){return D()?.recentForTopic?.(f.topic,5)||[]}
  function topicTestInsight(f){return(D()?.getTopicTestInsights?.({days:60})||[]).find(x=>x.topicId===f.topicKey||(x.exam===f.exam&&norm(x.subject)===norm(f.subject)&&norm(x.topic)===norm(f.topic)))||null}
  function rewardSummary(){const points=(state.studyEvents||[]).filter(x=>x?.source==='reward-earned').reduce((a,x)=>a+Math.max(0,Number(x.meta?.points||0)),0),titles=[[1500,'YKS Savaşçısı'],[900,'Konu Ustası'],[500,'Güçlü Takipçi'],[250,'Kararlı Öğrenci'],[100,'Düzenli Öğrenci'],[0,'Başlangıç']];return{points,title:titles.find(x=>points>=x[0])?.[1]||'Başlangıç'}}
  function praiseText(id){return id==='mistake-recovered'?'Yanlışından dönmen çok değerli; öğrenme tam burada güçleniyor.':id==='challenge-solved'?'Zor sorudan kaçmadın ve başardın; seviyen yükseliyor.':id==='honest-feedback'?'“Yapamadım” demen doğru bir öğrenme davranışı; şimdi eksik noktayı birlikte kapatabiliriz.':id==='teacher-task-completed'?'Öğretmen görevini tamamladın; düzenli emeğin kayda geçti.':'Çabanı görüyorum; bu adım emek puanına işlendi.'}
  function reason(f,d){
    const score=f.score==null?'ölçüm yok':`başarı %${f.score}`,wr=Number(f.recentWrong||0),sig=Number(f.recentSignals||0),stale=Number(f.staleDays||0),goal=Number(state.profile?.goal||10),done=todayQuestions();
    if(d.mode==='complete')return`Bugünkü soru hedefi ${done}/${goal}. Yeni görev eklemiyorum; istersen yalnız yanlışlarını tekrar edebilirsin.`;
    if(d.mode==='diagnostic')return`${f.topic} için yalnız ${f.total||0} ölçüm var. Tahmin yürütmek yerine önce gerçek kaynak sorularıyla seviyeyi ölçeceğim.`;
    if(d.mode==='repair')return`${f.topic}: ${score}${wr?` • ${wr} yakın yanlış`:''}${sig?` • ${sig} zorlanma sinyali`:''}. Benzer gerçek kaynak sorularıyla eksik noktayı ölçecek, çıkan yanlışları tek tek kapatacağız.`;
    if(d.mode==='foundation')return`${f.topic}: ${score}. Temel eksik görünüyor; ağırlıklı kolay gerçek kaynak sorularıyla güvenli bir başlangıç yapacağız.`;
    if(d.mode==='reinforce')return`${f.topic}: ${score}. Temel oluşmuş; 5 gerçek kaynak sorusuyla pekiştirip yalnız çıkan yanlışları kapatacağız.`;
    if(d.mode==='challenge')return`${f.topic}: ${score}. Güçlü ve güncel performans kanıtlandı; orta ve zor sorularla kontrollü meydan okuma zamanı.`;
    if(d.mode==='spaced')return`${f.topic} iyi durumda ancak ${stale} gündür ölçülmedi. 3 soruluk aralıklı kontrol yeterli.`;
    return`${f.topic} güncel ölçümlerde iyi durumda. Uzun çalışma yerine 3 soruluk kısa kontrol yeterli.`;
  }
  function task(n,title,desc,done,active,id,label,disabled=false){const cls=done?'done':active?'active':'locked',status=done?'Tamamlandı':active?'Sıradaki':'Bekliyor';return `<div class="pt2-task ${cls}"><div class="pt2-num">${done?'✓':n}</div><div><h4>${esc(title)}</h4><p>${esc(desc)}</p></div><div><span class="pt2-status">${status}</span>${id?`<button id="${id}" class="${active?'primary':'ghost'}" ${disabled?'disabled':''} style="margin-left:8px">${esc(label)}</button>`:''}</div></div>`}
  function stepsHtml(f,d,count){
    const mistakes=Number(d.testSummary?.mistakes||0),sourceDesc=count?`${count} çözülmemiş, doğrulanmış kaynak sorusuyla çalış.`:`Bu konu için en az 3 çözülmemiş hazır kaynak sorusu yok; AI soru üretmeyecek.`,testLabel=count?`${count} Soruluk Seti Başlat`:'Kaynak Bekleniyor';
    if(d.mode==='complete')return task(1,'Bugünkü hedef tamamlandı','Yeni soru yükü eklenmedi. İstersen Yanlışlarım bölümünden serbest tekrar yapabilirsin.',true,false,'pt2Wrong','Yanlışları Aç',false);
    return [
      task(1,d.mode==='spaced'?'3 Soruluk Aralıklı Kontrol':d.mode==='maintain'?'3 Soruluk Kısa Kontrol':'Kaynak Sorularıyla Çalış',sourceDesc,d.testDone,!d.testDone,'pt2Test',testLabel,!count),
      task(2,'Yanlışları Kapat',d.testDone?(mistakes?`${mistakes} yanlış/yapamadım kaydını tek-soru ekranından yeniden incele.`:'Bu sette yanlış yok; görev otomatik tamamlandı.'):'Kaynak seti bittikten sonra yalnız gerçek hata varsa açılır.',d.wrongDone,d.testDone&&!d.wrongDone,'pt2Wrong',d.wrongDone?'Yanlışları Aç':'Yanlışlarımı Aç',!d.testDone||!mistakes)
    ].join('');
  }
  function render(){
    const f=focus(),d=ensureDaily(f),info=modeInfo[d.mode]||modeInfo.diagnostic,count=usableCount(f,d),perf=recent(f),topicTest=topicTestInsight(f),selfMini=selfMiniInsight(f),memory=memoryFor(f),nextMemoryMode=memory?(window.YKSTeacherPilotV1?.resumeMode?.({previousMode:memory.previousMode,nextMode:memory.nextMode,nextReviewDate:memory.nextReview?.dateKey,today:today(),closureComplete:memory.closureComplete})||memory.nextMode):'',tasks=stepsHtml(f,d,count),total=(tasks.match(/class="pt2-task/g)||[]).length,done=(tasks.match(/class="pt2-task done/g)||[]).length,goal=Number(state.profile?.goal||10),todayQ=todayQuestions(),performanceHtml=topicTest?topicTest.recentTests.map(x=>`<span class="pt2-perf">${x.questionCount} soru • ${x.correct}D ${x.wrong}Y ${x.blank}B • %${x.accuracy} • ${esc(x.dateKey)}</span>`).join(''):perf.map(x=>`<span class="pt2-perf ${x.result==='correct'?'ok':'bad'}">${x.result==='correct'?'✓':'✕'} ${new Date(x.timestamp||Date.now()).toLocaleDateString('tr-TR',{day:'2-digit',month:'2-digit'})}</span>`).join('');
    root.innerHTML=`<div class="screen-head"><button class="back" data-go="home">←</button><h1>Kişisel Öğretmenim</h1></div><div class="pt2"><div class="pt2-hero"><div><div class="pt2-chips"><span class="pt2-chip">${esc(`${f.exam} ${f.subject}`)}</span><span class="pt2-chip green">${esc(info.label)}</span></div><h2>${esc(f.topic)}</h2><p><b>${esc(info.title)}.</b> ${esc(reason(f,d))}</p></div><div class="pt2-progress"><b>${done}/${total}</b><small>bugünkü plan</small><div class="pt2-bar"><i style="width:${total?Math.round(done/total*100):100}%"></i></div></div></div><div class="pt2-main"><div class="pt2-card"><div class="pt2-head"><h3>Bugünkü Çalışma</h3><small>Gerçek sorular ve gerçek yanlışlar</small></div><div class="pt2-tasks">${tasks}</div></div><div class="pt2-card"><div class="pt2-head"><h3>Öğretmenin Değerlendirmesi</h3></div><div class="pt2-metrics"><div class="pt2-metric"><b>${f.score==null?'—':`%${f.score}`}</b><small>ölçümlü başarı</small></div><div class="pt2-metric"><b>${Number(f.recentWrong||0)}</b><small>yakın yanlış</small></div><div class="pt2-metric"><b>${todayQ}/${goal}</b><small>bugünkü soru yükü</small></div></div>${selfMini?`<div class="pt2-note"><b>Kendi çözdüğün Mini Test:</b> ${Number(selfMini.count)||0} soru • ${Number(selfMini.correct)||0}D ${Number(selfMini.wrong)||0}Y ${Number(selfMini.unable)||0} yapamadım • %${Number(selfMini.percent)||0}. Öğretmenin bu sonucu sonraki kararında kullanacak.</div>`:''}${topicTest?`<div class="pt2-note"><b>Son konu testlerin:</b> ${topicTest.totalTests} test • ${topicTest.totalQuestions} soru • ${topicTest.correct}D ${topicTest.wrong}Y ${topicTest.blank}B • %${topicTest.accuracy}.</div>`:''}${memory?.nextReview?.dateKey?`<div class="pt2-note"><b>Sonraki kontrol:</b> ${esc(memory.nextReview.dateKey)} • ${esc(modeInfo[nextMemoryMode]?.label||nextMemoryMode)}. Kapanmamış yanlış varsa öğretmen tarihi beklemez.</div>`:''}</div></div><div class="pt2-details"><details><summary>Başka bir konu seç</summary><div class="pt2-topics">${candidates().slice(0,5).map(x=>`<button class="pt2-topic ${norm(x.topic)===norm(f.topic)?'active':''}" data-pt3-topic="${esc(x.topic)}"><span><b>${esc(x.topic)}</b><br><small class="muted">${esc(`${x.exam} ${x.subject}`)}</small></span><span>${x.score==null?'—':`%${x.score}`}</span></button>`).join('')}</div></details>${performanceHtml?`<details><summary>Son çalışmalarımı göster</summary><div class="pt2-perfs">${performanceHtml}</div></details>`:''}</div></div>`;
    const reward=rewardSummary(),praise=state.teacher?.lastPraise,card=document.createElement('div');card.className='pt2-note';card.innerHTML=`<b>⭐ ${reward.points} Emek Puanı • ${esc(reward.title)}</b><br>${praise?esc(praiseText(praise.praiseId)):'İlk gerçek çalışma davranışından sonra öğretmenin takdiri burada görünecek.'}`;root.querySelector('.pt2-hero')?.insertAdjacentElement('afterend',card);
    root.querySelector('[data-go="home"]').onclick=()=>go('home');
    root.querySelectorAll('[data-pt3-topic]').forEach(b=>b.onclick=()=>{state.teacher.selectedTopic=b.dataset.pt3Topic;state.strategy??={};state.strategy.manualTopicDate=today();state.strategy.manualTopic=b.dataset.pt3Topic;state.teacher.daily=null;save();render()});
    if(d.mode==='complete'){const wrong=root.querySelector('#pt2Wrong');if(wrong)wrong.onclick=()=>go('wrong')}
    setTimeout(()=>window.refreshSourceSetTracking?.(),0);
  }
  function install(tries=0){
    if(!window.getStudentStrategy){if(tries<80)setTimeout(()=>install(tries+1),80);return}
    window.renderTeacher=render;try{renderTeacher=render}catch{};if(root.classList.contains('active'))render();setTimeout(()=>{try{window.renderHome?.()}catch{}},40);
  }
  install();
})();
