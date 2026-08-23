(()=>{
  const root=document.getElementById('coach');
  if(!root)return;

  const demoSignature=[
    ['02.08.2026','TYT Deneme 1',51.5],
    ['09.08.2026','TYT Deneme 2',57],
    ['16.08.2026','TYT Deneme 3',61.25]
  ];
  if(Array.isArray(state.trials)&&state.trials.length===3&&demoSignature.every(([d,n,net],i)=>state.trials[i]?.date===d&&state.trials[i]?.name===n&&Number(state.trials[i]?.net)===net)){
    state.trials=[];save();
  }
  state.trials??=[];state.coach??={report:null,fingerprint:'',generatedAt:''};

  const configs={
    TYT:{label:'TYT',subjects:[['turkce','Türkçe',40],['sosyal','Sosyal Bilimler',20],['matematik','Matematik',40],['fen','Fen Bilimleri',20]]},
    'AYT-EA':{label:'AYT • Eşit Ağırlık',subjects:[['matematik','Matematik',40],['edebiyat','Türk Dili ve Edebiyatı',24],['tarih1','Tarih-1',10],['cografya1','Coğrafya-1',6]]},
    'AYT-SAY':{label:'AYT • Sayısal',subjects:[['matematik','Matematik',40],['fizik','Fizik',14],['kimya','Kimya',13],['biyoloji','Biyoloji',13]]},
    'AYT-SOZ':{label:'AYT • Sözel',subjects:[['edebiyat','Türk Dili ve Edebiyatı',24],['tarih1','Tarih-1',10],['cografya1','Coğrafya-1',6],['tarih2','Tarih-2',11],['cografya2','Coğrafya-2',11],['felsefe','Felsefe Grubu',12],['din','Din Kültürü',6]]},
    YDT:{label:'YDT',subjects:[['yabancidil','Yabancı Dil',80]]}
  };
  let view='dashboard',editingId=null;

  const css=document.createElement('style');
  css.textContent=`
    .yc-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px}.yc-title{display:flex;align-items:center;gap:12px}.yc-title h1{margin:0}.yc-add{white-space:nowrap}
    .yc-hero{display:grid;grid-template-columns:1.4fr .9fr;gap:14px;margin-bottom:14px}.yc-main-card{padding:22px;border-radius:22px;background:linear-gradient(135deg,#342170,#563bd0);color:#fff;box-shadow:0 16px 35px rgba(66,45,156,.18)}.yc-main-card h2{margin:8px 0 4px;font-size:29px}.yc-main-card p{color:#e6e0ff}.yc-target-box{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:end;margin-top:18px}.yc-target-box input{width:110px;height:44px;border:0;border-radius:12px;padding:0 12px;font-size:17px;font-weight:800}.yc-target-box button{height:44px;background:#fff;color:#4932b5;border:0;border-radius:12px;font-weight:850;padding:0 16px}
    .yc-kpis{display:grid;grid-template-columns:1fr 1fr;gap:10px}.yc-kpi{padding:16px;border:1px solid var(--line);border-radius:18px;background:var(--surface)}.yc-kpi strong{display:block;font-size:25px;margin-top:4px}.yc-kpi small{color:var(--muted)}
    .yc-grid{display:grid;grid-template-columns:1.15fr .85fr;gap:14px;margin-top:14px}.yc-card{border:1px solid var(--line);border-radius:20px;background:var(--surface);padding:18px}.yc-card h2,.yc-card h3{margin-top:0}.yc-empty{text-align:center;padding:58px 22px;border:1px dashed var(--line);border-radius:20px;background:var(--surface)}.yc-empty .ico{font-size:50px}.yc-empty p{max-width:580px;margin:8px auto 20px;color:var(--muted)}
    .yc-bars{display:flex;align-items:end;gap:10px;height:205px;padding:24px 4px 4px;border-bottom:1px solid var(--line);overflow-x:auto}.yc-bar-wrap{min-width:54px;flex:1;text-align:center}.yc-bar{height:var(--h);min-height:5px;max-height:145px;background:linear-gradient(180deg,#7054f4,#4e67f3);border-radius:10px 10px 4px 4px;position:relative}.yc-bar b{position:absolute;top:-23px;left:50%;transform:translateX(-50%);font-size:12px}.yc-bar-wrap small{display:block;margin-top:7px;color:var(--muted);font-size:11px;white-space:nowrap}
    .yc-subject-list{display:grid;gap:9px}.yc-subject-row{display:grid;grid-template-columns:1fr 90px 80px;gap:10px;align-items:center;padding:10px 0;border-bottom:1px solid var(--line)}.yc-subject-row:last-child{border:0}.yc-delta.up{color:#16955f}.yc-delta.down{color:#d04a58}.yc-delta.flat{color:var(--muted)}
    .yc-history{display:grid;gap:10px}.yc-trial{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;padding:14px;border:1px solid var(--line);border-radius:16px}.yc-trial h3{margin:3px 0}.yc-chips{display:flex;gap:6px;flex-wrap:wrap}.yc-actions{display:flex;gap:7px;align-items:center}.yc-actions button{min-width:42px;height:40px;border-radius:11px}.yc-details{grid-column:1/-1;display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:3px}.yc-detail{background:#f8f7fc;border-radius:12px;padding:9px}.yc-detail b{display:block}.yc-report{line-height:1.55}.yc-report-head{display:flex;justify-content:space-between;gap:10px;align-items:center}.yc-report ul{padding-left:20px}.yc-priority{padding:12px;border-radius:14px;background:#f8f7ff;border:1px solid #e5e0ff;margin:9px 0}.yc-priority b{display:block;margin-bottom:4px}.yc-plan{display:grid;gap:8px}.yc-plan-item{display:grid;grid-template-columns:34px 1fr;gap:10px;align-items:flex-start}.yc-plan-item span{width:30px;height:30px;border-radius:10px;background:#eeeaff;color:#573fd1;display:grid;place-items:center;font-weight:900}
    .yc-form{max-width:980px;margin:auto}.yc-form-top{display:grid;grid-template-columns:1.4fr .8fr .8fr;gap:10px;margin-bottom:14px}.yc-form label{display:grid;gap:6px;font-weight:750}.yc-form input,.yc-form select,.yc-form textarea{width:100%;border:1px solid var(--line);background:var(--surface);color:var(--ink);border-radius:12px;padding:11px;font:inherit}.yc-form textarea{min-height:84px;resize:vertical}.yc-subject-inputs{display:grid;gap:8px;margin:14px 0}.yc-input-head,.yc-input-row{display:grid;grid-template-columns:minmax(160px,1.4fr) 85px 85px 85px 95px;gap:8px;align-items:center}.yc-input-head{font-size:12px;color:var(--muted);padding:0 8px}.yc-input-row{padding:10px;border:1px solid var(--line);border-radius:14px}.yc-input-row input{text-align:center}.yc-auto{padding:10px;border-radius:11px;background:#f5f4fa;text-align:center;font-weight:850}.yc-total{display:flex;justify-content:space-between;align-items:center;padding:15px;border-radius:15px;background:#f1efff;margin:12px 0}.yc-total strong{font-size:24px;color:#553fd1}.yc-form-actions{display:flex;justify-content:flex-end;gap:9px;margin-top:14px}
    .yc-note{display:grid;grid-template-columns:.7fr 1.3fr;gap:10px}.yc-stale{font-size:12px;color:#a46a00;background:#fff5dc;padding:6px 9px;border-radius:9px}
    @media(max-width:980px){.yc-hero,.yc-grid{grid-template-columns:1fr}.yc-details{grid-template-columns:1fr 1fr}.yc-form-top,.yc-note{grid-template-columns:1fr}.yc-input-head{display:none}.yc-input-row{grid-template-columns:1fr 1fr 1fr}.yc-input-row .yc-subject-name{grid-column:1/-1}.yc-input-row .yc-auto{grid-column:auto}.yc-input-row .yc-net{grid-column:auto}}
    @media(max-width:620px){.yc-head{align-items:flex-start}.yc-head .yc-add{font-size:0;width:44px}.yc-head .yc-add:after{content:'+';font-size:24px}.yc-kpis{grid-template-columns:1fr 1fr}.yc-details{grid-template-columns:1fr}.yc-trial{grid-template-columns:1fr}.yc-actions{justify-content:flex-end}.yc-input-row{grid-template-columns:1fr 1fr}.yc-input-row .yc-subject-name{grid-column:1/-1}.yc-main-card h2{font-size:24px}}
  `;document.head.appendChild(css);

  const fmt=n=>Number(n||0).toFixed(2).replace('.',',').replace(/,00$/,'');
  const dateTR=v=>{try{return new Date(v+'T12:00:00').toLocaleDateString('tr-TR')}catch{return v||''}};
  const net=(d,w)=>Math.round((Number(d||0)-Number(w||0)/4)*100)/100;
  const sortedTrials=()=>[...(state.trials||[])].sort((a,b)=>String(a.date).localeCompare(String(b.date))||Number(a.id)-Number(b.id));
  const topicTestInsights=()=>window.YKSDataV5?.getTopicTestInsights?.({limit:12,days:60})||[];
  const latest=()=>sortedTrials().at(-1)||null;
  const target=()=>Number(state.profile.targetNet||70);
  const fingerprint=()=>JSON.stringify({t:(state.trials||[]).map(x=>[x.id,x.totalNet,x.date]),target:target(),topics:state.topicMastery,topicTests:topicTestInsights().map(x=>[x.topicId,x.totalTests,x.totalQuestions,x.correct,x.wrong,x.blank,x.lastTestAt,x.trend])});
  const reportStale=()=>state.coach?.report&&state.coach.fingerprint!==fingerprint();

  function subjectStats(type){
    const arr=sortedTrials().filter(t=>t.type===type).slice(-3),cfg=configs[type];if(!cfg||!arr.length)return[];
    return cfg.subjects.map(([key,label,total])=>{
      const vals=arr.map(t=>Number(t.subjects?.[key]?.net||0));const avg=vals.reduce((a,b)=>a+b,0)/vals.length;const delta=vals.length>1?vals.at(-1)-vals.at(-2):0;
      return{key,label,total,avg,delta,last:vals.at(-1)||0};
    });
  }

  function computedSummary(){
    const arr=sortedTrials(),last=arr.at(-1);if(!last)return null;
    const same=arr.filter(x=>x.type===last.type),prev=same.at(-2),last3=same.slice(-3),avg=last3.reduce((s,x)=>s+Number(x.totalNet||0),0)/last3.length,best=Math.max(...same.map(x=>Number(x.totalNet||0))),gap=target()-Number(last.totalNet||0);
    return{last,prev,delta:prev?Number(last.totalNet)-Number(prev.totalNet):null,avg,best,gap,count:same.length};
  }

  function renderDashboard(){
    view='dashboard';editingId=null;
    const arr=sortedTrials(),sum=computedSummary();
    root.innerHTML=`<div class="yc-head"><div class="yc-title"><button class="back" id="ycHome">←</button><div><h1>YKS Koçum</h1><div class="muted">Denemelerini gir, gelişimini izle, sonraki adımı planla.</div></div></div><button id="ycAdd" class="primary yc-add">＋ Deneme Ekle</button></div>${arr.length?dashboardHtml(sum):emptyHtml()}`;
    root.querySelector('#ycHome').onclick=()=>go('home');root.querySelector('#ycAdd').onclick=()=>openForm();
    if(arr.length)bindDashboard(sum);
  }

  function emptyHtml(){return `<div class="yc-empty"><div class="ico">🧭</div><h2>Koçluk gerçek verinle başlar</h2><p>Burada hazır veya demo deneme yok. İlk TYT/AYT denemeni eklediğinde netlerin otomatik hesaplanacak; koç paneli gelişimini, güçlü ve zayıf alanlarını senin verinden oluşturacak.</p><button id="ycFirst" class="primary">İlk Denememi Ekle</button></div>`}

  function dashboardHtml(sum){
    const arr=sortedTrials(),last=sum.last,same=arr.filter(x=>x.type===last.type),maxNet=Math.max(target(),...same.map(x=>Number(x.totalNet||0)),1),bars=same.slice(-8).map(x=>{const h=Math.max(6,Math.round(Number(x.totalNet||0)/maxNet*135));return `<div class="yc-bar-wrap"><div class="yc-bar" style="--h:${h}px"><b>${fmt(x.totalNet)}</b></div><small>${dateTR(x.date).slice(0,5)}</small></div>`}).join('');
    const delta=sum.delta===null?'İlk ölçüm':`${sum.delta>=0?'+':''}${fmt(sum.delta)} net`;
    const sub=subjectStats(last.type);
    const history=arr.slice().reverse().map(trialCard).join('');
    const report=reportHtml();
    return `<div class="yc-hero"><div class="yc-main-card"><span class="pill" style="background:#ffffff20;color:#fff">${esc(configs[last.type]?.label||last.type)}</span><h2>${fmt(last.totalNet)} net</h2><p>Son denemen • ${esc(last.name)} • ${dateTR(last.date)}</p><div class="yc-target-box"><div><small>Hedef net</small><br><input id="ycTarget" type="number" min="0" max="160" step="0.25" value="${target()}"></div><button id="ycSaveTarget">Hedefi Kaydet</button></div></div><div class="yc-kpis"><div class="yc-kpi"><small>Son değişim</small><strong>${delta}</strong></div><div class="yc-kpi"><small>Son 3 ortalama</small><strong>${fmt(sum.avg)}</strong></div><div class="yc-kpi"><small>En iyi</small><strong>${fmt(sum.best)}</strong></div><div class="yc-kpi"><small>Hedefe fark</small><strong>${sum.gap>0?fmt(sum.gap)+' net':'Hedefte ✓'}</strong></div></div></div>
      <div class="yc-grid"><div class="yc-card"><h2>📈 Net Gelişimi</h2><div class="yc-bars">${bars}</div><p class="muted" style="margin-bottom:0">Grafik yalnızca ${esc(configs[last.type]?.label||last.type)} denemelerini karşılaştırır.</p></div><div class="yc-card"><h2>📚 Ders Bazlı Durum</h2><div class="yc-subject-list">${sub.map(s=>`<div class="yc-subject-row"><span>${esc(s.label)}</span><b>${fmt(s.last)} net</b><span class="yc-delta ${s.delta>0?'up':s.delta<0?'down':'flat'}">${s.delta>0?'▲ +':s.delta<0?'▼ ':''}${fmt(s.delta)}</span></div>`).join('')}</div></div></div>
      <div class="yc-grid"><div class="yc-card"><div class="yc-report-head"><div><h2>🧠 Genel Koç Raporu</h2><div class="muted">Denemelerin + konu takibin + yanlışların birlikte değerlendirilir.</div></div><button id="ycReportBtn" class="secondary">${state.coach?.report?'Raporu Yenile':'Koç Raporu Oluştur'}</button></div>${report}</div><div class="yc-card"><h2>🎯 Koçun Hızlı Kararı</h2>${quickDecisionHtml(sum,sub)}<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px"><button id="ycTeacher" class="secondary">Kişisel Öğretmene Git</button><button id="ycTests" class="ghost">Mini Test Aç</button></div></div></div>
      <div class="yc-card" style="margin-top:14px"><div class="yc-report-head"><div><h2>🗂️ Deneme Geçmişi</h2><div class="muted">${arr.length} gerçek deneme kaydı</div></div><button id="ycAdd2" class="secondary">＋ Yeni Deneme</button></div><div class="yc-history">${history}</div></div>`;
  }

  function quickDecisionHtml(sum,sub){
    const weak=[...sub].sort((a,b)=>(a.last/a.total)-(b.last/b.total))[0],insight=[...topicTestInsights()].sort((a,b)=>(a.accuracy??101)-(b.accuracy??101)||b.totalQuestions-a.totalQuestions)[0],topic=topicEntries()[0];
    let headline=sum.delta===null?'Bu deneme başlangıç ölçümün.':'Son denemede '+(sum.delta>=0?'yükseliş var.':'geri çekilme var.');
    return `<h3>${headline}</h3><p>${sum.count<2?'Bir sonraki denemede amaç önce sağlam bir karşılaştırma verisi oluşturmak.':`Son ${Math.min(3,sum.count)} deneme ortalaman ${fmt(sum.avg)} net.`} ${weak?`Ders bazında en fazla gelişim alanı <b>${esc(weak.label)}</b> tarafında görünüyor.`:''}</p>${insight?`<div class="tip orange"><b>Konu testi sinyali:</b> ${esc(insight.topic)} • ${insight.totalTests} test / ${insight.totalQuestions} soru • %${insight.accuracy} • ${esc(insight.trend)}</div>`:(topic?`<div class="tip orange"><b>Öncelikli konu:</b> ${esc(topic[0])} • ustalık %${topic[1]}</div>`:'')}`;
  }

  function reportHtml(){
    const r=state.coach?.report;if(!r)return `<div style="padding:22px 0"><p>Henüz kişisel koç raporu oluşturulmadı. En az bir gerçek deneme yeterli; deneme sayısı arttıkça rapor daha güçlü olur.</p></div>`;
    const stale=reportStale()?`<span class="yc-stale">Yeni veri var • raporu yenile</span>`:'';
    return `<div class="yc-report"><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:12px 0"><span class="pill green">${esc(r.headline)}</span>${stale}</div><p>${esc(r.summary)}</p>${(r.strengths||[]).length?`<h3>Güçlü taraflar</h3><ul>${r.strengths.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}<h3>Öncelikler</h3>${(r.priorities||[]).map(p=>`<div class="yc-priority"><b>${esc(p.title)}</b><div>${esc(p.why)}</div><small>→ ${esc(p.action)}</small></div>`).join('')}<h3>Bu haftanın planı</h3><div class="yc-plan">${(r.weekly_plan||[]).map((x,i)=>`<div class="yc-plan-item"><span>${i+1}</span><div>${esc(x)}</div></div>`).join('')}</div><div class="tip blue" style="margin-top:14px"><b>Sonraki deneme:</b> ${esc(r.next_trial?.target_net||'')}<br>${esc(r.next_trial?.focus||'')}<br><small>${esc(r.next_trial?.strategy||'')}</small></div><p><b>Koç notu:</b> ${esc(r.coach_note||'')}</p></div>`;
  }

  function trialCard(t){
    const cfg=configs[t.type],details=(cfg?.subjects||[]).map(([key,label])=>{const s=t.subjects?.[key];return `<div class="yc-detail"><small>${esc(label)}</small><b>${fmt(s?.net||0)} net</b><small>${Number(s?.correct||0)}D • ${Number(s?.wrong||0)}Y • ${Number(s?.blank||0)}B</small></div>`}).join('');
    return `<div class="yc-trial"><div><div class="yc-chips"><span class="pill">${esc(cfg?.label||t.type)}</span>${t.issue&&t.issue!=='Yok'?`<span class="pill orange">${esc(t.issue)}</span>`:''}</div><h3>${esc(t.name)}</h3><div class="muted">${dateTR(t.date)}${t.duration?` • ${t.duration} dk`:''}</div></div><div class="yc-actions"><b style="font-size:22px">${fmt(t.totalNet)}</b><button class="ghost" data-edit="${t.id}" title="Düzenle">✏️</button><button class="ghost" data-del="${t.id}" title="Sil">🗑️</button></div><div class="yc-details">${details}</div>${t.note?`<div class="muted" style="grid-column:1/-1">Not: ${esc(t.note)}</div>`:''}</div>`;
  }

  function bindDashboard(sum){
    root.querySelector('#ycSaveTarget').onclick=()=>{const v=Number(root.querySelector('#ycTarget').value);if(!Number.isFinite(v)||v<0)return;state.profile.targetNet=v;save();renderDashboard()};
    root.querySelector('#ycAdd2').onclick=()=>openForm();root.querySelector('#ycTeacher').onclick=()=>go('teacher');root.querySelector('#ycTests').onclick=()=>go('tests');
    root.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>openForm(Number(b.dataset.edit)));
    root.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>deleteTrial(Number(b.dataset.del)));
    root.querySelector('#ycReportBtn').onclick=generateReport;
  }

  function openForm(id=null){
    view='form';editingId=id;const existing=id?(state.trials||[]).find(x=>Number(x.id)===Number(id)):null;const type=existing?.type||'TYT';
    root.innerHTML=`<div class="yc-head"><div class="yc-title"><button class="back" id="ycFormBack">←</button><div><h1>${existing?'Denemeyi Düzenle':'Deneme Ekle'}</h1><div class="muted">Doğru ve yanlışı gir; boş ve net otomatik hesaplansın.</div></div></div></div><div class="yc-card yc-form"><div class="yc-form-top"><label>Deneme adı<input id="ycName" value="${esc(existing?.name||'')}" placeholder="Örn. TYT Türkiye Geneli 1"></label><label>Tarih<input id="ycDate" type="date" value="${existing?.date||new Date().toISOString().slice(0,10)}"></label><label>Sınav türü<select id="ycType">${Object.entries(configs).map(([k,v])=>`<option value="${k}" ${k===type?'selected':''}>${esc(v.label)}</option>`).join('')}</select></label></div><div class="yc-input-head"><span>Ders</span><span>Doğru</span><span>Yanlış</span><span>Boş</span><span>Net</span></div><div id="ycSubjectInputs" class="yc-subject-inputs"></div><div class="yc-total"><span>Toplam net</span><strong id="ycTotalNet">0</strong></div><div class="yc-note"><label>Denemede en çok ne zorladı?<select id="ycIssue"><option>Yok</option><option>Bilgi eksiği</option><option>Süre</option><option>Dikkat</option><option>Soru stratejisi</option><option>Karışık</option></select></label><label>Deneme notu<textarea id="ycNote" placeholder="İstersen kısa bir not ekle..."></textarea></label></div><div class="yc-form-top" style="grid-template-columns:1fr 1fr;margin-top:10px"><label>Süre (dakika, isteğe bağlı)<input id="ycDuration" type="number" min="0" value="${existing?.duration||''}"></label><div></div></div><div id="ycFormError" class="tip red hidden"></div><div class="yc-form-actions"><button id="ycCancel" class="ghost">Vazgeç</button><button id="ycSave" class="primary">${existing?'Değişiklikleri Kaydet':'Denemeyi Kaydet'}</button></div></div>`;
    root.querySelector('#ycFormBack').onclick=renderDashboard;root.querySelector('#ycCancel').onclick=renderDashboard;root.querySelector('#ycType').onchange=()=>renderSubjectInputs();
    if(existing){root.querySelector('#ycIssue').value=existing.issue||'Yok';root.querySelector('#ycNote').value=existing.note||''}
    renderSubjectInputs(existing);root.querySelector('#ycSave').onclick=saveTrial;
  }

  function renderSubjectInputs(existing=null){
    const type=root.querySelector('#ycType').value,cfg=configs[type],box=root.querySelector('#ycSubjectInputs');
    box.innerHTML=cfg.subjects.map(([key,label,total])=>{const s=existing?.type===type?existing.subjects?.[key]:null;return `<div class="yc-input-row" data-key="${key}" data-max="${total}"><b class="yc-subject-name">${esc(label)} <small class="muted">/${total}</small></b><input data-d type="number" min="0" max="${total}" value="${s?.correct??''}" placeholder="D"><input data-w type="number" min="0" max="${total}" value="${s?.wrong??''}" placeholder="Y"><div class="yc-auto" data-b>${s?.blank??total}</div><div class="yc-auto yc-net" data-net>${fmt(s?.net||0)}</div></div>`}).join('');
    box.querySelectorAll('input').forEach(i=>i.oninput=updateNet);updateNet();
  }

  function updateNet(){
    let totalNet=0,invalid=false;root.querySelectorAll('.yc-input-row').forEach(row=>{const max=Number(row.dataset.max),d=Math.max(0,Number(row.querySelector('[data-d]').value||0)),w=Math.max(0,Number(row.querySelector('[data-w]').value||0));const blank=Math.max(0,max-d-w);if(d+w>max)invalid=true;const n=net(d,w);row.querySelector('[data-b]').textContent=blank;row.querySelector('[data-net]').textContent=fmt(n);totalNet+=n});root.querySelector('#ycTotalNet').textContent=fmt(totalNet);root.querySelector('#ycTotalNet').dataset.invalid=invalid?'1':'0';
  }

  function saveTrial(){
    const err=root.querySelector('#ycFormError'),type=root.querySelector('#ycType').value,cfg=configs[type],name=root.querySelector('#ycName').value.trim()||`${cfg.label} Denemesi`,date=root.querySelector('#ycDate').value;if(!date){err.textContent='Deneme tarihi gerekli.';err.classList.remove('hidden');return}
    if(root.querySelector('#ycTotalNet').dataset.invalid==='1'){err.textContent='Bir derste doğru + yanlış sayısı toplam soru sayısını aşamaz.';err.classList.remove('hidden');return}
    const subjects={};let totalNet=0;root.querySelectorAll('.yc-input-row').forEach(row=>{const key=row.dataset.key,max=Number(row.dataset.max),d=Number(row.querySelector('[data-d]').value||0),w=Number(row.querySelector('[data-w]').value||0),blank=max-d-w,n=net(d,w);subjects[key]={correct:d,wrong:w,blank,net:n,total:max};totalNet+=n});totalNet=Math.round(totalNet*100)/100;
    const item={id:editingId||Date.now(),name,date,type,totalNet,subjects,issue:root.querySelector('#ycIssue').value,note:root.querySelector('#ycNote').value.trim(),duration:Number(root.querySelector('#ycDuration').value||0)||null,createdAt:new Date().toISOString()};
    if(editingId)state.trials=(state.trials||[]).map(x=>Number(x.id)===Number(editingId)?item:x);else state.trials.push(item);save();renderDashboard();
  }

  function deleteTrial(id){
    const t=(state.trials||[]).find(x=>Number(x.id)===Number(id));if(!t||!confirm(`“${t.name}” denemesi silinsin mi?`))return;state.trials=state.trials.filter(x=>Number(x.id)!==Number(id));save();renderDashboard();
  }

  async function generateReport(){
    const btn=root.querySelector('#ycReportBtn');if(!btn)return;btn.disabled=true;btn.textContent='Rapor hazırlanıyor…';
    try{
      const recentWrongs=(state.sessions||[]).filter(x=>!x.correct).slice(-12).map(x=>({subject:x.subject,topic:x.topic,date:x.date}));
      const r=await fetch('/api/coach-report',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({profile:{targetNet:target(),dailyQuestionGoal:state.profile.goal,dailyMinutes:state.profile.minutes,track:state.profile.track},trials:sortedTrials(),topicMastery:state.topicMastery||{},topicTestInsights:topicTestInsights(),recentWrongs})}),j=await r.json();if(!r.ok)throw new Error(j.error||'Rapor oluşturulamadı.');state.coach={report:j,fingerprint:fingerprint(),generatedAt:new Date().toISOString()};save();renderDashboard();
    }catch(e){btn.disabled=false;btn.textContent='Tekrar Dene';alert('Koç raporu oluşturulamadı: '+e.message)}
  }

  window.renderCoach=renderDashboard;try{renderCoach=renderDashboard}catch{}
  document.querySelectorAll('[data-go="coach"]').forEach(b=>b.addEventListener('click',()=>setTimeout(renderDashboard,0)));
  renderDashboard();
})();
