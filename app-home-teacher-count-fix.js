(()=>{
  const home=document.getElementById('home'),teacher=document.getElementById('teacher');
  if(!home||!teacher)return;
  let syncing=false,timer=0;

  function plan(){return document.getElementById('dailyPlan')}
  function card(){return plan()?.closest('.card')||null}

  function forward(action){
    if(!action)return;
    try{window.go('teacher')}catch{return}
    let tries=0;
    const run=()=>{
      tries++;
      try{window.renderTeacher?.()}catch{}
      const btn=document.getElementById(action);
      if(btn){if(!btn.disabled)btn.click();return}
      if(tries<15)setTimeout(run,60);
    };
    setTimeout(run,30);
  }

  function sync(){
    if(syncing)return;
    const target=plan(),box=card();
    if(!target||!box||typeof window.renderTeacher!=='function')return;
    syncing=true;
    try{
      // Son yüklenen Kişisel Öğretmen renderer'ını çalıştır; Ana Sayfa kendi planını üretmesin.
      window.renderTeacher();
      const source=teacher.querySelector('.pt2-tasks');
      if(!source)return;
      const clone=source.cloneNode(true);
      clone.querySelectorAll('button[id]').forEach(btn=>{
        const action=btn.id;
        btn.removeAttribute('id');
        btn.dataset.homeTeacherAction=action;
        btn.onclick=e=>{e.preventDefault();e.stopPropagation();if(!btn.disabled)forward(action)};
      });
      clone.querySelectorAll('[id]').forEach(x=>x.removeAttribute('id'));

      target.className='pt2-tasks home-teacher-tasks';
      target.innerHTML='';
      while(clone.firstChild)target.appendChild(clone.firstChild);
      target.dataset.teacherUnified='v3';

      const section=box.querySelector('.section-title');
      const title=section?.querySelector('h2');
      if(title)title.textContent='Bugünkü 3 Adım';
      const tasks=[...target.querySelectorAll('.pt2-task')],total=tasks.length,done=tasks.filter(x=>x.classList.contains('done')).length;
      const pill=section?.querySelector('.pill');
      if(pill){pill.textContent=`${done}/${total||3}`;pill.className=`pill ${total&&done===total?'green':'orange'}`}

      let note=box.querySelector('.home-teacher-sync-note');
      if(!note){note=document.createElement('div');note.className='home-teacher-sync-note';section?.insertAdjacentElement('afterend',note)}
      const topic=teacher.querySelector('.pt2-hero h2')?.textContent?.trim()||state.teacher?.daily?.topic||'';
      note.textContent=`Kişisel Öğretmen ile aynı 3 adım${topic?` • ${topic}`:''}. İlerleme iki ekranda ortak tutulur.`;

      state.plan=tasks.map(x=>({title:x.querySelector('h4')?.textContent||'',desc:x.querySelector('p')?.textContent||'',done:x.classList.contains('done')}));
    }finally{syncing=false}
  }

  function schedule(ms=30){clearTimeout(timer);timer=setTimeout(sync,ms)}

  // Bu dosya öğretmen v3'ten sonra yüklenir; mevcut renderHome'u son kez sarar.
  if(typeof window.renderHome==='function'&&!window.renderHome.__teacherV3HomeSync){
    const base=window.renderHome;
    const wrapped=function(){const r=base.apply(this,arguments);schedule(0);return r};
    wrapped.__teacherV3HomeSync=true;
    window.renderHome=wrapped;try{renderHome=wrapped}catch{}
  }

  // Öğretmen planı değiştiğinde Ana Sayfa da aynı state'i yansıtsın.
  const mo=new MutationObserver(()=>{if(!syncing&&home.classList.contains('active'))schedule(50)});
  mo.observe(teacher,{childList:true,subtree:true});

  document.addEventListener('click',e=>{
    if(e.target.closest('[data-go="home"],#pt3Test,#pt2Test,#pt2Wrong,#mtsFinish'))schedule(80);
  },true);

  schedule(0);
})();
