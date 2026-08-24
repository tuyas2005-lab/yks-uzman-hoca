(()=>{
  const pool=window.MEBManualStudentPool1523;
  const catalog=window.YKSQuestionCatalogV1;
  if(!pool||!catalog||window.__mebManualPoolRegistered)return;
  const rows=(pool.rows||[]).map(row=>{
    const dir=row.sourceSeries==='MEB 3 Adım TYT Matematik'?'meb-3-adim-tyt-math-v10-full':'meb-dort-dortluk-tyt-math-v11';
    const ready=row.status==='student-ready'&&row.answerVerified===true&&row.manualCrop===true;
    return {...row,sourceKind:'manual-crop',priority:90,asset:{status:ready?'ready':'pending',kind:'static-crop',url:`/assets/${dir}/${row.id}.jpg`,sourceRelativePath:`assets/${dir}/${row.id}.jpg`},access:{mode:'static-crop',url:`/assets/${dir}/${row.id}.jpg`}};
  });
  catalog.register(rows);
  window.__mebManualPoolRegistered=true;
  window.MEBManualStudentPool1523.rows=rows;
  window.isStudentVisibleQuestion=row=>row?.provider==='MEB_OGM'&&row.status==='student-ready'&&row.manualCrop===true&&row.answerVerified===true&&row.asset?.status==='ready';
})();
