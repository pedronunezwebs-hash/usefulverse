import { createXiangqiGame, legalXiangqiMoves, playXiangqiMove, selectXiangqiPiece, xiangqiPieceSymbol } from './logic.mjs';

const root=document.querySelector('[data-tool="xiangqi"]');
if(root){
  const form=root.querySelector('[data-pending-form]'); const result=root.querySelector('[data-result]'); const content=root.querySelector('[data-result-content]'); const status=root.querySelector('[data-status]');
  const copy=JSON.parse(root.querySelector('[data-tool-copy]')?.textContent??'{}'); const {fields:f,messages:m}=copy;
  let game=null; let focusIndex=81; let legal=[];
  const make=(tag,text,cls)=>{const el=document.createElement(tag);if(text!==undefined)el.textContent=String(text);if(cls)el.className=cls;return el;};
  const at=(x,y)=>y*9+x;
  function updateStatus() {
    if(game.winner){status.textContent=(game.winner==='red'?m.redWins:m.blackWins)+(game.reason==='checkmate'?` ${m.checkmate}`:game.reason==='no-legal-moves'?` ${m.noLegalMoves}`:'');return;}
    status.textContent=game.turn==='red'?m.redTurn:m.blackTurn;
    if(game.check)status.textContent+=` ${m.inCheck}`;
  }
  function renderBoard(returnFocus=true){
    const board=content.querySelector('[data-xiangqi-board]'); if(!board||!game)return;
    board.replaceChildren(); const selected=game.selected; legal=selected?legalXiangqiMoves(game.board,selected.x,selected.y):[];
    for(let y=0;y<10;y+=1){const row=make('div',undefined,'pending-xiangqi-row');row.setAttribute('role','row');row.setAttribute('aria-rowindex',String(y+1));for(let x=0;x<9;x+=1){
      const index=at(x,y);const p=game.board[y][x];const cell=make('div',undefined,'pending-xiangqi-gridcell');cell.setAttribute('role','gridcell');cell.setAttribute('aria-colindex',String(x+1));const button=make('button',xiangqiPieceSymbol(p),'button pending-xiangqi-cell');button.type='button';button.dataset.cell=String(index);button.tabIndex=index===focusIndex?0:-1;
      const pieceName=p?f.pieceNames[p.kind]:f.empty;button.setAttribute('aria-label',`${f.row} ${y+1}, ${f.column} ${x+1}: ${p?(p.color==='red'?f.red:f.black)+' '+pieceName:pieceName}`);
      if(p)button.classList.add(p.color==='red'?'is-red':'is-black');
      if(selected?.x===x&&selected?.y===y)button.classList.add('is-selected');
      if(legal.some((move)=>move.x===x&&move.y===y)){button.classList.add('is-legal');button.setAttribute('aria-label',`${f.row} ${y+1}, ${f.column} ${x+1}: ${f.legalDestination}`);}
      button.addEventListener('click',()=>activate(x,y));cell.append(button);row.append(cell);
    }board.append(row);}
    if(returnFocus)board.querySelector(`[data-cell="${focusIndex}"]`)?.focus({preventScroll:true});
  }
  function activate(x,y){
    if(!game||game.winner)return;focusIndex=at(x,y);
    if(game.selected&&legal.some((move)=>move.x===x&&move.y===y)){
      const outcome=playXiangqiMove(game,game.selected,{x,y});
      if(!outcome.moved)status.textContent=m.illegal;else updateStatus();
    }else if(game.board[y][x]?.color===game.turn){
      const moves=selectXiangqiPiece(game,x,y);status.textContent=m.selected;
      if(!moves.length)status.textContent+=` ${m.noDestinations}`;
    }else{game.selected=null;status.textContent=m.chooseOwn;}
    renderBoard();
  }
  function boardKey(event){
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;
    event.preventDefault();const x=focusIndex%9,y=Math.floor(focusIndex/9);
    const nx=Math.max(0,Math.min(8,x+(event.key==='ArrowLeft'?-1:event.key==='ArrowRight'?1:0)));
    const ny=Math.max(0,Math.min(9,y+(event.key==='ArrowUp'?-1:event.key==='ArrowDown'?1:0)));
    focusIndex=at(nx,ny);renderBoard();
  }
  function start(){
    game=createXiangqiGame();focusIndex=at(4,9);content.replaceChildren();
    const help=make('p',f.instructions,'hint');content.append(help);
    const legend=make('div',undefined,'pending-xiangqi-legend');
    for(const kind of ['general','advisor','elephant','horse','rook','cannon','soldier']){const entry=make('span',`${f.pieceNames[kind]}: ${xiangqiPieceSymbol({color:'red',kind})}/${xiangqiPieceSymbol({color:'black',kind})}`);legend.append(entry);}
    content.append(legend);const river=make('p',f.river,'pending-xiangqi-river');content.append(river);
    const board=make('div',undefined,'pending-xiangqi-board');board.dataset.xiangqiBoard='true';board.setAttribute('role','grid');board.setAttribute('aria-label',f.boardLabel);board.setAttribute('dir','ltr');board.addEventListener('keydown',boardKey);content.append(board);
    result.hidden=false;updateStatus();renderBoard();
  }
  form.addEventListener('submit',(event)=>{event.preventDefault();start();});
  form.addEventListener('reset',()=>queueMicrotask(()=>{game=null;legal=[];content.replaceChildren();result.hidden=true;status.textContent='';status.classList.remove('status--error');}));
}
