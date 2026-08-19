(()=>{
  const C=window.YKSQuestionCatalogV1;if(!C||C.__dedupeInstalled)return;
  const rawAll=C.all.bind(C),rawRegister=C.register.bind(C);
  const unique=rows=>{const m=new Map();(rows||[]).forEach(x=>{if(x?.id&&!m.has(x.id))m.set(x.id,x)});return[...m.values()]};
  C.all=()=>unique(rawAll());
  C.register=items=>{const seen=new Set(C.all().map(x=>x.id));rawRegister((items||[]).filter(x=>x?.id&&!seen.has(x.id)));return C.all()};
  C.__dedupeInstalled=true;
})();
