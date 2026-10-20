import { chooseShogiBotMove, createShogiGame, legalShogiMoves, playShogiDrop, playShogiMove, selectShogiDrop, selectShogiPiece, shogiPieceSymbol, shogiSfen } from './logic.mjs';

const root=document.querySelector('[data-tool="shogi"]');
if(root){
  const form=root.querySelector('[data-pending-form]');const result=root.querySelector('[data-result]');const content=root.querySelector('[data-result-content]');const status=root.querySelector('[data-status]');
  const copy=JSON.parse(root.querySelector('[data-tool-copy]')?.textContent??'{}');const {fields:f,messages:m}=copy;
  const make=(tag,text,cls)=>{const el=document.createElement(tag);if(text!==undefined)el.textContent=String(text);if(cls)el.className=cls;return el;};
  let game=null;let botTimer=0;let focusCell=76;let promotion=null;
  function updateStatus(message){if(message){status.textContent=message;return;}if(game.winner){status.textContent=`${game.winner==='sente'?f.sente:f.gote} ${m.wins}`;return;}status.textContent=game.turn==='sente'?m.senteTurn:m.goteTurn;if(game.check)status.textContent+=` ${m.check}`;}
  function render(){
    if(!game)return;content.replaceChildren();
    const turn=make('p',`${f.turn}: ${game.turn==='sente'?f.sente:f.gote} · ${f.moves}: ${game.moves}`,'pending-shogi-turn');content.append(turn);
    const hand=make('div',undefined,'pending-shogi-hand');hand.setAttribute('role','group');hand.setAttribute('aria-label',`${game.turn==='sente'?f.sente:f.gote} ${f.hand}`);
    const counts=Object.fromEntries(['rook','bishop','gold','silver','knight','lance','pawn'].map((type)=>[type,game.hands[game.turn].filter((item)=>item===type).length]));
    for(const type of Object.keys(counts))if(counts[type]){const button=make('button',`${f.pieceNames[type]} ×${counts[type]}`,'button button--secondary pending-shogi-hand-piece');button.type='button';button.setAttribute('aria-pressed',String(game.selectedDrop===type));button.addEventListener('click',()=>{selectShogiDrop(game,type);promotion=null;updateStatus(m.dropSelected);render();});hand.append(button);}
    content.append(hand);
    const board=make('div',undefined,'pending-shogi-board');board.setAttribute('role','grid');board.setAttribute('aria-label',f.boardLabel);board.setAttribute('dir','ltr');const legalMoves=game.selected?legalShogiMoves(game).filter((move)=>move.from?.x===game.selected.x&&move.from?.y===game.selected.y):game.selectedDrop?legalShogiMoves(game).filter((move)=>move.drop===game.selectedDrop):[];
    for(let y=0;y<9;y+=1){const row=make('div',undefined,'pending-shogi-row');row.setAttribute('role','row');row.setAttribute('aria-rowindex',String(y+1));for(let x=0;x<9;x+=1){
      const p=game.board[y][x];const cell=make('div',undefined,'pending-shogi-cell-wrap');cell.setAttribute('role','gridcell');cell.setAttribute('aria-colindex',String(x+1));
      const button=make('button',shogiPieceSymbol(p),'button pending-shogi-square');button.type='button';button.dataset.cell=String(y*9+x);button.tabIndex=(y*9+x)===focusCell?0:-1;
      button.setAttribute('aria-label',`${f.row} ${y+1}, ${f.column} ${x+1}: ${p?`${p.side==='sente'?f.sente:f.gote} ${f.pieceNames[p.type]}${p.promoted?` ${f.promoted}`:''}`:f.empty}`);
      if(p){button.classList.add(p.side==='sente'?'is-sente':'is-gote');if(p.promoted)button.classList.add('is-promoted');}
      if(game.selected?.x===x&&game.selected?.y===y)button.classList.add('is-selected');
      const legal=legalMoves.some((move)=>move.to.x===x&&move.to.y===y);if(legal){button.classList.add('is-legal');button.setAttribute('aria-label',`${f.row} ${y+1}, ${f.column} ${x+1}: ${f.legalMove}`);}
      button.addEventListener('click',()=>activate(x,y));cell.append(button);row.append(cell);
    }board.append(row);}
    content.append(board);
    let promotionPanel=null;if(promotion){const prompt=make('div',undefined,'pending-shogi-promotion');prompt.setAttribute('role','group');prompt.setAttribute('aria-label',f.promotionQuestion);prompt.append(make('p',f.promotionQuestion));for(const [value,label]of[[true,f.promote],[false,f.keepUnpromoted]]){const button=make('button',label,'button button--secondary');button.type='button';button.addEventListener('click',()=>finishPromotion(value));prompt.append(button);}content.append(prompt);promotionPanel=prompt;}
    const legend=make('details',undefined,'pending-shogi-legend');const summary=make('summary',f.legend);legend.append(summary);const labels=make('p',Object.entries(f.pieceNames).map(([type,name])=>`${name}: ${shogiPieceSymbol({type})}`).join(' · '));legend.append(labels);content.append(legend);
    const notation=make('details',undefined,'pending-shogi-notation');notation.append(make('summary',f.positionNotation));const area=make('textarea');area.readOnly=true;area.rows=2;area.value=shogiSfen(game);area.setAttribute('aria-label',f.positionNotation);notation.append(area);
    const actions=make('div',undefined,'pending-shogi-actions');const download=make('button',f.downloadPosition,'button button--secondary');download.type='button';download.addEventListener('click',()=>downloadSfen());const copyButton=make('button',f.copyPosition,'button button--secondary');copyButton.type='button';copyButton.addEventListener('click',()=>copySfen(area.value));actions.append(download,copyButton);notation.append(actions);content.append(notation);
    if((yTurnIsComputer())&&!game.winner){content.append(make('p',m.botThinking,'hint'));scheduleBot();}
    if((yTurnIsLocal())&&!game.winner)updateStatus(m.passDevice);
    if(promotion)promotionPanel?.querySelector('button')?.focus({preventScroll:true});else board.querySelector(`[data-cell="${focusCell}"]`)?.focus({preventScroll:true});
  }
  function yTurnIsComputer(){return game?.opponent==='computer'&&game.turn==='gote';}
  function yTurnIsLocal(){return game?.opponent==='local'&&game.turn==='gote';}
  function activate(x,y){
    if(!game||game.winner||(game.opponent==='computer'&&game.turn!=='sente')||promotion)return;focusCell=y*9+x;
    if(game.selectedDrop){const outcome=playShogiDrop(game,game.selectedDrop,{x,y});if(!outcome.played)updateStatus(m.illegalDrop);else afterMove(outcome);render();return;}
    if(game.selected){const options=legalShogiMoves(game).filter((move)=>move.from.x===game.selected.x&&move.from.y===game.selected.y&&move.to.x===x&&move.to.y===y);if(options.length){const move=options[0];if(move.canPromote&&!move.mustPromote){promotion={from:move.from,to:move.to};updateStatus(m.promotionQuestion);render();return;}const outcome=playShogiMove(game,move.from,move.to,move.mustPromote);if(outcome.played)afterMove(outcome);else updateStatus(m.illegalMove);render();return;}}
    const moves=selectShogiPiece(game,x,y);if(moves.length){updateStatus(m.pieceSelected);render();}else{game.selected=null;game.selectedDrop=null;updateStatus(game.board[y][x]?.side===game.turn?m.noLegalMoves:m.selectPiece);render();}
  }
  function finishPromotion(promote){const move=promotion;promotion=null;const outcome=playShogiMove(game,move.from,move.to,promote);if(outcome.played)afterMove(outcome);else updateStatus(m.illegalMove);render();}
  function afterMove(outcome){updateStatus(outcome.winner?undefined:outcome.check?m.check:m.movePlayed);if(game.opponent==='computer'&&game.turn==='gote'&&!game.winner)scheduleBot();}
  function scheduleBot(){if(botTimer||!yTurnIsComputer()||game.winner)return;botTimer=window.setTimeout(()=>{botTimer=0;if(!yTurnIsComputer()||game.winner)return;const move=chooseShogiBotMove(game,'gote');if(!move)return;let outcome;if(move.drop){selectShogiDrop(game,move.drop);outcome=playShogiDrop(game,move.drop,move.to);}else{selectShogiPiece(game,move.from.x,move.from.y);outcome=playShogiMove(game,move.from,move.to,move.canPromote||move.mustPromote);}if(outcome?.played){focusCell=move.to.y*9+move.to.x;afterMove(outcome);}render();},450);}
  function downloadSfen(){const blob=new Blob([`${shogiSfen(game)}\n`],{type:'text/plain'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='usefulverse-shogi-position.sfen';link.click();window.setTimeout(()=>URL.revokeObjectURL(url),1000);updateStatus(m.downloaded);}
  async function copySfen(value){try{await navigator.clipboard.writeText(value);updateStatus(m.copied);}catch{updateStatus(m.copyUnavailable);}}
  form.addEventListener('submit',(event)=>{event.preventDefault();if(botTimer)window.clearTimeout(botTimer);botTimer=0;game=createShogiGame({opponent:form.elements.opponent.value});promotion=null;focusCell=76;result.hidden=false;updateStatus(m.started);render();});
  form.addEventListener('reset',()=>queueMicrotask(()=>{if(botTimer)window.clearTimeout(botTimer);botTimer=0;game=null;promotion=null;content.replaceChildren();result.hidden=true;status.textContent='';status.classList.remove('status--error');}));
}
