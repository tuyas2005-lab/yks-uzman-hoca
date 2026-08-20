(()=>{
  const O='https://dokuman.osym.gov.tr/pdfdokuman/2025/YKS/TSK/yks_tyt_2025_kitapcik_d250.pdf';
  const key=['B','C','B','B','D','A','E','D','B','A','C','D','D','B','C','A','C','E','D','D','B','C','E','C','D','A','C','A','D','B','D','C','B','C','D','E','A','E','E','C'];
  // data: [topic, subtopics]
  // Not: page render edilemedigi icin (bkz. calisma raporu) page:null birakildi; tahmin edilmedi.
  const data=[
    ['Bağlama Göre Sözcük Seçimi',['sözcükte anlam','bağlamdan anlam bulma']],
    ['Söz Öbeğinde Anlam',['parantez içi açıklama','anlam uyuşmazlığı']],
    ['Söz Öbeğinde Anlam',['altı çizili söz','anlam yorumlama']],
    ['Bağlama Göre Sözcük Seçimi',['boşluk doldurma','ifade seçimi']],
    ['Paragrafta Ulaşılamayan Yargı',['numaralanmış cümle','söylenemez','metin yorumu']],
    ['Cümle Birleştirme',['anlamca doğru birleştirme']],
    ['Cümleler Arası Anlam İlişkisi',['anlamca aynı doğrultu','cümle eşdeğerliği']],
    ['Cümlenin Ögeleri',['öge dizilişi','söz dizimi']],
    ['Fiilimsiler',['sıfat-fiil','numaralanmış cümle']],
    ['Sözcükte Yapı - Ekler',['iyelik eki','belirtme durumu eki','tamlayan eki','olumsuz geniş zaman','emir eki']],
    ['Yazım Kuralları - Büyük Harfler',['büyük harf kullanımı']],
    ['Yazım Kuralları',['yazım yanlışı','numaralanmış söz']],
    ['Noktalama İşaretleri',['virgül kullanımı','yanlış kullanım']],
    ['Noktalama İşaretleri',['ayraç içi noktalama','işaret seçimi']],
    ['Anlatım Biçimleri ve Düşünceyi Geliştirme',['tanık gösterme','Yaşar Kemal']],
    ['Paragrafta Düşüncenin Akışı',['akışı bozan cümle']],
    ['Paragrafın Yapısı',['paragrafı ikiye bölme']],
    ['Paragrafta Boşluk Doldurma',['düşünceyi tamamlama','kintsugi']],
    ['Paragrafta Boşluk Doldurma',['düşünceyi tamamlama','olimpiyat rekorları']],
    ['Paragrafta Çıkarım',['kraliçe yaban arıları','ekosistem']],
    ['Paragrafta Çıkarım',['anı oluşumu','protein']],
    ['Paragrafta Çıkarım',['temel atıf hatası','psikoloji']],
    ['Paragrafta Boşluk Doldurma',['diyalog tamamlama','röportaj']],
    ['Paragrafta Çıkarım',['insan zihni','deneyim','genetik']],
    ['Paragrafta Ana Düşünce',['okuma eylemi','us imgelem bellek']],
    ['Paragrafta Çıkarım',['eski dergiler','şaşırtıcı bilgi']],
    ['Paragrafta Değinilmeyen Yargı',['kapı tokmakları','kültürel temsil']],
    ['Paragrafta Ulaşılamayan Yargı',['klasik eserler','duygusal zeka']],
    ['Paragrafta Ulaşılamayan Yargı',['Charlie Chaplin','sinema']],
    ['Paragrafta Değinilmeyen Yargı',['ıslak köpek silkelenmesi','davranış']],
    ['Paragrafta Ulaşılamayan Yargı',['Çin Seddi','tarihî yapı']],
    ['Paragrafta Değinilmeyen Yargı',['Rumeli Hisarı','restorasyon']],
    ['Paragrafta Değinilmeyen Yargı',['Cenne Ulu Camisi','UNESCO']],
    ['Paragrafta Kavram Eşleştirme',['ergenlik','otorite','psikoloji']],
    ['Paragrafta Çıkarım',['Raoul Ubac','resim sanatı']],
    ['Söz Öbeğinde Anlam - Paragraf',['altı çizili ifade','sanat anlayışı']],
    ['Paragrafta Ana Düşünce',['masallar','yerel unsurlar']],
    ['Paragrafta Değinilmeyen Yargı',['masallar','coğrafya']],
    ['Paragrafta Çıkarım',['Damien Hirst','sanat eseri']],
    ['Paragrafta Ulaşılamayan Yargı',['temizlik görevlisi','sanat algısı']]
  ];
  const rows=data.map((d,i)=>{const q=i+1;return{id:`osym-2025-tyt-tur-${String(q).padStart(2,'0')}`,provider:'OSYM',providerLabel:'ÖSYM',collection:'2025 TYT Temel Soru Kitapçığı',year:2025,exam:'TYT',subject:'Türkçe',topic:d[0],subtopics:d[1],tags:[...d[1],'türkçe'],difficulty:'Orta',visual:false,questionNo:String(q),answerKey:key[i],sourceKind:'official',priority:100,access:{mode:'official-url',url:O,page:null,pageRange:'Türkçe Testi'},verification:{questionNo:'verified',topic:'cross-checked',exactPage:'pending-official-pdf-render',answerKey:'official'}}});
  window.YKSQuestionCatalogV1?.register?.(rows);
  window.__YKS_CATALOG_SEEDS__??=[];window.__YKS_CATALOG_SEEDS__.push(...rows);
})();
