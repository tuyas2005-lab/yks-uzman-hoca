(()=>{
  const C=window.YKSQuestionCatalogV1;if(!C||C.__dedupeInstalled)return;
  const rawAll=C.all.bind(C),rawRegister=C.register.bind(C);
  const norm=s=>String(s??'').toLocaleLowerCase('tr-TR').replace(/[^a-z0-9çğıöşü]+/g,'-').replace(/^-+|-+$/g,'');
  const sourceKey=x=>x?.sourceFingerprint||[
    norm(x?.provider),String(x?.year||''),norm(x?.exam),norm(x?.subject),norm(x?.collection),norm(x?.questionNo)
  ].join('|');
  const canonicalKey=x=>String(x?.duplicateOf||x?.canonicalQuestionId||x?.contentFingerprint||sourceKey(x)||x?.id||'');
  let duplicates=[];

  function classify(rows=[]){
    const byId=new Map(),bySource=new Map(),byCanonical=new Map(),unique=[];
    duplicates=[];
    for(const x of rows||[]){
      if(!x?.id)continue;
      if(byId.has(x.id)){duplicates.push({item:x,reason:'same-id',canonicalId:byId.get(x.id).id});continue}
      byId.set(x.id,x);
      const sk=sourceKey(x);
      if(sk&&bySource.has(sk)){duplicates.push({item:x,reason:'same-source-question',canonicalId:bySource.get(sk).id});continue}
      if(sk)bySource.set(sk,x);
      const ck=canonicalKey(x);
      if(ck&&byCanonical.has(ck)){
        duplicates.push({item:x,reason:x.duplicateOf?'declared-duplicate':'same-content-fingerprint',canonicalId:byCanonical.get(ck).id});
        continue;
      }
      if(ck)byCanonical.set(ck,x);
      x.canonicalQuestionId=x.duplicateOf||x.canonicalQuestionId||x.id;
      x.sourceFingerprint=x.sourceFingerprint||sk;
      unique.push(x);
    }
    return unique;
  }

  C.all=()=>classify(rawAll());
  C.allRecords=()=>[...rawAll()];
  C.register=items=>{
    const existing=rawAll();
    const merged=[...existing,...(items||[]).filter(Boolean)];
    const accepted=classify(merged);
    const existingIds=new Set(existing.map(x=>x?.id).filter(Boolean));
    const newAccepted=accepted.filter(x=>!existingIds.has(x.id));
    if(newAccepted.length)rawRegister(newAccepted);
    classify(rawAll());
    return C.all();
  };
  C.getDuplicateRecords=()=>duplicates.map(d=>({...d}));
  C.getCatalogCounts=()=>({records:rawAll().length,unique:C.all().length,duplicates:duplicates.length});
  C.makeSourceFingerprint=sourceKey;
  C.makeCanonicalKey=canonicalKey;
  C.__dedupeInstalled=true;
})();