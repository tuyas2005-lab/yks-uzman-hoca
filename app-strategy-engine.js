(()=>{
  state.strategy??={manualTopicDate:'',manualTopic:''};
  const rootTeacher=document.getElementById('teacher'),rootCoach=document.getElementById('coach');
  const D=()=>window.YKSDataV5;
  const norm=s=>D()?.norm?.(s)||String(s||'').toLocaleLowerCase('tr-TR').replace(/[^a-z0-9çğıöşü]+/g,' ').trim();
  const todayKey=()=>D()?.todayKey?.()||new Date().toLocaleDateString('sv-SE');
  const parseDate=v=>{const k=D()?.dateKey?.(v)||'';return k?new Date(k+'T12:00:00'):null};
  const daysSince=v=>{const d=parseDate(v);return d?Math.max(0,Math.floor((Date.now()-d.getTime())/86400000)):999};
  const fmt=n=>Number(n||0).toFixed(1).replace('.',',').replace(',0','');
  const configs={
    TYT:[['turkce','Türkçe',40],['sosyal','Sosyal Bilimler',20],['matematik','Matematik',40],['fen','Fen Bilimleri',20]],
    'AYT-SAY':[['matematik','Matematik',40],['fizik','Fizik',14],['kimya','Kimya',13],['biyoloji','Biyoloji',13]],
    'AYT-EA':[['matematik','Matematik',40],['edebiyat','Türk Dili ve Edebiyatı',24],['tarih1','Tarih-1',10],['cografya1','Coğrafya-1',6]]
  };
  function family(subject='',exam='TYT'){
    const s=norm(subject);
    if(exam==='TYT'){
      if(/fizik|kimya|biyoloji|fen/.test(s))return'Fen Bilimleri';
      if(/tarih|coğraf|felsefe|din|sosyal/.test(s))return'Sosyal Bilimler';
      if(/matematik|geometri/.test(s))return'Matematik';
      if(/türkçe|turkce|edebiyat/.test(s))return'Türkçe';
    }
    if(/geometri|matematik/.test(s))return'Matematik';
    if(/edebiyat/.test(s))return'Türk Dili ve Edebiyatı';
    if(/tarih/.test(s))return'Tarih-1';if(/coğraf/.test(s))return'Coğrafya-1';
    if(/fizik/.test(s))return'Fizik';if(/kimya/.test(s))return'Kimya';if(/biyoloji/.test(s))return'Biyoloji';return subject||'Genel';
  }
  function trialRows(){
    const out=[],trials=D()?.getTrials?.()||[];
    Object.entries(configs).forEach(([type,cfg])=>{
      const arr=trials.filter(t=>String(t.type||'TYT').toUpperCase()===type).sort((a,b)=>String(a.date||'').localeCompare(String(b.date||''))).slice(-3);if(!arr.length)return;
      cfg.forEach(([key,label,total])=>{
        const vals=arr.map(t=>Number(t.subjects?.[key]?.net??t[key]??0));const last=vals.at(-1)||0,prev=vals.length>1?vals.at(-2):null,ratio=Math.max(0,Math.min(1,last/Math.max(1,total))),trend=prev===null?0:(last-prev)/Math.max(1,total);
        out.push({id:`${type}|${label}`,type,exam:type==='TYT'?'TYT':'AYT',subject:label,total,last,ratio,trend,need:(1-ratio)*60+Math.max(0,-trend)*45,trialCount:arr.length,lastTrial:arr.at(-1)});
      });
    });return out;
  }
  function topicRows(){
    const m=D()?.getLearningModel?.();return (m?.topics||[]).map(t=>({...t,score:t.score,signalNeed:Math.min(30,(t.recentSignals||0)*8)}));
  }
  function macroPlan(topics=topicRows(),trials=trialRows()){
    const map=new Map();trials.forEach(r=>map.set(r.id,{...r,topicNeed:0,recentWrong:0,signals:0}));
    topics.forEach(t=>{
      const fam=family(t.subject,t.exam),type=t.exam==='TYT'?'TYT':(state.profile?.track==='EA'?'AYT-EA':'AYT-SAY'),id=`${type}|${fam}`;
      let m=map.get(id);if(!m){m={id,type,exam:t.exam,subject:fam,total:0,last:0,ratio:null,trend:0,need:18,trialCount:0,lastTrial:null,topicNeed:0,recentWrong:0,signals:0};map.set(id,m)}
      const measuredNeed=t.score===null?(t.recentSignals?0.45:0.10):(100-t.score)/100;m.topicNeed=Math.max(m.topicNeed,measuredNeed);m.recentWrong+=t.recentWrong||0;m.signals+=t.recentSignals||0;
    });
    const rows=[...map.values()].map(m=>({...m,priority:m.need+(m.topicNeed||0)*32+Math.min(18,(m.recentWrong||0)*3)+Math.min(18,(m.signals||0)*3)})).filter(x=>x.priority>0).sort((a,b)=>b.priority-a.priority);
    const top=rows.slice(0,3),sum=top.reduce((a,b)=>a+b.priority,0)||1;let shares=top.map(x=>Math.max(5,Math.round((x.priority/sum)*20)*5)),delta=100-shares.reduce((a,b)=>a+b,0);if(shares.length)shares[0]+=delta;
    return top.map((x,i)=>({...x,share:shares[i]||0,reason:x.trialCount?`${x.subject}: son deneme ${fmt(x.last)} net${x.trend<-.01?' • düşüş var':x.trend>.01?' • yükseliş var':''}${x.topicNeed>.35?' • konu ölçümleri zayıf':''}${x.signals?` • ${x.signals} zorlanma sinyali`:''}`:`${x.subject}: deneme verisi yok; konu ölçümleri ve zorlanma sinyallerinden öncelik oluştu`}));
  }
  function focusPlan(topics,macro){
    if(!topics.length)return null;const macroRank=new Map(macro.map((m,i)=>[`${m.exam}|${norm(m.subject)}`,i]));
    const scored=topics.map(t=>{
      const fam=family(t.subject,t.exam),rank=macroRank.get(`${t.exam}|${norm(fam)}`),coachBonus=rank===0?20:rank===1?12:rank===2?6:0,base=t.score===null?(t.recentSignals?55:82):t.score;
      let p=(100-base)*.55+(t.recentWrong||0)*8+(t.recentSignals||0)*10+Math.min(10,t.staleDays||0)+coachBonus+(t.total<3?12:0)-(t.todayCount>=5?28:0);if(t.score!==null&&t.score>=85&&t.staleDays<7)p-=12;
      const reasons=[];if(coachBonus)reasons.push(`Koç bu hafta ${fam} dersini ${rank===0?'1.':'üst'} önceliğe aldı`);if(t.score!==null&&t.score<60)reasons.push(`ölçülen başarı %${t.score}`);if(t.recentWrong)reasons.push(`son ölçümlerde ${t.recentWrong} yanlış`);if(t.recentSignals)reasons.push(`son 7 günde ${t.recentSignals} zorlanma sinyali`);if(t.total<3)reasons.push('veri az; önce 5 soruluk ölçüm gerekli');if(t.staleDays>=7&&t.staleDays<999)reasons.push(`${t.staleDays} gündür ölçülmedi`);if(t.todayCount>=5)reasons.push('bugün zaten yeterince çalışıldı');
      return{...t,family:fam,priority:p,reasons};
    }).sort((a,b)=>b.priority-a.priority);return{primary:scored[0],alternatives:scored.slice(1,4)};
  }
  function checkpoint(){
    const trials=D()?.getTrials?.()||[],track=state.profile?.track||'';if(!trials.length)return{status:'Önce ölç',text:'Koçluk için ilk gerçek TYT denemeni gir. Sonra ders öncelikleri netleşir.'};
    const sorted=[...trials].sort((a,b)=>String(a.date||'').localeCompare(String(b.date||''))),last=sorted.at(-1),lastDate=parseDate(last.date),d=daysSince(last.date),goal=Math.max(20,Number(state.profile?.goal||10)*3),events=D()?.getEvents?.({relevant:true,includeTrials:false})||[];
    const after=events.filter(x=>lastDate&&x.timestamp>lastDate.getTime()).reduce((a,x)=>a+Number(x.questionCount||0),0),needAyt=track&&!sorted.some(x=>String(x.type||'').toUpperCase()===(track==='EA'?'AYT-EA':'AYT-SAY'));
    if(needAyt)return{status:'Veri eksiği',text:`${track==='EA'?'AYT-EA':'AYT-SAY'} başlangıç denemesi henüz yok. Alan stratejisinin tamamlanması için uygun olduğunda bir alan denemesi ekle.`};
    if(d>=7||after>=goal)return{status:'Ölçüm zamanı',text:`Son denemeden sonra ${after} soru çalışıldı. Yeni bir deneme planın işe yarayıp yaramadığını ölçmek için anlamlı olur.`};
    return{status:'Çalışma dönemi',text:`Şimdilik yeni denemeden çok koç önceliklerini uygula. Son denemeden beri ${after}/${goal} çalışma sorusu tamamlandı.`};
  }
  function strategy(){const topics=topicRows(),trials=trialRows(),macro=macroPlan(topics,trials),focus=focusPlan(topics,macro),m=D()?.getLearningModel?.();return{topics,trials,macro,focus,checkpoint:checkpoint(),track:state.profile?.track||'',measured:m?.measuredCount||0,trialCount:D()?.getTrials?.().length||0,questionCount:m?.questionCount||0}}
  window.getStudentStrategy=strategy;

  const css=document.createElement('style');css.textContent=`.strategy-link{margin:0 0 14px;padding:13px 15px;border:1px solid #ddd7ff;border-radius:15px;background:linear-gradient(135deg,#f5f2ff,#fff);line-height:1.5}.strategy-link b{color:#4f39bd}.strategy-chips{display:flex;gap:7px;flex-wrap:wrap;margin-top:8px}.strategy-chip{font-size:11px;padding:5px 8px;border-radius:999px;background:#ece8ff;color:#513bc1;font-weight:800}.strategy-coach{margin:14px 0}.strategy-coach-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.strategy-priorities{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin:13px 0}.strategy-priority{padding:12px;border:1px solid var(--line);border-radius:15px;background:var(--surface)}.strategy-priority strong{display:block;font-size:19px;margin:3px 0}.strategy-priority small{color:var(--muted);line-height:1.35}.strategy-checkpoint{padding:12px;border-radius:14px;background:#f8f7fc;border:1px solid var(--line);line-height:1.45}.strategy-checkpoint b{display:block;margin-bottom:3px}.strategy-evidence{font-size:11px;color:var(--muted);margin-top:9px}@media(max-width:780px){.strategy-priorities{grid-template-columns:1fr}.strategy-coach-head{flex-direction:column}}`;document.head.appendChild(css);

  function chooseTeacherFocus(s){const f=s.focus?.primary;if(!f)return;if(state.strategy.manualTopicDate!==todayKey()){state.strategy.manualTopicDate='';state.strategy.manualTopic='';state.teacher??={};state.teacher.selectedTopic=f.topic}else if(state.strategy.manualTopic)state.teacher.selectedTopic=state.strategy.manualTopic}
  function teacherMode(f){if(!f||f.total<3)return'diagnostic';if((f.score??100)<70||f.recentWrong>=2||f.recentSignals>=2)return'repair';return'maintain'}
  function teacherTarget(s){if(state.strategy.manualTopicDate===todayKey()&&state.strategy.manualTopic)return s.topics.find(x=>x.topic===state.strategy.manualTopic)||s.focus?.primary;return s.focus?.primary}
  function decorateTeacher(){
    if(!rootTeacher)return;const s=strategy(),f=teacherTarget(s);if(!f)return;
    const intro=rootTeacher.querySelector('.pt-intro');if(intro&&!rootTeacher.querySelector('.strategy-link')){const el=document.createElement('div');el.className='strategy-link';intro.insertAdjacentElement('afterend',el)}
    const link=rootTeacher.querySelector('.strategy-link');if(link){const m=s.macro[0],manual=state.strategy.manualTopicDate===todayKey()&&state.strategy.manualTopic===f.topic;link.innerHTML=`<b>🧭 Koçtan gelen haftalık yön:</b> ${m?`${esc(m.exam+' '+m.subject)} çalışma payı yaklaşık %${m.share}.`:'Henüz deneme önceliği oluşmadı.'}<div class="strategy-chips"><span class="strategy-chip">${manual?'Senin seçimin':'Bugün'}: ${esc(f.exam+' '+f.subject+' • '+f.topic)}</span><span class="strategy-chip">${f.total} ölçüm • ${f.score===null?'başarı —':`%${f.score}`}</span><span class="strategy-chip">Veri: ${esc(f.confidence)}</span></div>`}
    const reason=rootTeacher.querySelector('.pt-reason');if(reason)reason.innerHTML=state.strategy.manualTopicDate===todayKey()&&state.strategy.manualTopic===f.topic?`<b>Bu konuyu bugün sen seçtin.</b><br>Öğretmen seçimini koruyor; performansını V5 öğrenme modeliyle izleyecek.`:`<b>Neden bugün bunu seçtim?</b><br>${esc(f.reasons.length?f.reasons.join(' • '):'Bu konu mevcut veride en yüksek gelişim fırsatını veriyor.')}<br><small class="muted">Karar: Koç ders önceliği + ölçümlü başarı + zorlanma sinyalleri + tekrar aralığı + bugünkü yük.</small>`;
    const flow=rootTeacher.querySelector('.pt-flow'),steps=flow?[...flow.children]:[],mode=teacherMode(f);if(flow&&steps.length>=3){const recap=steps.find(x=>x.querySelector('h3')?.textContent.includes('Hızlı')||x.querySelector('h3')?.textContent.includes('Tekrar')),test=steps.find(x=>x.querySelector('h3')?.textContent.includes('Mini Test')||x.querySelector('h3')?.textContent.includes('Seviye')),wrong=steps.find(x=>x.querySelector('h3')?.textContent.includes('Yanlış'));if(mode==='diagnostic'&&test&&recap){flow.prepend(test);test.querySelector('h3').textContent='Seviye Ölçümü';test.querySelector('p').textContent='Önce 5 soruyla gerçekten nerede olduğunu ölç. Veri azsa öğretmen tahmin yürütmez.';flow.insertBefore(recap,wrong||null);recap.querySelector('h3').textContent='Sonuca Göre Hızlı Tekrar'}[...flow.children].forEach((x,i)=>{const n=x.querySelector('.pt-step-num');if(n&&!x.classList.contains('done'))n.textContent=String(i+1)})}
  }
  function quickCoachHtml(s){const f=s.focus?.primary,m=s.macro[0];if(!m&&!f)return`<h3>Önce veri toplayalım</h3><p>İlk gerçek deneme ve en az bir Mini Test sonrası Koç ile Kişisel Öğretmen aynı V5 öğrenme modelini kullanmaya başlayacak.</p>`;return`<h3>${m?`Bu haftanın 1. önceliği: ${esc(m.exam+' '+m.subject)}`:'Ders önceliği için deneme verisi eksik'}</h3><p>${m?esc(m.reason):''}${f?` Günlük uygulamada Kişisel Öğretmen önce <b>${esc(f.topic)}</b> konusuna yönlendirecek.`:''}</p>${f?`<div class="tip orange"><b>Bugünkü akademik hedef:</b> ${esc(f.exam+' '+f.subject+' • '+f.topic)} • ${f.score===null?'önce ölçüm':`ölçülen başarı %${f.score}`}</div>`:''}<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px"><button id="ycTeacherSmart" class="secondary">Kişisel Öğretmene Git</button><button id="ycTestsSmart" class="ghost">Mini Test Aç</button></div>`}
  function decorateCoach(){
    if(!rootCoach)return;const s=strategy(),hero=rootCoach.querySelector('.yc-hero');if(hero&&!rootCoach.querySelector('.strategy-coach')){const box=document.createElement('div');box.className='yc-card strategy-coach';hero.insertAdjacentElement('afterend',box)}
    const box=rootCoach.querySelector('.strategy-coach');if(box){box.innerHTML=`<div class="strategy-coach-head"><div><h2 style="margin:0">🧭 7 Günlük Ortak Strateji</h2><div class="muted">Koç makro yönü belirler; Kişisel Öğretmen aynı V5 verisini günlük konu ve göreve çevirir.</div></div><span class="pill green">Yerel karar motoru • API maliyeti yok</span></div>${s.macro.length?`<div class="strategy-priorities">${s.macro.map((m,i)=>`<div class="strategy-priority"><small>${i+1}. öncelik</small><b>${esc(m.exam+' '+m.subject)} • %${m.share}</b><small>${esc(m.reason)}</small></div>`).join('')}</div>`:'<div class="strategy-checkpoint">Henüz güvenilir ders önceliği yok. İlk deneme veya Mini Test verisi ile otomatik oluşacak.</div>'}<div class="strategy-checkpoint"><b>${esc(s.checkpoint.status)}</b>${esc(s.checkpoint.text)}</div><div class="strategy-evidence">Karar kanıtı: ${s.trialCount} gerçek deneme • ${s.measured} doğru/yanlış ölçümlü soru • ${s.questionCount} toplam çalışma sorusu.</div>`}
    const h=[...rootCoach.querySelectorAll('.yc-card h2')].find(x=>x.textContent.trim()==='🎯 Koçun Hızlı Kararı');if(h){const card=h.closest('.yc-card');card.innerHTML=`<h2>🎯 Koçun Hızlı Kararı</h2>${quickCoachHtml(s)}`;card.querySelector('#ycTeacherSmart')?.addEventListener('click',()=>{const f=s.focus?.primary;if(f){state.strategy.manualTopicDate='';state.strategy.manualTopic='';state.teacher??={};state.teacher.selectedTopic=f.topic;save()}go('teacher')});card.querySelector('#ycTestsSmart')?.addEventListener('click',()=>{const f=s.focus?.primary;if(f){state.miniTests??={history:[]};state.miniTests.prefillSubject=`${f.exam} ${f.subject}`;state.miniTests.prefillTopic=f.topic;save()}go('tests')})}
  }
  function wrapRender(name,before,after){const base=window[name];if(typeof base!=='function'||base.__strategyWrapped)return;const fn=function(...args){try{before?.()}catch{}const r=base.apply(this,args);setTimeout(()=>{try{after?.()}catch{}},0);return r};fn.__strategyWrapped=true;window[name]=fn;try{if(name==='renderTeacher')renderTeacher=fn;if(name==='renderCoach')renderCoach=fn}catch{}}
  wrapRender('renderTeacher',()=>chooseTeacherFocus(strategy()),decorateTeacher);wrapRender('renderCoach',null,decorateCoach);
  document.addEventListener('click',e=>{const t=e.target.closest('#teacher [data-pt-topic]');if(t){state.strategy.manualTopicDate=todayKey();state.strategy.manualTopic=t.dataset.ptTopic||'';save();setTimeout(decorateTeacher,0)}},true);
  try{chooseTeacherFocus(strategy())}catch{};setTimeout(()=>{try{window.renderHome?.()}catch{};if(rootTeacher?.classList.contains('active'))decorateTeacher();if(rootCoach?.classList.contains('active'))decorateCoach()},80);
})();
