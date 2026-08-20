(()=>{
  const SOURCES={
    2024:{pdfKey:'osym-2024-tyt',sections:{
      tur:[[1,4,3],[5,7,4],[8,11,5],[12,15,6],[16,18,7],[19,22,8],[23,25,9],[26,27,10],[28,31,11],[32,33,12],[34,36,13],[37,38,14],[39,40,15]],
      social:[[1,3,16],[4,7,17],[8,10,18],[11,13,19],[14,15,20],[16,19,21],[20,22,22],[23,25,23]],
      math:[[1,3,24],[4,7,25],[8,9,26],[10,11,27],[12,15,28],[16,18,29],[19,21,30],[22,23,31],[24,26,32],[27,29,33],[30,33,34],[34,36,35],[37,40,36]],
      fen:[[1,4,37],[5,6,38],[7,11,39],[12,16,40],[17,20,41]]
    }},
    2025:{pdfKey:'osym-2025-tyt',sections:{
      tur:[[1,4,3],[5,7,4],[8,11,5],[12,15,6],[16,18,7],[19,20,8],[21,22,9],[23,25,10],[26,28,11],[29,30,12],[31,33,13],[34,34,14],[35,36,15],[37,40,16]],
      social:[[1,4,17],[5,7,18],[8,11,19],[12,15,20],[16,19,21],[20,22,22],[23,25,23]],
      math:[[1,3,24],[4,7,25],[8,9,26],[10,13,27],[14,18,28],[19,21,29],[22,24,30],[25,27,31],[28,31,32],[32,35,33],[36,37,34],[38,40,35]],
      fen:[[1,3,36],[4,6,37],[7,9,38],[10,12,39],[13,16,40],[17,20,41]]
    }}
  };

  const MANUAL={
    'osym-2025-tyt-tur-35':{pdfKey:'osym-2025-tyt',page:15,crop:{x:.065,y:.08,w:.43,h:.60}},
    'osym-2025-tyt-tur-36':{pdfKey:'osym-2025-tyt',page:15,parts:[{x:.065,y:.08,w:.43,h:.34},{x:.535,y:.09,w:.40,h:.25}]},
    'osym-2025-tyt-tur-37':{pdfKey:'osym-2025-tyt',page:16,crop:{x:.065,y:.08,w:.43,h:.59}},
    'osym-2025-tyt-tur-38':{pdfKey:'osym-2025-tyt',page:16,parts:[{x:.065,y:.08,w:.43,h:.34},{x:.065,y:.68,w:.43,h:.18}]},
    'osym-2025-tyt-tur-39':{pdfKey:'osym-2025-tyt',page:16,crop:{x:.535,y:.08,w:.40,h:.58}},
    'osym-2025-tyt-tur-40':{pdfKey:'osym-2025-tyt',page:16,parts:[{x:.535,y:.08,w:.40,h:.34},{x:.535,y:.68,w:.40,h:.18}]},
    'osym-2024-tyt-tur-35':{pdfKey:'osym-2024-tyt',page:13,crop:{x:.535,y:.08,w:.40,h:.54}},
    'osym-2024-tyt-tur-36':{pdfKey:'osym-2024-tyt',page:13,parts:[{x:.535,y:.08,w:.40,h:.34},{x:.535,y:.63,w:.40,h:.23}]},
    'osym-2024-tyt-tur-37':{pdfKey:'osym-2024-tyt',page:14,crop:{x:.065,y:.08,w:.43,h:.58}},
    'osym-2024-tyt-tur-38':{pdfKey:'osym-2024-tyt',page:14,parts:[{x:.065,y:.08,w:.43,h:.36},{x:.535,y:.09,w:.40,h:.28}]},
    'osym-2024-tyt-tur-39':{pdfKey:'osym-2024-tyt',page:15,crop:{x:.065,y:.08,w:.43,h:.51}},
    'osym-2024-tyt-tur-40':{pdfKey:'osym-2024-tyt',page:15,parts:[{x:.065,y:.08,w:.43,h:.31},{x:.065,y:.61,w:.43,h:.23}]}
  };

  const REVIEW_PATCHES={
    'osym-2024-tyt-mat-04':{topic:'Köklü Sayılar',subtopics:['köklü sayılar','rasyonel-irrasyonel ilişki','bölme']},
    'osym-2024-tyt-mat-09':{topic:'Sayı Doğrusu ve Ölçek',subtopics:['eş bölmeler','sıcaklık ölçeği','değer okuma']},
    'osym-2024-tyt-mat-10':{},'osym-2024-tyt-mat-13':{},
    'osym-2024-tyt-mat-34':{topic:'Üçgenin Alanı',subtopics:['iki kenar ve aradaki açı','alan','30 derece']},
    'osym-2024-tyt-fiz-01':{},'osym-2024-tyt-fiz-05':{},'osym-2024-tyt-kim-12':{},'osym-2024-tyt-biy-19':{},
    'osym-2025-tyt-mat-03':{topic:'Köklü Sayılar ve İşlemler',subtopics:['köklü ifadeler','çarpma','bölme','işlem sonucu karşılaştırma']},
    'osym-2025-tyt-mat-05':{topic:'İşlem Tanımlama',subtopics:['özel işlem','işlem tanımı','cebirsel ifade']},
    'osym-2025-tyt-kim-10':{},'osym-2025-tyt-kim-13':{}
  };

  const socialSubjects=new Set(['Tarih','Coğrafya','Felsefe','Din Kültürü ve Ahlak Bilgisi']);
  const fenSubjects=new Set(['Fizik','Kimya','Biyoloji']);
  function sectionOf(item){if(item?.subject==='Türkçe')return'tur';if(item?.subject==='Matematik')return'math';if(socialSubjects.has(item?.subject))return'social';if(fenSubjects.has(item?.subject))return'fen';return''}
  function pageFor(year,section,q){const rows=SOURCES[year]?.sections?.[section]||[],n=Number(q||0),hit=rows.find(([a,b])=>n>=a&&n<=b);return hit?hit[2]:0}
  function answerRows(C){const out=new Map();for(const row of C.allRecords?.()||C.all?.()||[]){const year=Number(row?.year||0);if(row?.provider!=='OSYM'||row?.exam!=='TYT'||!SOURCES[year]||!row?.id)continue;const old=out.get(row.id);if(!old||(row.answerKey&&!old.answerKey))out.set(row.id,row)}return out}
  function readiness(){
    const C=window.YKSQuestionCatalogV1,rows=(C?.all?.()||[]).filter(x=>x?.provider==='OSYM'&&x?.exam==='TYT'&&SOURCES[Number(x?.year||0)]),out={};
    for(const year of [2024,2025]){
      const y=rows.filter(x=>Number(x.year)===year),main=y.filter(x=>x.track!=='alternate-track'),hasGeometry=x=>!!(x?.asset?.crop||(Array.isArray(x?.asset?.parts)&&x.asset.parts.length)),answerOk=x=>!!(x.answerKey&&x.answerVerified);
      out[year]={total:y.length,mainTrack:main.length,alternateTrack:y.length-main.length,pageVerified:main.filter(x=>x.access?.page&&x.verification?.page==='verified').length,answerVerified:main.filter(answerOk).length,materializedCrop:main.filter(x=>answerOk(x)&&x.asset?.status==='ready'&&hasGeometry(x)).length,studentUsable:main.filter(x=>answerOk(x)&&((x.asset?.status==='ready'&&hasGeometry(x))||x.asset?.status==='preparable')).length};
    }
    return out;
  }
  function activate(){
    const C=window.YKSQuestionCatalogV1;if(!C?.all)return false;
    const canonicalAnswers=answerRows(C),runtimeMap={};let changed=0;
    for(const item of C.all()){
      const year=Number(item?.year||0);if(item?.provider!=='OSYM'||item?.exam!=='TYT'||!SOURCES[year])continue;
      const richer=canonicalAnswers.get(item.id);
      if(richer&&richer!==item){if(richer.answerKey)item.answerKey=richer.answerKey;if(richer.topic)item.topic=richer.topic;if(Array.isArray(richer.subtopics))item.subtopics=[...richer.subtopics];if(Array.isArray(richer.tags))item.tags=[...richer.tags];if(typeof richer.visual==='boolean')item.visual=richer.visual;if(richer.difficulty)item.difficulty=richer.difficulty;item.verification={...(item.verification||{}),...(richer.verification||{})}}
      const section=sectionOf(item),page=pageFor(year,section,item.questionNo);if(!page)continue;
      item.access??={};item.access.page=page;item.access.pdfKey=SOURCES[year].pdfKey;item.verification??={};item.verification.exactPage='verified-visual-official-pdf';item.verification.page='verified';
      if(item.answerKey){item.answerVerified=true;if(!item.answer)item.answer=item.answerKey}
      const patch=REVIEW_PATCHES[item.id];if(patch){if(patch.topic)item.topic=patch.topic;if(patch.subtopics)item.subtopics=patch.subtopics;item.verification.topic='manual-visual-verified'}
      const manual=MANUAL[item.id];if(manual){item.asset={status:'ready',kind:Array.isArray(manual.parts)?'cached-pdf-parts':'cached-pdf-crop',...manual};runtimeMap[item.id]=manual}else runtimeMap[item.id]={pdfKey:SOURCES[year].pdfKey,page};changed++;
    }
    if(changed){try{window.YKSRegisterSourceMap?.(runtimeMap)}catch{};setTimeout(()=>{try{window.renderQuestionIndex?.()}catch{}},0)}
    window.YKS2024_2025SourceMap={sources:SOURCES,manual:MANUAL,count:changed};window.get2024_2025SourceReadiness=readiness;return changed>0;
  }
  if(!activate()){let n=0;const t=setInterval(()=>{if(activate()||++n>40)clearInterval(t)},100)}window.activate2024_2025TytSourceMap=activate;
})();
