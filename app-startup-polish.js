(()=>{
  if(window.__yksStartupPolish)return;window.__yksStartupPolish=true;
  const html=document.documentElement;
  let finished=false;

  function loadVisualIdentity(){
    if(window.__yksVisualIdentityV1||document.querySelector('script[data-visual-identity-v1]'))return;
    const s=document.createElement('script');s.src='/app-visual-identity-v1.js?v=2';s.async=true;s.dataset.visualIdentityV1='true';
    s.onload=()=>{
      if(document.querySelector('script[data-visual-identity-v2]'))return;
      const x=document.createElement('script');x.src='/app-visual-identity-v2.js?v=2';x.async=true;x.dataset.visualIdentityV2='true';
      x.onload=()=>{if(!document.querySelector('script[data-visual-identity-v3]')){const y=document.createElement('script');y.src='/app-visual-identity-v3.js?v=1';y.async=true;y.dataset.visualIdentityV3='true';document.body.appendChild(y)}};
      document.body.appendChild(x);
    };
    s.onerror=()=>console.warn('Yeni görsel kimlik yüklenemedi.');document.body.appendChild(s);
  }

  function finish(reason='ready'){
    if(finished)return;finished=true;
    try{window.renderHome?.();window.renderTopics?.()}catch(e){console.warn('Başlangıç son render:',e)}
    html.classList.remove('yks-startup-error');html.classList.add('yks-ready');html.dataset.bootReason=reason;loadVisualIdentity();
  }
  function fail(){if(finished)return;finished=true;html.classList.add('yks-startup-error');html.dataset.bootReason='essential-modules-timeout';const style=document.createElement('style');style.textContent="html.yks-startup-error body::before{content:'⚠️\\A YKS Uzman Hoca başlatılamadı\\A Sayfayı yenileyerek tekrar deneyin.'!important}html.yks-startup-error body::after{display:none!important}";document.head.appendChild(style);console.error('YKS Uzman Hoca başlangıç modülleri zamanında hazırlanamadı.')}
  function essentialsReady(){return typeof window.getLearningSnapshot==='function'&&window.__topicUiV5===true&&window.__connectedGo===true}
  function check(){if(finished)return;if(essentialsReady()){finish('essential-modules-ready');return}setTimeout(check,50)}
  setTimeout(fail,8000);check();
})();