(()=>{
  const O='https://dokuman.osym.gov.tr/pdfdokuman/2023/YKS/TSK/yks_tyt_2023_kitapcik_T23ky.pdf';
  const key=['E','C','A','B','D','B','A','C','E','D','B','B','B','D','C','A','B','E','C','C','D','E','B','E','D'];
  // data: [prefix, subject, topic, subtopics, visual, needsReview, alternate]
  const data=[
    ['tar','Tarih','İlk Türklerde Töre',['Mete Han','Kapgan Kağan','Moyen-Çor','hâkimiyet anlayışı']],
    ['tar','Tarih','Büyük Selçuklu Devleti - Kuruluş Dönemi',['Beyhakî','Gazneli Mesud','Dandanakan Savaşı']],
    ['tar','Tarih','Tanzimat Fermanı ve Avrupa Devletleri',['Metternich','Fransa İngiltere','büyük devletler dengesi']],
    ['tar','Tarih','Millî Mücadele Hazırlık Dönemi',['Kâzım Karabekir','21 Mayıs 1919 telgrafı']],
    ['tar','Tarih','Lozan Barış Konferansı - Türk Heyetinin Duruşu',['İsmet Paşa','Mudanya','savaşı kazanmış devlet']],
    ['cog','Coğrafya','İklim Tipleri',['sıcaklık yağış grafiği','meteoroloji istasyonu'],true,true],
    ['cog','Coğrafya','Dış Kuvvetler - Peribacası ve Kırgıbayır',['dönemlik akarsu','bitki örtüsü zayıflığı']],
    ['cog','Coğrafya','Nüfus Piramidi ve Demografik Yapı',['dört ülke karşılaştırma','doğurganlık oranı'],true,true],
    ['cog','Coğrafya','Bölge Türleri - İşlevsel Bölge',['merkezden yönetilen bölge','mekânsal organizasyon']],
    ['cog','Coğrafya','Doğal Afetler - Erozyon',['A horizonu','nöbetleşe ekim','aşırı otlatma']],
    ['fel','Felsefe','Felsefenin Doğası ve Özellikleri',['ebedî sohbet','mutlak sonuç içermeme']],
    ['fel','Felsefe','Zihin Felsefesi - Yapay Zeka ve Bilinç',['Bıçak Sırtı filmi','replika','bilinçli zihinsellik']],
    ['fel','Felsefe','Özgür İrade ve Kader',['doktor muayenesi','yazgı','irade']],
    ['fel','Felsefe','İslam Felsefesi - Gazali ve İbn Rüşd',['mucize','akıl vahiy','doğa yasaları']],
    ['fel','Felsefe','Bilgi Felsefesi - Empirizm Eleştirisi',['mavinin eksik tonu','doğuştan tasarım']],
    ['din','Din Kültürü ve Ahlak Bilgisi','Hz. Muhammed’in Örnekliği',['Ahzab 33:21','taklit örnek ayrımı','terlik']],
    ['din','Din Kültürü ve Ahlak Bilgisi','İslam İnanç Esasları',['Nisa 4:150-152','peygamberler arası ayrım yapmama']],
    ['din','Din Kültürü ve Ahlak Bilgisi','İslam\'da Hüküm Verme ve Toplumsal Uyum',['kurban eti saklama','yoksulluk refah dönemi']],
    ['din','Din Kültürü ve Ahlak Bilgisi','İslam Mezheplerinin Ortaya Çıkışı',['otorite eksikliği','Kur\'an nüshaları','siyasi sorunlar']],
    ['din','Din Kültürü ve Ahlak Bilgisi','İslam Ahlakı - Ahlaki Değerler',['tövbe','Gazali','günah hesaplaşması']],
    ['fel','Felsefe','Sanat Felsefesi - Estetik ve Kültürel Rölativizm',['beğeni yargısı','bireysel birey üstü'],false,false,true],
    ['fel','Felsefe','İlk Çağ Felsefesi Problemleri',['Anaksimenes','arke','ruh öğretisi'],false,false,true],
    ['fel','Felsefe','Bilgi Felsefesi - Spinoza',['17. yüzyıl akılsallık','geometrik yöntem','Etika'],false,false,true],
    ['fel','Felsefe','Ahlak Felsefesi - Kant\'ın Ödev Etiği',['üç maksim','evrensel yasa','ödev bilinci'],false,false,true],
    ['fel','Felsefe','Çağdaş Felsefe - Nietzsche',['Böyle Buyurdu Zerdüşt','değer yaratma'],false,false,true]
  ];
  const rows=data.map((d,i)=>{
    const q=i+1;
    const vis=d[4]===true;
    const nr=d[5]===true;
    const alt=d[6]===true;
    const row={id:`osym-2023-tyt-${d[0]}-${String(q).padStart(2,'0')}`,provider:'OSYM',providerLabel:'ÖSYM',collection:'2023 TYT Temel Soru Kitapçığı',year:2023,exam:'TYT',subject:d[1],topic:d[2],subtopics:d[3],tags:[...d[3],'sosyal bilimler'],difficulty:'Orta',visual:vis,questionNo:String(q),answerKey:key[i],sourceKind:'official',priority:100,access:{mode:'official-url',url:O,page:null,pageRange:'Sosyal Bilimler Testi'},verification:{questionNo:'verified',topic:nr?'needs-manual-review-text-extraction-loss':'cross-checked',exactPage:'pending-official-pdf-render',answerKey:'official'}};
    if(alt){row.track='alternate-track';row.trackReason='din-muafiyeti-felsefe';row.priority=50;}
    return row;
  });
  window.YKSQuestionCatalogV1?.register?.(rows);
  window.__YKS_CATALOG_SEEDS__??=[];window.__YKS_CATALOG_SEEDS__.push(...rows);
})();
