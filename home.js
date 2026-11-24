// Home page enhancements - plain vanilla JS
(function(){
  document.documentElement.classList.add('js');

  // sticky header shadow
  var header=document.querySelector('.site-header');
  function onScroll(){header.classList.toggle('scrolled',window.scrollY>8);}
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  // scroll reveal + count up
  function countUp(el){
    if(el.dataset.text){el.textContent=el.dataset.text;return;}
    var end=+el.dataset.count,n=0,step=Math.max(1,Math.ceil(end/24));
    var t=setInterval(function(){n+=step;if(n>=end){n=end;clearInterval(t);}el.textContent=n;},40);
  }
  var items=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){
      if(!e.isIntersecting)return;
      e.target.classList.add('in');
      e.target.querySelectorAll('[data-count]').forEach(countUp);
      io.unobserve(e.target);
    });},{threshold:.15});
    items.forEach(function(el){io.observe(el);});
  }else{
    items.forEach(function(el){el.classList.add('in');el.querySelectorAll('[data-count]').forEach(countUp);});
  }

  // hero preview cycles through demo departments
  var demo=[
    {d:'Radiology',r:'X-Ray Room · Ground Floor',t:'#024',s:'Waiting',c:2,n:8},
    {d:'Radiology',r:'CT Scan Room · Ground Floor',t:'#011',s:'Next up',c:6,n:8},
    {d:'OPD',r:'Pediatric Clinic · First Floor',t:'#032',s:'Waiting',c:3,n:10},
    {d:'OPD',r:'General Clinic · First Floor',t:'#007',s:'Now serving',c:9,n:10}
  ];
  var box=document.querySelector('.dashboard-preview');
  if(!box||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var $=function(id){return document.getElementById(id);},i=0;
  setInterval(function(){
    i=(i+1)%demo.length;var x=demo[i];
    box.classList.add('swap');
    setTimeout(function(){
      $('pv-dept').textContent=x.d;$('pv-room').textContent=x.r;$('pv-token').textContent=x.t;
      $('pv-status').textContent=x.s;$('pv-count').textContent=x.c+' of '+x.n;
      $('pv-bar').style.width=Math.round(x.c/x.n*100)+'%';
      box.classList.remove('swap');
    },300);
  },3800);
})();
