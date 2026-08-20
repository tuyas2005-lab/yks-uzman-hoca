(()=>{
  const O='https://dokuman.osym.gov.tr/pdfdokuman/2024/YKS/TSK/yks_tyt_2024_kitapcik_T24kt.pdf';
  const key=['D','E','E','C','B','B','C','A','D','C','B','D','D','E','B','A','C','E','D','A','E','A','C','C','A'];
  // data: [prefix, subject, topic, subtopics, visual, alternate?]
  const data=[
    ['tar','Tarih','Hun Devleti - Roma İlişkileri',['Attila','Anatolios Antlaşması','savaş tazminatı'],false],
    ['tar','Tarih','Türkiye Selçukluları - Yassıçemen Savaşı',['Alâeddin Keykubad','Harzemşahlar','Ahlat kuşatması'],false],
    ['tar','Tarih','Osmanlı Ekonomi Politikaları',['Ferhat Paşa Antlaşması','Safeviler','ham ipek ticareti'],false],
    ['tar','Tarih','Millî Mücadele Hazırlık Dönemi',['Denizli Müftüsü','İzmir işgali','direniş çağrısı'],false],
    ['tar','Tarih','1921 Anayasası ve Millî Egemenlik',['Lozan Konferansı','Refet Paşa','TBMM kararı'],false],
    ['cog','Coğrafya','Atmosferin Yapısı ve Etkileri',['gaz bileşenleri','güneş enerjisi','gök taşları']],
    ['cog','Coğrafya','Bitki Örtüsü - İklim Bölgeleri',['yükselti basamağı','bitki dağılışı','harita'],true],
    ['cog','Coğrafya','Nüfus Piramidi ve Demografik Yapı',['iki ülke karşılaştırma','çalışma çağı nüfusu','ortanca yaş'],true],
    ['cog','Coğrafya','Bölge Türleri - Şekilsel Bölge',['harita','kırmızı renkli alan','çöl bölgesi'],true],
    ['cog','Coğrafya','Doğal Afetler - Heyelan',['kütle hareketi','su baskını','çığ']],
    ['fel','Felsefe','Tarih Felsefesi - Hegel',['Hukuk Felsefesinin Prensipleri','Minerva\'nın baykuşu']],
    ['fel','Felsefe','Bilim Felsefesi - Bilimin Toplumsal Bağlamı',['Oppenheimer filmi','bilimsel bilginin niteliği']],
    ['fel','Felsefe','Ahlak Felsefesi - İyi ve Kötü',['Martha Nussbaum','İyiliğin Kırılganlığı','tragedya']],
    ['fel','Felsefe','Din Felsefesi - Tanrı Kanıtlamaları',['Anselmus','ontolojik kanıt','diyalog']],
    ['fel','Felsefe','Bilgi Felsefesi - Locke',['birincil nitelik','ikincil nitelik','epistemoloji']],
    ['din','Din Kültürü ve Ahlak Bilgisi','İslam İnanç Esasları',['hür irade','sadelik','korku ümit']],
    ['din','Din Kültürü ve Ahlak Bilgisi','İslam\'da Bilgi Edinme Yolları',['selim akıl','sadık haber','salim duyu']],
    ['din','Din Kültürü ve Ahlak Bilgisi','İslam Ahlakı - Ahlaki Değerler',['Hz. Mevlana','itidal','tevazu']],
    ['din','Din Kültürü ve Ahlak Bilgisi','Kur\'an Ayetleri Yorumu',['ahiret inancı','yaratılış','Rum suresi']],
    ['din','Din Kültürü ve Ahlak Bilgisi','Hz. Muhammed’in Örnekliği',['gençlerin iman etmesi','anne baba hakkı']],
    ['fel','Felsefe','Dil Felsefesi',['semantik','anlam bilimi','felsefe sorusu'],false,true],
    ['fel','Felsefe','Bilgi Felsefesi - Numen ve Fenomen',['kiraz ağacı','algı','öznellik nesnellik'],false,true],
    ['fel','Felsefe','İlk Çağ Felsefesi Problemleri',['doğa filozofları','Platon','idealar'],false,true],
    ['fel','Felsefe','Bilgi Felsefesi - Spinoza',['Eukleides Elementler','geometrik yöntem','Etika'],false,true],
    ['fel','Felsefe','Tarih Felsefesi - Dilthey',['tarihsellik','rüzgârgülü benzetmesi'],false,true]
  ];
  const rows=data.map((d,i)=>{
    const q=i+1;
    const vis=d[4]===true;
    const alt=d[5]===true;
    const row={id:`osym-2024-tyt-${d[0]}-${String(q).padStart(2,'0')}`,provider:'OSYM',providerLabel:'ÖSYM',collection:'2024 TYT Temel Soru Kitapçığı',year:2024,exam:'TYT',subject:d[1],topic:d[2],subtopics:d[3],tags:[...d[3],'sosyal bilimler'],difficulty:'Orta',visual:vis,questionNo:String(q),answerKey:key[i],sourceKind:'official',priority:100,access:{mode:'official-url',url:O,page:null,pageRange:'Sosyal Bilimler Testi'},verification:{questionNo:'verified',topic:'cross-checked',exactPage:'pending-official-pdf-render',answerKey:'official'}};
    if(alt){row.track='alternate-track';row.trackReason='din-muafiyeti-felsefe';row.priority=50;}
    return row;
  });
  window.YKSQuestionCatalogV1?.register?.(rows);
  window.__YKS_CATALOG_SEEDS__??=[];window.__YKS_CATALOG_SEEDS__.push(...rows);
})();
