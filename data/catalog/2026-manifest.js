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
      {path:'/data/catalog/2026-tyt-social.js',exam:'TYT',block:'Sosyal Bilimler + alternatif Felsefe',count:25,status:'verified'},
      {path:'/data/catalog/2026-ayt-math-01-28.js',exam:'AYT',block:'Matematik 1-28',count:28,status:'verified'},
      {path:'/data/catalog/2026-ayt-math-geometry.js',exam:'AYT',block:'Matematik / Geometri 29-40',count:12,status:'verified'},
      {path:'/data/catalog/2026-ayt-fen.js',exam:'AYT',block:'Fen Bilimleri',count:40,status:'verified'},
      {path:'/data/catalog/2026-ayt-tde-sb1.js',exam:'AYT',block:'Türk Dili ve Edebiyatı-Sosyal Bilimler-1',count:40,status:'verified-one-cancelled'},
      {path:'/data/catalog/2026-ayt-social2.js',exam:'AYT',block:'Sosyal Bilimler-2',count:40,status:'verified'}
    ],
    indexedCount:285,
    activeQuestionCount:284,
    cancelledCount:1,
    pending:[],
    expectedWhenComplete:285,
    notes:[
      'YDT kullanıcı tercihi doğrultusunda kapsam dışıdır.',
      'TYT Sosyal 21-25 alternatif Felsefe sorularıdır; 16-20 Din Kültürü ile aynı adayın birlikte çözmesi beklenmez.',
      'Soru metni kalıcı katalog verisi olarak depolanmaz; kaynak PDF, soru metadata ve tek-soru kırpma bilgisi kullanılır.',
      'Öğrenci için soru seçimi çözülmemiş en güncel yıldan başlar.',
      'AYT Matematik 23. sorunun nihai cevabı ÖSYM 01.07.2026 kararıyla A olarak düzeltilmiştir.',
      'AYT Türk Dili ve Edebiyatı-Sosyal Bilimler-1 Testi 20. soru ÖSYM 01.07.2026 kararıyla iptal edilmiştir ve öğrenci havuzunda sorulmaz.',
      '2026 TYT ve AYT YDT hariç katalog kapsamı tamamlanmıştır; konu etiketleri günlük kütüphane beslemeleriyle daha ayrıntılı hâle getirilebilir.'
    ]
  };
  window.YKSCatalogManifest2026=manifest;
})();