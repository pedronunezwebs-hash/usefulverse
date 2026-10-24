import { chooseLoaComputerMove, createLoaGame, legalLoaMoves, passLoaTurn, playLoaMove } from './logic.mjs';

const root=document.querySelector('[data-tool="lines-of-action"]');
if(root){
  const form=root.querySelector('[data-pending-form]'),result=root.querySelector('[data-result]'),content=root.querySelector('[data-result-content]'),status=root.querySelector('[data-status]'),copy=JSON.parse(root.querySelector('[data-tool-copy]')?.textContent??'{}'),f=copy.fields;
  const node=(tag,text,cls)=>{const el=document.createElement(tag);if(text!==undefined)el.textContent=String(text);if(cls)el.className=cls;return el;};
  let game=null,selected=-1,targets=new Set();
  const sideName=(side)=>side===1?f.black:f.white;
  function say(text,error=false){status.textContent=text;status.classList.toggle('status--error',error);}
  function render(){
    content.replaceChildren(); if(!game)return;
    const header=node('p',`${f.turn}: ${sideName(game.turn)} · ${f.moveCount}: ${game.history.length+1}`); content.append(header);
    const table=node('table',undefined,'pending-loa-board');table.setAttribute('aria-label',f.boardLabel);const body=node('tbody');
    for(let r=0;r<8;r++){const row=node('tr');for(let c=0;c<8;c++){const index=r*8+c,cell=node('td'),button=node('button',undefined,`pending-loa-square${(r+c)%2?' pending-loa-square--dark':''}`);button.type='button';button.dataset.square=String(index);const piece=game.board[index];button.setAttribute('aria-label',`${String.fromCharCode(65+c)}${8-r}${piece?`: ${sideName(piece)}`:''}${index===selected?`, ${f.selected}`:''}${targets.has(index)?`, ${f.legalDestination}`:''}`);button.setAttribute('aria-pressed',String(index===selected));button.disabled=game.finished||(game.mode==='computer'&&game.turn===2);if(targets.has(index))button.classList.add('is-legal');if(index===selected)button.classList.add('is-selected');if(piece)button.append(node('span', '●',`pending-loa-piece pending-loa-piece--${piece===1?'black':'white'}`));cell.append(button);row.append(cell);}body.append(row);}table.append(body);content.append(table);
    content.append(node('p',f.moveHint,'hint'));
    const rules=node('a',f.rulesSource);rules.href='https://icga.org/icga/games/Loa/';rules.target='_blank';rules.rel='noopener noreferrer';content.append(rules);
    if(game.history.length){const details=node('details'),summary=node('summary',`${f.moveCount} history (${game.history.length})`),list=node('ol');for(const move of game.history.slice(-20)){const text=move.pass?`${sideName(move.side)} — ${f.pass}`:`${sideName(move.side)}: ${String.fromCharCode(65+move.from%8)}${8-Math.floor(move.from/8)} → ${String.fromCharCode(65+move.to%8)}${8-Math.floor(move.to/8)}${move.captured?` · ${f.captured}`:''}`;list.append(node('li',text));}details.append(summary,list);content.append(details);}
    result.hidden=false;
  }
  function finishMessage(){if(game.drawReason==='simultaneous')say(f.simultaneousDrawResult);else if(game.drawReason==='repetition')say(f.repetitionDraw);else if(game.winner)say(game.mode==='computer'?(game.winner===1?f.youWon:f.computerWon):(game.winner===1?f.blackWon:f.whiteWon));}
  function passIfNeeded(){let count=0;while(!game.finished&&!legalLoaMoves(game.board,game.turn).length&&count<4){game=passLoaTurn(game);count++;}if(count)say(f.pass);}
  function scheduleComputer(){if(!game||game.finished||game.mode!=='computer'||game.turn!==2)return;const expected=game;say(f.computerThinking);setTimeout(()=>{if(game!==expected||game.finished||game.turn!==2)return;try{const move=chooseLoaComputerMove(game);game=move?playLoaMove(game,move.from,move.to):passLoaTurn(game);passIfNeeded();selected=-1;targets.clear();render();if(game.finished)finishMessage();}catch{say(copy.messages.illegal,true);}},180);}
  form.addEventListener('submit',(event)=>{event.preventDefault();try{game=createLoaGame({mode:form.elements.namedItem('mode').value,simultaneous:form.elements.namedItem('simultaneous').value});selected=-1;targets.clear();result.hidden=false;passIfNeeded();render();say(copy.messages.started);scheduleComputer();}catch{say(copy.messages.invalid,true);}});
  content.addEventListener('click',(event)=>{const button=event.target.closest('[data-square]');if(!button||!game||game.finished||(game.mode==='computer'&&game.turn===2))return;const index=Number(button.dataset.square);if(targets.has(index)){try{game=playLoaMove(game,selected,index);selected=-1;targets.clear();passIfNeeded();render();if(game.finished)finishMessage();else scheduleComputer();}catch{say(copy.messages.illegal,true);}return;}if(game.board[index]===game.turn){selected=index;targets=new Set(legalLoaMoves(game.board,game.turn).filter((move)=>move.from===index).map((move)=>move.to));render();say(f.moveHint);}else if(selected!==-1){selected=-1;targets.clear();render();say(copy.messages.illegal,true);}});
  form.addEventListener('reset',()=>queueMicrotask(()=>{game=null;selected=-1;targets.clear();content.replaceChildren();result.hidden=true;say('');}));
}
