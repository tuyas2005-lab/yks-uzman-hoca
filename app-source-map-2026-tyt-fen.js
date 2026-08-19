(()=>{
  const MAP={
    'osym-2026-tyt-fiz-01':{pdfKey:'osym-2026-tyt',page:37,crop:{x:.065,y:.16,w:.43,h:.40}},
    'osym-2026-tyt-fiz-02':{pdfKey:'osym-2026-tyt',page:37,crop:{x:.535,y:.16,w:.40,h:.54}},
    'osym-2026-tyt-fiz-03':{pdfKey:'osym-2026-tyt',page:38,crop:{x:.065,y:.10,w:.43,h:.48}},
    'osym-2026-tyt-fiz-04':{pdfKey:'osym-2026-tyt',page:38,crop:{x:.535,y:.10,w:.40,h:.27}},
    'osym-2026-tyt-fiz-05':{pdfKey:'osym-2026-tyt',page:38,crop:{x:.535,y:.39,w:.40,h:.28}},
    'osym-2026-tyt-fiz-06':{pdfKey:'osym-2026-tyt',page:39,crop:{x:.065,y:.10,w:.43,h:.36}},
    'osym-2026-tyt-fiz-07':{pdfKey:'osym-2026-tyt',page:39,crop:{x:.065,y:.47,w:.43,h:.28}},
    'osym-2026-tyt-kim-08':{pdfKey:'osym-2026-tyt',page:39,crop:{x:.535,y:.10,w:.40,h:.40}},
    'osym-2026-tyt-kim-09':{pdfKey:'osym-2026-tyt',page:40,crop:{x:.065,y:.10,w:.43,h:.30}},
    'osym-2026-tyt-kim-10':{pdfKey:'osym-2026-tyt',page:40,crop:{x:.065,y:.45,w:.43,h:.32}},
    'osym-2026-tyt-kim-11':{pdfKey:'osym-2026-tyt',page:40,crop:{x:.535,y:.10,w:.40,h:.52}},
    'osym-2026-tyt-kim-12':{pdfKey:'osym-2026-tyt',page:41,crop:{x:.065,y:.10,w:.43,h:.27}},
    'osym-2026-tyt-kim-13':{pdfKey:'osym-2026-tyt',page:41,crop:{x:.065,y:.45,w:.43,h:.29}},
    'osym-2026-tyt-kim-14':{pdfKey:'osym-2026-tyt',page:41,crop:{x:.535,y:.10,w:.40,h:.31}},
    'osym-2026-tyt-biy-15':{pdfKey:'osym-2026-tyt',page:41,crop:{x:.535,y:.45,w:.40,h:.20}},
    'osym-2026-tyt-biy-16':{pdfKey:'osym-2026-tyt',page:42,crop:{x:.065,y:.10,w:.43,h:.30}},
    'osym-2026-tyt-biy-17':{pdfKey:'osym-2026-tyt',page:42,crop:{x:.065,y:.42,w:.43,h:.23}},
    'osym-2026-tyt-biy-18':{pdfKey:'osym-2026-tyt',page:42,crop:{x:.535,y:.10,w:.40,h:.53}},
    'osym-2026-tyt-biy-19':{pdfKey:'osym-2026-tyt',page:43,crop:{x:.065,y:.10,w:.43,h:.33}},
    'osym-2026-tyt-biy-20':{pdfKey:'osym-2026-tyt',page:43,crop:{x:.065,y:.46,w:.43,h:.34}}
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
  window.activate2026TytFen=activate;
})();