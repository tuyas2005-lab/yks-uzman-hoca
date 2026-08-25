(()=>{
  const D=()=>window.YKSDataV5;
  let active=null;
  const actionResults=new Map();

  const css=document.createElement('style');
  css.textContent=`
    .sq-chip.set-pos{background:#6847ec!important;color:#fff!important;font-size:12px!important;padding:7px 11px!important;box-shadow:0 5px 14px rgba(104,71,236,.18)}
    .sq-chip.source-pos{background:#fff4df!important;color:#80540d!important;font-size:12px!important;padding:7px 11px!important}
  `;
  document.head.appendChild(css);

  function setInfo(ctx){
    if(ctx?.type!=='mini'||!ctx.card)return{position:0,total:0};
    const cards=[...document.querySelectorAll('#tests .mts-q')];
    const i=cards.indexOf(ctx.card);
    return{position:i>=0?i+1:0,total:cards.length};
  }

  function decoratePosition(){
    const meta=document.querySelector('#sourceQuestion #sqRoot .sq-meta');
    if(!meta||!active?.item)return;
    meta.querySelectorAll('.set-pos,.source-pos').forEach(x=>x.remove());
    if(active.position&&active.total){
      const a=document.createElement('span');a.className='sq-chip set-pos';a.textContent=`📚 Sette ${active.position}/${active.total}`;meta.prepend(a);
    }
    const b=document.createElement('span');b.className='sq-chip source-pos';b.textContent=`Kaynakta ${active.item.questionNo||'—'}. soru`;meta.appendChild(b);
  }

  function wrapOpen(tries=0){
    const base=window.openSourceQuestion;
    if(typeof base!=='function'){if(tries<100)setTimeout(()=>wrapOpen(tries+1),60);return}
    if(base.__retakePositionWrapped)return;
    const wrapped=function(item,ctx={}){
      const pos=setInfo(ctx);
      active={item,ctx,position:pos.position,total:pos.total};
      const r=base(item,ctx);
      setTimeout(decoratePosition,0);
      return r;
    };
    wrapped.__retakePositionWrapped=true;
    window.openSourceQuestion=wrapped;
  }

  function matchingEvents(id){
    return (state.studyEvents||[])
      .filter(x=>x?.source==='source-question-result'&&x?.meta?.catalogId===id)
      .slice()
      .sort((a,b)=>Number(a.timestamp||a.createdAt||0)-Number(b.timestamp||b.createdAt||0));
  }

  const isOpenWrong=ev=>ev?.meta?.wrongRecord===true&&!ev?.meta?.wrongClosed;
  const isRecoverableLegacyWrong=ev=>ev?.meta?.resolvedByRetake===true&&!ev?.meta?.wrongClosed&&ev?.result!=='correct';

  function patchMeta(ev,changes){
    if(!ev)return null;
    const meta={...(ev.meta||{}),...changes};
    try{return D()?.patch?.(ev.id,{meta})||null}catch{ev.meta=meta;return ev}
  }

  function canonicalWrong(catalogId,preferredId=''){
    const candidates=matchingEvents(catalogId).filter(ev=>isOpenWrong(ev)||isRecoverableLegacyWrong(ev));
    if(!candidates.length)return null;
    const preferred=candidates.find(ev=>ev.id===preferredId);
    const canonical=preferred||candidates.slice().sort((a,b)=>Number(!!a.meta?.retake)-Number(!!b.meta?.retake)||Number(a.timestamp||0)-Number(b.timestamp||0))[0];
    if(!isOpenWrong(canonical))patchMeta(canonical,{wrongRecord:true,wrongClosed:false,resolvedByRetake:false,legacyRetakeRecovered:true});
    candidates.filter(ev=>ev.id!==canonical.id&&isOpenWrong(ev)).forEach(ev=>patchMeta(ev,{wrongRecord:false,retry:true,retryOf:canonical.id,duplicateWrongNormalizedAt:Date.now()}));
    return (state.studyEvents||[]).find(ev=>ev?.id===canonical.id)||canonical;
  }

  function buildMeta(item,kind,studentAnswer,{isRetry,retryOf,ownsWrong,at}){
    const wrong=kind!=='correct',answer=item.answerKey||item.answer||'';
    const pilot=window.YKSTeacherPilotV1?.resolveItem?.(item),task=state.miniTests?.teacherTask,itemIds=task?.itemIds||[],teacherTask=!!(task?.sessionId&&itemIds.includes(item.id));
    const meta={catalogId:item.id,provider:item.provider,providerLabel:item.providerLabel,collection:item.collection,questionNo:item.questionNo,url:item.access?.url,visual:item.visual,sourceYear:item.year||null,topicId:pilot?.id||item.topicKey||'',wrongRecord:ownsWrong,wrongKind:wrong?kind:'',externalQuestion:true,studentAnswer:studentAnswer||'',correctAnswer:answer,asset:item.asset,question:{text:`${item.providerLabel||item.provider||''} ${item.year||''} ${item.exam||''} • ${item.topic||''} • Soru ${item.questionNo||''}`.trim(),image:''},solution:{answer,shortSolution:'Çözümü uygulamadaki Kaynak Soru ekranından tekrar incele.',curriculumOutcome:(item.subtopics||[]).join(' • ')}};
    if(teacherTask){meta.teacherTask=true;meta.teacherSessionId=task.sessionId;meta.teacherDecisionId=task.decisionId||''}
    if(ownsWrong)meta.wrongClosed=false;
    if(isRetry){meta.retake=true;meta.retakeAt=at;if(retryOf)meta.retryOf=retryOf}
    return meta;
  }

  function recordAttempt(item,kind,studentAnswer='',ctx={}){
    if(!item?.id||!['correct','wrong','unable'].includes(kind))return null;
    const actionId=String(ctx?.actionId||'');
    if(actionId&&actionResults.has(actionId))return actionResults.get(actionId);
    const previous=matchingEvents(item.id),canonical=canonicalWrong(item.id,String(ctx?.wrongId||''));
    const isRetry=previous.length>0||ctx?.type==='wrong';
    const retryOf=isRetry?(canonical?.id||previous[0]?.meta?.retryOf||previous[0]?.id||''):'';
    const wrong=kind!=='correct',ownsWrong=wrong&&!canonical,at=Date.now();
    const meta=buildMeta(item,kind,studentAnswer,{isRetry,retryOf,ownsWrong,at});
    let event=null;
    try{event=D()?.record?.({source:'source-question-result',exam:item.exam,subject:item.subject,topic:item.topic,topicKey:meta.topicId||'',curriculumOutcome:(item.subtopics||[]).join(' • '),result:kind==='correct'?'correct':kind==='wrong'?'wrong':'unknown',difficulty:item.difficulty||'',interaction:kind==='unable'?'unable':'answered-source',questionCount:1,signals:wrong?[kind==='unable'?'unable':'wrong']:['correct-source'],meta},{persistNow:true})||null}catch(e){console.error('Kaynak soru sonucu kaydedilemedi',e);return null}
    if(!event)return null;
    if(actionId)actionResults.set(actionId,event);
    if(kind==='correct'&&canonical){
      if(typeof window.closeWrongRecord==='function')window.closeWrongRecord(canonical.id,'retry-correct',{eventId:event.id});
      else console.error('Canonical yanlış kapatma API hazır değil; yanlış açık bırakıldı.',canonical.id);
    }
    if(kind==='correct'&&!canonical){
      const normSkill=s=>String(s||'').toLocaleLowerCase('tr-TR').replace(/[^a-z0-9çğıöşü]+/g,' ').trim(),skills=new Set((item.subtopics||[]).map(normSkill).filter(Boolean));
      const open=(state.studyEvents||[]).filter(x=>{if(!(x?.meta?.wrongRecord===true&&!x?.meta?.wrongClosed&&x.meta?.catalogId!==item.id&&x.exam===item.exam&&x.subject===item.subject&&x.topic===item.topic))return false;const wrongSkills=String(x.meta?.solution?.curriculumOutcome||x.curriculumOutcome||'').split('•').map(normSkill).filter(Boolean);return skills.size&&wrongSkills.length?[...skills].some(s=>wrongSkills.includes(s)):true});
      open.forEach(x=>window.markWrongLearningEvidence?.(x.id,{wrongSimilarCorrectAt:at,wrongSimilarCorrectEventId:event.id,wrongSimilarCatalogId:item.id}))
    }
    if(meta.teacherTask&&window.YKSTeacherPilotV1){
      const P=window.YKSTeacherPilotV1,difficulty=String(item.difficulty||'').toLocaleUpperCase('tr-TR'),behaviors={attempt:true,correct:kind==='correct',mediumCorrect:kind==='correct'&&difficulty==='ORTA',hardCorrect:kind==='correct'&&difficulty==='ZOR',unableHonest:kind==='unable',wrongRecovered:kind==='correct'&&!!canonical};
      try{const reward=P.buildRewardEvent({rewardId:`${meta.teacherSessionId}:${event.id}`,sessionId:meta.teacherSessionId,dateKey:D()?.todayKey?.(),topicId:meta.topicId,behaviors});const saved=P.recordOnce(reward),teacherReward={...reward.meta,duplicate:saved.duplicate};event.meta={...(event.meta||{}),teacherReward};patchMeta(event,{teacherReward});state.teacher??={};state.teacher.lastPraise={...teacherReward,at:Date.now()}}catch(e){console.warn('Öğretmen ödülü kaydedilemedi',e)}
    }
    try{window.refreshSourceSetTracking?.();window.renderWrongV2?.();window.renderStats?.();window.renderHome?.()}catch{}
    return event;
  }

  window.recordSourceQuestionAttempt=recordAttempt;

  wrapOpen();
})();
