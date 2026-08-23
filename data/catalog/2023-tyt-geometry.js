(()=>{
  const O='https://dokuman.osym.gov.tr/pdfdokuman/2023/YKS/TSK/yks_tyt_2023_kitapcik_T23ky.pdf';
  const key=['E','B','D','C','C','A','C','B','D','D'];
  // 22 Agustos 2026: needs-manual-review-text-extraction-loss flag'i (eski: mat-32)
  // KALDIRILDI - resmi PDF gorsel olarak incelendi, mavi aci degeri (115°) GORSEL
  // katmanda TAM ve okunabilirdi. mat-37'de gercek PDF gorselinde acikca yamuk
  // sekli bulundugu halde visual:false yazilmisti - 40/40 piksel QA sirasinda
  // dogrudan dogrulanarak visual:true olarak duzeltildi. access.page GERCEK PDF
  // sayfa numarasiyla dolduruldu. data: [topic, subtopics, visual, needsReview?]
  // — needsReview alani artik kullanilmiyor (veri dizisinde degistirilmeden birakildi).
  const data=[
    ['Açılar',['defter köşe katlama','x açısı'],true,false],
    ['Üçgende Açılar',['üç dik üçgen','mavi açı kayıp','sarı açı'],true,true],
    ['Üçgende Kenar İlişkileri',['iç açı ortalaması','en kısa en uzun kenar']],
    ['Üçgenlerde Benzerlik ve Alan',['merdiven duvar','duvar kalınlığı'],true,false],
    ['Dik Üçgen',['ses seviyesi uygulaması','yeşil üçgen alanı'],true,false],
    ['Dikdörtgen - Alan ve Çevre',['üç kare tablo','çevre birleştirme'],true,false],
    ['Çokgenler ve Yamuk',['ikizkenar yamuk','kesme sonrası alan'],true],
    ['Çokgenler ve Yamuk',['düzgün altıgen ayna','çevre uzunluğu toplamı'],true,false],
    ['Dikdörtgenler Prizması - Yüzey Alanı ve Hacim',['küp kesme','yüzey alanı oranı']],
    ['Dikdörtgenler Prizması - Yüzey Alanı ve Hacim',['üç renkli kutu','yukarıdan görünüm alanları'],true,false]
  ];
  const pageMap={31:31,32:32,33:32,34:32,35:33,36:33,37:33,38:33,39:34,40:34};
  const rows=data.map((d,i)=>{const q=i+31;return{id:`osym-2023-tyt-mat-${String(q).padStart(2,'0')}`,provider:'OSYM',providerLabel:'ÖSYM',collection:'2023 TYT Temel Soru Kitapçığı',year:2023,exam:'TYT',subject:'Matematik',topic:d[0],subtopics:d[1],tags:[...d[1],'geometri'],difficulty:'Orta',visual:d[2]===true,questionNo:String(q),answerKey:key[i],sourceKind:'official',priority:100,access:{mode:'official-url',url:O,page:pageMap[q],pageRange:'Temel Matematik Testi'},verification:{questionNo:'verified',topic:'cross-checked',exactPage:'verified-visual-qa-pass-2026-08-22',answerKey:'official'}}});
  window.YKSQuestionCatalogV1?.register?.(rows);
  window.__YKS_CATALOG_SEEDS__??=[];window.__YKS_CATALOG_SEEDS__.push(...rows);
})();
