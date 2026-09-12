/* Exact Illustrator artwork; frame-rate-independent easing for the pupil groups. */
(()=>{
 const stage=document.querySelector('.koree-stage');
 const svg=stage?.querySelector('.book-character-svg');
 const pupils=svg ? [...svg.querySelectorAll('.pupil-group')] : [];
 if(pupils.length!==2)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const state={x:0,y:0,tx:0,ty:0,active:0,targetActive:0};
 let frame=0,lastTime=0,resetTimer=0,visible=true;
 const paint=()=>pupils.forEach(pupil=>{
  const x=state.x-Number(pupil.dataset.offsetX)*state.active;
  const y=state.y-Number(pupil.dataset.offsetY)*state.active;
  pupil.setAttribute('transform',`translate(${x.toFixed(3)} ${y.toFixed(3)})`);
 });
 const step=time=>{
  frame=0;
  const dt=lastTime ? Math.min(time-lastTime,50) : 16.67;
  lastTime=time;
  const ease=1-Math.exp(-dt/105);
  state.x+=(state.tx-state.x)*ease;state.y+=(state.ty-state.y)*ease;
  state.active+=(state.targetActive-state.active)*ease;
  const moving=Math.abs(state.tx-state.x)+Math.abs(state.ty-state.y)+Math.abs(state.targetActive-state.active)>.008;
  if(!moving){state.x=state.tx;state.y=state.ty;state.active=state.targetActive}
  paint();
  if(moving&&visible&&!reduced.matches)frame=requestAnimationFrame(step);else lastTime=0;
 };
 const schedule=()=>{if(!frame&&visible&&!reduced.matches)frame=requestAnimationFrame(step)};
 const rest=(immediate=false)=>{
  clearTimeout(resetTimer);state.tx=state.ty=state.targetActive=0;
  if(immediate){cancelAnimationFrame(frame);frame=0;lastTime=0;state.x=state.y=state.active=0;paint()}else schedule();
 };
 const aim=(clientX,clientY)=>{
  if(reduced.matches||!visible)return;
  clearTimeout(resetTimer);
  const rect=svg.getBoundingClientRect();
  // Original eye centers, normalized to the unchanged Illustrator viewBox.
  const centerX=rect.left+rect.width*(611.63/1193.28);
  const centerY=rect.top+rect.height*(578.4881/841.89);
  const dx=clientX-centerX,dy=clientY-centerY;
  const distance=Math.hypot(dx,dy);
  const reach=1-Math.exp(-distance/230);
  state.tx=distance ? (dx/distance)*18*reach : 0;
  state.ty=distance ? (dy/distance)*31*reach : 0;
  state.targetActive=1;schedule();
 };
 stage.addEventListener('pointermove',event=>{if(event.pointerType!=='touch')aim(event.clientX,event.clientY)},{passive:true});
 stage.addEventListener('pointerdown',event=>{
  aim(event.clientX,event.clientY);
  if(event.pointerType==='touch')resetTimer=setTimeout(()=>rest(),1400);
 },{passive:true});
 stage.addEventListener('pointerleave',()=>rest());
 stage.addEventListener('pointercancel',()=>rest());
 stage.addEventListener('focusin',event=>{const r=event.target.getBoundingClientRect();aim(r.left+r.width/2,r.top+r.height/2)});
 stage.addEventListener('focusout',event=>{if(!stage.contains(event.relatedTarget))rest()});
 window.addEventListener('blur',()=>rest(true));
 document.addEventListener('visibilitychange',()=>{if(document.hidden)rest(true)});
 reduced.addEventListener('change',()=>rest(true));
 if('IntersectionObserver' in window)new IntersectionObserver(entries=>{
  visible=entries[0].isIntersecting;if(!visible)rest(true);
 }).observe(stage);
 paint();
})();
