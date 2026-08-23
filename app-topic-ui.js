(()=>{
  if(window.__topicUiV5)return;window.__topicUiV5=true;
  const escHtml=s=>typeof esc==='function'?esc(s):String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const norm=s=>String(s||'').toLocaleLowerCase('tr-TR');
  const filters={q:'',exam:'all',subject:'all',status:'all',sort:'priority'};

  const css=document.createElement('style');css.textContent=`
    /* Ana sayfa: konu kalabalığı yerine ders bazlı kısa öncelik özeti */
    #home #weakList .subject-priority-row{display:grid;grid-template-columns:minmax(155px,220px) minmax(90px,180px) 46px;align-items:center;gap:14px;padding:9px 0;border-bottom:1px solid var(--line)}
    #home #weakList .subject-priority-row:last-child{border-bottom:0}
    #home #weakList .subject-priority-name{min-width:0}.subject-priority-name b{display:block;font-size:14px;line-height:1.25;white-space:normal}.subject-priority-name small{display:block;margin-top:3px;color:var(--muted);font-size:10px;line-height:1.3}
    #home #weakList .subject-priority-row .bar{width:100%;min-width:0}.subject-priority-score{text-align:right;font-weight:900;font-size:14px}
    #home #weakList .home-subject-signal{display:inline-flex;margin-top:3px;padding:2px 6px;border-radius:999px;background:#eeeaff;color:#5a42d3;font-size:9px;font-weight:800}

    /* Konu Takip detay ekranı */
    .topic-v5-actions{display:flex;justify-content:flex-end;margin:0 0 12px}.topic-v5-actions button{min-height:44px}
    .topic-filter-bar{display:grid;grid-template-columns:minmax(220px,1.5fr) repeat(4,minmax(135px,.65fr));gap:9px;padding:12px;margin:0 0 14px;border:1px solid var(--line);background:var(--surface);border-radius:16px}
    .topic-filter-bar input,.topic-filter-bar select{height:42px;width:100%;border:1px solid var(--line);border-radius:11px;background:var(--surface);color:var(--ink);padding:0 11px;font:inherit;font-size:13px}
    .topic-filter-summary{display:flex;justify-content:space-between;align-items:center;gap:12px;margin:0 2px 10px;color:var(--muted);font-size:12px}
    #topicRows.topic-v5-list{display:grid;gap:5px}
    #topicRows .topic-v5-row{display:grid;grid-template-columns:minmax(280px,410px) minmax(150px,340px) 58px;align-items:center;gap:22px;padding:11px 6px;border-bottom:1px solid var(--line)}
    #topicRows .topic-v5-row:last-child{border-bottom:0}
    .topic-v5-title{min-width:0}.topic-v5-title b{display:block;font-size:14px;line-height:1.35}.topic-v5-title small{display:block;margin-top:4px;color:var(--muted);font-size:10px;line-height:1.35}.topic-v5-meta{display:flex;gap:5px;flex-wrap:wrap;margin-top:5px}.topic-v5-chip{padding:2px 6px;border-radius:999px;background:#f2f1f7;color:var(--muted);font-size:9px}.topic-v5-chip.signal{background:#eeeaff;color:#5a42d3}.topic-v5-score{text-align:right;font-weight:900;font-size:14px}
    #topicRows .topic-v5-row .bar{width:100%;max-width:340px;min-width:0}
    .topic-filter-empty{padding:32px 20px;text-align:center;color:var(--muted);border:1px dashed var(--line);border-radius:14px}
    @media(max-width:1100px){.topic-filter-bar{grid-template-columns:1fr 1fr 1fr}.topic-filter-bar input{grid-column:1/-1}#topicRows .topic-v5-row{grid-template-columns:minmax(220px,340px) minmax(130px,260px) 52px;gap:14px}}
    @media(max-width:720px){#home #weakList .subject-priority-row{grid-template-columns:minmax(130px,1fr) 90px 42px;gap:9px}.topic-filter-bar{grid-template-columns:1fr 1fr}.topic-filter-bar input{grid-column:1/-1}#topicRows .topic-v5-row{grid-template-columns:1fr 54px;gap:8px 12px}#topicRows .topic-v5-row .bar{grid-column:1/-1;grid-row:2;max-width:none}.topic-v5-score{grid-column:2;grid-row:1}.topic-v5-title{grid-column:1;grid-row:1}}
  `;document.head.appendChild(css);

  function metrics(){return window.getLearningSnapshot?.().metrics||window.YKSDataV5?.getLearningModel?.().topics||[]}
  function scoreValue(m){return m.score===null||m.score===undefined?null:Number(m.score)}
  function subjectSummary(){
    const groups=new Map();
    metrics().forEach(m=>{
      const key=`${m.exam||'TYT'}|${m.subject||'Genel'}`;
      if(!groups.has(key))groups.set(key,{exam:m.exam||'TYT',subject:m.subject||'Genel',topics:[],total:0,correct:0,wrong:0,signals:0,priorityIndex:-Infinity,scores:[]});
      const g=groups.get(key);g.topics.push(m);g.total+=Number(m.total||0);g.correct+=Number(m.correct||0);g.wrong+=Number(m.wrong||0);g.signals+=Number(m.recentSignals||0);g.priorityIndex=Math.max(g.priorityIndex,Number(m.priorityIndex||0));const s=scoreValue(m);if(s!==null)g.scores.push({score:s,weight:Math.max(1,Number(m.total||1))});
    });
    return [...groups.values()].map(g=>{const weight=g.scores.reduce((a,x)=>a+x.weight,0),weighted=g.scores.reduce((a,x)=>a+x.score*x.weight,0);g.score=weight?Math.round(weighted/weight):null;return g}).sort((a,b)=>b.priorityIndex-a.priorityIndex||((a.score??101)-(b.score??101))||b.signals-a.signals);
  }

  function renderHomeSubjects(){
    const box=document.getElementById('weakList');if(!box)return;
    const rows=subjectSummary().slice(0,4);
    if(!rows.length){box.innerHTML='<div class="home-empty">Henüz ölçülmüş ders yok. Mini Test veya soru çözümündeki geri bildirimlerle otomatik oluşacak.</div>';return}
    box.innerHTML=rows.map(g=>`<div class="subject-priority-row"><div class="subject-priority-name"><b>${escHtml(`${g.exam} ${g.subject}`)}</b><small>${g.topics.length} konu • ${g.total} ölçüm${g.signals?` • ${g.signals} zorlanma`:''}</small>${g.signals?'<span class="home-subject-signal">Öncelikli ders</span>':''}</div><div class="bar ${g.score!==null&&g.score<60?'warning':''}"><i style="width:${g.score===null?5:Math.max(3,g.score)}%"></i></div><div class="subject-priority-score">${g.score===null?'—':`%${g.score}`}</div></div>`).join('');
  }

  function ensureFilterUi(){
    const box=document.getElementById('topicRows');if(!box)return null;
    let actions=document.getElementById('topicV5Actions');if(!actions){actions=document.createElement('div');actions.id='topicV5Actions';actions.className='topic-v5-actions';actions.innerHTML='<button id="openTopicTestEntry" class="primary">＋ Test Sonucu Ekle</button>';box.parentNode.insertBefore(actions,box);actions.querySelector('button').onclick=()=>{go('topic-test-entry');window.YKSTopicTestEntry?.open?.()}}
    let bar=document.getElementById('topicFilterBar');
    if(!bar){
      bar=document.createElement('div');bar.id='topicFilterBar';bar.className='topic-filter-bar';bar.innerHTML=`<input id="topicSearch" type="search" placeholder="🔎 Konu veya ders ara..."><select id="topicExam"><option value="all">Tüm sınavlar</option><option value="TYT">TYT</option><option value="AYT">AYT</option></select><select id="topicSubject"><option value="all">Tüm dersler</option></select><select id="topicStatus"><option value="all">Tüm seviyeler</option><option value="critical">Kritik · %0–39</option><option value="developing">Gelişiyor · %40–69</option><option value="good">İyi · %70+</option><option value="unmeasured">Ölçülmemiş</option></select><select id="topicSort"><option value="priority">Önceliğe göre</option><option value="low">Başarı düşükten</option><option value="high">Başarı yüksekten</option><option value="name">Konu A–Z</option></select>`;
      const summary=document.createElement('div');summary.id='topicFilterSummary';summary.className='topic-filter-summary';box.parentNode.insertBefore(bar,box);box.parentNode.insertBefore(summary,box);
      const rerender=()=>renderTopicDetail();
      bar.querySelector('#topicSearch').oninput=e=>{filters.q=e.target.value.trim();rerender()};
      bar.querySelector('#topicExam').onchange=e=>{filters.exam=e.target.value;filters.subject='all';rerender()};
      bar.querySelector('#topicSubject').onchange=e=>{filters.subject=e.target.value;rerender()};
      bar.querySelector('#topicStatus').onchange=e=>{filters.status=e.target.value;rerender()};
      bar.querySelector('#topicSort').onchange=e=>{filters.sort=e.target.value;rerender()};
    }
    return bar;
  }
  function statusMatch(m){const s=scoreValue(m);if(filters.status==='all')return true;if(filters.status==='unmeasured')return s===null;if(s===null)return false;if(filters.status==='critical')return s<40;if(filters.status==='developing')return s>=40&&s<70;if(filters.status==='good')return s>=70;return true}
  function fillSubjects(all){
    const sel=document.getElementById('topicSubject');if(!sel)return;
    const available=all.filter(m=>filters.exam==='all'||m.exam===filters.exam);const list=[...new Set(available.map(m=>m.subject).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'tr'));
    sel.innerHTML='<option value="all">Tüm dersler</option>'+list.map(x=>`<option value="${escHtml(x)}">${escHtml(x)}</option>`).join('');if(!list.includes(filters.subject))filters.subject='all';sel.value=filters.subject;
  }
  function renderTopicDetail(){
    const box=document.getElementById('topicRows');if(!box)return;ensureFilterUi();const all=[...metrics()];fillSubjects(all);
    let rows=all.filter(m=>(filters.exam==='all'||m.exam===filters.exam)&&(filters.subject==='all'||m.subject===filters.subject)&&statusMatch(m));
    if(filters.q){const q=norm(filters.q);rows=rows.filter(m=>norm(`${m.exam} ${m.subject} ${m.topic} ${m.curriculumOutcome||''}`).includes(q))}
    if(filters.sort==='low')rows.sort((a,b)=>(scoreValue(a)??101)-(scoreValue(b)??101)||b.total-a.total);else if(filters.sort==='high')rows.sort((a,b)=>(scoreValue(b)??-1)-(scoreValue(a)??-1)||b.total-a.total);else if(filters.sort==='name')rows.sort((a,b)=>String(a.topic).localeCompare(String(b.topic),'tr'));else rows.sort((a,b)=>Number(b.priorityIndex||0)-Number(a.priorityIndex||0)||((scoreValue(a)??101)-(scoreValue(b)??101)));
    const sm=document.getElementById('topicFilterSummary');if(sm)sm.innerHTML=`<span><b>${rows.length}</b> konu gösteriliyor</span><span>Toplam ${all.length} konu</span>`;
    box.classList.add('topic-v5-list');
    box.innerHTML=rows.length?rows.map(m=>{const s=scoreValue(m);return `<div class="topic-v5-row"><div class="topic-v5-title"><b>${escHtml(m.topic||'Konu belirtilmemiş')}</b><small>${escHtml(`${m.exam} ${m.subject}`)} • ${m.total} ölçüm • ${m.correct} doğru • ${m.wrong} yanlış</small><div class="topic-v5-meta"><span class="topic-v5-chip">${escHtml(m.confidence||'Ölçüm yok')}</span>${m.recentSignals?`<span class="topic-v5-chip signal">${m.recentSignals} zorlanma sinyali</span>`:''}</div></div><div class="bar ${s!==null&&s<60?'warning':''}"><i style="width:${s===null?5:Math.max(3,s)}%"></i></div><div class="topic-v5-score">${s===null?'—':`%${s}`}</div></div>`}).join(''):'<div class="topic-filter-empty">Seçtiğin filtrelere uygun konu bulunamadı.</div>';
  }

  const baseHome=window.renderHome;
  if(typeof baseHome==='function'){const wrapped=function(){const r=baseHome.apply(this,arguments);renderHomeSubjects();return r};window.renderHome=wrapped;try{renderHome=wrapped}catch{}}
  window.renderTopics=renderTopicDetail;try{renderTopics=renderTopicDetail}catch{}
  renderHomeSubjects();if(document.getElementById('topics')?.classList.contains('active'))renderTopicDetail();
})();
