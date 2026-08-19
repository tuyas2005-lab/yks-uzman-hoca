(()=>{
  const O='https://dokuman.osym.gov.tr/pdfdokuman/2026/YKS/TSK/yks_ayt_2026_kitapcik_kt12.pdf';
  const M='https://ilgaz.meb.gov.tr/meb_iys_dosyalar/2026_06/6a3a23aadc3ad297424820_yks_ayt_2026_kitapcik_kt12.pdf';
  const base=(id,topic,subtopics,tags,difficulty,visual,questionNo,page,answerKey)=>({id,provider:'OSYM',providerLabel:'ÖSYM',collection:'2026 AYT Temel Soru Kitapçığı',year:2026,exam:'AYT',subject:'Matematik',topic,subtopics,tags,difficulty,visual,questionNo:String(questionNo),answerKey,sourceKind:'official',priority:100,access:{mode:'official-url',url:O+'#page='+page,mirrorUrl:M+'#page='+page,page}});
  const rows=[
    base('osym-2026-ayt-mat-29','Üçgende Kenar-Açı İlişkileri',['60 derece açı','eşkenar üçgen','dik üçgen','kenar ilişkileri'],['üçgen','60 derece','eşkenar','dik üçgen'],'Orta-Zor',false,29,35,'D'),
    base('osym-2026-ayt-mat-30','Trigonometri',['trigonometrik denklem','sinüs','kosinüs','çözüm kümesi'],['trigonometri','sin','cos','denklem'],'Orta',false,30,35,'D'),
    base('osym-2026-ayt-mat-31','Dik Üçgen ve Trigonometri',['açı iki katı','dik üçgen','trigonometrik oranlar','uzunluk'],['dik üçgen','trigonometri','koşu bandı','şekilli'],'Zor',true,31,35,'A'),
    base('osym-2026-ayt-mat-32','Üçgenin Alanı',['ikizkenar üçgen','çevre','alan','ortak kenarlı üçgenler'],['üçgen','ikizkenar','alan','çevre','şekilli'],'Orta-Zor',true,32,35,'B'),
    base('osym-2026-ayt-mat-33','Çemberde Açı ve Yay',['dönme','çember','yay','açı','çevre'],['çember','yay','açı','dönme','bisiklet','şekilli'],'Zor',true,33,36,'D'),
    base('osym-2026-ayt-mat-34','Çemberde Kiriş ve Yay Uzunluğu',['kiriş','merkez açı','yay uzunluğu','çember'],['çember','kiriş','yay uzunluğu','açı','şekilli'],'Zor',true,34,36,'B'),
    base('osym-2026-ayt-mat-35','Analitik Geometri - Bölgeler',['koordinat düzlemi','eksen kesişimleri','doğru parçaları','bölgeler'],['analitik geometri','koordinat','bölge','eksen'],'Orta',false,35,36,'B'),
    base('osym-2026-ayt-mat-36','Analitik Geometri - Paralel Doğrular',['paralel doğrular','eksenleri kesme','doğrular arası uzaklık'],['analitik geometri','paralel doğrular','uzaklık'],'Orta-Zor',false,36,37,'A'),
    base('osym-2026-ayt-mat-37','Analitik Geometri - Koordinat ve Alan',['dikdörtgen','kare','orijinden geçen doğru','koordinat'],['analitik geometri','dikdörtgen','kare','koordinat'],'Zor',false,37,37,'A'),
    base('osym-2026-ayt-mat-38','Analitik Geometri - Simetri',['doğruya göre simetri','dikdörtgen','koordinat düzlemi'],['analitik geometri','simetri','dikdörtgen','şekilli'],'Zor',true,38,37,'E'),
    base('osym-2026-ayt-mat-39','Analitik Geometri - Çember',['çember denklemi','teğetlik','öteleme','eksen kesişimleri'],['analitik geometri','çember','teğet','öteleme'],'Orta-Zor',false,39,37,'D'),
    base('osym-2026-ayt-mat-40','Silindir - Hacim',['dik dairesel silindir','hacim','yarıçap','eşit hacimler'],['silindir','hacim','katı cisim','şekilli'],'Orta',true,40,38,'C')
  ];
  window.YKSQuestionCatalogV1?.register?.(rows);
  window.__YKS_CATALOG_SEEDS__??=[];window.__YKS_CATALOG_SEEDS__.push(...rows);
})();
