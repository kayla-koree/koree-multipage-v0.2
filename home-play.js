(()=>{
 const card=document.querySelector('.play-preview-card');
 if(!card)return;
 const answers=[...card.querySelectorAll('[data-preview-answer]')];
 const feedback=card.querySelector('.play-preview-feedback');
 answers.forEach(button=>button.addEventListener('click',()=>{
  answers.forEach(answer=>{
   const correct=answer.dataset.previewAnswer==='correct';
   const selected=answer===button;
   answer.setAttribute('aria-pressed',String(selected));
   answer.classList.toggle('is-correct',correct);
   answer.classList.toggle('is-incorrect',selected&&!correct);
   answer.querySelector('.answer-result').textContent=correct?'✓':selected?'×':'';
  });
  feedback.innerHTML=button.dataset.previewAnswer==='correct'
   ? 'Exactly! Here, <span lang="ko">대박</span> <small class="korean-roman" lang="ko-Latn">(dae-bak)</small> celebrates your friend’s good news: “That’s amazing!”'
   : 'Here, the answer is A: “That’s amazing!” Your friend’s good news makes <span lang="ko">대박</span> <small class="korean-roman" lang="ko-Latn">(dae-bak)</small> a positive reaction.';
  feedback.classList.add('is-revealed');
 }));
})();
