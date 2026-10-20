import {createJanggiGame,janggiMoves,playJanggiMove,selectJanggiPiece,passJanggiTurn,janggiPieceSymbol} from './logic.mjs';

export function mountJanggiTool(root,copy) {
  const form=root.querySelector('[data-pending-form]'),result=root.querySelector('[data-result]'),content=root.querySelector('[data-result-content]'),status=root.querySelector('[data-status]');
  if(!form||!result||!content||!status)return;
  let game=null,focusIndex=4,legal=[];
  const f=copy.fields,m=copy.messages;
  const node=(tag,text,className)=>{const el=document.createElement(tag);if(text!==undefined)el.textContent=String(text);if(className)el.className=className;return el;};
  const at=(x,y)=>y*9+x;
  const describe=(x,y,p)=>`${f.row} ${y+1}, ${f.column} ${x+1}: ${p?`${p.side==='cho'?f.cho:f.han} ${f.pieceNames[p.kind]}`:f.empty}`;
  function statusText(){
    if(game.winner==='draw')return f.draw;
    if(game.winner)return `${game.winner==='cho'?f.choWins:f.hanWins} ${game.reason==='general-captured'?f.generalCaptured:f.pointsDecision} (${f.cho}: ${formatScore(game.finalScores.cho)} · ${f.han}: ${formatScore(game.finalScores.han)})`;
    return game.turn==='cho'?f.choTurn:f.hanTurn;
  }
  function formatScore(score){return new Intl.NumberFormat(document.documentElement.lang||'en',{maximumFractionDigits:1}).format(score);}
  function renderBoard(returnFocus=true){
    const board=content.querySelector('[data-janggi-board]');if(!board||!game)return;
    board.replaceChildren();legal=game.selected?janggiMoves(game.board,game.selected.x,game.selected.y):[];
    const lines=document.createElementNS('http://www.w3.org/2000/svg','svg');lines.setAttribute('viewBox','0 0 9 10');lines.setAttribute('preserveAspectRatio','none');lines.setAttribute('aria-hidden','true');lines.classList.add('janggi-board__palaces');
    for(const pathData of ['M3.5 .5L5.5 2.5','M5.5 .5L3.5 2.5','M3.5 7.5L5.5 9.5','M5.5 7.5L3.5 9.5']){const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',pathData);lines.append(path);}board.append(lines);
    for(let y=0;y<10;y++){
      const row=node('div',undefined,'janggi-board__row');row.setAttribute('role','row');row.setAttribute('aria-rowindex',String(y+1));
      for(let x=0;x<9;x++){
        const index=at(x,y),piece=game.board[y][x],cell=node('div',undefined,'janggi-board__cell');cell.setAttribute('role','gridcell');cell.setAttribute('aria-colindex',String(x+1));
        const button=node('button',janggiPieceSymbol(piece),'janggi-board__point');button.type='button';button.dataset.point=String(index);button.tabIndex=index===focusIndex?0:-1;button.setAttribute('aria-label',describe(x,y,piece));
        if(piece)button.classList.add(piece.side==='cho'?'is-cho':'is-han');
        if(game.selected?.x===x&&game.selected?.y===y)button.classList.add('is-selected');
        if(legal.some((move)=>move.x===x&&move.y===y)){button.classList.add('is-legal');button.setAttribute('aria-label',`${f.row} ${y+1}, ${f.column} ${x+1}: ${f.legalDestination}`);}
        button.addEventListener('click',()=>activate(x,y));cell.append(button);row.append(cell);
      }
      board.append(row);
    }
    if(returnFocus)board.querySelector(`[data-point="${focusIndex}"]`)?.focus({preventScroll:true});
  }
  function update(message){
    status.textContent=message??statusText();
    const points=game.finalScores??(()=>{const totals={cho:0,han:1.5};for(const row of game.board)for(const p of row)if(p)totals[p.side]+={chariot:13,cannon:7,horse:5,elephant:3,guard:3,soldier:2,general:0}[p.kind];return totals;})();
    content.querySelector('[data-janggi-score]')?.replaceChildren(node('span',`${f.cho}: ${formatScore(points.cho)} · ${f.han}: ${formatScore(points.han)}`));
    const pass=content.querySelector('[data-janggi-pass]');if(pass)pass.disabled=Boolean(game.winner);
  }
  function activate(x,y){
    if(!game||game.winner)return;focusIndex=at(x,y);
    let message;
    if(game.selected&&legal.some((move)=>move.x===x&&move.y===y)){
      const outcome=playJanggiMove(game,game.selected,{x,y});if(!outcome.moved)message=m.illegal;
    }else if(game.board[y][x]?.side===game.turn){selectJanggiPiece(game,x,y);message=f.selected;}
    else {game.selected=null;message=f.chooseOwn;}
    renderBoard();update(message);
  }
  function onKey(event){
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;
    event.preventDefault();const x=focusIndex%9,y=Math.floor(focusIndex/9);
    focusIndex=at(Math.max(0,Math.min(8,x+(event.key==='ArrowLeft'?-1:event.key==='ArrowRight'?1:0))),Math.max(0,Math.min(9,y+(event.key==='ArrowUp'?-1:event.key==='ArrowDown'?1:0))));renderBoard();
  }
  function start(event){
    event?.preventDefault();game=createJanggiGame({choSetup:form.elements.namedItem('choSetup').value,hanSetup:form.elements.namedItem('hanSetup').value});focusIndex=at(4,1);content.replaceChildren();
    const instructions=node('p',f.instructions,'hint');content.append(instructions);
    const legend=node('div',undefined,'janggi-legend');legend.setAttribute('role','list');legend.setAttribute('aria-label',f.legend);
    for(const kind of ['general','guard','chariot','cannon','horse','elephant','soldier']){const entry=node('span',`${f.pieceNames[kind]} · ${janggiPieceSymbol({side:'cho',kind})}/${janggiPieceSymbol({side:'han',kind})}`,'janggi-legend__item');entry.setAttribute('role','listitem');legend.append(entry);}
    content.append(legend);
    const score=node('p',undefined,'janggi-score');score.append(node('strong',f.scores),document.createTextNode(' '),node('span',''),' ');score.querySelector('span').dataset.janggiScore='true';content.append(score);
    const pass=node('button',copy.actions.pass,'button button--secondary janggi-pass');pass.type='button';pass.dataset.janggiPass='true';pass.addEventListener('click',()=>{passJanggiTurn(game);focusIndex=at(4,game.turn==='cho'?1:8);renderBoard();update(game.winner?undefined:m.passed);});content.append(pass);
    const board=node('div',undefined,'janggi-board');board.dataset.janggiBoard='true';board.setAttribute('role','grid');board.setAttribute('aria-label',f.boardLabel);board.setAttribute('dir','ltr');board.addEventListener('keydown',onKey);content.append(board);
    result.hidden=false;renderBoard();update();
  }
  form.addEventListener('submit',start);
  form.addEventListener('reset',()=>queueMicrotask(()=>{game=null;legal=[];content.replaceChildren();result.hidden=true;status.textContent='';}));
}

const janggiRoot=document.querySelector('[data-tool="janggi"]');
if(janggiRoot){
  const copy=JSON.parse(janggiRoot.querySelector('[data-tool-copy]')?.textContent??'{}');
  mountJanggiTool(janggiRoot,copy);
}
