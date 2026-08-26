(()=>{
  const visible=x=>x?.manualCrop===true&&x?.answerVerified===true&&x?.status==='student-ready'&&x?.asset?.status==='ready';
  function refresh(){
    const C=window.YKSQuestionCatalogV1,root=document.getElementById('qiRoot');if(!C||!root)return;
    const rows=(C.all?.()||[]).filter(visible),stats=root.querySelector('.sq-ready-stat');
    if(stats){const b=stats.querySelector('b');if(b&&b.textContent!==String(rows.length))b.textContent=String(rows.length)}
    root.querySelectorAll('tbody tr[data-qi-row]').forEach(tr=>{
      const cells=tr.children,exam=cells[0]?.textContent.trim(),subject=cells[1]?.textContent.trim(),topicKey=tr.dataset.qiTopicKey;
      const total=rows.filter(x=>x.exam===exam&&x.subject===subject&&((window.getQuestionIndexTopicGroup&&window.getQuestionIndexTopicGroup(x)?.key)===topicKey||(!topicKey&&x.topic===cells[2]?.textContent.trim()))).length;
      const cell=tr.querySelector('.sq-status-cell');if(!cell)return;
      const label=`✓ ${total}/${total} hazır`;
      if(cell.textContent.trim()!==label)cell.innerHTML=`<span class="qi-badge sq-ready">${label}</span>`;
    });
  }
  let scheduled=false;const mo=new MutationObserver(()=>{if(scheduled)return;scheduled=true;queueMicrotask(()=>{scheduled=false;refresh()})});mo.observe(document.body,{childList:true,subtree:true});
  window.refreshQuestionIndexCounters=refresh;refresh();
})();
