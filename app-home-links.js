(()=>{
  const n=s=>String(s||'').toLocaleLowerCase('tr-TR').replace(/[^a-z0-9çğıöşü]+/g,' ').trim();
  function setPrefill(subject='',topic=''){state.miniTests??={history:[]};state.miniTests.prefillSubject=subject||state.miniTests.prefillSubject||'';state.miniTests.prefillTopic=topic||'';save()}
  function applyMiniPrefill(tries=0){
    const subject=state.miniTests?.prefillSubject||'',topic=state.miniTests?.prefillTopic||'';if(!subject&&!topic)return;
    const mode=document.querySelector('#tests [data-mt-mode="topic"]');if(!mode){if(tries<12)setTimeout(()=>applyMiniPrefill(tries+1),100);return}mode.click();
    setTimeout(()=>{const exam=document.getElementById('mtExam'),sub=document.getElementById('mtSubject'),top=document.getElementById('mtTopic');if(!exam||!sub)return;const examVal=/\bAYT\b/i.test(subject)?'AYT':'TYT';exam.value=examVal;exam.dispatchEvent(new Event('change',{bubbles:true}));const cleaned=n(subject).replace(/^tyt /,'').replace(/^ayt /,'');const opt=[...sub.options].find(o=>n(o.textContent)===cleaned||cleaned.includes(n(o.textContent))||n(o.textContent).includes(cleaned));if(opt){sub.value=opt.value;sub.dispatchEvent(new Event('change',{bubbles:true}))}if(topic&&top){const to=[...top.options].find(o=>n(o.textContent)===n(topic));if(to)top.value=to.value}state.miniTests.prefillSubject='';state.miniTests.prefillTopic='';save()},30);
  }
  document.addEventListener('click',e=>{const task=e.target.closest('#dailyPlan [data-home-task]');if(task){const title=task.querySelector('strong')?.textContent||'';if(/mini test|seviye ölçümü/i.test(title)){const topic=title.split('•').slice(1).join('•').trim();const metric=window.getLearningSnapshot?.().metrics?.find(x=>x.topic===topic);setPrefill(metric?`${metric.exam} ${metric.subject}`:'',topic)}}const subjectBtn=e.target.closest('#home .subject');if(subjectBtn)setPrefill(subjectBtn.textContent.trim(),'')},true);
  if(typeof go==='function'&&!window.__connectedGo){const base=go;go=function(id){try{window.YKSDataV5?.syncLegacy?.();window.refreshLearningModel?.()}catch{}const r=base(id);if(id==='home')setTimeout(()=>window.renderHome?.(),0);if(id==='topics')setTimeout(()=>window.renderTopics?.(),0);if(id==='wrong'){setTimeout(()=>window.renderWrong?.(),0);setTimeout(()=>window.renderWrongV2?.(),10)}if(id==='stats')setTimeout(()=>window.renderStats?.(),0);if(id==='tests')setTimeout(()=>applyMiniPrefill(),0);if(id==='teacher')setTimeout(()=>{try{window.renderTeacher?.()}catch{}},0);if(id==='coach')setTimeout(()=>{try{window.renderCoach?.()}catch{}},0);return r};window.go=go;window.__connectedGo=true}
})();
function loadScript(src,onload){const s=document.createElement('script');s.src=src;s.onload=onload||null;document.body.appendChild(s)}
(function bootV5Deps(tries=0){
  if(!window.YKSDataV5){if(tries<100)setTimeout(()=>bootV5Deps(tries+1),40);return}
  loadScript('/app-live-status.js?v=1');
  loadScript('/app-favorites-nav-fix.js?v=1');
  loadScript('/app-topic-ui.js?v=1');
  loadScript('/app-wrongs-v2.js?v=1',()=>loadScript('/app-wrong-review-task.js?v=1',()=>loadScript('/app-wrong-review-id-fix.js?v=1')));
  loadScript('/app-field-track.js?v=2',()=>{
    loadScript('/app-low-cost.js?v=2',()=>loadScript('/app-low-cost-fix.js?v=2'));
    loadScript('/app-teacher-performance.js?v=2');
    loadScript('/app-stats-v2.js?v=2');
    loadScript('/app-strategy-engine.js?v=2');
  });
})();
