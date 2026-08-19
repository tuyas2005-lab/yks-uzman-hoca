(()=>{
  const manifest={
    year:2026,
    scope:{include:['TYT','AYT'],exclude:['YDT']},
    sourcePolicy:'official-first-library-only',
    files:[
      {path:'/data/catalog/2026-tyt-geometry.js',exam:'TYT',block:'Matematik / Geometri',count:10,status:'verified'},
      {path:'/data/catalog/2026-tyt-fen.js',exam:'TYT',block:'Fen Bilimleri',count:20,status:'verified'},
      {path:'/data/catalog/2026-tyt-social.js',exam:'TYT',block:'Sosyal Bilimler',count:25,status:'verified'},
      {path:'/data/catalog/2026-ayt-math-geometry.js',exam:'AYT',block:'Matematik / Geometri',count:12,status:'verified'},
      {path:'/data/catalog/2026-ayt-fen.js',exam:'AYT',block:'Fen Bilimleri',count:40,status:'verified'}
    ],
    completedCount:107,
    pending:[
      {exam:'TYT',block:'Türkçe',expected:40},
      {exam:'TYT',block:'Temel Matematik 1-30',expected:30},
      {exam:'AYT',block:'Matematik 1-28',expected:28},
      {exam:'AYT',block:'Türk Dili ve Edebiyatı-Sosyal Bilimler-1',expected:40},
      {exam:'AYT',block:'Sosyal Bilimler-2',expected:40}
    ],
    expectedWhenComplete:285,
    notes:[
      'TYT Sosyal 21-25 alternatif Felsefe sorularıdır; 16-20 Din Kültürü ile aynı adayın birlikte çözmesi beklenmez.',
      'Soru metni veya görseli depolanmaz; yalnız metadata ve resmi kaynak bağlantısı tutulur.',
      'Öğrenci için soru seçimi çözülmemiş en güncel yıldan başlar.'
    ]
  };
  window.YKSCatalogManifest2026=manifest;
})();
