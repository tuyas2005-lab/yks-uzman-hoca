(()=>{
  const n=s=>String(s||'').toLocaleLowerCase('tr-TR').replace(/[^a-z0-9çğıöşü]+/g,' ').trim();
  function setPrefill(subject='',topic=''){state.miniTests??={history:[]};state.miniTests.prefillSubject=subject||state.miniTests.prefillSubject||'';state.miniTests.prefillTopic=topic||'';save()}
  document.addEventListener('click',e=>{const task=e.target.closest('#dailyPlan [data-home-task]');if(task){const title=task.querySelector('strong')?.textContent||'';if(/mini test|seviye ölçümü/i.test(title)){const topic=title.split('•').slice(1).join('•').trim();const metric=window.getLearningSnapshot?.().metrics?.find(x=>x.topic===topic);setPrefill(metric?`${metric.exam} ${metric.subject}`:'',topic)}}const subjectBtn=e.target.closest('#home .subject');if(subjectBtn)setPrefill(subjectBtn.textContent.trim(),'')},true);
  if(typeof go==='function'&&!window.__connectedGo){const base=go;go=function(id){try{window.YKSDataV5?.syncLegacy?.();window.refreshLearningModel?.()}catch{}const r=base(id);if(id==='home')setTimeout(()=>window.renderHome?.(),0);if(id==='topics')setTimeout(()=>window.renderTopics?.(),0);if(id==='wrong'){setTimeout(()=>window.renderWrong?.(),0);setTimeout(()=>window.renderWrongV2?.(),10)}if(id==='stats')setTimeout(()=>window.renderStats?.(),0);if(id==='tests')setTimeout(()=>window.renderMiniTestHome?.(),0);if(id==='teacher')setTimeout(()=>{try{window.renderTeacher?.()}catch{}},0);if(id==='coach')setTimeout(()=>{try{window.renderCoach?.()}catch{}},0);return r};window.go=go;window.__connectedGo=true}
})();
function loadScript(src,onload){const s=document.createElement('script');s.src=src;s.onload=onload||null;s.onerror=()=>console.warn('Yüklenemedi:',src);document.body.appendChild(s)}
function loadSeries(list,done){const a=[...(list||[])];const next=()=>{if(!a.length){done?.();return}loadScript(a.shift(),next)};next()}
(function bootV5Deps(tries=0){
  if(!window.YKSDataV5){if(tries<100)setTimeout(()=>bootV5Deps(tries+1),40);return}
  loadScript('/app-live-status.js?v=1');
  loadScript('/app-favorites-nav-fix.js?v=1');
  loadScript('/app-topic-ui.js?v=1');
  loadScript('/data/question-catalog-v1.js?v=2',()=>{
    loadScript('/data/catalog/catalog-manifest.js?v=1',()=>{
      loadSeries(window.YKSQuestionCatalogFiles||[],()=>{
        loadScript('/data/question-catalog-dedupe.js?v=1',()=>{
          loadScript('/data/question-catalog-policy-v2.js?v=2',()=>{
            loadScript('/app-source-question-viewer.js?v=3',()=>{
              loadSeries([
                '/app-source-map-2026-tyt-math-01-30.js?v=2',
                '/app-source-map-2026-tyt-fen.js?v=1',
                '/app-source-map-2026-tyt-social.js?v=1',
                '/app-source-map-2026-tyt-turkce.js?v=1'
              ],()=>{
                loadScript('/app-question-index.js?v=1',()=>loadScript('/app-question-index-homefix.js?v=1'));
                loadScript('/app-official-question-pilot.js?v=4');
                loadScript('/app-mini-tests-source.js?v=2',()=>{
                  loadScript('/app-mini-tests-prefill.js?v=1');
                  loadScript('/app-source-direct-open.js?v=2');
                });
              });
            });
          });
        });
      });
    });
  });
  loadScript('/app-wrongs-v2.js?v=1',()=>loadScript('/app-wrong-review-task.js?v=1',()=>loadScript('/app-wrong-review-id-fix.js?v=1',()=>loadScript('/app-wrongs-source-link.js?v=3'))));
  loadScript('/app-field-track.js?v=2',()=>{
    loadScript('/app-low-cost.js?v=2',()=>loadScript('/app-low-cost-fix.js?v=2'));
    loadScript('/app-teacher-performance.js?v=2');
    loadScript('/app-stats-v2.js?v=2',()=>loadScript('/app-stats-v3.js?v=2'));
    loadScript('/app-strategy-engine.js?v=2');
  });
})();