(()=>{
  const C=()=>window.YKSQuestionCatalogV1;
  const D=()=>window.YKSDataV5;
  let active=null,selected='',committing=false;

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
      active={item,ctx,position:pos.position,total:pos.total};selected='';committing=false;
      const r=base(item,ctx);
      setTimeout(decoratePosition,0);
      return r;
    };
    wrapped.__retakePositionWrapped=true;
    window.openSourceQuestion=wrapped;
  }

  function matchingEvents(id){return (state.studyEvents||[]).filter(x=>x?.source==='source-question-result'&&x?.meta?.catalogId===id)}
  function resolveOlderWrong(ev,now){
    if(!ev?.meta?.wrongRecord)return;
    const meta={...(ev.meta||{}),wrongRecord:false,wrongResolvedAt:now,resolvedByRetake:true};
    try{D()?.patch?.(ev.id,{meta})}catch{ev.meta=meta}
  }
  function patchNewEvent(ev,item,kind,studentAnswer){
    if(!ev)return;
    const wrong=kind!=='correct';
    const meta={...(ev.meta||{}),catalogId:item.id,studentAnswer:studentAnswer||'',correctAnswer:item.answerKey||item.answer||'',wrongRecord:wrong,wrongKind:wrong?kind:'',retake:true,retakeAt:Date.now()};
    try{D()?.patch?.(ev.id,{meta})}catch{ev.meta=meta}
  }
  function appendAttempt(item,kind,studentAnswer){
    const wrong=kind!=='correct',answer=item.answerKey||item.answer||'';
    const meta={catalogId:item.id,provider:item.provider,providerLabel:item.providerLabel,collection:item.collection,questionNo:item.questionNo,url:item.access?.url,visual:item.visual,sourceYear:item.year||null,wrongRecord:wrong,wrongKind:wrong?kind:'',externalQuestion:true,studentAnswer:studentAnswer||'',correctAnswer:answer,asset:item.asset,retake:true,retakeAt:Date.now(),question:{text:`${item.providerLabel||item.provider||''} ${item.year||''} ${item.exam||''} • ${item.topic||''} • Soru ${item.questionNo||''}`.trim(),image:''},solution:{answer,shortSolution:'Çözümü uygulamadaki Kaynak Soru ekranından tekrar incele.',curriculumOutcome:(item.subtopics||[]).join(' • ')}};
    try{return D()?.record?.({source:'source-question-result',exam:item.exam,subject:item.subject,topic:item.topic,curriculumOutcome:(item.subtopics||[]).join(' • '),result:kind==='correct'?'correct':kind==='wrong'?'wrong':'unknown',difficulty:item.difficulty||'',interaction:kind==='unable'?'unable':'answered-source',questionCount:1,signals:wrong?[kind==='unable'?'unable':'wrong']:['correct-source'],meta},{persistNow:true})}catch{return null}
  }

  function commitAttempt(kind){
    if(committing||!active?.item)return;committing=true;
    const item=active.item,id=item.id,answer=String(item.answerKey||item.answer||'').toUpperCase();
    const student=kind==='unable'?'':selected;
    const before=matchingEvents(id),beforeIds=new Set(before.map(x=>x.id)),started=Date.now();
    setTimeout(()=>{
      const now=Date.now(),all=matchingEvents(id),fresh=all.find(x=>!beforeIds.has(x.id))||null;
      before.forEach(ev=>resolveOlderWrong(ev,now));
      if(fresh)patchNewEvent(fresh,item,kind,student);
      else appendAttempt(item,kind,student);
      try{save()}catch{}
      setTimeout(()=>{try{window.refreshSourceSetTracking?.();window.renderWrongV2?.();window.renderStats?.()}catch{}},40);
      active.lastCommit={kind,student,answer,started};
    },90);
  }

  document.addEventListener('click',e=>{
    const a=e.target.closest('#sourceQuestion [data-sq-answer]');
    if(a){selected=String(a.dataset.sqAnswer||'').toUpperCase();return}
    if(e.target.closest('#sourceQuestion #sqCheck')){
      if(!active?.item||!selected)return;
      const answer=String(active.item.answerKey||active.item.answer||'').toUpperCase();
      commitAttempt(selected===answer?'correct':'wrong');
      return;
    }
    if(e.target.closest('#sourceQuestion #sqUnable'))commitAttempt('unable');
  },true);

  wrapOpen();
})();
