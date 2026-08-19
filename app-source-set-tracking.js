(()=>{
  const C=()=>window.YKSQuestionCatalogV1;
  const D=()=>window.YKSDataV5;
  const norm=s=>D()?.norm?.(s)||String(s||'').toLocaleLowerCase('tr-TR').replace(/[^a-z0-9çğıöşü]+/g,' ').trim();
  const today=()=>D()?.todayKey?.()||new Date().toLocaleDateString('sv-SE');
  let scheduled=0,painting=false;

  const css=document.createElement('style');
  css.textContent=`
    .mts-q.mts-tracked-done{border-color:#b8dfc8!important;background:#f8fdf9!important}
    .mts-track-badge{display:inline-flex;align-items:center;gap:5px;font-size:10px;font-weight:900;padding:4px 8px;border-radius:999px;background:#e7f7ed;color:#187249}
    .mts-track-badge.wrong{background:#fff0f1;color:#b63845}.mts-track-badge.unable{background:#fff5df;color:#8a5b10}
    .mts-track-note{font-size:11px;font-weight:800;margin-top:6px;color:#187249}.mts-track-note.wrong{color:#b63845}.mts-track-note.unable{color:#8a5b10}
  `;
  document.head.appendChild(css);

  function all(){return C()?.all?.()||[]}
  function resolveCard(card){
    const rows=all(),id=card?.dataset?.catalogId;
    if(id){const hit=rows.find(x=>x.id===id);if(hit)return hit}
    const text=card?.innerText||'',q=(text.match(/Soru\s*(\d+)/i)||[])[1]||'';
    let hits=rows.filter(x=>q&&String(x.questionNo||'')===q&&text.includes(x.collection||''));
    if(hits.length===1)return hits[0];
    hits=rows.filter(x=>q&&String(x.questionNo||'')===q&&text.includes(x.subject||'')&&text.includes(x.topic||''));
    return hits[0]||null;
  }
  function resultEvent(id){
    return [...(state.studyEvents||[])].reverse().find(x=>x?.source==='source-question-result'&&x?.meta?.catalogId===id)||null;
  }
  function resultKind(ev){
    if(!ev)return'';
    if(ev.result==='correct')return'correct';
    if(ev?.meta?.wrongKind==='unable'||ev.interaction==='unable')return'unable';
    return'wrong';
  }
  function resultLabel(kind){return kind==='correct'?'✓ Yapıldı • Doğru':kind==='unable'?'? Yapıldı • Yapamadım':'✕ Yapıldı • Yanlış'}

  function decorateSet(){
    const cards=[...document.querySelectorAll('#tests .mts-q')];if(!cards.length)return;
    let done=0;
    cards.forEach(card=>{
      const item=resolveCard(card);if(!item)return;card.dataset.catalogId=item.id;
      const ev=resultEvent(item.id),kind=resultKind(ev),meta=card.querySelector('.mts-meta');
      let badge=card.querySelector('.mts-track-badge'),note=card.querySelector('.mts-track-note');
      if(kind){
        done++;card.classList.add('mts-tracked-done','done');
        if(!badge&&meta){badge=document.createElement('span');badge.className='mts-track-badge';meta.appendChild(badge)}
        if(badge){const cls=`mts-track-badge ${kind==='correct'?'':kind}`.trim();if(badge.className!==cls)badge.className=cls;const label=resultLabel(kind);if(badge.textContent!==label)badge.textContent=label}
        if(!note){note=document.createElement('div');note.className='mts-track-note';card.querySelector('.mts-main')?.insertAdjacentElement('afterend',note)}
        if(note){const cls=`mts-track-note ${kind==='correct'?'':kind}`.trim();if(note.className!==cls)note.className=cls;const text=kind==='correct'?'Bu soru tamamlandı. İstersen tekrar açabilirsin.':kind==='unable'?'Bu soru yapamadım olarak kaydedildi ve tekrar listesinde.':'Bu soru yanlış olarak kaydedildi ve Yanlışlarım listesinde.';if(note.textContent!==text)note.textContent=text}
        const open=card.querySelector('.mts-open');if(open&&open.textContent!=='Tekrar Aç →')open.textContent='Tekrar Aç →';
      }else{
        card.classList.remove('mts-tracked-done');badge?.remove();note?.remove();
      }
    });
    const small=document.querySelector('#tests .mts-progress small');
    if(small){const text=`${cards.length} soru • ${done}/${cards.length} tamamlandı`;if(small.textContent!==text)small.textContent=text}
    const pill=document.querySelector('#tests .mts-progress .pill');
    if(pill){const finished=done===cards.length&&cards.length>0;const text=finished?'Tamam':'Devam ediyor';if(pill.textContent!==text)pill.textContent=text;pill.classList.toggle('green',finished);pill.classList.toggle('orange',!finished)}
  }

  function teacherContext(){
    const hero=document.querySelector('#teacher .pt2-hero');if(!hero)return null;
    const topic=hero.querySelector('h2')?.textContent?.trim()||'';
    const es=hero.querySelector('.pt2-chip')?.textContent?.trim()||'';
    const parts=es.split(/\s+/),exam=parts.shift()||'',subject=parts.join(' ');
    if(!exam||!subject||!topic)return null;
    return{exam,subject,topic};
  }
  function plannedTeacherSet(ctx){
    if(!ctx||!C()?.findNextBatch)return{items:[],fallback:false,exact:0};
    let exact=[];try{exact=C().findNextBatch({...ctx,visualPreferred:true},5)||[]}catch{}
    if(exact.length>=5)return{items:exact.slice(0,5),fallback:false,exact:exact.length};
    let subject=[];try{subject=C().findNextBatch({exam:ctx.exam,subject:ctx.subject,visualPreferred:true},5)||[]}catch{}
    const merged=[],seen=new Set();
    [...exact,...subject].forEach(x=>{if(x?.id&&!seen.has(x.id)&&merged.length<5){seen.add(x.id);merged.push(x)}});
    return{items:merged,fallback:merged.length>exact.length,exact:exact.length};
  }
  function decorateTeacher(){
    const ctx=teacherContext();if(!ctx)return;
    const plan=plannedTeacherSet(ctx),task=[...document.querySelectorAll('#teacher .pt2-task')].find(x=>/Kaynakla Seviye Ölçümü/i.test(x.querySelector('h4')?.textContent||''));
    if(!task)return;
    const p=task.querySelector('p'),btn=task.querySelector('#pt2Test'),done=task.classList.contains('done');
    if(p){const text=plan.items.length?(plan.fallback?`${plan.items.length} hazır, çözülmemiş gerçek kaynak sorusu. Öncelik ${ctx.topic}; eksik sayı aynı dersten güncel sorularla tamamlanır.`:`${plan.items.length} hazır, çözülmemiş gerçek kaynak sorusuyla ölçüm.`):'Bu ders için henüz hazır kaynak sorusu bulunamadı.';if(p.textContent!==text)p.textContent=text}
    if(btn&&!done){const text=plan.items.length?`${plan.items.length} Soruluk Ölçümü Başlat`:'Soru Hazırlanıyor';if(btn.textContent!==text)btn.textContent=text;btn.disabled=!plan.items.length}
    [...document.querySelectorAll('#teacher .pt2-metric')].forEach(m=>{if(/hazır kaynak soru/i.test(m.querySelector('small')?.textContent||'')){const b=m.querySelector('b');if(b&&b.textContent!==String(plan.items.length))b.textContent=String(plan.items.length)}});
    task.dataset.teacherPlanCount=String(plan.items.length);task.dataset.teacherPlanFallback=plan.fallback?'1':'0';
  }

  function choose(el,value){
    if(!el)return false;const n=norm(value),o=[...el.options].find(x=>norm(x.value)===n||norm(x.textContent)===n)||[...el.options].find(x=>norm(x.value).includes(n)||n.includes(norm(x.value)));if(!o)return false;if(el.value!==o.value){el.value=o.value;el.dispatchEvent(new Event('change',{bubbles:true}));return true}return true;
  }
  function launchTeacherSet(ctx,plan){
    state.miniTests??={history:[]};state.teacher??={};
    state.miniTests.teacherTask={date:today(),topic:ctx.topic,exam:ctx.exam,subject:ctx.subject,expectedCount:plan.items.length,fallback:plan.fallback,itemIds:plan.items.map(x=>x.id)};
    state.miniTests.prefillSubject=`${ctx.exam} ${ctx.subject}`;state.miniTests.prefillTopic=plan.fallback?'':ctx.topic;
    if(state.teacher.daily)state.teacher.daily.testLaunchedAt=Date.now();
    try{save()}catch{}
    try{go('tests')}catch{};window.renderMiniTestHome?.();
    let tries=0;const setup=()=>{
      if(++tries>50)return;
      const ex=document.getElementById('mtsExam');if(!ex){setTimeout(setup,60);return}
      if(!choose(ex,ctx.exam)){setTimeout(setup,60);return}
      const sub=document.getElementById('mtsSubject');if(!sub){setTimeout(setup,60);return}
      if(!choose(sub,ctx.subject)){setTimeout(setup,60);return}
      const top=document.getElementById('mtsTopic');if(!top){setTimeout(setup,60);return}
      if(plan.fallback){if(top.value!=='all'){top.value='all';top.dispatchEvent(new Event('change',{bubbles:true}))}}
      else choose(top,ctx.topic);
      const count=document.getElementById('mtsCount');if(count){const wanted=plan.items.length>=5?'5':plan.items.length>=3?'3':'5';count.value=wanted}
      const build=document.getElementById('mtsBuild');if(build)setTimeout(()=>build.click(),30);else setTimeout(setup,60);
    };setTimeout(setup,80);
  }

  document.addEventListener('click',e=>{
    const btn=e.target.closest('#teacher #pt2Test');if(!btn)return;
    const ctx=teacherContext(),plan=plannedTeacherSet(ctx);if(!ctx||!plan.items.length)return;
    e.preventDefault();e.stopImmediatePropagation();launchTeacherSet(ctx,plan);
  },true);

  function paint(){if(painting)return;painting=true;try{decorateSet();decorateTeacher()}finally{painting=false}}
  function schedule(){clearTimeout(scheduled);scheduled=setTimeout(paint,25)}
  const mo=new MutationObserver(ms=>{if(ms.some(m=>m.addedNodes?.length||m.removedNodes?.length))schedule()});mo.observe(document.body,{childList:true,subtree:true});
  document.addEventListener('click',e=>{if(e.target.closest('[data-sq-answer],#sqCheck,#sqUnable,#sqReturn,#mtsFinish'))setTimeout(schedule,40)},true);
  const oldRender=window.renderTeacher;if(typeof oldRender==='function'&&!oldRender.__sourceTracking){const wrapped=function(...args){const r=oldRender.apply(this,args);setTimeout(schedule,0);return r};wrapped.__sourceTracking=true;window.renderTeacher=wrapped;try{renderTeacher=wrapped}catch{}}
  window.refreshSourceSetTracking=paint;
  setTimeout(paint,100);
})();