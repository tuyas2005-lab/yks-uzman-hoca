(()=>{
  const n=s=>String(s||'').toLocaleLowerCase('tr-TR').replace(/[^a-z0-9çğıöşü]+/g,' ').trim();
  function setPrefill(subject='',topic=''){state.miniTests??={history:[]};state.miniTests.prefillSubject=subject||state.miniTests.prefillSubject||'';state.miniTests.prefillTopic=topic||'';save()}
  document.addEventListener('click',e=>{const task=e.target.closest('#dailyPlan [data-home-task]');if(task){const title=task.querySelector('strong')?.textContent||'';if(/mini test|seviye ölçümü/i.test(title)){const topic=title.split('•').slice(1).join('•').trim();const metric=window.getLearningSnapshot?.().metrics?.find(x=>x.topic===topic);setPrefill(metric?`${metric.exam} ${metric.subject}`:'',topic)}}const subjectBtn=e.target.closest('#home .subject');if(subjectBtn)setPrefill(subjectBtn.textContent.trim(),'')},true);

  const afterPaint=(fn,delay=40)=>requestAnimationFrame(()=>requestAnimationFrame(()=>setTimeout(()=>{
    const run=()=>{try{fn()}catch(e){console.warn('Geçiş sonrası yenileme:',e)}};
    if('requestIdleCallback'in window)requestIdleCallback(run,{timeout:900});else setTimeout(run,0);
  },delay)));

  if(typeof go==='function'&&!window.__connectedGo){
    const base=go;
    go=function(id){
      // Ekranı önce değiştir. Veri modeli / ağır render işleri navigasyonu bloklamasın.
      const r=base(id);
      afterPaint(()=>{
        if(id==='home')window.renderHome?.();
        if(id==='topics')window.renderTopics?.();
        if(id==='wrong'){window.renderWrong?.();setTimeout(()=>window.renderWrongV2?.(),10)}
        if(id==='stats')window.renderStats?.();
        if(id==='tests')window.renderMiniTestHome?.();
        if(id==='teacher')window.renderTeacher?.();
        if(id==='coach')window.renderCoach?.();
      },id==='home'?80:40);
      return r;
    };
    window.go=go;window.__connectedGo=true;
  }
})();

// Ağır V5 bağımlılıklarını tek tek ve tarayıcı boş kaldıkça yükle.
// Özellikle tabletlerde onlarca scriptin aynı anda parse edilmesi menü tıklamalarını 15-30 sn bloke edebiliyordu.
const __yksScriptQueue=[];
let __yksScriptLoading=false;
function __yksPumpScripts(){
  if(__yksScriptLoading||!__yksScriptQueue.length)return;
  const job=__yksScriptQueue.shift();
  __yksScriptLoading=true;
  const start=()=>{
    const s=document.createElement('script');
    s.src=job.src;
    s.async=true;
    const done=(ok=true)=>{
      __yksScriptLoading=false;
      if(ok&&job.onload){try{job.onload()}catch(e){console.warn('Script callback:',job.src,e)}}
      if(!ok)console.warn('Yüklenemedi:',job.src);
      setTimeout(__yksPumpScripts,70);
    };
    s.onload=()=>done(true);
    s.onerror=()=>done(false);
    document.body.appendChild(s);
  };
  if('requestIdleCallback'in window)requestIdleCallback(start,{timeout:1400});else setTimeout(start,90);
}
function loadScript(src,onload){__yksScriptQueue.push({src,onload});__yksPumpScripts()}
function loadSeries(list,done){const a=[...(list||[])];const next=()=>{if(!a.length){done?.();return}loadScript(a.shift(),next)};next()}

(function bootV5Deps(tries=0){
  if(!window.YKSDataV5){if(tries<100)setTimeout(()=>bootV5Deps(tries+1),40);return}
  loadScript('/app-live-status.js?v=1');
  loadScript('/app-ui-cleanup-v1.js?v=1');
  loadScript('/app-topic-ui.js?v=1');
  loadScript('/data/question-catalog-v1.js?v=2',()=>{
    loadScript('/data/catalog/catalog-manifest.js?v=2',()=>{
      loadSeries(window.YKSQuestionCatalogFiles||[],()=>{
        loadScript('/data/question-catalog-dedupe.js?v=1',()=>{
          loadScript('/data/question-catalog-policy-v2.js?v=2',()=>{
            loadScript('/app-source-question-viewer.js?v=4',()=>{
              loadScript('/app-tablet-pen.js?v=5');
              loadScript('/app-source-screen-nav-fix.js?v=1');
              loadSeries([
                '/app-source-map-2026-tyt-math-01-30.js?v=2',
                '/app-source-map-2026-tyt-fen.js?v=1',
                '/app-source-map-2026-tyt-social.js?v=1',
                '/app-source-map-2026-tyt-turkce.js?v=2',
                '/app-source-map-2026-ayt.js?v=1'
              ],()=>{
                loadScript('/app-source-incomplete-policy.js?v=2',()=>{
                  loadScript('/app-question-index.js?v=1',()=>loadScript('/app-question-index-homefix.js?v=1'));
                  loadScript('/app-official-question-pilot.js?v=4');
                  loadScript('/app-mini-tests-source.js?v=4',()=>{
                    loadScript('/app-mini-tests-prefill.js?v=1');
                    loadScript('/app-source-direct-open.js?v=2',()=>loadScript('/app-source-retake-position.js?v=1'));
                  });
                });
              });
            });
          });
        });
      });
    });
  });
  loadScript('/app-wrongs-v2.js?v=1',()=>loadScript('/app-wrong-review-task.js?v=2',()=>loadScript('/app-wrong-review-id-fix.js?v=1',()=>loadScript('/app-wrongs-source-link.js?v=3',()=>loadScript('/app-wrong-priority-order.js?v=1',()=>loadScript('/app-wrong-closure-v2.js?v=1'))))));
  loadScript('/app-field-track.js?v=2',()=>{
    loadScript('/app-low-cost.js?v=2',()=>loadScript('/app-low-cost-fix.js?v=2'));
    loadScript('/app-teacher-performance.js?v=2',()=>loadScript('/app-personal-teacher-v2.js?v=1',()=>loadScript('/app-source-set-tracking.js?v=1',()=>loadScript('/app-teacher-wrong-scope.js?v=1',()=>loadScript('/app-home-teacher-flow.js?v=1',()=>loadScript('/app-personal-teacher-policy-v3.js?v=1',()=>loadScript('/app-personal-teacher-source-launch-v3.js?v=2',()=>loadScript('/app-home-teacher-count-fix.js?v=2'))))))));
    loadScript('/app-stats-v2.js?v=2',()=>loadScript('/app-stats-v3.js?v=2'));
    loadScript('/app-strategy-engine.js?v=2');
    loadScript('/app-profile-consistency.js?v=1');
  });
})();
