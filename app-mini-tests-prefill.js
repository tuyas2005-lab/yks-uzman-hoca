(()=>{
  function apply(tries=0){
    const s=state.miniTests?.prefillSubject||'',t=state.miniTests?.prefillTopic||'';if(!s&&!t)return;
    const ex=document.getElementById('mtsExam');if(!ex){if(tries<20)setTimeout(()=>apply(tries+1),80);return}
    const exam=/\bAYT\b/i.test(s)?'AYT':'TYT',subject=s.replace(/^\s*(TYT|AYT)\s*/i,'').trim();
    if([...ex.options].some(o=>o.value===exam)&&ex.value!==exam){ex.value=exam;ex.dispatchEvent(new Event('change',{bubbles:true}));setTimeout(()=>apply(tries+1),40);return}
    const sub=document.getElementById('mtsSubject');if(sub&&subject){const o=[...sub.options].find(x=>x.value===subject||x.textContent.trim()===subject);if(o&&sub.value!==o.value){sub.value=o.value;sub.dispatchEvent(new Event('change',{bubbles:true}));setTimeout(()=>apply(tries+1),40);return}}
    const top=document.getElementById('mtsTopic');if(top&&t){const o=[...top.options].find(x=>x.value===t||x.textContent.trim()===t);if(o)top.value=o.value}
    state.miniTests.prefillSubject='';state.miniTests.prefillTopic='';save();
  }
  const base=window.renderMiniTestHome;if(typeof base==='function'){window.renderMiniTestHome=function(){const r=base();setTimeout(()=>apply(),30);return r}}
  const old=window.go;if(typeof old==='function'&&!window.__miniPrefillGo){window.go=function(id){const r=old(id);if(id==='tests')setTimeout(()=>apply(),80);return r};try{go=window.go}catch{};window.__miniPrefillGo=true}
})();
