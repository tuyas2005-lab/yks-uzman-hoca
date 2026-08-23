(()=>{
  const MAP={
    'osym-2023-tyt-tar-01':{pdfKey:'osym-2023-tyt',page:16,crop:{x:0.0672,y:0.1654,w:0.4368,h:0.2568}},
    'osym-2023-tyt-tar-02':{pdfKey:'osym-2023-tyt',page:16,crop:{x:0.0672,y:0.4245,w:0.4368,h:0.4407}},
    'osym-2023-tyt-tar-03':{pdfKey:'osym-2023-tyt',page:16,crop:{x:0.5308,y:0.1654,w:0.4301,h:0.3019}},
    'osym-2023-tyt-tar-04':{pdfKey:'osym-2023-tyt',page:16,crop:{x:0.5308,y:0.4696,w:0.4301,h:0.3956}},
    'osym-2023-tyt-tar-05':{pdfKey:'osym-2023-tyt',page:17,crop:{x:0.0672,y:0.0995,w:0.4368,h:0.2672}},
    'osym-2023-tyt-cog-06':{pdfKey:'osym-2023-tyt',page:17,crop:{x:0.0672,y:0.369,w:0.4368,h:0.4962}},
    'osym-2023-tyt-cog-07':{pdfKey:'osym-2023-tyt',page:17,crop:{x:0.5308,y:0.0995,w:0.4301,h:0.1874}},
    'osym-2023-tyt-cog-08':{pdfKey:'osym-2023-tyt',page:17,crop:{x:0.5308,y:0.2892,w:0.4301,h:0.576}},
    'osym-2023-tyt-cog-09':{pdfKey:'osym-2023-tyt',page:18,crop:{x:0.0672,y:0.0995,w:0.4368,h:0.2128}},
    'osym-2023-tyt-cog-10':{pdfKey:'osym-2023-tyt',page:18,crop:{x:0.0672,y:0.3146,w:0.4368,h:0.5506}},
    'osym-2023-tyt-fel-11':{pdfKey:'osym-2023-tyt',page:18,crop:{x:0.5308,y:0.0995,w:0.4301,h:0.3366}},
    'osym-2023-tyt-fel-12':{pdfKey:'osym-2023-tyt',page:18,crop:{x:0.5308,y:0.4384,w:0.4301,h:0.4268}},
    'osym-2023-tyt-fel-13':{pdfKey:'osym-2023-tyt',page:19,crop:{x:0.0672,y:0.0995,w:0.4368,h:0.288}},
    'osym-2023-tyt-fel-14':{pdfKey:'osym-2023-tyt',page:19,crop:{x:0.0672,y:0.3898,w:0.4368,h:0.4754}},
    'osym-2023-tyt-fel-15':{pdfKey:'osym-2023-tyt',page:19,crop:{x:0.5308,y:0.0995,w:0.4301,h:0.7657}},
    'osym-2023-tyt-din-16':{pdfKey:'osym-2023-tyt',page:20,crop:{x:0.0672,y:0.0833,w:0.4368,h:0.7819}},
    'osym-2023-tyt-din-17':{pdfKey:'osym-2023-tyt',page:20,crop:{x:0.5308,y:0.0995,w:0.4301,h:0.3308}},
    'osym-2023-tyt-din-18':{pdfKey:'osym-2023-tyt',page:20,crop:{x:0.5308,y:0.4326,w:0.4301,h:0.4326}},
    'osym-2023-tyt-din-19':{pdfKey:'osym-2023-tyt',page:21,crop:{x:0.0672,y:0.0995,w:0.4368,h:0.2417}},
    'osym-2023-tyt-din-20':{pdfKey:'osym-2023-tyt',page:21,crop:{x:0.0672,y:0.3435,w:0.4368,h:0.5216}},
    'osym-2023-tyt-fel-21':{pdfKey:'osym-2023-tyt',page:21,crop:{x:0.5308,y:0.0879,w:0.4301,h:0.7773}},
    'osym-2023-tyt-fel-22':{pdfKey:'osym-2023-tyt',page:22,crop:{x:0.0672,y:0.0995,w:0.4368,h:0.3667}},
    'osym-2023-tyt-fel-23':{pdfKey:'osym-2023-tyt',page:22,crop:{x:0.0672,y:0.4684,w:0.4368,h:0.3967}},
    'osym-2023-tyt-fel-24':{pdfKey:'osym-2023-tyt',page:22,crop:{x:0.5308,y:0.0995,w:0.4301,h:0.3401}},
    'osym-2023-tyt-fel-25':{pdfKey:'osym-2023-tyt',page:22,crop:{x:0.5308,y:0.4418,w:0.4301,h:0.4233}}
  };
  // NOT: pdfKey:'osym-2023-tyt' henuz claude/question-library branch'indeki
  // api/source-question.js SOURCES objesinde tanimli DEGIL (bu dosyaya bu gorev
  // kapsaminda dokunulmadi). Onceki Fen/Turkce/Matematik-Geometri source QA
  // gorevlerinde de ayni blocker raporlanmisti. Production main'de Fen
  // entegrasyonu nedeniyle bu pdfKey artik mevcut OLABILIR (talimatta belirtildi)
  // - bu, branch farkindan kaynaklanan bir durum olabilir; claude/question-library
  // branch'inde runtime dosyasina dokunulmadigi icin BURADA hala blocker olarak
  // gecerlidir. Crop koordinatlari 25/25 GORSEL OLARAK DOGRULANMIS olsa da,
  // runtime'da PDF.js getDoc() cagrisi bu pdfKey icin (bu branch'te) 404 alabilir,
  // SOURCES objesine 'osym-2023-tyt' eklenene/senkronize edilene kadar. Bu ayri
  // bir onay/adim gerektirir (Codex entegrasyonu).
  //
  // SHARED-CONTENT NOTU: 25 sorunun hicbirinde PAYLASILAN paragraf/tablo/grafik
  // yok (Matematik+Geometri batch'i gibi). Ancak din-16 ve fel-21'in crop'larina,
  // hangi ogrenci grubunun bu soru bloğunu cevaplayacagini belirten baglamsal
  // baslik metni ("16-20. sorulari... almak zorunda olanlar...", "21-25.
  // sorulari... almak zorunda OLMAYAN...") dahil edildi - bu paylasilan icerik
  // degil, sadece o grubun ilk sorusunun kendi crop'unun bir parcasi (17-20 ve
  // 22-25'in crop'larinda tekrarlanmadi, cunku onlarin cozumu icin gerekli
  // degil). Bu iki baslik GORSEL olarak birbirinden net ayirt edildi (biri
  // 'OLANLAR', digeri 'OLMAYAN') - alternate-track izolasyonu dogrulandi.
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
  window.activate2023TytSocial=activate;
})();
