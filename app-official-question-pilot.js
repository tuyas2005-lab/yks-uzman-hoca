(()=>{
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  let lastQuery=null;
  const style=document.createElement('style');style.textContent=`
    .official-pilot-head{padding:14px 15px;border:1px solid #ded8ff;background:#f7f5ff;border-radius:16px;margin:12px 0}.official-pilot-head b{display:block;font-size:14px}.official-pilot-head small{display:block;color:var(--muted);margin-top:4px;line-height:1.45}.official-source-list{display:grid;gap:10px;margin-top:12px}.official-source-card{border:1px solid var(--line);background:var(--surface);border-radius:16px;padding:13px 14px}.official-source-main{display:grid;grid-template-columns:1fr auto;gap:14px;align-items:center}.official-source-meta{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:5px}.official-chip{font-size:10px;font-weight:850;padding:4px 7px;border-radius:999px;background:#f1efff;color:#553fc8}.official-chip.visual{background:#eef8f3;color:#287250}.official-chip.year{background:#fff4df;color:#8b5c11}.official-source-card h3{font-size:14px;margin:0 0 4px}.official-source-card p{font-size:11px;color:var(--muted);margin:0;line-height:1.4}.official-open{border:0;background:#6b4ce6;color:#fff;border-radius:11px;padding:10px 12px;font-weight:850;white-space:nowrap}.official-result-row{display:flex;gap:7px;flex-wrap:wrap;margin-top:11px;padding-top:10px;border-top:1px solid var(--line)}.official-result-row span{font-size:11px;color:var(--muted);margin-right:3px;align-self:center}.official-result{border:1px solid var(--line);background:var(--surface);border-radius:10px;padding:8px 10px;font-weight:800}.official-result[data-result="correct"]{color:#16734a}.official-result[data-result="wrong"],.official-result[data-result="unable"]{color:#a64b22}.official-empty{padding:32px 18px;text-align:center;border:1px dashed var(--line);border-radius:16px;color:var(--muted)}@media(max-width:650px){.official-source-main{grid-template-columns:1fr}.official-open{width:100%}}
  `;document.head.appendChild(style);

  const qFromResult=x=>({exam:x?.exam||'TYT',subject:x?.subject||'Matematik',topic:x?.topic||'',curriculumOutcome:x?.curriculum_outcome||'',shortSolution:x?.short_solution||'',difficulty:x?.difficulty||'',visualPreferred:true});

  function recordOpen(item){
    try{window.YKSDataV5?.record?.({source:'official-question-open',exam:item.exam,subject:item.subject,topic:item.topic,curriculumOutcome:(item.subtopics||[]).join(' • '),result:'unknown',interaction:'opened-source',questionCount:0,signals:[],meta:{catalogId:item.id,provider:item.provider,collection:item.collection,questionNo:item.questionNo,url:item.access?.url,visual:item.visual}},{persistNow:true})}catch{}
  }

  function recordResult(item,kind){
    const exists=(state.studyEvents||[]).some(x=>x?.source==='source-question-result'&&x?.meta?.catalogId===item.id);if(exists)return false;
    const result=kind==='correct'?'correct':kind==='wrong'?'wrong':'unknown';
    const isWrong=kind==='wrong'||kind==='unable';
    const meta={catalogId:item.id,provider:item.provider,providerLabel:item.providerLabel,collection:item.collection,questionNo:item.questionNo,url:item.access?.url,visual:item.visual,sourceYear:item.year||null,wrongRecord:isWrong,wrongKind:isWrong?kind:'',externalQuestion:true,question:{text:`${item.providerLabel} ${item.year||''} ${item.exam} • ${item.topic} • Soru ${item.questionNo||''}`.trim(),image:''},solution:{answer:'',shortSolution:'Orijinal kaynak sorusunu açarak tekrar incele.',curriculumOutcome:(item.subtopics||[]).join(' • ')}};
    try{window.YKSDataV5?.record?.({source:'source-question-result',exam:item.exam,subject:item.subject,topic:item.topic,curriculumOutcome:(item.subtopics||[]).join(' • '),result,difficulty:item.difficulty||'',interaction:kind==='unable'?'unable':'answered-source',questionCount:1,signals:isWrong?[kind==='unable'?'unable':'wrong']:['correct-source'],meta},{persistNow:true});return true}catch{return false}
  }

  function candidates(){return window.YKSQuestionCatalogV1?.findNextBatch?.(lastQuery,5)||[]}

  function renderCandidates(items){
    try{go('similar')}catch{}
    const title=document.getElementById('similarQuestion'),choices=document.getElementById('similarChoices'),feed=document.getElementById('feedback'),hintBtn=document.getElementById('hint');
    if(feed)feed.classList.add('hidden');if(hintBtn)hintBtn.disabled=true;
    const p=window.YKSQuestionCatalogV1?.getProgress?.(lastQuery)||{};
    const activeYear=items[0]?.year||null;
    if(title)title.innerHTML=`<div class="official-pilot-head"><b>📚 Kaynak Kütüphanesinden Soru</b><small>${activeYear?`Önce ${activeYear} yılındaki çözülmemiş sorular gösteriliyor. Bu yıl bitince otomatik olarak bir önceki yıla geçilecek.`:'Tarihli resmî sorular bittikten sonra MEB/OGM ve eklenen diğer kaynaklara geçilir.'} Açmak çözülmüş sayılmaz; sorudan döndüğünde sonucu işaretle. ${p.remaining!=null?`Kalan uygun kayıt: ${p.remaining}.`:''}</small></div>`;
    if(!choices)return;
    choices.className='official-source-list';
    if(!items.length){choices.innerHTML='<div class="official-empty"><b>Bu konu için çözülmemiş kaynak sorusu kalmadı.</b><br>Yeni kaynaklar indekslendikçe havuz otomatik genişleyecek. AI soru üretimi kullanılmıyor.</div>';return}
    choices.innerHTML=items.map((x,i)=>`<div class="official-source-card"><div class="official-source-main"><div><div class="official-source-meta"><span class="official-chip">${esc(x.providerLabel)}</span>${x.year?`<span class="official-chip year">${x.year} ${esc(x.exam)}</span>`:''}${x.visual?'<span class="official-chip visual">🖼️ Şekilli</span>':''}</div><h3>${esc(x.topic)} • ${esc(x.questionNo||'Kaynak sayfası')}</h3><p>${esc(x.collection)}${x.subtopics?.length?` • ${esc(x.subtopics.join(' / '))}`:''}</p></div><button class="official-open" data-official-open="${i}">Orijinal Soruyu Aç ↗</button></div><div class="official-result-row"><span>Çözdükten sonra:</span><button class="official-result" data-official-result="${i}" data-result="correct">✓ Doğru</button><button class="official-result" data-official-result="${i}" data-result="wrong">✕ Yanlış</button><button class="official-result" data-official-result="${i}" data-result="unable">? Yapamadım</button></div></div>`).join('');
    choices.querySelectorAll('[data-official-open]').forEach(b=>b.onclick=()=>{const item=items[Number(b.dataset.officialOpen)];if(!item)return;recordOpen(item);window.open(item.access.url,'_blank','noopener,noreferrer')});
    choices.querySelectorAll('[data-official-result]').forEach(b=>b.onclick=()=>{const item=items[Number(b.dataset.officialResult)];if(!item)return;if(recordResult(item,b.dataset.result))setTimeout(()=>renderCandidates(candidates()),30)});
  }

  function install(tries=0){
    const btn=document.querySelector('#solution [data-go="similar"]');
    if(!btn||!window.YKSQuestionCatalogV1?.findNextBatch){if(tries<100)setTimeout(()=>install(tries+1),100);return}
    if(window.__officialQuestionPilotInstalled)return;window.__officialQuestionPilotInstalled=true;
    document.addEventListener('click',e=>{
      const hit=e.target.closest('#solution [data-go="similar"]');if(!hit)return;
      e.preventDefault();e.stopImmediatePropagation();
      const x=typeof lastLiveResult!=='undefined'?lastLiveResult:null;
      lastQuery=qFromResult(x||{});
      renderCandidates(candidates());
    },true);
  }
  install();
})();
