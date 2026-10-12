(function(){var n=document.getElementById('notes-btn');if(n)n.href='https://convert.joyehuang.dev/?url='+encodeURIComponent(location.href.split(/[?#]/)[0]);})();
(function(){var r=document.documentElement,k='theme',t=null;try{t=localStorage.getItem(k)}catch(e){}
if(t==='light'||t==='dark')r.dataset.theme=t;
var b=document.getElementById('theme-btn');if(b)b.onclick=function(){var d=r.dataset.theme?r.dataset.theme==='dark':matchMedia('(prefers-color-scheme: dark)').matches;
r.dataset.theme=d?'light':'dark';try{localStorage.setItem(k,r.dataset.theme)}catch(e){}};
var still=matchMedia('(prefers-reduced-motion: reduce)').matches;
var io=function(el,fn,th){new IntersectionObserver(function(es,o){es.forEach(function(e){if(e.isIntersecting){fn();o.disconnect()}})},{threshold:th}).observe(el)};
document.querySelectorAll('.mark').forEach(function(m){still?m.classList.add('on'):io(m,function(){m.classList.add('on')},1)});
document.querySelectorAll('[data-anim]').forEach(function(f){if(still)return;f.classList.add('armed');
var play=function(){f.classList.remove('play');void f.getBoundingClientRect();f.classList.add('play')};
io(f,play,.35);var rb=f.querySelector('.replay');if(rb)rb.onclick=function(){f.classList.remove('play');requestAnimationFrame(function(){requestAnimationFrame(play)})};});
document.querySelectorAll('.replay').forEach(function(b){if(still)b.hidden=true});})();
