(()=>{
  const VERSION=5;
  const rootState=()=>state;
  const norm=s=>String(s||'').toLocaleLowerCase('tr-TR').replace(/[^a-z0-9çğıöşü]+/g,' ').trim();
  const todayKey=()=>new Date().toLocaleDateString('sv-SE');
  const dateKey=v=>{
    const s=String(v||'').trim();
    if(/^\d{4}-\d{2}-\d{2}$/.test(s))return s;
    const m=s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
    return m?`${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`:'';
  };
  const parseDate=v=>{const k=dateKey(v);return k?new Date(k+'T12:00:00'):null};
  const timestampOf=(x={})=>{
    if(Number(x.createdAt))return Number(x.createdAt);
    if(x.timestamp){const n=Date.parse(x.timestamp);if(Number.isFinite(n))return n}
    const k=x.dateKey||dateKey(x.date);if(!k)return Date.now();
    const tm=String(x.time||'12:00').match(/(\d{1,2}):(\d{2})/);const hh=tm?tm[1].padStart(2,'0'):'12',mm=tm?tm[2]:'00';
    const n=Date.parse(`${k}T${hh}:${mm}:00`);return Number.isFinite(n)?n:Date.now();
  };
  const hash=s=>{let h=2166136261;for(const ch of String(s||'')){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return(h>>>0).toString(36)};
  const uid=prefix=>`${prefix}:${Date.now().toString(36)}:${Math.random().toString(36).slice(2,9)}`;
  const clone=x=>{try{return structuredClone(x)}catch{return JSON.parse(JSON.stringify(x))}};
  const examSubject=(raw='',explicit='')=>{
    const s=String(raw||'').trim();const m=s.match(/^\s*(TYT|AYT)\b\s*/i);const exam=String(explicit||m?.[1]||'TYT').toUpperCase()==='AYT'?'AYT':'TYT';
    const subject=s.replace(/^\s*(TYT|AYT)\b\s*/i,'').trim()||'Genel';return{exam,subject};
  };
  const normalizeResult=v=>v===true||v==='correct'?'correct':v===false||v==='wrong'?'wrong':'unknown';
  const sourceLabel=s=>String(s||'study').trim()||'study';
  const sourceFamily=s=>{
    const x=sourceLabel(s);
    if(['photo-question','text-question','question-solve','solve'].includes(x))return'solve';
    if(x==='mini-test')return'mini-test';
    if(x==='teacher-check'||x==='teacher')return'teacher';
    if(x==='trial')return'trial';
    return x;
  };
  const fieldAllowed=(event,track=rootState().profile?.track||'')=>{
    if(!track||event.exam!=='AYT')return true;
    const s=norm(event.subject);
    if(track==='SAY')return /matematik|geometri|fizik|kimya|biyoloji/.test(s);
    if(track==='EA')return /matematik|geometri|edebiyat|tarih|coğraf/.test(s);
    return true;
  };

  function cleanKnownDemoData(){
    state.meta??={};if(state.meta.v5DemoCleaned)return;
    const demoSessions=new Set([
      '1|18.08.2026|TYT Matematik|Üslü Sayılar|true','2|18.08.2026|TYT Matematik|Köklü Sayılar|false','3|17.08.2026|TYT Matematik|Problemler|true','4|17.08.2026|Fizik|Hareket|false','5|16.08.2026|TYT Matematik|Köklü Sayılar|false','6|16.08.2026|Türkçe|Paragraf|true','7|15.08.2026|TYT Matematik|Problemler|true','8|15.08.2026|TYT Matematik|Üslü Sayılar|true','9|14.08.2026|TYT Matematik|Köklü Sayılar|true','10|14.08.2026|Fizik|Hareket|true'
    ]);
    state.sessions=(state.sessions||[]).filter(x=>x?.source||!demoSessions.has(`${x?.id}|${x?.date}|${x?.subject}|${x?.topic}|${x?.correct}`));
    const demoTrials=new Set(['02.08.2026|TYT Deneme 1|51.5','09.08.2026|TYT Deneme 2|57','16.08.2026|TYT Deneme 3|61.25']);
    state.trials=(state.trials||[]).filter(x=>x?.subjects||!demoTrials.has(`${x?.date}|${x?.name}|${Number(x?.net)}`));
    state.meta.v5DemoCleaned=true;
  }

  function ensure(){
    state.meta??={};state.studyEvents??=[];state.dataV5??={schemaVersion:VERSION,createdAt:Date.now(),activeSolveEventId:''};
    state.dataV5.schemaVersion=VERSION;state.dataV5.activeSolveEventId??='';
  }
  function normalizeEvent(raw={}){
    const {exam,subject}=examSubject(raw.subject,raw.exam);
    const ts=Number(raw.timestamp||Date.now());
    const e={
      id:String(raw.id||uid('event')),
      timestamp:Number.isFinite(ts)?ts:Date.now(),
      dateKey:String(raw.dateKey||new Date(Number.isFinite(ts)?ts:Date.now()).toLocaleDateString('sv-SE')),
      source:sourceLabel(raw.source),
      exam,
      track:String(raw.track||state.profile?.track||''),
      subject,
      subjectKey:norm(raw.subjectKey||subject),
      topic:String(raw.topic||'').trim(),
      topicKey:norm(raw.topicKey||raw.topic||''),
      curriculumOutcome:String(raw.curriculumOutcome||raw.curriculum_outcome||'').trim(),
      result:normalizeResult(raw.result),
      difficulty:String(raw.difficulty||'').trim(),
      interaction:String(raw.interaction||'studied').trim(),
      questionCount:Math.max(0,Number(raw.questionCount??raw.count??1)||0),
      signals:Array.isArray(raw.signals)?[...new Set(raw.signals.map(String))]:[],
      meta:raw.meta&&typeof raw.meta==='object'?clone(raw.meta):{},
      createdAt:Number(raw.createdAt||ts||Date.now()),
      updatedAt:Number(raw.updatedAt||Date.now())
    };
    if(e.source==='trial')e.questionCount=0;
    return e;
  }
  function upsert(raw){
    ensure();const next=normalizeEvent(raw);const i=state.studyEvents.findIndex(x=>x?.id===next.id);
    if(i<0){state.studyEvents.push(next);return next}
    const current=state.studyEvents[i];state.studyEvents[i]=normalizeEvent({...current,...next,meta:{...(current.meta||{}),...(next.meta||{})},signals:[...(current.signals||[]),...(next.signals||[])],createdAt:current.createdAt||next.createdAt,updatedAt:Date.now()});return state.studyEvents[i];
  }
  function deterministic(kind,x,index){
    if(x?.id!==undefined&&x?.id!==null&&String(x.id)!=='')return`legacy-${kind}:${String(x.id)}`;
    return`legacy-${kind}:${hash([x?.dateKey,x?.date,x?.time,x?.subject,x?.topic,x?.source,x?.correct,x?.name,x?.type,x?.net,x?.totalNet,index].join('|'))}`;
  }
  function ingestSession(x,index,archived=false){
    if(!x)return;const id=deterministic('session',x,index);const {exam,subject}=examSubject(x.subject);const existed=state.studyEvents?.some(e=>e?.id===id);let precise=!!(x.time||Number(x.createdAt));
    if(!existed&&state.meta?.v5Migrated&&x.source==='mini-test'&&!precise){x.createdAt=Date.now();x.time=new Date(x.createdAt).toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'});precise=true}
    upsert({id,timestamp:timestampOf(x),dateKey:dateKey(x.date)||todayKey(),source:x.source||'measurement',exam,subject,topic:x.topic||'',curriculumOutcome:x.curriculum_outcome||'',result:typeof x.correct==='boolean'?x.correct:'unknown',difficulty:x.difficulty||'',interaction:'answered',questionCount:1,meta:{legacyKind:'session',legacyId:x.id??null,archived,preciseTime:precise}});
  }
  function ingestActivity(x,index){
    if(!x)return;const id=deterministic('activity',x,index);const {exam,subject}=examSubject(x.subject);
    upsert({id,timestamp:timestampOf(x),dateKey:x.dateKey||dateKey(x.date)||todayKey(),source:x.source||x.type||'activity',exam,subject,topic:x.topic||'',result:'unknown',interaction:'studied',questionCount:Number(x.count||1),meta:{legacyKind:'activity',legacyId:x.id??null}});
  }
  function ingestTrial(x,index,archived=false){
    if(!x)return;const id=deterministic('trial',x,index);const type=String(x.type||'TYT').toUpperCase();const exam=type.startsWith('AYT')?'AYT':'TYT';
    upsert({id,timestamp:timestampOf(x),dateKey:dateKey(x.date)||todayKey(),source:'trial',exam,subject:type,topic:'',result:'unknown',interaction:'exam',questionCount:0,meta:{legacyKind:'trial',legacyId:x.id??null,archived,trial:clone(x)}});
  }
  function syncLegacy(){
    ensure();cleanKnownDemoData();
    (state.sessions||[]).forEach((x,i)=>ingestSession(x,i,false));
    (state.activityLog||[]).forEach((x,i)=>ingestActivity(x,i));
    (state.trials||[]).forEach((x,i)=>ingestTrial(x,i,false));
    (state.fieldArchive?.sessions||[]).forEach((x,i)=>ingestSession(x,100000+i,true));
    (state.fieldArchive?.trials||[]).forEach((x,i)=>ingestTrial(x,100000+i,true));
    state.meta.v5Migrated=true;state.meta.v5LastSyncAt=Date.now();
    return state.studyEvents;
  }

  let baseSave=null;
  function installSaveBridge(){
    if(window.__yksV5SaveBridge)return;
    if(typeof save!=='function'){setTimeout(installSaveBridge,60);return}
    baseSave=save;
    const wrapped=function(touch=true){try{syncLegacy()}catch(e){console.warn('V5 legacy sync',e)}return baseSave(touch)};
    save=wrapped;window.save=wrapped;window.__yksV5SaveBridge=true;
  }
  function persist(touch=true){if(typeof save==='function')return save(touch);try{localStorage.setItem('yksUzmanHocaV4',JSON.stringify(state))}catch{}}
  function record(raw,{persistNow=true}={}){syncLegacy();const e=upsert({...raw,id:raw.id||uid(sourceFamily(raw.source||'study'))});if(persistNow)persist();return e}
  function patch(id,changes={}){syncLegacy();const cur=state.studyEvents.find(x=>x.id===id);if(!cur)return null;const e=upsert({...cur,...changes,id,meta:{...(cur.meta||{}),...(changes.meta||{})},signals:[...(cur.signals||[]),...(changes.signals||[])]});persist();return e}

  function events({relevant=true,includeTrials=true}={}){
    syncLegacy();let rows=state.studyEvents.filter(Boolean);if(relevant)rows=rows.filter(x=>fieldAllowed(x));if(!includeTrials)rows=rows.filter(x=>x.source!=='trial');return rows.slice().sort((a,b)=>a.timestamp-b.timestamp);
  }
  function topicMetrics(rows){
    const groups=new Map();
    rows.filter(x=>x.topicKey&&x.source!=='trial').forEach(x=>{const k=`${x.exam}|${x.subjectKey}|${x.topicKey}`;if(!groups.has(k))groups.set(k,{exam:x.exam,subject:x.subject,subjectKey:x.subjectKey,topic:x.topic,topicKey:x.topicKey,events:[]});groups.get(k).events.push(x)});
    return [...groups.values()].map(g=>{
      const all=g.events.slice().sort((a,b)=>a.timestamp-b.timestamp),measured=all.filter(x=>x.result==='correct'||x.result==='wrong').slice(-12),recentMeasured=measured.slice(-5);
      const total=measured.reduce((a,x)=>a+Math.max(1,x.questionCount||1),0),correct=measured.filter(x=>x.result==='correct').reduce((a,x)=>a+Math.max(1,x.questionCount||1),0),wrong=measured.filter(x=>x.result==='wrong').reduce((a,x)=>a+Math.max(1,x.questionCount||1),0);
      const score=total?Math.round(correct/total*100):null,recentWrong=recentMeasured.filter(x=>x.result==='wrong').length;
      const cutoff=Date.now()-7*86400000;const recentSignals=all.filter(x=>x.timestamp>=cutoff).reduce((a,x)=>a+(x.signals||[]).filter(s=>['wrong','unable','stuck'].includes(s)).length,0);
      const last=all.at(-1),lastDate=last?.dateKey||'',d=parseDate(lastDate),staleDays=d?Math.max(0,Math.floor((Date.now()-d.getTime())/86400000)):999;
      const todayCount=all.filter(x=>x.dateKey===todayKey()).reduce((a,x)=>a+Number(x.questionCount||0),0);
      const confidence=total>=5?'Güçlü':total>=3?'Orta':total>=1?'Az':'Ölçüm yok';
      return{...g,total,correct,wrong,score,recentWrong,recentSignals,lastDate,staleDays,todayCount,confidence,lastTimestamp:last?.timestamp||0,events:all};
    }).sort((a,b)=>{
      const av=a.score===null?55:a.score,bv=b.score===null?55:b.score;return av-bv||b.recentSignals-a.recentSignals||b.total-a.total||a.topic.localeCompare(b.topic,'tr');
    });
  }
  function learningModel(){
    const rows=events({relevant:true,includeTrials:true}),study=rows.filter(x=>x.source!=='trial'),measured=study.filter(x=>x.result==='correct'||x.result==='wrong');
    const questionCount=study.reduce((a,x)=>a+Number(x.questionCount||0),0),measuredCount=measured.reduce((a,x)=>a+Math.max(1,Number(x.questionCount||1)),0),correct=measured.filter(x=>x.result==='correct').reduce((a,x)=>a+Math.max(1,Number(x.questionCount||1)),0),wrong=measuredCount-correct;
    const activeDays=new Set(study.filter(x=>x.questionCount>0).map(x=>x.dateKey).filter(Boolean));
    const sourceCounts={solve:0,miniTest:0,teacher:0,other:0,trials:rows.filter(x=>x.source==='trial').length};
    study.forEach(x=>{const n=Number(x.questionCount||0),f=sourceFamily(x.source);if(f==='solve')sourceCounts.solve+=n;else if(f==='mini-test')sourceCounts.miniTest+=n;else if(f==='teacher')sourceCounts.teacher+=n;else sourceCounts.other+=n});
    const topics=topicMetrics(study);return{events:rows,studyEvents:study,topics,metrics:topics,questionCount,measuredCount,correct,wrong,accuracy:measuredCount?Math.round(correct/measuredCount*100):null,activeDays,sourceCounts,track:state.profile?.track||'',todayCount:study.filter(x=>x.dateKey===todayKey()).reduce((a,x)=>a+Number(x.questionCount||0),0)};
  }
  function trials(){return events({relevant:true,includeTrials:true}).filter(x=>x.source==='trial').map(x=>clone(x.meta?.trial||{})).filter(x=>Object.keys(x).length)}
  function recentForTopic(topic,limit=5){const key=norm(topic);return events({relevant:true,includeTrials:false}).filter(x=>x.topicKey===key&&(x.result==='correct'||x.result==='wrong')).slice(-limit).reverse()}
  function setSolveFeedback(kind){
    const id=state.dataV5?.activeSolveEventId;if(!id)return null;const cur=state.studyEvents.find(x=>x.id===id);if(!cur)return null;
    const map={unable:{result:'unknown',interaction:'unable',signal:'unable'},wrong:{result:'wrong',interaction:'wrong',signal:'wrong'},checked:{result:'unknown',interaction:'checked',signal:'checked'}};const cfg=map[kind];if(!cfg)return null;
    const keep=(cur.signals||[]).filter(s=>!['unable','wrong','checked'].includes(s));return patch(id,{result:cfg.result,interaction:cfg.interaction,signals:[...keep,cfg.signal],meta:{selfReport:kind}});
  }
  function markStuck(){const id=state.dataV5?.activeSolveEventId;if(!id)return;const cur=state.studyEvents.find(x=>x.id===id);if(!cur)return;patch(id,{signals:[...(cur.signals||[]),'stuck'],meta:{stuck:true}})}

  function installSolveBridge(){
    if(window.__yksV5SolveBridge)return;
    if(typeof liveSolve!=='function'){setTimeout(installSolveBridge,120);return}
    const base=liveSolve;
    const wrapped=async args=>{
      const ok=await base(args);if(!ok)return ok;const x=lastLiveResult||{};const mode=args?.image?'photo-question':args?.text?'text-question':'question-solve';
      const questionSig=hash(args?.text||String(args?.image||'').slice(0,500));
      const e=record({source:mode,exam:x.exam||'TYT',subject:x.subject||'Genel',topic:x.topic||'',curriculumOutcome:x.curriculum_outcome||'',difficulty:x.difficulty||'',result:'unknown',interaction:'solved',questionCount:1,signals:[],meta:{questionHash:questionSig}},{persistNow:false});
      state.dataV5.activeSolveEventId=e.id;persist();setTimeout(renderFeedback,0);return ok;
    };
    liveSolve=wrapped;window.liveSolve=wrapped;window.__yksV5SolveBridge=true;
  }
  function renderFeedback(){
    const root=document.getElementById('solution');if(!root)return;let box=root.querySelector('.v5-solve-feedback');const event=state.studyEvents.find(x=>x.id===state.dataV5?.activeSolveEventId);if(!event)return;
    if(!box){box=document.createElement('div');box.className='card v5-solve-feedback';const row=root.querySelector('.action-row');if(row)row.insertAdjacentElement('afterend',box);else root.appendChild(box)}
    const selected=event.meta?.selfReport||'';box.innerHTML=`<div class="v5-feedback-head"><div><b>Bu soru sende nasıldı?</b><small>Bu seçim Koç ve Kişisel Öğretmenin sonraki önerisini akıllılaştırır.</small></div><span class="pill">V5 öğrenme sinyali</span></div><div class="v5-feedback-actions"><button data-v5-feedback="unable" class="${selected==='unable'?'active':''}">😕 Yapamadım</button><button data-v5-feedback="wrong" class="${selected==='wrong'?'active':''}">❌ Yanlış yaptım</button><button data-v5-feedback="checked" class="${selected==='checked'?'active':''}">✅ Sadece kontrol ettim</button></div><div class="v5-feedback-note">${selected==='wrong'?'Yanlış olarak ölçüme katıldı.':selected==='unable'?'Başarı yüzdesine eklenmedi; güçlü eksik-konu sinyali olarak kaydedildi.':selected==='checked'?'Yalnız çalışma aktivitesi olarak sayıldı.':'Seçim yapmazsan yalnız çalışma aktivitesi olarak kalır.'}</div>`;
    box.querySelectorAll('[data-v5-feedback]').forEach(b=>b.onclick=()=>{setSolveFeedback(b.dataset.v5Feedback);renderFeedback();try{window.renderHome?.()}catch{};try{window.renderStats?.()}catch{}});
  }
  const style=document.createElement('style');style.textContent=`.v5-solve-feedback{margin-top:14px}.v5-feedback-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.v5-feedback-head small{display:block;color:var(--muted);margin-top:4px;line-height:1.4}.v5-feedback-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.v5-feedback-actions button{border:1px solid var(--line);background:var(--surface);border-radius:12px;padding:9px 12px;color:var(--ink);font-weight:750}.v5-feedback-actions button.active{border-color:#8e7df4;background:#f2efff;color:#4f39bd}.v5-feedback-note{font-size:11px;color:var(--muted);margin-top:9px}@media(max-width:620px){.v5-feedback-head{flex-direction:column}.v5-feedback-actions{display:grid;grid-template-columns:1fr}}`;document.head.appendChild(style);
  document.addEventListener('click',e=>{if(e.target.closest('#solution [data-go="stuck"]')||e.target.closest('#stuck [data-stuck-mode]'))markStuck()},true);

  ensure();cleanKnownDemoData();syncLegacy();installSaveBridge();installSolveBridge();
  window.YKSDataV5={version:VERSION,syncLegacy,record,patch,getEvents:events,getLearningModel:learningModel,getTrials:trials,recentForTopic,setSolveFeedback,markStuck,fieldAllowed,norm,dateKey,todayKey};
  state.meta.dataArchitecture='StudyEvent-v5';persist(false);
})();
