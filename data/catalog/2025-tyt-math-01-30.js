(()=>{
  const O='https://dokuman.osym.gov.tr/pdfdokuman/2025/YKS/TSK/yks_tyt_2025_kitapcik_d250.pdf';
  const key=['D','B','E','C','E','C','B','D','A','E','A','E','C','A','C','E','B','B','C','B','E','A','D','D','D','B','B','A','C','B'];
  // data: [topic, subtopics, needsReview?]
  // needsReview=true: soru kökündeki matematiksel ifade/görsel PDF text-extraction'da
  // kayboldu (bkz. çalışma raporu); topic en yakın makul tahmindir, gözle PDF görülmeden
  // kesinleştirilemez. Soru metni veya cevabı TAHMİN EDİLMEMİŞTİR - yalnız topic ataması
  // bu kayıp nedeniyle daha düşük güvenilirlikte.
  const data=[
    ['Kesir ve Sayma Problemleri',['tablet ekranı','bölme oranı','kaçta kaç']],
    ['Üslü Sayılar ve Oran',['üslü ifade','parantez kullanımı']],
    ['Üslü Sayılar ve Oran',['matematik kitabı sayfası','işlem sonucu karşılaştırma'],true],
    ['Ondalık Sayılar',['basamak değeri','onda-birler yüzde-birler']],
    ['Köklü Sayılar ve İşlem Önceliği',['sayı gösterimi','x değeri bulma'],true],
    ['Denklem ve İşlem Bilgisi',['otoyol şeritleri','araç sayısı eşitleme']],
    ['Eşitsizlikler',['futbol maçı','gol sayısı','eşitsizlik']],
    ['Sayı Basamakları ve Tek-Çift',['çift-tek tam sayı ifadeleri']],
    ['Mantıksal Sayma Problemleri',['meyve paketleri','gruplama','eşleştirme']],
    ['Kümeler',['küme koşulları','B kümesi']],
    ['Mantık',['önermeler','p q r']],
    ['Asal Sayılar',['asalız sayı','iki basamaklı asal']],
    ['Fonksiyonlar ve Grafik',['doğrusal fonksiyon grafiği']],
    ['Bölme-Bölünebilme',['5 ile bölme','9 ile bölme','kalan']],
    ['Sayı Basamakları',['ardışık tek doğal sayı','rakamlar toplamı']],
    ['İstatistik',['medyan','aritmetik ortalama','veri grubu']],
    ['Denklem Kurma - Fiyat Problemleri',['market','roka maydanoz tere','fiyat karışıklığı']],
    ['Kesir ve Sayma Problemleri',['basketbol atış','isabet oranı']],
    ['Yüzde Problemleri',['yazdırma işlemi','bilgisayar yazıcı yüzdesi']],
    ['Mantıksal Sayma Problemleri',['rakam gruplama','toplam eşitleme']],
    ['Yaş Problemleri',['günlük yazısı','tarih silinmiş','yaş 3 katı']],
    ['Hareket Problemleri',['şehirler arası mesafe','hız zaman']],
    ['Grafik Problemleri',['top paketleri','daire grafiği','yüzde']],
    ['Saat ve Zaman Problemleri',['mesaj zamanları','telefon saati tahmini']],
    ['Mantıksal Sayma Problemleri',['ev renkleri','market manav','sıralama mantığı']],
    ['Takvim Problemleri',['haftalık ders programı','1 Mart günü']],
    ['Sayı Örüntüleri',['dolap bölmeleri','numaralandırma örüntüsü']],
    ['Takvim Problemleri',['internet sitesi geri sayım','tarih oluşturma']],
    ['Permütasyon',['aktivite sıralaması','kısıtlı sıralama']],
    ['Olasılık',['hediye dağıtımı','en az biri']]
  ];
  const rows=data.map((d,i)=>{const q=i+1;const nr=d[2]===true;const visualQs=new Set([1,3,9,13,19,21,22,23,24,26,27,28]);return{id:`osym-2025-tyt-mat-${String(q).padStart(2,'0')}`,provider:'OSYM',providerLabel:'ÖSYM',collection:'2025 TYT Temel Soru Kitapçığı',year:2025,exam:'TYT',subject:'Matematik',topic:d[0],subtopics:d[1],tags:[...d[1],'matematik'],difficulty:'Orta',visual:visualQs.has(q),questionNo:String(q),answerKey:key[i],sourceKind:'official',priority:100,access:{mode:'official-url',url:O,page:null,pageRange:'Temel Matematik Testi'},verification:{questionNo:'verified',topic:nr?'needs-manual-review-text-extraction-loss':'cross-checked',exactPage:'pending-official-pdf-render',answerKey:'official'}}});
  window.YKSQuestionCatalogV1?.register?.(rows);
  window.__YKS_CATALOG_SEEDS__??=[];window.__YKS_CATALOG_SEEDS__.push(...rows);
})();
