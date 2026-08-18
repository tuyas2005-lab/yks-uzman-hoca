(()=>{
  const n=s=>String(s||'').toLocaleLowerCase('tr-TR').replace(/[^a-z0-9çğıöşü]+/g,' ').trim();
  function setPrefill(subject='',topic=''){
    state.miniTests??={history:[]};state.miniTests.prefillSubject=subject||state.miniTests.prefillSubject||'';state.miniTests.prefillTopic=topic||'';save();
  }
  function applyMiniPrefill(tries=0){
    const subject=state.miniTests?.prefillSubject||'',topic=state.miniTests?.prefillTopic||'';if(!subject&&!topic)return;
    const mode=document.querySelector('#tests [data-mt-mode="topic"]');if(!mode){if(tries<12)setTimeout(()=>applyMiniPrefill(tries+1),100);return}
    mode.click();
    setTimeout(()=>{
      const exam=document.getElementById('mtExam'),sub=document.getElementById('mtSubject'),top=document.getElementById('mtTopic');if(!exam||!sub)return;
      const examVal=/\bAYT\b/i.test(subject)?'AYT':'TYT';exam.value=examVal;exam.dispatchEvent(new Event('change',{bubbles:true}));
      const cleaned=n(subject).replace(/^tyt /,'').replace(/^ayt /,'');
      const opt=[...sub.options].find(o=>n(o.textContent)===cleaned||cleaned.includes(n(o.textContent))||n(o.textContent).includes(cleaned));if(opt){sub.value=opt.value;sub.dispatchEvent(new Event('change',{bubbles:true}))}
      if(topic&&top){const to=[...top.options].find(o=>n(o.textContent)===n(topic));if(to)top.value=to.value}
      state.miniTests.prefillSubject='';state.miniTests.prefillTopic='';save();
    },30);
  }

  document.addEventListener('click',e=>{
    const task=e.target.closest('#dailyPlan [data-home-task]');
    if(task){const title=task.querySelector('strong')?.textContent||'';if(/mini test/i.test(title)){const topic=title.split('•').slice(1).join('•').trim();const metric=window.getLearningSnapshot?.().metrics.find(x=>x.topic===topic);setPrefill(metric?.subject||'',topic)}}
    const subjectBtn=e.target.closest('#home .subject');if(subjectBtn)setPrefill(subjectBtn.textContent.trim(),'');
  },true);

  if(typeof go==='function'&&!window.__connectedGo){
    const base=go;go=function(id){
      try{window.refreshLearningModel?.()}catch{}
      const r=base(id);
      if(id==='home')setTimeout(()=>window.renderHome?.(),0);
      if(id==='topics')setTimeout(()=>window.renderTopics?.(),0);
      if(id==='stats')setTimeout(()=>window.renderStats?.(),0);
      if(id==='tests')setTimeout(()=>applyMiniPrefill(),0);
      if(id==='teacher')setTimeout(()=>{try{window.renderTeacher?.()}catch{}},0);
      if(id==='coach')setTimeout(()=>{try{window.renderCoach?.()}catch{}},0);
      return r;
    };window.go=go;window.__connectedGo=true;
  }
})();
const fieldTrackScript=document.createElement('script');fieldTrackScript.src='/app-field-track.js?v=1';fieldTrackScript.onload=()=>{const low=document.createElement('script');low.src='/app-low-cost.js?v=1';low.onload=()=>{const fix=document.createElement('script');fix.src='/app-low-cost-fix.js?v=1';document.body.appendChild(fix)};document.body.appendChild(low)};document.body.appendChild(fieldTrackScript);