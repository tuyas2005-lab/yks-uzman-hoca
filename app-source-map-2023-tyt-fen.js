(()=>{
  const MAP={
    'osym-2023-tyt-fiz-01':{pdfKey:'osym-2023-tyt',page:35,crop:{x:.0672,y:.1619,w:.4284,h:.4106}},
    'osym-2023-tyt-fiz-02':{pdfKey:'osym-2023-tyt',page:35,crop:{x:.5342,y:.1619,w:.4166,h:.2024}},
    'osym-2023-tyt-fiz-03':{pdfKey:'osym-2023-tyt',page:35,crop:{x:.5342,y:.4303,w:.4166,h:.2730}},
    'osym-2023-tyt-fiz-04':{pdfKey:'osym-2023-tyt',page:36,crop:{x:.0672,y:.0972,w:.4284,h:.2267}},
    'osym-2023-tyt-fiz-05':{pdfKey:'osym-2023-tyt',page:36,crop:{x:.0672,y:.3909,w:.4284,h:.3412}},
    'osym-2023-tyt-fiz-06':{pdfKey:'osym-2023-tyt',page:36,crop:{x:.5342,y:.0972,w:.4166,h:.6026}},
    'osym-2023-tyt-fiz-07':{pdfKey:'osym-2023-tyt',page:37,crop:{x:.0672,y:.0972,w:.4284,h:.4176}},
    'osym-2023-tyt-kim-08':{pdfKey:'osym-2023-tyt',page:37,crop:{x:.0672,y:.5818,w:.4284,h:.1249}},
    'osym-2023-tyt-kim-09':{pdfKey:'osym-2023-tyt',page:37,crop:{x:.5342,y:.0972,w:.4166,h:.2082}},
    'osym-2023-tyt-kim-10':{pdfKey:'osym-2023-tyt',page:37,crop:{x:.5342,y:.3713,w:.4166,h:.1585}},
    'osym-2023-tyt-kim-11':{pdfKey:'osym-2023-tyt',page:38,crop:{x:.0638,y:.0972,w:.4317,h:.2429}},
    'osym-2023-tyt-kim-12':{pdfKey:'osym-2023-tyt',page:38,crop:{x:.0638,y:.4071,w:.4317,h:.2892}},
    'osym-2023-tyt-kim-13':{pdfKey:'osym-2023-tyt',page:38,crop:{x:.5342,y:.0972,w:.4166,h:.2348}},
    'osym-2023-tyt-kim-14':{pdfKey:'osym-2023-tyt',page:38,crop:{x:.5342,y:.3990,w:.4166,h:.2857}},
    'osym-2023-tyt-biy-15':{pdfKey:'osym-2023-tyt',page:39,crop:{x:.0638,y:.0972,w:.4317,h:.1874}},
    'osym-2023-tyt-biy-16':{pdfKey:'osym-2023-tyt',page:39,crop:{x:.0638,y:.3505,w:.4317,h:.1585}},
    'osym-2023-tyt-biy-17':{pdfKey:'osym-2023-tyt',page:39,crop:{x:.0638,y:.5749,w:.4317,h:.1885}},
    'osym-2023-tyt-biy-18':{pdfKey:'osym-2023-tyt',page:39,crop:{x:.5342,y:.0972,w:.4166,h:.4638}},
    'osym-2023-tyt-biy-19':{pdfKey:'osym-2023-tyt',page:40,crop:{x:.0638,y:.0972,w:.4317,h:.5668}},
    'osym-2023-tyt-biy-20':{pdfKey:'osym-2023-tyt',page:40,crop:{x:.5342,y:.0972,w:.4166,h:.3840}}
  };
  // Runtime baglantilari api/source-question.js ve app-home-links.js tarafinda
  // bu dosyanin disinda tutulur; dogrulanmis MAP verisi burada tek kaynaktir.
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
  window.activate2023TytFen=activate;
})();
