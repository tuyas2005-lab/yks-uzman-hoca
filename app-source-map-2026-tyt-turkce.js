(()=>{
  const MAP={
    'osym-2026-tyt-tur-01':{pdfKey:'osym-2026-tyt',page:3,crop:{x:.065,y:.16,w:.43,h:.26}},
    'osym-2026-tyt-tur-02':{pdfKey:'osym-2026-tyt',page:3,crop:{x:.065,y:.44,w:.43,h:.40}},
    'osym-2026-tyt-tur-03':{pdfKey:'osym-2026-tyt',page:3,crop:{x:.535,y:.16,w:.40,h:.26}},
    'osym-2026-tyt-tur-04':{pdfKey:'osym-2026-tyt',page:3,crop:{x:.535,y:.45,w:.40,h:.40}},
    'osym-2026-tyt-tur-05':{pdfKey:'osym-2026-tyt',page:4,crop:{x:.065,y:.10,w:.43,h:.47}},
    'osym-2026-tyt-tur-06':{pdfKey:'osym-2026-tyt',page:4,crop:{x:.535,y:.10,w:.40,h:.35}},
    'osym-2026-tyt-tur-07':{pdfKey:'osym-2026-tyt',page:5,crop:{x:.065,y:.10,w:.43,h:.58}},
    'osym-2026-tyt-tur-08':{pdfKey:'osym-2026-tyt',page:5,crop:{x:.535,y:.10,w:.40,h:.25}},
    'osym-2026-tyt-tur-09':{pdfKey:'osym-2026-tyt',page:5,crop:{x:.535,y:.35,w:.40,h:.25}},
    'osym-2026-tyt-tur-10':{pdfKey:'osym-2026-tyt',page:6,crop:{x:.065,y:.10,w:.43,h:.28}},
    'osym-2026-tyt-tur-11':{pdfKey:'osym-2026-tyt',page:6,crop:{x:.065,y:.39,w:.43,h:.31}},
    'osym-2026-tyt-tur-12':{pdfKey:'osym-2026-tyt',page:6,crop:{x:.535,y:.10,w:.40,h:.28}},
    'osym-2026-tyt-tur-13':{pdfKey:'osym-2026-tyt',page:6,crop:{x:.535,y:.39,w:.40,h:.31}},
    'osym-2026-tyt-tur-14':{pdfKey:'osym-2026-tyt',page:7,crop:{x:.065,y:.10,w:.43,h:.29}},
    'osym-2026-tyt-tur-15':{pdfKey:'osym-2026-tyt',page:7,crop:{x:.065,y:.41,w:.43,h:.31}},
    'osym-2026-tyt-tur-16':{pdfKey:'osym-2026-tyt',page:7,crop:{x:.535,y:.10,w:.40,h:.30}},
    'osym-2026-tyt-tur-17':{pdfKey:'osym-2026-tyt',page:7,crop:{x:.535,y:.41,w:.40,h:.31}},
    'osym-2026-tyt-tur-18':{pdfKey:'osym-2026-tyt',page:8,crop:{x:.065,y:.10,w:.43,h:.45}},
    'osym-2026-tyt-tur-19':{pdfKey:'osym-2026-tyt',page:8,crop:{x:.535,y:.10,w:.40,h:.46}},
    'osym-2026-tyt-tur-20':{pdfKey:'osym-2026-tyt',page:9,crop:{x:.065,y:.10,w:.43,h:.50}},
    'osym-2026-tyt-tur-21':{pdfKey:'osym-2026-tyt',page:9,crop:{x:.535,y:.10,w:.40,h:.43}},
    'osym-2026-tyt-tur-22':{pdfKey:'osym-2026-tyt',page:10,crop:{x:.065,y:.10,w:.43,h:.39}},
    'osym-2026-tyt-tur-23':{pdfKey:'osym-2026-tyt',page:10,crop:{x:.535,y:.10,w:.40,h:.39}},
    'osym-2026-tyt-tur-24':{pdfKey:'osym-2026-tyt',page:11,crop:{x:.065,y:.10,w:.43,h:.42}},
    'osym-2026-tyt-tur-25':{pdfKey:'osym-2026-tyt',page:11,crop:{x:.535,y:.10,w:.40,h:.42}},
    'osym-2026-tyt-tur-26':{pdfKey:'osym-2026-tyt',page:12,crop:{x:.065,y:.10,w:.43,h:.37}},
    'osym-2026-tyt-tur-27':{pdfKey:'osym-2026-tyt',page:12,crop:{x:.065,y:.48,w:.43,h:.31}},
    'osym-2026-tyt-tur-28':{pdfKey:'osym-2026-tyt',page:12,crop:{x:.535,y:.10,w:.40,h:.30}},
    'osym-2026-tyt-tur-29':{pdfKey:'osym-2026-tyt',page:12,crop:{x:.535,y:.43,w:.40,h:.36}},
    'osym-2026-tyt-tur-30':{pdfKey:'osym-2026-tyt',page:13,crop:{x:.065,y:.10,w:.43,h:.39}},
    'osym-2026-tyt-tur-31':{pdfKey:'osym-2026-tyt',page:13,crop:{x:.065,y:.50,w:.43,h:.31}},
    'osym-2026-tyt-tur-32':{pdfKey:'osym-2026-tyt',page:13,crop:{x:.535,y:.10,w:.40,h:.30}},
    'osym-2026-tyt-tur-33':{pdfKey:'osym-2026-tyt',page:13,crop:{x:.535,y:.40,w:.40,h:.41}},
    'osym-2026-tyt-tur-34':{pdfKey:'osym-2026-tyt',page:14,crop:{x:.065,y:.10,w:.43,h:.42}},
    'osym-2026-tyt-tur-35':{pdfKey:'osym-2026-tyt',page:14,crop:{x:.535,y:.08,w:.40,h:.45}},
    'osym-2026-tyt-tur-36':{pdfKey:'osym-2026-tyt',page:14,parts:[{x:.535,y:.08,w:.40,h:.24},{x:.535,y:.52,w:.40,h:.31}]},
    'osym-2026-tyt-tur-37':{pdfKey:'osym-2026-tyt',page:15,crop:{x:.065,y:.08,w:.43,h:.57}},
    'osym-2026-tyt-tur-38':{pdfKey:'osym-2026-tyt',page:15,parts:[{x:.065,y:.08,w:.43,h:.34},{x:.535,y:.08,w:.40,h:.38}]},
    'osym-2026-tyt-tur-39':{pdfKey:'osym-2026-tyt',page:16,crop:{x:.065,y:.08,w:.43,h:.51}},
    'osym-2026-tyt-tur-40':{pdfKey:'osym-2026-tyt',page:16,parts:[{x:.065,y:.08,w:.43,h:.24},{x:.535,y:.08,w:.40,h:.40}]}
  };
  function activate(){
    const C=window.YKSQuestionCatalogV1;if(!C?.all)return false;
    let changed=false;
    for(const item of C.all()){
      const a=MAP[item.id];if(!a)continue;
      item.asset={status:'ready',kind:Array.isArray(a.parts)?'cached-pdf-parts':'cached-pdf-crop',...a};
      item.answerVerified=!!item.answerKey;
      if(item.answerKey&&!item.answer)item.answer=item.answerKey;
      changed=true;
    }
    if(changed){try{window.YKSRegisterSourceMap?.(MAP)}catch{}setTimeout(()=>{try{window.renderQuestionIndex?.()}catch{}},0)}
    return changed;
  }
  if(!activate()){let n=0;const t=setInterval(()=>{if(activate()||++n>30)clearInterval(t)},100)}
  window.activate2026TytTurkce=activate;
})();