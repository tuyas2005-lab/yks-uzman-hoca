(()=>{
  if(window.__yksTabletEraserV1)return;window.__yksTabletEraserV1=true;
  const STORE='yksTabletPenNotesV1';
  let eraser=false,erasing=false,pointerId=null,raf=0,activating=false;
  const RADIUS=18;

  const css=document.createElement('style');css.textContent=`
    .pen-eraser.on{background:#fff1f1!important;border-color:#f2a7a7!important;color:#a92525!important;box-shadow:0 0 0 2px #ffe0e0 inset}
    #sourceQuestion.eraser-mode-active .pen-canvas.on{cursor:cell}
  `;document.head.appendChild(css);

  const sourceActive=()=>!!document.getElementById('sourceQuestion')?.classList.contains('active');
  const currentImg=()=>document.querySelector('#sourceQuestion #sqImage img');
  const currentCanvas=()=>document.querySelector('#sourceQuestion #sqImage .pen-canvas');
  const key=()=>currentImg()?.alt||document.querySelector('#sourceQuestion .sq-meta')?.textContent?.trim()||'';
  const readNotes=()=>{try{return JSON.parse(localStorage.getItem(STORE)||'{}')||{}}catch{return{}}};
  const saveNotes=n=>{try{localStorage.setItem(STORE,JSON.stringify(n))}catch{}};
  const points=s=>Array.isArray(s)?s:(Array.isArray(s?.points)?s.points:[]);
  const width=s=>Array.isArray(s)?2.35:(Number(s?.width)||2.35);

  function distSeg(px,py,ax,ay,bx,by){
    const vx=bx-ax,vy=by-ay,wx=px-ax,wy=py-ay,c1=vx*wx+vy*wy;
    if(c1<=0)return Math.hypot(px-ax,py-ay);
    const c2=vx*vx+vy*vy;if(c2<=c1)return Math.hypot(px-bx,py-by);
    const t=c1/c2,qx=ax+t*vx,qy=ay+t*vy;return Math.hypot(px-qx,py-qy);
  }
  function strokeHit(s,p,w,h){
    const a=points(s);if(!a.length)return false;const r=RADIUS+width(s)/2;
    if(a.length===1)return Math.hypot(p.x-a[0].x*w,p.y-a[0].y*h)<=r;
    for(let i=1;i<a.length;i++)if(distSeg(p.x,p.y,a[i-1].x*w,a[i-1].y*h,a[i].x*w,a[i].y*h)<=r)return true;
    return false;
  }
  function scheduleRedraw(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;window.dispatchEvent(new Event('resize'))})}
  function eraseAt(e){
    const c=currentCanvas(),k=key();if(!c||!k)return;
    const r=c.getBoundingClientRect();if(!r.width||!r.height)return;
    const p={x:e.clientX-r.left,y:e.clientY-r.top},n=readNotes(),arr=Array.isArray(n[k])?n[k]:[];
    const next=arr.filter(s=>!strokeHit(s,p,r.width,r.height));
    if(next.length===arr.length)return;n[k]=next;saveNotes(n);scheduleRedraw();update();
  }
  function update(){
    const b=document.getElementById('penEraser'),s=document.getElementById('sourceQuestion');
    if(b){b.classList.toggle('on',eraser);b.setAttribute('aria-pressed',eraser?'true':'false');b.textContent=eraser?'🧽 Silgi Açık':'🧽 Silgi'}
    s?.classList.toggle('eraser-mode-active',eraser&&sourceActive());
  }
  function ensureToolbar(){
    const bar=document.querySelector('#sourceQuestion .pen-toolbar');if(!bar)return;
    let b=bar.querySelector('#penEraser');if(!b){
      b=document.createElement('button');b.id='penEraser';b.type='button';b.className='pen-action pen-eraser';b.textContent='🧽 Silgi';
      const toggle=bar.querySelector('#penToggle');toggle?.insertAdjacentElement('afterend',b);
      b.onclick=()=>{
        eraser=!eraser;
        if(eraser){const t=document.getElementById('penToggle');if(t&&!t.classList.contains('on')){activating=true;t.click();activating=false}}
        update();
      };
    }
    update();
  }

  document.addEventListener('click',e=>{
    if(e.target.closest('#penToggle')&&!activating&&eraser){eraser=false;update()}
    setTimeout(ensureToolbar,0);
  },true);

  document.addEventListener('pointerdown',e=>{
    const c=e.target.closest?.('#sourceQuestion .pen-canvas.on');if(!c||!sourceActive()||e.pointerType!=='pen')return;
    const hardwareEraser=e.button===5;
    if(!eraser&&!hardwareEraser)return;
    e.preventDefault();e.stopImmediatePropagation();erasing=true;pointerId=e.pointerId;eraseAt(e);try{c.setPointerCapture?.(e.pointerId)}catch{}
  },true);
  document.addEventListener('pointermove',e=>{
    if(!erasing||e.pointerId!==pointerId)return;e.preventDefault();e.stopImmediatePropagation();eraseAt(e)
  },true);
  const finish=e=>{if(!erasing||e.pointerId!==pointerId)return;e.preventDefault();e.stopImmediatePropagation();erasing=false;pointerId=null;scheduleRedraw()};
  document.addEventListener('pointerup',finish,true);document.addEventListener('pointercancel',finish,true);

  const mo=new MutationObserver(m=>{if(m.some(x=>x.type==='childList'&&x.addedNodes.length))setTimeout(ensureToolbar,0)});
  mo.observe(document.body,{childList:true,subtree:true});
  setTimeout(ensureToolbar,300);
})();