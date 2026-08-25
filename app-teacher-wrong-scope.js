(()=>{
  const D=()=>window.YKSDataV5,C=()=>window.YKSQuestionCatalogV1;
  const norm=s=>D()?.norm?.(s)||String(s||'').toLocaleLowerCase('tr-TR').replace(/[^a-z0-9çğıöşü]+/g,' ').trim();
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const today=()=>D()?.todayKey?.()||new Date().toLocaleDateString('sv-SE');
  state.teacher??={};

  const style=document.createElement('style');
  style.textContent=`
    .teacher-wrong-scope{margin:0 0 14px;padding:16px;border:1px solid #d9d2ff;border-radius:18px;background:linear-gradient(135deg,#f7f5ff,#fff)}
    .tws-head{display:flex;justify-content:space-between;gap:14px;align-items:flex-start;margin-bottom:12px}.tws-head h3{margin:0 0 5px}.tws-head p{margin:0;color:var(--muted);font-size:12px;line-height:1.45}.tws-progress{white-space:nowrap;padding:6px 9px;border-radius:999px;background:#fff0d8;color:#8a5c12;font-size:11px;font-weight:900}.tws-progress.done{background:#e7f7ed;color:#1d724a}
    .tws-list{display:grid;gap:9px}.tws-item{display:grid;grid-template-columns:40px minmax(0,1fr) minmax(190px,auto);gap:11px;align-items:center;border:1px solid var(--line);border-radius:14px;padding:12px;background:var(--surface)}.tws-item.done{border-color:#bce3ca;background:#f8fdf9}.tws-no{width:32px;height:32px;border-radius:10px;background:#eeeaff;color:#5942d1;display:grid;place-items:center;font-weight:900}.tws-item.done .tws-no{background:#def4e6;color:#187649}.tws-item b{display:block;font-size:13px}.tws-item small{display:block;color:var(--muted);font-size:11px;margin-top:3px}.tws-evidence{margin-top:5px!important;line-height:1.45}.tws-controls{display:grid;gap:7px}.tws-reason{min-height:38px;border:1px solid var(--line);border-radius:10px;background:var(--surface);color:var(--ink);padding:0 8px}.tws-open{border:0;border-radius:10px;min-height:40px;padding:9px 11px;background:#6747eb;color:#fff;font-weight:850}.tws-item.done .tws-open{background:#edf2ef;color:#557064}.tws-actions{display:flex;justify-content:flex-end;margin-top:12px}.tws-empty{padding:18px;border:1px dashed var(--line);border-radius:14px;color:var(--muted);text-align:center}@media(max-width:700px){.tws-head{flex-direction:column}.tws-item{grid-template-columns:36px 1fr}.tws-controls{grid-column:1/-1}.tws-open{width:100%}}
  `;
  document.head.appendChild(style);

  function persist(){try{save()}catch{}}
  function teacherDomContext(){
    const hero=document.querySelector('#teacher .pt2-hero');if(!hero)return null;
    const topic=hero.querySelector('h2')?.textContent?.trim()||'';
    const chip=hero.querySelector('.pt2-chip')?.textContent?.trim()||'';
    const parts=chip.split(/\s+/),exam=parts.shift()||'',subject=parts.join(' ');
    return exam&&subject&&topic?{exam,subject,topic}:null;
  }
  function saveTaskScope(task){
    if(!task)return null;const itemIds=[...(task.itemIds||[])];
    const scope={date:task.date||today(),exam:task.exam||'',subject:task.subject||'',topic:task.topic||'',itemIds,launchedAt:Number(state.teacher?.daily?.testLaunchedAt||Date.now())};
    state.teacher.lastTeacherSetScope=scope;
    const d=state.teacher.daily;if(d){d.teacherExam=scope.exam;d.teacherSubject=scope.subject;d.teacherTopic=scope.topic;d.teacherSetItemIds=itemIds;d.teacherReviewedWrongIds=d.teacherReviewedWrongIds||[]}
    persist();return scope;
  }
  function currentScope(){
    const d=state.teacher.daily||{},saved=state.teacher.lastTeacherSetScope||{},dom=teacherDomContext()||{};
    const scope={date:d.date||saved.date||today(),exam:d.teacherExam||saved.exam||dom.exam||'',subject:d.teacherSubject||saved.subject||dom.subject||'',topic:d.teacherTopic||saved.topic||dom.topic||d.topic||'',itemIds:[...(d.teacherSetItemIds||saved.itemIds||[])],launchedAt:Number(d.testLaunchedAt||saved.launchedAt||0)};
    return scope.exam&&scope.subject&&scope.topic?scope:null;
  }
  function wrongRows(scope){
    let rows=(state.studyEvents||[]).filter(x=>x?.meta?.wrongRecord===true||x?.meta?.wrongClosed===true);
    if(scope?.itemIds?.length){const ids=new Set(scope.itemIds);rows=rows.filter(x=>ids.has(x.meta?.catalogId))}
    else if(scope){rows=rows.filter(x=>norm(x.exam)===norm(scope.exam)&&norm(x.subject)===norm(scope.subject)&&norm(x.topic)===norm(scope.topic)&&(!scope.launchedAt||Number(x.timestamp||0)>=scope.launchedAt-1500))}
    return rows.slice().sort((a,b)=>(b.timestamp||0)-(a.timestamp||0));
  }
  function reviewed(){return new Set(state.teacher?.daily?.teacherReviewedWrongIds||[])}
  const reviewTotalToday=()=> (state.studyEvents||[]).filter(x=>x?.source==='wrong-review'&&x?.dateKey===today()).length;
  function syncDone(scope){
    const d=state.teacher.daily;if(!d)return false;const rows=wrongRows(scope),seen=reviewed(),mistakes=Number(d.testSummary?.mistakes||0);
    if(mistakes===0)d.wrongDone=true;else if(rows.length)d.wrongDone=rows.every(x=>x.meta?.wrongClosed===true);else d.wrongDone=false;
    persist();return !!d.wrongDone;
  }
  function recordReview(x,scope){
    const d=state.teacher.daily;if(!d)return;d.teacherReviewedWrongIds=d.teacherReviewedWrongIds||[];
    if(!d.teacherReviewedWrongIds.includes(x.id))d.teacherReviewedWrongIds.push(x.id);
    const exists=(state.studyEvents||[]).some(e=>e?.source==='wrong-review'&&e?.dateKey===today()&&e?.meta?.reviewOf===x.id);
    if(!exists){try{const reviewedAt=Date.now(),event=D()?.record?.({source:'wrong-review',exam:x.exam,subject:x.subject,topic:x.topic,curriculumOutcome:x.curriculumOutcome||x.meta?.solution?.curriculumOutcome||'',result:'unknown',difficulty:x.difficulty,interaction:'reviewed',questionCount:0,signals:['reviewed-wrong'],meta:{reviewOf:x.id,teacherTask:true,teacherTopic:scope?.topic||'',reviewedAt}},{persistNow:true});window.markWrongLearningEvidence?.(x.id,{wrongReviewedAt:reviewedAt,wrongReviewEventId:event?.id||''})}catch{}}
    const done=syncDone(scope);if(!done)d.wrongReviewBaseline=reviewTotalToday();persist();
  }
  function openRow(x,scope){
    recordReview(x,scope);renderScope();
    const item=(C()?.all?.()||[]).find(z=>z.id===x.meta?.catalogId);
    if(item&&typeof window.openSourceQuestion==='function'&&(!window.isSourceQuestionReady||window.isSourceQuestionReady(item))){window.openSourceQuestion(item,{type:'wrong',wrongId:x.id,returnScreen:'wrong'});return}
    const btn=document.querySelector(`#wrong2Host [data-wrong-id="${CSS.escape(x.id)}"]`);if(btn)btn.click();
  }
  function cleanup(){const host=document.getElementById('wrong2Host');if(host)host.style.display='';document.getElementById('teacherWrongScopeHost')?.remove()}
  function renderScope(){
    const active=state.teacher.teacherWrongScope;if(!active?.active){cleanup();return}
    const root=document.getElementById('wrong');if(!root)return;const scope=active.scope||currentScope();if(!scope)return;
    const general=document.getElementById('wrong2Host');if(general)general.style.display='none';
    let host=document.getElementById('teacherWrongScopeHost');if(!host){host=document.createElement('div');host.id='teacherWrongScopeHost';const head=root.querySelector('.screen-head');head?.insertAdjacentElement('afterend',host)}
    const rows=wrongRows(scope),done=syncDone(scope),count=rows.filter(x=>x.meta?.wrongClosed===true).length,reasons=['Konu bilgisi eksik','Soruyu yanlış anlama','Model kuramama','İşlem hatası','Dikkat hatası','Formül karıştırma','Çeldiriciye düşme','Süre problemi','Yapamadım'];
    host.innerHTML=`<div class="teacher-wrong-scope"><div class="tws-head"><div><h3>🧠 Bu Öğretmen Oturumundaki Yanlışlar</h3><p>${esc(`${scope.exam} ${scope.subject} • ${scope.topic}`)}<br>Bir yanlış ancak inceleme, hata nedeni, benzer doğru ve yeniden doğru kanıtları tamamlanınca kapanır.</p></div><span class="tws-progress ${done?'done':''}">${done?'Tamamlandı':`${count}/${rows.length} kapatıldı`}</span></div>${rows.length?`<div class="tws-list">${rows.map((x,i)=>{const closed=x.meta?.wrongClosed===true,q=x.meta?.questionNo||x.meta?.catalogId?.match(/(\d+)$/)?.[1]||'',p=window.getWrongLearningEvidence?.(x.id)||{};return`<div class="tws-item ${closed?'done':''}"><span class="tws-no">${closed?'✓':i+1}</span><div><b>${esc(`${x.exam} ${x.subject}`)} • ${esc(x.topic||'Konu')}</b><small>${q?`Soru ${esc(q)} • `:''}${x.meta?.wrongKind==='unable'?'Yapamadım':'Yanlış yaptım'}</small><small class="tws-evidence">${p.reviewed?'✓':'○'} İnceleme • ${p.reason?'✓':'○'} Neden • ${p.similarCorrect?'✓':'○'} Benzer doğru • ${p.retryCorrect?'✓':'○'} Yeniden doğru</small></div><div class="tws-controls">${closed?'':`<select class="tws-reason" data-tws-reason="${esc(x.id)}"><option value="">Hata nedenini seç</option>${reasons.map(v=>`<option ${x.meta?.wrongReason===v?'selected':''}>${v}</option>`).join('')}</select>`}<button class="tws-open" data-tws-id="${esc(x.id)}">${closed?'Kapatılanı Aç':'Soruyu Yeniden Çöz →'}</button></div></div>`}).join('')}</div>`:`<div class="tws-empty">${Number(state.teacher.daily?.testSummary?.mistakes||0)>0?'Bu oturumdaki yanlış kayıtları eşleştiriliyor. Öğretmene dönüp tekrar açmayı dene.':'Bu ölçümde yanlış yok.'}</div>`}<div class="tws-actions"><button id="twsBackTeacher" class="primary">${done?'✓ Öğretmene Dön':'Öğretmene Dön'}</button></div></div>`;
    host.querySelectorAll('[data-tws-reason]').forEach(s=>s.onchange=()=>{if(s.value)window.markWrongLearningEvidence?.(s.dataset.twsReason,{wrongReason:s.value,wrongReasonAt:Date.now()});renderScope()});
    host.querySelectorAll('[data-tws-id]').forEach(b=>b.onclick=()=>{const x=rows.find(z=>z.id===b.dataset.twsId);if(x)openRow(x,scope)});
    host.querySelector('#twsBackTeacher').onclick=()=>{const complete=syncDone(scope);if(!complete&&state.teacher.daily)state.teacher.daily.wrongReviewBaseline=reviewTotalToday();state.teacher.teacherWrongScope={active:false,scope};persist();cleanup();go('teacher');setTimeout(()=>window.renderTeacher?.(),30)};
  }
  function activate(){
    const scope=currentScope();if(!scope)return;state.teacher.teacherWrongScope={active:true,scope};const d=state.teacher.daily;if(d){d.teacherExam=scope.exam;d.teacherSubject=scope.subject;d.teacherTopic=scope.topic;d.teacherSetItemIds=[...(scope.itemIds||[])];d.teacherReviewedWrongIds=d.teacherReviewedWrongIds||[];d.wrongReviewBaseline=reviewTotalToday()}
    persist();go('wrong');setTimeout(renderScope,80);
  }

  document.addEventListener('click',e=>{
    if(e.target.closest('#mtsFinish')&&state.miniTests?.teacherTask){const task={...state.miniTests.teacherTask,itemIds:[...(state.miniTests.teacherTask.itemIds||[])]};saveTaskScope(task);setTimeout(()=>{const s=state.teacher.lastTeacherSetScope;if(s)syncDone(s)},120)}
    const b=e.target.closest('#teacher #pt2Wrong');if(b&&!b.disabled){e.preventDefault();e.stopImmediatePropagation();activate();return}
    if(e.target.closest('#sqReturn')&&state.teacher.teacherWrongScope?.active)setTimeout(renderScope,80);
  },true);

  const oldGo=window.go;if(typeof oldGo==='function'&&!oldGo.__teacherWrongScope){const wrapped=function(id){const r=oldGo(id);if(id==='wrong'&&state.teacher.teacherWrongScope?.active)setTimeout(renderScope,80);return r};wrapped.__teacherWrongScope=true;window.go=wrapped;try{go=wrapped}catch{}}
  window.renderTeacherWrongScope=renderScope;
})();
