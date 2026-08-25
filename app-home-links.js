(()=>{
  const n=s=>String(s||'').toLocaleLowerCase('tr-TR').replace(/[^a-z0-9çğıöşü]+/g,' ').trim();
  const gatedScreens=['tests','wrong','teacher','coach','stats'];
  gatedScreens.forEach(id=>document.getElementById(id)?.classList.add('module-gated'));
  const liveLabel=document.getElementById('liveText');
  if(liveLabel&&/demo modu|skill yerel/i.test(liveLabel.textContent||''))liveLabel.textContent='Bağlantı kontrol ediliyor…';
  const markReady=id=>document.getElementById(id)?.classList.add('module-ready');
  function setPrefill(subject='',topic=''){
    state.miniTests??={history:[]};
    state.miniTests.prefillSubject=subject||state.miniTests.prefillSubject||'';
    state.miniTests.prefillTopic=topic||'';
    save();
  }
  document.addEventListener('click',e=>{
    const task=e.target.closest('#dailyPlan [data-home-task]');
    if(task){
      const title=task.querySelector('strong')?.textContent||'';
      if(/mini test|seviye ölçümü/i.test(title)){
        const topic=title.split('•').slice(1).join('•').trim();
        const metric=window.getLearningSnapshot?.().metrics?.find(x=>x.topic===topic);
        setPrefill(metric?`${metric.exam} ${metric.subject}`:'',topic);
      }
    }
    const subjectBtn=e.target.closest('#home .subject');
    if(subjectBtn)setPrefill(subjectBtn.textContent.trim(),'');
  },true);

  let activeScreen=document.querySelector('.screen.active')?.id||'home';
  const loaded=new Set();
  const loading=new Map();
  let resolveQuestionRuntimeReady;
  const questionRuntimeReady=new Promise(resolve=>{resolveQuestionRuntimeReady=resolve});
  window.whenQuestionRuntimeReady=()=>{
    if(window.YKSQuestionCatalogV1&&typeof window.openSourceQuestion==='function')return Promise.resolve();
    return questionRuntimeReady;
  };

  function loadScript(src,verify){
    if(loaded.has(src))return Promise.resolve();
    if(loading.has(src))return loading.get(src);
    const p=new Promise((resolve,reject)=>{
      const s=document.createElement('script');
      s.src=src;
      s.async=true;
      s.onload=()=>{try{if(typeof verify==='function')verify();loaded.add(src);loading.delete(src);resolve()}catch(e){loading.delete(src);console.warn('Başlatılamadı:',src,e);reject(e)}};
      s.onerror=()=>{loading.delete(src);console.warn('Yüklenemedi:',src);reject(new Error(src))};
      document.body.appendChild(s);
    });
    loading.set(src,p);
    return p;
  }

  function afterPaint(fn,delay=30){
    requestAnimationFrame(()=>requestAnimationFrame(()=>setTimeout(()=>{
      try{fn()}catch(e){console.warn('Geçiş sonrası yenileme:',e)}
    },delay)));
  }

  function scheduleJob(fn){
    const run=()=>Promise.resolve().then(fn);
    return new Promise((resolve,reject)=>{
      const start=()=>run().then(resolve,reject);
      if('requestIdleCallback'in window)requestIdleCallback(start,{timeout:900});
      else setTimeout(start,80);
    });
  }

  function makeGroup(name,allowed,jobs,onReady){
    return{name,allowed:new Set(allowed),jobs:[...jobs],index:0,running:false,ready:false,onReady};
  }

  const groups={};
  function pump(g){
    if(!g||g.ready||g.running||!g.allowed.has(activeScreen))return;
    if(g.index>=g.jobs.length){
      g.ready=true;
      try{g.onReady?.()}catch(e){console.warn(g.name+' hazır callback',e)}
      return;
    }
    g.running=true;
    const job=g.name==='official'?Promise.resolve().then(g.jobs[g.index]):scheduleJob(g.jobs[g.index]);
    job.catch(e=>console.warn(g.name+' yükleme',e)).finally(()=>{
      g.index++;
      g.running=false;
      setTimeout(()=>pump(g),g.name==='official'?0:120);
    });
  }
  function resumeFor(id){
    Object.values(groups).forEach(g=>{
      if(!g.allowed.has(id))return;
      if(g.ready){try{g.onReady?.()}catch(e){console.warn(g.name+' hazır callback',e)}}
      else pump(g);
    });
  }

  const official=makeGroup('official',['tests','questionIndex','teacher'],[
    ()=>loadScript('/data/question-catalog-v1.js?v=7',()=>{const C=window.YKSQuestionCatalogV1;if(!C||typeof C.all!=='function'||typeof C.register!=='function')throw new Error('Catalog bootstrap failed: YKSQuestionCatalogV1 missing')}),
    async()=>{
      await loadScript('/data/catalog/catalog-manifest.js?v=3');
      const files=(window.YKSQuestionCatalogFiles||[]),pool='/data/catalog/meb-manual-student-pool-1523.js',register='/data/catalog/meb-manual-student-pool-1523-register.js';
      const other=files.filter(src=>src!==pool&&src!==register);
      if(other.length)await Promise.all(other.map(src=>loadScript(src)));
      await loadScript(pool);
      await loadScript(register);
    },
    ()=>loadScript('/data/question-catalog-dedupe.js?v=1'),
    ()=>loadScript('/data/question-catalog-policy-v2.js?v=4'),
    ()=>loadScript('/app-source-question-viewer.js?v=10'),
    ()=>loadScript('/app-tablet-pen.js?v=5'),
    ()=>loadScript('/app-source-screen-nav-fix.js?v=1'),
    ()=>loadScript('/app-source-incomplete-policy.js?v=2'),
    ()=>loadScript('/app-question-index.js?v=2'),
    ()=>loadScript('/app-question-index-homefix.js?v=1'),
    ()=>loadScript('/app-question-index-counter-fix.js?v=1'),
    ()=>loadScript('/app-official-question-pilot.js?v=4'),
    ()=>loadScript('/app-mini-tests-source.js?v=14'),
    ()=>loadScript('/app-teacher-source-nav.js?v=3'),
    ()=>loadScript('/app-mini-tests-prefill.js?v=1'),
    ()=>loadScript('/app-source-direct-open.js?v=2'),
    ()=>loadScript('/app-wrong-closure-v2.js?v=5'),
    ()=>loadScript('/app-source-retake-position.js?v=9')
  ],()=>{
    const C=window.YKSQuestionCatalogV1,all=C?.all?.()||[],manual=all.filter(x=>x?.sourceKind==='manual-crop').length,visible=all.filter(x=>x?.sourceKind==='manual-crop'&&x?.manualCrop===true&&x?.answerVerified===true&&x?.status==='student-ready'&&x?.asset?.status==='ready').length,unresolved=manual-visible;
    if(!C||manual!==1523||manual!==visible+unresolved||unresolved!==2){const b=[...document.querySelectorAll('.sidebar button')].find(x=>/Soru İndeksi/.test(x.textContent||''));if(b)b.textContent='🗂️ Soru havuzu yüklenemedi. Yeniden dene.';return}
    resolveQuestionRuntimeReady?.();
    if(typeof window.renderMiniTestHome==='function'){
      markReady('tests');
      if(activeScreen==='tests')window.renderMiniTestHome();
    }
    if(activeScreen==='questionIndex')window.renderQuestionIndex?.();
  });
  groups.official=official;
  groups.sourceEnhancements=makeGroup('sourceEnhancements',['tests','questionIndex'],[
    ()=>loadScript('/app-source-map-2026-tyt-math-01-30.js?v=2'),
    ()=>loadScript('/app-source-map-2026-tyt-fen.js?v=1'),
    ()=>loadScript('/app-source-map-2026-tyt-social.js?v=1'),
    ()=>loadScript('/app-source-map-2026-tyt-turkce.js?v=2'),
    ()=>loadScript('/app-source-map-2026-ayt.js?v=1'),
    ()=>loadScript('/app-source-map-2024-2025-tyt.js?v=1'),
    ()=>loadScript('/app-source-map-2023-tyt-fen.js?v=1'),
    ()=>loadScript('/app-source-map-2023-tyt-math-geometry.js?v=1'),
    ()=>loadScript('/app-source-autocrop.js?v=2')
  ],()=>{});

  groups.wrongs=makeGroup('wrongs',['wrong'],[
    ()=>loadScript('/app-wrongs-v2.js?v=1'),
    ()=>loadScript('/app-wrong-review-task.js?v=4'),
    ()=>loadScript('/app-wrong-review-id-fix.js?v=1'),
    ()=>loadScript('/app-wrongs-source-link.js?v=3'),
    ()=>loadScript('/app-wrong-priority-order.js?v=1'),
    ()=>loadScript('/app-wrong-closure-v2.js?v=5')
  ],()=>{
    if(typeof window.renderWrongV2==='function'){
      window.installWrongClosureV2?.();
      window.renderWrongV2();
      markReady('wrong');
    }
  });

  groups.teacher=makeGroup('teacher',['teacher'],[
    ()=>loadScript('/app-field-track.js?v=2'),
    ()=>loadScript('/app-low-cost.js?v=2'),
    ()=>loadScript('/app-low-cost-fix.js?v=2'),
    ()=>loadScript('/app-teacher-performance.js?v=2'),
    ()=>loadScript('/app-personal-teacher-v2.js?v=8'),
    // Teacher policy v3 requires getStudentStrategy. Load the shared strategy
    // engine in the teacher path too, so opening Teacher before Coach cannot
    // leave the legacy v2 renderer active after the policy install timeout.
    ()=>loadScript('/app-strategy-engine.js?v=3'),
    ()=>loadScript('/app-source-set-tracking.js?v=1'),
    ()=>loadScript('/app-teacher-wrong-scope.js?v=6'),
    ()=>loadScript('/app-home-teacher-flow.js?v=1'),
    ()=>loadScript('/app-personal-teacher-policy-v3.js?v=16'),
    ()=>loadScript('/app-personal-teacher-source-launch-v3.js?v=12'),
    ()=>loadScript('/app-home-teacher-count-fix.js?v=3')
  ],()=>{
    if(typeof window.renderTeacher==='function'){
      window.renderTeacher();
      markReady('teacher');
    }
  });

  groups.stats=makeGroup('stats',['stats'],[
    ()=>loadScript('/app-stats-v3.js?v=4')
  ],()=>{
    if(typeof window.renderStats==='function'){
      window.renderStats();
      markReady('stats');
    }
  });

  groups.settings=makeGroup('settings',['profile'],[
    ()=>loadScript('/app-field-track.js?v=2'),
    ()=>loadScript('/app-profile-consistency.js?v=3')
  ],()=>{});

  groups.coach=makeGroup('coach',['coach'],[
    ()=>loadScript('/app-yks-coach.js?v=3'),
    ()=>loadScript('/app-yks-coach-fix.js?v=2'),
    ()=>loadScript('/app-field-track.js?v=2'),
    ()=>loadScript('/app-strategy-engine.js?v=3'),
    ()=>loadScript('/app-profile-consistency.js?v=3')
  ],()=>{
    if(typeof window.renderCoach==='function'){
      window.renderCoach();
      markReady('coach');
    }
  });

  function installQuestionIndexEntry(){
    const nav=document.querySelector('.sidebar .nav');
    if(nav&&!nav.querySelector('[data-go="questionIndex"]')){
      const b=document.createElement('button');
      b.dataset.go='questionIndex';
      b.innerHTML='🗂️ <span>Soru İndeksi</span>';
      const stats=nav.querySelector('[data-go="stats"]');
      nav.insertBefore(b,stats||nav.lastElementChild);
      b.onclick=()=>{
        activeScreen='questionIndex';
        document.querySelectorAll('[data-go]').forEach(x=>x.classList.toggle('active',x===b));
        const setLabel=text=>{const label=b.querySelector('span');if(label)label.textContent=text;else b.textContent='🗂️ '+text};
        setLabel(official.ready?'Soru İndeksi':'Soru İndeksi hazırlanıyor…');
        pump(official);
        const wait=()=>{
          if(official.ready){setLabel('Soru İndeksi');window.go?.('questionIndex');return}
          if(activeScreen==='questionIndex')setTimeout(wait,180);
        };
        wait();
      };
    }
  }
  installQuestionIndexEntry();

  if(typeof go==='function'&&!window.__connectedGo){
    const base=go;
    go=function(id){
      activeScreen=id;
      const r=base(id);
      afterPaint(()=>{
        if(id==='home')window.renderHome?.();
        if(id==='topics')window.renderTopics?.();
        if(id==='wrong')window.renderWrong?.();
        if(id==='stats')window.renderStats?.();
        if(id==='tests')window.renderMiniTestHome?.();
        if(id==='teacher')window.renderTeacher?.();
        if(id==='coach')window.renderCoach?.();
      },id==='home'?20:35);
      resumeFor(id);
      return r;
    };
    window.go=go;
    window.__connectedGo=true;
  }

  // app-home-links yüklenmeden önce kullanıcı hedef ekrana geçtiyse lazy-load grubunu burada hemen devam ettir.
  resumeFor(activeScreen);

  // Başlangıçta yalnız bağlantı durumunu yenileyen hafif yardımcı yüklenir.
  const light=['/app-live-status.js?v=1'];
  let li=0;
  const loadLight=()=>{
    if(li>=light.length)return;
    const src=light[li++];
    scheduleJob(()=>loadScript(src)).finally(()=>setTimeout(loadLight,250));
  };
  setTimeout(loadLight,250);
})();
