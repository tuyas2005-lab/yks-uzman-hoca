(()=>{
  const MAP={
    'osym-2023-tyt-mat-01':{pdfKey:'osym-2023-tyt',page:23,crop:{x:0.0672,y:0.1654,w:0.4368,h:0.6998}},
    'osym-2023-tyt-mat-02':{pdfKey:'osym-2023-tyt',page:23,crop:{x:0.5308,y:0.1654,w:0.4301,h:0.3944}},
    'osym-2023-tyt-mat-03':{pdfKey:'osym-2023-tyt',page:23,crop:{x:0.5308,y:0.5621,w:0.4301,h:0.303}},
    'osym-2023-tyt-mat-04':{pdfKey:'osym-2023-tyt',page:24,crop:{x:0.0672,y:0.0995,w:0.4368,h:0.177}},
    'osym-2023-tyt-mat-05':{pdfKey:'osym-2023-tyt',page:24,crop:{x:0.0672,y:0.2788,w:0.4368,h:0.5864}},
    'osym-2023-tyt-mat-06':{pdfKey:'osym-2023-tyt',page:24,crop:{x:0.5308,y:0.0995,w:0.4301,h:0.7657}},
    'osym-2023-tyt-mat-07':{pdfKey:'osym-2023-tyt',page:25,crop:{x:0.0672,y:0.0995,w:0.4368,h:0.7657}},
    'osym-2023-tyt-mat-08':{pdfKey:'osym-2023-tyt',page:25,crop:{x:0.5308,y:0.0995,w:0.4301,h:0.3875}},
    'osym-2023-tyt-mat-09':{pdfKey:'osym-2023-tyt',page:25,crop:{x:0.5308,y:0.4893,w:0.4301,h:0.3759}},
    'osym-2023-tyt-mat-10':{pdfKey:'osym-2023-tyt',page:26,crop:{x:0.0672,y:0.0995,w:0.4368,h:0.2475}},
    'osym-2023-tyt-mat-11':{pdfKey:'osym-2023-tyt',page:26,crop:{x:0.0672,y:0.3493,w:0.4368,h:0.5159}},
    'osym-2023-tyt-mat-12':{pdfKey:'osym-2023-tyt',page:26,crop:{x:0.5308,y:0.0995,w:0.4301,h:0.2464}},
    'osym-2023-tyt-mat-13':{pdfKey:'osym-2023-tyt',page:26,crop:{x:0.5308,y:0.3482,w:0.4301,h:0.3262}},
    'osym-2023-tyt-mat-14':{pdfKey:'osym-2023-tyt',page:26,crop:{x:0.5308,y:0.6766,w:0.4301,h:0.1885}},
    'osym-2023-tyt-mat-15':{pdfKey:'osym-2023-tyt',page:27,crop:{x:0.0672,y:0.0995,w:0.4368,h:0.2371}},
    'osym-2023-tyt-mat-16':{pdfKey:'osym-2023-tyt',page:27,crop:{x:0.0672,y:0.3389,w:0.4368,h:0.5263}},
    'osym-2023-tyt-mat-17':{pdfKey:'osym-2023-tyt',page:27,crop:{x:0.5308,y:0.0995,w:0.4301,h:0.4627}},
    'osym-2023-tyt-mat-18':{pdfKey:'osym-2023-tyt',page:27,crop:{x:0.5308,y:0.5644,w:0.4301,h:0.3007}},
    'osym-2023-tyt-mat-19':{pdfKey:'osym-2023-tyt',page:28,crop:{x:0.0672,y:0.0995,w:0.4368,h:0.7657}},
    'osym-2023-tyt-mat-20':{pdfKey:'osym-2023-tyt',page:28,crop:{x:0.5308,y:0.0995,w:0.4301,h:0.7657}},
    'osym-2023-tyt-mat-21':{pdfKey:'osym-2023-tyt',page:29,crop:{x:0.0672,y:0.0995,w:0.4368,h:0.3516}},
    'osym-2023-tyt-mat-22':{pdfKey:'osym-2023-tyt',page:29,crop:{x:0.0672,y:0.4534,w:0.4368,h:0.4118}},
    'osym-2023-tyt-mat-23':{pdfKey:'osym-2023-tyt',page:29,crop:{x:0.5308,y:0.0995,w:0.4301,h:0.3158}},
    'osym-2023-tyt-mat-24':{pdfKey:'osym-2023-tyt',page:29,crop:{x:0.5308,y:0.4176,w:0.4301,h:0.4476}},
    'osym-2023-tyt-mat-25':{pdfKey:'osym-2023-tyt',page:30,crop:{x:0.0672,y:0.0995,w:0.4368,h:0.4372}},
    'osym-2023-tyt-mat-26':{pdfKey:'osym-2023-tyt',page:30,crop:{x:0.0672,y:0.539,w:0.4368,h:0.3262}},
    'osym-2023-tyt-mat-27':{pdfKey:'osym-2023-tyt',page:30,crop:{x:0.5308,y:0.0995,w:0.4301,h:0.7657}},
    'osym-2023-tyt-mat-28':{pdfKey:'osym-2023-tyt',page:31,crop:{x:0.0672,y:0.0995,w:0.4368,h:0.3551}},
    'osym-2023-tyt-mat-29':{pdfKey:'osym-2023-tyt',page:31,crop:{x:0.0672,y:0.4569,w:0.4368,h:0.4083}},
    'osym-2023-tyt-mat-30':{pdfKey:'osym-2023-tyt',page:31,crop:{x:0.5308,y:0.0995,w:0.4301,h:0.369}},
    'osym-2023-tyt-mat-31':{pdfKey:'osym-2023-tyt',page:31,crop:{x:0.5308,y:0.4708,w:0.4301,h:0.3944}},
    'osym-2023-tyt-mat-32':{pdfKey:'osym-2023-tyt',page:32,crop:{x:0.0672,y:0.0995,w:0.4368,h:0.266}},
    'osym-2023-tyt-mat-33':{pdfKey:'osym-2023-tyt',page:32,crop:{x:0.0672,y:0.3678,w:0.4368,h:0.4974}},
    'osym-2023-tyt-mat-34':{pdfKey:'osym-2023-tyt',page:32,crop:{x:0.5308,y:0.0995,w:0.4301,h:0.7657}},
    'osym-2023-tyt-mat-35':{pdfKey:'osym-2023-tyt',page:33,crop:{x:0.0672,y:0.0995,w:0.4368,h:0.4129}},
    'osym-2023-tyt-mat-36':{pdfKey:'osym-2023-tyt',page:33,crop:{x:0.0672,y:0.5147,w:0.4368,h:0.3505}},
    'osym-2023-tyt-mat-37':{pdfKey:'osym-2023-tyt',page:33,crop:{x:0.5308,y:0.0995,w:0.4301,h:0.3192}},
    'osym-2023-tyt-mat-38':{pdfKey:'osym-2023-tyt',page:33,crop:{x:0.5308,y:0.421,w:0.4301,h:0.4442}},
    'osym-2023-tyt-mat-39':{pdfKey:'osym-2023-tyt',page:34,crop:{x:0.0672,y:0.0995,w:0.4368,h:0.1908}},
    'osym-2023-tyt-mat-40':{pdfKey:'osym-2023-tyt',page:34,crop:{x:0.0672,y:0.2926,w:0.4368,h:0.5725}}
  };
  // NOT: pdfKey:'osym-2023-tyt' henuz api/source-question.js SOURCES objesinde
  // tanimli DEGIL (2023 TYT Fen ve Turkce QA gorevlerinde de ayni blocker
  // raporlanmisti - bkz. docs/question-source-catalog.md). Bu dosyaya bu gorev
  // kapsaminda dokunulmadi. Crop koordinatlari 40/40 GORSEL OLARAK DOGRULANMIS
  // olsa da, runtime'da PDF.js getDoc() cagrisi bu pdfKey icin 404 alacak,
  // SOURCES objesine 'osym-2023-tyt' eklenene kadar. Bu ayri bir onay/adim
  // gerektirir (Codex entegrasyonu).
  //
  // SHARED-CONTENT NOTU: bu batch'te (2023 TYT Matematik+Geometri) hicbir soru
  // baska bir soruyla ortak paragraf/sekil/tablo paylasmiyor (Turkce batch'inin
  // aksine) - dogrulandi, bu yuzden tum 40 kayit tek 'crop' kullanir, 'parts'
  // mekanizmasi gereksiz yere kullanilmadi.

  const CANONICAL={1:["tyt.matematik.sayi-ve-kesir-problemleri","high"],2:["tyt.matematik.problemler","medium"],3:["tyt.matematik.yuzde-kar-zarar-karisim-problemleri","high"],4:["tyt.matematik.uslu-sayilar","high"],5:["tyt.matematik.koklu-sayilar","high"],6:["tyt.matematik.rasyonel-sayilar","high"],7:["tyt.matematik.problemler","medium"],8:["tyt.matematik.problemler","medium"],9:["tyt.matematik.problemler","medium"],10:["tyt.matematik.kumeler","high"],11:["tyt.matematik.mantik","high"],12:["tyt.matematik.fonksiyonlar","high"],13:["tyt.matematik.sayi-basamaklari","high"],14:["tyt.matematik.bolme-ve-bolunebilme","high"],15:["tyt.matematik.sayi-basamaklari","high"],16:["tyt.matematik.istatistik","high"],17:["tyt.matematik.problemler","medium"],18:["tyt.matematik.basit-esitsizlikler","high"],19:["tyt.matematik.problemler","medium"],20:["tyt.matematik.grafik-ve-tablo-problemleri","high"],21:["tyt.matematik.problemler","medium"],22:["tyt.matematik.hareket-ve-isci-problemleri","high"],23:["tyt.matematik.oran-oranti","high"],24:["tyt.matematik.sayi-basamaklari","high"],25:["tyt.matematik.grafik-ve-tablo-problemleri","high"],26:["tyt.matematik.yas-problemleri","high"],27:["tyt.matematik.problemler","medium"],28:["tyt.matematik.problemler","medium"],29:["tyt.matematik.permutasyon-kombinasyon-binomial","high"],30:["tyt.matematik.olaslik","high"],31:["tyt.matematik.geometride-temel-kavramlar","high"],32:["tyt.matematik.ucgenler","high"],33:["tyt.matematik.ucgenler","high"],34:["tyt.matematik.ucgenler","high"],35:["tyt.matematik.dik-ve-ozel-ucgenler","high"],36:["tyt.matematik.cokgenler-ve-dortgenler","high"],37:["tyt.matematik.cokgenler-ve-dortgenler","high"],38:["tyt.matematik.cokgenler-ve-dortgenler","high"],39:["tyt.matematik.kati-cisimler","high"],40:["tyt.matematik.kati-cisimler","high"]};
  function activate(){
    const C=window.YKSQuestionCatalogV1;if(!C?.all)return false;
    let changed=false;
    for(const item of C.all()){
      const a=MAP[item.id];if(!a)continue;
      item.asset={status:'ready',kind:'cached-pdf-crop',...a};
      item.answerVerified=!!item.answerKey;
      const q=Number(item.questionNo),mapped=CANONICAL[q];
      if(mapped){item.canonicalTopicId=mapped[0];item.mappingConfidence=mapped[1];item.verification={...(item.verification||{}),canonicalTopic:'verified-question-level-mapping',mappingConfidence:mapped[1],domain:q>=31?'GEOMETRI':'MATEMATIK'};}
      if(item.answerKey&&!item.answer)item.answer=item.answerKey;
      changed=true;
    }
    if(changed)setTimeout(()=>{try{window.renderQuestionIndex?.()}catch{}},0);
    return changed;
  }
  if(!activate()){let n=0;const t=setInterval(()=>{if(activate()||++n>30)clearInterval(t)},100)}
  window.activate2023TytMathGeometry=activate;
})();
