(()=>{
  const visible=x=>x?.manualCrop===true&&x?.answerVerified===true&&x?.status==='student-ready'&&x?.asset?.status==='ready';
  function refresh(){
    const C=window.YKSQuestionCatalogV1,root=document.getElementById('qiRoot');if(!C||!root)return;
    const rows=(C.all?.()||[]).filter(visible),stats=root.querySelector('.sq-ready-stat');
    if(stats)stats.querySelector('b').textContent=rows.length;
    root.querySelectorAll('tbody tr[data-qi-row]').forEach(tr=>{
      const cells=tr.children,exam=cells[0]?.textContent.trim(),subject=cells[1]?.textContent.trim(),topic=cells[2]?.textContent.trim();
      const total=rows.filter(x=>x.exam===exam&&x.subject===subject&&x.topic===topic).length;
      const cell=tr.querySelector('.sq-status-cell');if(!cell)return;
      cell.innerHTML=`<span class="qi-badge sq-ready">✓ ${total}/${total} hazır</span>`;
    });
  }
  const mo=new MutationObserver(()=>queueMicrotask(refresh));mo.observe(document.body,{childList:true,subtree:true});
  window.refreshQuestionIndexCounters=refresh;refresh();
})();
