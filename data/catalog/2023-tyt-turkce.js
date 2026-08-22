(()=>{
  const O='https://dokuman.osym.gov.tr/pdfdokuman/2023/YKS/TSK/yks_tyt_2023_kitapcik_T23ky.pdf';
  const key=['E','A','E','D','A','D','D','B','C','C','D','C','A','C','A','E','B','D','E','C','D','E','A','E','A','B','D','C','B','A','A','C','B','B','D','B','E','D','E','B'];
  // 22 Agustos 2026: access.page GERCEK PDF sayfa numarasiyla (resmi PDF gorsel
  // olarak PyMuPDF ile render edilip 40/40 soru piksel duzeyinde incelendi)
  // dolduruldu. verification.exactPage 'pending-official-pdf-render' -> 'verified-
  // visual-qa-pass-2026-08-22' olarak guncellendi. ID/year/exam/subject/topic/
  // subtopics/answerKey/questionNo DEGISTIRILMEDI. Crop koordinatlari
  // app-source-map-2023-tyt-turkce.js dosyasinda GORSEL PASS almis halde tanimli.
  const pageMap={1:3,2:3,3:3,4:3,5:4,6:4,7:4,8:5,9:5,10:5,11:5,12:5,13:6,14:6,15:6,16:6,17:7,18:7,19:7,20:7,21:8,22:8,23:8,24:9,25:9,26:9,27:9,28:10,29:10,30:11,31:11,32:11,33:12,34:12,35:13,36:13,37:14,38:14,39:15,40:15};
  const data=[
    ['Bağlama Göre Sözcük Seçimi',['gerçekçi olmak','beklenti','cümle tamamlama']],
    ['Çok Anlamlılık',['açmak basamak çekmek','sözcüğün farklı anlamı']],
    ['Söz Öbeğinde Anlam',['altı çizili söz','Halide Edip','edebiyat tarihi']],
    ['Cümle Yorumu',['tohum benzetmesi','toplumsal fayda']],
    ['Cümle Yorumu',['masal dinlememiş çocuklar','hayal gücü']],
    ['Paragrafta Ulaşılamayan Yargı',['plasebo','numaralanmış cümle','söylenemez']],
    ['Cümle Birleştirme',['iki cümlenin birleştirilmesi','şair mazmun']],
    ['Cümlenin Ögeleri',['yer tamlayıcısı','isim tamlaması','sıfat tamlaması','numaralanmış cümle']],
    ['Fiilimsiler',['isim-fiil sıfat-fiil zarf-fiil','okyanus ısınması']],
    ['Ses Olayları',['ünsüz benzeşmesi','ünlü düşmesi','ünsüz yumuşaması']],
    ['Yazım Kuralları',['numaralanmış söz','yazım yanlışı','Tanpınar romanı']],
    ['Yazım Kuralları',['altı çizili sözcük','yazım yanlışı']],
    ['Noktalama İşaretleri',['parantez içi boşluk','noktalama işareti seçimi']],
    ['Noktalama İşaretleri',['üç nokta kullanımı','kural örneği']],
    ['Anlatım Biçimleri ve Düşünceyi Geliştirme',['öneride bulunma','koşul öne sürme','tanımlama']],
    ['Paragrafta Düşüncenin Akışı',['akışı bozan cümle','kedi mırlaması']],
    ['Paragrafın Yapısı',['iki paragrafa ayırma','Paul ve Virginie']],
    ['Paragrafın Yapısı',['cümle yerleştirme','Roma harita yapımı']],
    ['Paragrafta Boşluk Doldurma',['düşünceyi tamamlama','dergi kapağı']],
    ['Paragrafta Çıkarım',['Tanpınar','Bursa\'da Zaman','şiir deneme']],
    ['Paragrafta Çıkarım',['film karakteri','göçmenlik']],
    ['Paragrafta Yardımcı Düşünce',['doğa','modern insan','destekleyici düşünce']],
    ['Paragrafta Boşluk Doldurma',['gazeteci yazar diyaloğu','röportaj']],
    ['Paragrafta Ana Sorun',['Yaşar Kemal','Fakir Baykurt','edebi kuşak']],
    ['Paragrafta Ana Düşünce',['fincan alma','beyin işlemi']],
    ['Paragrafta Çıkarım',['ters simya','bilişsel çarpıtma']],
    ['Paragrafta Çıkarım',['halk anlatıları','kültürden kültüre değişim']],
    ['Paragrafta Ulaşılamayan Yargı',['maskelenmiş depresyon','ulaşılamaz']],
    ['Paragrafta Değinilmeyen Yargı',['dijital amnezi','etkilerinden değil']],
    ['Paragrafta Değinilmeyen Yargı',['kitabevi tercihi','etkili değil']],
    ['Paragrafta Değinilmeyen Yargı',['etkileyici pazarlama','değinilmemiştir']],
    ['Paragrafta Örnekleme',['stres yönetimi öneriler','örnek gösterilemez']],
    ['Paragrafta Ulaşılamayan Yargı',['beyin','gerçeklik inşası']],
    ['Paragrafta Ulaşılamayan Yargı',['Alice Harikalar Diyarında','yazarın okuma deneyimi']],
    ['Söz Öbeğinde Anlam - Paragraf',['kelebek düşü paradoksu','Zhaung Tzu']],
    ['Paragrafta Çıkarım',['Puslu Kıtalar Atlası','düş gerçeklik']],
    ['Paragrafta Çıkarım',['Eyfel Kulesi','estetik değer']],
    ['Paragrafta Ulaşılamayan Yargı',['sanat','işlevsellik','söylemesi beklenmez']],
    ['Paragrafta Çıkarım',['Galen','kişilik tipleri']],
    ['Paragrafta Değinilmeyen Yargı',['Galen','duygu aşırılığı','değinilmemiştir']]
  ];
  const rows=data.map((d,i)=>{const q=i+1;return{id:`osym-2023-tyt-tur-${String(q).padStart(2,'0')}`,provider:'OSYM',providerLabel:'ÖSYM',collection:'2023 TYT Temel Soru Kitapçığı',year:2023,exam:'TYT',subject:'Türkçe',topic:d[0],subtopics:d[1],tags:[...d[1],'türkçe'],difficulty:'Orta',visual:false,questionNo:String(q),answerKey:key[i],sourceKind:'official',priority:100,access:{mode:'official-url',url:O,page:pageMap[q],pageRange:'Türkçe Testi'},verification:{questionNo:'verified',topic:'cross-checked',exactPage:'verified-visual-qa-pass-2026-08-22',answerKey:'official'}}});
  window.YKSQuestionCatalogV1?.register?.(rows);
  window.__YKS_CATALOG_SEEDS__??=[];window.__YKS_CATALOG_SEEDS__.push(...rows);
})();
