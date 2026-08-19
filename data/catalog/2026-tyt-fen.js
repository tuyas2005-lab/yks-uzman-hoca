(()=>{
  const O='https://dokuman.osym.gov.tr/pdfdokuman/2026/YKS/TSK/yks_tyt_2026_kitapcik_d350.pdf';
  const M='https://ilgaz.meb.gov.tr/meb_iys_dosyalar/2026_06/6a3a22d27eaf0404587806_yks_tyt_2026_kitapcik_d350.pdf';
  const base=(id,subject,topic,subtopics,tags,difficulty,visual,questionNo,page,answerKey)=>({id,provider:'OSYM',providerLabel:'ÖSYM',collection:'2026 TYT Temel Soru Kitapçığı',year:2026,exam:'TYT',subject,topic,subtopics,tags,difficulty,visual,questionNo:String(questionNo),answerKey,sourceKind:'official',priority:100,access:{mode:'official-url',url:O+'#page='+page,mirrorUrl:M+'#page='+page,page}});
  const rows=[
    base('osym-2026-tyt-fiz-01','Fizik','Özkütle',['özkütle','sıvıların katmanlaşması','kütle-hacim ilişkisi'],['özkütle','sıvı','dereceli kap','şekilli'],'Orta',true,1,37,'D'),
    base('osym-2026-tyt-fiz-02','Fizik','Hareket ve Yer Değiştirme',['yer değiştirme','vektör','alınan yol'],['hareket','yer değiştirme','vektör','parkur','şekilli'],'Orta',true,2,37,'B'),
    base('osym-2026-tyt-fiz-03','Fizik','Kaldırma Kuvveti ve Özkütle',['özkütle sıralaması','yüzme-batma','askıda kalma'],['kaldırma kuvveti','özkütle','yüzme','batma','şekilli'],'Orta-Zor',true,3,38,'E'),
    base('osym-2026-tyt-fiz-04','Fizik','Isı ve Sıcaklık',['ısı alışverişi','ısıl denge','taneciklerin kinetik enerjisi'],['ısı','sıcaklık','ısıl denge'],'Orta',false,4,38,'A'),
    base('osym-2026-tyt-fiz-05','Fizik','Elektrostatik',['elektroskop','elektriklenme','yük cinsi'],['elektrostatik','elektroskop','yük'],'Orta',false,5,38,'C'),
    base('osym-2026-tyt-fiz-06','Fizik','Su Dalgaları',['dalga hızı','frekans','dalga boyu','derinlik'],['dalga','su dalgası','derinlik','dalga boyu','şekilli'],'Orta',true,6,39,'D'),
    base('osym-2026-tyt-fiz-07','Fizik','Aynalar',['düzlem ayna','tümsek ayna','çukur ayna','görüntü boyu'],['optik','ayna','görüntü'],'Orta',false,7,39,'C'),

    base('osym-2026-tyt-kim-08','Kimya','Kimyasal Türler ve Bağlar',['element-bileşik','molekül','iyonik bağ','kovalent bağ'],['tanecik modeli','molekül','kovalent bağ','şekilli'],'Orta',true,8,39,'C'),
    base('osym-2026-tyt-kim-09','Kimya','Atomun Yapısı',['atom numarası','kütle numarası','izotop','izoton','izobar','izoelektronik'],['atom','izotop','izoton','izobar','tablo'],'Orta',true,9,40,'A'),
    base('osym-2026-tyt-kim-10','Kimya','Lewis Sembolleri',['Lewis sembolü','iyon','değerlik elektronu'],['lewis','iyon','değerlik elektronu','tablo'],'Orta',true,10,40,'C'),
    base('osym-2026-tyt-kim-11','Kimya','Sıvılar ve Buhar Basıncı',['denge buhar basıncı','sıcaklık','sıvı-buhar dengesi'],['buhar basıncı','sıvı','denge','deney','şekilli'],'Orta-Zor',true,11,40,'B'),
    base('osym-2026-tyt-kim-12','Kimya','Kimyasal Hesaplamalar',['stokiyometri','sınırlayıcı bileşen','mol-kütle ilişkisi'],['stokiyometri','mol','tepkime'],'Orta',false,12,41,'D'),
    base('osym-2026-tyt-kim-13','Kimya','Çözeltiler ve Derişim',['kütlece yüzde derişim','çözelti hazırlama','seyreltme'],['çözelti','derişim','kütlece yüzde'],'Orta',false,13,41,'E'),
    base('osym-2026-tyt-kim-14','Kimya','Metallerin Tepkimeleri',['aktif metal','soy metal','amfoter metal','asit-baz tepkimeleri'],['metal','aktiflik','soy metal','amfoter'],'Orta',false,14,41,'D'),

    base('osym-2026-tyt-biy-15','Biyoloji','Hücre Zarından Madde Geçişleri',['difüzyon','yarı geçirgen zar','diyaliz'],['difüzyon','hücre zarı','diyaliz'],'Kolay-Orta',false,15,41,'A'),
    base('osym-2026-tyt-biy-16','Biyoloji','Amino Asitler ve Proteinler',['amino asit','peptit bağı','protein sentezi','amfoter özellik'],['amino asit','protein','peptit bağı'],'Orta',false,16,42,'D'),
    base('osym-2026-tyt-biy-17','Biyoloji','Hücre Tipleri',['ökaryot hücre','mitokondri','prokaryot-ökaryot ayrımı'],['ökaryot','prokaryot','mitokondri'],'Kolay-Orta',false,17,42,'E'),
    base('osym-2026-tyt-biy-18','Biyoloji','Hücre Bölünmeleri',['mitoz','mayoz','DNA miktarı','homolog kromozomlar'],['mitoz','mayoz','dna','grafik','şekilli'],'Orta-Zor',true,18,42,'B'),
    base('osym-2026-tyt-biy-19','Biyoloji','Kalıtım',['soyağacı','otozomal kalıtım','X kromozomuna bağlı kalıtım'],['kalıtım','soyağacı','otozomal','x bağlı','şekilli'],'Orta-Zor',true,19,43,'A'),
    base('osym-2026-tyt-biy-20','Biyoloji','Ekoloji',['besin zinciri','biyolojik birikim','trofik düzey'],['ekoloji','trofik düzey','biyolojik birikim','besin zinciri'],'Orta',false,20,43,'C')
  ];
  window.YKSQuestionCatalogV1?.register?.(rows);
  window.__YKS_CATALOG_SEEDS__??=[];window.__YKS_CATALOG_SEEDS__.push(...rows);
})();
