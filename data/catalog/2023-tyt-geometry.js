(()=>{
  const O='https://dokuman.osym.gov.tr/pdfdokuman/2023/YKS/TSK/yks_tyt_2023_kitapcik_T23ky.pdf';
  const key=['E','B','D','C','C','A','C','B','D','D'];
  // data: [topic, subtopics, visual, needsReview?]
  const data=[
    ['Açılar',['defter köşe katlama','x açısı'],true,false],
    ['Üçgende Açılar',['üç dik üçgen','mavi açı kayıp','sarı açı'],true,true],
    ['Üçgende Kenar İlişkileri',['iç açı ortalaması','en kısa en uzun kenar']],
    ['Üçgenlerde Benzerlik ve Alan',['merdiven duvar','duvar kalınlığı'],true,false],
    ['Dik Üçgen',['ses seviyesi uygulaması','yeşil üçgen alanı'],true,false],
    ['Dikdörtgen - Alan ve Çevre',['üç kare tablo','çevre birleştirme'],true,false],
    ['Çokgenler ve Yamuk',['ikizkenar yamuk','kesme sonrası alan']],
    ['Çokgenler ve Yamuk',['düzgün altıgen ayna','çevre uzunluğu toplamı'],true,false],
    ['Dikdörtgenler Prizması - Yüzey Alanı ve Hacim',['küp kesme','yüzey alanı oranı']],
    ['Dikdörtgenler Prizması - Yüzey Alanı ve Hacim',['üç renkli kutu','yukarıdan görünüm alanları'],true,false]
  ];
  const rows=data.map((d,i)=>{const q=i+31;const nr=d[3]===true;return{id:`osym-2023-tyt-mat-${String(q).padStart(2,'0')}`,provider:'OSYM',providerLabel:'ÖSYM',collection:'2023 TYT Temel Soru Kitapçığı',year:2023,exam:'TYT',subject:'Matematik',topic:d[0],subtopics:d[1],tags:[...d[1],'geometri'],difficulty:'Orta',visual:d[2]===true,questionNo:String(q),answerKey:key[i],sourceKind:'official',priority:100,access:{mode:'official-url',url:O,page:null,pageRange:'Temel Matematik Testi'},verification:{questionNo:'verified',topic:nr?'needs-manual-review-text-extraction-loss':'cross-checked',exactPage:'pending-official-pdf-render',answerKey:'official'}}});
  window.YKSQuestionCatalogV1?.register?.(rows);
  window.__YKS_CATALOG_SEEDS__??=[];window.__YKS_CATALOG_SEEDS__.push(...rows);
})();
