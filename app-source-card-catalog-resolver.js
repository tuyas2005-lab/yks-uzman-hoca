(()=>{
  const norm=s=>String(s||'').toLocaleLowerCase('tr-TR');
  function resolve(all,{catalogId='',text='',subject=''}={}){
    const id=String(catalogId||'').trim();
    if(id)return all.find(x=>x?.id===id)||null;
    const raw=String(text||''),q=(raw.match(/\bSoru\s*(\d+)\b/i)||[])[1]||'',m=raw.match(/\b(20\d{2})\s+(TYT|AYT|YDT)\b/i);
    if(!q||!m)return null;
    const candidates=all.filter(x=>Number(x?.year)===Number(m[1])&&String(x?.exam||'').toUpperCase()===m[2].toUpperCase()&&String(x?.questionNo||'')===q&&(!subject||norm(x?.subject)===norm(subject)));
    const topic=candidates.filter(x=>x?.topic&&norm(raw).includes(norm(x.topic)));
    const collection=candidates.filter(x=>x?.collection&&norm(raw).includes(norm(x.collection)));
    const narrowed=topic.length===1?topic:collection.length===1?collection:candidates;
    return narrowed.length===1?narrowed[0]:null;
  }
  window.YKSResolveSourceCatalogItem=resolve;
})();
