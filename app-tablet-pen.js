(()=>{
  if(window.__yksTabletPenV1)return;window.__yksTabletPenV1=true;
  const STORE='yksTabletPenNotesV1',PREF='yksTabletPenEnabledV1';
  let enabled=localStorage.getItem(PREF)==='1',canvas=null,img=null,key='',drawing=false,activeStroke=null,lastPoint=null,penPointerId=null,resizeObs=null,raf=0,attachRaf=0;
  const notes=(()=>{try{return JSON.parse(localStorage.getItem(STORE)||'{}')||{}}catch{return{}}})();
  const save=()=>{try{localStorage.setItem(STORE,JSON.stringify(notes))}catch{}};
  const css=document.createElement('style');css.textContent=`
    #sourceQuestion .sq-image{position:relative}
    #sourceQuestion.pen-mode-active{touch-action:none;overscroll-behavior:none}
    #sourceQuestion.pen-mode-active .sq-image{touch-action:none;overscroll-behavior:none}
    .pen-toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:0 0 10px}
    .pen-toggle,.pen-action{min-height:40px;border-radius:11px;padding:8px 12px;font-weight:850;border:1px solid var(--line);background:var(--surface);color:var(--ink)}
    .pen-toggle.on{background:#ede9ff;border-color:#8f7cf4;color:#5037d1;box-shadow:0 0 0 2px #ddd6ff inset}
    .pen-action:disabled{opacity:.42}
    .pen-hint{font-size:11px;color:var(--muted);margin-left:auto}
    .pen-canvas{position:absolute;z-index:6;pointer-events:none;touch-action:auto;cursor:default}
    .pen-canvas.on{pointer-events:auto;touch-action:none;cursor:crosshair}
    @media(max-width:700px){.pen-hint{width:100%;margin-left:0}.pen-toolbar{gap:6px}.pen-toggle,.pen-action{flex:1}}
  `;document.head.appendChild(css);

  function sourceActive(){return !!document.getElementById('sourceQuestion')?.classList.contains('active')}
  function updateLock(){const s=document.getElementById('sourceQuestion');if(!s)return;const want=enabled&&sourceActive();if(s.classList.contains('pen-mode-active')!==want)s.classList.toggle('pen-mode-active',want)}
  function blockTouchScroll(e){if(enabled&&sourceActive()&&e.touches?.length)e.preventDefault()}
  document.addEventListener('touchmove',blockTouchScroll,{capture:true,passive:false});

  function questionKey(){return img?.alt||document.querySelector('#sourceQuestion .sq-meta')?.textContent?.trim()||''}
  function strokes(){notes[key]??=[];return notes[key]}
  function setupCtx(){if(!canvas||!img)return null;const c=canvas.getContext('2d'),dpr=Math.max(1,window.devicePixelRatio||1);c.setTransform(dpr,0,0,dpr,0,0);c.lineCap='round';c.lineJoin='round';c.strokeStyle='#17213d';c.fillStyle='#17213d';c.lineWidth=2.35;return c}
  function redraw(){raf=0;if(!canvas||!img)return;const dpr=Math.max(1,window.devicePixelRatio||1),w=img.clientWidth,h=img.clientHeight;if(!w||!h)return;canvas.style.left=img.offsetLeft+'px';canvas.style.top=img.offsetTop+'px';canvas.style.width=w+'px';canvas.style.height=h+'px';const rw=Math.round(w*dpr),rh=Math.round(h*dpr);if(canvas.width!==rw||canvas.height!==rh){canvas.width=rw;canvas.height=rh}const c=setupCtx();if(!c)return;c.clearRect(0,0,w,h);for(const s of strokes()){if(!s?.length)continue;if(s.length===1){c.beginPath();c.arc(s[0].x*w,s[0].y*h,1.2,0,Math.PI*2);c.fill();continue}c.beginPath();for(let i=0;i<s.length;i++){const p=s[i],x=p.x*w,y=p.y*h;i?c.lineTo(x,y):c.moveTo(x,y)}c.stroke()}}
  function scheduleRedraw(){if(!raf)raf=requestAnimationFrame(redraw)}
  function point(e){const r=canvas.getBoundingClientRect();return{x:Math.min(1,Math.max(0,(e.clientX-r.left)/r.width)),y:Math.min(1,Math.max(0,(e.clientY-r.top)/r.height))}}
  function accepted(e){return e.pointerType==='pen'&&e.isPrimary!==false}
  function farEnough(a,b){if(!a||!b||!img)return true;const dx=(a.x-b.x)*img.clientWidth,dy=(a.y-b.y)*img.clientHeight;return dx*dx+dy*dy>=0.25}
  function down(e){if(!enabled||!accepted(e)||drawing)return;e.preventDefault();e.stopPropagation();drawing=true;penPointerId=e.pointerId;const p=point(e);activeStroke=[p];lastPoint=p;strokes().push(activeStroke);try{canvas.setPointerCapture?.(e.pointerId)}catch{}scheduleRedraw()}
  function move(e){if(!drawing||!activeStroke||e.pointerId!==penPointerId||!accepted(e))return;e.preventDefault();e.stopPropagation();const p=point(e);if(!farEnough(lastPoint,p))return;activeStroke.push(p);lastPoint=p;scheduleRedraw()}
  function finishPointer(e){if(!drawing||e.pointerId!==penPointerId)return;if(accepted(e)){e.preventDefault();e.stopPropagation()}try{canvas.releasePointerCapture?.(e.pointerId)}catch{}drawing=false;activeStroke=null;lastPoint=null;penPointerId=null;scheduleRedraw();save();updateButtons()}
  function updateButtons(){const t=document.getElementById('penToggle'),u=document.getElementById('penUndo'),c=document.getElementById('penClear');if(t){const label=enabled?'✏️ Kalem Açık':'✏️ Kalem Kapalı';if(t.classList.contains('on')!==enabled)t.classList.toggle('on',enabled);if(t.textContent!==label)t.textContent=label;const pressed=enabled?'true':'false';if(t.getAttribute('aria-pressed')!==pressed)t.setAttribute('aria-pressed',pressed)}if(canvas&&canvas.classList.contains('on')!==enabled)canvas.classList.toggle('on',enabled);updateLock();const has=!!(key&&notes[key]?.length);if(u&&u.disabled===has)u.disabled=!has;if(c&&c.disabled===has)c.disabled=!has}
  function toggle(){enabled=!enabled;localStorage.setItem(PREF,enabled?'1':'0');if(!enabled&&drawing){drawing=false;activeStroke=null;lastPoint=null;penPointerId=null;save()}updateButtons();scheduleRedraw()}
  function undo(){if(!key||!notes[key]?.length)return;notes[key].pop();save();scheduleRedraw();updateButtons()}
  function clear(){if(!key||!notes[key]?.length)return;if(!confirm('Bu sorudaki kalem notları temizlensin mi?'))return;notes[key]=[];save();scheduleRedraw();updateButtons()}
  function attach(){attachRaf=0;const host=document.getElementById('sqImage'),newImg=host?.querySelector('img');if(!host||!newImg){updateLock();return}if(newImg===img&&canvas?.isConnected){updateButtons();scheduleRedraw();return}img=newImg;key=questionKey();host.querySelector('.pen-canvas')?.remove();canvas=document.createElement('canvas');canvas.className='pen-canvas';host.appendChild(canvas);canvas.addEventListener('pointerdown',down,{passive:false});canvas.addEventListener('pointermove',move,{passive:false});canvas.addEventListener('pointerup',finishPointer,{passive:false});canvas.addEventListener('pointercancel',finishPointer,{passive:false});canvas.addEventListener('lostpointercapture',e=>{if(drawing&&e.pointerId===penPointerId){drawing=false;activeStroke=null;lastPoint=null;penPointerId=null;save();scheduleRedraw()}});
    const card=host.closest('.sq-card');let bar=card?.querySelector('.pen-toolbar');if(!bar&&card){bar=document.createElement('div');bar.className='pen-toolbar';bar.innerHTML='<button id="penToggle" class="pen-toggle" type="button"></button><button id="penUndo" class="pen-action" type="button">↶ Geri Al</button><button id="penClear" class="pen-action" type="button">🧹 Temizle</button><span class="pen-hint">Kalem açıkken ekran sabit • Yalnız tablet kalemi yazar</span>';card.insertBefore(bar,host);bar.querySelector('#penToggle').onclick=toggle;bar.querySelector('#penUndo').onclick=undo;bar.querySelector('#penClear').onclick=clear}else if(bar){const h=bar.querySelector('.pen-hint');if(h&&h.textContent!=='Kalem açıkken ekran sabit • Yalnız tablet kalemi yazar')h.textContent='Kalem açıkken ekran sabit • Yalnız tablet kalemi yazar'}
    resizeObs?.disconnect();resizeObs=new ResizeObserver(scheduleRedraw);resizeObs.observe(img);img.addEventListener('load',scheduleRedraw,{once:true});updateButtons();scheduleRedraw()}
  function scheduleAttach(){updateLock();if(!sourceActive()||attachRaf)return;attachRaf=requestAnimationFrame(attach)}
  const mo=new MutationObserver(muts=>{if(muts.some(m=>m.type==='childList'&&m.addedNodes.length))scheduleAttach()});mo.observe(document.body,{childList:true,subtree:true});
  document.addEventListener('click',()=>setTimeout(scheduleAttach,0),true);
  window.addEventListener('resize',scheduleRedraw);
  setTimeout(scheduleAttach,300);
})();