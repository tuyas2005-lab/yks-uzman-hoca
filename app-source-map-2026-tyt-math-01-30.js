(()=>{
  const MAP={
    'osym-2026-tyt-mat-01':{pdfKey:'osym-2026-tyt',page:25,crop:{x:.065,y:.155,w:.43,h:.22}},
    'osym-2026-tyt-mat-02':{pdfKey:'osym-2026-tyt',page:25,crop:{x:.065,y:.395,w:.43,h:.39}},
    'osym-2026-tyt-mat-03':{pdfKey:'osym-2026-tyt',page:25,crop:{x:.535,y:.155,w:.40,h:.20}},
    'osym-2026-tyt-mat-04':{pdfKey:'osym-2026-tyt',page:25,crop:{x:.535,y:.360,w:.40,h:.40}},
    'osym-2026-tyt-mat-05':{pdfKey:'osym-2026-tyt',page:26,crop:{x:.065,y:.095,w:.43,h:.37}},
    'osym-2026-tyt-mat-06':{pdfKey:'osym-2026-tyt',page:26,crop:{x:.065,y:.470,w:.43,h:.30}},
    'osym-2026-tyt-mat-07':{pdfKey:'osym-2026-tyt',page:26,crop:{x:.535,y:.095,w:.40,h:.23}},
    'osym-2026-tyt-mat-08':{pdfKey:'osym-2026-tyt',page:26,crop:{x:.535,y:.340,w:.40,h:.27}},
    'osym-2026-tyt-mat-09':{pdfKey:'osym-2026-tyt',page:27,crop:{x:.065,y:.095,w:.43,h:.36}},
    'osym-2026-tyt-mat-10':{pdfKey:'osym-2026-tyt',page:27,crop:{x:.535,y:.095,w:.40,h:.27}},
    'osym-2026-tyt-mat-11':{pdfKey:'osym-2026-tyt',page:27,crop:{x:.535,y:.440,w:.40,h:.25}},
    'osym-2026-tyt-mat-12':{pdfKey:'osym-2026-tyt',page:28,crop:{x:.065,y:.095,w:.43,h:.43}},
    'osym-2026-tyt-mat-13':{pdfKey:'osym-2026-tyt',page:28,crop:{x:.065,y:.570,w:.43,h:.20}},
    'osym-2026-tyt-mat-14':{pdfKey:'osym-2026-tyt',page:28,crop:{x:.535,y:.095,w:.40,h:.61}},
    'osym-2026-tyt-mat-15':{pdfKey:'osym-2026-tyt',page:28,crop:{x:.535,y:.765,w:.40,h:.13}},
    'osym-2026-tyt-mat-16':{pdfKey:'osym-2026-tyt',page:29,crop:{x:.065,y:.095,w:.43,h:.32}},
    'osym-2026-tyt-mat-17':{pdfKey:'osym-2026-tyt',page:29,crop:{x:.535,y:.095,w:.40,h:.40}},
    'osym-2026-tyt-mat-18':{pdfKey:'osym-2026-tyt',page:30,crop:{x:.065,y:.095,w:.43,h:.26}},
    'osym-2026-tyt-mat-19':{pdfKey:'osym-2026-tyt',page:30,crop:{x:.065,y:.405,w:.43,h:.24}},
    'osym-2026-tyt-mat-20':{pdfKey:'osym-2026-tyt',page:30,crop:{x:.535,y:.095,w:.40,h:.25}},
    'osym-2026-tyt-mat-21':{pdfKey:'osym-2026-tyt',page:30,crop:{x:.535,y:.370,w:.40,h:.43}},
    'osym-2026-tyt-mat-22':{pdfKey:'osym-2026-tyt',page:31,crop:{x:.065,y:.095,w:.43,h:.27}},
    'osym-2026-tyt-mat-23':{pdfKey:'osym-2026-tyt',page:31,crop:{x:.065,y:.415,w:.43,h:.35}},
    'osym-2026-tyt-mat-24':{pdfKey:'osym-2026-tyt',page:31,crop:{x:.535,y:.095,w:.40,h:.23}},
    'osym-2026-tyt-mat-25':{pdfKey:'osym-2026-tyt',page:31,crop:{x:.535,y:.370,w:.40,h:.25}},
    'osym-2026-tyt-mat-26':{pdfKey:'osym-2026-tyt',page:32,crop:{x:.065,y:.095,w:.43,h:.34}},
    'osym-2026-tyt-mat-27':{pdfKey:'osym-2026-tyt',page:32,crop:{x:.535,y:.095,w:.40,h:.42}},
    'osym-2026-tyt-mat-28':{pdfKey:'osym-2026-tyt',page:33,crop:{x:.065,y:.095,w:.43,h:.39}},
    'osym-2026-tyt-mat-29':{pdfKey:'osym-2026-tyt',page:33,crop:{x:.535,y:.095,w:.40,h:.37}},
    'osym-2026-tyt-mat-30':{pdfKey:'osym-2026-tyt',page:33,crop:{x:.535,y:.480,w:.40,h:.20}}
  };
  let activated=false;
  function activate(){
    const C=window.YKSQuestionCatalogV1;if(!C?.all)return false;
    let changed=false;
    for(const item of C.all()){
      const a=MAP[item.id];if(!a)continue;
      item.asset={status:'ready',kind:'cached-pdf-crop',...a};
      item.answerVerified=!!item.answerKey;
      if(item.answerKey&&!item.answer)item.answer=item.answerKey;
      changed=true;
    }
    if(changed&&!activated){activated=true;setTimeout(()=>{try{window.renderQuestionIndex?.()}catch{}},0)}
    return changed;
  }
  // Viewer'ın ilk 31-40 prewarm turunu tamamlamasına izin ver; sonra 1-30'u hazır ilan et.
  setTimeout(activate,1600);
  // Kullanıcı çok hızlı davranırsa seçimden hemen önce haritayı etkinleştir.
  document.addEventListener('pointerdown',e=>{if(e.target.closest('#mtsBuild,#mtsWeak,#mtsCurrent,#solution [data-go="similar"]'))activate()},true);
  window.activate2026TytMath01_30=activate;
})();