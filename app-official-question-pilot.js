(()=>{
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const norm=s=>String(s||'').toLocaleLowerCase('tr-TR');
  const eligible=x=>{
    if(!x)return false;
    const exam=String(x.exam||'').toUpperCase(),subject=norm(x.subject),topic=norm([x.topic,x.curriculum_outcome,x.short_solution].join(' '));
    return exam==='TYT'&&subject.includes('matematik')&&/(üçgen|trigon|pisagor|benzerlik|geometri)/.test(topic);
  };
  const style=document.createElement('style');style.textContent=`
    .official-pilot-head{padding:14px 15px;border:1px solid #ded8ff;background:#f7f5ff;border-radius:16px;margin:12px 0}.official-pilot-head b{display:block;font-size:14px}.official-pilot-head small{display:block;color:var(--muted);margin-top:4px;line-height:1.4}.official-source-list{display:grid;gap:10px;margin-top:12px}.official-source-card{display:grid;grid-template-columns:1fr auto;gap:14px;align-items:center;border:1px solid var(--line);background:var(--surface);border-radius:16px;padding:13px 14px}.official-source-card:hover{border-color:#c9c0ff;box-shadow:0 8px 24px rgba(85,64,190,.08)}.official-source-meta{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:5px}.official-chip{font-size:10px;font-weight:850;padding:4px 7px;border-radius:999px;background:#f1efff;color:#553fc8}.official-chip.visual{background:#eef8f3;color:#287250}.official-source-card h3{font-size:14px;margin:0 0 4px}.official-source-card p{font-size:11px;color:var(--muted);margin:0;line-height:1.4}.official-open{border:0;background:#6b4ce6;color:#fff;border-radius:11px;padding:10px 12px;font-weight:850;white-space:nowrap}.official-ai-fallback{margin-top:12px;width:100%;border:1px solid var(--line);background:var(--surface);color:var(--ink);border-radius:12px;padding:10px 12px;font-weight:800}@media(max-width:650px){.official-source-card{grid-template-columns:1fr}.official-open{width:100%}}
  `;document.head.appendChild(style);

  function recordOpen(item){
    try{window.YKSDataV5?.record?.({source:'official-question-open',exam:item.exam,subject:item.subject,topic:item.topic,curriculumOutcome:(item.subtopics||[]).join(' • '),result:'unknown',interaction:'opened-source',questionCount:0,signals:[],meta:{catalogId:item.id,provider:item.provider,collection:item.collection,questionNo:item.questionNo,url:item.access?.url,visual:item.visual}},{persistNow:true})}catch{}
  }
  function renderCandidates(items,baseHandler,btn){
    try{go('similar')}catch{}
    const title=document.getElementById('similarQuestion');
    const choices=document.getElementById('similarChoices');
    const feed=document.getElementById('feedback');
    const hintBtn=document.getElementById('hint');
    if(feed)feed.classList.add('hidden');if(hintBtn)hintBtn.disabled=true;
    if(title)title.innerHTML='<div class="official-pilot-head"><b>📚 Resmî Kaynaktan Benzer Sorular</b><small>Öncelik ÖSYM, ardından MEB/OGM. Sorular kendi resmî sayfasında açılır; çizim ve sınav görünümü değiştirilmez.</small></div>';
    if(!choices)return;
    choices.className='official-source-list';
    choices.innerHTML=items.map((x,i)=>`<div class="official-source-card"><div><div class="official-source-meta"><span class="official-chip">${esc(x.providerLabel)}</span>${x.year?`<span class="official-chip">${x.year} TYT</span>`:''}${x.visual?'<span class="official-chip visual">🖼️ Şekilli</span>':''}</div><h3>${esc(x.topic)} • ${esc(x.questionNo||'Kaynak sayfası')}</h3><p>${esc(x.collection)}${x.subtopics?.length?` • ${esc(x.subtopics.join(' / '))}`:''}</p></div><button class="official-open" data-official-open="${i}">Orijinal Soruyu Aç ↗</button></div>`).join('')+`<button id="officialAiFallback" class="official-ai-fallback">Uygun resmî soru yerine AI ile özgün soru üret</button>`;
    choices.querySelectorAll('[data-official-open]').forEach(b=>b.onclick=()=>{const item=items[Number(b.dataset.officialOpen)];if(!item)return;recordOpen(item);window.open(item.access.url,'_blank','noopener,noreferrer')});
    const ai=choices.querySelector('#officialAiFallback');if(ai)ai.onclick=()=>{if(typeof baseHandler==='function')baseHandler.call(btn,{preventDefault(){}})};
  }

  function install(tries=0){
    const btn=document.querySelector('#solution [data-go="similar"]');
    if(!btn||!window.YKSQuestionCatalogV1){if(tries<80)setTimeout(()=>install(tries+1),100);return}
    if(window.__officialQuestionPilotInstalled)return;window.__officialQuestionPilotInstalled=true;
    const baseHandler=btn.onclick;
    document.addEventListener('click',e=>{
      const hit=e.target.closest('#solution [data-go="similar"]');if(!hit)return;
      const x=typeof lastLiveResult!=='undefined'?lastLiveResult:null;
      if(!eligible(x))return;
      const items=window.YKSQuestionCatalogV1.findSimilar({exam:x.exam||'TYT',subject:x.subject||'Matematik',topic:x.topic||'',curriculumOutcome:x.curriculum_outcome||'',shortSolution:x.short_solution||'',difficulty:x.difficulty||'',visualPreferred:true},5);
      if(!items.length)return;
      e.preventDefault();e.stopImmediatePropagation();
      renderCandidates(items,baseHandler,btn);
    },true);
  }
  install();
})();
