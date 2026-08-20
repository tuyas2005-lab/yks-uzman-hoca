(()=>{
  const O='https://dokuman.osym.gov.tr/pdfdokuman/2023/YKS/TSK/yks_tyt_2023_kitapcik_T23ky.pdf';
  const key=['D','A','D','D','E','A','E','A','D','E','C','B','B','E','C','B','A','C','B','E','D','C','D','C','E','E','A','B','C','B'];
  // data: [topic, subtopics, visual, needsReview?]
  // needsReview=true: soru kokunde kritik matematiksel veri (tablo/grafik degeri, oran,
  // kosul, formul, gosterim) PDF text-extraction'da tamamen kayip - bkz. calisma raporu.
  // Soru metni/deger/cevap tahmin edilmedi; topic en yakin makul tahmindir.
  const data=[
    ['Kesir ve Sayma Problemleri',['nota sembolleri tablosu','süre uzunluğu toplamı'],true,true],
    ['Denklem Kurma - Uzunluk',['çiçeklik rafları','yerden yükseklik toplamı'],true,false],
    ['Yüzde Problemleri',['nüfus sayımı','yıllık artış oranı','oran kayıp'],false,true],
    ['Üslü Sayılar ve Oran',['kare alanı','üslü ifade toplamı'],false,true],
    ['Köklü Sayılar ve İşlem Önceliği',['sayı gösterimi','x değeri'],false,true],
    ['Rasyonel Sayılar',['sayı doğrusu gösterimi','a b c sıralaması'],false,true],
    ['Periyodik Örüntüler',['lamba ip çekme','döngüsel durum'],true,false],
    ['Denklem Kurma - Uzunluk',['balon ip mesafesi','18 cm fark'],true,false],
    ['Saat ve Zaman Problemleri',['otel dijital saat','yerel saat farkı']],
    ['Kümeler',['isim harfleri kümesi','X Y kümesi'],false,true],
    ['Mantık',['doktor muayenesi','önermeler']],
    ['Fonksiyonlar ve Grafik',['f g fonksiyon tanımı','koşul kayıp'],false,true],
    ['Sayı Basamakları',['farklı rakam sayısı fonksiyonu','eşitlik kayıp'],false,true],
    ['Bölünebilme ve Çarpanlar',['ABB BAB doğal sayı','11 12 bölünebilme']],
    ['Sayı Basamakları',['AB BC CA doğal sayı','basamak ilişkisi']],
    ['İstatistik',['haftalık sıcaklık verileri','medyan mod'],false,true],
    ['Denklem Kurma - Uzunluk',['duvar rafları','oyuncak yerleşimi'],true,false],
    ['Eşitsizlikler',['kahve makinesi','bardak uzunluk aralığı'],true,false],
    ['Denklem Kurma - Fiyat Problemleri',['kırtasiye kampanyası','sırt çantası kalem kutusu']],
    ['Grafik Problemleri',['dolap kıyafet dağılımı','daire grafik','yüzde kayıp'],true,true],
    ['Denklem Kurma - Fiyat Problemleri',['kırtasiye kampanya B','indirim yüzdesi']],
    ['Hareket Problemleri',['dairesel parkur','sabit hız koşu'],true,false],
    ['Doğru Orantı ve Denklem',['ressam sergi','satış oranı kayıp'],false,true],
    ['Sayı Basamakları',['bilye gruplama','AB BA doğal sayı']],
    ['Grafik Problemleri',['gömlek pantolon ceket','daire grafik','yüzde kayıp'],true,true],
    ['Yaş Problemleri',['restoran kuruluş yılı','yaş toplamı']],
    ['Periyodik Örüntüler',['etiketleme makinesi','S M L döngüsü'],true,false],
    ['Denklem Kurma - Fiyat Problemleri',['tur ulaşım tablosu','ücret bilgisi kayıp'],true,true],
    ['Kombinasyon',['kurs ders süreleri tablosu','17 saat kombinasyon'],true,true],
    ['Olasılık',['ocak tuşları','bölme çalışma olasılığı'],true,false]
  ];
  const rows=data.map((d,i)=>{const q=i+1;const nr=d[3]===true;return{id:`osym-2023-tyt-mat-${String(q).padStart(2,'0')}`,provider:'OSYM',providerLabel:'ÖSYM',collection:'2023 TYT Temel Soru Kitapçığı',year:2023,exam:'TYT',subject:'Matematik',topic:d[0],subtopics:d[1],tags:[...d[1],'matematik'],difficulty:'Orta',visual:d[2]===true,questionNo:String(q),answerKey:key[i],sourceKind:'official',priority:100,access:{mode:'official-url',url:O,page:null,pageRange:'Temel Matematik Testi'},verification:{questionNo:'verified',topic:nr?'needs-manual-review-text-extraction-loss':'cross-checked',exactPage:'pending-official-pdf-render',answerKey:'official'}}});
  window.YKSQuestionCatalogV1?.register?.(rows);
  window.__YKS_CATALOG_SEEDS__??=[];window.__YKS_CATALOG_SEEDS__.push(...rows);
})();
