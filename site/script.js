const toggle=document.querySelector('#theme');
function dark(){return document.documentElement.dataset.theme?document.documentElement.dataset.theme==='dark':matchMedia('(prefers-color-scheme: dark)').matches}
function label(){toggle.setAttribute('aria-label',`Switch to ${dark()?'light':'dark'} theme`);toggle.setAttribute('aria-pressed',String(dark()))}
toggle.addEventListener('click',()=>{const t=dark()?'light':'dark';document.documentElement.dataset.theme=t;try{localStorage.setItem('theme',t)}catch(e){}label()});label();matchMedia('(prefers-color-scheme: dark)').addEventListener('change',label);
const sections=[...document.querySelectorAll('main>section')],navs=[...document.querySelectorAll('.nav-link')];
function active(){let current=sections[0];for(const s of sections){if(s.getBoundingClientRect().top<=170)current=s}for(const a of navs){const on=a.hash==='#'+current.id;a.classList.toggle('active',on);if(on)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')}}
addEventListener('scroll',active,{passive:true});active();
const tiltMotion=matchMedia('(prefers-reduced-motion: reduce)');
const tiltPointer=matchMedia('(hover: hover) and (pointer: fine)');
document.querySelectorAll('[data-tilt]').forEach(card=>{
 const reset=()=>{card.style.removeProperty('--rx');card.style.removeProperty('--ry');card.classList.remove('is-tilting')};
 card.addEventListener('pointermove',event=>{
  if(tiltMotion.matches||!tiltPointer.matches||event.pointerType==='touch')return;
  const rect=card.parentElement.getBoundingClientRect();
  const x=Math.max(0,Math.min(1,(event.clientX-rect.left)/rect.width));
  const y=Math.max(0,Math.min(1,(event.clientY-rect.top)/rect.height));
  card.style.setProperty('--rx',`${(0.5-y)*20}deg`);
  card.style.setProperty('--ry',`${(x-0.5)*24}deg`);
  card.style.setProperty('--gx',`${x*100}%`);card.style.setProperty('--gy',`${y*100}%`);
  card.classList.add('is-tilting');
 });
 card.addEventListener('pointerleave',reset);card.addEventListener('pointercancel',reset);
 tiltMotion.addEventListener('change',reset);tiltPointer.addEventListener('change',reset);
});
