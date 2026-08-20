(()=>{
  const O='https://dokuman.osym.gov.tr/pdfdokuman/2023/YKS/TSK/yks_tyt_2023_kitapcik_T23ky.pdf';
  const key=['E','A','E','D','A','D','D','B','C','C','D','C','A','C','A','E','B','D','E','C','D','E','A','E','A','B','D','C','B','A','A','C','B','B','D','B','E','D','E','B'];
  const data=[
    ['Bağlama Göre Sözcük Seçimi',['gerçekçi olmak','beklenti','cümle tamamlama']],
    ['Çok Anlamlılık',['açmak basamak çekmek','sözcüğün farklı anlamı']],
    ['Söz Öbeğinde Anlam',['altı çizili söz','Halide Edip','edebiyat tarihi']],
    ['Cümle Yorumu',['tohum benzetmesi','toplumsal fayda']],
    ['Cümle Yorumu',['masal dinlememiş çocuklar','hayal gücü']],
    ['Paragrafta Ulaşılamayan Yargı',['plasebo','numaralanmış cümle','söylenemez']],
    ['Cümle Birleştirme',['iki cümlenin birleştirilmesi','şair mazmun']],
    ['Tamlama Türleri',['yer tamlayıcısı','numaralanmış cümle']],
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
  const rows=data.map((d,i)=>{const q=i+1;return{id:`osym-2023-tyt-tur-${String(q).padStart(2,'0')}`,provider:'OSYM',providerLabel:'ÖSYM',collection:'2023 TYT Temel Soru Kitapçığı',year:2023,exam:'TYT',subject:'Türkçe',topic:d[0],subtopics:d[1],tags:[...d[1],'türkçe'],difficulty:'Orta',visual:false,questionNo:String(q),answerKey:key[i],sourceKind:'official',priority:100,access:{mode:'official-url',url:O,page:null,pageRange:'Türkçe Testi'},verification:{questionNo:'verified',topic:'cross-checked',exactPage:'pending-official-pdf-render',answerKey:'official'}}});
  window.YKSQuestionCatalogV1?.register?.(rows);
  window.__YKS_CATALOG_SEEDS__??=[];window.__YKS_CATALOG_SEEDS__.push(...rows);
})();
