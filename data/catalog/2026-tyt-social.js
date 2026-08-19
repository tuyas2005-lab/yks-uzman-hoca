(()=>{
  const O='https://dokuman.osym.gov.tr/pdfdokuman/2026/YKS/TSK/yks_tyt_2026_kitapcik_d350.pdf';
  const M='https://ilgaz.meb.gov.tr/meb_iys_dosyalar/2026_06/6a3a22d27eaf0404587806_yks_tyt_2026_kitapcik_d350.pdf';
  const base=(id,subject,topic,subtopics,tags,difficulty,visual,questionNo,page,answerKey)=>({id,provider:'OSYM',providerLabel:'ÖSYM',collection:'2026 TYT Temel Soru Kitapçığı',year:2026,exam:'TYT',subject,topic,subtopics,tags,difficulty,visual,questionNo:String(questionNo),answerKey,sourceKind:'official',priority:100,access:{mode:'official-url',url:O+'#page='+page,mirrorUrl:M+'#page='+page,page}});
  const rows=[
    base('osym-2026-tyt-tar-01','Tarih','İlk Türklerde Bozkır Kültürü',['konargöçer yaşam','atlı kültür','coğrafyanın kültüre etkisi'],['ilk türkler','bozkır kültürü','konargöçer'],'Orta',false,1,16,'C'),
    base('osym-2026-tyt-tar-02','Tarih','Türk-İslam Devletlerinde Yönetim',['melik','merkez-taşra ilişkisi','hâkimiyet alametleri'],['türk islam devletleri','melik','yönetim'],'Orta',false,2,16,'E'),
    base('osym-2026-tyt-tar-03','Tarih','Osmanlı Toplum ve Ekonomisi - Vakıf',['vakıf','vakfiye','mütevelli','sosyal yardım'],['osmanlı','vakıf','sosyal yapı'],'Orta',false,3,16,'A'),
    base('osym-2026-tyt-tar-04','Tarih','Millî Mücadele Hazırlık Dönemi',['mustafa kemal','havza','işgaller','millî bağımsızlık'],['milli mücadele','havza','işgal'],'Orta',false,4,16,'E'),
    base('osym-2026-tyt-tar-05','Tarih','1921 Anayasası ve Millî Egemenlik',['teşkilat-ı esasiye','millî egemenlik','tbmm'],['1921 anayasası','milli egemenlik','tbmm'],'Orta',false,5,17,'B'),

    base('osym-2026-tyt-cog-06','Coğrafya','İklim Tipleri',['sıcaklık-yağış grafiği','iklim özellikleri'],['iklim','grafik','sıcaklık','yağış','şekilli'],'Orta',true,6,17,'A'),
    base('osym-2026-tyt-cog-07','Coğrafya','İç Kuvvetler - Volkanizma',['volkanik yer şekilleri','dünya dağılışı'],['volkanizma','yer şekilleri','harita','şekilli'],'Orta',true,7,17,'C'),
    base('osym-2026-tyt-cog-08','Coğrafya','Nüfusun Dağılışı',['seyrek nüfus','sıcaklık','su kıtlığı','dünya nüfusu'],['nüfus','çöl','harita','şekilli'],'Orta',true,8,17,'E'),
    base('osym-2026-tyt-cog-09','Coğrafya','Bölgeler ve Bölge Sınırları',['işlevsel bölge','yönetsel bölge','bölge sınırlarının değişimi'],['bölge','yönetsel bölge'],'Kolay-Orta',false,9,18,'D'),
    base('osym-2026-tyt-cog-10','Coğrafya','Afet Yönetimi',['risk yönetimi','kriz yönetimi','afet öncesi hazırlık'],['afet','risk yönetimi','bilinçlendirme'],'Orta',false,10,18,'D'),

    base('osym-2026-tyt-fel-11','Felsefe','Felsefi Düşüncenin Özellikleri',['kavramsal sorgulama','öz-ilinek ayrımı','felsefi düşünce'],['felsefe','kavramsal düşünme'],'Orta',false,11,18,'A'),
    base('osym-2026-tyt-fel-12','Felsefe','Zihin Felsefesi ve Turing Testi',['düşünme','davranışçılık','turing testi'],['turing','zihin felsefesi','düşünme'],'Orta',false,12,19,'C'),
    base('osym-2026-tyt-fel-13','Felsefe','Özgürlük Problemi - Determinizm',['determinizm','özgür irade','belirlenimcilik'],['determinizm','özgür irade'],'Orta',false,13,19,'C'),
    base('osym-2026-tyt-fel-14','Felsefe','İlk Çağ Felsefesi Problemleri',['arkhe','değişim','bilgi','varlık'],['ilk çağ felsefesi','arkhe','herakleitos','aristoteles'],'Orta',false,14,19,'B'),
    base('osym-2026-tyt-fel-15','Felsefe','Bergson - Zaman ve Süre',['süre','zaman','hareket','oluş'],['bergson','zaman','süre'],'Orta-Zor',false,15,20,'C'),

    base('osym-2026-tyt-din-16','Din Kültürü ve Ahlak Bilgisi','İman ve İrade',['iman','kalp ile tasdik','zorlama','ammar bin yasir'],['iman','irade','tasdik'],'Orta',false,16,20,'C'),
    base('osym-2026-tyt-din-17','Din Kültürü ve Ahlak Bilgisi','İslam’da Bilgi ve Sorumluluk',['doğru bilgi','haber doğrulama','bilgi-amel ilişkisi'],['bilgi','sorumluluk','ayet'],'Orta',false,17,21,'E'),
    base('osym-2026-tyt-din-18','Din Kültürü ve Ahlak Bilgisi','Hz. Muhammed’in Örnekliği',['hılfül-fudul','adalet','kul hakkı'],['hz muhammed','adalet','hılfül fudul'],'Orta',false,18,21,'B'),
    base('osym-2026-tyt-din-19','Din Kültürü ve Ahlak Bilgisi','Allah-İnsan ve Evren İlişkisi',['nimet','yaratılış','evrendeki düzen'],['allah insan evren','nimet','ayet'],'Kolay-Orta',false,19,21,'A'),
    base('osym-2026-tyt-din-20','Din Kültürü ve Ahlak Bilgisi','İslam Düşüncesinde Yorum Farklılıkları',['coğrafi sebepler','kültürel sebepler','sosyal sebepler','kişisel sebepler'],['yorum farklılıkları','din anlayışı'],'Orta',false,20,22,'D'),

    base('osym-2026-tyt-fel-alt-21','Felsefe','Ruh-Beden Problemi',['ruh','beden','ölümsüzlük','yunus emre'],['ruh beden','varlık felsefesi'],'Orta',false,21,22,'D'),
    base('osym-2026-tyt-fel-alt-22','Felsefe','Orta Çağ Felsefesi - Akıl ve İnanç',['aquinalı thomas','akıl-inanç ilişkisi','bilgi'],['orta çağ felsefesi','thomas aquinas','akıl','inanç'],'Orta',false,22,23,'E'),
    base('osym-2026-tyt-fel-alt-23','Felsefe','Descartes ve Yöntemsel Şüphe',['duyu bilgisi','şüphe','algı yanılması'],['descartes','şüphe','duyu'],'Orta',false,23,23,'E'),
    base('osym-2026-tyt-fel-alt-24','Felsefe','Siyaset Felsefesi - Rousseau',['mülkiyet','toplumsal çatışma','insan doğası'],['rousseau','mülkiyet','siyaset felsefesi'],'Orta',false,24,23,'D'),
    base('osym-2026-tyt-fel-alt-25','Felsefe','Fenomenoloji',['özne-nesne ilişkisi','fenomenoloji','bilincin yönelimselliği'],['fenomenoloji','özne','nesne'],'Orta-Zor',false,25,23,'B')
  ];
  window.YKSQuestionCatalogV1?.register?.(rows);
  window.__YKS_CATALOG_SEEDS__??=[];window.__YKS_CATALOG_SEEDS__.push(...rows);
})();
