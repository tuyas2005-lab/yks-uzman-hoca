(()=>{
  state.strategy??={manualTopicDate:'',manualTopic:''};
  const rootTeacher=document.getElementById('teacher'),rootCoach=document.getElementById('coach');
  const norm=s=>String(s||'').toLocaleLowerCase('tr-TR').replace(/[^a-z0-9çğıöşü]+/g,' ').trim();
  const todayKey=()=>new Date().toLocaleDateString('sv-SE');
  const parseDate=v=>{const s=String(v||'');if(/^\d{4}-\d{2}-\d{2}$/.test(s))return new Date(s+'T12:00:00');const m=s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);return m?new Date(`${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}T12:00:00`):null};
  const daysSince=v=>{const d=parseDate(v);return d?Math.max(0,Math.floor((Date.now()-d.getTime())/86400000)):0};
  const fmt=n=>Number(n||0).toFixed(1).replace('.',',').replace(',0','');
  const configs={
    TYT:[['turkce','Türkçe',40],['sosyal','Sosyal Bilimler',20],['matematik','Matematik',40],['fen','Fen Bilimleri',20]],
    'AYT-SAY':[['matematik','Matematik',40],['fizik','Fizik',14],['kimya','Kimya',13],['biyoloji','Biyoloji',13]],
    'AYT-EA':[['matematik','Matematik',40],['edebiyat','Türk Dili ve Edebiyatı',24],['tarih1','Tarih-1',10],['cografya1','Coğrafya-1',6]]
  };
  function examOf(subject=''){const m=String(subject).match(/^\s*(TYT|AYT)\b/i);return m?m[1].toUpperCase():'TYT'}
  function cleanSubject(subject=''){return String(subject).replace(/^\s*(TYT|AYT)\s+/i,'').trim()}
  function family(subject='',exam='TYT'){
    const s=norm(cleanSubject(subject));
    if(exam==='TYT'){
      if(/fizik|kimya|biyoloji|fen/.test(s))return'Fen Bilimleri';
      if(/tarih|coğraf|felsefe|din|sosyal/.test(s))return'Sosyal Bilimler';
      if(/matematik|geometri/.test(s))return'Matematik';
      if(/türkçe|turkce|edebiyat/.test(s))return'Türkçe';
    }
    if(/geometri/.test(s))return'Matematik';
    if(/edebiyat/.test(s))return'Türk Dili ve Edebiyatı';
    if(/tarih/.test(s))return'Tarih-1';
    if(/coğraf/.test(s))return'Coğrafya-1';
    if(/fizik/.test(s))return'Fizik';if(/kimya/.test(s))return'Kimya';if(/biyoloji/.test(s))return'Biyoloji';if(/matematik/.test(s))return'Matematik';
    return cleanSubject(subject)||'Genel';
  }
  function trialRows(){
    const out=[];const trials=[...(state.trials||[])].sort((a,b)=>String(a.date||'').localeCompare(String(b.date||''))||Number(a.id||0)-Number(b.id||0));
    Object.entries(configs).forEach(([type,cfg])=>{
      const arr=trials.filter(t=>t.type===type).slice(-3);if(!arr.length)return;
      cfg.forEach(([key,label,total])=>{
        const vals=arr.map(t=>Number(t.subjects?.[key]?.net||0));const last=vals.at(-1)||0,prev=vals.length>1?vals.at(-2):null,ratio=Math.max(0,Math.min(1,last/Math.max(1,total))),trend=prev===null?0:(last-prev)/Math.max(1,total);
        let need=(1-ratio)*60+Math.max(0,-trend)*45;
        out.push({id:`${type}|${label}`,type,exam:type==='TYT'?'TYT':'AYT',subject:label,total,last,ratio,trend,need,trialCount:arr.length,lastTrial:arr.at(-1)});
      });
    });
    return out;
  }
  function topicRows(){
    const groups=new Map();
    (state.sessions||[]).filter(x=>x?.topic&&typeof x.correct==='boolean').forEach(x=>{
      const exam=examOf(x.subject),subject=cleanSubject(x.subject)||'Genel',key=`${exam}|${subject}|${x.topic}`;
      if(!groups.has(key))groups.set(key,{exam,subject,topic:String(x.topic),rows:[]});groups.get(key).rows.push(x);
    });
    return [...groups.values()].map(g=>{
      const rows=g.rows.slice(-12),recent=rows.slice(-5),total=rows.length,correct=rows.filter(x=>x.correct).length,score=total?Math.round(correct/total*100):0,recentWrong=recent.filter(x=>!x.correct).length,last=rows.at(-1),todayCount=rows.filter(x=>{const d=parseDate(x.date);return d&&d.toLocaleDateString('sv-SE')===todayKey()}).length;
      return{...g,total,correct,wrong:total-correct,score,recentWrong,lastDate:last?.date||'',staleDays:daysSince(last?.date),todayCount,confidence:total>=5?'Güçlü':total>=3?'Orta':'Az'};
    });
  }
  function macroPlan(topics=topicRows(),trials=trialRows()){
    const map=new Map();
    trials.forEach(r=>map.set(r.id,{...r,topicNeed:0,recentWrong:0}));
    topics.forEach(t=>{
      const fam=family(t.subject,t.exam),type=t.exam==='TYT'?'TYT':(state.profile?.track==='EA'?'AYT-EA':'AYT-SAY'),id=`${type}|${fam}`;
      let m=map.get(id);if(!m){m={id,type,exam:t.exam,subject:fam,total:0,last:0,ratio:null,trend:0,need:20,trialCount:0,lastTrial:null,topicNeed:0,recentWrong:0};map.set(id,m)}
      m.topicNeed=Math.max(m.topicNeed,(100-t.score)/100);m.recentWrong+=t.recentWrong;
    });
    const rows=[...map.values()].map(m=>{const raw=m.need+(m.topicNeed||0)*32+Math.min(15,(m.recentWrong||0)*3);return{...m,priority:raw}}).filter(x=>x.priority>0).sort((a,b)=>b.priority-a.priority);
    const top=rows.slice(0,3),sum=top.reduce((a,b)=>a+b.priority,0)||1;let shares=top.map(x=>Math.max(5,Math.round((x.priority/sum)*20)*5));let delta=100-shares.reduce((a,b)=>a+b,0);if(shares.length)shares[0]+=delta;
    return top.map((x,i)=>({...x,share:shares[i]||0,reason:x.trialCount?`${x.subject}: son deneme ${fmt(x.last)} net${x.trend<-.01?' • düşüş var':x.trend>.01?' • yükseliş var':''}${x.topicNeed>.35?' • konu ölçümleri de zayıf':''}`:`${x.subject}: deneme verisi yok; konu ölçümlerinden öncelik oluştu`}));
  }
  function focusPlan(topics,macro){
    if(!topics.length)return null;
    const macroRank=new Map(macro.map((m,i)=>[`${m.exam}|${norm(m.subject)}`,i]));
    const scored=topics.map(t=>{
      const fam=family(t.subject,t.exam),rank=macroRank.get(`${t.exam}|${norm(fam)}`),coachBonus=rank===0?20:rank===1?12:rank===2?6:0;
      let p=(100-t.score)*.55+t.recentWrong*8+Math.min(10,t.staleDays)+coachBonus+(t.total<3?10:0)-(t.todayCount>=5?28:0);
      if(t.score>=85&&t.staleDays<7)p-=12;
      const reasons=[];if(coachBonus)reasons.push(`Koç bu hafta ${fam} dersini ${rank===0?'1.':'üst'} önceliğe aldı`);if(t.score<60)reasons.push(`konu başarısı %${t.score}`);if(t.recentWrong)reasons.push(`son 5 ölçümde ${t.recentWrong} yanlış`);if(t.total<3)reasons.push('veri henüz az, önce ölçüm gerekli');if(t.staleDays>=7)reasons.push(`${t.staleDays} gündür ölçülmedi`);if(t.todayCount>=5)reasons.push('bugün zaten yeterince çalışıldı');
      return{...t,family:fam,priority:p,reasons};
    }).sort((a,b)=>b.priority-a.priority);
    return{primary:scored[0],alternatives:scored.slice(1,4)};
  }
  function checkpoint(trials){
    const all=[...(state.trials||[])].sort((a,b)=>String(a.date||'').localeCompare(String(b.date||'')));if(!all.length)return{status:'Önce ölç',text:'Koçluk için ilk gerçek TYT denemeni gir. Sonra ders öncelikleri netleşir.'};
    const last=all.at(-1),d=daysSince(last.date),goal=Math.max(20,Number(state.profile?.goal||10)*3),after=(state.sessions||[]).filter(x=>{const xd=parseDate(x.date),ld=parseDate(last.date);return xd&&ld&&xd>ld}).length+(state.activityLog||[]).filter(x=>{const xd=parseDate(x.dateKey),ld=parseDate(last.date);return xd&&ld&&xd>ld}).reduce((a,x)=>a+Number(x.count||1),0);
    const track=state.profile?.track,needAyt=track&&!all.some(x=>x.type===(track==='EA'?'AYT-EA':'AYT-SAY'));
    if(needAyt)return{status:'Veri eksiği',text:`${track==='EA'?'AYT-EA':'AYT-SAY'} başlangıç denemesi henüz yok. Alan stratejisinin tamamlanması için uygun olduğunda bir alan denemesi ekle.`};
    if(d>=7||after>=goal)return{status:'Ölçüm zamanı',text:`Son denemeden sonra ${after} soru çalışıldı. Yeni bir deneme, planın işe yarayıp yaramadığını ölçmek için anlamlı olur.`};
    return{status:'Çalışma dönemi',text:`Şimdilik yeni denemeden çok koç önceliklerini uygula. Son denemeden beri ${after}/${goal} çalışma sorusu tamamlandı.`};
  }
  function strategy(){const topics=topicRows(),trials=trialRows(),macro=macroPlan(topics,trials),focus=focusPlan(topics,macro);return{topics,trials,macro,focus,checkpoint:checkpoint(trials),track:state.profile?.track||'',measured:topics.reduce((a,x)=>a+x.total,0),trialCount:(state.trials||[]).length}}
  window.getStudentStrategy=strategy;

  const css=document.createElement('style');css.textContent=`
    .strategy-link{margin:0 0 14px;padding:13px 15px;border:1px solid #ddd7ff;border-radius:15px;background:linear-gradient(135deg,#f5f2ff,#fff);line-height:1.5}.strategy-link b{color:#4f39bd}.strategy-chips{display:flex;gap:7px;flex-wrap:wrap;margin-top:8px}.strategy-chip{font-size:11px;padding:5px 8px;border-radius:999px;background:#ece8ff;color:#513bc1;font-weight:800}
    .strategy-coach{margin:14px 0}.strategy-coach-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.strategy-priorities{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin:13px 0}.strategy-priority{padding:12px;border:1px solid var(--line);border-radius:15px;background:var(--surface)}.strategy-priority strong{display:block;font-size:19px;margin:3px 0}.strategy-priority small{color:var(--muted);line-height:1.35}.strategy-checkpoint{padding:12px;border-radius:14px;background:#f8f7fc;border:1px solid var(--line);line-height:1.45}.strategy-checkpoint b{display:block;margin-bottom:3px}.strategy-evidence{font-size:11px;color:var(--muted);margin-top:9px}
    @media(max-width:780px){.strategy-priorities{grid-template-columns:1fr}.strategy-coach-head{flex-direction:column}}
  `;document.head.appendChild(css);

  function chooseTeacherFocus(s){
    const f=s.focus?.primary;if(!f)return;
    if(state.strategy.manualTopicDate!==todayKey()){state.strategy.manualTopicDate='';state.strategy.manualTopic='';state.teacher??={};state.teacher.selectedTopic=f.topic}
    else if(state.strategy.manualTopic)state.teacher.selectedTopic=state.strategy.manualTopic;
  }
  function teacherMode(f){if(!f)return'diagnostic';if(f.total<3)return'diagnostic';if(f.score<70||f.recentWrong>=2)return'repair';return'maintain'}
  function decorateTeacher(){
    if(!rootTeacher)return;const s=strategy(),f=s.focus?.primary;if(!f)return;
    const intro=rootTeacher.querySelector('.pt-intro');if(intro&&!rootTeacher.querySelector('.strategy-link')){const el=document.createElement('div');el.className='strategy-link';intro.insertAdjacentElement('afterend',el)}
    const link=rootTeacher.querySelector('.strategy-link');if(link){const m=s.macro[0];link.innerHTML=`<b>🧭 Koçtan gelen haftalık yön:</b> ${m?`${esc(m.exam+' '+m.subject)} çalışma payı yaklaşık %${m.share}.`: 'Henüz deneme önceliği oluşmadı.'}<div class="strategy-chips"><span class="strategy-chip">Bugün: ${esc(f.exam+' '+f.subject)}</span><span class="strategy-chip">${f.total} ölçüm • %${f.score}</span><span class="strategy-chip">Veri: ${esc(f.confidence)}</span></div>`}
    const reason=rootTeacher.querySelector('.pt-reason');if(reason){reason.innerHTML=`<b>Neden bugün bunu seçtim?</b><br>${esc(f.reasons.length?f.reasons.join(' • '):'Bu konu mevcut ölçümlerde en yüksek gelişim fırsatını veriyor.')}<br><small class="muted">Karar: Koç ders önceliği + konu başarısı + son yanlışlar + tekrar aralığı + bugünkü çalışma yükü.</small>`}
    const flow=rootTeacher.querySelector('.pt-flow'),steps=flow?[...flow.children]:[];const mode=teacherMode(f);
    if(flow&&steps.length>=3){const recap=steps.find(x=>x.querySelector('h3')?.textContent.includes('Hızlı')),test=steps.find(x=>x.querySelector('h3')?.textContent.includes('Mini Test')),wrong=steps.find(x=>x.querySelector('h3')?.textContent.includes('Yanlış'));
      if(mode==='diagnostic'&&test&&recap){flow.prepend(test);test.querySelector('h3').textContent='Seviye Ölçümü';test.querySelector('p').textContent='Önce 5 soruyla gerçekten nerede olduğunu ölç. Veri azsa öğretmen tahmin yürütmez.';flow.insertBefore(recap,wrong||null);recap.querySelector('h3').textContent='Sonuca Göre Hızlı Tekrar'}
      [ ...flow.children].forEach((x,i)=>{const n=x.querySelector('.pt-step-num');if(n&&!x.classList.contains('done'))n.textContent=String(i+1)})
    }
  }
  function quickCoachHtml(s){
    const f=s.focus?.primary,m=s.macro[0];if(!m&&!f)return`<h3>Önce veri toplayalım</h3><p>İlk gerçek deneme ve en az bir Mini Test sonrası Koç ile Kişisel Öğretmen aynı stratejiyi kullanmaya başlayacak.</p>`;
    return `<h3>${m?`Bu haftanın 1. önceliği: ${esc(m.exam+' '+m.subject)}`:'Ders önceliği için deneme verisi eksik'}</h3><p>${m?esc(m.reason):''}${f?` Günlük uygulamada Kişisel Öğretmen önce <b>${esc(f.topic)}</b> konusuna yönlendirecek.`:''}</p>${f?`<div class="tip orange"><b>Bugünkü akademik hedef:</b> ${esc(f.exam+' '+f.subject+' • '+f.topic)} • ölçülen başarı %${f.score}</div>`:''}<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px"><button id="ycTeacherSmart" class="secondary">Kişisel Öğretmene Git</button><button id="ycTestsSmart" class="ghost">Mini Test Aç</button></div>`;
  }
  function decorateCoach(){
    if(!rootCoach)return;const s=strategy(),hero=rootCoach.querySelector('.yc-hero');if(hero&&!rootCoach.querySelector('.strategy-coach')){const box=document.createElement('div');box.className='yc-card strategy-coach';hero.insertAdjacentElement('afterend',box)}
    const box=rootCoach.querySelector('.strategy-coach');if(box){box.innerHTML=`<div class="strategy-coach-head"><div><h2 style="margin:0">🧭 7 Günlük Ortak Strateji</h2><div class="muted">Koç makro yönü belirler; Kişisel Öğretmen bunu günlük konu ve göreve çevirir.</div></div><span class="pill green">Yerel karar motoru • API maliyeti yok</span></div>${s.macro.length?`<div class="strategy-priorities">${s.macro.map((m,i)=>`<div class="strategy-priority"><small>${i+1}. öncelik</small><b>${esc(m.exam+' '+m.subject)} • %${m.share}</b><small>${esc(m.reason)}</small></div>`).join('')}</div>`:'<div class="strategy-checkpoint">Henüz güvenilir ders önceliği yok. İlk deneme veya Mini Test verisi ile otomatik oluşacak.</div>'}<div class="strategy-checkpoint"><b>${esc(s.checkpoint.status)}</b>${esc(s.checkpoint.text)}</div><div class="strategy-evidence">Karar kanıtı: ${s.trialCount} gerçek deneme • ${s.measured} doğru/yanlış ölçümlü soru. Yüzdeler tahmin değil, mevcut veriden hesaplanır.</div>`}
    const h=[...rootCoach.querySelectorAll('.yc-card h2')].find(x=>x.textContent.trim()==='🎯 Koçun Hızlı Kararı');if(h){const card=h.closest('.yc-card');card.innerHTML=`<h2>🎯 Koçun Hızlı Kararı</h2>${quickCoachHtml(s)}`;card.querySelector('#ycTeacherSmart')?.addEventListener('click',()=>{const f=s.focus?.primary;if(f){state.strategy.manualTopicDate='';state.strategy.manualTopic='';state.teacher??={};state.teacher.selectedTopic=f.topic;save()}go('teacher')});card.querySelector('#ycTestsSmart')?.addEventListener('click',()=>{const f=s.focus?.primary;if(f){state.miniTests??={history:[]};state.miniTests.prefillSubject=`${f.exam} ${f.subject}`;state.miniTests.prefillTopic=f.topic;save()}go('tests')})}
  }
  function wrapRender(name,before,after){const base=window[name];if(typeof base!=='function'||base.__strategyWrapped)return;const fn=function(...args){try{before?.()}catch{}const r=base.apply(this,args);setTimeout(()=>{try{after?.()}catch{}},0);return r};fn.__strategyWrapped=true;window[name]=fn;try{if(name==='renderTeacher')renderTeacher=fn;if(name==='renderCoach')renderCoach=fn}catch{}}
  wrapRender('renderTeacher',()=>chooseTeacherFocus(strategy()),decorateTeacher);wrapRender('renderCoach',null,decorateCoach);
  document.addEventListener('click',e=>{const t=e.target.closest('#teacher [data-pt-topic]');if(t){state.strategy.manualTopicDate=todayKey();state.strategy.manualTopic=t.dataset.ptTopic||'';save()}},true);
  const oldGo=window.go||go;if(typeof oldGo==='function'&&!window.__strategyGoWrapped){window.go=function(id){if(id==='teacher')chooseTeacherFocus(strategy());const r=oldGo(id);setTimeout(()=>{if(id==='teacher')decorateTeacher();if(id==='coach')decorateCoach()},0);return r};try{go=window.go}catch{}window.__strategyGoWrapped=true}
  try{chooseTeacherFocus(strategy())}catch{};setTimeout(()=>{if(rootTeacher?.classList.contains('active'))decorateTeacher();if(rootCoach?.classList.contains('active'))decorateCoach()},60);
})();