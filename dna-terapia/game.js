(() => {
  'use strict';
  const {baseExamples,extraExamples,missions,predictCell,cellWords}=GameLogic;
  const {cellSvg,cellCard,badge,escape,focusHeading}=GameUI;
  const game=document.getElementById('game');
  let state;
  const training=()=>state.extra?[...baseExamples,...extraExamples]:baseExamples;
  function renderTraining(){
    document.getElementById('training-count').textContent=`${training().length} esempi per il robot`;
    document.getElementById('training-groups').innerHTML=['A','B'].map(group=>`<section class="group-bin ${group==='B'?'group-b':''}" aria-label="Esempi del gruppo ${group}"><h3 class="group-label"><span class="letter">${group}</span>Gruppo ${group}</h3><p>Risposta controllata dai ricercatori</p><div class="example-grid">${training().filter(cell=>cell.label===group).map(cell=>cellCard(cell)).join('')}</div></section>`).join('');
  }
  function updateScore(){document.getElementById('cell-score').textContent=`${state.correct} / ${state.answered} corrette`;}
  function reset(scroll=true){state={index:0,guess:null,result:null,firstResult:null,extra:false,answered:0,correct:0};renderTraining();updateScore();render();if(scroll)focusHeading(game);}
  function outcome(title,answer,status,style){return `<section class="outcome ${style}"><h4>${title}</h4><strong>${answer==='?'?'Chiedo aiuto':`Gruppo ${answer}`}</strong><p>${status}</p></section>`;}
  function resultUI(cell){
    const result=state.result, expected=cell.answer;
    const userRight=state.guess===expected, robotRight=expected!=='?'&&result.prediction===expected;
    const userStatus=userRight?(expected==='?'?'✓ Hai fatto bene a chiedere aiuto':'✓ Corretta'):state.guess==='?'?'Hai chiesto aiuto: guardiamo insieme':expected==='?'?'? Da verificare con un ricercatore':'↻ Da rivedere';
    const robotStatus=expected==='?'?'? Da verificare':robotRight?'✓ Corretta':'✗ Sbagliata';
    const heading=expected==='?'?(userRight?'Ottima scelta: chiediamo aiuto!':'Una buona ipotesi! Qui serve l’aiuto di un ricercatore.'):userRight?(robotRight?(state.index===2&&state.extra?'Tu avevi indovinato! Ora anche il robot ha trovato il gruppo.':'Bravo, hai trovato il gruppo!'):'Tu hai indovinato! Il robot invece ha sbagliato.'):'Bel tentativo! Confrontiamo insieme gli indizi.';
    const answerCopy=expected==='?'?'Per questa cellula nuova manca ancora una risposta controllata. La teniamo da parte e chiediamo nuovi esempi.':`La carta dei ricercatori dice <strong>Gruppo ${expected}</strong>. Nel nostro gioco queste cellule hanno ${expected==='A'?'pochi':'tanti'} puntini.`;
    const neighbors=`<section class="result-section"><h3>Quali esempi ha usato il robot?</h3><p>Ha confrontato la cellula con ${training().length} esempi. Questi tre sono i più simili:</p><div class="neighbors">${result.nearest.map(cell=>cellCard(cell,true)).join('')}</div><p class="small-note" style="margin-top:14px">${result.agreement} esempi su 3 votano per il Gruppo ${result.prediction}. È un voto, non una garanzia!</p>${result.unfamiliar?'<p class="warning">Questi sono gli esempi più vicini, ma sono ancora abbastanza diversi dalla nuova cellula. La proposta del robot va controllata.</p>':''}${state.index===2&&state.extra?`<div class="comparison"><span>Prima:</span>${badge(state.firstResult.prediction)}<span aria-label="poi">→</span><span>Dopo:</span>${badge(result.prediction)}</div><p>Stessa cellula, nuovi esempi: il robot ha cambiato previsione!</p>`:''}</section>`;
    const teach=state.index===2&&!state.extra?`<section class="training-action"><h3>Aiutiamo il robot a cambiare idea</h3><p>Aggiungiamo sei esempi controllati: tre cellule piccole e tonde con tanti puntini, e tre grandi e allungate con pochi puntini.</p><details><summary>Guarda i 6 nuovi esempi prima di aggiungerli</summary><div class="example-grid">${extraExamples.map(cell=>cellCard(cell,true)).join('')}</div></details><div class="actions"><button type="button" class="button primary full-button" data-action="teach">Insegna al robot con 6 nuovi esempi</button></div></section>`:'';
    const next=state.index!==2||state.extra?`<div class="actions"><button type="button" class="button primary full-button" data-action="next">${state.index<missions.length-1?'Prossima cellula':'Vedi cosa hai imparato'} <span aria-hidden="true">→</span></button></div>`:'';
    return `<div id="result" role="status" aria-live="polite"><h3 class="answer-heading">${heading}</h3><div class="outcomes">${outcome('La tua risposta',state.guess,userStatus,userRight?'correct':expected==='?'||state.guess==='?'?'neutral':'review')}${outcome(state.index===2&&state.extra?'Il robot, dopo i nuovi esempi':'La risposta del robot',result.prediction,robotStatus,expected==='?'?'neutral':robotRight?'correct':'review')}</div><p>${answerCopy}</p>${expected!=='?'&&!robotRight?'<p>Il robot ha trovato cellule simili per grandezza e forma, ma con meno puntini. I suoi esempi erano poco vari: aiutiamolo con nuovi esempi.</p>':''}${state.index===3?'<p>I nuovi esempi aiutano anche qui: una cellula può essere grande e allungata, ma avere pochi puntini.</p>':''}</div>${neighbors}${teach}${next}`;
  }
  function render(){
    if(state.index>=missions.length){game.classList.add('summary-panel');game.innerHTML=`<div class="summary-star" aria-hidden="true">✦</div><h2>Missione compiuta, detective!</h2><strong class="score-number">${state.correct} / ${state.answered} corrette</strong><p>Hai visto il robot cambiare idea grazie a esempi più vari.</p><p><strong>Per imparare bene servono buoni esempi.</strong><br>Quando arriva qualcosa di diverso, chiedere aiuto è una buona scelta.</p><button class="button primary" data-action="restart" type="button">Gioca di nuovo</button>`;return;}
    game.classList.remove('summary-panel');
    const cell=missions[state.index], words=cellWords(cell);
    const caption=state.result?'Confronta qui sotto la tua risposta con quella del robot.':state.guess?'Hai scelto. Ora facciamo provare il robot!':'Osserva il disegno e scegli la tua risposta.';
    game.innerHTML=`<p class="section-number">Cellula ${state.index+1} di ${missions.length}</p><h2>${state.index===2?'Una piccola sorpresa':state.index===4?'Una cellula mai vista':'Ora prova tu'}</h2><div class="cell-layout"><figure class="cell-figure">${cellSvg(cell)}<figcaption>${caption}</figcaption></figure><ul class="clues">${words.map((word,i)=>`<li><span>${['Grandezza','Forma','Puntini'][i]}</span><strong>${escape(word)}</strong></li>`).join('')}</ul></div>${state.index===4?'<p class="small-note">Questa è media, ovale e ha 4 puntini. È diversa dagli esempi dei due gruppi.</p>':''}${state.result?resultUI(cell):`<p class="choice-title">Secondo te, dove va questa cellula?</p><div class="choice-grid" role="group" aria-label="La tua previsione">${[['A','Gruppo A'],['B','Gruppo B'],['?','Chiedo aiuto']].map(([answer,label])=>`<button type="button" class="choice-button" data-guess="${answer}" aria-pressed="${state.guess===answer}">${label}</button>`).join('')}</div><p class="small-note" id="choice-note" style="margin-top:14px">Scegli una risposta. Poi facciamo provare il robot!</p><div class="actions"><button type="button" class="button primary full-button" data-action="analyze" id="analyze" disabled>Confronta la mia risposta con l’AI</button></div>`}`;
  }
  game.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button||!game.contains(button))return;
    if(button.dataset.action==='restart'){reset();return;}
    if(state.index>=missions.length)return;
    if(button.dataset.guess&&!state.result){
      state.guess=button.dataset.guess;
      game.querySelectorAll('[data-guess]').forEach(item=>item.setAttribute('aria-pressed',String(item.dataset.guess===state.guess)));
      document.getElementById('analyze').disabled=false;
      document.getElementById('choice-note').textContent='Hai scelto. Ora facciamo provare il robot!';
      game.querySelector('figcaption').textContent='Hai scelto. Ora facciamo provare il robot!';
      return;
    }
    const cell=missions[state.index];
    if(button.dataset.action==='analyze'&&state.guess&&!state.result){
      state.result=predictCell({size:cell.size,shape:cell.shape,dots:cell.dots},training());state.firstResult=state.result;state.answered++;state.correct+=Number(state.guess===cell.answer);updateScore();render();
      const result=document.getElementById('result');const heading=result.querySelector('h3');heading.tabIndex=-1;heading.focus({preventScroll:true});result.scrollIntoView({block:'start'});
    }else if(button.dataset.action==='teach'&&state.index===2&&state.result&&!state.extra){
      state.extra=true;state.result=predictCell({size:cell.size,shape:cell.shape,dots:cell.dots},training());renderTraining();render();focusHeading(game);
    }else if(button.dataset.action==='next'&&state.result&&(state.index!==2||state.extra)){
      state.index++;state.guess=null;state.result=null;state.firstResult=null;render();focusHeading(game);
    }
  });
  document.getElementById('restart').addEventListener('click',()=>reset());
  reset(false);
})();
