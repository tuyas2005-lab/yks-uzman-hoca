(()=>{
  const O='https://dokuman.osym.gov.tr/pdfdokuman/2025/YKS/TSK/yks_tyt_2025_kitapcik_d250.pdf';
  const key=['D','D','E','D','A','E','B','C','D','B'];
  const data=[
    ['Açılar',['sekiz doğru parçası','ardışık tam sayı açı ölçüleri','doğrusal noktalar'],false,true],
    ['Üçgende Kenar İlişkileri',['çeşitkenar tam sayı üçgen','en küçük çevre'],false,false],
    ['Üçgende Açılar',['ikizkenar üçgen','yelpaze','tepe açısı'],false,false],
    ['Dik Üçgen',['alan oranları','hipotenüs uzunlukları'],false,false],
    ['Üçgenlerde Benzerlik ve Alan',['reklam panosu','aydınlatma','üçgensel bölge'],false,false],
    ['Çokgenler ve Yamuk',['dik yamuk','tarihî eser','kayıp üçgen parça','çevre'],false,false],
    ['Dikdörtgen - Alan ve Çevre',['üç eş kare','köşe çakışması','alan hesabı'],false,false],
    ['Örüntü ve Çokgenler',['düzgün çokgen','iç açı formülü','eşkenar üçgen ekleme'],false,false],
    ['Dikdörtgenler Prizması - Yüzey Alanı',['kare dik prizma','yüzey alanı farkı'],false,false],
    ['Dikdörtgenler Prizması - Yüzey Alanı ve Hacim',['kare dik prizma','ayrıt uzunlukları','hacim'],false,false]
  ];
  const rows=data.map((d,i)=>{const q=i+31;const vis=!(q===32||q===40);return{id:`osym-2025-tyt-mat-${String(q).padStart(2,'0')}`,provider:'OSYM',providerLabel:'ÖSYM',collection:'2025 TYT Temel Soru Kitapçığı',year:2025,exam:'TYT',subject:'Matematik',topic:d[0],subtopics:d[1],tags:[...d[1],'geometri'],difficulty:'Orta',visual:vis,questionNo:String(q),answerKey:key[i],sourceKind:'official',priority:100,access:{mode:'official-url',url:O,page:null,pageRange:'Temel Matematik Testi'},verification:{questionNo:'verified',topic:'cross-checked',exactPage:'pending-official-pdf-render',answerKey:'official'}}});
  window.YKSQuestionCatalogV1?.register?.(rows);
  window.__YKS_CATALOG_SEEDS__??=[];window.__YKS_CATALOG_SEEDS__.push(...rows);
})();
