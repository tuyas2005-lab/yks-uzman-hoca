(()=>{
  const O='https://dokuman.osym.gov.tr/pdfdokuman/2025/YKS/TSK/yks_tyt_2025_kitapcik_d250.pdf';
  const key=['A','E','B','C','E','B','E','C','C','D','B','A','C','B','B','A','D','E','E','C','A','D','D','A','D'];
  // data: [prefix, subject, topic, subtopics, alternate?]
  // alternate=true -> track:'alternate-track', trackReason:'din-muafiyeti-felsefe'
  // (Din Kültürü ve Ahlak Bilgisi dersini almak zorunda olmayan/farklı müfredatla alan
  // öğrenciler için 16-20 Din Kültürü sorularının idari alternatifi; aynı öğrenci ikisini
  // birden cevaplamaz. Standart ilerleme sayacına dahil edilmez, ana Mini Test havuzuna
  // varsayılan olarak karışmaz - ama gerçek, bağımsız ÖSYM sorusu olarak kütüphanede saklanır.)
  const data=[
    ['tar','Tarih','İlk Türklerde Töre',['töre','Orta Asya','konargöçer yaşam']],
    ['tar','Tarih','Büyük Selçuklu Devleti - Melikşah Dönemi',['Melikşah','Kavurd Bey','Abbasi halifesi']],
    ['tar','Tarih','Osmanlı Ekonomi Politikaları',['Rami Paşa','dokuma sanayii','ithal ikame']],
    ['tar','Tarih','Millî Mücadele - Kütahya Eskişehir Muharebeleri',['İngiltere Başbakanı','1921','ulusal direniş']],
    ['tar','Tarih','Lozan Barış Konferansı - Batı Trakya',['talimatname','Misakımillî','Türk tezi']],
    ['cog','Coğrafya','Güneş Işınları Geliş Açısı',['sıcaklık dağılışı','ışın geliş açısı']],
    ['cog','Coğrafya','Bitki Örtüsü - İklim Bölgeleri',['bitki topluluğu','orman formasyonu','harita']],
    ['cog','Coğrafya','Nüfusun Dağılışını Etkileyen Faktörler',['nüfus yoğunluğu','harita','numaralı alan']],
    ['cog','Coğrafya','Bölge Türleri - Şekilsel Bölge',['büyükbaş hayvancılık','kültür bölgesi','fonksiyonel bölge']],
    ['cog','Coğrafya','Doğal Afetler - Heyelan',['zemin','arazi eğimi','tabaka uzanışı']],
    ['fel','Felsefe','Zihin Felsefesi - Çin Odası Argümanı',['Searle','yapay zekâ','algoritma']],
    ['fel','Felsefe','Bilgi Felsefesi - Kuşkuculuk',['kuşku','kesinlik','önerme']],
    ['fel','Felsefe','Ahlak Felsefesi - İyi ve Kötü',['kötülük','irade','Sokratik tartışma']],
    ['fel','Felsefe','Bilim Felsefesi - Düşünce Deneyi',['Galileo','Dünya\'nın hareketi','düşünce deneyi']],
    ['fel','Felsefe','Bilgi Felsefesi - Kant',['deneyim','zihinsel kategoriler','a priori']],
    ['din','Din Kültürü ve Ahlak Bilgisi',"İslam'da Bilgi ve Eylem İlişkisi",['Meleklerin Koruyucusu belgeseli','iyilik','bilgiyle sınırlı kalmama']],
    ['din','Din Kültürü ve Ahlak Bilgisi',"İslam'da Temel Haklar ve Özgürlükler",['Hz. Ömer','Eyle emannamesi','can mal inanç dokunulmazlığı']],
    ['din','Din Kültürü ve Ahlak Bilgisi',"Allah'ın Varlığının Delilleri - Gaye ve Nizam",['gaye nizam delili','ayet örnekleri']],
    ['din','Din Kültürü ve Ahlak Bilgisi','Hz. Muhammed’in Örnekliği',['kız çocukları','hadis','toplumsal değer']],
    ['din','Din Kültürü ve Ahlak Bilgisi','Tasavvuf ve İbadet - Sema Töreni',['Mevlevilik','sema','sembolik anlam']],
    ['fel','Felsefe','Mantık - Tümevarımsal Akıl Yürütme Hataları',['yetersiz örnek','hatalı genelleme'],true],
    ['fel','Felsefe','Bilgi Felsefesi - Hume ve Nedensellik',['David Hume','nedensellik ilkesi','zihinsel alışkanlık'],true],
    ['fel','Felsefe','Ahlak Felsefesi - Aristoteles\'te Erdem',['Aristoteles','orta yol','erdem'],true],
    ['fel','Felsefe','İlk Çağ ve Orta Çağ Felsefesi Karşılaştırması',['ontoloji','varlık nedir','doğa nedir'],true],
    ['fel','Felsefe','Çağdaş Felsefe - Nietzsche',['Nietzsche','rasyonalist felsefe eleştirisi','trajik yaşam'],true]
  ];
  const rows=data.map((d,i)=>{
    const q=i+1;
    const alt=d[4]===true;
    const row={id:`osym-2025-tyt-${d[0]}-${String(q).padStart(2,'0')}`,provider:'OSYM',providerLabel:'ÖSYM',collection:'2025 TYT Temel Soru Kitapçığı',year:2025,exam:'TYT',subject:d[1],topic:d[2],subtopics:d[3],tags:[...d[3],'sosyal bilimler'],difficulty:'Orta',visual:(q===7||q===8),questionNo:String(q),answerKey:key[i],sourceKind:'official',priority:100,access:{mode:'official-url',url:O,page:null,pageRange:'Sosyal Bilimler Testi'},verification:{questionNo:'verified',topic:'cross-checked',exactPage:'pending-official-pdf-render',answerKey:'official'}};
    if(alt){row.track='alternate-track';row.trackReason='din-muafiyeti-felsefe';row.priority=50;}
    return row;
  });
  window.YKSQuestionCatalogV1?.register?.(rows);
  window.__YKS_CATALOG_SEEDS__??=[];window.__YKS_CATALOG_SEEDS__.push(...rows);
})();
