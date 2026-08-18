(()=>{
  const style=document.createElement('style');
  style.textContent=`
    @keyframes yksWrite{0%,100%{transform:translateX(-7px) rotate(-8deg)}50%{transform:translateX(7px) rotate(5deg)}}
    @keyframes yksDots{0%,20%{opacity:.25}50%{opacity:1}80%,100%{opacity:.25}}
    .analysis-wrap.ai-working .ring{background:linear-gradient(145deg,#f2efff,#fff)!important;border:1px solid #ddd7ff;box-shadow:0 14px 34px rgba(104,71,235,.12);position:relative}
    .analysis-wrap.ai-working .ring:before{display:none}
    .analysis-wrap.ai-working .ring strong{font-size:42px;animation:yksWrite 1.15s ease-in-out infinite;display:inline-block;color:inherit}
    .analysis-wrap.ai-working .ring:after{content:'•••';position:absolute;bottom:24px;left:0;right:0;color:var(--violet);font-size:15px;letter-spacing:5px;animation:yksDots 1.15s ease-in-out infinite}
    .analysis-wrap.ai-working .analysis-card,.analysis-wrap.ai-working #showSolution{display:none!important}
    #similarChoices.yks-choice-list{display:grid;grid-template-columns:1fr;gap:10px;margin-top:10px}
    #similarChoices .yks-choice{width:100%;display:grid;grid-template-columns:44px 1fr;align-items:center;gap:12px;text-align:left;border:1px solid var(--line);background:var(--surface);border-radius:15px;padding:11px 14px;transition:.16s ease;box-shadow:0 4px 14px rgba(28,30,57,.04)}
    #similarChoices .yks-choice:hover{transform:translateY(-1px);border-color:#cfc7ff;box-shadow:0 8px 20px rgba(104,71,235,.09)}
    #similarChoices .choice-letter{width:36px;height:36px;border-radius:11px;background:#eeeaff;color:#553fd1;display:grid;place-items:center;font-weight:900}
    #similarChoices .choice-text{line-height:1.4;font-weight:650;color:var(--ink)}
    #similarChoices .yks-choice.correct{border-color:#9eddbf;background:#effbf5}
    #similarChoices .yks-choice.wrong{border-color:#ffc4ca;background:#fff4f5}
    .stuck-step-picker{display:grid;gap:9px;margin:14px 0}
    .stuck-step-btn{display:grid;grid-template-columns:34px 1fr;gap:10px;align-items:center;text-align:left;border:1px solid var(--line);background:var(--surface);border-radius:13px;padding:10px 12px}
    .stuck-step-btn span:first-child{width:28px;height:28px;border-radius:9px;background:#eeeaff;color:#553fd1;display:grid;place-items:center;font-weight:900}
    .stuck-step-btn.active{border-color:#bdb2ff;background:#f7f5ff}
    .stuck-current{margin:12px 0}
  `;
  document.head.appendChild(style);

  function resetAnalysisView(){
    const wrap=document.querySelector('#analyze .analysis-wrap');
    if(!wrap)return;
    wrap.classList.add('ai-working');
    const ringText=wrap.querySelector('.ring strong');
    if(ringText)ringText.textContent='✍️';
    const title=wrap.querySelector('h1');
    const sub=wrap.querySelector('h1 + p');
    if(title)title.textContent='Soru inceleniyor';
    if(sub)sub.textContent='Ders, konu ve çözüm yolu hazırlanıyor.';
    const checklist=wrap.querySelector('.checklist');
    if(checklist)checklist.innerHTML='<div>◌ Soru okunuyor</div><div>◌ Ders ve konu belirleniyor</div><div>◌ Kazanım eşleştiriliyor</div><div>◌ Çözüm hazırlanıyor</div>';
    [aSubject,aTopic,aDifficulty,aOutcome].forEach(el=>{if(el)el.textContent='—'});
    document.querySelector('#analyze .analysis-card')?.classList.add('hidden');
    showSolution?.classList.add('hidden');
  }

  function populateTips(){
    const x=lastLiveResult;if(!x)return false;
    const orange=document.querySelector('#tips .tip.orange');
    const red=document.querySelector('#tips .tip.red');
    const blue=document.querySelector('#tips .tip.blue');
    if(orange){orange.querySelector('b').textContent='💡 Püf Noktası';orange.querySelector('p').textContent=x.tip||'Bu soruda temel kuralı doğru seç.'}
    if(red){red.querySelector('b').textContent='🎯 Dikkat / Çeldirici';red.querySelector('p').textContent=x.distractor||'Benzer görünen seçeneklerde işlem veya yorum farkına dikkat et.'}
    if(blue){blue.querySelector('b').textContent='🧠 Sınav Notu';blue.querySelector('p').textContent=x.exam_note||x.why||'Sorunun ölçtüğü kazanıma odaklan.'}
    return true;
  }

  let selectedStuckStep=0;
  function renderStuck(){
    const x=lastLiveResult;if(!x)return false;
    const card=document.querySelector('#stuck .card');if(!card)return false;
    const steps=(x.steps||[]).filter(Boolean);
    selectedStuckStep=Math.min(selectedStuckStep,Math.max(0,steps.length-1));
    card.innerHTML=`
      <h2>Hangi adımda takıldın?</h2>
      <p class="muted">Yalnızca anlamadığın adımı seç; diğer adımları tekrar etmeyelim.</p>
      <div id="stuckStepPicker" class="stuck-step-picker"></div>
      <div id="stuckCurrent" class="tip blue stuck-current"></div>
      <p><b>Nasıl anlatayım?</b></p>
      <div class="stuck-options">
        <button class="secondary" data-stuck-mode="simple">💬 Daha basit</button>
        <button class="secondary" data-stuck-mode="example">🧩 Örnekle</button>
        <button class="secondary" data-stuck-mode="other">🔄 Başka yöntem</button>
      </div>
      <div id="stuckExplain" class="tip blue hidden" style="margin-top:14px"></div>`;
    const picker=card.querySelector('#stuckStepPicker');
    const current=card.querySelector('#stuckCurrent');
    const safeSteps=steps.length?steps:[x.short_solution||x.why||'Çözüm adımı'];
    const draw=()=>{
      picker.innerHTML='';
      safeSteps.forEach((step,i)=>{
        const b=document.createElement('button');b.className='stuck-step-btn'+(i===selectedStuckStep?' active':'');
        b.innerHTML=`<span>${i+1}</span><span>${esc(step)}</span>`;
        b.onclick=()=>{selectedStuckStep=i;draw();card.querySelector('#stuckExplain')?.classList.add('hidden')};picker.appendChild(b);
      });
      current.innerHTML=`<b>Seçilen adım ${selectedStuckStep+1}</b><p style="margin-bottom:0">${esc(safeSteps[selectedStuckStep]||'')}</p>`;
    };
    draw();
    card.querySelectorAll('[data-stuck-mode]').forEach(btn=>btn.onclick=async()=>{
      const box=card.querySelector('#stuckExplain');
      box.className='tip blue';box.textContent='✍️ Açıklama hazırlanıyor…';
      btn.disabled=true;
      try{
        const r=await fetch('/api/explain',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({mode:btn.dataset.stuckMode,step:safeSteps[selectedStuckStep],solution:{exam:x.exam,subject:x.subject,topic:x.topic,curriculum_outcome:x.curriculum_outcome,difficulty:x.difficulty,answer:x.answer,short_solution:x.short_solution}})});
        const j=await r.json();if(!r.ok)throw new Error(j.error||'Açıklama alınamadı');box.textContent=j.explanation||'Açıklama alınamadı.';
      }catch(err){box.className='tip red';box.textContent=err.message}finally{btn.disabled=false}
    });
    return true;
  }

  const originalApply=applyLiveResult;
  applyLiveResult=function(x){
    originalApply(x);
    const boxes=[...document.querySelectorAll('#solution .solution-layout > .card:first-child .meta > div')];
    const lesson=[x.exam,x.subject].filter(Boolean).join(' ')||'—';
    if(boxes[0])boxes[0].innerHTML=`Ders<br><b>${esc(lesson)}</b>`;
    if(boxes[1])boxes[1].innerHTML=`Konu<br><b>${esc(x.topic||'—')}</b>`;
    if(boxes[2])boxes[2].innerHTML=`Seviye<br><b>${esc(x.difficulty||'—')}</b>`;
    if(boxes[3])boxes[3].innerHTML='Kaynak<br><b>Kullanıcı sorusu</b>';
    const shot=document.querySelector('#solution .question-shot');
    if(shot){
      shot.innerHTML='';
      if(selectedImageData){
        const img=document.createElement('img');img.src=selectedImageData;img.alt='Yüklenen soru';img.style.maxWidth='100%';img.style.maxHeight='360px';img.style.borderRadius='12px';shot.appendChild(img);
      }else{
        const p=document.createElement('p');p.textContent=(questionText?.value||'Metin sorusu').trim();p.style.whiteSpace='pre-wrap';p.style.textAlign='left';p.style.width='100%';shot.appendChild(p);
      }
    }
    populateTips();
  };

  liveSolve=async function({text='',image=''}){
    resetAnalysisView();go('analyze');
    const wrap=document.querySelector('#analyze .analysis-wrap');
    try{
      if(!liveApi)throw new Error('Canlı bağlantı hazır değil.');
      const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),35000);
      const r=await fetch('/api/solve',{method:'POST',headers:{'Content-Type':'application/json'},signal:controller.signal,body:JSON.stringify({text,image,student:{name:state.profile.name,tone:state.profile.tone}})});
      clearTimeout(timer);const j=await r.json();if(!r.ok)throw new Error(j.error||'API hatası');
      applyLiveResult(j);wrap?.classList.remove('ai-working','ai-loading');go('solution');return true;
    }catch(e){
      wrap?.classList.remove('ai-working','ai-loading');
      if(e?.name==='AbortError')alert('Çözüm beklenenden uzun sürdü. Lütfen tekrar deneyin.');else alert('Canlı çözüm alınamadı: '+e.message);return false;
    }
  };

  const tipBtn=document.querySelector('#solution [data-go="tips"]');
  if(tipBtn)tipBtn.onclick=e=>{e.preventDefault();if(!populateTips()){alert('Önce bir soru çözmelisin.');return}go('tips')};

  const stuckBtn=document.querySelector('#solution [data-go="stuck"]');
  if(stuckBtn)stuckBtn.onclick=e=>{e.preventDefault();selectedStuckStep=0;if(!renderStuck()){alert('Önce bir soru çözmelisin.');return}go('stuck')};

  function stripLabel(v){return String(v||'').replace(/^\s*[A-Ea-e]\s*[\)\].:\-]\s*/, '').trim()}
  const letters=['A','B','C','D','E'];
  const similarBtn=document.querySelector('#solution [data-go="similar"]');
  if(similarBtn){
    similarBtn.onclick=async e=>{
      e.preventDefault();go('similar');feedback.classList.add('hidden');
      similarQuestion.textContent='Benzer soru hazırlanıyor…';
      similarChoices.className='choices yks-choice-list';
      similarChoices.innerHTML='<div class="muted" style="text-align:center;padding:18px">Aynı ders, konu ve kazanım korunuyor.</div>';
      hint.disabled=true;
      if(!lastLiveResult){similarQuestion.textContent='Önce bir soru çözmelisin.';return}
      try{
        const r=await fetch('/api/similar',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({solution:{exam:lastLiveResult.exam,subject:lastLiveResult.subject,topic:lastLiveResult.topic,curriculum_outcome:lastLiveResult.curriculum_outcome,difficulty:lastLiveResult.difficulty,short_solution:lastLiveResult.short_solution}})});
        const j=await r.json();if(!r.ok)throw new Error(j.error||'Benzer soru oluşturulamadı');
        similarQuestion.textContent=j.question||'';similarChoices.innerHTML='';
        const correct=stripLabel(j.answer);
        (j.choices||[]).slice(0,5).forEach((raw,i)=>{
          const choice=stripLabel(raw);const b=document.createElement('button');b.className='yks-choice';
          b.innerHTML=`<span class="choice-letter">${letters[i]}</span><span class="choice-text">${esc(choice)}</span>`;
          b.onclick=()=>{const ok=choice===correct;b.classList.add(ok?'correct':'wrong');feedback.className='tip '+(ok?'blue':'red');feedback.textContent=ok?'✅ Doğru!':'❌ Bu seçenek doğru değil. İstersen ipucu al.';feedback.classList.remove('hidden')};similarChoices.appendChild(b);
        });
        hint.disabled=false;hint.onclick=()=>{feedback.className='tip blue';feedback.textContent='💡 '+(j.hint||'Aynı kazanımın temel kuralını düşün.');feedback.classList.remove('hidden')};
      }catch(err){similarQuestion.textContent='Benzer soru oluşturulamadı.';similarChoices.innerHTML=`<div class="tip red">${esc(err.message)}</div>`;hint.disabled=true}
    };
  }
})();
