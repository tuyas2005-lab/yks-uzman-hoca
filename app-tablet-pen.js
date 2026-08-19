(()=>{
  if(window.__yksTabletPenV1)return;window.__yksTabletPenV1=true;
  const STORE='yksTabletPenNotesV1',PREF='yksTabletPenEnabledV1',STYLE_PREF='yksTabletPenStyleV1';
  const LEGACY_COLOR='#17213d',LEGACY_WIDTH=2.35;
  const COLORS=[
    {v:'#17213d',n:'Lacivert'},
    {v:'#2563eb',n:'Mavi'},
    {v:'#ef4444',n:'Kırmızı'},
    {v:'#16a34a',n:'Yeşil'},
    {v:'#7c3aed',n:'Mor'},
    {v:'#f59e0b',n:'Turuncu'}
  ];
  const WIDTHS=[
    {v:1.4,n:'İnce'},
    {v:2.35,n:'Normal'},
    {v:4,n:'Kalın'},
    {v:6,n:'Çok Kalın'}
  ];
  const stylePref=(()=>{try{return JSON.parse(localStorage.getItem(STYLE_PREF)||'{}')||{}}catch{return{}}})();
  let penColor=COLORS.some(x=>x.v===stylePref.color)?stylePref.color:LEGACY_COLOR;
  let penWidth=WIDTHS.some(x=>x.v===Number(stylePref.width))?Number(stylePref.width):LEGACY_WIDTH;
  let enabled=localStorage.getItem(PREF)==='1',canvas=null,img=null,key='',drawing=false,activeStroke=null,lastPoint=null,penPointerId=null,resizeObs=null,raf=0,attachRaf=0;
  const notes=(()=>{try{return JSON.parse(localStorage.getItem(STORE)||'{}')||{}}catch{return{}}})();
  const save=()=>{try{localStorage.setItem(STORE,JSON.stringify(notes))}catch{}};
  const saveStyle=()=>{try{localStorage.setItem(STYLE_PREF,JSON.stringify({color:penColor,width:penWidth}))}catch{}};
  const css=document.createElement('style');css.textContent=`
    #sourceQuestion .sq-image{position:relative}
    #sourceQuestion.pen-mode-active{touch-action:none;overscroll-behavior:none}
    #sourceQuestion.pen-mode-active .sq-image{touch-action:none;overscroll-behavior:none}
    .pen-toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:0 0 10px}
    .pen-toggle,.pen-action,.pen-width-select{min-height:40px;border-radius:11px;padding:8px 12px;font-weight:850;border:1px solid var(--line);background:var(--surface);color:var(--ink)}
    .pen-toggle.on{background:#ede9ff;border-color:#8f7cf4;color:#5037d1;box-shadow:0 0 0 2px #ddd6ff inset}
    .pen-action:disabled{opacity:.42}
    .pen-style-group{display:flex;align-items:center;gap:6px;padding:4px 7px;border:1px solid var(--line);border-radius:11px;background:var(--surface)}
    .pen-style-label{font-size:11px;font-weight:850;color:var(--muted)}
    .pen-colors{display:flex;align-items:center;gap:5px}
    .pen-color{width:27px;height:27px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 1px var(--line);padding:0;cursor:pointer;background:var(--pen-color)}
    .pen-color.on{box-shadow:0 0 0 3px #b9afff;transform:scale(1.05)}
    .pen-width-select{min-height:32px;height:32px;padding:3px 8px;border-radius:8px;font-size:12px}
    .pen-preview{display:inline-block;width:30px;border-radius:99px;background:var(--pen-preview);height:var(--pen-preview-width);min-height:1px}
    .pen-hint{font-size:11px;color:var(--muted);margin-left:auto}
    .pen-canvas{position:absolute;z-index:6;pointer-events:none;touch-action:auto;cursor:default}
    .pen-canvas.on{pointer-events:auto;touch-action:none;cursor:crosshair}
    @media(max-width:900px){.pen-hint{width:100%;margin-left:0}}
    @media(max-width:700px){.pen-toolbar{gap:6px}.pen-toggle,.pen-action{flex:1}.pen-style-group{width:100%;justify-content:flex-start}.pen-colors{flex-wrap:wrap}}
  `;document.head.appendChild(css);

  function sourceActive(){return !!document.getElementById('sourceQuestion')?.classList.contains('active')}
  function updateLock(){const s=document.getElementById('sourceQuestion');if(!s)return;const want=enabled&&sourceActive();if(s.classList.contains('pen-mode-active')!==want)s.classList.toggle('pen-mode-active',want)}
  function blockTouchScroll(e){if(enabled&&sourceActive()&&e.touches?.length)e.preventDefault()}
  document.addEventListener('touchmove',blockTouchScroll,{capture:true,passive:false});

  function questionKey(){return img?.alt||document.querySelector('#sourceQuestion .sq-meta')?.textContent?.trim()||''}
  function strokes(){notes[key]??=[];return notes[key]}
  function strokePoints(s){return Array.isArray(s)?s:(Array.isArray(s?.points)?s.points:[])}
  function strokeColor(s){return Array.isArray(s)?LEGACY_COLOR:(s?.color||LEGACY_COLOR)}
  function strokeWidth(s){const w=Array.isArray(s)?LEGACY_WIDTH:Number(s?.width);return Number.isFinite(w)&&w>0?w:LEGACY_WIDTH}
  function setupCtx(color=penColor,width=penWidth){if(!canvas||!img)return null;const c=canvas.getContext('2d'),dpr=Math.max(1,window.devicePixelRatio||1);c.setTransform(dpr,0,0,dpr,0,0);c.lineCap='round';c.lineJoin='round';c.strokeStyle=color;c.fillStyle=color;c.lineWidth=width;return c}
  function redraw(){raf=0;if(!canvas||!img)return;const dpr=Math.max(1,window.devicePixelRatio||1),w=img.clientWidth,h=img.clientHeight;if(!w||!h)return;canvas.style.left=img.offsetLeft+'px';canvas.style.top=img.offsetTop+'px';canvas.style.width=w+'px';canvas.style.height=h+'px';const rw=Math.round(w*dpr),rh=Math.round(h*dpr);if(canvas.width!==rw||canvas.height!==rh){canvas.width=rw;canvas.height=rh}const base=setupCtx();if(!base)return;base.clearRect(0,0,w,h);for(const s of strokes()){const pts=strokePoints(s);if(!pts.length)continue;const color=strokeColor(s),width=strokeWidth(s),c=setupCtx(color,width);if(!c)continue;if(pts.length===1){c.beginPath();c.arc(pts[0].x*w,pts[0].y*h,Math.max(0.7,width/2),0,Math.PI*2);c.fill();continue}c.beginPath();for(let i=0;i<pts.length;i++){const p=pts[i],x=p.x*w,y=p.y*h;i?c.lineTo(x,y):c.moveTo(x,y)}c.stroke()}}
  function scheduleRedraw(){if(!raf)raf=requestAnimationFrame(redraw)}
  function point(e){const r=canvas.getBoundingClientRect();return{x:Math.min(1,Math.max(0,(e.clientX-r.left)/r.width)),y:Math.min(1,Math.max(0,(e.clientY-r.top)/r.height))}}
  function accepted(e){return e.pointerType==='pen'&&e.isPrimary!==false}
  function farEnough(a,b){if(!a||!b||!img)return true;const dx=(a.x-b.x)*img.clientWidth,dy=(a.y-b.y)*img.clientHeight;return dx*dx+dy*dy>=0.25}
  function down(e){if(!enabled||!accepted(e)||drawing)return;e.preventDefault();e.stopPropagation();drawing=true;penPointerId=e.pointerId;const p=point(e);activeStroke={points:[p],color:penColor,width:penWidth};lastPoint=p;strokes().push(activeStroke);try{canvas.setPointerCapture?.(e.pointerId)}catch{}scheduleRedraw()}
  function move(e){if(!drawing||!activeStroke||e.pointerId!==penPointerId||!accepted(e))return;e.preventDefault();e.stopPropagation();const p=point(e);if(!farEnough(lastPoint,p))return;activeStroke.points.push(p);lastPoint=p;scheduleRedraw()}
  function finishPointer(e){if(!drawing||e.pointerId!==penPointerId)return;if(accepted(e)){e.preventDefault();e.stopPropagation()}try{canvas.releasePointerCapture?.(e.pointerId)}catch{}drawing=false;activeStroke=null;lastPoint=null;penPointerId=null;scheduleRedraw();save();updateButtons()}
  function updateButtons(){const t=document.getElementById('penToggle'),u=document.getElementById('penUndo'),c=document.getElementById('penClear'),sel=document.getElementById('penWidth');if(t){const label=enabled?'✏️ Kalem Açık':'✏️ Kalem Kapalı';if(t.classList.contains('on')!==enabled)t.classList.toggle('on',enabled);if(t.textContent!==label)t.textContent=label;const pressed=enabled?'true':'false';if(t.getAttribute('aria-pressed')!==pressed)t.setAttribute('aria-pressed',pressed)}if(canvas&&canvas.classList.contains('on')!==enabled)canvas.classList.toggle('on',enabled);updateLock();const has=!!(key&&notes[key]?.length);if(u&&u.disabled===has)u.disabled=!has;if(c&&c.disabled===has)c.disabled=!has;document.querySelectorAll('.pen-color').forEach(b=>b.classList.toggle('on',b.dataset.penColor===penColor));if(sel&&Number(sel.value)!==penWidth)sel.value=String(penWidth);const preview=document.getElementById('penPreview');if(preview){preview.style.setProperty('--pen-preview',penColor);preview.style.setProperty('--pen-preview-width',Math.max(1,penWidth)+'px')}}
  function toggle(){enabled=!enabled;localStorage.setItem(PREF,enabled?'1':'0');if(!enabled&&drawing){drawing=false;activeStroke=null;lastPoint=null;penPointerId=null;save()}updateButtons();scheduleRedraw()}
  function setColor(v){if(!COLORS.some(x=>x.v===v))return;penColor=v;saveStyle();updateButtons()}
  function setWidth(v){v=Number(v);if(!WIDTHS.some(x=>x.v===v))return;penWidth=v;saveStyle();updateButtons()}
  function undo(){if(!key||!notes[key]?.length)return;notes[key].pop();save();scheduleRedraw();updateButtons()}
  function clear(){if(!key||!notes[key]?.length)return;if(!confirm('Bu sorudaki kalem notları temizlensin mi?'))return;notes[key]=[];save();scheduleRedraw();updateButtons()}
  function toolbarHtml(){return '<button id="penToggle" class="pen-toggle" type="button"></button><button id="penUndo" class="pen-action" type="button">↶ Geri Al</button><button id="penClear" class="pen-action" type="button">🧹 Temizle</button><div class="pen-style-group"><span class="pen-style-label">Renk</span><div class="pen-colors">'+COLORS.map(x=>`<button class="pen-color" type="button" data-pen-color="${x.v}" title="${x.n}" aria-label="${x.n}" style="--pen-color:${x.v}"></button>`).join('')+'</div></div><div class="pen-style-group"><span class="pen-style-label">Kalınlık</span><span id="penPreview" class="pen-preview"></span><select id="penWidth" class="pen-width-select" aria-label="Kalem kalınlığı">'+WIDTHS.map(x=>`<option value="${x.v}">${x.n}</option>`).join('')+'</select></div><span class="pen-hint">Kalem açıkken ekran sabit • Yalnız tablet kalemi yazar</span>'}
  function bindToolbar(bar){bar.querySelector('#penToggle').onclick=toggle;bar.querySelector('#penUndo').onclick=undo;bar.querySelector('#penClear').onclick=clear;bar.querySelectorAll('[data-pen-color]').forEach(b=>b.onclick=()=>setColor(b.dataset.penColor));bar.querySelector('#penWidth').onchange=e=>setWidth(e.target.value)}
  function attach(){attachRaf=0;const host=document.getElementById('sqImage'),newImg=host?.querySelector('img');if(!host||!newImg){updateLock();return}if(newImg===img&&canvas?.isConnected){updateButtons();scheduleRedraw();return}img=newImg;key=questionKey();host.querySelector('.pen-canvas')?.remove();canvas=document.createElement('canvas');canvas.className='pen-canvas';host.appendChild(canvas);canvas.addEventListener('pointerdown',down,{passive:false});canvas.addEventListener('pointermove',move,{passive:false});canvas.addEventListener('pointerup',finishPointer,{passive:false});canvas.addEventListener('pointercancel',finishPointer,{passive:false});canvas.addEventListener('lostpointercapture',e=>{if(drawing&&e.pointerId===penPointerId){drawing=false;activeStroke=null;lastPoint=null;penPointerId=null;save();scheduleRedraw()}});
    const card=host.closest('.sq-card');let bar=card?.querySelector('.pen-toolbar');if(!bar&&card){bar=document.createElement('div');bar.className='pen-toolbar';bar.innerHTML=toolbarHtml();card.insertBefore(bar,host);bindToolbar(bar)}else if(bar&&!bar.querySelector('.pen-colors')){bar.innerHTML=toolbarHtml();bindToolbar(bar)}else if(bar){const h=bar.querySelector('.pen-hint');if(h&&h.textContent!=='Kalem açıkken ekran sabit • Yalnız tablet kalemi yazar')h.textContent='Kalem açıkken ekran sabit • Yalnız tablet kalemi yazar'}
    resizeObs?.disconnect();resizeObs=new ResizeObserver(scheduleRedraw);resizeObs.observe(img);img.addEventListener('load',scheduleRedraw,{once:true});updateButtons();scheduleRedraw()}
  function scheduleAttach(){updateLock();if(!sourceActive()||attachRaf)return;attachRaf=requestAnimationFrame(attach)}
  const mo=new MutationObserver(muts=>{if(muts.some(m=>m.type==='childList'&&m.addedNodes.length))scheduleAttach()});mo.observe(document.body,{childList:true,subtree:true});
  document.addEventListener('click',()=>setTimeout(scheduleAttach,0),true);
  window.addEventListener('resize',scheduleRedraw);
  setTimeout(scheduleAttach,300);
})();