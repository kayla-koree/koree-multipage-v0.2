
document.querySelectorAll('.menu').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const nav=document.querySelector('.mobile-nav');
    nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', nav.classList.contains('open'));
  });
});
document.querySelectorAll('.faq-q').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const item=btn.closest('.faq-item');
    item.classList.toggle('open');
    btn.setAttribute('aria-expanded', item.classList.contains('open'));
  });
});
document.querySelectorAll('[data-audio]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const text=btn.dataset.audio;
    if('speechSynthesis' in window){
      speechSynthesis.cancel();
      const u=new SpeechSynthesisUtterance(text);
      u.lang='ko-KR';
      u.rate=.82;
      speechSynthesis.speak(u);
    }
  });
});
document.querySelectorAll('[data-newsletter]').forEach(form=>{
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const box=form.closest('.form-card, .card');
    const msg=box.querySelector('.success-msg');
    if(msg){msg.hidden=false; form.reset();}
  });
});
const quiz=document.querySelector('[data-quiz]');
if(quiz){
  const options=quiz.querySelectorAll('[data-option]');
  const result=quiz.querySelector('[data-result]');
  options.forEach(o=>o.addEventListener('click',()=>{
    options.forEach(x=>x.classList.remove('selected'));
    o.classList.add('selected');
    result.hidden=false;
  }));
}
