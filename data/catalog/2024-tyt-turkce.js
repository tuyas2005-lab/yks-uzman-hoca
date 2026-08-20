(()=>{
  const O='https://dokuman.osym.gov.tr/pdfdokuman/2024/YKS/TSK/yks_tyt_2024_kitapcik_T24kt.pdf';
  const key=['B','A','A','D','B','D','B','C','C','C','E','D','C','B','D','D','A','D','C','C','E','B','E','A','B','B','E','D','C','E','C','A','A','D','E','A','D','E','B','A'];
  const data=[
    ['Söz Öbeğinde Anlam',['parantez içi açıklama','anlam uyuşmazlığı','araştırmacılar']],
    ['Bağlama Göre Sözcük Seçimi',['boşluk doldurma','roman','sanat eseri']],
    ['Söz Öbeğinde Anlam',['altı çizili söz','iyelik eki','yazarın hitap ettiği kitle']],
    ['Söz Öbeğinde Anlam',['deyim açıklaması','göz ile ilgili deyimler']],
    ['Cümleler Arası Anlam İlişkisi',['iki cümle karşılaştırma','eğitim eleştirisi']],
    ['Paragrafta Ulaşılamayan Yargı',['numaralanmış cümle','balık türü','yanlış bilgi']],
    ['Cümleler Arası Anlam İlişkisi',['anlamca aynı doğrultu','gelenek yenilik']],
    ['Cümlenin Ögeleri',['öge dizilişi','söz dizimi']],
    ['Cümle Türleri - Yüklemine Göre',['yüklem türü','fiil cümlesi isim cümlesi','Sinop gezisi']],
    ['Tamlama Türleri',['tamlama türü','numaralanmış tamlama']],
    ['Yazım Kuralları - Büyük Harfler',['büyük harf kullanımı']],
    ['Yazım Kuralları - Birleşik Kelimeler',['bitişik yazım','anlam değişmesi']],
    ['Noktalama İşaretleri',['boşluk doldurma','noktalama işareti seçimi']],
    ['Noktalama İşaretleri',['virgül kullanımı','yanlış kullanım','Yıldırım Bayezid']],
    ['Anlatım Biçimleri ve Düşünceyi Geliştirme',['tanık gösterme','Edison','Pascal']],
    ['Paragrafın Yapısı',['paragrafı ikiye bölme','Gaziantep']],
    ['Paragrafta Düşüncenin Akışı',['akışı bozan cümle','Hipokrat']],
    ['Paragrafta Yardımcı Düşünce',['taşra yalnızlığı','destekleyici düşünce']],
    ['Paragrafta Ana Düşünce',['sistemin geliştirilme amacı','yaya trafik güvenliği']],
    ['Paragrafta Boşluk Doldurma',['düşünceyi tamamlama','atom altı parçacıklar','modern fizik']],
    ['Paragrafta Değinilmeyen Yargı',['yazarla ilgili','Sherlock Homeless','kelime oyunları']],
    ['Paragrafta Yardımcı Düşünce',['Zeuxis','resim sanatı','destekleyici düşünce']],
    ['Paragrafta Değinilen Bilgi',['yapay zekâ','eğitimde değişim']],
    ['Paragrafta Çıkarım',['yönetmen filmleri','gerilim unsuru']],
    ['Paragrafta Çıkarım',['üçüncü şahıs anlatıcı','roman tekniği']],
    ['Paragrafta Çıkarım',['İzmir dokuma imalatı','tekstil tarihi']],
    ['Paragrafta Çıkarım',['özgünlük','maske takmak']],
    ['Paragrafta Ulaşılamayan Yargı',['terimler','sözcük anlamı','bilimsel kavramlar']],
    ['Paragrafta Ulaşılamayan Yargı',['yazarın kendisi','başarı başarısızlık']],
    ['Paragrafta Ulaşılamayan Yargı',['Aristoteles Poetika','edebiyat eleştirisi']],
    ['Paragrafta Değinilmeyen Yargı',['dondurma tarihi','Osmanlı İstanbul']],
    ['Paragrafta Ulaşılamayan Yargı',['günlükler','edebî tür']],
    ['Paragrafta Değinilmeyen Yargı',['Türk sineması','1980 filmleri','mekân']],
    ['Paragrafta Ulaşılamayan Yargı',['Konya Kelebek Bahçesi','turistik mekân']],
    ['Paragrafta Değinilmeyen Yargı',['blues müziği','tarihçe']],
    ['Paragrafta Çıkarım',['blues müziği','Afrika kültürü']],
    ['Paragrafta Ulaşılamayan Yargı',['güneş gülü','etçil bitki']],
    ['Paragrafta Çıkarım',['mühendislik uygulaması','doğadan esinlenme']],
    ['Söz Öbeğinde Anlam - Paragraf',['Gustave Flaubert','okur tipi eleştirisi']],
    ['Paragrafta Çıkarım',['Gustave Flaubert','okurluk üzerine']]
  ];
  const rows=data.map((d,i)=>{const q=i+1;return{id:`osym-2024-tyt-tur-${String(q).padStart(2,'0')}`,provider:'OSYM',providerLabel:'ÖSYM',collection:'2024 TYT Temel Soru Kitapçığı',year:2024,exam:'TYT',subject:'Türkçe',topic:d[0],subtopics:d[1],tags:[...d[1],'türkçe'],difficulty:'Orta',visual:false,questionNo:String(q),answerKey:key[i],sourceKind:'official',priority:100,access:{mode:'official-url',url:O,page:null,pageRange:'Türkçe Testi'},verification:{questionNo:'verified',topic:'cross-checked',exactPage:'pending-official-pdf-render',answerKey:'official'}}});
  window.YKSQuestionCatalogV1?.register?.(rows);
  window.__YKS_CATALOG_SEEDS__??=[];window.__YKS_CATALOG_SEEDS__.push(...rows);
})();
