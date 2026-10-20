import { availableTuteSings, chooseTuteBotCard, chooseTuteBotSinging, createTuteGame, declareTute, declareTuteFour, legalTuteCards, playTuteCard, skipTuteSinging } from './logic.mjs';

const root=document.querySelector('[data-tool="tute"]');
if(root){
  const copy=JSON.parse(root.querySelector('[data-tool-copy]')?.textContent??'{}');
  const modeSelect=root.querySelector('[data-mode]'),allowTute=root.querySelector('[data-allow-tute]'),start=root.querySelector('[data-start]');
  const score=root.querySelector('[data-score]'),trump=root.querySelector('[data-trump]'),opponents=root.querySelector('[data-opponents]'),trick=root.querySelector('[data-trick]'),hand=root.querySelector('[data-hand]');
  const singing=root.querySelector('[data-singing]'),singingActions=root.querySelector('[data-singing-actions]'),status=root.querySelector('[data-status]');
  let game=null;
  const glyph={coins:'●',cups:'♥',swords:'⚔',clubs:'♣'};
  const playerName=(player)=>copy.fields[`player${player}`]??`${copy.fields.player} ${player+1}`;
  const labelCard=(card)=>`${copy.fields[`rank${card.rank}`]} ${copy.fields.suits[card.suit]}`;
  const node=(tag,text,className)=>{const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(className)el.className=className;return el;};
  const announce=(text,error=false)=>{status.textContent=text;status.classList.toggle('status--error',error);};
  const render=()=>{
    score.replaceChildren();opponents.replaceChildren();trick.replaceChildren();hand.replaceChildren();singingActions.replaceChildren();
    singing.hidden=!game||game.phase!=='singing'||game.currentPlayer!==0;
    if(!game){trump.textContent='';return;}
    const teamScores=game.mode==='pairs'?[game.trickPoints[0]+game.trickPoints[2]+game.declarationPoints[0]+game.declarationPoints[2],game.trickPoints[1]+game.trickPoints[3]+game.declarationPoints[1]+game.declarationPoints[3]]:game.trickPoints.map((points,player)=>points+game.declarationPoints[player]);
    const labels=game.mode==='pairs'?[copy.fields.teamOne,copy.fields.teamTwo]:[playerName(0),playerName(1)];
    teamScores.forEach((points,index)=>score.append(node('li',`${labels[index]}: ${points}`)));
    trump.textContent=`${copy.fields.trump}: ${glyph[game.trumpSuit]} ${copy.fields.suits[game.trumpSuit]} · ${labelCard(game.trumpCard)} · ${copy.fields.stock}: ${game.stock.length}`;
    for(let player=1;player<game.hands.length;player+=1)opponents.append(node('li',`${playerName(player)} · ${game.hands[player].length} ${copy.fields.cards}`));
    for(const played of game.trick){const item=node('li',`${playerName(played.player)}: ${glyph[played.card.suit]} ${labelCard(played.card)}`);item.setAttribute('aria-label',`${playerName(played.player)}: ${labelCard(played.card)}`);trick.append(item);}
    const legal=new Set(legalTuteCards(game,0).map((card)=>card.id));
    for(const card of game.hands[0]){
      const button=node('button',`${glyph[card.suit]} ${copy.fields[`rank${card.rank}`]}`,'button button--secondary tute-card');
      button.type='button';button.dataset.cardId=card.id;button.disabled=game.phase!=='playing'||game.currentPlayer!==0||!legal.has(card.id);button.setAttribute('aria-label',`${labelCard(card)} · ${card.points} ${copy.fields.points}`);
      hand.append(button);
    }
    if(game.phase==='singing'&&game.currentPlayer===0){
      for(const option of availableTuteSings(game,0)){
        const button=node('button',`${copy.actions.sing} ${option.value}${option.value===20?` · ${copy.fields.suits[option.suit]}`:''}`,'button button--primary');
        button.type='button';button.addEventListener('click',()=>{try{game=declareTute(game,0,option.suit);announce(copy.messages.sung);render();runBots();}catch{announce(copy.messages.invalidSing,true);}});singingActions.append(button);
      }
      if(game.allowTute)for(const kind of ['kings','horses']){
        const rank=kind==='kings'?12:11;
        if(game.hands[0].filter((card)=>card.rank===rank).length===4){const button=node('button',`${copy.actions.singTute} ${copy.fields[kind]}`,'button button--primary');button.type='button';button.addEventListener('click',()=>{try{game=declareTuteFour(game,0,kind);announce(copy.messages.tuteWon);render();}catch{announce(copy.messages.invalidSing,true);}});singingActions.append(button);}
      }
      const skip=node('button',copy.actions.skipSinging,'button button--secondary');skip.type='button';skip.addEventListener('click',()=>{game=skipTuteSinging(game,0);announce(copy.messages.continuePlay);render();runBots();});singingActions.append(skip);
    }
    if(game.phase==='complete'){
      const userWon=game.winner.includes(0)||(game.mode==='pairs'&&game.winner.includes(2));
      announce(game.tute?copy.messages.tuteWon:userWon?copy.messages.userWon:copy.messages.userLost);
    }
  };
  const runBots=()=>{
    let guard=0;
    while(game&&game.phase!=='complete'&&game.currentPlayer!==0&&guard++<100){
      if(game.phase==='singing')game=chooseTuteBotSinging(game,game.currentPlayer);
      else{const card=chooseTuteBotCard(game);if(!card)break;game=playTuteCard(game,game.currentPlayer,card.id);}
    }
    render();
    if(game?.phase==='playing'&&game.currentPlayer===0)announce(copy.messages.yourTurn);
    else if(game?.phase==='singing'&&game.currentPlayer===0)announce(copy.messages.youMaySing);
  };
  start.addEventListener('click',()=>{try{game=createTuteGame({mode:modeSelect.value,allowTute:allowTute.checked});render();runBots();}catch{announce(copy.messages.startError,true);}});
  hand.addEventListener('click',(event)=>{const button=event.target.closest('button[data-card-id]');if(!button||!game||game.phase!=='playing'||game.currentPlayer!==0)return;try{game=playTuteCard(game,0,button.dataset.cardId);render();runBots();}catch{announce(copy.messages.illegalCard,true);}});
  render();
}
