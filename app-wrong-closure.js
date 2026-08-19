(()=>{
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const norm=s=>String(s||'').toLocaleLowerCase('tr-TR');
  let statusMode='open',modalWrongId='',activeRetryId='',enhancing=false;

  const css=document.createElement('style');
  css.textContent=`
    .wrong-closure-metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:0 0 12px}.wrong-closure-metric{padding:13px 14px;border:1px solid var(--line);border-radius:15px;background:var(--surface)}.wrong-closure-metric b{display:block;font-size:23px}.wrong-closure-metric small{color:var(--muted);font-size:11px}.wrong-closure-metric.closed{background:#f6fcf8;border-color:#cbe7d5}.wrong-closure-metric.rate{background:#f7f5ff;border-color:#ddd7ff}.wrong-closure-status{min-width:150px}.wrong2-toolbar.wrong-closure-toolbar{grid-template-columns:minmax(220px,1.3fr) repeat(5,minmax(120px,.7fr))}.wrong-closure-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.wrong-closure-manual,.wrong-closure-reopen{border:0;border-radius:11px;padding:10px 13px;font-weight:850;cursor:pointer}.wrong-closure-manual{background:#1f7a50;color:#fff}.wrong-closure-reopen{background:#eeeaff;color:#523bd0}.wrong-closure-badge{display:inline-flex;padding:5px 8px;border-radius:999px;background:#eaf8f0;color:#23724d;font-size:10px;font-weight:900}.wrong-closure-info{margin-top:12px;padding:12px;border-radius:13px;background:#f3fbf6;border:1px solid #cfe8d9;font-size:12px;line-height:1.45}.wrong-closed-list{display:grid;gap:10px}.wrong-closed-item{display:grid;grid-template-columns:minmax(170px,.9fr) minmax(220px,1.2fr) minmax(260px,1.5fr) 130px 120px;gap:12px;align-items:center;background:#f8fcf9;border:1px solid #cfe5d7;border-radius:16px;padding:13px 14px}.wrong-closed-item small{display:block;color:var(--muted);font-size:11px;margin-top:3px}.wrong-closed-open{border:0;background:#e8f6ed;color:#226b48;border-radius:11px;padding:9px 10px;font-weight:850}.wrong-closed-section{display:flex;align-items:center;gap:8px;margin:14px 2px 8px;color:#287250;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:.04em}.wrong-closed-section:after{content:"";height:1px;background:#cfe5d7;flex:1}
    @media(max-width:1100px){.wrong2-toolbar.wrong-closure-toolbar{grid-template-columns:1fr 1fr}.wrong-closure-metrics{grid-template-columns:repeat(3,1fr)}.wrong-closed-item{grid-template-columns:1fr 1fr}.wrong-closed-open{grid-column:1/-1}}
    @media(max-width:620px){.wrong-closure-metrics{grid-template-columns:1fr}.wrong-closed-item{grid-template-columns:1fr}}
  `;
  document.head.appendChild(css);

  const allHistory=()=> (state.studyEvents||[]).filter(x=>x?.meta?.wrongRecord===true||x?.meta?.wrongClosed===true).slice().sort((a,b)=>(b.timestamp||0)-(a.timestamp||0));
  const openRows=()=>allHistory().filter(x=>x?.meta?.wrongRecord===true&&!x?.meta?.wrongClosed);
  const closedRows=()=>allHistory().filter(x=>x?.meta?.wrongClosed===true);
  const sourceLabel=x=>x?.source==='mini-test'?'Mini Test':x?.source==='source-question-result'?'Kaynak Soru':/photo|text|question|solve/.test(x?.source||'')?'Soru Çöz':/teacher/.test(x?.source||'')?'Kişisel Öğretmen':x?.source||'Çalışma';
  const cleanOutcome=v=>{v=String(v||'').trim();return v&&!/ayrıntılar hazırlanıyor|hazırlanıyor/i.test(v)?v:'Kazanım bilgisi yok'};

  function currentOpenVisible(){
    let a=openRows();
    const ex=document.getElementById('wrong2Exam')?.value||'all',sub=document.getElementById('wrong2Subject')?.value||'all',top=document.getElementById('wrong2Topic')?.value||'all',src=document.getElementById('wrong2Source')?.value||'all',q=(document.getElementById('wrong2Search')?.value||'').trim();
    if(ex!=='all')a=a.filter(x=>x.exam===ex);if(sub!=='all')a=a.filter(x=>x.subject===sub);if(top!=='all')a=a.filter(x=>x.topic===top);if(src!=='all')a=a.filter(x=>sourceLabel(x)===src);if(q){const z=norm(q);a=a.filter(x=>norm([x.subject,x.topic,x.meta?.solution?.curriculumOutcome,x.meta?.question?.text].join(' ')).includes(z))}return a;
  }
  function currentClosedVisible(){
    let a=closedRows();
    const ex=document.getElementById('wrong2Exam')?.value||'all',sub=document.getElementById('wrong2Subject')?.value||'all',top=document.getElementById('wrong2Topic')?.value||'all',src=document.getElementById('wrong2Source')?.value||'all',q=(document.getElementById('wrong2Search')?.value||'').trim();
    if(ex!=='all')a=a.filter(x=>x.exam===ex);if(sub!=='all')a=a.filter(x=>x.subject===sub);if(top!=='all')a=a.filter(x=>x.topic===top);if(src!=='all')a=a.filter(x=>sourceLabel(x)===src);if(q){const z=norm(q);a=a.filter(x=>norm([x.subject,x.topic,x.meta?.solution?.curriculumOutcome,x.meta?.question?.text].join(' ')).includes(z))}return a;
  }

  function patchEvent(id,changes){
    const ev=(state.studyEvents||[]).find(x=>x.id===id);if(!ev)return false;
    const meta={...(ev.meta||{}),...changes};
    try{window.YKSDataV5?.patch?.(id,{meta});return true}catch(e){console.warn('Yanlış durumu güncellenemedi',e);return false}
  }
  function audit(id,method,closed){
    const src=(state.studyEvents||[]).find(x=>x.id===id);if(!src)return;
    try{window.YKSDataV5?.record?.({source:closed?'wrong-closure':'wrong-reopen',exam:src.exam,track:src.track,subject:src.subject,topic:src.topic,curriculumOutcome:src.curriculumOutcome||src.meta?.solution?.curriculumOutcome||'',result:'unknown',difficulty:src.difficulty,interaction:closed?'closed-wrong':'reopened-wrong',questionCount:0,signals:[closed?'wrong-closed':'wrong-reopened'],meta:{wrongOf:id,method,at:Date.now()}},{persistNow:true})}catch{}
  }
  function closeWrong(id,method){
    const ev=(state.studyEvents||[]).find(x=>x.id===id);if(!ev||ev.meta?.wrongClosed)return false;
    const at=Date.now();
    if(!patchEvent(id,{wrongRecord:false,wrongClosed:true,wrongClosedAt:at,wrongCloseMethod:method,wrongCloseLabel:method==='retry-correct'?'Tekrar çözümde doğru':'Manuel kapatıldı'}))return false;
    audit(id,method,true);activeRetryId='';window.__activeWrongClosureId='';
    setTimeout(()=>{try{window.renderWrongV2?.();window.renderHome?.();window.renderStats?.()}catch{}},30);return true;
  }
  function reopenWrong(id){
    const ev=(state.studyEvents||[]).find(x=>x.id===id);if(!ev||!ev.meta?.wrongClosed)return false;
    if(!patchEvent(id,{wrongRecord:true,wrongClosed:false,wrongReopenedAt:Date.now(),wrongReopenedFrom:ev.meta?.wrongCloseMethod||''}))return false;
    audit(id,'manual-reopen',false);setTimeout(()=>{try{window.renderWrongV2?.();window.renderHome?.();window.renderStats?.()}catch{}},30);return true;
  }

  function closureMethodText(x){return x?.meta?.wrongCloseMethod==='retry-correct'?'Tekrar çözüldü ve doğru yapıldı':'Manuel olarak kapatıldı'}
  function fmtDate(ts){try{return new Date(ts).toLocaleString('tr-TR')}catch{return'—'}}

  function injectModalActions(id){
    const body=document.getElementById('wrong2ModalBody');if(!body)return;const x=allHistory().find(z=>z.id===id);if(!x)return;
    body.querySelectorAll('.wrong-closure-info,.wrong-closure-actions').forEach(n=>n.remove());
    if(x.meta?.wrongClosed){
      const info=document.createElement('div');info.className='wrong-closure-info';info.innerHTML=`<span class="wrong-closure-badge">✓ Kapatıldı</span><br><b>${esc(closureMethodText(x))}</b><br><small>${esc(fmtDate(x.meta?.wrongClosedAt))}</small><div class="wrong-closure-actions"><button type="button" class="wrong-closure-reopen">Tekrar Aç</button></div>`;body.appendChild(info);info.querySelector('.wrong-closure-reopen').onclick=()=>{if(reopenWrong(id)){document.getElementById('wrong2Modal')?.classList.remove('open')}};
    }else{
      const box=document.createElement('div');box.className='wrong-closure-actions';box.innerHTML='<button type="button" class="wrong-closure-manual">✓ Yanlışı Kapat</button>';body.appendChild(box);box.querySelector('.wrong-closure-manual').onclick=()=>{if(confirm('Bu yanlışı öğrendiğini düşünüyor ve kapatmak istiyor musun?')){if(closeWrong(id,'manual'))document.getElementById('wrong2Modal')?.classList.remove('open')}};
    }
  }

  function openClosedModal(x){
    modalWrongId=x.id;const m=x.meta||{},qu=m.question||{},sol=m.solution||{},body=document.getElementById('wrong2ModalBody'),modal=document.getElementById('wrong2Modal');if(!body||!modal)return;
    body.innerHTML=`<div class="wrong2-head"><div><h2 style="margin:0">✅ ${esc(x.topic||'Kapatılan yanlış')}</h2><p class="muted">${esc(`${x.exam} ${x.subject}`)} • ${esc(new Date(x.timestamp||Date.now()).toLocaleString('tr-TR'))}</p></div><button id="wrong2Close" class="wrong2-close">×</button></div><div class="wrong2-question">${qu.image?`<img src="${qu.image}" alt="Kapatılan yanlış">`:esc(qu.text||'Soru içeriği bulunamadı')}</div><div class="wrong2-grid"><div class="wrong2-detail"><small>Kazanım</small><b>${esc(cleanOutcome(sol.curriculumOutcome||x.curriculumOutcome))}</b></div><div class="wrong2-detail"><small>Kaynak</small><b>${esc(sourceLabel(x))}</b></div><div class="wrong2-detail"><small>Kapanma yolu</small><b>${esc(closureMethodText(x))}</b></div><div class="wrong2-detail"><small>Kapanma tarihi</small><b>${esc(fmtDate(m.wrongClosedAt))}</b></div></div><div class="wrong2-solution"><b>Doğru cevap: ${esc(sol.answer||m.correctAnswer||'—')}</b><p>${esc(sol.shortSolution||'Kısa çözüm kaydı yok.')}</p></div>`;
    body.querySelector('#wrong2Close').onclick=()=>modal.classList.remove('open');injectModalActions(x.id);modal.classList.add('open');
    const catalogId=m.catalogId,item=window.YKSQuestionCatalogV1?.all?.().find(z=>z.id===catalogId);if(item&&typeof window.getSourceQuestionCropUrl==='function'){window.getSourceQuestionCropUrl(catalogId).then(url=>{const qbox=body.querySelector('.wrong2-question');if(url&&qbox)qbox.innerHTML=`<img src="${url}" alt="${esc(`${item.year||''} ${item.exam} ${item.subject} Soru ${item.questionNo||''}`)}">`}).catch(()=>{})}
  }

  function renderClosedSection(host){
    host.querySelectorAll('.wrong-closed-wrap').forEach(n=>n.remove());
    const data=currentClosedVisible(),wrap=document.createElement('div');wrap.className='wrong-closed-wrap';
    if(statusMode==='open')return;
    if(statusMode==='closed'){
      host.querySelectorAll('.wrong2-list > .wrong2-item,.wrong2-list > .wrong2-section-label').forEach(n=>n.style.display='none');
      const oldEmpty=host.querySelector('.wrong2-empty');if(oldEmpty)oldEmpty.style.display='none';
    }
    wrap.innerHTML=`<div class="wrong-closed-section">Kapatılan yanlışlar • ${data.length}</div><div class="wrong-closed-list">${data.length?data.map(x=>`<div class="wrong-closed-item"><div><b>${esc(`${x.exam} ${x.subject}`)}</b><small>${esc(sourceLabel(x))}</small></div><div><b>${esc(x.topic||'Konu yok')}</b><small>${esc(closureMethodText(x))}</small></div><div><b>${esc(cleanOutcome(x.meta?.solution?.curriculumOutcome||x.curriculumOutcome))}</b></div><div><span class="wrong-closure-badge">✓ Kapatıldı</span><small>${esc(fmtDate(x.meta?.wrongClosedAt))}</small></div><button class="wrong-closed-open" data-closed-wrong-id="${esc(x.id)}">Kapatılanı Aç</button></div>`).join(''):'<div class="wrong2-empty"><h3>Kapatılan yanlış yok</h3><p>Bir yanlışı tekrar doğru çözerek veya manuel kapatarak burada biriktirebilirsin.</p></div>'}</div>`;host.appendChild(wrap);wrap.querySelectorAll('[data-closed-wrong-id]').forEach(b=>b.onclick=()=>{const x=closedRows().find(z=>z.id===b.dataset.closedWrongId);if(x)openClosedModal(x)});
  }

  function enhance(){
    if(enhancing)return;enhancing=true;
    try{
      const host=document.getElementById('wrong2Host'),toolbar=host?.querySelector('.wrong2-toolbar');if(!host||!toolbar)return;
      toolbar.classList.add('wrong-closure-toolbar');
      let sel=toolbar.querySelector('#wrongClosureStatus');if(!sel){sel=document.createElement('select');sel.id='wrongClosureStatus';sel.className='wrong-closure-status';sel.innerHTML='<option value="open">Açık yanlışlar</option><option value="closed">Kapatılanları göster</option><option value="all">Tümü</option>';toolbar.appendChild(sel);sel.onchange=e=>{statusMode=e.target.value;enhance()}}sel.value=statusMode;
      let metrics=host.querySelector('.wrong-closure-metrics');if(!metrics){metrics=document.createElement('div');metrics.className='wrong-closure-metrics';host.insertBefore(metrics,toolbar)}
      const open=openRows().length,closed=closedRows().length,total=open+closed,rate=total?Math.round(closed/total*100):0;metrics.innerHTML=`<div class="wrong-closure-metric"><b>${open}</b><small>Açık yanlış</small></div><div class="wrong-closure-metric closed"><b>${closed}</b><small>Kapatılan yanlış</small></div><div class="wrong-closure-metric rate"><b>%${rate}</b><small>Kapanma oranı</small></div>`;
      host.querySelectorAll('.wrong2-list > .wrong2-item,.wrong2-list > .wrong2-section-label').forEach(n=>n.style.display='');const oldEmpty=host.querySelector('.wrong2-empty');if(oldEmpty)oldEmpty.style.display='';renderClosedSection(host);
    }finally{enhancing=false}
  }

  document.addEventListener('pointerdown',e=>{
    const btn=e.target.closest('#wrong2Host [data-wrong2]');if(btn){const row=currentOpenVisible()[Number(btn.dataset.wrong2)];if(row){modalWrongId=row.id;window.__activeWrongClosureId=row.id}}
    const p=e.target.closest('[data-wrp-open]');if(p?.dataset?.wrpOpen){activeRetryId=p.dataset.wrpOpen;window.__activeWrongClosureId=activeRetryId}
    if(e.target.closest('.wrong2-source-open')&&modalWrongId){activeRetryId=modalWrongId;window.__activeWrongClosureId=modalWrongId}
  },true);

  document.addEventListener('click',e=>{
    const btn=e.target.closest('#wrong2Host [data-wrong2]');if(btn){const row=currentOpenVisible()[Number(btn.dataset.wrong2)];if(row)setTimeout(()=>injectModalActions(row.id),50)}
    if(e.target.closest('#sqCheck')){const id=window.__activeWrongClosureId||activeRetryId;if(id)setTimeout(()=>{const result=document.getElementById('sqResult');if(result?.classList.contains('correct')||/^\s*✅\s*Doğru/i.test(result?.textContent||'')){closeWrong(id,'retry-correct')}},50)}
    if(e.target.closest('#sqReturn,#sqBack')){setTimeout(()=>{activeRetryId='';window.__activeWrongClosureId=''},0)}
  },true);

  const boot=()=>{
    if(typeof window.renderWrongV2!=='function'){setTimeout(boot,100);return}
    if(!window.renderWrongV2.__closureWrapped){const base=window.renderWrongV2;const wrapped=function(){const r=base.apply(this,arguments);setTimeout(enhance,0);return r};wrapped.__closureWrapped=true;window.renderWrongV2=wrapped}
    const host=document.getElementById('wrong2Host');if(host){new MutationObserver(()=>setTimeout(enhance,0)).observe(host,{childList:true,subtree:false})}
    enhance();
  };
  window.closeWrongRecord=closeWrong;window.reopenWrongRecord=reopenWrong;window.getWrongClosureStats=()=>({open:openRows().length,closed:closedRows().length,total:allHistory().length,rate:allHistory().length?Math.round(closedRows().length/allHistory().length*100):0});
  boot();
})();
