(()=>{
  const O='https://dokuman.osym.gov.tr/pdfdokuman/2026/YKS/TSK/yks_ayt_2026_kitapcik_kt12.pdf';
  const row=(id,subject,topic,tags,q,answerKey,cancelled=false)=>({id,provider:'OSYM',providerLabel:'ÖSYM',collection:'2026 AYT Temel Soru Kitapçığı',year:2026,exam:'AYT',subject,topic,subtopics:tags,tags,difficulty:'Orta',visual:false,questionNo:String(q),answerKey,cancelled,sourceKind:'official',priority:100,access:{mode:'official-url',url:O,page:null,pageRange:'Türk Dili ve Edebiyatı-Sosyal Bilimler-1 Testi'},verification:{questionNo:'verified',topic:'indexed-broad',answerKey:cancelled?'cancelled-by-osym-2026-07-01':'official'}});
  const rows=[
    row('osym-2026-ayt-tde1-01','Türk Dili ve Edebiyatı','Paragraf ve Anlam',['paragraf','anlam','yorum'],1,'B'),
    row('osym-2026-ayt-tde1-02','Türk Dili ve Edebiyatı','Paragraf ve Anlam',['paragraf','anlam','yorum'],2,'D'),
    row('osym-2026-ayt-tde1-03','Türk Dili ve Edebiyatı','Paragraf ve Anlam',['paragraf','anlam','yorum'],3,'B'),
    row('osym-2026-ayt-tde1-04','Türk Dili ve Edebiyatı','Paragraf ve Anlam',['paragraf','anlam','yorum'],4,'E'),
    row('osym-2026-ayt-tde1-05','Türk Dili ve Edebiyatı','Paragraf ve Anlam',['paragraf','anlam','yorum'],5,'D'),
    row('osym-2026-ayt-tde1-06','Türk Dili ve Edebiyatı','Paragraf ve Anlam',['paragraf','anlam','yorum'],6,'C'),
    row('osym-2026-ayt-tde1-07','Türk Dili ve Edebiyatı','Şiir Bilgisi ve Divan Edebiyatı',['şiir','divan edebiyatı','edebî sanat'],7,'E'),
    row('osym-2026-ayt-tde1-08','Türk Dili ve Edebiyatı','Şiir Bilgisi ve Divan Edebiyatı',['şiir','divan edebiyatı','edebî sanat'],8,'D'),
    row('osym-2026-ayt-tde1-09','Türk Dili ve Edebiyatı','Şiir Bilgisi ve Divan Edebiyatı',['şiir','divan edebiyatı','edebî sanat'],9,'A'),
    row('osym-2026-ayt-tde1-10','Türk Dili ve Edebiyatı','Şiir Bilgisi ve Divan Edebiyatı',['şiir','divan edebiyatı','edebî sanat'],10,'E'),
    row('osym-2026-ayt-tde1-11','Türk Dili ve Edebiyatı','Türk Edebiyatı - Dönem, Eser ve Sanatçı',['edebiyat tarihi','eser','sanatçı'],11,'E'),
    row('osym-2026-ayt-tde1-12','Türk Dili ve Edebiyatı','Türk Edebiyatı - Dönem, Eser ve Sanatçı',['edebiyat tarihi','eser','sanatçı'],12,'D'),
    row('osym-2026-ayt-tde1-13','Türk Dili ve Edebiyatı','Türk Edebiyatı - Dönem, Eser ve Sanatçı',['edebiyat tarihi','eser','sanatçı'],13,'A'),
    row('osym-2026-ayt-tde1-14','Türk Dili ve Edebiyatı','Türk Edebiyatı - Dönem, Eser ve Sanatçı',['edebiyat tarihi','eser','sanatçı'],14,'B'),
    row('osym-2026-ayt-tde1-15','Türk Dili ve Edebiyatı','Türk Edebiyatı - Dönem, Eser ve Sanatçı',['edebiyat tarihi','eser','sanatçı'],15,'C'),
    row('osym-2026-ayt-tde1-16','Türk Dili ve Edebiyatı','Türk Edebiyatı - Dönem, Eser ve Sanatçı',['edebiyat tarihi','eser','sanatçı'],16,'C'),
    row('osym-2026-ayt-tde1-17','Türk Dili ve Edebiyatı','Edebî Türler ve Metin Bilgisi',['edebî tür','metin','edebiyat'],17,'D'),
    row('osym-2026-ayt-tde1-18','Türk Dili ve Edebiyatı','Edebî Türler ve Metin Bilgisi',['edebî tür','metin','edebiyat'],18,'C'),
    row('osym-2026-ayt-tde1-19','Türk Dili ve Edebiyatı','Edebî Türler ve Metin Bilgisi',['edebî tür','metin','edebiyat'],19,'B'),
    row('osym-2026-ayt-tde1-20','Türk Dili ve Edebiyatı','Edebî Türler ve Metin Bilgisi',['edebî tür','metin','edebiyat'],20,null,true),
    row('osym-2026-ayt-tde1-21','Türk Dili ve Edebiyatı','Edebî Türler ve Metin Bilgisi',['edebî tür','metin','edebiyat'],21,'C'),
    row('osym-2026-ayt-tde1-22','Türk Dili ve Edebiyatı','Edebî Türler ve Metin Bilgisi',['edebî tür','metin','edebiyat'],22,'E'),
    row('osym-2026-ayt-tde1-23','Türk Dili ve Edebiyatı','Edebî Türler ve Metin Bilgisi',['edebî tür','metin','edebiyat'],23,'C'),
    row('osym-2026-ayt-tde1-24','Türk Dili ve Edebiyatı','Edebî Türler ve Metin Bilgisi',['edebî tür','metin','edebiyat'],24,'A'),
    row('osym-2026-ayt-tar1-25','Tarih-1','Tarih-1',['tarih-1','tarih'],25,'B'),
    row('osym-2026-ayt-tar1-26','Tarih-1','Tarih-1',['tarih-1','tarih'],26,'A'),
    row('osym-2026-ayt-tar1-27','Tarih-1','Tarih-1',['tarih-1','tarih'],27,'B'),
    row('osym-2026-ayt-tar1-28','Tarih-1','Tarih-1',['tarih-1','tarih'],28,'D'),
    row('osym-2026-ayt-tar1-29','Tarih-1','Tarih-1',['tarih-1','tarih'],29,'E'),
    row('osym-2026-ayt-tar1-30','Tarih-1','Tarih-1',['tarih-1','tarih'],30,'A'),
    row('osym-2026-ayt-tar1-31','Tarih-1','Tarih-1',['tarih-1','tarih'],31,'A'),
    row('osym-2026-ayt-tar1-32','Tarih-1','Tarih-1',['tarih-1','tarih'],32,'E'),
    row('osym-2026-ayt-tar1-33','Tarih-1','Tarih-1',['tarih-1','tarih'],33,'B'),
    row('osym-2026-ayt-tar1-34','Tarih-1','Tarih-1',['tarih-1','tarih'],34,'B'),
    row('osym-2026-ayt-cog1-35','Coğrafya-1','Coğrafya-1',['coğrafya-1','coğrafya'],35,'C'),
    row('osym-2026-ayt-cog1-36','Coğrafya-1','Coğrafya-1',['coğrafya-1','coğrafya'],36,'D'),
    row('osym-2026-ayt-cog1-37','Coğrafya-1','Coğrafya-1',['coğrafya-1','coğrafya'],37,'B'),
    row('osym-2026-ayt-cog1-38','Coğrafya-1','Coğrafya-1',['coğrafya-1','coğrafya'],38,'E'),
    row('osym-2026-ayt-cog1-39','Coğrafya-1','Coğrafya-1',['coğrafya-1','coğrafya'],39,'E'),
    row('osym-2026-ayt-cog1-40','Coğrafya-1','Coğrafya-1',['coğrafya-1','coğrafya'],40,'A')
  ];
  window.YKSQuestionCatalogV1?.register?.(rows);
  window.__YKS_CATALOG_SEEDS__??=[];window.__YKS_CATALOG_SEEDS__.push(...rows);
})();