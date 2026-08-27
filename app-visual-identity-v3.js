(()=>{
if(window.__yksVisualIdentityV3)return;window.__yksVisualIdentityV3=true;
const $=(s,r=document)=>r.querySelector(s);
const css=document.createElement('style');css.id='visualIdentityV3';css.textContent=`
/* Approved artwork: use crops from the accepted concept, never emoji stand-ins. */
#home.vi-home .goal-card{padding-right:310px!important;min-height:300px!important;position:relative!important;overflow:hidden!important}
#home.vi-home .goal-card:after{content:""!important;position:absolute!important;right:20px!important;top:42px!important;width:275px!important;height:220px!important;background:url('/assets/visual-identity-home-hero.svg?v=2') center/contain no-repeat!important;filter:none!important;transform:none!important;opacity:1!important;pointer-events:none!important}
#home.vi-home .vi-points-card{padding-right:235px!important;position:relative!important;overflow:hidden!important}
#home.vi-home .vi-points-card:after{content:""!important;position:absolute!important;right:10px!important;top:20px!important;width:220px!important;height:198px!important;background:url('/assets/visual-identity-trophy.svg?v=1') center/contain no-repeat!important;filter:none!important;transform:none!important;opacity:1!important;pointer-events:none!important}
#home.vi-home .vi-points-card .vi-score,#home.vi-home .vi-points-card>small,#home.vi-home .vi-level,#home.vi-home .vi-scorebar,#home.vi-home .vi-next,#home.vi-home .vi-statrow,#home.vi-home .vi-point-foot{position:relative;z-index:2}
#home.vi-home .vi-ref-header{min-height:58px!important;gap:18px!important;overflow:visible!important}
#home.vi-home .vi-ref-hello{display:grid!important;grid-template-columns:42px minmax(0,1fr)!important;align-items:center!important;gap:12px!important;min-width:0!important}
#home.vi-home .vi-ref-avatar{width:42px!important;height:42px!important;min-width:42px!important;flex:none!important;font-size:0!important;background:linear-gradient(135deg,#65d7ed,#6d6cff)!important;color:#fff!important;box-shadow:0 6px 16px rgba(70,104,210,.18)!important}
#home.vi-home .vi-ref-avatar:after{content:attr(data-initial)!important;font-size:17px!important;font-weight:900!important}
#home.vi-home .vi-ref-hello>div:last-child{min-width:0!important;line-height:1.2!important}
#home.vi-home .vi-ref-hello b{display:block!important;font-size:22px!important;line-height:1.15!important;white-space:normal!important;margin:0!important;letter-spacing:-.01em!important}
#home.vi-home .vi-ref-hello small{display:block!important;font-size:13px!important;line-height:1.35!important;margin-top:5px!important;white-space:normal!important}
#home.vi-home .vi-ref-tools{flex:none!important;align-items:center!important}
.sidebar .vi-profile,.sidebar .vi-sidebar-points{box-sizing:border-box!important;overflow:hidden!important}
.sidebar .vi-profile b,.sidebar .vi-profile small,.sidebar .vi-sidebar-points small,.sidebar .vi-sidebar-points b{white-space:normal!important;overflow-wrap:anywhere!important;line-height:1.2!important}
@media(max-width:1299px){.sidebar .vi-profile,.sidebar .vi-sidebar-points{display:none!important}}
@media(max-width:1180px){#home.vi-home .goal-card{padding-right:225px!important}#home.vi-home .goal-card:after{width:210px!important;height:168px!important;right:8px!important;top:65px!important}#home.vi-home .vi-points-card{padding-right:170px!important}#home.vi-home .vi-points-card:after{width:170px!important;height:153px!important;top:50px!important}.vi-statrow{grid-template-columns:repeat(3,1fr)!important}}
@media(max-width:850px){#home.vi-home .goal-card{padding-right:24px!important;padding-bottom:190px!important}#home.vi-home .goal-card:after{width:235px!important;height:188px!important;top:auto!important;right:50%!important;bottom:4px!important;transform:translateX(50%)!important}#home.vi-home .vi-points-card{padding-right:24px!important;padding-bottom:185px!important}#home.vi-home .vi-points-card:after{width:200px!important;height:180px!important;top:auto!important;right:50%!important;bottom:8px!important;transform:translateX(50%)!important}#home.vi-home .vi-ref-tools{display:none!important}}
@media(max-width:520px){#home.vi-home .vi-ref-header{margin-bottom:12px!important}.vi-ref-avatar{width:38px!important;height:38px!important;min-width:38px!important}.vi-ref-hello b{font-size:19px!important}.vi-ref-hello small{font-size:12px!important}}
`;
document.head.appendChild(css);
function fix(){
 const home=$('#home');if(!home)return;
 const av=$('.vi-ref-avatar',home),name=String(window.state?.profile?.name||'Öğrenci').trim().split(/\s+/)[0]||'Öğrenci';
 if(av)av.dataset.initial=name.slice(0,1).toLocaleUpperCase('tr-TR');
 const title=$('.vi-ref-hello b',home);if(title)title.textContent=`Merhaba ${name}! 👋`;
 const sub=$('.vi-ref-hello small',home);if(sub)sub.textContent='Bugün hedeflerine bir adım daha yaklaş. 🚀';
}
fix();setTimeout(fix,150);setTimeout(fix,900);
})();