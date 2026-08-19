(()=>{
  const MAP={
    'osym-2026-tyt-tar-01':{pdfKey:'osym-2026-tyt',page:17,crop:{x:.065,y:.16,w:.43,h:.32}},
    'osym-2026-tyt-tar-02':{pdfKey:'osym-2026-tyt',page:17,crop:{x:.065,y:.49,w:.43,h:.34}},
    'osym-2026-tyt-tar-03':{pdfKey:'osym-2026-tyt',page:17,crop:{x:.535,y:.16,w:.40,h:.30}},
    'osym-2026-tyt-tar-04':{pdfKey:'osym-2026-tyt',page:17,crop:{x:.535,y:.49,w:.40,h:.34}},
    'osym-2026-tyt-tar-05':{pdfKey:'osym-2026-tyt',page:18,crop:{x:.065,y:.10,w:.43,h:.27}},
    'osym-2026-tyt-cog-06':{pdfKey:'osym-2026-tyt',page:18,crop:{x:.065,y:.39,w:.43,h:.35}},
    'osym-2026-tyt-cog-07':{pdfKey:'osym-2026-tyt',page:18,crop:{x:.535,y:.10,w:.40,h:.29}},
    'osym-2026-tyt-cog-08':{pdfKey:'osym-2026-tyt',page:18,crop:{x:.535,y:.40,w:.40,h:.31}},
    'osym-2026-tyt-cog-09':{pdfKey:'osym-2026-tyt',page:19,crop:{x:.065,y:.10,w:.43,h:.18}},
    'osym-2026-tyt-cog-10':{pdfKey:'osym-2026-tyt',page:19,crop:{x:.065,y:.31,w:.43,h:.27}},
    'osym-2026-tyt-fel-11':{pdfKey:'osym-2026-tyt',page:19,crop:{x:.535,y:.10,w:.40,h:.48}},
    'osym-2026-tyt-fel-12':{pdfKey:'osym-2026-tyt',page:20,crop:{x:.065,y:.10,w:.43,h:.32}},
    'osym-2026-tyt-fel-13':{pdfKey:'osym-2026-tyt',page:20,crop:{x:.065,y:.45,w:.43,h:.35}},
    'osym-2026-tyt-fel-14':{pdfKey:'osym-2026-tyt',page:20,crop:{x:.535,y:.10,w:.40,h:.50}},
    'osym-2026-tyt-fel-15':{pdfKey:'osym-2026-tyt',page:21,crop:{x:.065,y:.10,w:.43,h:.38}},
    'osym-2026-tyt-din-16':{pdfKey:'osym-2026-tyt',page:21,crop:{x:.535,y:.15,w:.40,h:.42}},
    'osym-2026-tyt-din-17':{pdfKey:'osym-2026-tyt',page:22,crop:{x:.065,y:.10,w:.43,h:.43}},
    'osym-2026-tyt-din-18':{pdfKey:'osym-2026-tyt',page:22,crop:{x:.535,y:.10,w:.40,h:.33}},
    'osym-2026-tyt-din-19':{pdfKey:'osym-2026-tyt',page:22,crop:{x:.535,y:.45,w:.40,h:.34}},
    'osym-2026-tyt-din-20':{pdfKey:'osym-2026-tyt',page:23,crop:{x:.065,y:.10,w:.43,h:.42}},
    'osym-2026-tyt-fel-alt-21':{pdfKey:'osym-2026-tyt',page:23,crop:{x:.535,y:.15,w:.40,h:.38}},
    'osym-2026-tyt-fel-alt-22':{pdfKey:'osym-2026-tyt',page:24,crop:{x:.065,y:.10,w:.43,h:.38}},
    'osym-2026-tyt-fel-alt-23':{pdfKey:'osym-2026-tyt',page:24,crop:{x:.065,y:.48,w:.43,h:.31}},
    'osym-2026-tyt-fel-alt-24':{pdfKey:'osym-2026-tyt',page:24,crop:{x:.535,y:.10,w:.40,h:.38}},
    'osym-2026-tyt-fel-alt-25':{pdfKey:'osym-2026-tyt',page:24,crop:{x:.535,y:.50,w:.40,h:.31}}
  };
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
    if(changed)setTimeout(()=>{try{window.renderQuestionIndex?.()}catch{}},0);
    return changed;
  }
  if(!activate()){let n=0;const t=setInterval(()=>{if(activate()||++n>30)clearInterval(t)},100)}
  window.activate2026TytSocial=activate;
})();