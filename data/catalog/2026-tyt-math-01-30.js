(()=>{
  const O='https://dokuman.osym.gov.tr/pdfdokuman/2026/YKS/TSK/yks_tyt_2026_kitapcik_d350.pdf';
  const M='https://ilgaz.meb.gov.tr/meb_iys_dosyalar/2026_06/6a3a22d27eaf0404587806_yks_tyt_2026_kitapcik_d350.pdf';
  const base=(id,topic,subtopics,tags,difficulty,visual,questionNo,page,answerKey)=>({id,provider:'OSYM',providerLabel:'ÖSYM',collection:'2026 TYT Temel Soru Kitapçığı',year:2026,exam:'TYT',subject:'Matematik',topic,subtopics,tags,difficulty,visual,questionNo:String(questionNo),answerKey,sourceKind:'official',priority:100,access:{mode:'official-url',url:O+'#page='+page,mirrorUrl:M+'#page='+page,page}});
  const rows=[
    base('osym-2026-tyt-mat-01','Rasyonel Sayılar',['basit kesir','kesir karşılaştırma'],['rasyonel sayı','kesir'],'Kolay-Orta',false,1,24,'C'),
    base('osym-2026-tyt-mat-02','Üslü Sayılar ve Oran',['geometrik artış','oran','tablo okuma'],['üslü sayı','oran','işlemci','tablo','şekilli'],'Orta',true,2,24,'B'),
    base('osym-2026-tyt-mat-03','Köklü Sayılar ve İşlem Önceliği',['işlem sonucu','tam sayı','sıfır yerleştirme'],['sayılar','işlem','tam sayı'],'Orta',false,3,24,'D'),
    base('osym-2026-tyt-mat-04','Ondalık Sayılar',['ondalık sayılarda işlem','uzunluk farkı'],['ondalık','uzunluk','lale','şekilli'],'Kolay-Orta',true,4,24,'C'),
    base('osym-2026-tyt-mat-05','Denklem ve İşlem Bilgisi',['dört işlem','gerçel sayılar','denklem kurma'],['denklem','işlem hatası','şekilli'],'Orta',true,5,25,'E'),
    base('osym-2026-tyt-mat-06','Bölünebilme ve Çarpanlar',['asal çarpanlar','dikdörtgen alanı','tam sayı kenarlar'],['çarpan','bölünebilme','dikdörtgen'],'Orta',false,6,25,'D'),
    base('osym-2026-tyt-mat-07','Mutlak Değer',['mutlak değer eşitliği','ifade okuma'],['mutlak değer','eşitlik','şekilli'],'Orta',true,7,25,'C'),
    base('osym-2026-tyt-mat-08','Sayı Basamakları ve Tek-Çift',['rakamlar','tek-çift','rakam işlemleri'],['sayı basamakları','tek çift'],'Orta',false,8,25,'A'),
    base('osym-2026-tyt-mat-09','Denklem Kurma - Uzunluk',['kareler','çevre','eşit uzaklıklar','doğrusal denklem'],['denklem','kare','uzunluk','şekilli'],'Orta',true,9,26,'D'),
    base('osym-2026-tyt-mat-10','Kümeler',['küme işlemleri','küme eşleştirme'],['kümeler','venn'],'Orta',true,10,26,'D'),
    base('osym-2026-tyt-mat-11','Mantık',['önermeler','doğruluk değeri','sıralama'],['mantık','önerme','sıralama'],'Orta',false,11,26,'A'),
    base('osym-2026-tyt-mat-12','Fonksiyonlar ve Grafik',['doğrusal fonksiyon','grafik okuma','fonksiyon değerleri'],['fonksiyon','grafik','doğrusal','şekilli'],'Orta',true,12,27,'B'),
    base('osym-2026-tyt-mat-13','Bölme-Bölünebilme',['bölüm','kalan','doğal sayılar'],['bölme','kalan','doğal sayı'],'Orta-Zor',false,13,27,'E'),
    base('osym-2026-tyt-mat-14','Örüntü ve Çokgenler',['düzgün çokgen','örüntü','sayma'],['örüntü','çokgen','yangen','şekilli'],'Orta-Zor',true,14,27,'B'),
    base('osym-2026-tyt-mat-15','Sayı Basamakları',['iki basamaklı sayı','11 ile çarpma','rakamlar toplamı'],['sayı basamakları','rakam toplamı'],'Orta',false,15,27,'C'),
    base('osym-2026-tyt-mat-16','İstatistik',['aritmetik ortalama','medyan','açıklık'],['istatistik','ortalama','medyan','açıklık'],'Orta',false,16,28,'D'),
    base('osym-2026-tyt-mat-17','Çarpanlar ve Problem Çözme',['çarpan çiftleri','satır-sütun düzeni','sayma'],['çarpan','problem','sandalye'],'Orta-Zor',false,17,28,'A'),
    base('osym-2026-tyt-mat-18','Kesir ve Sayma Problemleri',['parça-bütün','denklem kurma','sayma'],['kesir','problem','klavye'],'Orta',false,18,29,'C'),
    base('osym-2026-tyt-mat-19','Yüzde Problemleri',['yüzde değişim','oran-orantı'],['yüzde','oran','karışım problemi'],'Orta',false,19,29,'E'),
    base('osym-2026-tyt-mat-20','Doğru Orantı ve Denklem',['doğru orantı','iki bileşenli ücret','denklem'],['oran orantı','aidat','denklem'],'Orta-Zor',false,20,29,'E'),
    base('osym-2026-tyt-mat-21','Yaş Problemleri',['yaş','yıl','denklem kurma'],['yaş problemi','yıl','şekilli'],'Orta',true,21,29,'E'),
    base('osym-2026-tyt-mat-22','Hareket Problemleri',['sabit hız','zaman','periyodik yolculuk'],['hareket problemi','hız','zaman'],'Orta-Zor',false,22,30,'A'),
    base('osym-2026-tyt-mat-23','Grafik Problemleri',['dairesel grafik','zaman dağılımı','oran'],['grafik','dairesel grafik','zaman','şekilli'],'Orta',true,23,30,'D'),
    base('osym-2026-tyt-mat-24','Hız-Oran Problemleri',['hız','süre oranı','eşitsizlik'],['hız','oran','eşitsizlik'],'Orta-Zor',false,24,30,'C'),
    base('osym-2026-tyt-mat-25','Takvim Problemleri',['aritmetik dizi','günler','toplam'],['takvim','örüntü','toplam'],'Orta-Zor',false,25,30,'D'),
    base('osym-2026-tyt-mat-26','Periyodik Örüntüler',['kelime örüntüsü','periyot','sayma'],['örüntü','periyot','harf'],'Orta',false,26,31,'A'),
    base('osym-2026-tyt-mat-27','Denklem ve Eşitleme Problemleri',['toplam eşitleme','paket seçimi','denklem'],['problem','denklem','paket','şekilli'],'Orta-Zor',true,27,31,'D'),
    base('osym-2026-tyt-mat-28','Mantıksal Sayma Problemleri',['sıralama','kısmi toplam','durum analizi'],['mantık','sayma','koridor','şekilli'],'Orta-Zor',true,28,32,'B'),
    base('osym-2026-tyt-mat-29','Kombinasyon',['seçim','kısıtlı seçim','kombinasyon'],['kombinasyon','seçim','tablo','şekilli'],'Orta-Zor',true,29,32,'B'),
    base('osym-2026-tyt-mat-30','Olasılık',['iki seçim','kusurlu ürün','tamamlayıcı olasılık'],['olasılık','seçim','halı'],'Orta',false,30,32,'A')
  ];
  window.YKSQuestionCatalogV1?.register?.(rows);
  window.__YKS_CATALOG_SEEDS__??=[];window.__YKS_CATALOG_SEEDS__.push(...rows);
})();
