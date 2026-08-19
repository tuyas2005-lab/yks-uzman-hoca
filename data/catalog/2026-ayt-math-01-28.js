(()=>{
  const O='https://dokuman.osym.gov.tr/pdfdokuman/2026/YKS/TSK/yks_ayt_2026_kitapcik_kt12.pdf';
  const base=(id,topic,subtopics,tags,difficulty,visual,questionNo,answerKey=null,answerValue='')=>({
    id,provider:'OSYM',providerLabel:'ÖSYM',collection:'2026 AYT Temel Soru Kitapçığı',year:2026,exam:'AYT',subject:'Matematik',
    topic,subtopics,tags,difficulty,visual,questionNo:String(questionNo),answerKey,answerValue,
    sourceKind:'official',priority:100,
    access:{mode:'official-url',url:O,page:null,pageRange:'Matematik Testi - ilk 28 soru'},
    verification:{questionNo:'verified',topic:'cross-checked',exactPage:'pending-official-pdf-render',answerKey:answerKey?'official-corrected':'pending-official-pdf-render'}
  });
  const rows=[
    base('osym-2026-ayt-mat-01','Bölünebilme Kuralları',['11 ile bölünebilme','12 ile bölünebilme','13 ile bölünebilme','sayı basamakları'],['bölünebilme','sayı basamakları','tam sayı'],'Orta',false,1,null,'36'),
    base('osym-2026-ayt-mat-02','Köklü Sayılar',['köklü ifadeler','denklem çözme','karesini alma'],['köklü sayı','denklem'],'Orta',false,2,null,'73'),
    base('osym-2026-ayt-mat-03','Mutlak Değer',['mutlak değerli denklem','gerçel sayılar'],['mutlak değer','denklem'],'Orta',false,3,null,'-7/2'),
    base('osym-2026-ayt-mat-04','Sayı Basamakları',['rakamlar','tek rakamlar','basamak değeri'],['sayı basamakları','rakam'],'Orta',false,4,null,'12'),
    base('osym-2026-ayt-mat-05','Asal Sayılar',['asal sayılar','cebirsel ilişkiler','tam sayılar'],['asal sayı','tam sayı'],'Orta-Zor',false,5,null,'70'),
    base('osym-2026-ayt-mat-06','Polinomlar ve Eşitsizlikler',['polinom','eşitsizlik','tek çözüm koşulu'],['polinom','eşitsizlik'],'Orta-Zor',false,6,null,'-3'),
    base('osym-2026-ayt-mat-07','Fonksiyon Grafikleri',['fonksiyon grafiği','grafik yorumlama','parametre bulma'],['fonksiyon','grafik','şekilli'],'Orta',true,7,null,'5'),
    base('osym-2026-ayt-mat-08','Bileşke Fonksiyon',['bileşke fonksiyon','fonksiyon değeri'],['fonksiyon','bileşke'],'Orta',false,8,null,'13'),
    base('osym-2026-ayt-mat-09','Mantık ve Sayı Kümeleri',['rasyonel sayılar','irrasyonel sayılar','önermeler'],['mantık','rasyonel','irrasyonel'],'Orta',false,9),
    base('osym-2026-ayt-mat-10','Kümeler',['küme işlemleri','kesişim','sayı kümeleri'],['kümeler','kesişim','sayı basamakları'],'Zor',false,10),
    base('osym-2026-ayt-mat-11','Parabol',['parabol grafiği','öteleme','kökler'],['parabol','grafik','öteleme','şekilli'],'Orta-Zor',true,11,null,'14'),
    base('osym-2026-ayt-mat-12','İkinci Dereceden Denklemler',['diskriminant','kökler çarpımı','parametre'],['ikinci derece denklem','diskriminant'],'Orta',false,12,null,'1/6'),
    base('osym-2026-ayt-mat-13','Diziler',['dizi','örüntü','terim ilişkileri'],['diziler','örüntü'],'Zor',false,13,null,'58'),
    base('osym-2026-ayt-mat-14','Olasılık - Bağımsız Olaylar',['bağımsız olay','olasılık','durum sayma'],['olasılık','bağımsız olay','problem'],'Orta-Zor',false,14,null,'12'),
    base('osym-2026-ayt-mat-15','Binom Açılımı',['binom','katsayı','terim bulma'],['binom','açılım'],'Orta',false,15,null,'9/4'),
    base('osym-2026-ayt-mat-16','Permütasyon',['sıralama','kısıtlı permütasyon','otopark düzeni'],['permütasyon','sıralama','problem'],'Orta-Zor',false,16,null,'252'),
    base('osym-2026-ayt-mat-17','Logaritma',['logaritmik ifade','faktöriyel','denklem'],['logaritma','faktöriyel'],'Orta',false,17,null,'7'),
    base('osym-2026-ayt-mat-18','Logaritma Grafiği',['logaritmik grafik','üstel-logaritmik ilişki','grafik okuma'],['logaritma','grafik','şekilli'],'Orta-Zor',true,18,null,'14'),
    base('osym-2026-ayt-mat-19','Süreklilik',['süreklilik','fonksiyon grafiği','öncül yorumlama'],['süreklilik','fonksiyon','grafik','şekilli'],'Zor',true,19),
    base('osym-2026-ayt-mat-20','Limit',['belirsizlik','küp farkı','limit hesabı','parametre'],['limit','0/0','çarpanlara ayırma'],'Orta-Zor',false,20,null,'12'),
    base('osym-2026-ayt-mat-21','Türev - Çarpım Kuralı',['çarpımın türevi','türev değeri'],['türev','çarpım kuralı'],'Orta',false,21,null,'16'),
    base('osym-2026-ayt-mat-22','İkinci Türev',['ikinci türev','türev uygulamaları','fonksiyon değeri'],['türev','ikinci türev'],'Orta-Zor',false,22,null,'-2'),
    base('osym-2026-ayt-mat-23','Türev Grafiği ve Kök Yorumu',['türev grafiği','alan','fonksiyonun kökü','işaret analizi'],['türev','grafik','kök','alan','şekilli'],'Zor',true,23,'A','Yalnız I'),
    base('osym-2026-ayt-mat-24','Belirli İntegral',['belirli integral','integral hesabı'],['integral','belirli integral'],'Orta',false,24,null,'33'),
    base('osym-2026-ayt-mat-25','İntegral ve Alan',['integral','değişken dönüşümü','f(2x)','alan'],['integral','alan','fonksiyon'],'Orta-Zor',true,25,null,'3'),
    base('osym-2026-ayt-mat-26','İntegral - Alan Karşılaştırma',['integral alanı','boyalı bölgeler','alan sıralaması'],['integral','alan','grafik','renkli bölgeler','şekilli'],'Zor',true,26,null,'M-K-S'),
    base('osym-2026-ayt-mat-27','Trigonometri - Özdeşlikler',['trigonometrik sadeleştirme','iki kat açı','sekant'],['trigonometri','özdeşlik','sec'],'Orta',false,27,null,'sec(2x)'),
    base('osym-2026-ayt-mat-28','Trigonometri - Toplam Fark Formülleri',['toplam-fark formülleri','sinüs','özel açı'],['trigonometri','toplam fark','sinüs'],'Orta-Zor',false,28,null,'√3/2')
  ];
  window.YKSQuestionCatalogV1?.register?.(rows);
  window.__YKS_CATALOG_SEEDS__??=[];window.__YKS_CATALOG_SEEDS__.push(...rows);
})();
