(()=>{
  const DEFAULT_FX=47.9105;
  const FEATURE_LABELS={
    solve:'Soru çözümü',details:'Detaylı çözüm','mini-test':'Mini Test',teacher:'Kişisel Öğretmen',
    similar:'Benzer Soru',explain:'Burada Takıldım',counselor:'Rehber Öğretmen',coach:'YKS Koçu'
  };
  state.costTracker??={records:[],fxRate:DEFAULT_FX};
  state.costTracker.records??=[];
  state.costTracker.fxRate=Number(state.costTracker.fxRate||DEFAULT_FX);

  const todayKey=()=>new Date().toLocaleDateString('sv-SE');
  const monthKey=()=>todayKey().slice(0,7);
  const money=usd=>{
    const tl=Number(usd||0)*Number(state.costTracker.fxRate||DEFAULT_FX);
    if(tl>0&&tl<0.01)return'< ₺0,01';
    return '₺'+tl.toLocaleString('tr-TR',{minimumFractionDigits:2,maximumFractionDigits:2});
  };
  const compactTokens=n=>Number(n||0).toLocaleString('tr-TR');

  function recordUsage(res,url){
    try{
      const input=Number(res.headers.get('X-YKS-Input-Tokens')||0);
      const output=Number(res.headers.get('X-YKS-Output-Tokens')||0);
      const cached=Number(res.headers.get('X-YKS-Cached-Tokens')||0);
      const costUsd=Number(res.headers.get('X-YKS-Cost-USD')||0);
      if(!input&&!output&&!costUsd)return;
      const feature=res.headers.get('X-YKS-Feature')||String(url||'api').split('/').pop()||'api';
      const model=res.headers.get('X-YKS-Model')||'—';
      state.costTracker.records.push({id:Date.now()+Math.random(),dateKey:todayKey(),feature,model,input,output,cached,costUsd});
      if(state.costTracker.records.length>1500)state.costTracker.records=state.costTracker.records.slice(-1500);
      save();
      renderCostStrip();
      if(document.getElementById('cost')?.classList.contains('active'))renderCostScreen();
    }catch{}
  }

  function hasDetailHeader(headers){
    try{return new Headers(headers||{}).get('X-YKS-Detail')==='1'}catch{return false}
  }

  // Otomatik ayrıntı çağrısını sunucuya göndermiyoruz. Manuel detay çağrısı X-YKS-Detail ile geçer.
  if(!window.__lowCostFetchWrapped){
    const baseFetch=window.fetch.bind(window);
    window.fetch=async(input,init={})=>{
      const url=typeof input==='string'?input:String(input?.url||'');
      if(url.includes('/api/enrich')&&!hasDetailHeader(init?.headers))return new Response(null,{status:204});
      const res=await baseFetch(input,init);
      if(url.includes('/api/'))recordUsage(res,url);
      return res;
    };
    window.__lowCostFetchWrapped=true;
  }

  function detailMissing(x){
    if(!x)return true;
    const vals=[x.curriculum_outcome,x.why,x.tip,x.distractor,x.exam_note];
    return vals.some(v=>!v||/ayrıntılar hazırlanıyor|ayrıntı hazırlanıyor/i.test(String(v)));
  }

  function economyPlaceholder(x){
    if(!detailMissing(x))return;
    const steps=document.getElementById('solSteps');
    if(steps)steps.innerHTML=`<div class="step">${esc(x.short_solution||'Kısa çözüm hazır.')}</div>`;
    const why=document.getElementById('solWhy');
    if(why)why.innerHTML='<b>💰 Ekonomi modu</b><p>Kısa çözüm hazır. Adım adım çözüm, kazanım, püf noktası ve çeldirici yalnızca istersen oluşturulur.</p>';
    const tip=document.getElementById('solTip');if(tip)tip.textContent='Detaylı çözüm henüz yüklenmedi.';
    const dis=document.getElementById('solDistractor');if(dis)dis.textContent='İstersen Detaylı Çözüm veya Püf Noktası düğmesini kullan.';
    const note=document.getElementById('solExamNote');if(note)note.textContent='Bu sayede her soruda ikinci API çağrısı yapılmaz.';
  }

  let detailPromise=null;
  async function ensureDetails(){
    const snapshot=lastLiveResult;
    if(!snapshot){alert('Önce bir soru çözmelisin.');return null}
    if(!detailMissing(snapshot))return snapshot;
    if(detailPromise)return detailPromise;
    const btn=document.getElementById('loadSolutionDetails');
    if(btn){btn.disabled=true;btn.textContent='✍️ Detay hazırlanıyor…'}
    detailPromise=(async()=>{
      try{
        const r=await fetch('/api/enrich',{method:'POST',headers:{'Content-Type':'application/json','X-YKS-Detail':'1'},body:JSON.stringify({solution:{exam:snapshot.exam,subject:snapshot.subject,topic:snapshot.topic,difficulty:snapshot.difficulty,answer:snapshot.answer,short_solution:snapshot.short_solution}})});
        const j=await r.json();if(!r.ok)throw new Error(j.error||'Detaylı çözüm hazırlanamadı.');
        if(lastLiveResult!==snapshot&&lastLiveResult?.answer!==snapshot.answer)return lastLiveResult;
        const merged={...snapshot,...j,__detailsLoaded:true};lastLiveResult=merged;applyLiveResult(merged);return merged;
      }catch(e){alert(e.message);return null}
      finally{detailPromise=null;const b=document.getElementById('loadSolutionDetails');if(b){b.disabled=false;b.textContent=detailMissing(lastLiveResult)?'📚 Detaylı Çözüm':'✅ Detay Yüklendi'}}
    })();
    return detailPromise;
  }
  window.ensureSolutionDetails=ensureDetails;

  function installDetailButton(){
    const row=document.querySelector('#solution .action-row');if(!row)return;
    let b=document.getElementById('loadSolutionDetails');
    if(!b){b=document.createElement('button');b.id='loadSolutionDetails';b.textContent='📚 Detaylı Çözüm';row.prepend(b);b.onclick=()=>ensureDetails()}
    b.textContent=detailMissing(lastLiveResult)?'📚 Detaylı Çözüm':'✅ Detay Yüklendi';
  }

  function wrapApply(){
    if(typeof applyLiveResult!=='function'||applyLiveResult.__lowCostWrapped)return;
    const prev=applyLiveResult;
    const wrapped=function(x){const r=prev(x);economyPlaceholder(x);installDetailButton();return r};
    wrapped.__lowCostWrapped=true;applyLiveResult=wrapped;window.applyLiveResult=wrapped;
  }

  function wireDetailActions(){
    installDetailButton();
    const tip=document.querySelector('#solution [data-go="tips"]');
    if(tip&&!tip.dataset.lowCostWrapped){const original=tip.onclick;tip.dataset.lowCostWrapped='1';tip.onclick=async e=>{e.preventDefault();const x=await ensureDetails();if(x)original?.call(tip,e)}}
    const stuck=document.querySelector('#solution [data-go="stuck"]');
    if(stuck&&!stuck.dataset.lowCostWrapped){const original=stuck.onclick;stuck.dataset.lowCostWrapped='1';stuck.onclick=async e=>{e.preventDefault();const x=await ensureDetails();if(x)original?.call(stuck,e)}}
  }

  function subset(kind){
    const rec=state.costTracker.records||[];
    if(kind==='today')return rec.filter(x=>x.dateKey===todayKey());
    if(kind==='month')return rec.filter(x=>String(x.dateKey||'').startsWith(monthKey()));
    return rec;
  }
  const sumUsd=rows=>rows.reduce((a,x)=>a+Number(x.costUsd||0),0);
  const sumTokens=rows=>rows.reduce((a,x)=>a+Number(x.input||0)+Number(x.output||0),0);

  function renderCostStrip(){
    const strip=document.getElementById('homeCostStrip');if(!strip)return;
    const today=subset('today'),month=subset('month');
    strip.innerHTML=`<span>💰 <b>API Kullanımı</b></span><span>Bugün <b>${money(sumUsd(today))}</b></span><span>Bu ay <b>${money(sumUsd(month))}</b></span><span class="cost-strip-arrow">Detay →</span>`;
  }

  function renderCostScreen(){
    const root=document.getElementById('cost');if(!root)return;
    const today=subset('today'),month=subset('month'),all=subset('all');
    const groups={};month.forEach(x=>{const k=x.feature||'api';groups[k]??={usd:0,calls:0,input:0,output:0,models:new Set()};groups[k].usd+=Number(x.costUsd||0);groups[k].calls++;groups[k].input+=Number(x.input||0);groups[k].output+=Number(x.output||0);groups[k].models.add(x.model)});
    const rows=Object.entries(groups).sort((a,b)=>b[1].usd-a[1].usd);
    root.innerHTML=`
      <div class="screen-head"><button class="back" id="costBack">←</button><h1>API Kullanımı</h1></div>
      <div class="cost-eco-banner"><div><b>🟢 Ekonomi Modu aktif</b><p>Ana soru çözümü ve Mini Test: GPT-4.1 mini • Yardımcı özellikler: GPT-5.6 Luna • Detaylı çözüm yalnız istenince çağrılır.</p></div><span>Gerçek token sayımı</span></div>
      <div class="cost-stats"><div class="stat"><b>${money(sumUsd(today))}</b><small>Bugün</small></div><div class="stat"><b>${money(sumUsd(month))}</b><small>Bu ay</small></div><div class="stat"><b>${month.length}</b><small>Bu ay API çağrısı</small></div><div class="stat"><b>${compactTokens(sumTokens(month))}</b><small>Bu ay token</small></div></div>
      <div class="card cost-card"><div class="section-title" style="margin-top:0"><h2>Bu Ay Nerede Harcandı?</h2><span class="muted">${monthKey()}</span></div>
        ${rows.length?`<div class="cost-table">${rows.map(([k,v])=>`<div class="cost-row"><div><b>${esc(FEATURE_LABELS[k]||k)}</b><small>${v.calls} çağrı • ${esc([...v.models].join(', '))}</small></div><div><span>${compactTokens(v.input+v.output)} token</span><b>${money(v.usd)}</b></div></div>`).join('')}</div>`:'<div class="home-empty">Bu sürümden sonra henüz ücretli API çağrısı yapılmadı.</div>'}
      </div>
      <div class="dash-grid cost-lower"><div class="card"><h2>TL Hesabı</h2><label>1 USD kaç TL?<input id="costFx" type="number" min="1" step="0.0001" value="${Number(state.costTracker.fxRate||DEFAULT_FX)}"></label><button id="saveCostFx" class="secondary full">Kuru Güncelle</button><p class="muted">Başlangıç referansı: 18.08.2026 tarihinde 1 USD ≈ 47,9105 TL. OpenAI faturası USD üzerinden oluşur.</p></div>
        <div class="card"><h2>Sayaç Bilgisi</h2><p>Toplam kaydedilen ${all.length} API çağrısı var. Bu sayaç yeni maliyet sürümünden itibaren çalışır; önceki harcamaları geriye dönük içermez.</p><p class="muted">Hesap, API'nin gerçek input/cached/output token kullanımını resmi model birim fiyatlarıyla çarpar. Kur değişimi nedeniyle TL tutarı yaklaşık değerdir.</p><button id="resetCostCounter" class="ghost full">Yerel maliyet sayacını sıfırla</button></div></div>`;
    root.querySelector('#costBack').onclick=()=>{root.classList.remove('active');go('home')};
    root.querySelector('#saveCostFx').onclick=()=>{state.costTracker.fxRate=Math.max(1,Number(root.querySelector('#costFx').value)||DEFAULT_FX);save();renderCostScreen();renderCostStrip()};
    root.querySelector('#resetCostCounter').onclick=()=>{if(confirm('Yalnız uygulamadaki yerel maliyet sayacı sıfırlansın mı? OpenAI faturasını etkilemez.')){state.costTracker.records=[];save();renderCostScreen();renderCostStrip()}};
  }

  function openCost(){
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
    document.getElementById('cost')?.classList.add('active');
    document.querySelectorAll('.sidebar .nav button').forEach(b=>b.classList.toggle('active',b.id==='costNavButton'));
    window.scrollTo({top:0,behavior:'smooth'});renderCostScreen();
  }
  window.openCostDashboard=openCost;

  function installCostUi(){
    const main=document.querySelector('main.content');
    if(main&&!document.getElementById('cost')){const section=document.createElement('section');section.id='cost';section.className='screen';main.appendChild(section)}
    const hero=document.querySelector('#home .hero-grid');
    if(hero&&!document.getElementById('homeCostStrip')){const strip=document.createElement('button');strip.id='homeCostStrip';strip.className='home-cost-strip';strip.onclick=openCost;hero.insertAdjacentElement('afterend',strip)}
    const nav=document.querySelector('.sidebar .nav'),profile=nav?.querySelector('[data-go="profile"]');
    if(nav&&!document.getElementById('costNavButton')){const b=document.createElement('button');b.id='costNavButton';b.innerHTML='💰 <span>API Kullanımı</span>';b.onclick=openCost;nav.insertBefore(b,profile||null)}
    renderCostStrip();
  }

  const css=document.createElement('style');css.textContent=`
    .home-cost-strip{width:100%;margin-top:12px;border:1px solid #dcd7f8;background:linear-gradient(90deg,#faf9ff,#f4f8ff);border-radius:15px;padding:10px 14px;display:flex;gap:18px;align-items:center;color:var(--ink);text-align:left}.home-cost-strip span{font-size:12px}.home-cost-strip .cost-strip-arrow{margin-left:auto;color:#5b45d6;font-weight:800}
    .cost-eco-banner{display:flex;justify-content:space-between;gap:18px;align-items:center;padding:17px 20px;border:1px solid #bfe7cf;background:#f3fcf7;border-radius:18px;margin-bottom:15px}.cost-eco-banner p{margin:5px 0 0;color:var(--muted);font-size:13px}.cost-eco-banner>span{white-space:nowrap;font-size:12px;font-weight:800;color:#147848;background:#e0f5e8;padding:7px 10px;border-radius:999px}.cost-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:15px}.cost-card{margin-bottom:15px}.cost-table{display:grid;gap:8px}.cost-row{display:flex;justify-content:space-between;gap:14px;align-items:center;padding:12px;border:1px solid var(--line);border-radius:14px}.cost-row small{display:block;color:var(--muted);margin-top:3px}.cost-row>div:last-child{text-align:right}.cost-row>div:last-child span{display:block;font-size:11px;color:var(--muted);margin-bottom:3px}.cost-lower{align-items:start}
    #loadSolutionDetails{border-color:#b9e3ca!important;background:#f0fbf5!important;color:#147848!important;font-weight:850!important}
    @media(max-width:760px){.home-cost-strip{gap:8px;flex-wrap:wrap}.home-cost-strip .cost-strip-arrow{margin-left:0;width:100%}.cost-stats{grid-template-columns:1fr 1fr}.cost-eco-banner{align-items:flex-start;flex-direction:column}.cost-row{align-items:flex-start}.cost-row>div:last-child{min-width:88px}}
  `;document.head.appendChild(css);

  // Dinamik cost ekranı original screens listesinde olmadığı için normal go çağrılarında kapat.
  if(typeof go==='function'&&!window.__costGoWrapped){const baseGo=go;go=function(id){document.getElementById('cost')?.classList.remove('active');return baseGo(id)};window.go=go;window.__costGoWrapped=true}

  installCostUi();wrapApply();wireDetailActions();
  setTimeout(()=>{wrapApply();wireDetailActions();installCostUi()},350);
  setTimeout(()=>{wrapApply();wireDetailActions();installCostUi()},1200);
})();
