(()=>{
  const root=document.getElementById('teacher');if(!root)return;
  const D=()=>window.YKSDataV5,C=()=>window.YKSQuestionCatalogV1;
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#039;'}[c]));
  const norm=s=>D()?.norm?.(s)||String(s||'').toLocaleLowerCase('tr-TR').replace(/[^a-z0-9çğıöşü]+/g,' ').trim();
  const today=()=>D()?.todayKey?.()||new Date().toLocaleDateString('sv-SE');
  state.teacher??={};state.miniTests??={history:[]};

  const modeInfo={
    diagnostic:{label:'Önce tanıyalım',title:'Önce seni biraz tanıyayım',count:5},
    foundation:{label:'Birlikte başlayalım',title:'Temeli birlikte kuralım',count:5},
    repair:{label:'Birlikte düzeltelim',title:'Takıldığın yeri birlikte açalım',count:5},
    reinforce:{label:'İyice sağlamlaştıralım',title:'Şimdi bilgini sağlamlaştıralım',count:5},
    challenge:{label:'Kendini göster',title:'Hazırsan biraz zorlayalım',count:5},
    spaced:{label:'Kısa bir yoklama',title:'Unutmadığından emin olalım',count:3},
    maintain:{label:'Formunu koru',title:'Kısa bir kontrol yapalım',count:3},
    complete:{label:'Bugünlük tamam',title:'Bugünkü emeğin yeterli',count:0}
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
  const topicKey=x=>`${norm(x?.exam)}|${norm(x?.subject)}|${norm(x?.topic)}`;
  function completedTopicKeys(){const x=state.teacher?.completedTeacherTopics;return new Set(x?.date===today()?(x.keys||[]):[])}
  function nextTopicAfter(f){const completed=completedTopicKeys();completed.add(topicKey(f));return candidates().find(x=>topicKey(x)!==topicKey(f)&&!completed.has(topicKey(x)))||candidates().find(x=>topicKey(x)!==topicKey(f))||null}
  function continueTeacherDay(f,next,goalReached){
    const completed=completedTopicKeys();completed.add(topicKey(f));state.teacher.completedTeacherTopics={date:today(),keys:[...completed]};
    state.teacher.daily=null;state.strategy??={};state.strategy.manualTopicDate='';state.strategy.manualTopic='';
    state.teacher.selectedTopic=goalReached?'':(next?.topic||'');save();render();
  }
  function exactReady(f,limit=5){try{return C()?.findNextBatch?.({exam:f.exam,subject:f.subject,topic:f.topic,visualPreferred:true},Math.max(5,limit))||[]}catch{return[]}}
  function usableCount(f,d){const n=exactReady(f,d.desiredCount).length;if(d.desiredCount>=5)return n>=5?5:n>=3?3:0;return n>=3?3:0}
  function recent(f){return D()?.recentForTopic?.(f.topic,5)||[]}
  function topicTestInsight(f){return(D()?.getTopicTestInsights?.({days:60})||[]).find(x=>x.topicId===f.topicKey||(x.exam===f.exam&&norm(x.subject)===norm(f.subject)&&norm(x.topic)===norm(f.topic)))||null}
  function rewardSummary(){const points=(state.studyEvents||[]).filter(x=>x?.source==='reward-earned').reduce((a,x)=>a+Math.max(0,Number(x.meta?.points||0)),0),titles=[[1500,'YKS Savaşçısı'],[900,'Konu Ustası'],[500,'Güçlü Takipçi'],[250,'Kararlı Öğrenci'],[100,'Düzenli Öğrenci'],[0,'Başlangıç']];return{points,title:titles.find(x=>points>=x[0])?.[1]||'Başlangıç'}}
  function praiseText(id){return id==='mistake-recovered'?'Yanlışından dönmen çok değerli; öğrenme tam burada güçleniyor.':id==='challenge-solved'?'Zor sorudan kaçmadın ve başardın; seviyen yükseliyor.':id==='honest-feedback'?'“Yapamadım” demen doğru bir öğrenme davranışı; şimdi eksik noktayı birlikte kapatabiliriz.':id==='teacher-task-completed'?'Öğretmen görevini tamamladın; düzenli emeğin kayda geçti.':'Çabanı görüyorum; bu adım emek puanına işlendi.'}
  function reason(f,d){
    const rawName=String(state.profile?.name||'').trim(),name=rawName&&!/^öğrenci$/i.test(rawName)?rawName.split(/\s+/)[0]:'',hello=name?`${name}, `:'';
    if(d.testDone&&d.testSummary){
      const count=Math.max(0,Number(d.testSummary.count||0)),correct=Math.max(0,Number(d.testSummary.correct||0)),mistakes=Math.max(0,Number(d.testSummary.mistakes||0)),percent=Math.max(0,Number(d.testSummary.percent||0)),solved=count||correct+mistakes;
      if(!mistakes)return`${hello}${solved} sorunun tamamını doğru yaptın. Bu konuda sağlam ilerliyorsun; bugün düzeltmemiz gereken bir nokta çıkmadı.`;
      if(percent>=80)return`${hello}${solved} soruda ${correct} doğru yaptın. Konuyu büyük ölçüde kavramışsın; kalan ${mistakes} soruya birlikte dönüp küçük eksiği de kapatalım.`;
      if(percent>=60)return`${hello}${solved} soruda ${correct} doğru yaptın. Temelin oluşuyor; takıldığın ${mistakes} soru bize bundan sonra nerede çalışacağımızı açıkça gösterdi.`;
      if(correct>0)return`${hello}${solved} soruda ${correct} doğru yaptın. Başarabildiğin kısmı gördüm; şimdi zorlandığın ${mistakes} soruyu acele etmeden birlikte düzeltelim.`;
      return`${hello}${solved} soruyu denedin; bu benim için değerli bir başlangıç. Şimdi zorlandığın noktaları biliyorum ve sana rastgele değil, tam ihtiyacın olan yerden yardım edeceğim.`;
    }
    if(d.mode==='complete')return`${hello}bugün için planladığımız çalışmayı tamamladın. Emeğin yeterli; şimdi gönül rahatlığıyla dinlenebilir ya da istersen yanlışlarına kısaca göz atabilirsin.`;
    if(d.mode==='diagnostic')return`${hello}bu konuda seni henüz yeterince tanımıyorum. Önce birkaç gerçek soru çözelim; böylece sana ne eksik ne de fazla çalışma vereyim.`;
    if(d.mode==='repair')return`${hello}bazı sorularda takıldığını görüyorum; bu çok normal. Şimdi benzer soruları birlikte ele alalım, zorlandığın noktaları acele etmeden tek tek düzeltelim.`;
    if(d.mode==='foundation')return`${hello}burada önce sağlam bir başlangıç yapmamız iyi olacak. Kolaydan başlayıp adım adım ilerleyelim; her doğruyla güvenin biraz daha artsın.`;
    if(d.mode==='reinforce')return`${hello}temel yerine oturmaya başlamış. Şimdi birkaç gerçek soruyla bilgini iyice sağlamlaştıralım; takıldığın bir yer olursa hemen birlikte dönüp bakalım.`;
    if(d.mode==='challenge')return`${hello}bu konuda iyi ilerliyorsun. Hazırsan şimdi seni biraz zorlayacağım; yapabildiklerini görmek sana da iyi gelecek.`;
    if(d.mode==='spaced')return`${hello}bu konuyu daha önce güzel çalıştın. Unutmadığından emin olmak için kısa bir yoklama yapalım; üç soru bize yeter.`;
    return`${hello}bu konu sende iyi görünüyor. Uzun uzun çalışmana gerek yok; üç kısa soruyla formunu koruyalım.`;
  }
  function task(n,title,desc,done,active,id,label,disabled=false){const cls=done?'done':active?'active':'locked',status=done?'Tamamlandı':active?'Sıradaki':'Bekliyor';return `<div class="pt2-task ${cls}"><div class="pt2-num">${done?'✓':n}</div><div><h4>${esc(title)}</h4><p>${esc(desc)}</p></div><div><span class="pt2-status">${status}</span>${id?`<button id="${id}" class="${active?'primary':'ghost'}" ${disabled?'disabled':''} style="margin-left:8px">${esc(label)}</button>`:''}</div></div>`}
  function stepsHtml(f,d,count){
    const mistakes=Number(d.testSummary?.mistakes||0),sourceDesc=count?`Sen ${count} gerçek soruyu çöz; ben sonucuna göre bir sonraki adımı belirleyeyim.`:`Bu konu için henüz yeterli hazır soru yok. Yeni soru geldiğinde öğretmenin çalışmana ekleyecek.`,testLabel=count?`${count} Soruluk Seti Başlat`:'Kaynak Bekleniyor';
    if(d.mode==='complete')return task(1,'Bugünkü hedef tamamlandı','Yeni soru yükü eklenmedi. İstersen Yanlışlarım bölümünden serbest tekrar yapabilirsin.',true,false,'pt2Wrong','Yanlışları Aç',false);
    return [
      task(1,d.mode==='spaced'?'3 Soruluk Aralıklı Kontrol':d.mode==='maintain'?'3 Soruluk Kısa Kontrol':'Kaynak Sorularıyla Çalış',sourceDesc,d.testDone,!d.testDone,'pt2Test',testLabel,!count),
      task(2,'Yanlışları Birlikte Düzeltelim',d.testDone?(mistakes?`Takıldığın ${mistakes} soruya yeniden dönelim. Bu kez nerede zorlandığını birlikte bulacağız.`:'Harika, bu sette düzeltmemiz gereken bir yanlış çıkmadı.'):'Önce soruları çöz; takıldığın yer olursa burada birlikte ele alacağız.',d.wrongDone,d.testDone&&!d.wrongDone,'pt2Wrong',d.wrongDone?'Yanlışları Aç':'Yanlışlarıma Dön',!d.testDone||!mistakes)
    ].join('');
  }
  function render(){
    const f=focus(),d=ensureDaily(f),baseInfo=modeInfo[d.mode]||modeInfo.diagnostic,info=d.testDone?{...baseInfo,label:d.wrongDone?'Bugünkü çalışma tamam':'Sonucuna bakalım',title:d.wrongDone?'Bugünkü çalışmanı tamamladın':'Çalışmanı değerlendirdim'}:baseInfo,count=usableCount(f,d),perf=recent(f),topicTest=topicTestInsight(f),selfMini=selfMiniInsight(f),memory=memoryFor(f),nextMemoryMode=memory?(window.YKSTeacherPilotV1?.resumeMode?.({previousMode:memory.previousMode,nextMode:memory.nextMode,nextReviewDate:memory.nextReview?.dateKey,today:today(),closureComplete:memory.closureComplete})||memory.nextMode):'',tasks=stepsHtml(f,d,count),total=(tasks.match(/class="pt2-task/g)||[]).length,done=(tasks.match(/class="pt2-task done/g)||[]).length,goal=Number(state.profile?.goal||10),todayQ=todayQuestions(),performanceHtml=topicTest?topicTest.recentTests.map(x=>`<span class="pt2-perf">${x.questionCount} soru • ${x.correct}D ${x.wrong}Y ${x.blank}B • %${x.accuracy} • ${esc(x.dateKey)}</span>`).join(''):perf.map(x=>`<span class="pt2-perf ${x.result==='correct'?'ok':'bad'}">${x.result==='correct'?'✓':'✕'} ${new Date(x.timestamp||Date.now()).toLocaleDateString('tr-TR',{day:'2-digit',month:'2-digit'})}</span>`).join('');
    root.innerHTML=`<div class="screen-head"><button class="back" data-go="home">←</button><h1>Kişisel Öğretmenim</h1></div><div class="pt2"><div class="pt2-hero"><div><div class="pt2-chips"><span class="pt2-chip">${esc(`${f.exam} ${f.subject}`)}</span><span class="pt2-chip green">${esc(info.label)}</span></div><h2>${esc(f.topic)}</h2><p><b>${esc(info.title)}.</b> ${esc(reason(f,d))}</p></div><div class="pt2-progress"><b>${done}/${total}</b><small>bugünkü plan</small><div class="pt2-bar"><i style="width:${total?Math.round(done/total*100):100}%"></i></div></div></div><div class="pt2-main"><div class="pt2-card"><div class="pt2-head"><h3>Bugünkü Çalışma</h3><small>Gerçek sorular ve gerçek yanlışlar</small></div><div class="pt2-tasks">${tasks}</div></div><div class="pt2-card"><div class="pt2-head"><h3>Öğretmenin Değerlendirmesi</h3></div><div class="pt2-metrics"><div class="pt2-metric"><b>${f.score==null?'—':`%${f.score}`}</b><small>ölçümlü başarı</small></div><div class="pt2-metric"><b>${Number(f.recentWrong||0)}</b><small>yakın yanlış</small></div><div class="pt2-metric"><b>${todayQ}/${goal}</b><small>bugünkü soru yükü</small></div></div>${selfMini?`<div class="pt2-note"><b>Kendi çözdüğün Mini Test:</b> ${Number(selfMini.count)||0} soru • ${Number(selfMini.correct)||0}D ${Number(selfMini.wrong)||0}Y ${Number(selfMini.unable)||0} yapamadım • %${Number(selfMini.percent)||0}. Öğretmenin bu sonucu sonraki kararında kullanacak.</div>`:''}${topicTest?`<div class="pt2-note"><b>Son konu testlerin:</b> ${topicTest.totalTests} test • ${topicTest.totalQuestions} soru • ${topicTest.correct}D ${topicTest.wrong}Y ${topicTest.blank}B • %${topicTest.accuracy}.</div>`:''}${memory?.nextReview?.dateKey?`<div class="pt2-note"><b>Sonraki kontrol:</b> ${esc(memory.nextReview.dateKey)} • ${esc(modeInfo[nextMemoryMode]?.label||nextMemoryMode)}. Kapanmamış yanlış varsa öğretmen tarihi beklemez.</div>`:''}</div></div>${performanceHtml?`<div class="pt2-details"><details><summary>Son çalışmalarımı göster</summary><div class="pt2-perfs">${performanceHtml}</div></details></div>`:''}</div>`;
    const guidanceText=root.querySelector('.pt2-hero h2 + p');
    if(guidanceText){const guidance=document.createElement('div');guidance.className='pt2-guidance';guidance.innerHTML='<span class="pt2-guidance-label">Öğretmeninden bugünkü not</span>';guidance.appendChild(guidanceText);root.querySelector('.pt2-hero h2')?.insertAdjacentElement('afterend',guidance)}
    const reward=rewardSummary(),praise=state.teacher?.lastPraise,card=document.createElement('div');card.className='pt2-note';card.innerHTML=`<b>⭐ ${reward.points} Emek Puanı • ${esc(reward.title)}</b><br>${praise?esc(praiseText(praise.praiseId)):'İlk gerçek çalışma davranışından sonra öğretmenin takdiri burada görünecek.'}`;root.querySelector('.pt2-hero')?.insertAdjacentElement('afterend',card);
    if(d.sessionDone&&d.mode!=='complete'){
      const next=nextTopicAfter(f),goalReached=todayQ>=goal,box=document.createElement('div');box.className='pt2-next';box.innerHTML=`<div class="pt2-next-copy"><span class="pt2-next-icon">✓</span><div><h3>${goalReached?'Bugünkü hedefini tamamladın!':'Harika, bu görevi tamamladın!'}</h3><p>${goalReached?'Öğretmenin bugün yeni soru yükü vermeyecek. Çalışmanı başarıyla sonlandırabilirsin.':next?`Sıradaki çalışma: <b>${esc(`${next.exam} ${next.subject} • ${next.topic}`)}</b>. Öğretmenin yeni planı hazır.`:'Bugünkü öğretmen çalışmasını başarıyla tamamladın.'}</p></div></div><button id="pt2Continue">${goalReached?'Bugünkü Çalışmayı Tamamla →':next?'Sıradaki Göreve Geç →':'Çalışmayı Tamamla →'}</button>`;root.querySelector('.pt2-main')?.insertAdjacentElement('afterend',box);box.querySelector('#pt2Continue').onclick=()=>continueTeacherDay(f,next,goalReached)
    }
    root.querySelector('[data-go="home"]').onclick=()=>go('home');
    if(d.mode==='complete'){const wrong=root.querySelector('#pt2Wrong');if(wrong)wrong.onclick=()=>go('wrong')}
    setTimeout(()=>window.refreshSourceSetTracking?.(),0);
  }
  function install(tries=0){
    if(!window.getStudentStrategy){if(tries<80)setTimeout(()=>install(tries+1),80);return}
    window.__teacherPolicyPending=false;
    window.renderTeacher=render;try{renderTeacher=render}catch{};if(root.classList.contains('active'))render();setTimeout(()=>{try{window.renderHome?.()}catch{}},40);
  }
  install();
})();
