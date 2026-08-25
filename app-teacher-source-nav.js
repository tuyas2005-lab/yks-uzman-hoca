(()=>{
  const teacherTask=()=>state.miniTests?.teacherTask?.sessionId?state.miniTests.teacherTask:null;
  const returnTeacher=()=>{window.go?.('teacher');setTimeout(()=>window.renderTeacher?.(),0)};
  const markTeacherButtons=()=>{if(teacherTask())document.querySelectorAll('#tests .mts-open[data-mts-open]').forEach(button=>button.classList.remove('mts-open'))};

  const css=document.createElement('style');css.textContent=`
    #tests [data-mts-open]{min-width:148px;min-height:46px;padding:11px 18px;border:1px solid #2849d8!important;border-radius:12px!important;background:linear-gradient(180deg,#687cff 0%,#4056ee 58%,#3247cf 100%)!important;color:#fff!important;font-weight:900!important;letter-spacing:.01em;box-shadow:0 5px 0 #2438ad,0 9px 18px rgba(44,61,180,.24)!important;text-shadow:0 1px 1px rgba(0,0,0,.18);transform:translateY(0);transition:transform .1s ease,box-shadow .1s ease,filter .15s ease}
    #tests [data-mts-open]:hover{filter:brightness(1.06)}
    #tests [data-mts-open]:active{transform:translateY(4px);box-shadow:0 1px 0 #2438ad,0 4px 9px rgba(44,61,180,.2)!important}
    #tests [data-mts-open]:focus-visible{outline:3px solid rgba(69,88,238,.28);outline-offset:3px}
    @media(max-width:600px){#tests [data-mts-open]{width:100%;min-width:0}}
  `;document.head.appendChild(css);

  new MutationObserver(markTeacherButtons).observe(document.getElementById('tests')||document.body,{childList:true,subtree:true});
  markTeacherButtons();

  // Öğretmen setindeki soru düğmesini genel Mini Test yakalayıcısından ayır.
  document.addEventListener('pointerdown',e=>{
    const button=e.target.closest('.mts-open');
    if(button&&teacherTask())button.classList.remove('mts-open');
  },true);

  document.addEventListener('click',e=>{
    const task=teacherTask();if(!task)return;
    const setBack=e.target.closest('#mtsSetBack');
    if(setBack){e.preventDefault();e.stopImmediatePropagation();returnTeacher();return}
    const button=e.target.closest('[data-mts-open]:not(.mts-open)');
    if(!button)return;
    e.preventDefault();e.stopImmediatePropagation();
    const id=button.closest('.mts-q')?.dataset.catalogId;
    const item=window.YKSQuestionCatalogV1?.all?.().find(x=>x.id===id);
    if(!item)return alert('Öğretmenin seçtiği soru kaydı bulunamadı.');
    window.openSourceQuestion?.(item,{type:'mini',teacherDirected:true,teacherSessionId:task.sessionId,card:button.closest('.mts-q'),returnScreen:'teacher'});
  },true);
})();
