(()=>{
  const teacherTask=()=>state.miniTests?.teacherTask?.sessionId?state.miniTests.teacherTask:null;
  const returnTeacher=()=>{window.go?.('teacher');setTimeout(()=>window.renderTeacher?.(),0)};
  const markTeacherButtons=()=>{if(teacherTask())document.querySelectorAll('#tests .mts-open[data-mts-open]').forEach(button=>button.classList.remove('mts-open'))};

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
    const viewerBack=e.target.closest('#sqBack,#sqReturn');
    if(setBack||viewerBack){e.preventDefault();e.stopImmediatePropagation();returnTeacher();return}
    const button=e.target.closest('[data-mts-open]:not(.mts-open)');
    if(!button)return;
    e.preventDefault();e.stopImmediatePropagation();
    const id=button.closest('.mts-q')?.dataset.catalogId;
    const item=window.YKSQuestionCatalogV1?.all?.().find(x=>x.id===id);
    if(!item)return alert('Öğretmenin seçtiği soru kaydı bulunamadı.');
    window.openSourceQuestion?.(item,{type:'mini',teacherDirected:true,teacherSessionId:task.sessionId,card:button.closest('.mts-q'),returnScreen:'teacher'});
  },true);
})();
