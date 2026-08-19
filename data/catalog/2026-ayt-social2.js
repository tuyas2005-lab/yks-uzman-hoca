(()=>{
  const O='https://dokuman.osym.gov.tr/pdfdokuman/2026/YKS/TSK/yks_ayt_2026_kitapcik_kt12.pdf';
  const row=(id,subject,topic,tags,q,answerKey)=>({id,provider:'OSYM',providerLabel:'ÖSYM',collection:'2026 AYT Temel Soru Kitapçığı',year:2026,exam:'AYT',subject,topic,subtopics:tags,tags,difficulty:'Orta',visual:false,questionNo:String(q),answerKey,sourceKind:'official',priority:100,access:{mode:'official-url',url:O,page:null,pageRange:'Sosyal Bilimler-2 Testi'},verification:{questionNo:'verified',topic:'indexed-broad',answerKey:'official'}});
  const rows=[
    row('osym-2026-ayt-tar2-01','Tarih-2','Tarih-2',['tarih-2','tarih'],1,'C'),
    row('osym-2026-ayt-tar2-02','Tarih-2','Tarih-2',['tarih-2','tarih'],2,'E'),
    row('osym-2026-ayt-tar2-03','Tarih-2','Tarih-2',['tarih-2','tarih'],3,'A'),
    row('osym-2026-ayt-tar2-04','Tarih-2','Tarih-2',['tarih-2','tarih'],4,'A'),
    row('osym-2026-ayt-tar2-05','Tarih-2','Tarih-2',['tarih-2','tarih'],5,'C'),
    row('osym-2026-ayt-tar2-06','Tarih-2','Tarih-2',['tarih-2','tarih'],6,'B'),
    row('osym-2026-ayt-tar2-07','Tarih-2','Tarih-2',['tarih-2','tarih'],7,'B'),
    row('osym-2026-ayt-tar2-08','Tarih-2','Tarih-2',['tarih-2','tarih'],8,'A'),
    row('osym-2026-ayt-tar2-09','Tarih-2','Tarih-2',['tarih-2','tarih'],9,'B'),
    row('osym-2026-ayt-tar2-10','Tarih-2','Tarih-2',['tarih-2','tarih'],10,'C'),
    row('osym-2026-ayt-tar2-11','Tarih-2','Tarih-2',['tarih-2','tarih'],11,'D'),
    row('osym-2026-ayt-cog2-12','Coğrafya-2','Coğrafya-2',['coğrafya-2','coğrafya'],12,'C'),
    row('osym-2026-ayt-cog2-13','Coğrafya-2','Coğrafya-2',['coğrafya-2','coğrafya'],13,'B'),
    row('osym-2026-ayt-cog2-14','Coğrafya-2','Coğrafya-2',['coğrafya-2','coğrafya'],14,'E'),
    row('osym-2026-ayt-cog2-15','Coğrafya-2','Coğrafya-2',['coğrafya-2','coğrafya'],15,'A'),
    row('osym-2026-ayt-cog2-16','Coğrafya-2','Coğrafya-2',['coğrafya-2','coğrafya'],16,'D'),
    row('osym-2026-ayt-cog2-17','Coğrafya-2','Coğrafya-2',['coğrafya-2','coğrafya'],17,'B'),
    row('osym-2026-ayt-cog2-18','Coğrafya-2','Coğrafya-2',['coğrafya-2','coğrafya'],18,'B'),
    row('osym-2026-ayt-cog2-19','Coğrafya-2','Coğrafya-2',['coğrafya-2','coğrafya'],19,'C'),
    row('osym-2026-ayt-cog2-20','Coğrafya-2','Coğrafya-2',['coğrafya-2','coğrafya'],20,'A'),
    row('osym-2026-ayt-cog2-21','Coğrafya-2','Coğrafya-2',['coğrafya-2','coğrafya'],21,'D'),
    row('osym-2026-ayt-cog2-22','Coğrafya-2','Coğrafya-2',['coğrafya-2','coğrafya'],22,'E'),
    row('osym-2026-ayt-fel2-23','Felsefe Grubu','Felsefe Grubu',['felsefe','psikoloji','sosyoloji','mantık'],23,'C'),
    row('osym-2026-ayt-fel2-24','Felsefe Grubu','Felsefe Grubu',['felsefe','psikoloji','sosyoloji','mantık'],24,'E'),
    row('osym-2026-ayt-fel2-25','Felsefe Grubu','Felsefe Grubu',['felsefe','psikoloji','sosyoloji','mantık'],25,'C'),
    row('osym-2026-ayt-fel2-26','Felsefe Grubu','Felsefe Grubu',['felsefe','psikoloji','sosyoloji','mantık'],26,'C'),
    row('osym-2026-ayt-fel2-27','Felsefe Grubu','Felsefe Grubu',['felsefe','psikoloji','sosyoloji','mantık'],27,'A'),
    row('osym-2026-ayt-fel2-28','Felsefe Grubu','Felsefe Grubu',['felsefe','psikoloji','sosyoloji','mantık'],28,'D'),
    row('osym-2026-ayt-fel2-29','Felsefe Grubu','Felsefe Grubu',['felsefe','psikoloji','sosyoloji','mantık'],29,'D'),
    row('osym-2026-ayt-fel2-30','Felsefe Grubu','Felsefe Grubu',['felsefe','psikoloji','sosyoloji','mantık'],30,'E'),
    row('osym-2026-ayt-fel2-31','Felsefe Grubu','Felsefe Grubu',['felsefe','psikoloji','sosyoloji','mantık'],31,'E'),
    row('osym-2026-ayt-fel2-32','Felsefe Grubu','Felsefe Grubu',['felsefe','psikoloji','sosyoloji','mantık'],32,'A'),
    row('osym-2026-ayt-fel2-33','Felsefe Grubu','Felsefe Grubu',['felsefe','psikoloji','sosyoloji','mantık'],33,'D'),
    row('osym-2026-ayt-fel2-34','Felsefe Grubu','Felsefe Grubu',['felsefe','psikoloji','sosyoloji','mantık'],34,'C'),
    row('osym-2026-ayt-din2-35','Din Kültürü ve Ahlak Bilgisi','Din Kültürü ve Ahlak Bilgisi',['din kültürü','ahlak','din'],35,'D'),
    row('osym-2026-ayt-din2-36','Din Kültürü ve Ahlak Bilgisi','Din Kültürü ve Ahlak Bilgisi',['din kültürü','ahlak','din'],36,'E'),
    row('osym-2026-ayt-din2-37','Din Kültürü ve Ahlak Bilgisi','Din Kültürü ve Ahlak Bilgisi',['din kültürü','ahlak','din'],37,'C'),
    row('osym-2026-ayt-din2-38','Din Kültürü ve Ahlak Bilgisi','Din Kültürü ve Ahlak Bilgisi',['din kültürü','ahlak','din'],38,'B'),
    row('osym-2026-ayt-din2-39','Din Kültürü ve Ahlak Bilgisi','Din Kültürü ve Ahlak Bilgisi',['din kültürü','ahlak','din'],39,'A'),
    row('osym-2026-ayt-din2-40','Din Kültürü ve Ahlak Bilgisi','Din Kültürü ve Ahlak Bilgisi',['din kültürü','ahlak','din'],40,'C')
  ];
  window.YKSQuestionCatalogV1?.register?.(rows);
  window.__YKS_CATALOG_SEEDS__??=[];window.__YKS_CATALOG_SEEDS__.push(...rows);
})();