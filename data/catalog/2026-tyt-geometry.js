(()=>{
  const O='https://dokuman.osym.gov.tr/pdfdokuman/2026/YKS/TSK/yks_tyt_2026_kitapcik_d350.pdf';
  const M='https://ilgaz.meb.gov.tr/meb_iys_dosyalar/2026_06/6a3a22d27eaf0404587806_yks_tyt_2026_kitapcik_d350.pdf';
  const base=(id,topic,subtopics,tags,difficulty,visual,questionNo,page,answerKey)=>({id,provider:'OSYM',providerLabel:'ÖSYM',collection:'2026 TYT Temel Soru Kitapçığı',year:2026,exam:'TYT',subject:'Matematik',topic,subtopics,tags,difficulty,visual,questionNo:String(questionNo),answerKey,sourceKind:'official',priority:100,access:{mode:'official-url',url:O+'#page='+page,mirrorUrl:M+'#page='+page,page}});
  const rows=[
    base('osym-2026-tyt-mat-31','Üçgende Açılar',['üçgenlerde açı','açı türleri','kare içinde üçgenler'],['üçgen','açı','dar açı','kare','şekilli'],'Orta',true,31,34,'E'),
    base('osym-2026-tyt-mat-32','Üçgende Kenar İlişkileri',['üçgen eşitsizliği','kenar uzunlukları','ortak kenarlı üçgenler'],['üçgen','kenar','üçgen eşitsizliği','kroki','şekilli'],'Orta',true,32,34,'D'),
    base('osym-2026-tyt-mat-33','İkizkenar Üçgen ve Alan',['ikizkenar üçgen','üçgenin alanı','kenar uzunlukları','üçgen eşitsizliği'],['üçgen','ikizkenar','alan','çevre','tam sayı'],'Orta-Zor',false,33,34,'E'),
    base('osym-2026-tyt-mat-34','Dik Üçgen',['pisagor','uzaklık','dik üçgende uzunluk'],['dik üçgen','pisagor','merdiven','uzaklık','şekilli'],'Orta',true,34,34,'C'),
    base('osym-2026-tyt-mat-35','Üçgenlerde Benzerlik ve Alan',['benzer üçgenler','paralellik','katlama','üçgenin alanı'],['üçgen','benzerlik','alan','katlama','paralel','şekilli'],'Zor',true,35,35,'A'),
    base('osym-2026-tyt-mat-36','Deltoid',['deltoid','köşegen','özel dörtgen','uzunluk'],['deltoid','dörtgen','köşegen','pisagor','şekilli'],'Orta',true,36,35,'B'),
    base('osym-2026-tyt-mat-37','Dikdörtgen - Alan ve Çevre',['dikdörtgen','alan','çevre','oran'],['dikdörtgen','alan','çevre','pencere','şekilli'],'Orta',true,37,35,'E'),
    base('osym-2026-tyt-mat-38','Çokgenler ve Yamuk',['düzgün çokgen','dış açı','ikizkenar yamuk','iç açı'],['çokgen','yamuk','dış açı','iç açı','şekilli'],'Orta',true,38,36,'C'),
    base('osym-2026-tyt-mat-39','Dikdörtgenler Prizması - Yüzey Alanı',['dikdörtgenler prizması','yüzey alanı','katı cisimler'],['prizma','yüzey alanı','katı cisim','şekilli'],'Orta',true,39,36,'B'),
    base('osym-2026-tyt-mat-40','Dikdörtgenler Prizması - Yüzey Alanı ve Hacim',['dikdörtgenler prizması','yüzey alanı','hacim','dikdörtgen çevresi'],['prizma','yüzey alanı','hacim','katı cisim'],'Orta-Zor',false,40,36,'B')
  ];
  window.YKSQuestionCatalogV1?.register?.(rows);
  window.__YKS_CATALOG_SEEDS__??=[];window.__YKS_CATALOG_SEEDS__.push(...rows);
})();
