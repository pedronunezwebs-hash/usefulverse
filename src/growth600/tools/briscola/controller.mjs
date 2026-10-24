import { chooseBriscolaBotCard, createBriscolaGame, playBriscolaCard } from './logic.mjs';

const root=document.querySelector('[data-tool="briscola"]');
if(root){
  const form=root.querySelector('[data-pending-form]');const result=root.querySelector('[data-result]');const content=root.querySelector('[data-result-content]');const status=root.querySelector('[data-status]');
  const copy=JSON.parse(root.querySelector('[data-tool-copy]')?.textContent??'{}');const {fields:f,messages:m}=copy;
  let game=null;let visiblePlayer='one';let cpuTimer=0;const glyph={coins:'🪙',cups:'🏆',swords:'⚔️',clubs:'♣️'};
  const make=(tag,text,cls)=>{const element=document.createElement(tag);if(text!==undefined)element.textContent=String(text);if(cls)element.className=cls;return element;};
  const playerName=(player)=>player==='one'?f.playerOne:f.playerTwo;
  function scheduleBot(){if(!game||game.winner||game.draw||game.opponent!=='computer'||game.turn!=='two'||cpuTimer)return;status.textContent=m.computerThinking;cpuTimer=window.setTimeout(()=>{cpuTimer=0;if(!game||game.winner||game.turn!=='two')return;const cardId=chooseBriscolaBotCard(game,'two');const outcome=playBriscolaCard(game,'two',cardId);visiblePlayer='one';if(outcome.complete)status.textContent=m.trickWon.replace('{player}',playerName(outcome.winner)).replace('{points}',String(outcome.roundPoints));else status.textContent=m.computerPlayed;if(outcome.gameOver)status.textContent=game.draw?m.draw:`${playerName(game.winner)} ${m.wins}`;render();},500);}
  function render(){
    if(!game)return;content.replaceChildren();
    const score=make('p',`${f.score}: ${playerName('one')} ${game.points.one} · ${playerName('two')} ${game.points.two} · ${f.cardsRemaining}: ${game.stock.length}`,'pending-briscola-score');content.append(score);
    const trump=make('p',`${f.trump}: ${glyph[game.trumpSuit]} ${f.suitNames[game.trumpSuit]}`,'pending-briscola-trump');content.append(trump);
    const trick=make('div',undefined,'pending-briscola-trick');trick.setAttribute('role','group');trick.setAttribute('aria-label',f.currentTrick);
    if(game.trick.length){for(const played of game.trick){const playedCard=make('div',`${playerName(played.player)}: ${played.card.rank} ${glyph[played.card.suit]}`,'pending-briscola-played');playedCard.setAttribute('aria-label',`${playerName(played.player)}: ${played.card.rank} ${f.suitNames[played.card.suit]}`);trick.append(playedCard);}}
    else trick.append(make('p',f.emptyTrick,'pending-briscola-empty'));
    content.append(trick);
    if(game.winner||game.draw){const label=game.draw?m.draw:`${playerName(game.winner)} ${m.wins}`;content.append(make('p',label,'pending-briscola-finished'));return;}
    const current=game.turn;
    if(game.opponent==='computer'&&current==='two'){content.append(make('p',m.computerThinking,'hint'));scheduleBot();return;}
    if(game.opponent==='computer')visiblePlayer='one';
    if(visiblePlayer!==current){const pass=make('p',`${f.passDevice} ${playerName(current)}.`,'hint');content.append(pass);const reveal=make('button',f.revealHand,'button button--secondary');reveal.type='button';reveal.addEventListener('click',()=>{visiblePlayer=game.turn;render();});content.append(reveal);return;}
    const hand=make('div',undefined,'pending-briscola-hand');hand.setAttribute('role','group');hand.setAttribute('aria-label',`${playerName(current)}: ${f.yourHand}`);
    for(const card of game.hands[current]){const button=make('button',`${card.rank} ${glyph[card.suit]}`,'button button--secondary pending-briscola-card');button.type='button';button.setAttribute('aria-label',`${card.rank} ${f.suitNames[card.suit]} · ${card.points} ${f.points}`);button.addEventListener('click',()=>{
      const outcome=playBriscolaCard(game,current,card.id);if(!outcome.played){status.textContent=m.invalid;return;}
      visiblePlayer=game.opponent==='computer'?'one':null;
      if(outcome.complete){const winner=playerName(outcome.winner);status.textContent=m.trickWon.replace('{player}',winner).replace('{points}',String(outcome.roundPoints));}
      else status.textContent=m.cardPlayed;
      if(outcome.gameOver)status.textContent=game.draw?m.draw:`${playerName(game.winner)} ${m.wins}`;
      render();
    });hand.append(button);}
    content.append(hand);
  }
  form.addEventListener('submit',(event)=>{event.preventDefault();if(cpuTimer)window.clearTimeout(cpuTimer);cpuTimer=0;game=createBriscolaGame({opponent:form.elements.opponent.value});visiblePlayer='one';status.textContent=m.started;result.hidden=false;render();});
  form.addEventListener('reset',()=>queueMicrotask(()=>{if(cpuTimer)window.clearTimeout(cpuTimer);cpuTimer=0;game=null;content.replaceChildren();result.hidden=true;status.textContent='';status.classList.remove('status--error');}));
}
