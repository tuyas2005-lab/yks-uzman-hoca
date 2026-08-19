(()=>{
  const norm=s=>String(s||'').toLocaleLowerCase('tr-TR');
  const sourceLabel=x=>x?.source==='mini-test'?'Mini Test':x?.source==='source-question-result'?'Kaynak Soru':/photo|text|question|solve/.test(x?.source||'')?'Soru Çöz':/teacher/.test(x?.source||'')?'Kişisel Öğretmen':x?.source||'Çalışma';
  const allRows=()=> (state.studyEvents||[]).filter(x=>x?.meta?.wrongRecord===true).slice().sort((a,b)=>(b.timestamp||0)-(a.timestamp||0));
  function visibleRows(){let a=allRows();const ex=document.getElementById('wrong2Exam')?.value||'all',sub=document.getElementById('wrong2Subject')?.value||'all',top=document.getElementById('wrong2Topic')?.value||'all',src=document.getElementById('wrong2Source')?.value||'all',q=(document.getElementById('wrong2Search')?.value||'').trim();if(ex!=='all')a=a.filter(x=>x.exam===ex);if(sub!=='all')a=a.filter(x=>x.subject===sub);if(top!=='all')a=a.filter(x=>x.topic===top);if(src!=='all')a=a.filter(x=>sourceLabel(x)===src);if(q){const z=norm(q);a=a.filter(x=>norm([x.subject,x.topic,x.meta?.solution?.curriculumOutcome,x.meta?.question?.text].join(' ')).includes(z))}return a}
  const style=document.createElement('style');style.textContent='.wrong2-source-open{display:inline-flex;margin-top:12px;border:0;background:#6b4ce6;color:#fff;border-radius:11px;padding:10px 13px;font-weight:850;text-decoration:none;cursor:pointer}.wrong2-source-note{margin-top:12px;padding:12px;border-radius:13px;background:#eef8f3;border:1px solid #cfe8d9;font-size:12px;line-height:1.45}.wrong2-question.source-crop{background:#fff;display:grid;place-items:center}.wrong2-question.source-crop img{max-height:520px;width:auto;max-width:100%}';document.head.appendChild(style);

  async function enhanceWrong(row){
    const body=document.getElementById('wrong2ModalBody');if(!body||body.querySelector('.wrong2-source-note'))return;
    const id=row?.meta?.catalogId,item=window.YKSQuestionCatalogV1?.all?.().find(x=>x.id===id);
    if(!id||!item)return;
    const questionBox=body.querySelector('.wrong2-question');
    try{const url=await window.getSourceQuestionCropUrl?.(id);if(url&&questionBox){questionBox.classList.add('source-crop');questionBox.innerHTML=`<img src="${url}" alt="${item.year||''} ${item.exam} ${item.subject} Soru ${item.questionNo||''}">`}}catch{}
    const box=document.createElement('div');box.className='wrong2-source-note';box.innerHTML='Bu yanlış kaynak kütüphanesindeki tek-soru görüntüsüyle yeniden açılabilir. Tam PDF açılmaz.<br><button class="wrong2-source-open" type="button">Soruyu Tek Görüntüde Aç →</button>';body.appendChild(box);
    box.querySelector('.wrong2-source-open').onclick=()=>{const modal=document.getElementById('wrong2Modal');modal?.classList.remove('open');window.openSourceQuestion?.(item,{type:'wrong',returnScreen:'wrong',reopenModal:true})};
  }

  document.addEventListener('click',e=>{const btn=e.target.closest('#wrong2Host [data-wrong2]');if(!btn)return;const row=visibleRows()[Number(btn.dataset.wrong2)];if(!row?.meta?.externalQuestion||!row.meta?.catalogId)return;setTimeout(()=>enhanceWrong(row),30)},true);
})();