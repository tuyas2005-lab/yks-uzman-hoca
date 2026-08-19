(()=>{
  const today=()=>new Date().toLocaleDateString('sv-SE');
  const norm=s=>String(s||'').toLocaleLowerCase('tr-TR');
  const sourceLabel=x=>x?.source==='mini-test'?'Mini Test':/photo|text|question|solve/.test(x?.source||'')?'Soru Çöz':/teacher/.test(x?.source||'')?'Kişisel Öğretmen':x?.source||'Çalışma';
  const allRows=()=> (state.studyEvents||[]).filter(x=>x?.meta?.wrongRecord===true).slice().sort((a,b)=>(b.timestamp||0)-(a.timestamp||0));
  function visibleRows(){
    let a=allRows();
    const ex=document.getElementById('wrong2Exam')?.value||'all';
    const sub=document.getElementById('wrong2Subject')?.value||'all';
    const top=document.getElementById('wrong2Topic')?.value||'all';
    const src=document.getElementById('wrong2Source')?.value||'all';
    const q=(document.getElementById('wrong2Search')?.value||'').trim();
    if(ex!=='all')a=a.filter(x=>x.exam===ex);
    if(sub!=='all')a=a.filter(x=>x.subject===sub);
    if(top!=='all')a=a.filter(x=>x.topic===top);
    if(src!=='all')a=a.filter(x=>sourceLabel(x)===src);
    if(q){const z=norm(q);a=a.filter(x=>norm([x.subject,x.topic,x.meta?.solution?.curriculumOutcome,x.meta?.question?.text].join(' ')).includes(z))}
    return a;
  }
  function recordExact(id){
    if(!id)return;const src=(state.studyEvents||[]).find(x=>x.id===id);if(!src)return;
    const exists=(state.studyEvents||[]).some(x=>x.source==='wrong-review'&&x.dateKey===today()&&x.meta?.reviewOf===id);if(exists)return;
    try{window.YKSDataV5?.record?.({source:'wrong-review',exam:src.exam,track:src.track,subject:src.subject,topic:src.topic,curriculumOutcome:src.curriculumOutcome||src.meta?.solution?.curriculumOutcome||'',result:'unknown',difficulty:src.difficulty,interaction:'reviewed',questionCount:0,signals:['reviewed-wrong'],meta:{reviewOf:id,reviewedAt:Date.now(),exactId:true}},{persistNow:true})}catch(e){console.warn('Kesin yanlış tekrar kaydı oluşturulamadı',e)}
    setTimeout(()=>{try{window.renderHome?.()}catch{}},20);
  }
  document.addEventListener('click',e=>{
    const btn=e.target.closest('#wrong2Host [data-wrong2]');if(!btn)return;
    const idx=Number(btn.dataset.wrong2);const row=visibleRows()[idx];if(row)recordExact(row.id);
  },true);
})();
