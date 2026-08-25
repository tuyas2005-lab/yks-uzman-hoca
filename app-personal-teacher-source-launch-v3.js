(()=>{
  const D=()=>window.YKSDataV5,C=()=>window.YKSQuestionCatalogV1;
  const norm=s=>D()?.norm?.(s)||String(s||'').toLocaleLowerCase('tr-TR').replace(/[^a-z0-9çğıöşü]+/g,' ').trim();
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const today=()=>D()?.todayKey?.()||new Date().toLocaleDateString('sv-SE');
  const hash=s=>{let h=2166136261;for(const c of String(s||'')){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return(h>>>0).toString(36)};
  let timer=0,painting=false;

  function context(){
    const hero=document.querySelector('#teacher .pt2-hero');if(!hero)return null;
    const topic=hero.querySelector('h2')?.textContent?.trim()||'',
      chip=hero.querySelector('.pt2-chip')?.textContent?.trim()||'',
      p=chip.split(/\s+/),exam=p.shift()||'',subject=p.join(' ');
    return exam&&subject&&topic?{exam,subject,topic}:null
  }

  function sourceHealth(ctx){
    const P=window.YKSTeacherPilotV1,pilot=P?.resolveTopic?.(ctx),catalog=C(),solved=catalog?.getSolvedIds?.()||new Set();
    if(!pilot||!catalog?.all)return null;
    const visible=typeof window.isStudentVisibleQuestion==='function'?window.isStudentVisibleQuestion:()=>true,rows=catalog.all().filter(visible).filter(x=>P.resolveItem?.(x)?.id===pilot.id),remaining=rows.filter(x=>!solved.has(x.id)),counts=remaining.reduce((a,x)=>{const k=String(x.difficulty||'').toLocaleUpperCase('tr-TR').replace('İ','I');if(k in a)a[k]++;return a},{KOLAY:0,ORTA:0,ZOR:0});
    return{...P.poolHealth(counts),topicId:pilot.id,totalRows:rows.length,solved:rows.length-remaining.length}
  }

  function healthCard(root,p){
    const h=p.health,host=root.querySelector('.pt2-details');if(!h||!host)return;
    const current=root.querySelector('[data-pt3-health]');
    if(h.overall==='green'){current?.remove();return}
    const labels={KOLAY:'Kolay',ORTA:'Orta',ZOR:'Zor'},colors={green:['#eaf7ef','#197249'],yellow:['#fff8dd','#8a6500'],orange:['#fff1df','#a35400'],red:['#fff0f1','#b73845']},levelText={green:'Yeterli',yellow:'Erken uyarı',orange:'Yüksek öncelik',red:'Kritik'},alerts=h.alerts.map(x=>`${labels[x.difficulty]} ${x.remaining}`).join(' • '),advice=h.overall==='green'?'Bu konu ve tüm zorluk seviyelerinde kaynak normal kullanım için yeterli.':h.overall==='yellow'?`Erken kaynak uyarısı: ${alerts}. Yeni doğrulanmış kaynak ekleme planına alınmalı.`:h.overall==='orange'?`Yeni kaynak yüksek öncelik: ${alerts}. Havuz bitmeden ekleme yapılmalı.`:`Kritik kaynak uyarısı: ${alerts}. Eksik zorluk düzeyinde yeni ölçüm seti açılmayacak ve daha kolay soruyla doldurulmayacak.`;
    const signature=hash(JSON.stringify({topicId:h.topicId,totalRows:h.totalRows,solved:h.solved,total:h.total,overall:h.overall,cells:h.cells}));
    if(current?.dataset.pt3Signature===signature)return;
    const wasOpen=!!current?.open,card=document.createElement('details');card.dataset.pt3Health='1';card.dataset.pt3Signature=signature;card.open=wasOpen;card.style.gridColumn='1 / -1';card.innerHTML=`<summary>⚠️ Bu konuda kaynak azalıyor • ${h.total} soru kaldı</summary><div class="pt2-health-grid">${Object.entries(h.cells).map(([k,x])=>{const c=colors[x.level];return`<div style="padding:10px;border-radius:12px;background:${c[0]};color:${c[1]}"><small>${labels[k]}</small><br><b>${x.remaining} çözülmemiş</b></div>`}).join('')}</div><div class="pt2-note"><b>${levelText[h.overall]}:</b> ${esc(advice)}<br>Yeni kaynak eklenene kadar öğretmen eksik zorluk düzeyini daha kolay soruyla doldurmayacak.</div>`;if(current)current.replaceWith(card);else host.prepend(card)
  }

  function plan(ctx){
    const desired=1;
    const P=window.YKSTeacherPilotV1,pilot=P?.resolveTopic?.(ctx);if(!pilot)return{items:[],count:0,desired,mode:'blocked',shortages:{PILOT:1},distributionExact:false};
    const poolTopic=pilot.poolTopics?.[0]||pilot.displayTitle;let exact=[];try{exact=C()?.findNextBatch?.({...ctx,topic:poolTopic,visualPreferred:true},30)||[]}catch{}
    const mode=state.teacher?.daily?.mode||'diagnostic',available=exact.reduce((a,x)=>{const k=String(x.difficulty||'').toLocaleUpperCase('tr-TR').replace('İ','I');if(k in a)a[k]++;return a},{KOLAY:0,ORTA:0,ZOR:0}),step=P?.decideAdaptiveStep?.({mode,attempts:[],available}),item=exact.find(x=>String(x.difficulty||'').toLocaleUpperCase('tr-TR').replace('İ','I')===step?.selectedDifficulty)||null;
    return{items:item?[item]:[],pool:exact,count:item?1:0,desired,mode,difficultyCounts:item?{[step.selectedDifficulty]:1}:{},pilot,poolTopic,health:sourceHealth(ctx),step,distributionExact:!!item,shortages:item?{}:{[step?.targetDifficulty||'KAYNAK']:1}}
  }

  function adapt(){
    if(painting)return;painting=true;
    try{
      const root=document.getElementById('teacher');if(!root)return;
      const d=state.teacher?.daily||{},ctx=context();if(!ctx)return;
      const old=root.querySelector('#pt2Test'),task=old?.closest('.pt2-task');
      if(old){
        old.id='pt3Test';
        const h=task?.querySelector('h4');
        if(h)h.textContent=d.desiredCount===3?'Kaynak Sorularla Kısa Kontrol':'Kaynak Sorularla Ölçüm'
      }
      const p=plan(ctx),btn=root.querySelector('#pt3Test'),t=btn?.closest('.pt2-task');
      healthCard(root,p);
      if(p.health?.alerts?.length){try{const P=window.YKSTeacherPilotV1,shortages=Object.fromEntries(p.health.alerts.map(x=>[x.difficulty,x.neededForGreen])),warningId=`${today()}-${p.pilot.id}-health-${hash(JSON.stringify(p.health.counts))}`;P.recordOnce(P.buildPoolWarningEvent({warningId,dateKey:today(),topicId:p.pilot.id,mode:p.mode,requested:{KOLAY:15,ORTA:15,ZOR:15},available:p.health.counts,shortages,severity:p.health.overall}))}catch(e){console.warn('Teacher Pool sağlık uyarısı kaydedilemedi',e)}}
      if(!p.distributionExact&&p.pilot&&Object.keys(p.shortages||{}).length){try{const P=window.YKSTeacherPilotV1,warningId=`${today()}-${p.pilot.id}-${p.mode}-${hash(JSON.stringify(p.shortages))}`;P.recordOnce(P.buildPoolWarningEvent({warningId,dateKey:today(),topicId:p.pilot.id,mode:p.mode,requested:p.difficultyCounts,available:p.actualDifficultyCounts,shortages:p.shortages,severity:'orange'}))}catch(e){console.warn('Teacher Pool uyarısı kaydedilemedi',e)}}
      if(btn&&!t?.classList.contains('done')){
        btn.textContent=p.count?'Özel Derse Başla':'Kaynak Yok';
        btn.disabled=!p.count||t.classList.contains('locked');
        const desc=t?.querySelector('p');
        if(desc)desc.textContent=p.count?'Öğretmenin her cevabından sonra ilerleyişini değerlendirip sıradaki soruyu seçecek.':p.mode==='blocked'?'Bu konu Limited Pilot kapsamında değil; öğretmen görev açmayacak.':'Bu konu için çözülmemiş ve doğrulanmış kaynak sorusu kalmadı.'
      }
      if(d.mode==='complete'){
        const w=root.querySelector('#pt2Wrong');
        if(w){w.id='pt3GeneralWrong';w.disabled=false;w.onclick=()=>go('wrong')}
      }
    }finally{painting=false}
  }

  function choose(el,value){
    if(!el)return false;
    const n=norm(value),
      o=[...el.options].find(x=>norm(x.value)===n||norm(x.textContent)===n)
        ||[...el.options].find(x=>norm(x.value).includes(n)||n.includes(norm(x.value)));
    if(!o)return false;
    if(el.value!==o.value){
      el.value=o.value;
      el.dispatchEvent(new Event('change',{bubbles:true}));
      return false
    }
    return true
  }

  function launch(ctx,p){
    if(!p.count||!p.distributionExact)return;
    const P=window.YKSTeacherPilotV1,topic=P?.resolveTopic?.(ctx.topic),daily=state.teacher?.daily||{},revision=hash(`${Date.now()}|${p.items[0].id}`),sessionId=`pt3-${today()}-${topic?.id||norm(ctx.topic)}-${revision}`,decisionId=`${sessionId}-q1`;
    if(P&&topic){
      const event=P.buildDecisionEvent({decisionId,sessionId,dateKey:today(),topicId:topic.id,mode:daily.mode||'diagnostic',reasonCodes:['adaptive-session-start',...(p.step?.reasonCodes||[])],reasonText:daily.reasonText||'',evidence:{...(daily.decisionEvidence||{}),adaptive:true,answerIndex:0,sourceHealth:p.health?{total:p.health.total,counts:p.health.counts,overall:p.health.overall}:{}},selection:{questionIds:[p.items[0].id],difficultyCounts:{KOLAY:p.step.selectedDifficulty==='KOLAY'?1:0,ORTA:p.step.selectedDifficulty==='ORTA'?1:0,ZOR:p.step.selectedDifficulty==='ZOR'?1:0},total:1}});
      P.recordOnce(event)
    }
    state.teacher??={};state.teacher.adaptiveSession={date:today(),topic:ctx.topic,topicId:topic?.id||'',exam:ctx.exam,subject:ctx.subject,sessionId,decisionId,mode:daily.mode||'diagnostic',startedAt:Date.now(),status:'active',currentQuestionId:p.items[0].id,seenQuestionIds:[p.items[0].id],attempts:[],sourceHealth:p.health||{}};
    if(state.teacher?.daily){
      state.teacher.daily.testLaunchedAt=Date.now();
      state.teacher.daily.teacherExam=ctx.exam;
      state.teacher.daily.teacherSubject=ctx.subject;
      state.teacher.daily.teacherTopic=ctx.topic;
      state.teacher.daily.teacherSetItemIds=[p.items[0].id]
    }
    save();window.openSourceQuestion?.(p.items[0],{type:'teacher-adaptive',teacherDirected:true,teacherSessionId:sessionId,returnScreen:'teacher'})
  }

  function activeSession(){const s=state.teacher?.adaptiveSession;return s?.status==='active'?s:null}
  function availablePool(s){const P=window.YKSTeacherPilotV1,topic=P?.resolveTopic?.(s.topicId),seen=new Set(s.seenQuestionIds||[]),solved=C()?.getSolvedIds?.()||new Set(),visible=typeof window.isStudentVisibleQuestion==='function'?window.isStudentVisibleQuestion:()=>true;return(C()?.all?.()||[]).filter(visible).filter(x=>P.resolveItem?.(x)?.id===topic?.id&&!seen.has(x.id)&&!solved.has(x.id))}
  function counts(rows){return rows.reduce((a,x)=>{const k=String(x.difficulty||'').toLocaleUpperCase('tr-TR').replace('İ','I');if(k in a)a[k]++;return a},{KOLAY:0,ORTA:0,ZOR:0})}
  function afterAnswer(event,item,kind){const s=activeSession();if(!s||s.currentQuestionId!==item.id)return null;s.attempts.push({eventId:event.id,questionId:item.id,result:kind,interaction:kind==='unable'?'unable':'answered-source',difficulty:String(item.difficulty||'').toLocaleUpperCase('tr-TR'),at:Date.now()});const pool=availablePool(s),goal=Math.max(1,Number(state.profile?.goal||10)),todayCount=(state.studyEvents||[]).filter(x=>x?.dateKey===today()&&x?.source==='source-question-result').length,step=window.YKSTeacherPilotV1.decideAdaptiveStep({mode:s.mode,attempts:s.attempts,available:counts(pool),dailyRemaining:Math.max(0,goal-todayCount)});s.nextStep=step;save();return step}
  function nextQuestion(){const s=activeSession();if(!s)return;const pool=availablePool(s),step=window.YKSTeacherPilotV1.decideAdaptiveStep({mode:s.mode,attempts:s.attempts,available:counts(pool),dailyRemaining:999});if(step.action!=='continue')return finishSession(step.action);const item=pool.find(x=>String(x.difficulty||'').toLocaleUpperCase('tr-TR').replace('İ','I')===step.selectedDifficulty);if(!item)return finishSession('source-exhausted');const index=s.attempts.length+1,decisionId=`${s.sessionId}-q${index+1}`,P=window.YKSTeacherPilotV1;P.recordOnce(P.buildDecisionEvent({decisionId,sessionId:s.sessionId,dateKey:s.date,topicId:s.topicId,mode:s.mode,reasonCodes:['adaptive-next-question',...step.reasonCodes],evidence:{adaptive:true,answerIndex:index,previousResult:s.attempts.at(-1)?.result||''},selection:{questionIds:[item.id],difficultyCounts:{KOLAY:step.selectedDifficulty==='KOLAY'?1:0,ORTA:step.selectedDifficulty==='ORTA'?1:0,ZOR:step.selectedDifficulty==='ZOR'?1:0},total:1}}));s.currentQuestionId=item.id;s.decisionId=decisionId;s.seenQuestionIds.push(item.id);save();window.openSourceQuestion?.(item,{type:'teacher-adaptive',teacherDirected:true,teacherSessionId:s.sessionId,returnScreen:'teacher'})}
  function finishSession(reason='student-stop'){const s=activeSession();if(!s)return;const P=window.YKSTeacherPilotV1,a=s.attempts||[],correct=a.filter(x=>x.result==='correct').length,wrong=a.filter(x=>x.result==='wrong').length,unable=a.filter(x=>x.result==='unable').length,accuracy=a.length?Math.round(correct/a.length*100):0,raw=P.decideTeacherSession({total:a.length,score:accuracy,recentWrong:wrong,recentSignals:unable,staleDays:0}),nextMode=P.transitionMode(s.mode,raw.mode),review=P.nextReview({dateKey:s.date,answered:a.length,correct}),completedAt=Date.now(),completion=a.length?P.buildRewardEvent({rewardId:`${s.sessionId}:completed`,sessionId:s.sessionId,dateKey:s.date,topicId:s.topicId,behaviors:{teacherTaskCompleted:true}}):null;P.recordOnce(P.buildOutcomeEvent({sessionId:s.sessionId,decisionId:s.decisionId,dateKey:s.date,topicId:s.topicId,questionIds:a.map(x=>x.questionId),expectedCount:0,answeredCount:a.length,correctCount:correct,wrongCount:wrong,unableCount:unable,accuracy,adaptation:{changed:nextMode!==s.mode,previousMode:s.mode,nextMode,reason},reward:completion?{points:completion.meta.points,awardIds:[`${s.sessionId}:completed`],praiseId:completion.meta.praiseId}:{points:0,awardIds:[],praiseId:''},sourceHealth:{delivered:a.length},nextReview:review}));if(completion){P.recordOnce(completion);state.teacher.lastPraise={...completion.meta,at:completedAt}}state.teacher.topicMemory??={};state.teacher.topicMemory[s.topicId]={topicId:s.topicId,exam:s.exam,subject:s.subject,topic:s.topic,lastSessionDate:s.date,previousMode:s.mode,nextMode,nextReview:review,closureComplete:wrong+unable===0,lastAccuracy:accuracy,lastCompletedAt:completedAt};if(state.teacher.daily){state.teacher.daily.testDone=true;state.teacher.daily.testSummary={count:a.length,correct,wrong,unable,mistakes:wrong+unable,percent:accuracy,finishedAt:completedAt};state.teacher.daily.nextReview=review;state.teacher.daily.nextMode=nextMode}state.teacher.lastSessionSummary={topicId:s.topicId,topic:s.topic,answered:a.length,correct,wrong,unable,accuracy,reason,at:completedAt};s.status='completed';s.completedAt=completedAt;s.endReason=reason;save();go('teacher');setTimeout(()=>window.renderTeacher?.(),0)}
  window.YKSAdaptiveTeacherSession={afterAnswer,nextQuestion,finishSession,activeSession};

  document.addEventListener('click',e=>{
    const b=e.target.closest('#teacher #pt3Test');if(!b||b.disabled)return;
    const ctx=context(),p=ctx?plan(ctx):null;if(!ctx||!p?.count)return;
    e.preventDefault();e.stopImmediatePropagation();launch(ctx,p)
  },true);

  function schedule(){clearTimeout(timer);timer=setTimeout(adapt,60)}
  const root=document.getElementById('teacher');
  if(root)new MutationObserver(ms=>{if(ms.some(m=>m.addedNodes?.length||m.removedNodes?.length))schedule()}).observe(root,{childList:true,subtree:true});
  document.addEventListener('click',e=>{if(e.target.closest('[data-go="teacher"],#mtsFinish'))setTimeout(schedule,80)},true);
  schedule();
})();
