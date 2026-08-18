(()=>{
  state.favorites ??= [];
  const PAGE_SIZE=10;
  let currentPage=1,searchText='',examFilter='all',subjectFilter='all',sortMode='newest';

  const style=document.createElement('style');
  style.textContent=`
    .fav-library{position:fixed;top:0;right:0;bottom:0;z-index:9997;background:var(--bg,#f6f7fb);overflow:auto;display:none;color:var(--ink)}
    .fav-library.open{display:block}
    .fav-library-inner{max-width:1240px;margin:0 auto;padding:28px 30px 54px}
    .fav-library-head{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:20px}
    .fav-library-title{display:flex;align-items:center;gap:14px}.fav-library-title h1{margin:0}.fav-library-title p{margin:3px 0 0}
    .fav-library-back{width:46px;height:46px;border-radius:14px;border:1px solid var(--line);background:var(--surface);font-size:21px;color:var(--ink)}
    .fav-count-badge{display:inline-flex;align-items:center;justify-content:center;min-width:34px;height:30px;padding:0 10px;border-radius:999px;background:#eeeaff;color:#553fd1;font-weight:900}
    .fav-toolbar{display:grid;grid-template-columns:minmax(240px,1.7fr) repeat(3,minmax(145px,.7fr));gap:10px;padding:14px;background:var(--surface);border:1px solid var(--line);border-radius:19px;box-shadow:0 8px 24px rgba(24,29,70,.04);margin-bottom:14px}
    .fav-toolbar input,.fav-toolbar select{width:100%;height:46px;border:1px solid var(--line);border-radius:13px;background:var(--surface);color:var(--ink);padding:0 13px;font:inherit}
    .fav-toolbar .fav-search{position:relative}.fav-toolbar .fav-search input{padding-left:42px}.fav-toolbar .fav-search span{position:absolute;left:14px;top:12px;font-size:19px}
    .fav-summary{display:flex;justify-content:space-between;align-items:center;gap:12px;margin:12px 2px 16px;color:var(--muted)}
    .fav-library-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
    .fav-card{display:grid;grid-template-columns:150px minmax(0,1fr);gap:15px;border:1px solid var(--line);border-radius:19px;background:var(--surface);padding:14px;box-shadow:0 8px 24px rgba(24,29,70,.045);min-height:155px}
    .fav-card-thumb{width:150px;height:125px;border-radius:14px;background:#f6f5fb;display:grid;place-items:center;overflow:hidden;padding:9px;color:var(--muted);font-size:12px;white-space:pre-wrap}
    .fav-card-thumb img{width:100%;height:100%;object-fit:contain}
    .fav-card-main{min-width:0;display:flex;flex-direction:column}.fav-card-main h3{margin:7px 0 6px;font-size:17px;line-height:1.35}.fav-card-main p{margin:0;color:var(--muted);font-size:14px;line-height:1.4}
    .fav-card-chips{display:flex;gap:6px;flex-wrap:wrap}.fav-chip{display:inline-flex;padding:5px 9px;border-radius:999px;background:#f1efff;color:#5742cf;font-size:12px;font-weight:800}.fav-chip.soft{background:#f4f5f8;color:var(--muted)}
    .fav-card-actions{display:flex;gap:8px;margin-top:auto;padding-top:12px}.fav-card-actions button{min-height:39px}
    .fav-card-actions .open{flex:1;background:#eeeaff;color:#533dcf;border:0;border-radius:12px;font-weight:850}.fav-card-actions .delete{width:42px;border:1px solid var(--line);background:transparent;border-radius:12px;color:var(--muted)}
    .fav-empty-page{grid-column:1/-1;text-align:center;padding:70px 20px;border:1px dashed var(--line);border-radius:20px;background:var(--surface)}.fav-empty-page .star{font-size:46px;margin-bottom:10px}
    .fav-pagination{display:flex;align-items:center;justify-content:center;gap:10px;margin-top:22px}.fav-pagination button{min-width:44px;height:42px;border:1px solid var(--line);background:var(--surface);border-radius:12px;color:var(--ink)}.fav-pagination button.active{background:#6747eb;color:white;border-color:#6747eb}.fav-pagination button:disabled{opacity:.4}
    #favNav .fav-nav-count{margin-left:auto;min-width:23px;height:23px;border-radius:999px;background:#eeeaff;color:#553fd1;display:inline-grid;place-items:center;font-size:11px;font-weight:900;padding:0 6px}
    #favHome .fav-home-count{margin-left:6px;display:inline-flex;min-width:22px;height:22px;border-radius:999px;background:#eeeaff;color:#553fd1;align-items:center;justify-content:center;padding:0 6px;font-size:11px;font-weight:900}
    @media(max-width:1100px){.fav-library-grid{grid-template-columns:1fr}.fav-toolbar{grid-template-columns:1fr 1fr}.fav-toolbar .fav-search{grid-column:1/-1}.fav-card{grid-template-columns:130px minmax(0,1fr)}.fav-card-thumb{width:130px;height:110px}}
    @media(max-width:700px){.fav-library-inner{padding:18px 14px 40px}.fav-library-head{align-items:flex-start}.fav-library-title h1{font-size:27px}.fav-toolbar{grid-template-columns:1fr}.fav-toolbar .fav-search{grid-column:auto}.fav-card{grid-template-columns:88px minmax(0,1fr);padding:11px;gap:11px}.fav-card-thumb{width:88px;height:82px}.fav-card-actions{grid-column:1/-1}.fav-summary{font-size:13px}.fav-library-back{width:42px;height:42px}}
  `;
  document.head.appendChild(style);

  const shell=document.createElement('div');
  shell.id='favoritesLibrary';shell.className='fav-library';
  shell.innerHTML=`<div class="fav-library-inner">
    <div class="fav-library-head">
      <div class="fav-library-title"><button id="favLibraryBack" class="fav-library-back">←</button><div><div style="display:flex;align-items:center;gap:9px"><h1>⭐ Favorilerim</h1><span id="favLibraryCount" class="fav-count-badge">0</span></div><p class="muted">Kaydettiğin soruları ara, filtrele ve tekrar çöz.</p></div></div>
    </div>
    <div class="fav-toolbar">
      <div class="fav-search"><span>🔎</span><input id="favSearch" type="search" placeholder="Konu, ders, cevap veya soru içinde ara..."></div>
      <select id="favExam"><option value="all">Tüm sınavlar</option><option value="TYT">TYT</option><option value="AYT">AYT</option></select>
      <select id="favSubject"><option value="all">Tüm dersler</option></select>
      <select id="favSort"><option value="newest">En yeni önce</option><option value="oldest">En eski önce</option><option value="topic">Konuya göre A–Z</option></select>
    </div>
    <div class="fav-summary"><span id="favResultText">0 soru</span><span id="favPageText"></span></div>
    <div id="favLibraryGrid" class="fav-library-grid"></div>
    <div id="favPagination" class="fav-pagination"></div>
  </div>`;
  document.body.appendChild(shell);

  const grid=shell.querySelector('#favLibraryGrid'),countEl=shell.querySelector('#favLibraryCount'),resultText=shell.querySelector('#favResultText'),pageText=shell.querySelector('#favPageText'),pager=shell.querySelector('#favPagination');
  const search=shell.querySelector('#favSearch'),exam=shell.querySelector('#favExam'),subject=shell.querySelector('#favSubject'),sort=shell.querySelector('#favSort');

  function setShellLeft(){
    const sidebar=document.querySelector('.sidebar');
    let left=0;
    if(sidebar){const r=sidebar.getBoundingClientRect(),cs=getComputedStyle(sidebar);if(cs.display!=='none'&&r.width>80)left=Math.round(r.width)}
    shell.style.left=left+'px';
  }
  window.addEventListener('resize',()=>{if(shell.classList.contains('open'))setShellLeft()});

  function normalized(v){return String(v||'').toLocaleLowerCase('tr-TR')}
  function getExam(item){return String(item?.result?.exam||'').toUpperCase()}
  function getSubject(item){return String(item?.result?.subject||'').trim()}
  function getTopic(item){return String(item?.result?.topic||'').trim()}
  function getSaved(item){return new Date(item.savedAt||item.id||0).getTime()||0}

  function fillSubjectOptions(){
    const current=subjectFilter;
    const items=(state.favorites||[]).filter(x=>examFilter==='all'||getExam(x)===examFilter);
    const subjects=[...new Set(items.map(getSubject).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'tr'));
    subject.innerHTML='<option value="all">Tüm dersler</option>'+subjects.map(s=>`<option value="${esc(s)}">${esc(s)}</option>`).join('');
    subjectFilter=subjects.includes(current)?current:'all';subject.value=subjectFilter;
  }

  function filteredItems(){
    let items=[...(state.favorites||[])];
    if(examFilter!=='all')items=items.filter(x=>getExam(x)===examFilter);
    if(subjectFilter!=='all')items=items.filter(x=>getSubject(x)===subjectFilter);
    if(searchText){
      const q=normalized(searchText);
      items=items.filter(x=>normalized([x.text,x.result?.exam,x.result?.subject,x.result?.topic,x.result?.answer,x.result?.short_solution].filter(Boolean).join(' ')).includes(q));
    }
    if(sortMode==='oldest')items.sort((a,b)=>getSaved(a)-getSaved(b));
    else if(sortMode==='topic')items.sort((a,b)=>getTopic(a).localeCompare(getTopic(b),'tr'));
    else items.sort((a,b)=>getSaved(b)-getSaved(a));
    return items;
  }

  function renderQuestionMedia(item){
    const shot=document.querySelector('#solution .question-shot');if(!shot)return;
    shot.innerHTML='';
    if(item.image){const img=document.createElement('img');img.src=item.image;img.alt='Favori soru';img.style.maxWidth='100%';img.style.maxHeight='360px';img.style.borderRadius='12px';shot.appendChild(img)}
    else{const p=document.createElement('p');p.textContent=item.text||'Metin sorusu';p.style.whiteSpace='pre-wrap';p.style.textAlign='left';p.style.width='100%';shot.appendChild(p)}
  }

  function openSolution(item){
    try{lastLiveResult=item.result||{};applyLiveResult(lastLiveResult);renderQuestionMedia(item)}catch(e){console.warn('Favori çözüm açılamadı',e)}
    closeLibrary();go('solution');
  }

  function removeFavorite(item){
    if(!confirm('Bu soru favorilerden çıkarılsın mı?'))return;
    state.favorites=(state.favorites||[]).filter(x=>x.id!==item.id);save();
    const maxPage=Math.max(1,Math.ceil(filteredItems().length/PAGE_SIZE));currentPage=Math.min(currentPage,maxPage);fillSubjectOptions();render();updateLaunchCounts();
  }

  function cardHtml(item){
    const media=item.image?`<img src="${item.image}" alt="Favori soru">`:`${esc((item.text||'Metin sorusu').slice(0,170))}`;
    const examName=esc(getExam(item)||'—'),sub=esc(getSubject(item)||'Ders'),topic=esc(getTopic(item)||'Konu belirtilmemiş'),answer=esc(item.result?.answer||'—');
    const date=item.savedAt?new Date(item.savedAt).toLocaleDateString('tr-TR'):'';
    return `<div class="fav-card-thumb">${media}</div><div class="fav-card-main"><div class="fav-card-chips"><span class="fav-chip">${examName}</span><span class="fav-chip soft">${sub}</span>${date?`<span class="fav-chip soft">${esc(date)}</span>`:''}</div><h3>${topic}</h3><p>Cevap: <b>${answer}</b>${item.result?.difficulty?` • ${esc(item.result.difficulty)}`:''}</p><div class="fav-card-actions"><button class="open" data-open>Çözümü Aç</button><button class="delete" data-delete title="Favoriden çıkar">🗑️</button></div></div>`;
  }

  function renderPager(totalPages){
    pager.innerHTML='';if(totalPages<=1)return;
    const add=(label,p,disabled=false,active=false)=>{const b=document.createElement('button');b.textContent=label;b.disabled=disabled;b.classList.toggle('active',active);b.onclick=()=>{currentPage=p;render();shell.scrollTo({top:0,behavior:'smooth'})};pager.appendChild(b)};
    add('‹',Math.max(1,currentPage-1),currentPage===1);
    let start=Math.max(1,currentPage-2),end=Math.min(totalPages,start+4);start=Math.max(1,end-4);
    for(let p=start;p<=end;p++)add(String(p),p,false,p===currentPage);
    add('›',Math.min(totalPages,currentPage+1),currentPage===totalPages);
  }

  function render(){
    const all=(state.favorites||[]).length,items=filteredItems(),totalPages=Math.max(1,Math.ceil(items.length/PAGE_SIZE));currentPage=Math.min(Math.max(1,currentPage),totalPages);
    countEl.textContent=all;resultText.textContent=searchText||examFilter!=='all'||subjectFilter!=='all'?`${items.length} eşleşen favori`:`${all} favori soru`;pageText.textContent=items.length?`Sayfa ${currentPage} / ${totalPages}`:'';
    if(!items.length){grid.innerHTML=`<div class="fav-empty-page"><div class="star">⭐</div><h2>${all?'Aramana uygun soru bulunamadı':'Henüz favori soru yok'}</h2><p class="muted">${all?'Filtreleri değiştirerek tekrar dene.':'Çözüm ekranındaki Favori düğmesiyle önemli soruları burada biriktirebilirsin.'}</p></div>`;pager.innerHTML='';return}
    grid.innerHTML='';items.slice((currentPage-1)*PAGE_SIZE,currentPage*PAGE_SIZE).forEach(item=>{const card=document.createElement('article');card.className='fav-card';card.innerHTML=cardHtml(item);card.querySelector('[data-open]').onclick=()=>openSolution(item);card.querySelector('[data-delete]').onclick=()=>removeFavorite(item);grid.appendChild(card)});renderPager(totalPages);
  }

  function openLibrary(){
    const old=document.querySelector('.fav-modal-backdrop');if(old)old.classList.remove('open');
    setShellLeft();fillSubjectOptions();currentPage=1;render();shell.classList.add('open');document.body.style.overflow='hidden';search.focus({preventScroll:true});
  }
  function closeLibrary(){shell.classList.remove('open');document.body.style.overflow=''}
  shell.querySelector('#favLibraryBack').onclick=closeLibrary;
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&shell.classList.contains('open'))closeLibrary()});

  search.oninput=()=>{searchText=search.value.trim();currentPage=1;render()};
  exam.onchange=()=>{examFilter=exam.value;currentPage=1;fillSubjectOptions();render()};
  subject.onchange=()=>{subjectFilter=subject.value;currentPage=1;render()};
  sort.onchange=()=>{sortMode=sort.value;currentPage=1;render()};

  function updateLaunchCounts(){
    const n=(state.favorites||[]).length;
    const nav=document.getElementById('favNav');if(nav){let b=nav.querySelector('.fav-nav-count');if(!b){b=document.createElement('span');b.className='fav-nav-count';nav.appendChild(b)}if(b.textContent!==String(n))b.textContent=n;nav.onclick=e=>{e.preventDefault();openLibrary()}}
    const home=document.getElementById('favHome');if(home){let b=home.querySelector('.fav-home-count');if(!b){b=document.createElement('span');b.className='fav-home-count';home.querySelector('b')?.appendChild(b)}if(b.textContent!==String(n))b.textContent=n;home.onclick=e=>{e.preventDefault();openLibrary()}}
  }

  let tries=0;const timer=setInterval(()=>{tries++;const modal=document.querySelector('.fav-modal-backdrop');if(modal)modal.remove();updateLaunchCounts();if((document.getElementById('favNav')&&document.getElementById('favHome'))||tries>60)clearInterval(timer)},100);
  let lastCount=(state.favorites||[]).length;
  setInterval(()=>{const n=(state.favorites||[]).length;if(n!==lastCount){lastCount=n;updateLaunchCounts();if(shell.classList.contains('open')){fillSubjectOptions();render()}}},700);
  window.openFavoritesLibrary=openLibrary;
})();
