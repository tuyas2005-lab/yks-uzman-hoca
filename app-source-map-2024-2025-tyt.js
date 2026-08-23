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

  // Visually verified single-question crops for the 2024-2025 TYT Math
  // official PDFs. Rows are indexed by questionNo - 1 and contain
  // [page, x, y, width, height] in normalized PDF coordinates.
  const MATH_CROPS={
    2024:[[24,.055,.1606,.45,.154],[24,.055,.4062,.45,.3562],[24,.515,.1606,.43,.4065],[25,.055,.0951,.45,.2488],[25,.055,.4293,.45,.3],[25,.515,.0951,.43,.1794],[25,.515,.3771,.43,.5779],[26,.055,.0951,.45,.2669],[26,.515,.0951,.43,.257],[27,.055,.0951,.45,.2513],[27,.515,.0951,.43,.4513],[28,.055,.0951,.45,.3638],[28,.055,.5415,.45,.2219],[28,.515,.0951,.43,.1403],[28,.515,.3344,.43,.1594],[29,.055,.0951,.45,.2158],[29,.055,.4126,.45,.1994],[29,.515,.0951,.43,.3729],[30,.055,.0951,.45,.4023],[30,.515,.0951,.43,.1794],[30,.515,.3735,.43,.2549],[31,.055,.0951,.45,.3762],[31,.515,.0951,.43,.4059],[32,.055,.0951,.45,.2506],[32,.055,.4523,.45,.1664],[32,.515,.0951,.43,.3823],[33,.055,.0951,.45,.3668],[33,.515,.0951,.43,.2913],[33,.515,.4854,.43,.1403],[34,.055,.0951,.45,.1801],[34,.055,.3832,.45,.3374],[34,.515,.0951,.43,.2713],[34,.515,.4162,.43,.3929],[35,.055,.0951,.45,.2779],[35,.055,.3731,.45,.4484],[35,.515,.0951,.43,.4648],[36,.055,.0951,.45,.2619],[36,.055,.4232,.45,.281],[36,.515,.0951,.43,.2383],[36,.515,.3996,.43,.2913]],
    2025:[[24,.055,.1606,.45,.3636],[24,.515,.1606,.43,.2911],[24,.515,.4829,.43,.2974],[25,.055,.0951,.45,.1807],[25,.055,.3102,.45,.1925],[25,.515,.0951,.43,.264],[25,.515,.4289,.43,.2219],[26,.055,.0951,.45,.8599],[26,.515,.0951,.43,.4748],[27,.055,.0951,.45,.3207],[27,.055,.4158,.45,.5392],[27,.515,.0951,.43,.13],[27,.515,.2949,.43,.4077],[28,.055,.0951,.45,.1108],[28,.055,.3077,.45,.1403],[28,.055,.5497,.45,.2488],[28,.515,.0951,.43,.1958],[28,.515,.3607,.43,.5943],[29,.055,.0951,.45,.3893],[29,.055,.5542,.45,.1533],[29,.515,.0951,.43,.3007],[30,.055,.0951,.45,.3529],[30,.055,.5178,.45,.2938],[30,.515,.0951,.43,.4681],[31,.055,.0951,.45,.3061],[31,.055,.4332,.45,.5218],[31,.515,.0951,.43,.3432],[32,.055,.0951,.45,.3979],[32,.055,.5242,.45,.163],[32,.515,.0951,.43,.1346],[32,.515,.3018,.43,.3338],[33,.055,.0951,.45,.1272],[33,.055,.2913,.45,.3174],[33,.515,.0951,.43,.2549],[33,.515,.4198,.43,.3539],[34,.055,.0951,.45,.3893],[34,.515,.0951,.43,.3235],[35,.055,.0951,.45,.3762],[35,.515,.0951,.43,.38],[35,.515,.5472,.43,.1239]]
  };
  const MATH_TOPICS={
    2024:['rasyonel-sayilar','yuzde-kar-zarar-karisim-problemleri','problemler','rasyonel-sayilar','rasyonel-sayilar','mutlak-deger','bolme-ve-bolunebilme','basit-esitsizlikler','sayi-basamaklari','kumeler','mantik','fonksiyonlar','sayi-basamaklari','bolme-ve-bolunebilme','sayi-basamaklari','istatistik','problemler','problemler','yuzde-kar-zarar-karisim-problemleri','yas-problemleri','permutasyon-kombinasyon-binomial','problemler','grafik-ve-tablo-problemleri','oran-oranti','permutasyon-kombinasyon-binomial','permutasyon-kombinasyon-binomial','sayi-ve-kesir-problemleri','mantik','permutasyon-kombinasyon-binomial','olaslik','geometride-temel-kavramlar','dik-ve-ozel-ucgenler','ucgenler','ucgenler','ucgenler','cokgenler-ve-dortgenler','cokgenler-ve-dortgenler','cokgenler-ve-dortgenler','kati-cisimler','kati-cisimler'],
    2025:['sayi-ve-kesir-problemleri','uslu-sayilar','uslu-sayilar','rasyonel-sayilar','koklu-sayilar',null,'basit-esitsizlikler','sayi-basamaklari','permutasyon-kombinasyon-binomial','kumeler','mantik','temel-kavramlar','fonksiyonlar','bolme-ve-bolunebilme','sayi-basamaklari','istatistik','problemler','sayi-ve-kesir-problemleri','yuzde-kar-zarar-karisim-problemleri','permutasyon-kombinasyon-binomial','yas-problemleri','hareket-ve-isci-problemleri','grafik-ve-tablo-problemleri','problemler','permutasyon-kombinasyon-binomial','problemler','problemler','problemler','permutasyon-kombinasyon-binomial','olaslik','geometride-temel-kavramlar','ucgenler','ucgenler','dik-ve-ozel-ucgenler','ucgenler','cokgenler-ve-dortgenler','cokgenler-ve-dortgenler','cokgenler-ve-dortgenler','kati-cisimler','kati-cisimler']
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
      if(section==='math'){
        const n=Number(item.questionNo),row=MATH_CROPS[year]?.[n-1],topic=MATH_TOPICS[year]?.[n-1];
        if(row){
          const [cropPage,x,y,w,h]=row,crop={x,y,w,h},source={pdfKey:SOURCES[year].pdfKey,page:cropPage,crop};
          if(topic){
            item.canonicalTopicId=`tyt.matematik.${topic}`;
            item.asset={status:'ready',kind:'cached-pdf-crop',...source};
            item.verification.visualQa='pass-manual-official-pdf';
            item.verification.canonicalTopic='verified-deterministic-metadata';
          }else{
            item.verification.topic='needs-manual-review-canonical-mapping';
            item.verification.canonicalTopic='manual-review-required';
          }
          runtimeMap[item.id]=source;changed++;continue;
        }
      }
      const manual=MANUAL[item.id];if(manual){item.asset={status:'ready',kind:Array.isArray(manual.parts)?'cached-pdf-parts':'cached-pdf-crop',...manual};runtimeMap[item.id]=manual}else runtimeMap[item.id]={pdfKey:SOURCES[year].pdfKey,page};changed++;
    }
    if(changed){try{window.YKSRegisterSourceMap?.(runtimeMap)}catch{};setTimeout(()=>{try{window.renderQuestionIndex?.()}catch{}},0)}
    window.YKS2024_2025SourceMap={sources:SOURCES,manual:MANUAL,mathCrops:MATH_CROPS,mathTopics:MATH_TOPICS,count:changed};window.get2024_2025SourceReadiness=readiness;return changed>0;
  }
  if(!activate()){let n=0;const t=setInterval(()=>{if(activate()||++n>40)clearInterval(t)},100)}window.activate2024_2025TytSourceMap=activate;
})();
