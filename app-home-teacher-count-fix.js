(()=>{
  const home=document.getElementById('home');if(!home)return;let timer=0;
  function paint(){const plan=document.getElementById('dailyPlan');if(!plan?.classList.contains('home-teacher-tasks'))return;const tasks=[...plan.querySelectorAll('.pt2-task')],total=tasks.length;if(!total)return;const done=tasks.filter(x=>x.classList.contains('done')).length,card=plan.closest('.card'),section=card?.querySelector('.section-title'),title=section?.querySelector('h2'),pill=section?.querySelector('.pill');if(title)title.textContent='Bugünkü Plan';if(pill){pill.textContent=`${done}/${total}`;pill.className=`pill ${done===total?'green':'orange'}`}}
  function schedule(){clearTimeout(timer);timer=setTimeout(paint,70)}
  const plan=document.getElementById('dailyPlan');if(plan)new MutationObserver(schedule).observe(plan,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  document.addEventListener('click',e=>{if(e.target.closest('[data-go="home"],#pt2Recap,#pt3RecapDone,#pt3Test,#pt2Wrong,#mtsFinish'))setTimeout(schedule,100)},true);schedule();
})();