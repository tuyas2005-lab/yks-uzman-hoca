(()=>{
  const C=()=>window.YKSQuestionCatalogV1;
  const norm=s=>String(s||'').toLocaleLowerCase('tr-TR').replace(/[^a-z0-9çğıöşü]+/g,' ').trim();
  const words=s=>new Set(norm(s).split(' ').filter(x=>x.length>2));
  const overlap=(a,b)=>{const A=words(a),B=words(b);let n=0;A.forEach(x=>B.has(x)&&n++);return n};
  const providerRank=x=>x?.provider==='OSYM'?30:x?.provider==='MEB_OGM'?20:x?.sourceKind==='uploaded'?10:0;
  const solvedIds=()=>new Set((window.state?.studyEvents||[]).filter(x=>x?.source==='source-question-result'&&x?.meta?.catalogId).map(x=>x.meta.catalogId));
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const rowTrack=x=>x?.track||'main';
  const needsTopicReview=x=>x?.verification?.topic==='needs-manual-review-text-extraction-loss';

  function trackEligible(x,q={}){
    if(q.track)return rowTrack(x)===q.track;
    if(q.includeAlternateTrack===true)return true;
    return rowTrack(x)!=='alternate-track';
  }

  function relevance(x,q={}){
    const query=norm([q.topic,q.curriculumOutcome,q.shortSolution].join(' '));
    const item=norm([x.topic,...(x.subtopics||[]),...(x.tags||[])].join(' '));
    let s=overlap(query,item)*18;
    const qt=norm(q.topic),xt=norm(x.topic);
    if(qt&&xt===qt)s+=90;
    else if(qt&&(xt.includes(qt)||qt.includes(xt)))s+=55;
    if(/üçgen/.test(qt)&&/üçgen/.test(item))s+=35;
    if(/trigonom/.test(qt)&&/trigonom/.test(item))s+=40;
    if(/benzer/.test(qt)&&/benzer/.test(item))s+=40;
    if(/pisagor|dik üçgen/.test(qt)&&/pisagor|dik üçgen/.test(item))s+=40;
    if(q.visualPreferred&&x.visual)s+=8;
    return s;
  }

  function itemState(item){
    const imageReady=!!(item?.asset?.status==='ready');
    const answerReady=!!(item?.answerKey&&(item?.answerVerified||item?.verification?.answerKey==='official'));
    return{imageReady,answerReady,complete:imageReady&&answerReady};
  }

  function indexedBatch(q={},limit=5){
    const c=C();if(!c)return[];const done=solvedIds();
    let rows=(c.all?.()||[]).filter(x=>x?.id&&!done.has(x.id))
      .filter(x=>trackEligible(x,q))
      .filter(x=>!norm(q.topic)||!needsTopicReview(x))
      .filter(x=>itemState(x).complete)
      .filter(x=>!q.exam||String(x.exam||'').toUpperCase()===String(q.exam||'').toUpperCase())
      .filter(x=>!q.subject||norm(x.subject)===norm(q.subject))
      .map(x=>({...x,_match:relevance(x,q),_year:Number(x.year||0)}))
      .filter(x=>!norm(q.topic)||x._match>0);
    if(!rows.length)return[];
    const newest=Math.max(...rows.map(x=>x._year));
    return rows.filter(x=>x._year===newest)
      .sort((a,b)=>b._match-a._match||providerRank(b)-providerRank(a)||String(a.questionNo||'').localeCompare(String(b.questionNo||''),'tr'))
      .slice(0,limit);
  }

  function showIncomplete(item,ctx={}){
    const screen=document.getElementById('sourceQuestion'),root=document.getElementById('sqRoot');
    if(!screen||!root)return;
    const st=itemState(item),missing=[];
    if(!st.imageReady)missing.push('tek-soru görseli');
    if(!st.answerReady)missing.push('doğrulanmış cevap anahtarı');
    root.innerHTML=`<div class="sq-meta"><span class="sq-chip">${esc(item.providerLabel||item.provider||'Kaynak')}</span><span class="sq-chip">${esc(`${item.year||''} ${item.exam||''}`.trim())}</span><span class="sq-chip">${esc(`${item.subject||''} • ${item.topic||''}`)}</span><span class="sq-chip sq-pending">Hazırlanıyor</span></div><div class="sq-card"><div class="sq-image"><div class="sq-loading"><b>Bu soru kütüphanede mevcut ancak henüz çözüm ekranına hazır değil.</b><br><br>Bekleyen: ${esc(missing.join(' + ')||'soru içeriği')}<br><small>Kayıt Soru İndeksi'nde korunur; hazır olmayan soru Mini Teste alınmaz.</small></div></div></div><div class="sq-card"><b>${esc(item.collection||'Kaynak')}</b><p class="muted">${esc(item.subject||'')} • ${esc(item.topic||'')} • Soru ${esc(item.questionNo||'—')}</p><button id="sqIncompleteBack" class="ghost">${ctx?.type==='mini'?'Sete Dön':ctx?.type==='wrong'?'Yanlışlarıma Dön':'Geri Dön'}</button></div>`;
    document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active',s===screen));
    document.querySelectorAll('[data-go]').forEach(b=>b.classList.remove('active'));
    window.scrollTo({top:0,behavior:'smooth'});
    document.getElementById('sqIncompleteBack').onclick=()=>{
      const id=ctx?.returnScreen||'home';
      if(ctx?.type==='mini'){
        const tests=document.getElementById('tests');if(tests){document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active',s===tests));return}
      }
      try{window.go(id)}catch{document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active',s.id===id))}
    };
  }

  function install(tries=0){
    const c=C();
    if(!c||typeof window.openSourceQuestion!=='function'){if(tries<100)setTimeout(()=>install(tries+1),80);return}
    c.findNextBatch=indexedBatch;
    c.selectionPolicy={...(c.selectionPolicy||{}),mode:'library-only-ready-first',allowIncomplete:false,readyRequired:true,yearGate:true,defaultTrack:'main',strictTopicSkipsManualReview:true};
    const baseOpen=window.openSourceQuestion;
    window.openSourceQuestion=(item,ctx={})=>{
      const st=itemState(item);
      if(st.complete)return baseOpen(item,ctx);
      return showIncomplete(item,ctx);
    };
    window.isSourceQuestionReady=item=>itemState(item).complete;
    window.isSourceQuestionComplete=item=>itemState(item).complete;
    window.getSourceQuestionPreparationState=itemState;
  }
  install();
})();
