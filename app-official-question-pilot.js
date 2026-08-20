(()=>{
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  let lastQuery=null;
  const style=document.createElement('style');style.textContent=`
    .official-pilot-head{padding:14px 15px;border:1px solid #ded8ff;background:#f7f5ff;border-radius:16px;margin:12px 0}.official-pilot-head b{display:block;font-size:14px}.official-pilot-head small{display:block;color:var(--muted);margin-top:4px;line-height:1.45}.official-source-list{display:grid;gap:10px;margin-top:12px}.official-source-card{border:1px solid var(--line);background:var(--surface);border-radius:16px;padding:13px 14px}.official-source-main{display:grid;grid-template-columns:1fr auto;gap:14px;align-items:center}.official-source-meta{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:5px}.official-chip{font-size:10px;font-weight:850;padding:4px 7px;border-radius:999px;background:#f1efff;color:#553fc8}.official-chip.visual{background:#eef8f3;color:#287250}.official-chip.year{background:#fff4df;color:#8b5c11}.official-source-card h3{font-size:14px;margin:0 0 4px}.official-source-card p{font-size:11px;color:var(--muted);margin:0;line-height:1.4}.official-open{border:0;background:#6b4ce6;color:#fff;border-radius:11px;padding:10px 12px;font-weight:850;white-space:nowrap}.official-empty{padding:32px 18px;text-align:center;border:1px dashed var(--line);border-radius:16px;color:var(--muted)}@media(max-width:650px){.official-source-main{grid-template-columns:1fr}.official-open{width:100%}}
  `;document.head.appendChild(style);

  const qFromResult=x=>({exam:x?.exam||'TYT',subject:x?.subject||'Matematik',topic:x?.topic||'',curriculumOutcome:x?.curriculum_outcome||'',shortSolution:x?.short_solution||'',difficulty:x?.difficulty||'',visualPreferred:true});

  function candidates(){return window.YKSQuestionCatalogV1?.findNextBatch?.(lastQuery,5)||[]}

  function renderCandidates(items){
    try{go('similar')}catch{}
    const title=document.getElementById('similarQuestion'),choices=document.getElementById('similarChoices'),feed=document.getElementById('feedback'),hintBtn=document.getElementById('hint');
    if(feed)feed.classList.add('hidden');if(hintBtn)hintBtn.disabled=true;
    const p=window.YKSQuestionCatalogV1?.getProgress?.(lastQuery)||{};
    const activeYear=items[0]?.year||null;
    if(title)title.innerHTML=`<div class="official-pilot-head"><b>📚 Kaynak Kütüphanesinden Soru</b><small>${activeYear?`Önce ${activeYear} yılındaki çözülmemiş sorular gösteriliyor. Bu yıl bitince otomatik olarak bir önceki yıla geçilecek.`:'Tarihli resmî sorular bittikten sonra MEB/OGM ve eklenen diğer kaynaklara geçilir.'} Açmak çözülmüş sayılmaz; sonucu Kaynak Soru ekranında cevabını kontrol ettiğinde kaydederiz. ${p.remaining!=null?`Kalan uygun kayıt: ${p.remaining}.`:''}</small></div>`;
    if(!choices)return;
    choices.className='official-source-list';
    if(!items.length){choices.innerHTML='<div class="official-empty"><b>Bu konu için çözülmemiş kaynak sorusu kalmadı.</b><br>Yeni kaynaklar indekslendikçe havuz otomatik genişleyecek. AI soru üretimi kullanılmıyor.</div>';return}
    choices.innerHTML=items.map((x,i)=>`<div class="official-source-card"><div class="official-source-main"><div><div class="official-source-meta"><span class="official-chip">${esc(x.providerLabel)}</span>${x.year?`<span class="official-chip year">${x.year} ${esc(x.exam)}</span>`:''}${x.visual?'<span class="official-chip visual">🖼️ Şekilli</span>':''}</div><h3>${esc(x.topic)} • ${esc(x.questionNo||'Kaynak sayfası')}</h3><p>${esc(x.collection)}${x.subtopics?.length?` • ${esc(x.subtopics.join(' / '))}`:''}</p></div><button class="official-open" data-official-open="${i}">Soruyu Çöz →</button></div></div>`).join('');
    choices.querySelectorAll('[data-official-open]').forEach(b=>b.onclick=e=>{e?.preventDefault?.();e?.stopPropagation?.();const item=items[Number(b.dataset.officialOpen)];if(!item)return;const card=b.closest('.official-source-card');if(typeof window.openSourceQuestion!=='function'){alert('Tek-soru görüntüleyici henüz yüklenmedi. Sayfayı bir kez yenileyip tekrar dene.');return}if(window.isSourceQuestionReady&&!window.isSourceQuestionReady(item)){alert('Bu soru henüz tek-soru görüntüsü olarak hazırlanmadı.');return}window.openSourceQuestion(item,{type:'official',card,returnScreen:'similar'})});
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
  window.refreshOfficialSourceCandidates=()=>renderCandidates(candidates());
  install();
})();
