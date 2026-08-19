(()=>{
  const O='https://dokuman.osym.gov.tr/pdfdokuman/2026/YKS/TSK/yks_tyt_2026_kitapcik_d350.pdf';
  const M='https://ilgaz.meb.gov.tr/meb_iys_dosyalar/2026_06/6a3a22d27eaf0404587806_yks_tyt_2026_kitapcik_d350.pdf';
  const key=['B','A','E','E','A','C','B','B','E','B','C','E','C','B','E','A','C','D','A','C','B','B','C','E','A','D','A','D','D','E','C','E','C','A','D','B','D','B','D','C'];
  const data=[
    ['Bağlama Göre Sözcük Seçimi',['sözcükte anlam','boşluk doldurma']],
    ['Sözcük ve Söz Öbeklerinde Anlam',['bağlam','anlam uyuşmazlığı']],
    ['Söz Öbeğinde Anlam',['mecaz','çıkarım','birikim']],
    ['Çok Anlamlılık',['sözcüğün cümledeki anlamı']],
    ['Cümle Yorumu',['numaralanmış cümleler','çıkarım']],
    ['Cümleler Arası Anlam İlişkisi',['neden-sonuç','karşıtlık','çıkarım']],
    ['Cümle Birleştirme',['anlamca doğru birleştirme']],
    ['Sözcükte Yapı - İyelik Eki',['iyelik eki','çekim eki']],
    ['Fiilimsiler',['isim-fiil','sıfat-fiil','zarf-fiil']],
    ['Cümlenin Ögeleri',['öge dizilişi','söz dizimi']],
    ['Yazım Kuralları - Birleşik Kelimeler',['birleşik kelimeler','ayrı yazım']],
    ['Yazım Kuralları - Büyük Harfler',['büyük harf kullanımı']],
    ['Noktalama İşaretleri',['noktalama','işaret seçimi']],
    ['Noktalama İşaretleri',['noktalama','yanlış kullanım']],
    ['Anlatım Biçimleri ve Düşünceyi Geliştirme',['betimleme','örneklendirme','karşılaştırma','tanık gösterme']],
    ['Paragrafta Düşüncenin Akışı',['akışı bozan cümle']],
    ['Paragrafın Yapısı',['paragrafı ikiye bölme']],
    ['Paragrafta Ana Düşünce',['okuma hızı','göz ve beyin']],
    ['Paragrafta Çıkarım',['gelenek','şakalaşma','toplumsal değişim']],
    ['Anlatım Tekniği',['düz piramit','haber metni']],
    ['Paragrafta Ana Düşünce',['sanat','yorum','müzik']],
    ['Paragrafta Ana Düşünce',['yaşam','yolculuk metaforu']],
    ['Paragrafta Yardımcı Düşünce',['başarı','azim','deneyim']],
    ['Paragrafta Ana Düşünce',['toplumsal dayanışma','örnek olay']],
    ['Paragrafta Ana Düşünce',['iletişim araçları','mesaj','dijital medya']],
    ['Paragrafı Özetleme',['slogan','sıfır atık']],
    ['Paragrafta Ana Sorun',['günlük','içtenlik','zamanında yazma']],
    ['Paragrafta Yardımcı Düşünce',['lokal uyku','bilgilendirici metin']],
    ['Paragrafta Çıkarım',['ressam','sanat anlayışı','ilham']],
    ['Paragrafta Çıkarım',['hibrit zekâ','yapay zekâ','belirsizlik']],
    ['Paragrafta Eleştiri',['modern şiir','dijitalleşme','edebiyat']],
    ['Paragrafta Ulaşılamayan Yargı',['ressam','portre','izlenimcilik']],
    ['Paragrafta Değinilmeyen Yargı',['Alaca Cami','duvar bezeme','sanat']],
    ['Paragrafta Değinilmeyen Yargı',['uzay araştırması','ikizler deneyi']],
    ['Paragrafta Yazarın Tutumu',['öykü','açık uçluluk','okur']],
    ['Söz Öbeğinde Anlam - Paragraf',['hayal etme hakkı','okur katılımı']],
    ['Paragrafta Açıklanan Durum',['çalışma belleği','bilişsel yük']],
    ['Paragrafta Ulaşılamayan Yargı',['çalışma belleği','dikkat']],
    ['Paragrafta Çıkarım',['akış hâli','odaklanma']],
    ['Paragrafta Örnekleme',['akış hâli','deneyim eşleştirme']]
  ];
  const page=n=>n<=4?2:n<=6?3:n<=9?4:n<=13?5:n<=17?6:n<=19?7:n<=21?8:n<=23?9:n<=25?10:n<=29?11:n<=33?12:n<=36?13:n<=38?14:15;
  const rows=data.map((d,i)=>{const q=i+1;return{id:`osym-2026-tyt-tur-${String(q).padStart(2,'0')}`,provider:'OSYM',providerLabel:'ÖSYM',collection:'2026 TYT Temel Soru Kitapçığı',year:2026,exam:'TYT',subject:'Türkçe',topic:d[0],subtopics:d[1],tags:[...d[1],'türkçe'],difficulty:q<=14?'Orta':'Orta-Zor',visual:false,questionNo:String(q),answerKey:key[i],sourceKind:'official',priority:100,access:{mode:'official-url',url:O+'#page='+page(q),mirrorUrl:M+'#page='+page(q),page:page(q)}}});
  window.YKSQuestionCatalogV1?.register?.(rows);
  window.__YKS_CATALOG_SEEDS__??=[];window.__YKS_CATALOG_SEEDS__.push(...rows);
})();
