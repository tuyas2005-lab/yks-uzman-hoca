(()=>{
  const C=window.YKSQuestionCatalogV1;if(!C)return;
  const norm=s=>String(s||'').toLocaleLowerCase('tr-TR').replace(/[^a-z0-9çğıöşü]+/g,' ').trim();
  const words=s=>new Set(norm(s).split(' ').filter(x=>x.length>2));
  const overlap=(a,b)=>{const A=words(a),B=words(b);let n=0;A.forEach(x=>B.has(x)&&n++);return n};
  const providerRank=x=>x?.provider==='OSYM'?30:x?.provider==='MEB_OGM'?20:x?.sourceKind==='uploaded'?10:0;
  const solvedEvents=()=> (window.state?.studyEvents||[]).filter(x=>x?.source==='source-question-result'&&x?.meta?.catalogId);
  const solvedIds=()=>new Set(solvedEvents().map(x=>x.meta.catalogId));
  const rowTrack=x=>x?.track||'main';
  const needsTopicReview=x=>x?.verification?.topic==='needs-manual-review-text-extraction-loss';

  function trackEligible(x,q={}){
    if(q.track)return rowTrack(x)===q.track;
    if(q.includeAlternateTrack===true)return true;
    return rowTrack(x)!=='alternate-track';
  }

  function topicEligible(x,q={}){
    return !norm(q.topic)||!needsTopicReview(x);
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

  function eligible(q={}){
    const done=solvedIds();
    return C.all().filter(x=>!done.has(x.id))
      .filter(x=>trackEligible(x,q))
      .filter(x=>topicEligible(x,q))
      .filter(x=>!q.exam||String(x.exam||'').toUpperCase()===String(q.exam||'').toUpperCase())
      .filter(x=>!q.subject||norm(x.subject)===norm(q.subject))
      .map(x=>({...x,_match:relevance(x,q),_year:Number(x.year||0)}))
      .filter(x=>!norm(q.topic)||x._match>0);
  }

  function findNextBatch(q={},limit=5){
    const rows=eligible(q);if(!rows.length)return[];
    const newest=Math.max(...rows.map(x=>x._year));
    return rows.filter(x=>x._year===newest)
      .sort((a,b)=>b._match-a._match||providerRank(b)-providerRank(a)||String(a.questionNo||'').localeCompare(String(b.questionNo||''),'tr'))
      .slice(0,limit);
  }

  function progress(q={}){
    const all=C.all()
      .filter(x=>trackEligible(x,q))
      .filter(x=>topicEligible(x,q))
      .filter(x=>!q.exam||String(x.exam||'').toUpperCase()===String(q.exam||'').toUpperCase())
      .filter(x=>!q.subject||norm(x.subject)===norm(q.subject));
    const done=solvedIds();
    const relevant=all.map(x=>({...x,_match:relevance(x,q)})).filter(x=>!norm(q.topic)||x._match>0);
    const years=[...new Set(relevant.map(x=>Number(x.year||0)))].sort((a,b)=>b-a);
    return{total:relevant.length,solved:relevant.filter(x=>done.has(x.id)).length,remaining:relevant.filter(x=>!done.has(x.id)).length,years};
  }

  C.findNextBatch=findNextBatch;
  C.getSolvedIds=solvedIds;
  C.getProgress=progress;
  C.selectionPolicy={mode:'library-only',order:['topic-match','unsolved','year-desc','provider','relevance'],yearGate:true,providerOrder:['OSYM','MEB_OGM','uploaded-pdf'],openedIsSolved:false,resultMarksSolved:true,defaultTrack:'main',alternateTrackOptIn:true,strictTopicSkipsManualReview:true};
})();
