(()=>{
  const C=window.YKSQuestionCatalogV1;if(!C||C.__dedupeInstalled)return;
  const rawAll=C.all.bind(C),rawRegister=C.register.bind(C);
  const norm=s=>String(s??'').toLocaleLowerCase('tr-TR').replace(/[^a-z0-9çğıöşü]+/g,'-').replace(/^-+|-+$/g,'');
  const sourceScope=x=>{
    const collection=norm(x?.collection||x?.sourceSeries);
    if(x?.sourceKind!=='manual-crop')return collection;
    const topic=norm(x?.canonicalTopic||x?.canonicalTopicId||x?.topic);
    return [collection,topic].join('|');
  };
  const sourceKey=x=>x?.sourceFingerprint||[
    norm(x?.provider),String(x?.year||''),norm(x?.exam),norm(x?.subject),sourceScope(x),norm(x?.questionNo)
  ].join('|');
  const canonicalKey=x=>String(x?.duplicateOf||x?.canonicalQuestionId||x?.contentFingerprint||sourceKey(x)||x?.id||'');
  const duplicateLog=[];

  function indexes(rows=[]){
    const byId=new Map(),bySource=new Map(),byCanonical=new Map();
    for(const x of rows){
      if(!x?.id)continue;
      if(!byId.has(x.id))byId.set(x.id,x);
      const sk=sourceKey(x);if(sk&&!bySource.has(sk))bySource.set(sk,x);
      const ck=canonicalKey(x);if(ck&&!byCanonical.has(ck))byCanonical.set(ck,x);
    }
    return{byId,bySource,byCanonical};
  }
  function addAlternate(canonical,duplicate,reason){
    if(!canonical||!duplicate)return;
    canonical.alternateSources??=[];
    const ref={provider:duplicate.provider,providerLabel:duplicate.providerLabel,collection:duplicate.collection,year:duplicate.year??null,exam:duplicate.exam,subject:duplicate.subject,questionNo:duplicate.questionNo,access:duplicate.access||null,duplicateId:duplicate.id,reason};
    const key=JSON.stringify([ref.provider,ref.collection,ref.year,ref.exam,ref.subject,ref.questionNo,ref.access?.url||'']);
    if(!canonical.alternateSources.some(a=>JSON.stringify([a.provider,a.collection,a.year,a.exam,a.subject,a.questionNo,a.access?.url||''])===key))canonical.alternateSources.push(ref);
  }
  function unique(rows=[]){
    const out=[],seenId=new Set(),seenSource=new Set(),seenCanonical=new Set();
    for(const x of rows){
      if(!x?.id||seenId.has(x.id))continue;
      const sk=sourceKey(x),ck=canonicalKey(x);
      if((sk&&seenSource.has(sk))||(ck&&seenCanonical.has(ck)))continue;
      seenId.add(x.id);if(sk)seenSource.add(sk);if(ck)seenCanonical.add(ck);
      x.sourceFingerprint=x.sourceFingerprint||sk;
      x.canonicalQuestionId=x.duplicateOf||x.canonicalQuestionId||x.id;
      out.push(x);
    }
    return out;
  }

  C.all=()=>unique(rawAll());
  C.allRecords=()=>[...rawAll()];
  C.register=items=>{
    const incoming=(items||[]).filter(x=>x?.id);
    const idx=indexes(C.all());
    const accepted=[];
    for(const x of incoming){
      const sk=sourceKey(x),ck=canonicalKey(x);
      let canonical=null,reason='';
      if(idx.byId.has(x.id)){canonical=idx.byId.get(x.id);reason='same-id'}
      else if(sk&&idx.bySource.has(sk)){canonical=idx.bySource.get(sk);reason='same-source-question'}
      else if(ck&&idx.byCanonical.has(ck)){canonical=idx.byCanonical.get(ck);reason=x.duplicateOf?'declared-duplicate':'same-content-fingerprint'}
      if(canonical){
        addAlternate(canonical,x,reason);
        duplicateLog.push({duplicateId:x.id,canonicalId:canonical.id,reason,sourceFingerprint:sk,contentFingerprint:x.contentFingerprint||''});
        continue;
      }
      x.sourceFingerprint=x.sourceFingerprint||sk;
      x.canonicalQuestionId=x.duplicateOf||x.canonicalQuestionId||x.id;
      accepted.push(x);idx.byId.set(x.id,x);if(sk)idx.bySource.set(sk,x);if(ck)idx.byCanonical.set(ck,x);
    }
    if(accepted.length)rawRegister(accepted);
    return C.all();
  };
  C.getDuplicateRecords=()=>duplicateLog.map(x=>({...x}));
  C.getCatalogCounts=()=>({records:rawAll().length,unique:C.all().length,duplicatesDetected:duplicateLog.length,alternateSources:C.all().reduce((n,x)=>n+(x.alternateSources?.length||0),0)});
  C.makeSourceFingerprint=sourceKey;
  C.makeCanonicalKey=canonicalKey;
  C.__dedupeInstalled=true;
})();