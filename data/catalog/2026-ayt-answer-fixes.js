(()=>{
  // Not: mat-23 bu listede YOK. 1 Temmuz 2026'da cevabi C->A olarak duzeltilmisti,
  // ancak 21 Temmuz 2026 tarihli OSYM "Degerlendirme Islemlerine Iliskin Aciklama"
  // belgesinde bu sorunun yargi karari geregi TAMAMEN IPTAL edildigi bildirildi.
  // Nihai resmi durum: iptal (asagida cancelled=true olarak isleniyor).
  const math={1:'D',2:'A',3:'E',4:'B',5:'C',6:'A',7:'A',8:'D',9:'A',10:'D',11:'D',12:'C',13:'C',14:'E',15:'B',16:'E',17:'E',18:'E',19:'C',20:'D',21:'B',22:'A',24:'E',25:'C',26:'B',27:'C',28:'B'};
  function apply(){
    const C=window.YKSQuestionCatalogV1;if(!C?.all)return false;
    let n=0;
    for(const item of C.all()){
      if(item.year!==2026||item.exam!=='AYT')continue;
      const m=/^osym-2026-ayt-mat-(\d{2})$/.exec(item.id||'');
      if(m&&math[Number(m[1])]){item.answerKey=math[Number(m[1])];item.answer=item.answerKey;item.verification??={};item.verification.answerKey='official';n++}
      if(item.id==='osym-2026-ayt-tde1-20'){item.answerKey=null;item.answer='';item.cancelled=true;item.verification??={};item.verification.answerKey='cancelled-by-osym-2026-07-01';n++}
      if(item.id==='osym-2026-ayt-mat-23'){item.answerKey=null;item.answer='';item.cancelled=true;item.verification??={};item.verification.answerKey='cancelled-by-court-2026-07-21';n++}
    }
    return n>0;
  }
  if(!apply()){let tries=0;const t=setInterval(()=>{if(apply()||++tries>40)clearInterval(t)},75)}
  window.apply2026AytOfficialAnswerFixes=apply;
})();