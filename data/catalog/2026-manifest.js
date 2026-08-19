(()=>{
  const manifest={
    year:2026,
    scope:{include:['TYT','AYT'],exclude:['YDT']},
    sourcePolicy:'official-first-library-only',
    files:[
      {path:'/data/catalog/2026-tyt-turkce.js',exam:'TYT',block:'Türkçe',count:40,status:'verified'},
      {path:'/data/catalog/2026-tyt-math-01-30.js',exam:'TYT',block:'Temel Matematik 1-30',count:30,status:'verified'},
      {path:'/data/catalog/2026-tyt-geometry.js',exam:'TYT',block:'Matematik / Geometri 31-40',count:10,status:'verified'},
      {path:'/data/catalog/2026-tyt-fen.js',exam:'TYT',block:'Fen Bilimleri',count:20,status:'verified'},
      {path:'/data/catalog/2026-tyt-social.js',exam:'TYT',block:'Sosyal Bilimler',count:25,status:'verified'},
      {path:'/data/catalog/2026-ayt-math-01-28.js',exam:'AYT',block:'Matematik 1-28',count:28,status:'verified-with-page-key-pending'},
      {path:'/data/catalog/2026-ayt-math-geometry.js',exam:'AYT',block:'Matematik / Geometri 29-40',count:12,status:'cross-check-needed'},
      {path:'/data/catalog/2026-ayt-fen.js',exam:'AYT',block:'Fen Bilimleri',count:40,status:'verified'}
    ],
    completedCount:205,
    pending:[
      {exam:'AYT',block:'Türk Dili ve Edebiyatı-Sosyal Bilimler-1',expected:40},
      {exam:'AYT',block:'Sosyal Bilimler-2',expected:40}
    ],
    expectedWhenComplete:285,
    notes:[
      'TYT Sosyal 21-25 alternatif Felsefe sorularıdır; 16-20 Din Kültürü ile aynı adayın birlikte çözmesi beklenmez.',
      'Soru metni veya görseli depolanmaz; yalnız metadata ve resmi kaynak bağlantısı tutulur.',
      'Öğrenci için soru seçimi çözülmemiş en güncel yıldan başlar.',
      'AYT Matematik 23. sorunun nihai cevabı ÖSYM 01.07.2026 kararıyla A olarak düzeltilmiştir.',
      'AYT Matematik 1-28 konu eşleştirmesi tamamlandı; tekil PDF sayfa ve diğer cevap şıkları resmî PDF render erişimi açıldığında doğrulanacak.',
      'AYT Matematik 29-40 önceki indeksinde soru 29/31 eşleşmesi için yeniden çapraz kontrol gerekmektedir.'
    ]
  };
  window.YKSCatalogManifest2026=manifest;
})();
