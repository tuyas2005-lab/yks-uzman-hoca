(()=>{
  const today=()=>new Date().toLocaleDateString('sv-SE');
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const norm=s=>String(s||'').toLocaleLowerCase('tr-TR');
  const wrongs=()=> (state.studyEvents||[]).filter(x=>x?.meta?.wrongRecord===true).slice().sort((a,b)=>(b.timestamp||0)-(a.timestamp||0));
  const reviewEvents=()=> (state.studyEvents||[]).filter(x=>x?.source==='wrong-review');
  const reviewedIds=()=>new Set(reviewEvents().filter(x=>x?.dateKey===today()).map(x=>x?.meta?.reviewOf).filter(Boolean));
  const reviewCount=id=>reviewEvents().filter(x=>x?.meta?.reviewOf===id).length;
  const topicCount=(topic,subject)=>wrongs().filter(x=>x.topic===topic&&x.subject===subject).length;
  const planEvent=()=> (state.studyEvents||[]).find(x=>x?.source==='wrong-review-plan'&&x?.dateKey===today());

  const styles=document.createElement('style');styles.textContent=`
    .wrong-review-priority{margin:0 0 14px;padding:15px;border:1px solid #ded7ff;border-radius:18px;background:linear-gradient(135deg,#f8f6ff,#fff);box-shadow:0 8px 24px rgba(79,61,172,.05)}
    .wrp-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:11px}.wrp-head h3{margin:0 0 4px;font-size:17px}.wrp-head p{margin:0;color:var(--muted);font-size:12px;line-height:1.45}.wrp-progress{white-space:nowrap;padding:6px 9px;border-radius:999px;background:#fff2d8;color:#8b5c11;font-size:11px;font-weight:900}.wrp-progress.done{background:#eaf8f0;color:#20704a}
    .wrp-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.wrp-card{display:grid;gap:7px;border:1px solid var(--line);background:var(--surface);border-radius:14px;padding:12px}.wrp-card.done{border-color:#bfe4cd;background:#f7fcf9}.wrp-top{display:flex;justify-content:space-between;gap:8px;align-items:center}.wrp-no{display:inline-grid;place-items:center;width:25px;height:25px;border-radius:8px;background:#eeeaff;color:#5741ce;font-size:11px;font-weight:900}.wrp-status{font-size:10px;font-weight:850;color:#7a6b9a}.wrp-card.done .wrp-status{color:#23724d}.wrp-card b{font-size:13px}.wrp-card small{color:var(--muted);line-height:1.35}.wrp-reason{font-size:10px;font-weight:850;padding:5px 7px;border-radius:9px;background:#f5f2ff;color:#5e49c6;width:max-content;max-width:100%}.wrp-open{border:0;border-radius:10px;padding:9px 10px;background:#6747eb;color:#fff;font-weight:850}.wrp-card.done .wrp-open{background:#edf2ef;color:#557064}.wrong2-item.wrong2-priority{border-color:#cfc5ff;box-shadow:inset 4px 0 0 #7053ef}.wrong2-task-tag{display:inline-flex;margin-top:5px;padding:4px 6px;border-radius:8px;background:#eeeaff;color:#583fcf;font-size:9px;font-weight:900}
    @media(max-width:900px){.wrp-grid{grid-template-columns:1fr}}`;
  document.head.appendChild(styles);

  function choosePlan(){
    const a=wrongs();if(!a.length)return[];
    const selected=[];
    const push=(x,reason)=>{if(x&&!selected.some(s=>s.id===x.id))selected.push({id:x.id,reason})};

    push(a[0],'En son yaptığın yanlış');

    const repeated=[...a].filter(x=>!selected.some(s=>s.id===x.id)).sort((x,y)=>{
      const cx=topicCount(x.topic,x.subject),cy=topicCount(y.topic,y.subject);
      return cy-cx || (y.timestamp||0)-(x.timestamp||0);
    }).find(x=>topicCount(x.topic,x.subject)>1);
    if(repeated)push(repeated,`Tekrarlanan konu • ${topicCount(repeated.topic,repeated.subject)} yanlış`);

    const scored=a.filter(x=>!selected.some(s=>s.id===x.id)).map((x,i)=>{
      const unable=x.meta?.wrongKind==='unable'?35:0;
      const hard=/zor/i.test(String(x.difficulty||''))?18:0;
      const fresh=reviewCount(x.id)===0?22:Math.max(0,10-reviewCount(x.id)*5);
      const repeat=Math.min(20,topicCount(x.topic,x.subject)*5);
      const recency=Math.max(0,18-i);
      const sameTopic=selected.some(s=>{const r=a.find(z=>z.id===s.id);return r&&r.topic===x.topic&&r.subject===x.subject})?-7:0;
      return{x,score:unable+hard+fresh+repeat+recency+sameTopic};
    }).sort((p,q)=>q.score-p.score)[0]?.x;
    if(scored){
      const reason=scored.meta?.wrongKind==='unable'?'Yapamadığın soru':/zor/i.test(String(scored.difficulty||''))?'Zor soru • tekrar önerildi':reviewCount(scored.id)===0?'Henüz tekrar edilmedi':'Öncelikli kazanım tekrarı';
      push(scored,reason);
    }

    for(const x of a){if(selected.length>=3)break;push(x,'Güncel yanlış tekrarı')}
    return selected.slice(0,3);
  }

  function ensurePlan(){
    const a=wrongs();if(!a.length)return[];
    const existing=planEvent();
    if(existing?.meta?.targets?.length){
      const valid=existing.meta.targets.filter(t=>a.some(x=>x.id===t.id));
      if(valid.length===existing.meta.targets.length)return valid.slice(0,3);
      const used=new Set(valid.map(x=>x.id));const fill=choosePlan().filter(x=>!used.has(x.id));return[...valid,...fill].slice(0,3);
    }
    const targets=choosePlan();
    try{window.YKSDataV5?.record?.({source:'wrong-review-plan',exam:'',subject:'',topic:'',result:'unknown',interaction:'daily-plan',questionCount:0,signals:['wrong-review-plan'],meta:{targets,createdAt:Date.now()}},{persistNow:true})}catch(e){console.warn('Yanlış tekrar planı kaydedilemedi',e)}
    return targets;
  }

  const targetDefs=()=>ensurePlan();
  const targetIds=()=>new Set(targetDefs().map(x=>x.id));
  const targets=()=>{const map=new Map(wrongs().map(x=>[x.id,x]));return targetDefs().map(t=>({item:map.get(t.id),reason:t.reason})).filter(x=>x.item)};

  function progress(){const t=targets(),done=reviewedIds();const reviewed=t.filter(x=>done.has(x.item.id)).length;return{total:t.length,reviewed,complete:t.length===0||reviewed>=t.length,targets:t}}
  window.getWrongReviewProgress=progress;
  window.getWrongReviewTargets=()=>targets().map(x=>x.item);

  function recordReview(id){
    if(!targetIds().has(id))return;
    const src=(state.studyEvents||[]).find(x=>x.id===id);if(!src)return;
    const exists=(state.studyEvents||[]).some(x=>x.source==='wrong-review'&&x.dateKey===today()&&x.meta?.reviewOf===id);if(exists){patchHome();patchPriorityPanel();return}
    try{window.YKSDataV5?.record?.({source:'wrong-review',exam:src.exam,track:src.track,subject:src.subject,topic:src.topic,curriculumOutcome:src.curriculumOutcome||src.meta?.solution?.curriculumOutcome||'',result:'unknown',difficulty:src.difficulty,interaction:'reviewed',questionCount:0,signals:['reviewed-wrong'],meta:{reviewOf:id,reviewedAt:Date.now(),dailyPriority:true}},{persistNow:true})}catch(e){console.warn('Yanlış tekrar kaydı oluşturulamadı',e)}
    patchHome();patchPriorityPanel();
  }

  function visibleRows(){
    let a=wrongs();const ex=document.getElementById('wrong2Exam')?.value||'all',sub=document.getElementById('wrong2Subject')?.value||'all',top=document.getElementById('wrong2Topic')?.value||'all',src=document.getElementById('wrong2Source')?.value||'all',q=(document.getElementById('wrong2Search')?.value||'').trim();
    const sourceLabel=x=>x?.source==='mini-test'?'Mini Test':x?.source==='source-question-result'?'Kaynak Soru':/photo|text|question|solve/.test(x?.source||'')?'Soru Çöz':/teacher/.test(x?.source||'')?'Kişisel Öğretmen':x?.source||'Çalışma';
    if(ex!=='all')a=a.filter(x=>x.exam===ex);if(sub!=='all')a=a.filter(x=>x.subject===sub);if(top!=='all')a=a.filter(x=>x.topic===top);if(src!=='all')a=a.filter(x=>sourceLabel(x)===src);if(q){const z=norm(q);a=a.filter(x=>norm([x.subject,x.topic,x.meta?.solution?.curriculumOutcome,x.meta?.question?.text].join(' ')).includes(z))}return a;
  }

  function patchWrongButtons(){
    const host=document.getElementById('wrong2Host');if(!host)return;const rows=visibleRows(),ids=targetIds();
    host.querySelectorAll('[data-wrong2]').forEach((btn,i)=>{
      const row=rows[i];if(!row)return;btn.dataset.wrongId=row.id;const wrap=btn.closest('.wrong2-item');wrap?.classList.toggle('wrong2-priority',ids.has(row.id));
      if(ids.has(row.id)&&wrap&&!wrap.querySelector('.wrong2-task-tag')){const tag=document.createElement('span');tag.className='wrong2-task-tag';tag.textContent='🎯 Bugünün görevi';wrap.children[1]?.appendChild(tag)}
      if(btn.dataset.reviewTaskBound)return;btn.dataset.reviewTaskBound='1';btn.addEventListener('click',()=>{const id=btn.dataset.wrongId;if(id)recordReview(id)},true);
    });
  }

  function fallbackModal(x){
    const modal=document.getElementById('wrong2Modal'),body=document.getElementById('wrong2ModalBody');if(!modal||!body)return;
    const m=x.meta||{},qu=m.question||{},sol=m.solution||{};body.innerHTML=`<div class="wrong2-head"><div><h2 style="margin:0">❌ ${esc(x.topic||'Yanlış soru')}</h2><p class="muted">${esc(`${x.exam} ${x.subject}`)}</p></div><button id="wrong2Close" class="wrong2-close">×</button></div><div class="wrong2-question">${qu.image?`<img src="${qu.image}" alt="Yanlış soru">`:esc(qu.text||'Soru içeriği bulunamadı')}</div><div class="wrong2-grid"><div class="wrong2-detail"><small>Kazanım</small><b>${esc(sol.curriculumOutcome||x.curriculumOutcome||'Kazanım bilgisi yok')}</b></div><div class="wrong2-detail"><small>Zorluk</small><b>${esc(x.difficulty||'—')}</b></div></div><div class="wrong2-solution"><b>Doğru cevap: ${esc(sol.answer||m.correctAnswer||'—')}</b><p>${esc(sol.shortSolution||'Kısa çözüm kaydı yok.')}</p></div>`;body.querySelector('#wrong2Close').onclick=()=>modal.classList.remove('open');modal.classList.add('open');
  }

  function openTarget(id){
    const x=wrongs().find(z=>z.id===id);if(!x)return;recordReview(id);
    const catalogId=x.meta?.catalogId,item=window.YKSQuestionCatalogV1?.all?.().find(z=>z.id===catalogId);
    if(item&&typeof window.openSourceQuestion==='function'&&(!window.isSourceQuestionReady||window.isSourceQuestionReady(item))){window.openSourceQuestion(item,{type:'wrong',wrongId:x.id,returnScreen:'wrong'});return}
    const btn=document.querySelector(`#wrong2Host [data-wrong-id="${CSS.escape(id)}"]`);if(btn){btn.click();return}fallbackModal(x);
  }

  function patchPriorityPanel(){
    const host=document.getElementById('wrong2Host');if(!host)return;const p=progress();let panel=host.querySelector('.wrong-review-priority');if(!panel){panel=document.createElement('div');panel.className='wrong-review-priority';const toolbar=host.querySelector('.wrong2-toolbar');toolbar?.insertAdjacentElement('afterend',panel)}
    if(!p.total){panel.innerHTML='<div class="wrp-head"><div><h3>🎯 Bugünün Yanlış Tekrarı</h3><p>Şu anda tekrar bekleyen yanlış yok.</p></div><span class="wrp-progress done">Tamam</span></div>';return}
    const done=reviewedIds();panel.innerHTML=`<div class="wrp-head"><div><h3>🎯 Bugünün ${p.total} Öncelikli Yanlışı</h3><p>Rastgele değil: son yanlış, tekrar eden konu ve öğrenme açısından öncelikli kayıt seçildi.</p></div><span class="wrp-progress ${p.complete?'done':''}">${p.reviewed}/${p.total} incelendi</span></div><div class="wrp-grid">${p.targets.map((t,i)=>{const x=t.item,d=done.has(x.id);return`<div class="wrp-card ${d?'done':''}"><div class="wrp-top"><span class="wrp-no">${i+1}</span><span class="wrp-status">${d?'✓ İncelendi':'Bekliyor'}</span></div><b>${esc(`${x.exam} ${x.subject}`)} • ${esc(x.topic||'Konu yok')}</b><small>${esc(x.meta?.solution?.curriculumOutcome||x.curriculumOutcome||'Kazanım bilgisi yok')}</small><span class="wrp-reason">${esc(t.reason)}</span><button class="wrp-open" data-wrp-open="${esc(x.id)}">${d?'Tekrar Aç':'Yanlışı İncele →'}</button></div>`}).join('')}</div>`;
    panel.querySelectorAll('[data-wrp-open]').forEach(b=>b.onclick=()=>openTarget(b.dataset.wrpOpen));
  }

  function patchHome(){
    const plan=document.getElementById('dailyPlan');if(!plan)return;const item=[...plan.querySelectorAll('[data-home-task]')].find(el=>/yanlış/i.test(el.querySelector('strong')?.textContent||''));if(!item)return;const p=progress(),strong=item.querySelector('strong'),small=item.querySelector('small'),pill=item.querySelector('.pill'),check=item.querySelector('.check');
    if(p.total===0){if(strong)strong.textContent='Tekrar bekleyen yanlış yok';if(small)small.textContent='Yeni bir yanlış oluştuğunda burada tekrar görevi açılır.'}else{if(strong)strong.textContent=`Bugünün öncelikli yanlışları • ${p.reviewed}/${p.total}`;if(small)small.textContent='Sistem bugün incelemen gereken yanlışları senin için seçti.'}
    item.classList.toggle('done',p.complete);if(check)check.textContent=p.complete?'✓':String(Math.max(1,p.total));if(pill){pill.textContent=p.complete?'Tamam':`${p.reviewed}/${p.total} İncele`;pill.className=`pill ${p.complete?'green':'orange'}`}
    item.onclick=()=>{go('wrong');setTimeout(()=>document.querySelector('.wrong-review-priority')?.scrollIntoView({behavior:'smooth',block:'start'}),80)};
  }

  const hook=()=>{
    if(typeof window.renderWrongV2==='function'&&!window.renderWrongV2.__reviewTaskWrapped){const base=window.renderWrongV2;const wrapped=function(){const r=base.apply(this,arguments);setTimeout(()=>{patchWrongButtons();patchPriorityPanel()},0);return r};wrapped.__reviewTaskWrapped=true;window.renderWrongV2=wrapped;try{renderWrongV2=wrapped}catch{}}
    if(typeof window.renderHome==='function'&&!window.renderHome.__wrongReviewWrapped){const base=window.renderHome;const wrapped=function(){const r=base.apply(this,arguments);setTimeout(patchHome,0);return r};wrapped.__wrongReviewWrapped=true;window.renderHome=wrapped;try{renderHome=wrapped}catch{}}
    patchWrongButtons();patchPriorityPanel();patchHome();
  };
  let tries=0;const timer=setInterval(()=>{tries++;hook();if((window.renderWrongV2&&window.renderHome)||tries>80)clearInterval(timer)},100);
  document.addEventListener('click',e=>{if(e.target.closest('[data-go="home"],#favLibraryBack'))setTimeout(patchHome,40)},true);
})();
