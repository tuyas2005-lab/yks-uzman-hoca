(()=>{
  const O='https://dokuman.osym.gov.tr/pdfdokuman/2025/YKS/TSK/yks_tyt_2025_kitapcik_d250.pdf';
  const key=['B','A','D','D','A','A','E','B','D','C','C','A','B','C','E','C','A','D','C','E'];
  // data: [prefix, subject, topic, subtopics, visual, needsReview?]
  // needsReview=true: soru 10 ve 13'te tabloda/veri setinde verilen sayısal değerler
  // (kaynama noktaları, donma noktası değerleri) PDF text-extraction'da kayboldu.
  // Soru metni/değer/cevap tahmin edilmedi; yalnız topic ataması en yakın makul tahmindir.
  const data=[
    ['fiz','Fizik','Net Kuvvet ve Sürtünme',['sürtünme kuvveti','net kuvvet','yön'],true,false],
    ['fiz','Fizik','Hareket ve Yer Değiştirme',['ortalama hız','adım sayısı'],false,false],
    ['fiz','Fizik','Kaldırma Kuvveti ve Özkütle',['sirke','elma','yüzme batma'],true,false],
    ['fiz','Fizik','Isı ve Sıcaklık',['öz ısı','ısı sığası','meyve suyu'],false,false],
    ['fiz','Fizik','Elektrostatik',['elektron alışverişi','Van de Graff','nötr cisim'],false,false],
    ['fiz','Fizik','Su Dalgaları',['dalga leğeni','genlik','periyot','grafik'],true,false],
    ['fiz','Fizik','Işığın Kırılması',['dalış eğitmeni','kırılma indisi','görünür konum'],true,false],
    ['kim','Kimya','Saf Madde - Element ve Bileşik',['tek tür atom','ayrıştırılabilir saf madde']],
    ['kim','Kimya','Periyodik Sistem - Element Özellikleri',['atom numarası','değerlik elektron','atom yarıçapı']],
    ['kim','Kimya','Moleküller Arası Etkileşimler',['zayıf etkileşim türü','kaynama noktası','H O Cl elementleri'],true,true],
    ['kim','Kimya','Viskozite',['gliserin','etilen glikol','su','sıcaklık ilişkisi']],
    ['kim','Kimya','Kimyasal Hesaplamalar',['H2O ayrışması','mol hesabı','gaz hacmi']],
    ['kim','Kimya','Donma Noktası Alçalması - Koligatif Özellikler',['saf K L maddesi','derişim','donma sıcaklığı'],true,true],
    ['kim','Kimya','Metallerin Tepkimeleri',['alaşım','HCl NaOH tepkimesi','H2 gazı']],
    ['biy','Biyoloji','Hücre Zarı Yapısı',['glikoprotein','kolesterol','taşıyıcı protein','kanal proteini'],true,false],
    ['biy','Biyoloji','Canlıların Ortak Özellikleri',['hücre yapısı','enerji kullanma','uyarılara tepki']],
    ['biy','Biyoloji','Bakteriler',['endositoz','K vitamini','selüloz sindirimi','fotosentez']],
    ['biy','Biyoloji','Mitoz Bölünme',['profaz','anafaz','sitokinez','hücre plağı']],
    ['biy','Biyoloji','Kalıtım - Soyağacı Analizi',['otozomal çekinik','soyağacı','genotip'],true,false],
    ['biy','Biyoloji','Ekoloji',['biyolojik çeşitlilik','endemik tür','habitat koruma']]
  ];
  const rows=data.map((d,i)=>{
    const q=i+1;
    const nr=d[5]===true;
    return {id:`osym-2025-tyt-${d[0]}-${String(q).padStart(2,'0')}`,provider:'OSYM',providerLabel:'ÖSYM',collection:'2025 TYT Temel Soru Kitapçığı',year:2025,exam:'TYT',subject:d[1],topic:d[2],subtopics:d[3],tags:[...d[3],'fen bilimleri'],difficulty:'Orta',visual:d[4]===true,questionNo:String(q),answerKey:key[i],sourceKind:'official',priority:100,access:{mode:'official-url',url:O,page:null,pageRange:'Fen Bilimleri Testi'},verification:{questionNo:'verified',topic:nr?'needs-manual-review-text-extraction-loss':'cross-checked',exactPage:'pending-official-pdf-render',answerKey:'official'}};
  });
  window.YKSQuestionCatalogV1?.register?.(rows);
  window.__YKS_CATALOG_SEEDS__??=[];window.__YKS_CATALOG_SEEDS__.push(...rows);
})();
