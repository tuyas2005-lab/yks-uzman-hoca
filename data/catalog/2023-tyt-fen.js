(()=>{
  const O='https://dokuman.osym.gov.tr/pdfdokuman/2023/YKS/TSK/yks_tyt_2023_kitapcik_T23ky.pdf';
  const key=['A','D','B','B','A','C','C','E','B','C','A','E','A','D','D','A','E','B','E','D'];
  // data: [prefix, subject, topic, subtopics, visual]
  // 20 Agustos 2026: needs-manual-review-text-extraction-loss flag'leri (eski 8 kayit:
  // fiz-01, fiz-05, fiz-07, kim-09, kim-11, biy-18, biy-19, biy-20) KALDIRILDI. Sebep:
  // kullanici tarafindan yuklenen resmi PDF (/mnt/user-data/uploads/yks_tyt_2023_kitapcik_T23ky.pdf)
  // PyMuPDF ile sayfa sayfa render edilip her soru GORSEL olarak (piksel duzeyinde)
  // incelendi - kaybolan icerik yalniz PDF'in METIN katmaniydi, GORSEL katman
  // (grafik/devre/sema/indis/sicaklik degeri) hep tam ve okunabilirdi. Konu (topic)
  // atamalari - onceki metin-bazli tahminlerle karsilastirildi - hepsi DOGRU cikti,
  // degistirilmedi. answerKey zaten resmi kaynaktan dogrulanmisti, hic degismedi.
  // Crop koordinatlari data/../app-source-map-2023-tyt-fen.js dosyasinda GORSEL
  // PASS almis halde tanimli (bkz. calisma raporu).
  const pageMap={fiz:{1:35,2:35,3:35,4:36,5:36,6:36,7:37},kim:{8:37,9:37,10:37,11:38,12:38,13:38,14:38},biy:{15:39,16:39,17:39,18:39,19:40,20:40}};
  const data=[
    ['fiz','Fizik','Kaldırma Kuvveti ve Özkütle',['gezegen balonu','kütle-hacim grafiği','A B C D gazları'],true],
    ['fiz','Fizik','Hareket ve Yer Değiştirme',['otoyol','yer değiştirme','alınan yol'],false],
    ['fiz','Fizik','Elektrik Enerjisi ve Güç',['akkor LED floresan','watt','harcanan enerji'],false],
    ['fiz','Fizik','Isı ve Sıcaklık',['iletim ışıma konveksiyon','Güneş ısı aktarımı'],false],
    ['fiz','Fizik','Elektrik Akımı ve Direnç',['K L M N P R ampulleri','devre şeması','anahtar konumu'],true],
    ['fiz','Fizik','Işık Şiddeti ve Aydınlanma',['saydam abajur','ışık akısı','aydınlanma şiddeti'],true],
    ['fiz','Fizik','Aynalar',['çukur tümsek ayna','LASER','Ay yüzeyi düzeneği'],true],
    ['kim','Kimya','Saf Madde - Element ve Bileşik',['sönmüş kireç','sönmemiş kireç','kireç taşı'],false],
    ['kim','Kimya','Atomun Yapısı',['izoton izotop izoelektronik','kütle numarası'],false],
    ['kim','Kimya','Kimyasal ve Fiziksel Değişim',['H2 Cl2 tepkimesi','CO2 süblimleşme','NaN3 ayrışması'],false],
    ['kim','Kimya','Sıvılar ve Buhar Basıncı',['cıva erime kaynama noktası','hâl değişimi'],false],
    ['kim','Kimya','Kimyasal Hesaplamalar',['H2 gazı','mol sayısı','Avogadro sayısı'],false],
    ['kim','Kimya','Karışımların Ayrılması',['diyaliz yüzdürme damıtma','fiziksel özellik eşleştirme'],false],
    ['kim','Kimya','Asitlerin Genel Özellikleri',['CO2 NH3 çözeltisi','pH değeri'],false],
    ['biy','Biyoloji','Hücrede Koful Çeşitleri ve İşlevleri',['besin kofulu','kontraktil koful','merkezî koful'],false],
    ['biy','Biyoloji','Biyomoleküller - Polimer Yapılar',['selüloz kitin nişasta','polisakkarit'],false],
    ['biy','Biyoloji','Bakteriler',['Protista karşılaştırma','ortak özellik'],false],
    ['biy','Biyoloji','Mitoz Bölünme',['hücre döngüsü modeli','2 yavru hücre'],true],
    ['biy','Biyoloji','Kalıtım - Soyağacı Analizi',['renk körlüğü','X\'e bağlı kalıtım','soyağacı şeması'],true],
    ['biy','Biyoloji','Ekoloji',['karasal ekosistem','besin ağı','trofik düzey'],true]
  ];
  const rows=data.map((d,i)=>{
    const q=i+1;
    const vis=d[4]===true;
    const page=pageMap[d[0]][q];
    return {id:`osym-2023-tyt-${d[0]}-${String(q).padStart(2,'0')}`,provider:'OSYM',providerLabel:'ÖSYM',collection:'2023 TYT Temel Soru Kitapçığı',year:2023,exam:'TYT',subject:d[1],topic:d[2],subtopics:d[3],tags:[...d[3],'fen bilimleri'],difficulty:'Orta',visual:vis,questionNo:String(q),answerKey:key[i],sourceKind:'official',priority:100,access:{mode:'official-url',url:O,page:page,pageRange:'Fen Bilimleri Testi'},verification:{questionNo:'verified',topic:'cross-checked',exactPage:'verified-visual-qa-pass-2026-08-20',answerKey:'official'}};
  });
  window.YKSQuestionCatalogV1?.register?.(rows);
  window.__YKS_CATALOG_SEEDS__??=[];window.__YKS_CATALOG_SEEDS__.push(...rows);
})();
