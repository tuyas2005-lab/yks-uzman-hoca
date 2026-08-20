(()=>{
  const O='https://dokuman.osym.gov.tr/pdfdokuman/2023/YKS/TSK/yks_tyt_2023_kitapcik_T23ky.pdf';
  const key=['A','D','B','B','A','C','C','E','B','C','A','E','A','D','D','A','E','B','E','D'];
  // data: [prefix, subject, topic, subtopics, visual, needsReview?]
  // needsReview=true: soru kokunde kritik grafik/devre/sema/sicaklik degeri/atom numarasi
  // PDF text-extraction'da tamamen kayip - bkz. calisma raporu. Soru metni/deger/cevap
  // tahmin edilmedi; topic en yakin makul tahmindir.
  const data=[
    ['fiz','Fizik','Kaldırma Kuvveti ve Özkütle',['gezegen balonu','kütle-hacim grafiği','A B C D gazları'],true,true],
    ['fiz','Fizik','Hareket ve Yer Değiştirme',['otoyol','yer değiştirme','alınan yol']],
    ['fiz','Fizik','Elektrik Enerjisi ve Güç',['akkor LED floresan','watt','harcanan enerji']],
    ['fiz','Fizik','Isı ve Sıcaklık',['iletim ışıma konveksiyon','Güneş ısı aktarımı']],
    ['fiz','Fizik','Elektrik Akımı ve Direnç',['K L M N P R ampulleri','devre şeması','anahtar konumu'],true,true],
    ['fiz','Fizik','Işık Şiddeti ve Aydınlanma',['saydam abajur','ışık akısı','aydınlanma şiddeti'],true,false],
    ['fiz','Fizik','Aynalar',['çukur tümsek ayna','LASER','Ay yüzeyi düzeneği'],true,true],
    ['kim','Kimya','Saf Madde - Element ve Bileşik',['sönmüş kireç','sönmemiş kireç','kireç taşı']],
    ['kim','Kimya','Atomun Yapısı',['izoton izotop izoelektronik','kütle numarası'],false,true],
    ['kim','Kimya','Kimyasal ve Fiziksel Değişim',['H2 Cl2 tepkimesi','CO2 süblimleşme','NaN3 ayrışması']],
    ['kim','Kimya','Sıvılar ve Buhar Basıncı',['cıva erime kaynama noktası','hâl değişimi'],false,true],
    ['kim','Kimya','Kimyasal Hesaplamalar',['H2 gazı','mol sayısı','Avogadro sayısı']],
    ['kim','Kimya','Karışımların Ayrılması',['diyaliz yüzdürme damıtma','fiziksel özellik eşleştirme']],
    ['kim','Kimya','Asitlerin Genel Özellikleri',['CO2 NH3 çözeltisi','pH değeri']],
    ['biy','Biyoloji','Hücrede Koful Çeşitleri ve İşlevleri',['besin kofulu','kontraktil koful','merkezî koful']],
    ['biy','Biyoloji','Biyomoleküller - Polimer Yapılar',['selüloz kitin nişasta','polisakkarit']],
    ['biy','Biyoloji','Bakteriler',['Protista karşılaştırma','ortak özellik']],
    ['biy','Biyoloji','Mitoz Bölünme',['hücre döngüsü modeli','2 yavru hücre'],true,true],
    ['biy','Biyoloji','Kalıtım - Soyağacı Analizi',['renk körlüğü','X\'e bağlı kalıtım','soyağacı şeması'],true,true],
    ['biy','Biyoloji','Ekoloji',['karasal ekosistem','besin ağı','trofik düzey'],true,true]
  ];
  const rows=data.map((d,i)=>{
    const q=i+1;
    const vis=d[4]===true;
    const nr=d[5]===true;
    return {id:`osym-2023-tyt-${d[0]}-${String(q).padStart(2,'0')}`,provider:'OSYM',providerLabel:'ÖSYM',collection:'2023 TYT Temel Soru Kitapçığı',year:2023,exam:'TYT',subject:d[1],topic:d[2],subtopics:d[3],tags:[...d[3],'fen bilimleri'],difficulty:'Orta',visual:vis,questionNo:String(q),answerKey:key[i],sourceKind:'official',priority:100,access:{mode:'official-url',url:O,page:null,pageRange:'Fen Bilimleri Testi'},verification:{questionNo:'verified',topic:nr?'needs-manual-review-text-extraction-loss':'cross-checked',exactPage:'pending-official-pdf-render',answerKey:'official'}};
  });
  window.YKSQuestionCatalogV1?.register?.(rows);
  window.__YKS_CATALOG_SEEDS__??=[];window.__YKS_CATALOG_SEEDS__.push(...rows);
})();
