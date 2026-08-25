(()=>{
  const today=()=>window.YKSDataV5?.todayKey?.()||new Date().toLocaleDateString('sv-SE');
  const todayQuestions=()=> (state.studyEvents||[]).filter(x=>x?.dateKey===today()).reduce((a,x)=>a+Number(x.questionCount||0),0);
  const el=id=>document.getElementById(id);
  const num=(id,fallback)=>{const n=Number(el(id)?.value);return Number.isFinite(n)?n:fallback};

  const css=document.createElement('style');
  css.textContent=`
    #settingsSaveStatus{grid-column:1/-1;min-height:20px;margin-top:-2px;font-size:12px;font-weight:800;line-height:1.4;color:var(--muted)}
    #settingsSaveStatus.ok{color:#18764d}#settingsSaveStatus.err{color:#b43843}
    #saveSettings.saved{background:#18885a!important;transform:translateY(0)}
  `;
  document.head.appendChild(css);

  function statusNode(){
    const settings=document.querySelector('#profile .settings');if(!settings)return null;
    let s=el('settingsSaveStatus');if(!s){s=document.createElement('div');s.id='settingsSaveStatus';const btn=el('saveSettings');btn?.insertAdjacentElement('afterend',s)}
    return s;
  }
  function showStatus(text,ok=true){const s=statusNode();if(!s)return;s.textContent=text;s.className=ok?'ok':'err'}

  function applyAppearance(mode){
    const theme=mode==='dark'?'dark':'light';document.documentElement.dataset.theme=theme;
    const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.setAttribute('content',theme==='dark'?'#0c1020':'#f6f7fb');
  }
  function hydrate(){
    const p=state.profile||{};
    if(el('name'))el('name').value=p.name||'Eda';
    if(el('goal'))el('goal').value=String(Number(p.goal||10));
    if(el('minutes'))el('minutes').value=String(Number(p.minutes||30));
    if(el('tone'))el('tone').value=p.tone||'Destekleyici';
    if(el('targetNetSetting'))el('targetNetSetting').value=String(Number(p.targetNet||70));
    if(el('appearance'))el('appearance').value=p.appearance==='dark'?'dark':'light';
    if(el('yksTrack')&&p.track)el('yksTrack').value=p.track;
    statusNode();
  }

  function resetTeacherIfGoalModeStale(){
    const d=state.teacher?.daily;if(!d||d.date!==today())return false;
    const goal=Math.max(1,Number(state.profile?.goal||10)),done=todayQuestions();
    const noProgress=!d.testDone&&!d.wrongDone;
    if((d.mode==='complete'&&done<goal)||(d.mode!=='complete'&&done>=goal&&noProgress)){
      state.teacher.daily=null;return true;
    }
    return false;
  }

  function refreshViews(){
    try{window.refreshLearningModel?.()}catch{}
    try{window.renderHome?.()}catch{}
    try{window.renderTeacher?.()}catch{}
    try{window.renderCoach?.()}catch{}
    try{window.renderStats?.()}catch{}
  }

  function saveAll(e){
    e?.preventDefault?.();
    const p=state.profile??={};
    const track=el('yksTrack')?.value||p.track||'';
    const oldGoal=Number(p.goal||10),oldTrack=p.track||'';
    const goal=Math.max(1,Math.min(100,num('goal',oldGoal)));
    p.name=(el('name')?.value||p.name||'Eda').trim()||'Eda';
    p.goal=goal;
    p.minutes=Math.max(1,num('minutes',Number(p.minutes||30)));
    p.tone=el('tone')?.value||p.tone||'Destekleyici';
    p.targetNet=Math.max(0,Math.min(120,num('targetNetSetting',Number(p.targetNet||70))));
    p.appearance=el('appearance')?.value==='dark'?'dark':'light';
    if(track)p.track=track;

    const goalChanged=goal!==oldGoal,trackChanged=!!track&&track!==oldTrack;
    if(trackChanged){
      try{window.reconcileYksFieldData?.()}catch{}
      state.teacher??={};state.teacher.selectedTopic='';state.teacher.daily=null;
      state.coach??={};state.coach.report=null;state.coach.fingerprint='';
    }else if(goalChanged){
      state.teacher??={};state.teacher.daily=null;
    }else resetTeacherIfGoalModeStale();

    applyAppearance(p.appearance);
    try{save()}catch(err){showStatus('Ayarlar kaydedilemedi: '+(err?.message||'bilinmeyen hata'),false);return}
    hydrate();refreshViews();
    const btn=el('saveSettings');if(btn){const old=btn.textContent;btn.textContent='✓ Kaydedildi';btn.classList.add('saved');setTimeout(()=>{btn.textContent='Ayarları Kaydet';btn.classList.remove('saved')},1300)}
    showStatus(`✓ Ayarlar kaydedildi • Günlük hedef ${goal} soru • ${p.minutes} dakika`+(goalChanged?' • günlük öğretmen planı yeniden hesaplandı':''),true);
  }

  function installSave(){
    const btn=el('saveSettings');if(!btn){setTimeout(installSave,80);return}
    if(btn.dataset.profileConsistency==='1'){hydrate();return}
    btn.dataset.profileConsistency='1';
    btn.onclick=null;
    btn.addEventListener('click',saveAll);
    hydrate();
  }

  // Ayarlar ekranı her açıldığında state'teki gerçek değerleri göster.
  document.addEventListener('click',e=>{
    if(e.target.closest('[data-go="profile"]'))setTimeout(hydrate,0);
    if(e.target.closest('[data-go="teacher"]')){
      const changed=resetTeacherIfGoalModeStale();if(changed){try{save()}catch{}}
      setTimeout(()=>{try{window.renderTeacher?.()}catch{}},25);
    }
  },true);

  // Öğretmen ekranı başka bir akıştan programatik açılırsa da eski complete modu kalmasın.
  let fixing=false;
  const mo=new MutationObserver(()=>{
    if(fixing||!document.getElementById('teacher')?.classList.contains('active'))return;
    if(!resetTeacherIfGoalModeStale())return;
    fixing=true;try{save();window.renderTeacher?.()}catch{}finally{setTimeout(()=>fixing=false,0)}
  });
  const teacher=el('teacher');if(teacher)mo.observe(teacher,{childList:true,subtree:true});

  installSave();
})();
