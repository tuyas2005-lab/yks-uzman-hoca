(()=>{
  if(window.__yksTabletPenV1)return;window.__yksTabletPenV1=true;
  const STORE='yksTabletPenNotesV1',PREF='yksTabletPenEnabledV1';
  let enabled=localStorage.getItem(PREF)==='1',canvas=null,img=null,key='',drawing=false,activeStroke=null,resizeObs=null;
  const notes=(()=>{try{return JSON.parse(localStorage.getItem(STORE)||'{}')||{}}catch{return{}}})();
  const save=()=>{try{localStorage.setItem(STORE,JSON.stringify(notes))}catch{}};
  const css=document.createElement('style');css.textContent=`
    #sourceQuestion .sq-image{position:relative}
    .pen-toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:0 0 10px}
    .pen-toggle,.pen-action{min-height:40px;border-radius:11px;padding:8px 12px;font-weight:850;border:1px solid var(--line);background:var(--surface);color:var(--ink)}
    .pen-toggle.on{background:#ede9ff;border-color:#8f7cf4;color:#5037d1;box-shadow:0 0 0 2px #ddd6ff inset}
    .pen-action:disabled{opacity:.42}
    .pen-hint{font-size:11px;color:var(--muted);margin-left:auto}
    .pen-canvas{position:absolute;z-index:6;pointer-events:none;touch-action:pan-y pan-x;cursor:default}
    .pen-canvas.on{pointer-events:auto;cursor:crosshair}
    @media(max-width:700px){.pen-hint{width:100%;margin-left:0}.pen-toolbar{gap:6px}.pen-toggle,.pen-action{flex:1}}
  `;document.head.appendChild(css);

  function questionKey(){return img?.alt||document.querySelector('#sourceQuestion .sq-meta')?.textContent?.trim()||''}
  function strokes(){notes[key]??=[];return notes[key]}
  function ctx2d(){const c=canvas?.getContext('2d');if(!c)return null;c.lineCap='round';c.lineJoin='round';c.strokeStyle='#17213d';c.lineWidth=2.35;return c}
  function redraw(){if(!canvas||!img)return;const dpr=Math.max(1,window.devicePixelRatio||1),w=img.clientWidth,h=img.clientHeight;if(!w||!h)return;canvas.style.left=img.offsetLeft+'px';canvas.style.top=img.offsetTop+'px';canvas.style.width=w+'px';canvas.style.height=h+'px';const rw=Math.round(w*dpr),rh=Math.round(h*dpr);if(canvas.width!==rw||canvas.height!==rh){canvas.width=rw;canvas.height=rh}const c=canvas.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,w,h);c.lineCap='round';c.lineJoin='round';c.strokeStyle='#17213d';c.lineWidth=2.35;for(const s of strokes()){if(!s?.length)continue;c.beginPath();s.forEach((p,i)=>{const x=p.x*w,y=p.y*h;i?c.lineTo(x,y):c.moveTo(x,y)});c.stroke()}updateButtons()}
  function point(e){const r=canvas.getBoundingClientRect();return{x:Math.min(1,Math.max(0,(e.clientX-r.left)/r.width)),y:Math.min(1,Math.max(0,(e.clientY-r.top)/r.height))}}
  function accepted(e){return e.pointerType==='pen'||e.pointerType==='mouse'}
  function down(e){if(!enabled||!accepted(e))return;e.preventDefault();drawing=true;activeStroke=[point(e)];strokes().push(activeStroke);canvas.setPointerCapture?.(e.pointerId);redraw()}
  function move(e){if(!drawing||!activeStroke||!accepted(e))return;e.preventDefault();const events=e.getCoalescedEvents?.()||[e];for(const ev of events)activeStroke.push(point(ev));redraw()}
  function up(e){if(!drawing)return;if(accepted(e))e.preventDefault();drawing=false;activeStroke=null;save();updateButtons()}
  function updateButtons(){const t=document.getElementById('penToggle'),u=document.getElementById('penUndo'),c=document.getElementById('penClear');if(t){t.classList.toggle('on',enabled);t.textContent=enabled?'✏️ Kalem Açık':'✏️ Kalem Kapalı';t.setAttribute('aria-pressed',enabled?'true':'false')}if(canvas)canvas.classList.toggle('on',enabled);const has=!!(key&&notes[key]?.length);if(u)u.disabled=!has;if(c)c.disabled=!has}
  function toggle(){enabled=!enabled;localStorage.setItem(PREF,enabled?'1':'0');updateButtons()}
  function undo(){if(!key||!notes[key]?.length)return;notes[key].pop();save();redraw()}
  function clear(){if(!key||!notes[key]?.length)return;if(!confirm('Bu sorudaki kalem notları temizlensin mi?'))return;notes[key]=[];save();redraw()}
  function attach(){const host=document.getElementById('sqImage'),newImg=host?.querySelector('img');if(!host||!newImg)return;if(newImg===img&&canvas?.isConnected){redraw();return}img=newImg;key=questionKey();host.querySelector('.pen-canvas')?.remove();canvas=document.createElement('canvas');canvas.className='pen-canvas';host.appendChild(canvas);canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);canvas.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'&&drawing)up(e)});
    const card=host.closest('.sq-card');let bar=card?.querySelector('.pen-toolbar');if(!bar&&card){bar=document.createElement('div');bar.className='pen-toolbar';bar.innerHTML='<button id="penToggle" class="pen-toggle" type="button"></button><button id="penUndo" class="pen-action" type="button">↶ Geri Al</button><button id="penClear" class="pen-action" type="button">🧹 Temizle</button><span class="pen-hint">Parmak kaydırır • Tablet kalemi yazar</span>';card.insertBefore(bar,host);bar.querySelector('#penToggle').onclick=toggle;bar.querySelector('#penUndo').onclick=undo;bar.querySelector('#penClear').onclick=clear}
    resizeObs?.disconnect();resizeObs=new ResizeObserver(redraw);resizeObs.observe(img);img.addEventListener('load',redraw,{once:true});requestAnimationFrame(redraw);updateButtons()}
  const mo=new MutationObserver(()=>{if(document.getElementById('sourceQuestion')?.classList.contains('active'))requestAnimationFrame(attach)});mo.observe(document.body,{childList:true,subtree:true});window.addEventListener('resize',()=>requestAnimationFrame(redraw));setTimeout(attach,300);
})();