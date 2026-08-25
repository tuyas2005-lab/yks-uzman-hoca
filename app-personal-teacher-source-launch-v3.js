(()=>{
  const D=()=>window.YKSDataV5,C=()=>window.YKSQuestionCatalogV1;
  const norm=s=>D()?.norm?.(s)||String(s||'').toLocaleLowerCase('tr-TR').replace(/[^a-z0-9çğıöşü]+/g,' ').trim();
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const today=()=>D()?.todayKey?.()||new Date().toLocaleDateString('sv-SE');
  const hash=s=>{let h=2166136261;for(const c of String(s||'')){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return(h>>>0).toString(36)};
  const topicTestInsight=ctx=>(D()?.getTopicTestInsights?.({days:60})||[]).find(x=>x.exam===ctx.exam&&norm(x.subject)===norm(ctx.subject)&&norm(x.topic)===norm(ctx.topic))||null;
  let timer=0,painting=false,recapBusy=false;

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
    root.querySelector('[data-pt3-health]')?.remove();
    const h=p.health,host=root.querySelector('.pt2-details');if(!h||!host)return;
    const labels={KOLAY:'Kolay',ORTA:'Orta',ZOR:'Zor'},colors={green:['#eaf7ef','#197249'],yellow:['#fff8dd','#8a6500'],orange:['#fff1df','#a35400'],red:['#fff0f1','#b73845']},levelText={green:'Yeterli',yellow:'Erken uyarı',orange:'Yüksek öncelik',red:'Kritik'},alerts=h.alerts.map(x=>`${labels[x.difficulty]} ${x.remaining}`).join(' • '),advice=h.overall==='green'?'Bu konu ve tüm zorluk seviyelerinde kaynak normal kullanım için yeterli.':h.overall==='yellow'?`Erken kaynak uyarısı: ${alerts}. Yeni doğrulanmış kaynak ekleme planına alınmalı.`:h.overall==='orange'?`Yeni kaynak yüksek öncelik: ${alerts}. Havuz bitmeden ekleme yapılmalı.`:`Kritik kaynak uyarısı: ${alerts}. Eksik zorluk düzeyinde yeni ölçüm seti açılmayacak ve daha kolay soruyla doldurulmayacak.`;
    const card=document.createElement('details');card.dataset.pt3Health='1';card.style.gridColumn='1 / -1';card.innerHTML=`<summary>Kaynak sağlığı — ürün sahibi • ${h.total} çözülmemiş • ${levelText[h.overall]}</summary><div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:11px">${Object.entries(h.cells).map(([k,x])=>{const c=colors[x.level];return`<div style="padding:10px;border-radius:12px;background:${c[0]};color:${c[1]}"><small>${labels[k]}</small><br><b>${x.remaining} çözülmemiş</b></div>`}).join('')}</div><div class="pt2-note"><b>${levelText[h.overall]}:</b> ${esc(advice)}<br>Toplam ${h.totalRows} doğrulanmış soru • ${h.solved} çözülmüş • ${h.total} çözülmemiş.</div>`;host.prepend(card)
  }

  function plan(ctx){
    const desired=Number(state.teacher?.daily?.desiredCount||5)>=5?5:3;
    const P=window.YKSTeacherPilotV1,pilot=P?.resolveTopic?.(ctx);if(!pilot)return{items:[],count:0,desired,mode:'blocked',shortages:{PILOT:desired},distributionExact:false};
    const poolTopic=pilot.poolTopics?.[0]||pilot.displayTitle;let exact=[];try{exact=C()?.findNextBatch?.({...ctx,topic:poolTopic,visualPreferred:true},30)||[]}catch{}
    const mode=state.teacher?.daily?.mode||'diagnostic',cfg=P?.modeConfig?.[mode]||{count:desired,difficultyCounts:{}},selection=P?.difficultySelection?.(exact,{...cfg,count:desired})||{items:[],shortages:{UNKNOWN:desired},distributionExact:false},count=selection.distributionExact?desired:0;
    return{...selection,items:count?selection.items:[],count,desired,mode,difficultyCounts:cfg.difficultyCounts||{},pilot,poolTopic,health:sourceHealth(ctx)}
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
        btn.textContent=p.count?`${p.count} Soruluk Seti Başlat`:'Kaynak Yok';
        btn.disabled=!p.count||t.classList.contains('locked');
        const desc=t?.querySelector('p');
        if(desc)desc.textContent=p.count?`${p.count} çözülmemiş, indekslenmiş ve aynı konudan kaynak sorusuyla çalış.`:p.mode==='blocked'?'Bu konu Limited Pilot kapsamında değil; öğretmen görev açmayacak.':`İstenen zorluk dağılımında kaynak eksik (${Object.entries(p.shortages||{}).map(([k,v])=>`${k} ${v}`).join(', ')}). Daha kolay soruyla sessizce doldurulmayacak.`
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
    const P=window.YKSTeacherPilotV1,topic=P?.resolveTopic?.(ctx.topic),daily=state.teacher?.daily||{},revision=hash(`${daily.mode||'diagnostic'}|${p.items.map(x=>x.id).join('|')}`),sessionId=`pt2-${today()}-${topic?.id||norm(ctx.topic)}-${revision}`,decisionId=`${sessionId}-decision`;
    if(P&&topic){
      const event=P.buildDecisionEvent({decisionId,sessionId,dateKey:today(),topicId:topic.id,mode:daily.mode||'diagnostic',reasonCodes:['daily-plan'],evidence:{dailyMode:daily.mode||'',expectedCount:p.count},selection:{questionIds:p.items.map(x=>x.id),difficultyCounts:p.items.reduce((a,x)=>{const k=String(x.difficulty||'').toUpperCase();if(k in a)a[k]++;return a},{KOLAY:0,ORTA:0,ZOR:0}),total:p.count}});
      P.recordOnce(event)
    }
    state.miniTests??={history:[]};
    state.miniTests.teacherTask={date:today(),topic:ctx.topic,topicId:topic?.id||'',exam:ctx.exam,subject:ctx.subject,sessionId,decisionId,mode:daily.mode||'diagnostic',expectedCount:p.count,fallback:false,strictTopic:true,itemIds:p.items.map(x=>x.id)};
    state.miniTests.prefillSubject=`${ctx.exam} ${ctx.subject}`;
    state.miniTests.prefillTopic=ctx.topic;
    if(state.teacher?.daily){
      state.teacher.daily.testLaunchedAt=Date.now();
      state.teacher.daily.teacherExam=ctx.exam;
      state.teacher.daily.teacherSubject=ctx.subject;
      state.teacher.daily.teacherTopic=ctx.topic;
      state.teacher.daily.teacherSetItemIds=p.items.map(x=>x.id)
    }
    save();go('tests');window.renderMiniTestHome?.();
    let tries=0;
    const setup=()=>{
      if(++tries>50)return;
      const ex=document.getElementById('mtsExam');if(!ex){setTimeout(setup,60);return}
      if(!choose(ex,ctx.exam)){setTimeout(setup,60);return}
      const sub=document.getElementById('mtsSubject');if(!sub){setTimeout(setup,60);return}
      if(!choose(sub,ctx.subject)){setTimeout(setup,60);return}
      const top=document.getElementById('mtsTopic');if(!top){setTimeout(setup,60);return}
      if(!choose(top,ctx.topic)){setTimeout(setup,60);return}
      const count=document.getElementById('mtsCount');if(count)count.value=String(p.count);
      const build=document.getElementById('mtsBuild');
      if(build)setTimeout(()=>build.click(),30);else setTimeout(setup,60)
    };
    setTimeout(setup,80)
  }

  function recapHtml(data,ctx){
    return `<div class="pt2-recap"><h3>${esc(data.title||ctx.topic)}</h3><p class="muted">${esc(data.overview||'')}</p><div class="pt2-key">${(data.key_points||[]).map((x,i)=>`<div><b>${i+1}. nokta</b><br>${esc(x)}</div>`).join('')}</div><div class="pt2-warn"><b>⚠️ Sık hata</b><br>${esc(data.common_mistake||'')}</div><div class="pt2-tip"><b>💡 Sınav püf noktası</b><br>${esc(data.exam_tip||'')}</div><div class="pt2-recap-actions"><button id="pt3RecapDone" class="primary">✓ Tekrarı Tamamladım</button><button id="pt3RecapClose" class="ghost">Kapat</button></div></div>`
  }

  async function openRecap(ctx,button){
    const d=state.teacher?.daily||{};
    if(!ctx||(!['repair','foundation'].includes(d.mode)&&!d.testDone)||recapBusy)return;
    const slot=document.getElementById('pt2RecapSlot');if(!slot)return;

    recapBusy=true;
    const oldText=button?.textContent||'Hızlı Tekrarı Aç';
    if(button){button.disabled=true;button.textContent='Hazırlanıyor…'}
    slot.innerHTML='<div class="pt2-recap"><b>✍️ Hızlı tekrar hazırlanıyor…</b><p class="muted">Eksik noktalar seçiliyor.</p></div>';
    requestAnimationFrame(()=>slot.scrollIntoView({behavior:'smooth',block:'center'}));

    const insight=topicTestInsight(ctx),key=`${ctx.exam}|${ctx.subject}|${ctx.topic}|${JSON.stringify(insight?[insight.totalTests,insight.totalQuestions,insight.correct,insight.wrong,insight.blank,insight.lastTestAt,insight.trend]:[])}`;
    state.teacher??={};state.teacher.recapCache??={};
    let data=state.teacher.recapCache[key];

    try{
      if(!data){
        const r=await fetch('/api/teacher-recap',{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({
            exam:ctx.exam,subject:ctx.subject,topic:ctx.topic,
            mastery:Number(document.querySelector('#teacher .pt2-metric b')?.textContent?.replace('%',''))||0,
            recentWrongCount:Number(state.teacher?.daily?.testSummary?.mistakes||0),
            topicTestEvidence:insight
          })
        });
        const j=await r.json();
        if(!r.ok)throw new Error(j.error||'Tekrar hazırlanamadı');
        state.teacher.recapCache[key]=j;save();data=j
      }

      slot.innerHTML=recapHtml(data,ctx);
      requestAnimationFrame(()=>slot.scrollIntoView({behavior:'smooth',block:'start'}));
      slot.querySelector('#pt3RecapDone').onclick=()=>{
        if(state.teacher?.daily){
          state.teacher.daily.recapDone=true;
          state.teacher.daily.sessionDone=false
        }
        save();
        window.renderTeacher?.();
        setTimeout(()=>document.querySelector('#teacher .pt2-task.active')?.scrollIntoView({behavior:'smooth',block:'center'}),60)
      };
      slot.querySelector('#pt3RecapClose').onclick=()=>slot.innerHTML=''
    }catch(e){
      slot.innerHTML=`<div class="pt2-recap"><b>Tekrar hazırlanamadı</b><p>${esc(e?.message||'Bağlantı hatası')}</p><button id="pt3RecapRetry" class="primary">Tekrar Dene</button></div>`;
      const retry=slot.querySelector('#pt3RecapRetry');
      if(retry)retry.onclick=()=>{recapBusy=false;openRecap(ctx,button)}
    }finally{
      recapBusy=false;
      if(button?.isConnected){button.disabled=false;button.textContent=oldText}
    }
  }

  document.addEventListener('click',e=>{
    const b=e.target.closest('#teacher #pt2Recap');
    if(!b||b.disabled)return;
    const ctx=context();if(!ctx)return;
    e.preventDefault();e.stopImmediatePropagation();
    openRecap(ctx,b)
  },true);

  document.addEventListener('click',e=>{
    const b=e.target.closest('#teacher #pt3Test');if(!b||b.disabled)return;
    const ctx=context(),p=ctx?plan(ctx):null;if(!ctx||!p?.count)return;
    e.preventDefault();e.stopImmediatePropagation();launch(ctx,p)
  },true);

  function schedule(){clearTimeout(timer);timer=setTimeout(adapt,60)}
  const root=document.getElementById('teacher');
  if(root)new MutationObserver(ms=>{if(ms.some(m=>m.addedNodes?.length||m.removedNodes?.length))schedule()}).observe(root,{childList:true,subtree:true});
  document.addEventListener('click',e=>{if(e.target.closest('[data-go="teacher"],#pt2Recap,#pt3RecapDone,#mtsFinish'))setTimeout(schedule,80)},true);
  schedule();
})();
