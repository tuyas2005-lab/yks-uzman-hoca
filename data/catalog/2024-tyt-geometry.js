(()=>{
  const O='https://dokuman.osym.gov.tr/pdfdokuman/2024/YKS/TSK/yks_tyt_2024_kitapcik_T24kt.pdf';
  const key=['D','E','C','A','D','D','A','E','B','C'];
  // data: [topic, subtopics, visual, needsReview?]
  const data=[
    ['Açılar',['zemin lazer ışını','dar açı ölçüsü'],true,false],
    ['Üçgende Açılar',['ikizkenar üçgen','x açısı'],true,false],
    ['Üçgenlerde Benzerlik ve Alan',['kaykay bağlantı direği','ip uzunluğu'],true,false],
    ['Üçgende Kenar İlişkileri',['şanslı üçgen tanımı','iç açı ölçüsü kayıp'],false,true],
    ['Üçgenlerde Benzerlik ve Alan',['dağ yamacı','halat mesafesi'],true,false],
    ['Dikdörtgen - Alan ve Çevre',['kartpostal fotoğraf','görünmeyen alan'],true,false],
    ['Çokgenler ve Yamuk',['yamuk cam vitray','çevre 40 birim'],true,false],
    ['Örüntü ve Çokgenler',['düzgün çokgen dış açı','ortak kenar'],true,false],
    ['Dikdörtgenler Prizması - Yüzey Alanı',['12 özdeş blok','küp yüzey alanı oranı'],true,false],
    ['Dikdörtgenler Prizması - Yüzey Alanı ve Hacim',['kare etiket','prizma hacmi'],false,false]
  ];
  const rows=data.map((d,i)=>{const q=i+31;const nr=d[3]===true;return{id:`osym-2024-tyt-mat-${String(q).padStart(2,'0')}`,provider:'OSYM',providerLabel:'ÖSYM',collection:'2024 TYT Temel Soru Kitapçığı',year:2024,exam:'TYT',subject:'Matematik',topic:d[0],subtopics:d[1],tags:[...d[1],'geometri'],difficulty:'Orta',visual:d[2]===true,questionNo:String(q),answerKey:key[i],sourceKind:'official',priority:100,access:{mode:'official-url',url:O,page:null,pageRange:'Temel Matematik Testi'},verification:{questionNo:'verified',topic:nr?'needs-manual-review-text-extraction-loss':'cross-checked',exactPage:'pending-official-pdf-render',answerKey:'official'}}});
  window.YKSQuestionCatalogV1?.register?.(rows);
  window.__YKS_CATALOG_SEEDS__??=[];window.__YKS_CATALOG_SEEDS__.push(...rows);
})();
