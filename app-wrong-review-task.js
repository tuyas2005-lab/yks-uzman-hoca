(()=>{
  const today=()=>new Date().toLocaleDateString('sv-SE');
  const wrongs=()=> (state.studyEvents||[]).filter(x=>x?.meta?.wrongRecord===true).slice().sort((a,b)=>(b.timestamp||0)-(a.timestamp||0));
  const targets=()=>wrongs().slice(0,3);
  const reviewedIds=()=>new Set((state.studyEvents||[]).filter(x=>x?.source==='wrong-review'&&x?.dateKey===today()).map(x=>x?.meta?.reviewOf).filter(Boolean));

  function progress(){
    const t=targets(),done=reviewedIds();
    const reviewed=t.filter(x=>done.has(x.id)).length;
    return{total:t.length,reviewed,complete:t.length===0||reviewed>=t.length};
  }
  window.getWrongReviewProgress=progress;

  function recordReview(id){
    const src=(state.studyEvents||[]).find(x=>x.id===id);if(!src)return;
    const exists=(state.studyEvents||[]).some(x=>x.source==='wrong-review'&&x.dateKey===today()&&x.meta?.reviewOf===id);if(exists){patchHome();return}
    try{
      window.YKSDataV5?.record?.({source:'wrong-review',exam:src.exam,track:src.track,subject:src.subject,topic:src.topic,curriculumOutcome:src.curriculumOutcome||src.meta?.solution?.curriculumOutcome||'',result:'unknown',difficulty:src.difficulty,interaction:'reviewed',questionCount:0,signals:['reviewed-wrong'],meta:{reviewOf:id,reviewedAt:Date.now()}},{persistNow:true});
    }catch(e){console.warn('Yanlış tekrar kaydı oluşturulamadı',e)}
    patchHome();
  }

  function patchWrongButtons(){
    const host=document.getElementById('wrong2Host');if(!host)return;
    const data=targets();
    host.querySelectorAll('[data-wrong2]').forEach(btn=>{
      if(btn.dataset.reviewTaskBound)return;btn.dataset.reviewTaskBound='1';
      btn.addEventListener('click',()=>{
        // Listed rows may be filtered/sorted. Find the opened record by visible subject/topic when possible.
        const row=btn.closest('.wrong2-item');
        const text=row?.innerText||'';
        const candidate=wrongs().find(x=>text.includes(x.topic||'')&&text.includes(`${x.exam} ${x.subject}`))||data[Number(btn.dataset.wrong2)];
        if(candidate)recordReview(candidate.id);
      },true);
    });
  }

  function patchHome(){
    const plan=document.getElementById('dailyPlan');if(!plan)return;
    const item=[...plan.querySelectorAll('[data-home-task]')].find(el=>/yanlış/i.test(el.querySelector('strong')?.textContent||''));
    if(!item)return;
    const p=progress(),strong=item.querySelector('strong'),small=item.querySelector('small'),pill=item.querySelector('.pill'),check=item.querySelector('.check');
    if(p.total===0){
      if(strong)strong.textContent='Tekrar bekleyen yanlış yok';
      if(small)small.textContent='Yeni bir yanlış oluştuğunda burada tekrar görevi açılır.';
    }else{
      if(strong)strong.textContent=`Son yanlışlarını tekrar et • ${p.reviewed}/${p.total}`;
      if(small)small.textContent='Yanlışlarım sayfasında “Yanlışı Aç” ile soru ve çözümü yeniden incele.';
    }
    item.classList.toggle('done',p.complete);
    if(check)check.textContent=p.complete?'✓':check.textContent==='✓'?'3':check.textContent;
    if(pill){pill.textContent=p.complete?'Tamam':`${p.reviewed}/${p.total} İncele`;pill.className=`pill ${p.complete?'green':'orange'}`}
    // Make sure the task opens the wrong-answer library.
    item.onclick=()=>go('wrong');
  }

  // Track any Wrong Library render, including filtering.
  const hook=()=>{
    if(typeof window.renderWrongV2==='function'&&!window.renderWrongV2.__reviewTaskWrapped){
      const base=window.renderWrongV2;
      const wrapped=function(){const r=base.apply(this,arguments);setTimeout(patchWrongButtons,0);return r};
      wrapped.__reviewTaskWrapped=true;window.renderWrongV2=wrapped;try{renderWrongV2=wrapped}catch{}
    }
    if(typeof window.renderHome==='function'&&!window.renderHome.__wrongReviewWrapped){
      const base=window.renderHome;
      const wrapped=function(){const r=base.apply(this,arguments);setTimeout(patchHome,0);return r};
      wrapped.__wrongReviewWrapped=true;window.renderHome=wrapped;try{renderHome=wrapped}catch{}
    }
    patchWrongButtons();patchHome();
  };
  let tries=0;const timer=setInterval(()=>{tries++;hook();if((window.renderWrongV2&&window.renderHome)||tries>80)clearInterval(timer)},100);
  document.addEventListener('click',e=>{if(e.target.closest('[data-go="home"],#favLibraryBack'))setTimeout(patchHome,40)},true);
})();
