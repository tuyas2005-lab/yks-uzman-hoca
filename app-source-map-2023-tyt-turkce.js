(()=>{
  const MAP={
    'osym-2023-tyt-tur-01':{pdfKey:'osym-2023-tyt',page:3,crop:{x:0.0672,y:0.1654,w:0.4368,h:0.2602}},
    'osym-2023-tyt-tur-02':{pdfKey:'osym-2023-tyt',page:3,crop:{x:0.0672,y:0.428,w:0.4368,h:0.4372}},
    'osym-2023-tyt-tur-03':{pdfKey:'osym-2023-tyt',page:3,crop:{x:0.5308,y:0.1654,w:0.4301,h:0.3389}},
    'osym-2023-tyt-tur-04':{pdfKey:'osym-2023-tyt',page:3,crop:{x:0.5308,y:0.5066,w:0.4301,h:0.3586}},
    'osym-2023-tyt-tur-05':{pdfKey:'osym-2023-tyt',page:4,crop:{x:0.0672,y:0.0995,w:0.4368,h:0.3169}},
    'osym-2023-tyt-tur-06':{pdfKey:'osym-2023-tyt',page:4,crop:{x:0.0672,y:0.4187,w:0.4368,h:0.4465}},
    'osym-2023-tyt-tur-07':{pdfKey:'osym-2023-tyt',page:4,crop:{x:0.5308,y:0.0995,w:0.4301,h:0.7657}},
    'osym-2023-tyt-tur-08':{pdfKey:'osym-2023-tyt',page:5,crop:{x:0.0672,y:0.0995,w:0.4368,h:0.347}},
    'osym-2023-tyt-tur-09':{pdfKey:'osym-2023-tyt',page:5,crop:{x:0.0672,y:0.4488,w:0.4368,h:0.4164}},
    'osym-2023-tyt-tur-10':{pdfKey:'osym-2023-tyt',page:5,crop:{x:0.5308,y:0.0995,w:0.4301,h:0.2302}},
    'osym-2023-tyt-tur-11':{pdfKey:'osym-2023-tyt',page:5,crop:{x:0.5308,y:0.332,w:0.4301,h:0.2845}},
    'osym-2023-tyt-tur-12':{pdfKey:'osym-2023-tyt',page:5,crop:{x:0.5308,y:0.6188,w:0.4301,h:0.2464}},
    'osym-2023-tyt-tur-13':{pdfKey:'osym-2023-tyt',page:6,crop:{x:0.0672,y:0.0995,w:0.4368,h:0.2822}},
    'osym-2023-tyt-tur-14':{pdfKey:'osym-2023-tyt',page:6,crop:{x:0.0672,y:0.384,w:0.4368,h:0.4812}},
    'osym-2023-tyt-tur-15':{pdfKey:'osym-2023-tyt',page:6,crop:{x:0.5308,y:0.0995,w:0.4301,h:0.2683}},
    'osym-2023-tyt-tur-16':{pdfKey:'osym-2023-tyt',page:6,crop:{x:0.5308,y:0.3701,w:0.4301,h:0.495}},
    'osym-2023-tyt-tur-17':{pdfKey:'osym-2023-tyt',page:7,crop:{x:0.0672,y:0.0995,w:0.4368,h:0.3169}},
    'osym-2023-tyt-tur-18':{pdfKey:'osym-2023-tyt',page:7,crop:{x:0.0672,y:0.4187,w:0.4368,h:0.4465}},
    'osym-2023-tyt-tur-19':{pdfKey:'osym-2023-tyt',page:7,crop:{x:0.5308,y:0.0995,w:0.4301,h:0.3181}},
    'osym-2023-tyt-tur-20':{pdfKey:'osym-2023-tyt',page:7,crop:{x:0.5308,y:0.4199,w:0.4301,h:0.4453}},
    'osym-2023-tyt-tur-21':{pdfKey:'osym-2023-tyt',page:8,crop:{x:0.0672,y:0.0995,w:0.4368,h:0.3562}},
    'osym-2023-tyt-tur-22':{pdfKey:'osym-2023-tyt',page:8,crop:{x:0.0672,y:0.458,w:0.4368,h:0.4071}},
    'osym-2023-tyt-tur-23':{pdfKey:'osym-2023-tyt',page:8,crop:{x:0.5308,y:0.0995,w:0.4301,h:0.7657}},
    'osym-2023-tyt-tur-24':{pdfKey:'osym-2023-tyt',page:9,crop:{x:0.0672,y:0.0995,w:0.4368,h:0.384}},
    'osym-2023-tyt-tur-25':{pdfKey:'osym-2023-tyt',page:9,crop:{x:0.0672,y:0.4858,w:0.4368,h:0.3794}},
    'osym-2023-tyt-tur-26':{pdfKey:'osym-2023-tyt',page:9,crop:{x:0.5308,y:0.0995,w:0.4301,h:0.4048}},
    'osym-2023-tyt-tur-27':{pdfKey:'osym-2023-tyt',page:9,crop:{x:0.5308,y:0.5066,w:0.4301,h:0.3586}},
    'osym-2023-tyt-tur-28':{pdfKey:'osym-2023-tyt',page:10,crop:{x:0.0672,y:0.0995,w:0.4368,h:0.7657}},
    'osym-2023-tyt-tur-29':{pdfKey:'osym-2023-tyt',page:10,crop:{x:0.5308,y:0.0995,w:0.4301,h:0.7657}},
    'osym-2023-tyt-tur-30':{pdfKey:'osym-2023-tyt',page:11,crop:{x:0.0672,y:0.0995,w:0.4368,h:0.3632}},
    'osym-2023-tyt-tur-31':{pdfKey:'osym-2023-tyt',page:11,crop:{x:0.0672,y:0.465,w:0.4368,h:0.4002}},
    'osym-2023-tyt-tur-32':{pdfKey:'osym-2023-tyt',page:11,crop:{x:0.5308,y:0.0995,w:0.4301,h:0.7657}},
    'osym-2023-tyt-tur-33':{pdfKey:'osym-2023-tyt',page:12,crop:{x:0.0672,y:0.0995,w:0.4368,h:0.7657}},
    'osym-2023-tyt-tur-34':{pdfKey:'osym-2023-tyt',page:12,crop:{x:0.5308,y:0.0995,w:0.4301,h:0.7657}},
    'osym-2023-tyt-tur-35':{pdfKey:'osym-2023-tyt',page:13,crop:{x:0.0672,y:0.096,w:0.4368,h:0.465}},
    'osym-2023-tyt-tur-36':{pdfKey:'osym-2023-tyt',page:13,parts:[{x:0.0672,y:0.096,w:0.4368,h:0.2568},{x:0.0672,y:0.613,w:0.4368,h:0.2047}]},
    'osym-2023-tyt-tur-37':{pdfKey:'osym-2023-tyt',page:14,crop:{x:0.0672,y:0.096,w:0.4368,h:0.5378}},
    'osym-2023-tyt-tur-38':{pdfKey:'osym-2023-tyt',page:14,parts:[{x:0.0672,y:0.096,w:0.4368,h:0.2926},{x:0.5308,y:0.1041,w:0.4301,h:0.2036}]},
    'osym-2023-tyt-tur-39':{pdfKey:'osym-2023-tyt',page:15,crop:{x:0.0672,y:0.096,w:0.4368,h:0.5263}},
    'osym-2023-tyt-tur-40':{pdfKey:'osym-2023-tyt',page:15,parts:[{x:0.0672,y:0.096,w:0.4368,h:0.2811},{x:0.5308,y:0.1041,w:0.4301,h:0.1943}]}
  };
  // NOT: pdfKey:'osym-2023-tyt' henuz api/source-question.js SOURCES objesinde
  // tanimli DEGIL (2023 TYT Fen QA gorevinde de ayni blocker raporlanmisti - bkz.
  // docs/question-source-catalog.md). Bu dosyaya bu gorev kapsaminda dokunulmadi.
  // Crop koordinatlari 40/40 GORSEL OLARAK DOGRULANMIS olsa da, runtime'da PDF.js
  // getDoc() cagrisi bu pdfKey icin 404 alacak, SOURCES objesine 'osym-2023-tyt'
  // eklenene kadar. Bu ayri bir onay/adim gerektirir (Codex entegrasyonu).
  //
  // ORTAK PARAGRAF/METIN NOTU: 35-36, 37-38 ve 39-40 soru ciftleri ayni ortak
  // parcayi paylasir. 35, 37, 39 icin paragraf+soru ayni sutunda kesintisiz
  // oldugundan tek 'crop' yeterli. 36, 38, 40 icin paragraf ile soru arasinda
  // (35, 37, 39'un kendi icerigi nedeniyle, veya farkli sutunda oldugu icin)
  // kesinti oldugundan coklu 'parts' dizisi kullanildi (mevcut buildCropBlob()
  // mekanizmasi bunlari runtime'da dikey olarak birlestirir).
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
  window.activate2023TytTurkce=activate;
})();
