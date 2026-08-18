(()=>{
  const today=()=>new Date().toLocaleDateString('sv-SE');
  const currentStrategy=()=>{try{return window.getStudentStrategy?.()}catch{return null}};
  function targetFocus(){
    const s=currentStrategy();if(!s)return null;
    if(state.strategy?.manualTopicDate===today()&&state.strategy?.manualTopic){return s.topics.find(x=>x.topic===state.strategy.manualTopic)||null}
    return s.focus?.primary||null;
  }
  function manualDecorate(){
    const f=targetFocus(),s=currentStrategy(),root=document.getElementById('teacher');if(!f||!root)return;
    const shown=root.querySelector('.pt-focus-main h1')?.textContent?.trim();if(shown!==f.topic)return;
    if(state.strategy?.manualTopicDate===today()&&state.strategy?.manualTopic===f.topic){
      const reason=root.querySelector('.pt-reason');if(reason)reason.innerHTML=`<b>Bu konuyu bugün sen seçtin.</b><br>Öğretmen seçimini koruyor; performansını Mini Test sonuçlarıyla izleyecek. Koçun haftalık önceliği değişmedi, ancak günlük çalışma içinde öğrenci seçimine izin veriliyor.`;
      const link=root.querySelector('.strategy-link');const m=s?.macro?.[0];if(link)link.innerHTML=`<b>🧭 Koçun haftalık yönü:</b> ${m?`${esc(m.exam+' '+m.subject)} yaklaşık %${m.share} çalışma payı.`:'Henüz ders önceliği oluşmadı.'}<div class="strategy-chips"><span class="strategy-chip">Senin seçimin: ${esc(f.exam+' '+f.subject+' • '+f.topic)}</span><span class="strategy-chip">${f.total} ölçüm • %${f.score}</span></div>`;
    }
  }
  const base=window.renderTeacher;
  if(typeof base==='function'&&!base.__strategyCompat){
    const wrapped=function(...args){
      const f=targetFocus();let old=null,changed=false;
      try{
        if(f&&!(state.strategy?.manualTopicDate===today()&&state.strategy?.manualTopic)){
          old=topicEntries;const orig=old;topicEntries=function(){const arr=orig();const i=arr.findIndex(x=>x[0]===f.topic);if(i>0){const [hit]=arr.splice(i,1);arr.unshift(hit)}return arr};changed=true;state.teacher??={};state.teacher.selectedTopic=f.topic;
        }
      }catch{}
      let r;try{r=base.apply(this,args)}finally{if(changed&&old)try{topicEntries=old}catch{}}
      setTimeout(manualDecorate,0);return r;
    };
    wrapped.__strategyCompat=true;window.renderTeacher=wrapped;try{renderTeacher=wrapped}catch{}
  }
  document.addEventListener('click',e=>{if(e.target.closest('#teacher [data-pt-topic]'))setTimeout(manualDecorate,20)},true);
})();