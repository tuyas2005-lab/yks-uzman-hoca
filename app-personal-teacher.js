(()=>{
  const root=document.getElementById('teacher');
  if(!root)return;
  state.teacher ??={selectedTopic:'',lessonCache:{},daily:null};
  state.teacher.lessonCache ??={};
  const letters=['A','B','C','D','E'];

  const css=document.createElement('style');
  css.textContent=`
    .pt-intro{display:flex;justify-content:space-between;gap:16px;align-items:center;margin-bottom:16px;padding:18px 20px;border:1px solid #e2dcff;border-radius:21px;background:linear-gradient(135deg,#f3efff,#fff)}
    .pt-intro h2{margin:4px 0 5px}.pt-intro p{margin:0}.pt-role{font-size:12px;font-weight:850;color:#5b45d6;background:#ebe6ff;border-radius:999px;padding:6px 10px;display:inline-flex}
    .pt-focus{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(260px,.65fr);gap:16px;margin-bottom:16px}.pt-focus-main{padding:22px}.pt-focus-main h1{font-size:30px;margin:8px 0}.pt-chips{display:flex;gap:7px;flex-wrap:wrap}.pt-meter{height:10px;background:#eceaf4;border-radius:999px;overflow:hidden;margin:12px 0 6px}.pt-meter i{display:block;height:100%;background:linear-gradient(90deg,#6547e8,#5367ff);border-radius:inherit}.pt-reason{margin:13px 0 0;padding:13px;border-radius:14px;background:#f8f7ff;border:1px solid #e7e2ff;line-height:1.5}
    .pt-focus-actions{display:flex;gap:9px;flex-wrap:wrap;margin-top:17px}.pt-focus-actions button{min-height:45px}
    .pt-score-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.pt-score{padding:17px;border-radius:18px;border:1px solid var(--line);background:var(--surface);text-align:center}.pt-score b{display:block;font-size:27px;margin-bottom:3px}.pt-score small{color:var(--muted)}
    .pt-flow{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.pt-step{position:relative;padding:17px;border:1px solid var(--line);border-radius:18px;background:var(--surface);min-height:160px}.pt-step.done{border-color:#bde6cd;background:#f8fdf9}.pt-step-num{width:34px;height:34px;border-radius:11px;background:#eeeaff;color:#5b44d5;display:grid;place-items:center;font-weight:900;margin-bottom:11px}.pt-step.done .pt-step-num{background:#ddf5e7;color:#147848}.pt-step h3{margin:0 0 6px}.pt-step p{margin:0 0 13px;color:var(--muted);line-height:1.45}.pt-step button{margin-top:auto}
    .pt-section{margin-top:17px}.pt-topic-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.pt-topic{border:1px solid var(--line);border-radius:16px;background:var(--surface);padding:14px;text-align:left;color:var(--ink)}.pt-topic.active{border-color:#9c8df7;background:#f7f5ff}.pt-topic strong{display:block;margin-bottom:7px}.pt-topic .barline{height:7px;background:#edeaf5;border-radius:999px;overflow:hidden;margin-top:9px}.pt-topic .barline i{display:block;height:100%;background:#6747eb}
    .pt-performance{display:flex;gap:8px;flex-wrap:wrap}.pt-perf{padding:9px 11px;border-radius:12px;background:#f5f5f9;border:1px solid var(--line);font-size:13px}.pt-perf.ok{background:#f4fbf7;border-color:#caead7}.pt-perf.bad{background:#fff7f7;border-color:#ffd5d8}
    .pt-lesson{margin-top:16px;padding:20px}.pt-lesson-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.pt-lesson-head h2{margin:0 0 4px}.pt-loading{text-align:center;padding:35px}.pt-pencil{font-size:44px;display:inline-block;animation:yksWrite 1.15s ease-in-out infinite}.pt-key-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin:14px 0}.pt-key{padding:12px;border-radius:14px;background:#f8f7ff;border:1px solid #e7e2ff;line-height:1.45}.pt-example{display:grid;grid-template-columns:1fr 1fr;gap:10px}.pt-example>div{padding:14px;border:1px solid var(--line);border-radius:15px}.pt-check{margin-top:15px;padding:16px;border-radius:17px;border:1px solid var(--line);background:var(--surface)}.pt-check h3{margin-top:0}.pt-check-choices{display:grid;gap:8px}.pt-check-choice{display:grid;grid-template-columns:38px 1fr;gap:10px;align-items:center;text-align:left;border:1px solid var(--line);border-radius:13px;background:var(--surface);padding:10px 12px;color:var(--ink)}.pt-check-choice span:first-child{width:30px;height:30px;border-radius:9px;background:#eeeaff;color:#553fd1;display:grid;place-items:center;font-weight:900}.pt-check-choice.correct{border-color:#9eddbf;background:#effbf5}.pt-check-choice.wrong{border-color:#ffc4ca;background:#fff4f5}.pt-feedback{margin-top:10px;padding:12px;border-radius:13px;background:#eef6ff;line-height:1.5}.pt-feedback.good{background:#effbf5}.pt-feedback.bad{background:#fff4f5}
    @media(max-width:950px){.pt-focus{grid-template-columns:1fr}.pt-flow,.pt-topic-grid{grid-template-columns:1fr}.pt-example,.pt-key-grid{grid-template-columns:1fr}.pt-intro{align-items:flex-start}.pt-focus-main h1{font-size:26px}}
  `;
  document.head.appendChild(css);

  function todayKey(){return new Date().toISOString().slice(0,10)}
  function cleanSubjectLabel(v){return String(v||'').replace(/^\s*(TYT|AYT)\s+/i,'').trim()}
  function examFromLabel(v){const m=String(v||'').match(/^\s*(TYT|AYT)\b/i);return m?m[1].toUpperCase():'TYT'}
  function normalize(v){return String(v||'').toLocaleLowerCase('tr-TR').replace(/[^a-z0-9çğıöşü]+/g,' ').trim()}
  function sessionSubject(topic){const list=(state.sessions||[]).slice().reverse();return list.find(x=>x.topic===topic)?.subject||''}
  function guessSubject(topic){
    const t=normalize(topic);
    if(/paragraf|sözcük|cümle|yazım|noktalama|fiil|edebiyat|şiir/.test(t))return'TYT Türkçe';
    if(/hareket|kuvvet|enerji|optik|dalga|elektrik|manyetizma|basınç/.test(t))return'TYT Fizik';
    if(/atom|kimya|asit|baz|gaz|çözelti|denge|organik/.test(t))return'TYT Kimya';
    if(/hücre|kalıtım|ekosistem|sinir|dolaşım|solunum|biyoloji/.test(t))return'TYT Biyoloji';
    if(/osmanlı|mücadele|atatürk|tarih|türk devlet/.test(t))return'TYT Tarih';
    if(/harita|iklim|nüfus|coğraf|şehir|ekonomik faaliyet/.test(t))return'TYT Coğrafya';
    if(/üçgen|çember|daire|geometri|dörtgen|açı/.test(t))return'TYT Geometri';
    return'TYT Matematik';
  }
  function topicInfo(topic,mastery){
    const matching=(state.sessions||[]).filter(x=>x.topic===topic),recent=matching.slice(-8),wrong=recent.filter(x=>!x.correct).length,total=recent.length;
    const subjectLabel=sessionSubject(topic)||guessSubject(topic);
    return{topic,mastery:Number(mastery??0),wrong,total,subjectLabel,exam:examFromLabel(subjectLabel),subject:cleanSubjectLabel(subjectLabel),priority:(100-Number(mastery??0))+wrong*7};
  }
  function candidates(){return topicEntries().slice(0,5).map(([t,m])=>topicInfo(t,m)).sort((a,b)=>b.priority-a.priority)}
  function focus(){const list=candidates(),chosen=state.teacher.selectedTopic;return list.find(x=>x.topic===chosen)||list[0]||topicInfo('Genel tekrar',50)}
  function ensureDaily(f){
    const d=state.teacher.daily;
    if(!d||d.date!==todayKey()||d.topic!==f.topic){state.teacher.daily={date:todayKey(),topic:f.topic,recapDone:false,testStarted:false,wrongOpened:false};save()}
    return state.teacher.daily;
  }
  function reasonText(f){
    if(f.mastery<50&&f.wrong>=2)return`${f.topic} konu ustalığı %${f.mastery} ve son çalışmalarda ${f.wrong} yanlış var. Bugün en yüksek getiriyi bu konuyu kısa tekrar + soru ile pekiştirmek verir.`;
    if(f.mastery<60)return`${f.topic} konu ustalığı %${f.mastery}. Temel büyük ölçüde var; kısa tekrar ve hemen ardından soru çözümü bu konuyu hızla yukarı taşıyabilir.`;
    if(f.wrong>0)return`Başarı düzeyi %${f.mastery} olsa da yakın çalışmalarda hata görülüyor. Bilgiyi unutmadan kısa bir pekiştirme yapmak uygun.`;
    return`${f.topic} şu an diğer başlıklara göre daha fazla gelişim alanı gösteriyor. Bugün kısa ve hedefli bir çalışma yeterli.`
  }
  function formatMinutes(){const n=Number(state.profile?.minutes||30);return n>=60?`${Math.floor(n/60)} sa${n%60?' '+n%60+' dk':''}`:`${n} dk`}

  function render(){
    const f=focus(),daily=ensureDaily(f),list=candidates().slice(0,3),recent=(state.sessions||[]).filter(x=>x.topic===f.topic).slice(-6).reverse();
    root.innerHTML=`<div class="screen-head"><button class="back" data-go="home">←</button><h1>Kişisel Öğretmenim</h1></div>
      <div class="pt-intro"><div><span class="pt-role">Günlük ders yöneticin</span><h2>Bugün ne çalışacağını ben seçeyim, sen sadece başla.</h2><p class="muted">Konu Takip, yanlışlar ve son çözümlerine göre günlük ders akışı oluşturulur.</p></div><span class="pill green">${esc(formatMinutes())} günlük hedef</span></div>
      <div class="pt-focus">
        <div class="card pt-focus-main"><div class="pt-chips"><span class="pill">${esc(f.exam)} ${esc(f.subject)}</span><span class="pill orange">Öncelik konusu</span></div><h1>${esc(f.topic)}</h1><div class="muted">Konu ustalığı %${f.mastery}</div><div class="pt-meter"><i style="width:${Math.max(4,Math.min(100,f.mastery))}%"></i></div><div class="pt-reason"><b>Neden bugün bunu seçtim?</b><br>${esc(reasonText(f))}</div><div class="pt-focus-actions"><button id="ptStartRecap" class="primary">✍️ 5 Dakika Hızlı Tekrar</button><button id="ptStartTest" class="secondary">🧪 5 Soruluk Test</button></div></div>
        <div class="pt-score-grid"><div class="pt-score"><b>%${f.mastery}</b><small>Konu ustalığı</small></div><div class="pt-score"><b>${f.wrong}</b><small>Son yanlış</small></div><div class="pt-score"><b>${f.total}</b><small>Yakın çalışma</small></div><div class="pt-score"><b>${esc(formatMinutes())}</b><small>Bugünkü hedef</small></div></div>
      </div>
      <div class="section-title"><h2>Bugünkü Ders Akışı</h2><span class="muted">3 küçük adım</span></div>
      <div class="pt-flow">
        <div class="pt-step ${daily.recapDone?'done':''}"><div class="pt-step-num">${daily.recapDone?'✓':'1'}</div><h3>Hızlı Tekrar</h3><p>3 kritik nokta, sık hata, örnek ve 1 kontrol sorusu.</p><button id="ptFlowRecap" class="${daily.recapDone?'ghost':'primary'} full">${daily.recapDone?'Tekrar Aç':'Başla'}</button></div>
        <div class="pt-step ${daily.testStarted?'done':''}"><div class="pt-step-num">${daily.testStarted?'✓':'2'}</div><h3>5 Soruluk Mini Test</h3><p>Seçilen konudan dengeli, özgün A–E sorular.</p><button id="ptFlowTest" class="secondary full">${daily.testStarted?'Yeniden Test Oluştur':'Testi Başlat'}</button></div>
        <div class="pt-step ${daily.wrongOpened?'done':''}"><div class="pt-step-num">${daily.wrongOpened?'✓':'3'}</div><h3>Yanlışları Düzelt</h3><p>Son yanlışlarını gör ve tekrar edilmesi gereken başlıkları kapat.</p><button id="ptWrong" class="ghost full">Yanlışlarımı Aç</button></div>
      </div>
      <div id="ptLessonSlot"></div>
      <div class="dash-grid pt-section"><div class="card"><div class="section-title" style="margin-top:0"><h2>Öğretmenin Konu Seçimi</h2><span class="muted">İstersen değiştir</span></div><div class="pt-topic-grid">${list.map(x=>`<button class="pt-topic ${x.topic===f.topic?'active':''}" data-pt-topic="${esc(x.topic)}"><strong>${esc(x.topic)}</strong><span class="muted">${esc(x.exam)} ${esc(x.subject)} • %${x.mastery}</span><div class="barline"><i style="width:${Math.max(4,x.mastery)}%"></i></div></button>`).join('')}</div></div>
        <div class="card"><div class="section-title" style="margin-top:0"><h2>Bu Konudaki Son Performans</h2><span class="muted">Son ${recent.length}</span></div><div class="pt-performance">${recent.length?recent.map(x=>`<span class="pt-perf ${x.correct?'ok':'bad'}">${x.correct?'✓':'✕'} ${esc(x.date||'')}</span>`).join(''):'<span class="muted">Bu konuda henüz yeterli soru verisi yok.</span>'}</div><p class="muted" style="margin-top:14px">Kişisel Öğretmen yalnız günlük akademik çalışmayı yönetir. Net ve deneme stratejisi için YKS Koçu, motivasyon/çalışma alışkanlığı için Rehber Öğretmen kullanılır.</p></div></div>`;
    root.querySelector('[data-go="home"]').onclick=()=>go('home');
    root.querySelectorAll('[data-pt-topic]').forEach(b=>b.onclick=()=>{state.teacher.selectedTopic=b.dataset.ptTopic;state.teacher.daily=null;save();render()});
    root.querySelector('#ptStartRecap').onclick=()=>openLesson(f);
    root.querySelector('#ptFlowRecap').onclick=()=>openLesson(f);
    root.querySelector('#ptStartTest').onclick=()=>launchMiniTest(f);
    root.querySelector('#ptFlowTest').onclick=()=>launchMiniTest(f);
    root.querySelector('#ptWrong').onclick=()=>{state.teacher.daily.wrongOpened=true;save();go('wrong')};
  }

  function lessonHtml(data,f){return `<div class="card pt-lesson"><div class="pt-lesson-head"><div><span class="pill green">5 dakikalık tekrar</span><h2>${esc(data.title||f.topic)}</h2><p class="muted">${esc(data.overview||'')}</p></div><button id="ptCloseLesson" class="ghost">Kapat</button></div><div class="pt-key-grid">${(data.key_points||[]).map((x,i)=>`<div class="pt-key"><b>${i+1}. Kritik nokta</b><br>${esc(x)}</div>`).join('')}</div><div class="tip orange"><b>⚠️ En sık hata</b><p>${esc(data.common_mistake||'')}</p></div><div class="pt-example"><div><b>🧩 Mini örnek</b><p>${esc(data.example_question||'')}</p></div><div><b>✅ Çözümü</b><p>${esc(data.example_solution||'')}</p></div></div><div class="pt-check"><h3>🎯 Anladın mı? Tek soru ile kontrol et</h3><p>${esc(data.check_question||'')}</p><div class="pt-check-choices">${(data.check_choices||[]).map((x,i)=>`<button class="pt-check-choice" data-pt-choice="${letters[i]}"><span>${letters[i]}</span><span>${esc(x)}</span></button>`).join('')}</div><div id="ptCheckFeedback" class="pt-feedback hidden"></div></div></div>`}

  async function openLesson(f){
    const slot=root.querySelector('#ptLessonSlot');if(!slot)return;
    const cache=state.teacher.lessonCache?.[f.topic];
    if(cache){slot.innerHTML=lessonHtml(cache,f);wireLesson(cache,f);slot.scrollIntoView({behavior:'smooth',block:'start'});return}
    slot.innerHTML='<div class="card pt-lesson pt-loading"><div class="pt-pencil">✍️</div><h2>Hızlı tekrar hazırlanıyor</h2><p class="muted">Yalnız sınavda işe yarayan öz bilgiler seçiliyor.</p></div>';slot.scrollIntoView({behavior:'smooth',block:'start'});
    try{
      const r=await fetch('/api/teacher-lesson',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({exam:f.exam,subject:f.subject,topic:f.topic,mastery:f.mastery,recentWrongCount:f.wrong})}),j=await r.json();
      if(!r.ok)throw new Error(j.error||'Hızlı tekrar hazırlanamadı');
      state.teacher.lessonCache[f.topic]=j;const keys=Object.keys(state.teacher.lessonCache);if(keys.length>6)delete state.teacher.lessonCache[keys[0]];save();slot.innerHTML=lessonHtml(j,f);wireLesson(j,f);
    }catch(e){slot.innerHTML=`<div class="card pt-lesson"><div class="tip red"><b>Hızlı tekrar hazırlanamadı</b><p>${esc(e.message)}</p></div><button id="ptRetryLesson" class="primary">Tekrar Dene</button></div>`;slot.querySelector('#ptRetryLesson').onclick=()=>openLesson(f)}
  }

  function wireLesson(data,f){
    const slot=root.querySelector('#ptLessonSlot');if(!slot)return;
    slot.querySelector('#ptCloseLesson').onclick=()=>{slot.innerHTML=''};
    slot.querySelectorAll('[data-pt-choice]').forEach(btn=>btn.onclick=()=>{
      const chosen=btn.dataset.ptChoice,correct=data.check_answer,box=slot.querySelector('#ptCheckFeedback');
      slot.querySelectorAll('[data-pt-choice]').forEach(b=>{b.disabled=true;if(b.dataset.ptChoice===correct)b.classList.add('correct')});
      if(chosen!==correct)btn.classList.add('wrong');
      box.className='pt-feedback '+(chosen===correct?'good':'bad');box.innerHTML=`<b>${chosen===correct?'Doğru ✓':'Doğru cevap '+correct}</b><br>${esc(data.check_explanation||'')}`;
      state.teacher.daily=state.teacher.daily||{date:todayKey(),topic:f.topic};state.teacher.daily.recapDone=true;save();
    });
  }

  function optionMatch(select,value){const n=normalize(value),opts=[...select.options];return opts.find(o=>normalize(o.value)===n)||opts.find(o=>normalize(o.value).includes(n)||n.includes(normalize(o.value)))||opts[0]}
  function launchMiniTest(f){
    state.teacher.daily=state.teacher.daily||{date:todayKey(),topic:f.topic};state.teacher.daily.testStarted=true;save();
    go('tests');window.renderMiniTestHome?.();
    let tries=0;
    const openTimer=setInterval(()=>{tries++;const b=document.querySelector('#tests [data-mt-mode="topic"]');if(b){clearInterval(openTimer);b.click();setTimeout(configure,80)}else if(tries>20){clearInterval(openTimer);alert('Mini Test ekranı açılamadı. Mini Testler > Konu Seçerek Test bölümünden devam edebilirsin.')}},50);
    function configure(){
      const exam=document.getElementById('mtExam'),subject=document.getElementById('mtSubject'),topic=document.getElementById('mtTopic');if(!exam||!subject||!topic){setTimeout(configure,80);return}
      const examOpt=optionMatch(exam,f.exam);if(examOpt)exam.value=examOpt.value;exam.dispatchEvent(new Event('change',{bubbles:true}));
      setTimeout(()=>{const so=optionMatch(subject,f.subject);if(so)subject.value=so.value;subject.dispatchEvent(new Event('change',{bubbles:true}));setTimeout(()=>{const to=optionMatch(topic,f.topic);if(to)topic.value=to.value;const count=document.getElementById('mtCount'),diff=document.getElementById('mtDifficulty');if(count)count.value='5';if(diff)diff.value='Dengeli';document.getElementById('mtGenerate')?.click()},60)},60)
    }
  }

  window.renderTeacher=render;
  if(root.classList.contains('active'))render();
})();
