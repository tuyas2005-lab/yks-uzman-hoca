(()=>{
  const root=document.getElementById('tests');
  if(!root)return;
  state.miniTests??={history:[]};

  const curriculum={
    TYT:{
      'Matematik':['Temel Kavramlar','Sayı Basamakları','Bölme ve Bölünebilme','EBOB-EKOK','Rasyonel Sayılar','Basit Eşitsizlikler','Mutlak Değer','Üslü Sayılar','Köklü Sayılar','Çarpanlara Ayırma','Oran-Orantı','Denklem Çözme','Problemler','Kümeler','Mantık','Fonksiyonlar','Permütasyon-Kombinasyon','Olasılık','Veri ve İstatistik'],
      'Geometri':['Açılar ve Üçgenler','Çokgenler','Dörtgenler','Çember ve Daire','Analitik Geometri','Katı Cisimler'],
      'Türkçe':['Sözcükte Anlam','Cümlede Anlam','Paragraf','Ses Bilgisi','Yazım Kuralları','Noktalama','Sözcük Türleri','Fiiller','Cümlenin Ögeleri','Cümle Türleri','Anlatım Bozukluğu'],
      'Fizik':['Fizik Bilimine Giriş','Madde ve Özellikleri','Hareket ve Kuvvet','İş-Güç-Enerji','Isı-Sıcaklık','Elektrostatik','Elektrik ve Manyetizma','Basınç','Dalgalar','Optik'],
      'Kimya':['Kimya Bilimi','Atom ve Periyodik Sistem','Kimyasal Türler Arası Etkileşim','Maddenin Halleri','Doğa ve Kimya','Kimyanın Temel Kanunları','Karışımlar','Asit-Baz-Tuz','Kimya Her Yerde'],
      'Biyoloji':['Canlıların Ortak Özellikleri','Temel Bileşenler','Hücre','Canlıların Sınıflandırılması','Hücre Bölünmeleri','Kalıtım','Ekosistem Ekolojisi'],
      'Tarih':['Tarih Bilimi','İlk ve Orta Çağlarda Türk Dünyası','İslam Medeniyetinin Doğuşu','Türklerin İslamiyet’i Kabulü','Osmanlı Kuruluş ve Yükseliş','Osmanlı Kültür ve Medeniyeti','XVII-XIX. Yüzyıl Osmanlı','Millî Mücadele','Atatürk İlke ve İnkılapları'],
      'Coğrafya':['Doğa ve İnsan','Harita Bilgisi','Dünya’nın Şekli ve Hareketleri','İklim Bilgisi','Yer Şekilleri','Nüfus ve Yerleşme','Türkiye Coğrafyası','Ekonomik Faaliyetler','Bölgeler','Çevre ve Toplum'],
      'Felsefe':['Felsefenin Konusu','Bilgi Felsefesi','Varlık Felsefesi','Ahlak Felsefesi','Sanat Felsefesi','Din Felsefesi','Siyaset Felsefesi','Bilim Felsefesi'],
      'Din Kültürü':['Bilgi ve İnanç','Din ve İslam','İslam ve İbadet','Ahlak ve Değerler','Hz. Muhammed','Vahiy ve Akıl']
    },
    AYT:{
      'Matematik':['Fonksiyonlar','Polinomlar','İkinci Dereceden Denklemler','Karmaşık Sayılar','Eşitsizlikler','Parabol','Trigonometri','Logaritma','Diziler','Permütasyon-Kombinasyon-Olasılık','Limit','Türev','İntegral'],
      'Geometri':['Üçgenler','Dörtgenler ve Çokgenler','Çember ve Daire','Analitik Geometri','Dönüşümler','Katı Cisimler'],
      'Türk Dili ve Edebiyatı':['Anlam Bilgisi','Şiir Bilgisi','Edebî Sanatlar','İslamiyet Öncesi Türk Edebiyatı','Halk Edebiyatı','Divan Edebiyatı','Tanzimat Edebiyatı','Servetifünun ve Fecriati','Millî Edebiyat','Cumhuriyet Dönemi','Dünya Edebiyatı'],
      'Fizik':['Vektörler','Kuvvet-Tork-Denge','Kütle Merkezi','Basit Makineler','Hareket','Newton Yasaları','İş-Güç-Enerji','İtme-Momentum','Elektrik Alan ve Potansiyel','Manyetizma','Alternatif Akım','Çembersel Hareket','Basit Harmonik Hareket','Dalga Mekaniği','Modern Fizik'],
      'Kimya':['Modern Atom Teorisi','Gazlar','Sıvı Çözeltiler','Kimyasal Tepkimelerde Enerji','Kimyasal Tepkimelerde Hız','Kimyasal Denge','Asit-Baz Dengesi','Çözünürlük Dengesi','Kimya ve Elektrik','Organik Kimya','Enerji Kaynakları'],
      'Biyoloji':['Sinir Sistemi','Endokrin Sistem','Duyu Organları','Destek ve Hareket','Sindirim','Dolaşım ve Bağışıklık','Solunum','Boşaltım','Üreme ve Gelişme','Komünite ve Popülasyon Ekolojisi','Genden Proteine','Canlılarda Enerji Dönüşümleri','Bitki Biyolojisi'],
      'Tarih':['Osmanlı Devleti ve Dünya','Değişim Çağında Avrupa ve Osmanlı','Uluslararası İlişkilerde Denge Stratejisi','XX. Yüzyıl Başlarında Osmanlı','Millî Mücadele','Atatürkçülük','İki Savaş Arası Dönem','II. Dünya Savaşı','Soğuk Savaş','Küreselleşen Dünya'],
      'Coğrafya':['Ekosistem','Nüfus Politikaları','Şehirler ve Etki Alanları','Ekonomik Faaliyetler','Türkiye Ekonomisi','Kültür Bölgeleri','Küresel Ticaret','Jeopolitik Konum','Ülkeler ve Bölgeler','Çevre Sorunları']
    }
  };
  const letters=['A','B','C','D','E'];
  let setupMode='smart',currentTest=null,currentIndex=0,answers=[];

  const css=document.createElement('style');
  css.textContent=`
    .mt-hero{padding:20px;border-radius:22px;background:linear-gradient(135deg,#f2efff,#fff);border:1px solid #e4defe;margin-bottom:16px}.mt-hero h2{margin:0 0 6px}.mt-mode-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.mt-mode{border:1px solid var(--line);background:var(--surface);border-radius:20px;padding:18px;text-align:left;box-shadow:0 8px 24px rgba(24,29,70,.05)}.mt-mode .mt-icon{width:48px;height:48px;border-radius:15px;background:#eeeaff;display:grid;place-items:center;font-size:25px;margin-bottom:14px}.mt-mode h3{margin:0 0 7px}.mt-mode p{min-height:48px}.mt-mode .primary{margin-top:8px}.mt-history{display:grid;gap:9px}.mt-hrow{display:grid;grid-template-columns:1fr auto auto;gap:12px;align-items:center;padding:12px;border:1px solid var(--line);border-radius:14px}.mt-setup{max-width:850px;margin:auto}.mt-context{padding:14px;border-radius:15px;background:#f8f7ff;border:1px solid #e4defe;margin:12px 0}.mt-form{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.mt-form label{display:grid;gap:6px;font-weight:700}.mt-form select{width:100%;padding:12px;border:1px solid var(--line);border-radius:13px;background:var(--surface);color:var(--ink)}.mt-loading{text-align:center;padding:45px 20px}.mt-pencil{font-size:46px;display:inline-block;animation:yksWrite 1.15s ease-in-out infinite}.mt-runner{max-width:850px;margin:auto}.mt-progress-top{display:flex;justify-content:space-between;align-items:center;gap:12px}.mt-progress{height:8px;background:#ebe9f5;border-radius:20px;overflow:hidden;margin:12px 0 22px}.mt-progress i{display:block;height:100%;background:linear-gradient(90deg,#6747eb,#5367ff);border-radius:inherit}.mt-qmeta{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}.mt-question{font-size:21px;line-height:1.55;font-weight:750;padding:12px 0 18px}.mt-choices{display:grid;gap:10px}.mt-choice{display:grid;grid-template-columns:42px 1fr;gap:12px;align-items:center;width:100%;padding:12px 14px;border:1px solid var(--line);border-radius:15px;background:var(--surface);text-align:left;color:var(--ink)}.mt-choice span:first-child{width:34px;height:34px;border-radius:10px;background:#eeeaff;color:#553fd1;display:grid;place-items:center;font-weight:900}.mt-choice.selected{border-color:#8b78f7;background:#f6f3ff;box-shadow:0 7px 20px rgba(104,71,235,.10)}.mt-nav{display:flex;justify-content:space-between;gap:10px;margin-top:20px}.mt-score{display:grid;place-items:center;width:150px;height:150px;margin:10px auto 18px;border-radius:50%;background:conic-gradient(#6747eb var(--score),#eceaf5 0);position:relative}.mt-score:after{content:'';position:absolute;inset:14px;background:var(--surface);border-radius:50%}.mt-score strong{position:relative;z-index:1;font-size:30px}.mt-review{display:grid;gap:12px;margin-top:16px}.mt-review-item{padding:14px;border:1px solid var(--line);border-radius:15px}.mt-review-item.wrong{border-color:#ffc8cc;background:#fff8f8}.mt-review-item.correct{border-color:#bde7cf;background:#f7fcf9}.mt-review-choice{font-size:14px;margin-top:8px}.mt-result-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}
    @media(max-width:900px){.mt-mode-grid{grid-template-columns:1fr}.mt-mode p{min-height:0}.mt-form{grid-template-columns:1fr}}
  `;
  document.head.appendChild(css);

  function uniqTopics(arr){return [...new Set((arr||[]).map(x=>typeof x==='string'?x:x?.topic).filter(Boolean))]}
  function weakContext(){return topicEntries().slice(0,4).map(([topic,score])=>({topic,score}))}
  function wrongContext(){return uniqTopics((state.sessions||[]).filter(x=>!x.correct).slice(-10).reverse())}
  function recentContext(){return uniqTopics((state.sessions||[]).slice(-10).reverse())}
  function historyHtml(){const h=(state.miniTests?.history||[]).slice(0,5);return h.length?h.map(x=>`<div class="mt-hrow"><div><b>${esc(x.title)}</b><br><small class="muted">${esc(x.date)} • ${x.count} soru</small></div><span class="pill ${x.percent>=70?'green':'orange'}">%${x.percent}</span><b>${x.correct}/${x.count}</b></div>`).join(''):'<div class="muted">Henüz tamamlanmış mini test yok.</div>'}

  function renderHome(){
    const weak=weakContext()[0],wrong=wrongContext();
    root.innerHTML=`<div class="screen-head"><button class="back" data-go="home">←</button><h1>Mini Testler</h1></div>
      <div class="mt-hero"><span class="pill green">YKS Uzman Hoca</span><h2>Bugün neyi pekiştirelim?</h2><p class="muted">Sorular özgün üretilir; MEB kazanım mantığı ve ÖSYM tarzı hedeflenir. Cevaplar test bitene kadar gösterilmez.</p></div>
      <div class="mt-mode-grid">
        <div class="mt-mode"><div class="mt-icon">🧠</div><h3>Bana Test Hazırla</h3><p class="muted">Zayıf konuların, son yanlışların ve yakın çalışmaların birlikte değerlendirilir.</p><div class="pill orange">Öncelik: ${esc(weak?.[0]||weak?.topic||'Zayıf konu')}</div><button class="primary full" data-mt-mode="smart">Akıllı Test Oluştur</button></div>
        <div class="mt-mode"><div class="mt-icon">🎯</div><h3>Konu Seçerek Test</h3><p class="muted">TYT/AYT, ders, konu, soru sayısı ve zorluk düzeyini kendin seç.</p><div class="pill">Tam kontrol</div><button class="secondary full" data-mt-mode="topic">Konu Seç</button></div>
        <div class="mt-mode"><div class="mt-icon">🔁</div><h3>Yanlışlarımdan Test</h3><p class="muted">Daha önce yanlış yaptığın konuları yeni ve özgün sorularla tekrar ölç.</p><div class="pill red">${wrong.length} konu</div><button class="secondary full" data-mt-mode="wrong" ${wrong.length?'':'disabled'}>Yanlışları Tekrarla</button></div>
      </div>
      <div class="card" style="margin-top:16px"><div class="section-title" style="margin-top:0"><h2>Son Mini Testler</h2><span class="muted">Son 5</span></div><div class="mt-history">${historyHtml()}</div></div>`;
    root.querySelector('[data-go="home"]').onclick=()=>go('home');
    root.querySelectorAll('[data-mt-mode]').forEach(b=>b.onclick=()=>openSetup(b.dataset.mtMode));
  }

  function openSetup(mode){
    setupMode=mode;
    const weak=weakContext(),wrong=wrongContext();
    const context=mode==='smart'?`En zayıf konular: ${weak.map(x=>`${x[0]||x.topic} %${x[1]??x.score}`).join(', ')}. Son yanlış konuları: ${wrong.join(', ')||'yok'}.`:mode==='wrong'?`Test şu yanlış konu başlıklarından üretilecek: ${wrong.join(', ')||'Henüz yanlış kayıt yok.'}`:'Seçtiğin ders ve konuya odaklanan özgün test hazırlanacak.';
    root.innerHTML=`<div class="screen-head"><button class="back" id="mtSetupBack">←</button><h1>${mode==='smart'?'Akıllı Mini Test':mode==='wrong'?'Yanlışlarımdan Test':'Konu Seçerek Test'}</h1></div><div class="card mt-setup">
      <div class="mt-context">${esc(context)}</div>
      <div class="mt-form">
        ${mode==='topic'?`<label>Sınav<select id="mtExam"><option>TYT</option><option>AYT</option></select></label><label>Ders<select id="mtSubject"></select></label><label style="grid-column:1/-1">Konu<select id="mtTopic"></select></label>`:''}
        <label>Soru sayısı<select id="mtCount"><option value="5">5 soru</option><option value="10">10 soru</option></select></label>
        <label>Zorluk<select id="mtDifficulty"><option>Dengeli</option><option>YKS Düzeyi</option><option>Kolay</option><option>Orta</option><option>Zor</option></select></label>
      </div>
      <div class="tip blue" style="margin-top:16px"><b>📚 Soru kaynağı</b><p>Hazır soru bankasından kopyalama yapılmaz. YKS Uzman Hoca, seçilen kazanımlara göre yeni sorular üretir.</p></div>
      <button id="mtGenerate" class="primary full" style="margin-top:14px">Testi Hazırla</button>
    </div>`;
    root.querySelector('#mtSetupBack').onclick=renderHome;
    if(mode==='topic'){
      const exam=root.querySelector('#mtExam'),subject=root.querySelector('#mtSubject'),topic=root.querySelector('#mtTopic');
      const updateSubjects=()=>{subject.innerHTML=Object.keys(curriculum[exam.value]).map(s=>`<option>${esc(s)}</option>`).join('');updateTopics()};
      const updateTopics=()=>{topic.innerHTML=(curriculum[exam.value][subject.value]||[]).map(t=>`<option>${esc(t)}</option>`).join('')};
      exam.onchange=updateSubjects;subject.onchange=updateTopics;updateSubjects();
    }
    root.querySelector('#mtGenerate').onclick=()=>generateTest({mode,count:+root.querySelector('#mtCount').value,difficulty:root.querySelector('#mtDifficulty').value,selection:mode==='topic'?{exam:root.querySelector('#mtExam').value,subject:root.querySelector('#mtSubject').value,topic:root.querySelector('#mtTopic').value}:{}});
  }

  async function generateTest({mode='smart',count=5,difficulty='Dengeli',selection={},forcedWrongTopics=null}){
    root.innerHTML=`<div class="screen-head"><button class="back" id="mtCancel">←</button><h1>Mini Test Hazırlanıyor</h1></div><div class="card mt-loading"><div class="mt-pencil">✍️</div><h2>Sorular hazırlanıyor</h2><p class="muted">Kazanımlar seçiliyor, seçenekler dengeleniyor ve cevaplar kontrol ediliyor.</p></div>`;
    root.querySelector('#mtCancel').onclick=renderHome;
    try{
      const payload={mode,count,difficulty,selection,weakTopics:weakContext(),wrongTopics:forcedWrongTopics||wrongContext(),recentTopics:recentContext()};
      const r=await fetch('/api/mini-test',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}),j=await r.json();
      if(!r.ok)throw new Error(j.error||'Mini test hazırlanamadı');
      currentTest={...j,mode,count,difficulty,selection};currentIndex=0;answers=Array(j.questions.length).fill(null);renderQuestion();
    }catch(e){root.innerHTML=`<div class="screen-head"><button class="back" id="mtErrorBack">←</button><h1>Mini Test</h1></div><div class="card"><div class="tip red"><b>Test hazırlanamadı</b><p>${esc(e.message)}</p></div><button id="mtRetry" class="primary full">Tekrar Dene</button></div>`;root.querySelector('#mtErrorBack').onclick=renderHome;root.querySelector('#mtRetry').onclick=()=>openSetup(mode)}
  }

  function renderQuestion(){
    const q=currentTest.questions[currentIndex],pct=Math.round((currentIndex+1)/currentTest.questions.length*100);
    root.innerHTML=`<div class="screen-head"><button class="back" id="mtExit">←</button><h1>${esc(currentTest.title)}</h1></div><div class="card mt-runner">
      <div class="mt-progress-top"><b>Soru ${currentIndex+1} / ${currentTest.questions.length}</b><span class="pill">${esc(q.difficulty)}</span></div><div class="mt-progress"><i style="width:${pct}%"></i></div>
      <div class="mt-qmeta"><span class="pill">${esc(q.exam)} ${esc(q.subject)}</span><span class="pill green">${esc(q.topic)}</span></div>
      <div class="mt-question">${esc(q.question)}</div><div class="mt-choices">${q.choices.map((c,i)=>`<button class="mt-choice ${answers[currentIndex]===letters[i]?'selected':''}" data-choice="${letters[i]}"><span>${letters[i]}</span><span>${esc(c)}</span></button>`).join('')}</div>
      <div class="mt-nav"><button id="mtPrev" class="ghost" ${currentIndex===0?'disabled':''}>← Önceki</button><button id="mtNext" class="primary" ${answers[currentIndex]?'':'disabled'}>${currentIndex===currentTest.questions.length-1?'Testi Bitir':'Sonraki →'}</button></div>
      <p class="muted" style="text-align:center;margin:14px 0 0">Cevap test bitene kadar gösterilmez.</p></div>`;
    root.querySelector('#mtExit').onclick=()=>{if(confirm('Mini testten çıkılsın mı? Bu testin cevapları kaydedilmeyecek.'))renderHome()};
    root.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{answers[currentIndex]=b.dataset.choice;renderQuestion()});
    root.querySelector('#mtPrev').onclick=()=>{if(currentIndex>0){currentIndex--;renderQuestion()}};
    root.querySelector('#mtNext').onclick=()=>{if(!answers[currentIndex])return;if(currentIndex<currentTest.questions.length-1){currentIndex++;renderQuestion()}else finishTest()};
  }

  function finishTest(){
    const qs=currentTest.questions;let correct=0;const wrongTopics=[];
    qs.forEach((q,i)=>{const ok=answers[i]===q.answer;if(ok)correct++;else wrongTopics.push(q.topic);state.sessions.push({id:Date.now()+i,date:new Date().toLocaleDateString('tr-TR'),subject:[q.exam,q.subject].filter(Boolean).join(' '),topic:q.topic,curriculum_outcome:q.curriculum_outcome,correct:ok,source:'mini-test'});const old=Number(state.topicMastery[q.topic]??60);state.topicMastery[q.topic]=Math.max(20,Math.min(100,old+(ok?3:-5)))});
    state.todayCount=(state.todayCount||0)+qs.length;
    const percent=Math.round(correct/qs.length*100),summary={id:Date.now(),date:new Date().toLocaleDateString('tr-TR'),title:currentTest.title,count:qs.length,correct,percent,mode:currentTest.mode};
    state.miniTests.history=[summary,...(state.miniTests.history||[])].slice(0,20);save();renderHome();renderWrong();renderStats();renderResult(correct,percent,uniqTopics(wrongTopics));
  }

  function renderResult(correct,percent,wrongTopics){
    const qs=currentTest.questions;const comment=percent>=90?'Çok güçlü sonuç. Bu konularda sınav temposuna geçebilirsin.':percent>=70?'İyi gidiyor. Yanlış çıkan kazanımları kısa bir tur daha pekiştirelim.':percent>=50?'Temel oturuyor ama birkaç kazanımın tekrar edilmesi faydalı olur.':'Bu test bize nereden başlayacağımızı gösterdi. Önce yanlış kazanımları küçük parçalar halinde tekrar edelim.';
    root.innerHTML=`<div class="screen-head"><button class="back" id="mtResultHome">←</button><h1>Mini Test Sonucu</h1></div><div class="card" style="max-width:900px;margin:auto"><div class="mt-score" style="--score:${percent}%"><strong>%${percent}</strong></div><h2 style="text-align:center">${correct} / ${qs.length} doğru</h2><p class="muted" style="text-align:center">${esc(comment)}</p>${wrongTopics.length?`<div class="tip orange"><b>Tekrar önerilen konular</b><p>${wrongTopics.map(esc).join(' • ')}</p></div>`:'<div class="tip blue"><b>🎉 Tüm sorular doğru</b><p>Bu testi başarıyla tamamladın.</p></div>'}
      <div class="mt-result-actions"><button id="mtHome" class="secondary">Mini Test Merkezi</button>${wrongTopics.length?'<button id="mtWrongAgain" class="primary">Yanlışlarımdan 3 Soru Daha</button>':''}<button id="mtRepeat" class="ghost">Aynı Konuyu Tekrar Et</button></div>
      <div class="section-title"><h2>Soru Analizi</h2><span class="muted">Çözümler şimdi açık</span></div><div class="mt-review">${qs.map((q,i)=>{const ok=answers[i]===q.answer;return `<div class="mt-review-item ${ok?'correct':'wrong'}"><b>${i+1}. ${esc(q.question)}</b><div class="mt-review-choice">Senin cevabın: <b>${esc(answers[i]||'Boş')}</b> • Doğru cevap: <b>${esc(q.answer)}</b></div><p>${esc(q.explanation)}</p><small class="muted">${esc(q.exam)} ${esc(q.subject)} • ${esc(q.topic)} • ${esc(q.curriculum_outcome)}</small><div style="margin-top:7px">💡 ${esc(q.tip)}</div></div>`}).join('')}</div></div>`;
    root.querySelector('#mtResultHome').onclick=renderHome;root.querySelector('#mtHome').onclick=renderHome;
    const wrongBtn=root.querySelector('#mtWrongAgain');if(wrongBtn)wrongBtn.onclick=()=>generateTest({mode:'wrong',count:3,difficulty:'Dengeli',forcedWrongTopics:wrongTopics});
    root.querySelector('#mtRepeat').onclick=()=>{const target=wrongTopics[0]||currentTest.selection?.topic||qs[0].topic;const q=qs.find(x=>x.topic===target)||qs[0];generateTest({mode:'topic',count:5,difficulty:'Dengeli',selection:{exam:q.exam,subject:q.subject,topic:target}})};
  }

  window.renderMiniTestHome=renderHome;
  renderHome();
})();
