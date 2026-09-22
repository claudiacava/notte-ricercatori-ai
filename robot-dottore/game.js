(() => {
  'use strict';
  const {samples,referenceA,referenceB,gemScore}=GameLogic;
  const {cup}=GameUI;
  let answers=Array(samples.length).fill('');
  const refs=document.getElementById('references');
  refs.innerHTML=[['A','Segnale presente',referenceA],['B','Segnale non rilevato',referenceB]].map(([group,name,examples])=>`<section class="group-bin ${group==='B'?'group-b':''}" aria-label="Esempi della classe ${group}"><h3 class="group-label"><span class="letter">${group}</span>Classe ${group} — ${name}</h3><p>Questi esempi hanno già una risposta.</p><div class="reference-examples">${examples.map(gems=>cup(gems,true)).join('')}</div></section>`).join('');
  const sampleList=document.getElementById('samples');
  function renderSamples(){
    sampleList.innerHTML=samples.map((sample,i)=>`<article class="sample-card" id="sample-${i+1}" aria-labelledby="sample-title-${i+1}"><span class="sample-index">CAMPIONE ${String(i+1).padStart(2,'0')}</span><h3 id="sample-title-${i+1}">Pirottina ${i+1}</h3>${cup(sample.gems)}<fieldset class="sample-options"><legend class="visually-hidden">Scegli la classe per il campione ${i+1}</legend>${[['A','Segnale presente'],['B','Segnale non rilevato']].map(([group,caption])=>`<label class="sample-option"><input type="radio" name="sample-${i+1}" value="${group}" data-index="${i}"><span><strong>Classe ${group}</strong>${caption}</span></label>`).join('')}</fieldset><div id="feedback-${i}" class="feedback pending" role="status" aria-live="polite">Scegli A oppure B.</div></article>`).join('');
  }
  function updateScore(){
    const score=gemScore(answers);
    document.getElementById('score').textContent=`${score.correct} / ${score.total} corrette`;
    document.getElementById('progress-note').textContent=`${score.answered} di ${score.total} classificati`;
    const progress=document.getElementById('progress');progress.setAttribute('aria-valuenow',String(score.answered));progress.firstElementChild.style.width=`${score.answered/score.total*100}%`;
    const complete=document.getElementById('complete');complete.hidden=score.answered!==score.total;
    complete.textContent=score.correct===score.total?'Tutti al posto giusto! Hai trovato l’indizio importante.':'Hai osservato tutti i campioni! Puoi rivedere le risposte o scoprire la regola.';
  }
  sampleList.addEventListener('change',event=>{
    const input=event.target;if(!input.matches('input[data-index]')) return;
    const i=Number(input.dataset.index);answers[i]=input.value;
    const correct=input.value===samples[i].answer;
    const feedback=document.getElementById(`feedback-${i}`);
    feedback.className=`feedback ${correct?'correct':'review'}`;
    feedback.textContent=correct?(i%2?'✓ Ottimo: hai classificato il campione come farebbe il robot.':'✓ Bravo! Hai riconosciuto il segnale.'):(samples[i].trap?'↻ Quasi! Il colore vivace può ingannare: osserva soprattutto la forma.':['↻ Quasi! Forse il robot si è fatto distrarre dal colore.','↻ Guarda meglio la forma: c’è il segnale speciale?','↻ Ricorda: il robot deve trovare l’indizio importante.'][i%3]);
    updateScore();
  });
  document.getElementById('reveal').addEventListener('click',()=>{
    const rule=document.getElementById('rule');
    rule.innerHTML='<h3 tabindex="-1">Hai scoperto la regola del robot!</h3><p><strong>C’è almeno una gemma a cuore?</strong> Classe A — Segnale presente.</p><p><strong>Non c’è nessuna gemma a cuore?</strong> Classe B — Segnale non rilevato.</p><p>Il colore non decide la classe: è la forma a cuore l’indizio importante.</p>';
    rule.hidden=false;
    const button=document.getElementById('reveal');button.textContent='Regola rivelata!';button.setAttribute('aria-expanded','true');
    rule.querySelector('h3').focus({preventScroll:true});rule.scrollIntoView({block:'center'});
  });
  document.getElementById('restart').addEventListener('click',()=>{
    answers=Array(samples.length).fill('');renderSamples();updateScore();
    const rule=document.getElementById('rule');rule.hidden=true;rule.innerHTML='';
    const button=document.getElementById('reveal');button.textContent='Rivela la regola';button.setAttribute('aria-expanded','false');
    document.querySelector('.score-toolbar').scrollIntoView({block:'start'});
  });
  renderSamples();updateScore();
})();
