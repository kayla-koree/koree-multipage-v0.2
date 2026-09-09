
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
  const questionBlock=quiz.querySelector('[data-quiz-question]');
  const questionText=quiz.querySelector('[data-question-text]');
  const optionsWrap=quiz.querySelector('[data-options]');
  const result=quiz.querySelector('[data-result]');
  const resultName=quiz.querySelector('[data-result-name]');
  const resultDesc=quiz.querySelector('[data-result-desc]');
  const progressFill=quiz.querySelector('[data-progress-fill]');
  const progressLabel=quiz.querySelector('[data-progress-label]');
  const src=quiz.dataset.quizSrc||'../data/quiz.json';
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let questions=[];
  let types=[];
  let current=0;
  const tally={};

  function renderQuestion(){
    const q=questions[current];
    if(!q) return;
    questionText.textContent=q.text;
    optionsWrap.innerHTML='';
    q.options.forEach(opt=>{
      const btn=document.createElement('button');
      btn.type='button';
      btn.className='btn light';
      btn.setAttribute('data-option','');
      btn.textContent=opt.text;
      btn.addEventListener('click',()=>selectOption(btn,opt));
      optionsWrap.appendChild(btn);
    });
    if(progressLabel) progressLabel.textContent='Question '+String(current+1).padStart(2,'0')+' · '+questions.length;
    if(progressFill) progressFill.style.width=(current/questions.length*100)+'%';
  }

  function selectOption(btn,opt){
    optionsWrap.querySelectorAll('[data-option]').forEach(o=>{o.disabled=true;});
    btn.classList.add('selected');
    tally[opt.type]=(tally[opt.type]||0)+1;
    if(progressFill) progressFill.style.width=((current+1)/questions.length*100)+'%';
    window.setTimeout(advance, reduceMotion?0:420);
  }

  function advance(){
    current++;
    if(current<questions.length){
      if(reduceMotion){
        renderQuestion();
      } else {
        questionBlock.classList.add('leaving');
        window.setTimeout(()=>{
          renderQuestion();
          questionBlock.classList.remove('leaving');
        },220);
      }
    } else {
      showResult();
    }
  }

  function showResult(){
    let bestType=null;
    let bestScore=-1;
    Object.keys(tally).forEach(typeId=>{
      if(tally[typeId]>bestScore){
        bestScore=tally[typeId];
        bestType=typeId;
      }
    });
    const persona=types.find(t=>t.id===bestType)||types[0];
    if(!persona) return;
    questionBlock.hidden=true;
    resultName.textContent=persona.name;
    resultDesc.textContent=persona.description;
    if(progressLabel) progressLabel.textContent='Result';
    if(progressFill) progressFill.style.width='100%';
    result.hidden=false;
  }

  fetch(src)
    .then(res=>res.json())
    .then(data=>{
      questions=data.questions||[];
      types=data.types||[];
      current=0;
      if(questions.length){
        renderQuestion();
      } else {
        questionText.textContent='This quiz is being updated — check back soon.';
      }
    })
    .catch(()=>{
      questionText.textContent='Couldn\'t load the quiz right now — please refresh.';
    });
}
const filterBar=document.querySelector('[data-article-filters]');
if(filterBar){
  const filterButtons=[...filterBar.querySelectorAll('[data-filter]')];
  const validFilters=filterButtons.map(b=>b.dataset.filter);
  const filterCards=[...document.querySelectorAll('[data-category]')];
  const filterEmpty=document.querySelector('[data-filter-empty]');

  function applyArticleFilter(value){
    filterButtons.forEach(btn=>{
      const active=btn.dataset.filter===value;
      btn.classList.toggle('active',active);
      btn.setAttribute('aria-pressed',active?'true':'false');
    });
    let visible=0;
    filterCards.forEach(card=>{
      const show=value==='all'||card.dataset.category===value;
      card.hidden=!show;
      if(show) visible++;
    });
    if(filterEmpty) filterEmpty.hidden=visible>0;
  }

  filterButtons.forEach(btn=>{
    btn.addEventListener('click',()=>{
      const value=btn.dataset.filter;
      applyArticleFilter(value);
      const url=value==='all' ? location.pathname+location.search : '#'+value;
      history.replaceState(null,'',url);
    });
  });

  function applyFromHash(){
    const value=(location.hash||'').replace('#','').toLowerCase();
    applyArticleFilter(validFilters.includes(value)?value:'all');
  }
  window.addEventListener('hashchange',applyFromHash);
  applyFromHash();
}
const heroStage=document.getElementById('heroStage');
if(heroStage && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  const layers=[...heroStage.querySelectorAll('[data-depth]')];
  heroStage.addEventListener('mousemove',e=>{
    const rect=heroStage.getBoundingClientRect();
    const cx=(e.clientX-rect.left)/rect.width-.5;
    const cy=(e.clientY-rect.top)/rect.height-.5;
    layers.forEach(el=>{
      const depth=parseFloat(el.dataset.depth)||1;
      el.style.setProperty('--px',(-cx*14*depth).toFixed(1)+'px');
      el.style.setProperty('--py',(-cy*10*depth).toFixed(1)+'px');
    });
  });
  heroStage.addEventListener('mouseleave',()=>{
    layers.forEach(el=>{
      el.style.setProperty('--px','0px');
      el.style.setProperty('--py','0px');
    });
  });
}
