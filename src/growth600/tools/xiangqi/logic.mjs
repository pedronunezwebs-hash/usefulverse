export const XIANGQI_COLUMNS = 9;
export const XIANGQI_ROWS = 10;
const inside = (x,y) => x >= 0 && x < XIANGQI_COLUMNS && y >= 0 && y < XIANGQI_ROWS;
const piece = (color, kind) => ({ color, kind });
const other = (color) => color === 'red' ? 'black' : 'red';

export function createXiangqiGame() {
  const board = Array.from({ length: XIANGQI_ROWS }, () => Array(XIANGQI_COLUMNS).fill(null));
  const back = ['rook','horse','elephant','advisor','general','advisor','elephant','horse','rook'];
  for (let x = 0; x < XIANGQI_COLUMNS; x += 1) { board[0][x] = piece('black',back[x]); board[9][x] = piece('red',back[x]); }
  for (const x of [1,7]) { board[2][x] = piece('black','cannon'); board[7][x] = piece('red','cannon'); }
  for (const x of [0,2,4,6,8]) { board[3][x] = piece('black','soldier'); board[6][x] = piece('red','soldier'); }
  return { board, turn: 'red', selected: null, winner: null, reason: '', check: false, moves: 0 };
}

function addIfAvailable(board, color, moves, x, y) {
  if (!inside(x,y) || board[y][x]?.color === color) return;
  moves.push({ x, y });
}

export function pseudoXiangqiMoves(board, x, y) {
  const current = board[y]?.[x]; if (!current) return [];
  const { color, kind } = current; const moves = [];
  const add = (nx,ny) => addIfAvailable(board,color,moves,nx,ny);
  if (kind === 'general' || kind === 'advisor') {
    const steps = kind === 'general' ? [[1,0],[-1,0],[0,1],[0,-1]] : [[1,1],[1,-1],[-1,1],[-1,-1]];
    for (const [dx,dy] of steps) { const nx=x+dx, ny=y+dy; const inPalace = nx>=3 && nx<=5 && (color==='red' ? ny>=7&&ny<=9 : ny>=0&&ny<=2); if (inPalace) add(nx,ny); }
    if (kind === 'general') {
      const enemy = findGeneral(board,other(color));
      if (enemy && enemy.x === x && clearBetween(board,x,y,enemy.x,enemy.y)) moves.push(enemy);
    }
  } else if (kind === 'elephant') {
    for (const [dx,dy] of [[2,2],[2,-2],[-2,2],[-2,-2]]) {
      const nx=x+dx, ny=y+dy; const ownSide = color==='red' ? ny>=5 : ny<=4;
      if (inside(nx,ny) && ownSide && !board[y+dy/2][x+dx/2]) add(nx,ny);
    }
  } else if (kind === 'horse') {
    for (const [dx,dy,legX,legY] of [[2,1,1,0],[2,-1,1,0],[-2,1,-1,0],[-2,-1,-1,0],[1,2,0,1],[-1,2,0,1],[1,-2,0,-1],[-1,-2,0,-1]]) {
      if (!board[y+legY]?.[x+legX]) add(x+dx,y+dy);
    }
  } else if (kind === 'rook' || kind === 'cannon') {
    for (const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      let nx=x+dx, ny=y+dy, screen=false;
      while (inside(nx,ny)) {
        const occupant=board[ny][nx];
        if (kind==='rook') { if (!occupant) moves.push({x:nx,y:ny}); else { if (occupant.color!==color) moves.push({x:nx,y:ny}); break; } }
        else if (!screen) { if (!occupant) moves.push({x:nx,y:ny}); else screen=true; }
        else if (occupant) { if (occupant.color!==color) moves.push({x:nx,y:ny}); break; }
        nx+=dx; ny+=dy;
      }
    }
  } else if (kind === 'soldier') {
    const dy=color==='red' ? -1 : 1; add(x,y+dy);
    const crossed=color==='red' ? y<=4 : y>=5;
    if (crossed) { add(x-1,y); add(x+1,y); }
  }
  return moves;
}

function findGeneral(board,color) {
  for (let y=0;y<XIANGQI_ROWS;y+=1) for (let x=0;x<XIANGQI_COLUMNS;x+=1) if (board[y][x]?.color===color && board[y][x]?.kind==='general') return {x,y};
  return null;
}
function clearBetween(board,x1,y1,x2,y2) {
  if (x1!==x2 && y1!==y2) return false;
  const dx=Math.sign(x2-x1), dy=Math.sign(y2-y1); let x=x1+dx,y=y1+dy;
  while (x!==x2||y!==y2) { if (board[y][x]) return false; x+=dx; y+=dy; }
  return true;
}
function movePiece(board,from,to) { const next=board.map((row)=>row.slice()); next[to.y][to.x]=next[from.y][from.x]; next[from.y][from.x]=null; return next; }

export function isXiangqiInCheck(board,color) {
  const general=findGeneral(board,color); if (!general) return false;
  for (let y=0;y<XIANGQI_ROWS;y+=1) for (let x=0;x<XIANGQI_COLUMNS;x+=1) {
    if (board[y][x]?.color!==other(color)) continue;
    if (pseudoXiangqiMoves(board,x,y).some((move)=>move.x===general.x&&move.y===general.y)) return true;
  }
  return false;
}

export function legalXiangqiMoves(board,x,y) {
  const current=board[y]?.[x]; if (!current) return [];
  return pseudoXiangqiMoves(board,x,y).filter((to)=>!isXiangqiInCheck(movePiece(board,{x,y},to),current.color));
}

export function legalXiangqiMovesForTurn(board,color) {
  const result=[];
  for(let y=0;y<XIANGQI_ROWS;y+=1) for(let x=0;x<XIANGQI_COLUMNS;x+=1) if(board[y][x]?.color===color) {
    for(const to of legalXiangqiMoves(board,x,y)) result.push({from:{x,y},to});
  }
  return result;
}

export function selectXiangqiPiece(game,x,y) {
  if (game.winner || game.board[y]?.[x]?.color!==game.turn) { game.selected=null; return []; }
  game.selected={x,y}; return legalXiangqiMoves(game.board,x,y);
}

export function playXiangqiMove(game,from,to) {
  if (game.winner || !game.board[from.y]?.[from.x] || game.board[from.y][from.x].color!==game.turn) return { moved:false, reason:'turn' };
  if (!legalXiangqiMoves(game.board,from.x,from.y).some((move)=>move.x===to.x&&move.y===to.y)) return { moved:false, reason:'illegal' };
  const mover=game.turn; const captured=game.board[to.y][to.x]; game.board=movePiece(game.board,from,to); game.turn=other(mover); game.selected=null; game.moves+=1;
  if (captured?.kind==='general') { game.winner=mover; game.reason='general-captured'; return {moved:true,winner:mover}; }
  game.check=isXiangqiInCheck(game.board,game.turn);
  if (!legalXiangqiMovesForTurn(game.board,game.turn).length) { game.winner=mover; game.reason=game.check?'checkmate':'no-legal-moves'; return {moved:true,winner:mover,checkmate:game.check}; }
  return { moved:true, check:game.check };
}

export function xiangqiPieceSymbol(piece) {
  if (!piece) return '';
  const symbols = piece.color==='red'
    ? {general:'帥',advisor:'仕',elephant:'相',horse:'馬',rook:'車',cannon:'炮',soldier:'兵'}
    : {general:'將',advisor:'士',elephant:'象',horse:'馬',rook:'車',cannon:'砲',soldier:'卒'};
  return symbols[piece.kind] ?? '';
}
