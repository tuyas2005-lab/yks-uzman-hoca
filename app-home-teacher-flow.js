(()=>{
  let syncing=false, installed=false, syncTimer=0;
  const home=document.getElementById('home'),teacher=document.getElementById('teacher');
  if(!home||!teacher)return;

  const css=document.createElement('style');
  css.textContent=`
    #home .home-teacher-sync-note{font-size:11px;color:var(--muted);margin:-3px 0 11px;line-height:1.4}
    #home #dailyPlan.home-teacher-tasks{display:grid;gap:9px}
    #home #dailyPlan.home-teacher-tasks .pt2-task{min-height:0}
    #home #dailyPlan.home-teacher-tasks .pt2-task button{cursor:pointer}
    @media(max-width:900px){#home #dailyPlan.home-teacher-tasks .pt2-task{grid-template-columns:40px 1fr}#home #dailyPlan.home-teacher-tasks .pt2-task>div:last-child{grid-column:1/-1;display:flex;align-items:center;justify-content:space-between;gap:8px}#home #dailyPlan.home-teacher-tasks .pt2-task button{width:auto;flex:1}}
  `;
  document.head.appendChild(css);

  function planHost(){return document.getElementById('dailyPlan')}
  function planCard(){return planHost()?.closest('.card')||null}

  function forwardToTeacher(action){
    if(!action)return;
    try{window.go('teacher')}catch{return}
    let tries=0;
    const open=()=>{
      tries++;
      try{window.renderTeacher?.()}catch{}
      const b=document.getElementById(action);
      if(b){if(!b.disabled)b.click();return}
      if(tries<15)setTimeout(open,60);
    };
    setTimeout(open,30);
  }

  function syncFromTeacher(){
    if(syncing)return;
    const plan=planHost(),card=planCard();
    if(!plan||!card)return;
    syncing=true;
    try{
      // Kişisel Öğretmenin kendi renderer'ı tek doğruluk kaynağıdır.
      // Ana sayfa görev üretmez; öğretmenin oluşturduğu 3 adımı yansıtır.
      window.renderTeacher?.();
      const source=teacher.querySelector('.pt2-tasks');
      if(!source)return;
      const clone=source.cloneNode(true);
      clone.querySelectorAll('button[id]').forEach(btn=>{
        const action=btn.id;
        btn.removeAttribute('id');
        btn.dataset.homeTeacherAction=action;
        btn.onclick=e=>{e.preventDefault();e.stopPropagation();if(!btn.disabled)forwardToTeacher(action)};
      });
      clone.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
      clone.classList.add('home-teacher-task-clone');

      plan.className='pt2-tasks home-teacher-tasks';
      plan.innerHTML='';
      while(clone.firstChild)plan.appendChild(clone.firstChild);
      plan.dataset.teacherUnified='1';

      const section=card.querySelector('.section-title');
      const title=section?.querySelector('h2');
      if(title)title.textContent='Bugünkü 3 Adım';
      const done=plan.querySelectorAll('.pt2-task.done').length;
      const pill=section?.querySelector('.pill');
      if(pill){pill.textContent=`${done}/3`;pill.className=`pill ${done===3?'green':'orange'}`}

      let note=card.querySelector('.home-teacher-sync-note');
      if(!note){note=document.createElement('div');note.className='home-teacher-sync-note';section?.insertAdjacentElement('afterend',note)}
      const topic=teacher.querySelector('.pt2-hero h2')?.textContent?.trim()||state.teacher?.daily?.topic||'';
      note.textContent=`Kişisel Öğretmen ile aynı plan${topic?` • ${topic}`:''}. Bir görev tamamlandığında iki ekranda da aynı anda güncellenir.`;

      state.plan=[...plan.querySelectorAll('.pt2-task')].map(x=>({
        title:x.querySelector('h4')?.textContent||'',
        desc:x.querySelector('p')?.textContent||'',
        done:x.classList.contains('done')
      }));
    }finally{syncing=false}
  }

  function schedule(){clearTimeout(syncTimer);syncTimer=setTimeout(syncFromTeacher,25)}

  function install(){
    if(installed)return;
    if(typeof window.renderTeacher!=='function'||typeof window.renderHome!=='function'){setTimeout(install,80);return}
    installed=true;
    const base=window.renderHome;
    const wrapped=function(){const r=base.apply(this,arguments);setTimeout(syncFromTeacher,0);return r};
    wrapped.__teacherUnifiedHome=true;
    window.renderHome=wrapped;try{renderHome=wrapped}catch{}

    const plan=planHost();
    if(plan){
      const mo=new MutationObserver(()=>{
        if(syncing)return;
        if(!plan.querySelector('.pt2-task'))schedule();
      });
      mo.observe(plan,{childList:true,subtree:true});
    }
    document.addEventListener('click',e=>{
      if(e.target.closest('[data-go="home"]'))setTimeout(syncFromTeacher,40);
    },true);
    syncFromTeacher();
  }
  install();
})();
