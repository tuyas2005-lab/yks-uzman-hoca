(()=>{
  const style=document.createElement('style');
  style.textContent=`
    @keyframes yksSpin{to{transform:rotate(360deg)}}
    @keyframes yksSpinBack{to{transform:rotate(-360deg)}}
    .analysis-wrap.ai-working .ring{background:none!important;border:12px solid #e9e7f6;border-top-color:var(--violet);animation:yksSpin .9s linear infinite}
    .analysis-wrap.ai-working .ring:before{display:none}
    .analysis-wrap.ai-working .ring strong{animation:yksSpinBack .9s linear infinite;color:var(--violet)}
    .analysis-wrap.ai-working .analysis-card,.analysis-wrap.ai-working #showSolution{display:none!important}
  `;
  document.head.appendChild(style);

  function resetAnalysisView(){
    const wrap=document.querySelector('#analyze .analysis-wrap');
    if(!wrap)return;
    wrap.classList.add('ai-working');
    const ringText=wrap.querySelector('.ring strong');
    if(ringText)ringText.textContent='AI';
    const title=wrap.querySelector('h1');
    const sub=wrap.querySelector('h1 + p');
    if(title)title.textContent='Soru analiz ediliyor';
    if(sub)sub.textContent='Soru okunuyor, ders ve konu belirleniyor, çözüm hazırlanıyor.';
    const checklist=wrap.querySelector('.checklist');
    if(checklist)checklist.innerHTML='<div>◌ Soru okunuyor</div><div>◌ Ders ve konu belirleniyor</div><div>◌ Kazanım eşleştiriliyor</div><div>◌ Çözüm hazırlanıyor</div>';
    [aSubject,aTopic,aDifficulty,aOutcome].forEach(el=>{if(el)el.textContent='—'});
    document.querySelector('#analyze .analysis-card')?.classList.add('hidden');
    showSolution?.classList.add('hidden');
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
        const img=document.createElement('img');
        img.src=selectedImageData;img.alt='Yüklenen soru';img.style.maxWidth='100%';img.style.maxHeight='360px';img.style.borderRadius='12px';
        shot.appendChild(img);
      }else{
        const p=document.createElement('p');p.textContent=(questionText?.value||'Metin sorusu').trim();p.style.whiteSpace='pre-wrap';p.style.textAlign='left';p.style.width='100%';shot.appendChild(p);
      }
    }
  };

  liveSolve=async function({text='',image=''}){
    resetAnalysisView();
    go('analyze');
    const wrap=document.querySelector('#analyze .analysis-wrap');
    try{
      if(!liveApi)throw new Error('Canlı AI bağlantısı hazır değil.');
      const controller=new AbortController();
      const timer=setTimeout(()=>controller.abort(),45000);
      const r=await fetch('/api/solve',{method:'POST',headers:{'Content-Type':'application/json'},signal:controller.signal,body:JSON.stringify({text,image,student:{name:state.profile.name,tone:state.profile.tone},history:{topicMastery:state.topicMastery}})});
      clearTimeout(timer);
      const j=await r.json();
      if(!r.ok)throw new Error(j.error||'API hatası');
      applyLiveResult(j);
      wrap?.classList.remove('ai-working','ai-loading');
      go('solution');
      return true;
    }catch(e){
      wrap?.classList.remove('ai-working','ai-loading');
      if(e?.name==='AbortError')alert('Çözüm beklenenden uzun sürdü. Lütfen tekrar deneyin.');
      else alert('Canlı çözüm alınamadı: '+e.message);
      return false;
    }
  };

  const similarBtn=document.querySelector('#solution [data-go="similar"]');
  if(similarBtn){
    similarBtn.onclick=async e=>{
      e.preventDefault();
      go('similar');
      feedback.classList.add('hidden');
      similarQuestion.textContent='Benzer soru hazırlanıyor…';
      similarChoices.innerHTML='<div class="muted" style="text-align:center;padding:18px">Aynı ders, konu ve kazanım korunuyor.</div>';
      hint.disabled=true;
      if(!lastLiveResult){similarQuestion.textContent='Önce bir soru çözmelisin.';return}
      try{
        const r=await fetch('/api/similar',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({solution:{exam:lastLiveResult.exam,subject:lastLiveResult.subject,topic:lastLiveResult.topic,curriculum_outcome:lastLiveResult.curriculum_outcome,difficulty:lastLiveResult.difficulty,short_solution:lastLiveResult.short_solution}})});
        const j=await r.json();
        if(!r.ok)throw new Error(j.error||'Benzer soru oluşturulamadı');
        similarQuestion.textContent=j.question||'';
        similarChoices.innerHTML='';
        (j.choices||[]).forEach(choice=>{
          const b=document.createElement('button');b.textContent=choice;
          b.onclick=()=>{feedback.className='tip '+(choice===j.answer?'blue':'red');feedback.textContent=choice===j.answer?'✅ Doğru!':'❌ Tekrar düşün. İstersen ipucu al.';feedback.classList.remove('hidden')};
          similarChoices.appendChild(b);
        });
        hint.disabled=false;
        hint.onclick=()=>{feedback.className='tip blue';feedback.textContent='💡 '+(j.hint||'Aynı kazanımın temel kuralını düşün.');feedback.classList.remove('hidden')};
      }catch(err){
        similarQuestion.textContent='Benzer soru oluşturulamadı.';
        similarChoices.innerHTML=`<div class="tip red">${esc(err.message)}</div>`;
        hint.disabled=true;
      }
    };
  }
})();
