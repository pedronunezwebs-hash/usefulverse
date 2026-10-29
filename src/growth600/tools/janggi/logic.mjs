export const JANGGI_COLUMNS = 9;
export const JANGGI_ROWS = 10;
const kinds = Object.freeze(['general','guard','chariot','cannon','horse','elephant','soldier']);
const value = Object.freeze({ chariot:13, cannon:7, horse:5, elephant:3, guard:3, soldier:2, general:0 });
const inside = (x,y) => x >= 0 && x < JANGGI_COLUMNS && y >= 0 && y < JANGGI_ROWS;
const other = (side) => side === 'cho' ? 'han' : 'cho';
const makePiece = (side,kind) => ({side,kind});

function inPalace(x,y,side) {
  return x >= 3 && x <= 5 && (side === 'cho' ? y >= 0 && y <= 2 : y >= 7 && y <= 9);
}

function isPalaceDiagonal(a,b,side) {
  if (!inPalace(a.x,a.y,side) || !inPalace(b.x,b.y,side)) return false;
  const centerY = side === 'cho' ? 1 : 8;
  const dx = b.x - a.x, dy = b.y - a.y;
  if (Math.abs(dx) !== Math.abs(dy) || dx === 0) return false;
  const slope = Math.sign(dx) === Math.sign(dy) ? 1 : -1;
  return Math.abs(a.x - 4) === Math.abs(a.y - centerY) && Math.abs(b.x - 4) === Math.abs(b.y - centerY)
    && (a.x - 4) * slope === (a.y - centerY);
}

export function createJanggiGame({ choSetup = 'horse-elephant', hanSetup = 'horse-elephant' } = {}) {
  const board = Array.from({length:JANGGI_ROWS},()=>Array(JANGGI_COLUMNS).fill(null));
  const placeSide = (side, setup) => {
    const backY = side === 'cho' ? 0 : 9, generalY = side === 'cho' ? 1 : 8;
    const [a,b] = setup === 'elephant-horse' ? ['elephant','horse'] : ['horse','elephant'];
    board[backY][0]=makePiece(side,'chariot'); board[backY][1]=makePiece(side,a);
    board[backY][2]=makePiece(side,b); board[backY][3]=makePiece(side,'guard');
    board[backY][5]=makePiece(side,'guard'); board[backY][6]=makePiece(side,b);
    board[backY][7]=makePiece(side,a); board[backY][8]=makePiece(side,'chariot');
    board[generalY][4]=makePiece(side,'general');
    const cannonY=side==='cho'?2:7, soldierY=side==='cho'?3:6;
    board[cannonY][1]=makePiece(side,'cannon'); board[cannonY][7]=makePiece(side,'cannon');
    for(const x of [0,2,4,6,8]) board[soldierY][x]=makePiece(side,'soldier');
  };
  placeSide('cho',choSetup); placeSide('han',hanSetup);
  return {board,turn:'cho',selected:null,winner:null,reason:'',moves:0,consecutivePasses:0,history:[]};
}

function addDestination(board,side,moves,x,y) {
  if (!inside(x,y) || board[y][x]?.side===side) return;
  moves.push({x,y});
}

function addRay(board,piece,x,y,moves,directions,{cannon=false}={}) {
  for(const [dx,dy] of directions){let nx=x+dx,ny=y+dy,screens=0;
    while(inside(nx,ny)){
      const from={x,y},to={x:nx,y:ny};
      if(dx!==0&&dy!==0&&!isPalaceDiagonal(from,to,piece.side)) break;
      const occupant=board[ny][nx];
      if(!cannon){if(!occupant)moves.push(to);else{if(occupant.side!==piece.side)moves.push(to);break;}}
      else if(!screens){if(occupant){if(occupant.kind==='cannon')break;screens=1;} }
      else if(occupant){if(occupant.side!==piece.side&&occupant.kind!=='cannon')moves.push(to);break;}
      else moves.push(to);
      nx+=dx;ny+=dy;
    }
  }
}

export function janggiMoves(board,x,y) {
  const piece=board[y]?.[x]; if(!piece)return [];
  const {side,kind}=piece, moves=[];
  const add=(nx,ny)=>addDestination(board,side,moves,nx,ny);
  if(kind==='general'||kind==='guard'){
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){
      const nx=x+dx,ny=y+dy;
      if(!inPalace(nx,ny,side))continue;
      if(dx!==0&&dy!==0&&!isPalaceDiagonal({x,y},{x:nx,y:ny},side))continue;
      add(nx,ny);
    }
  }else if(kind==='chariot'){
    addRay(board,piece,x,y,moves,[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]);
  }else if(kind==='cannon'){
    addRay(board,piece,x,y,moves,[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]],{cannon:true});
  }else if(kind==='horse'){
    for(const [lx,ly,dx,dy] of [[1,0,2,1],[1,0,2,-1],[-1,0,-2,1],[-1,0,-2,-1],[0,1,1,2],[0,1,-1,2],[0,-1,1,-2],[0,-1,-1,-2]]){
      if(!board[y+ly]?.[x+lx])add(x+dx,y+dy);
    }
  }else if(kind==='elephant'){
    for(const [sx,sy] of [[1,0],[-1,0],[0,1],[0,-1]]){
      const leg1={x:x+sx,y:y+sy},leg2={x:x+sx*2,y:y+sy*2},to={x:x+sx*3,y:y+sy*3};
      if(!board[leg1.y]?.[leg1.x]&&!board[leg2.y]?.[leg2.x])add(to.x,to.y);
    }
  }else if(kind==='soldier'){
    const forward=side==='cho'?1:-1;
    add(x,y+forward);add(x-1,y);add(x+1,y);
    const enemySide=other(side);
    for(const dx of [-1,1]){
      const nx=x+dx,ny=y+forward;
      if(inPalace(x,y,enemySide)&&inPalace(nx,ny,enemySide)&&isPalaceDiagonal({x,y},{x:nx,y:ny},enemySide))add(nx,ny);
    }
  }
  return moves;
}

export function janggiMovesForTurn(game,side=game.turn) {
  const moves=[];
  for(let y=0;y<JANGGI_ROWS;y++)for(let x=0;x<JANGGI_COLUMNS;x++)if(game.board[y][x]?.side===side)
    for(const to of janggiMoves(game.board,x,y))moves.push({from:{x,y},to});
  return moves;
}

export function selectJanggiPiece(game,x,y) {
  if(game.winner||game.board[y]?.[x]?.side!==game.turn){game.selected=null;return []}
  game.selected={x,y};return janggiMoves(game.board,x,y);
}

function scores(board) {
  const result={cho:0,han:1.5};
  for(const row of board)for(const piece of row)if(piece)result[piece.side]+=value[piece.kind]??0;
  return result;
}

function finishOnScore(game,reason) {
  const totals=scores(game.board);game.winner=totals.cho===totals.han?'draw':totals.cho>totals.han?'cho':'han';
  game.reason=reason;game.finalScores=totals;return {finished:true,winner:game.winner,scores:totals,reason};
}

export function playJanggiMove(game,from,to) {
  if(game.winner||!game.board[from?.y]?.[from?.x]||game.board[from.y][from.x].side!==game.turn)return {moved:false,reason:'turn'};
  if(!janggiMoves(game.board,from.x,from.y).some((move)=>move.x===to.x&&move.y===to.y))return {moved:false,reason:'illegal'};
  const mover=game.turn,captured=game.board[to.y][to.x];
  game.board[to.y][to.x]=game.board[from.y][from.x];game.board[from.y][from.x]=null;
  game.turn=other(mover);game.selected=null;game.moves++;game.consecutivePasses=0;
  if(captured?.kind==='general'){game.winner=mover;game.reason='general-captured';game.finalScores=scores(game.board);return {moved:true,winner:mover,reason:game.reason};}
  return {moved:true,captured:captured?.kind??null};
}

export function passJanggiTurn(game) {
  if(game.winner)return {passed:false,reason:'finished'};
  game.turn=other(game.turn);game.selected=null;game.consecutivePasses++;
  if(game.consecutivePasses>=2)return {passed:true,...finishOnScore(game,'consecutive-passes')};
  return {passed:true,winner:null};
}

export function janggiPieceSymbol(piece) {
  if(!piece)return '';
  const symbols=piece.side==='cho'?{general:'楚',guard:'士',chariot:'車',cannon:'包',horse:'馬',elephant:'象',soldier:'卒'}:{general:'漢',guard:'士',chariot:'車',cannon:'包',horse:'馬',elephant:'象',soldier:'兵'};
  return symbols[piece.kind]??'';
}
