(()=>{
  const O='https://dokuman.osym.gov.tr/pdfdokuman/2024/YKS/TSK/yks_tyt_2024_kitapcik_T24kt.pdf';
  const key=['A','E','A','D','C','B','D','A','C','B','E','A','E','B','D','A','C','C','B','D','E','C','B','A','C','B','E','B','E','B'];
  // data: [topic, subtopics, visual, needsReview?]
  // needsReview=true: soru kokunde kritik matematiksel tanim/veri/tablo PDF text-extraction'da
  // kayboldu (bkz. calisma raporu). Soru metni/deger/cevap tahmin edilmedi; topic en yakin
  // makul tahmindir.
  const data=[
    ['Rasyonel Sayılar',['sayı gruplandırma','toplamı 1'],false,false],
    ['Yüzde Problemleri',['mobil uygulama','harcama kategorisi','grafik'],true,false],
    ['Sayı Örüntüleri',['mandal oyuncağı','adım sayısı'],true,false],
    ['Rasyonel Sayılar',['su damlayan not','b sayısı olamaz'],false,true],
    ['Rasyonel Sayılar',['irrasyonel sayı seçme','gerçel sayı']],
    ['Mutlak Değer',['dergi sayfa sayısı tahmin','en yakın en uzak']],
    ['Bölme-Bölünebilme',['elma kasaları','kalan','tek-çift mantığı']],
    ['Eşitsizlikler',['beyaz eşya maliyet fiyatı','kâr zarar']],
    ['Sayı Basamakları',['termometre','sıcaklık ölçeği'],true,true],
    ['Kümeler',['A B kümesi','eleman toplamı farkı çarpımı'],false,true],
    ['Mantık',['uçak bileti','önermeler']],
    ['Fonksiyonlar ve Grafik',['f g h fonksiyonları','grafik karşılaştırma'],true,false],
    ['Sayı Basamakları',['tombala kartı','satır toplamı'],true,true],
    ['Bölünebilme ve Çarpanlar',['A B C rakamları','3 ile bölünebilme']],
    ['Sayı Basamakları',['bitişik sayı tanımı','basamak ilişkisi']],
    ['İstatistik',['medyan','aritmetik ortalama','veri grubu']],
    ['Sayı Örüntüleri',['yürüyüş planı','artan azalan süre']],
    ['Denklem Kurma - Uzunluk',['merdiven basamağı','kedi yüksekliği'],true,false],
    ['Yüzde Problemleri',['telefon görüşme kaydı','yüzde hesabı'],true,false],
    ['Yaş Problemleri',['şirket kuruluş yılı','sektörde geçirilen süre']],
    ['Mantıksal Sayma Problemleri',['sınav puanları','soru cevaplama sayısı']],
    ['Formülle Problem Çözme',['vücut kitle indeksi','tablo','boy hesabı'],true,false],
    ['Grafik Problemleri',['fabrika üretim alanı','daire ve sütun grafik'],true,false],
    ['Doğru Orantı ve Denklem',['geri dönüşüm kutusu','şişe kütlesi oranı']],
    ['Kombinasyon',['tenis turnuvası','hakem görevlendirme']],
    ['Mantıksal Sayma Problemleri',['dosya klasörü','boyut tarih sıralama'],true,false],
    ['Kesir ve Sayma Problemleri',['banyo duvarı fayans','oran'],true,false],
    ['Mantık',['top numaraları','diyalog mantığı']],
    ['Kombinasyon',['üç kişilik grup','Duru bulunmayan grup']],
    ['Olasılık',['kargo paketi','beklenen sayıda alma']]
  ];
  const rows=data.map((d,i)=>{const q=i+1;const nr=d[3]===true;return{id:`osym-2024-tyt-mat-${String(q).padStart(2,'0')}`,provider:'OSYM',providerLabel:'ÖSYM',collection:'2024 TYT Temel Soru Kitapçığı',year:2024,exam:'TYT',subject:'Matematik',topic:d[0],subtopics:d[1],tags:[...d[1],'matematik'],difficulty:'Orta',visual:d[2]===true,questionNo:String(q),answerKey:key[i],sourceKind:'official',priority:100,access:{mode:'official-url',url:O,page:null,pageRange:'Temel Matematik Testi'},verification:{questionNo:'verified',topic:nr?'needs-manual-review-text-extraction-loss':'cross-checked',exactPage:'pending-official-pdf-render',answerKey:'official'}}});
  window.YKSQuestionCatalogV1?.register?.(rows);
  window.__YKS_CATALOG_SEEDS__??=[];window.__YKS_CATALOG_SEEDS__.push(...rows);
})();
