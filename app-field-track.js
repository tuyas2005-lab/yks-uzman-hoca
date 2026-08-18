(()=>{
  state.profile??={};
  state.fieldArchive??={sessions:[],trials:[]};
  state.fieldArchive.sessions??=[];state.fieldArchive.trials??=[];

  const policy={
    SAY:{
      label:'Sayısal',
      aytLabel:'AYT Matematik + Fen Bilimleri',
      focus:'AYT Matematik/Geometri, Fizik, Kimya ve Biyoloji',
      outside:'AYT Türk Dili ve Edebiyatı, Tarih-1, Coğrafya-1 ve Sosyal Bilimler-2',
      allowedSubjects:['matematik','geometri','fizik','kimya','biyoloji'],
      trialType:'AYT-SAY'
    },
    EA:{
      label:'Eşit Ağırlık',
      aytLabel:'AYT Matematik + Türk Dili ve Edebiyatı-Sosyal Bilimler-1',
      focus:'AYT Matematik/Geometri, Türk Dili ve Edebiyatı, Tarih-1 ve Coğrafya-1',
      outside:'AYT Fizik, Kimya, Biyoloji ve Sosyal Bilimler-2',
      allowedSubjects:['matematik','geometri','türk dili ve edebiyatı','edebiyat','tarih','tarih 1','coğrafya','coğrafya 1'],
      trialType:'AYT-EA'
    }
  };
  const norm=s=>String(s||'').toLocaleLowerCase('tr-TR').replace(/[^a-z0-9çğıöşü]+/g,' ').trim();
  const track=()=>['SAY','EA'].includes(state.profile?.track)?state.profile.track:'';
  const cfg=()=>policy[track()]||null;
  window.getYksTrack=track;window.getYksTrackPolicy=()=>cfg();

  function aytSubjectAllowed(subject,t=track()){
    if(!t)return true;
    const s=norm(subject).replace(/^ayt\s+/,'');
    return policy[t].allowedSubjects.some(x=>s===norm(x)||s.includes(norm(x))||norm(x).includes(s));
  }
  function sessionRelevant(x,t=track()){
    if(!t)return true;
    const s=String(x?.subject||'').trim();
    if(!/^AYT\b/i.test(s))return true; // TYT ve alan etiketi olmayan eski kayıtlar ortak kalır.
    return aytSubjectAllowed(s,t);
  }
  function trialRelevant(x,t=track()){
    if(!t)return true;
    const type=String(x?.type||'TYT').toUpperCase();
    if(type==='TYT')return true;
    return type===policy[t].trialType;
  }
  function uniq(items){const m=new Map();(items||[]).forEach((x,i)=>{const k=String(x?.id??`${x?.date||''}|${x?.subject||x?.type||''}|${x?.topic||x?.name||''}|${i}`);if(!m.has(k))m.set(k,x)});return [...m.values()]}

  function reconcileFieldData(){
    state.fieldArchive??={sessions:[],trials:[]};
    const allSessions=uniq([...(state.sessions||[]),...(state.fieldArchive.sessions||[])]);
    const allTrials=uniq([...(state.trials||[]),...(state.fieldArchive.trials||[])]);
    if(!track()){
      state.sessions=allSessions;state.trials=allTrials;state.fieldArchive.sessions=[];state.fieldArchive.trials=[];
    }else{
      state.sessions=allSessions.filter(x=>sessionRelevant(x));
      state.fieldArchive.sessions=allSessions.filter(x=>!sessionRelevant(x));
      state.trials=allTrials.filter(x=>trialRelevant(x));
      state.fieldArchive.trials=allTrials.filter(x=>!trialRelevant(x));
    }
    try{window.refreshLearningModel?.()}catch{}
  }
  window.reconcileYksFieldData=reconcileFieldData;

  function fieldHelpHtml(){
    const c=cfg();
    if(!c)return '<b>YKS alanı henüz seçilmedi.</b> TYT bütün alanlarda ortaktır. Alan seçildiğinde yalnız AYT çalışma öncelikleri filtrelenir.';
    return `<b>${c.label}</b> • TYT ortak kalır.<br><b>AYT odak:</b> ${c.focus}.<br><b>YKS alan dışı:</b> ${c.outside}. Alan dışı AYT kayıtları silinmez; arşivlenir.`;
  }

  function installSettings(){
    const settings=document.querySelector('#profile .settings');if(!settings)return;
    if(!document.getElementById('yksTrack')){
      const label=document.createElement('label');label.id='yksTrackLabel';label.innerHTML=`YKS alanı<select id="yksTrack"><option value="">Alan seç</option><option value="SAY">🔬 Sayısal</option><option value="EA">⚖️ Eşit Ağırlık</option></select><span id="yksTrackHelp" class="theme-preview"><small class="muted"></small></span>`;
      const target=document.getElementById('targetNetSetting')?.closest('label');settings.insertBefore(label,target||settings.firstChild);
      document.getElementById('yksTrack').value=track();
      document.querySelector('#yksTrackHelp small').innerHTML=fieldHelpHtml();
      document.getElementById('yksTrack').onchange=()=>{document.querySelector('#yksTrackHelp small').innerHTML=fieldHelpHtmlPreview(document.getElementById('yksTrack').value)};
    }else document.getElementById('yksTrack').value=track();
  }
  function fieldHelpHtmlPreview(v){
    const c=policy[v];if(!c)return 'TYT bütün alanlarda ortaktır. AYT filtresi için alanını seç.';
    return `${c.label}: TYT ortak • AYT odak: ${c.focus} • Alan dışı: ${c.outside}`;
  }

  function wrapSettingsSave(){
    installSettings();
    const btn=document.getElementById('saveSettings');if(!btn||btn.dataset.trackWrapped)return;
    const original=btn.onclick;btn.dataset.trackWrapped='1';
    btn.onclick=e=>{
      const select=document.getElementById('yksTrack');const value=select?.value||'';
      if(!value){alert('Lütfen YKS alanını seç: Sayısal veya Eşit Ağırlık.');return}
      const changed=state.profile.track!==value;state.profile.track=value;
      reconcileFieldData();
      original?.call(btn,e);
      if(changed){state.teacher??={};state.teacher.selectedTopic='';state.teacher.daily=null;state.coach??={};state.coach.report=null;state.coach.fingerprint='';}
      save();refreshAll();
    };
  }

  function renderFieldBanner(){
    const root=document.getElementById('coach');if(!root)return;
    let b=root.querySelector('.field-coach-banner');if(!b){b=document.createElement('div');b.className='field-coach-banner';const head=root.querySelector('.yc-head,.screen-head');head?.insertAdjacentElement('afterend',b)}
    const c=cfg();b.innerHTML=c?`<b>🎯 Alan: ${c.label}</b><span>TYT ortak • ${c.aytLabel}</span>`:`<b>⚠️ YKS alanı seçilmedi</b><span>Ayarlar → YKS alanı bölümünden Sayısal veya Eşit Ağırlık seç.</span>`;
  }

  function patchCoachForm(){
    renderFieldBanner();const sel=document.getElementById('ycType');if(!sel)return;
    const c=cfg();[...sel.options].forEach(o=>{const ok=!c||o.value==='TYT'||o.value===c.trialType;o.hidden=!ok;o.disabled=!ok});
    if(c&&![...sel.options].some(o=>o.value===sel.value&&!o.disabled)){sel.value='TYT';sel.dispatchEvent(new Event('change',{bubbles:true}))}
  }

  function patchMiniSubjects(){
    const exam=document.getElementById('mtExam'),sub=document.getElementById('mtSubject');if(!exam||!sub)return;
    const c=cfg(),isAyt=exam.value==='AYT';
    [...sub.options].forEach(o=>{const ok=!c||!isAyt||aytSubjectAllowed(o.textContent);o.hidden=!ok;o.disabled=!ok});
    if(c&&isAyt){const current=sub.options[sub.selectedIndex];if(!current||current.disabled){const first=[...sub.options].find(o=>!o.disabled);if(first){sub.value=first.value;sub.dispatchEvent(new Event('change',{bubbles:true}))}}}
    const setup=document.querySelector('#tests .mt-setup');if(setup&&!setup.querySelector('.field-mini-note')){const n=document.createElement('div');n.className='field-mini-note';n.innerHTML=cfg()?`<b>${cfg().label} alan filtresi aktif.</b> TYT ortak; AYT'de yalnız ${cfg().focus} gösterilir.`:'<b>Alan filtresi kapalı.</b> Ayarlardan Sayısal/Eşit Ağırlık seçebilirsin.';setup.querySelector('.mt-context')?.insertAdjacentElement('afterend',n)}
  }

  function patchHomeBadge(){
    const top=document.querySelector('#home .topbar > div:first-child');if(!top)return;let el=top.querySelector('.home-field-badge');if(!el){el=document.createElement('div');el.className='home-field-badge';top.appendChild(el)}
    el.textContent=cfg()?`🎯 ${cfg().label} • TYT ortak + alan AYT`:'⚠️ YKS alanı seçilmedi';
  }

  function refreshAll(){
    reconcileFieldData();installSettings();renderFieldBanner();patchCoachForm();patchMiniSubjects();patchHomeBadge();
    try{window.renderHome?.()}catch{}try{window.renderTopics?.()}catch{}try{window.renderStats?.()}catch{}try{window.renderTeacher?.()}catch{}try{window.renderCoach?.()}catch{}
    setTimeout(()=>{renderFieldBanner();patchCoachForm();patchMiniSubjects();patchHomeBadge()},30);
  }

  const css=document.createElement('style');css.textContent=`
    #yksTrackLabel{grid-column:1/-1;padding:13px;border:1px solid #dfd9ff;border-radius:15px;background:linear-gradient(135deg,#f7f5ff,#fff)}
    #yksTrackHelp{display:block;margin-top:7px;line-height:1.45}.field-coach-banner{display:flex;justify-content:space-between;gap:12px;align-items:center;padding:11px 14px;margin:-3px 0 14px;border:1px solid #ddd7ff;background:#f8f6ff;border-radius:14px;color:var(--ink)}.field-coach-banner span{font-size:12px;color:var(--muted)}
    .field-mini-note{margin:10px 0 14px;padding:10px 12px;border-radius:12px;background:#f2efff;border:1px solid #dfd9ff;font-size:13px}.home-field-badge{display:inline-flex;margin-top:7px;padding:5px 9px;border-radius:999px;background:#eeeaff;color:#5a43d3;font-size:11px;font-weight:800}
    @media(max-width:650px){.field-coach-banner{align-items:flex-start;flex-direction:column}}
  `;document.head.appendChild(css);

  // Koç raporu ve Mini Test API çağrılarına alan bilgisini ekle.
  if(!window.__fieldFetchWrapped){
    const baseFetch=window.fetch.bind(window);window.fetch=(input,init={})=>{
      try{
        const url=typeof input==='string'?input:String(input?.url||'');
        if((url.includes('/api/mini-test')||url.includes('/api/coach-report')||url.includes('/api/counselor'))&&typeof init?.body==='string'){
          const data=JSON.parse(init.body);data.track=track();data.profile={...(data.profile||{}),track:track(),trackLabel:cfg()?.label||''};
          if(data.context?.profile)data.context.profile.track=track();
          init={...init,body:JSON.stringify(data)};
        }
      }catch{}
      return baseFetch(input,init);
    };window.__fieldFetchWrapped=true;
  }

  document.addEventListener('change',e=>{if(e.target?.id==='mtExam'||e.target?.id==='mtSubject')setTimeout(patchMiniSubjects,0);if(e.target?.id==='ycType')setTimeout(patchCoachForm,0)},true);
  const observer=new MutationObserver(()=>{installSettings();patchCoachForm();patchMiniSubjects();patchHomeBadge()});observer.observe(document.body,{subtree:true,childList:true});

  if(typeof go==='function'&&!window.__fieldGoWrapped){const baseGo=go;go=function(id){const r=baseGo(id);setTimeout(()=>{if(id==='profile'){installSettings();wrapSettingsSave()}if(id==='coach')patchCoachForm();if(id==='tests')patchMiniSubjects();if(id==='home')patchHomeBadge()},0);return r};window.go=go;window.__fieldGoWrapped=true}

  reconcileFieldData();installSettings();wrapSettingsSave();refreshAll();
})();