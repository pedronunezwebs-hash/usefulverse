const SIZE = 8;
const DIRECTIONS = Object.freeze([-1, 0, 1].flatMap((dr) => [-1, 0, 1].filter((dc) => dr || dc).map((dc) => Object.freeze([dr, dc]))));
const inside = (r, c) => r >= 0 && r < SIZE && c >= 0 && c < SIZE;
const at = (r, c) => r * SIZE + c;

export function createLoaGame({ mode = 'computer', simultaneous = 'draw' } = {}) {
  if (!['computer', 'two-players'].includes(mode) || !['draw', 'mover-wins'].includes(simultaneous)) throw new RangeError('Choose a supported game mode and connection rule.');
  const board = Array(64).fill(0);
  for (let c = 1; c <= 6; c++) { board[at(0,c)] = 1; board[at(7,c)] = 1; }
  for (let r = 1; r <= 6; r++) { board[at(r,0)] = 2; board[at(r,7)] = 2; }
  const game = { board: Object.freeze(board), turn: 1, mode, simultaneous, finished: false, winner: 0, drawReason: '', history: Object.freeze([]), repetitions: Object.freeze({}) };
  return recordPosition(game);
}

function linePieceCount(board, r, c, dr, dc) {
  let count = 0;
  for (let nr = r, nc = c; inside(nr, nc); nr += dr, nc += dc) if (board[at(nr, nc)]) count++;
  for (let nr = r - dr, nc = c - dc; inside(nr, nc); nr -= dr, nc -= dc) if (board[at(nr, nc)]) count++;
  return count;
}

export function legalLoaMoves(boardInput, side) {
  const board = Array.isArray(boardInput) ? boardInput : boardInput?.board;
  if (!Array.isArray(board) || board.length !== 64 || ![1,2].includes(side)) throw new RangeError('Invalid Lines of Action board or side.');
  const moves = [];
  for (let from = 0; from < 64; from++) if (board[from] === side) {
    const r = Math.floor(from / SIZE), c = from % SIZE;
    for (const [dr,dc] of DIRECTIONS) {
      const distance = linePieceCount(board, r, c, dr, dc);
      const toR = r + dr * distance, toC = c + dc * distance;
      if (!inside(toR,toC)) continue;
      let blocked = false;
      for (let step = 1; step < distance; step++) if (board[at(r + dr * step,c + dc * step)] === 3 - side) { blocked = true; break; }
      const to = at(toR,toC);
      if (!blocked && board[to] !== side) moves.push(Object.freeze({ from, to, captured: board[to] === 3 - side }));
    }
  }
  return Object.freeze(moves);
}

export function loaIsConnected(boardInput, side) {
  const board = Array.isArray(boardInput) ? boardInput : boardInput?.board;
  const pieces = [];
  for (let i=0;i<64;i++) if (board?.[i] === side) pieces.push(i);
  if (pieces.length < 2) return pieces.length === 1;
  const seen = new Set([pieces[0]]); const stack = [pieces[0]];
  while (stack.length) {
    const current = stack.pop(); const r = Math.floor(current / SIZE), c = current % SIZE;
    for (const [dr,dc] of DIRECTIONS) { const nr=r+dr,nc=c+dc,next=at(nr,nc); if(inside(nr,nc)&&board[next]===side&&!seen.has(next)){seen.add(next);stack.push(next);} }
  }
  return seen.size === pieces.length;
}

function positionKey(game) { return `${game.board.join('')}:${game.turn}`; }
function recordPosition(game) { const key=positionKey(game); return Object.freeze({...game,repetitions:Object.freeze({...game.repetitions,[key]:(game.repetitions[key]??0)+1})}); }

export function playLoaMove(game, from, to) {
  if (!game || game.finished) throw new RangeError('Start a new game before moving.');
  if (!Number.isInteger(from) || !Number.isInteger(to) || !legalLoaMoves(game.board,game.turn).some((move)=>move.from===from&&move.to===to)) throw new RangeError('That move is not legal. Select a highlighted destination.');
  const board=[...game.board]; board[to]=board[from]; board[from]=0;
  const mover=game.turn, other=3-mover; let winner=0, drawReason='';
  const moverConnected=loaIsConnected(board,mover), otherConnected=loaIsConnected(board,other);
  if(moverConnected&&otherConnected){if(game.simultaneous==='draw')drawReason='simultaneous';else winner=mover;}
  else if(moverConnected)winner=mover; else if(otherConnected)winner=other;
  const next={...game,board:Object.freeze(board),turn:other,finished:Boolean(winner||drawReason),winner,drawReason,history:Object.freeze([...game.history,Object.freeze({from,to,captured:game.board[to]===other,side:mover})].slice(-200))};
  const recorded=recordPosition(next);
  if(!recorded.finished&&(recorded.repetitions[positionKey(recorded)]??0)>=3)return Object.freeze({...recorded,finished:true,drawReason:'repetition'});
  return recorded;
}

export function passLoaTurn(game) {
  if (!game || game.finished || legalLoaMoves(game.board,game.turn).length) throw new RangeError('A player may pass only when no legal move is available.');
  const next=recordPosition({...game,turn:3-game.turn,history:Object.freeze([...game.history,Object.freeze({pass:true,side:game.turn})].slice(-200))});
  return (next.repetitions[positionKey(next)]??0)>=3?Object.freeze({...next,finished:true,drawReason:'repetition'}):next;
}

function components(board, side) {
  const remaining=new Set(); for(let i=0;i<64;i++)if(board[i]===side)remaining.add(i);
  const groups=[];
  while(remaining.size){const first=remaining.values().next().value,group=[],stack=[first];remaining.delete(first);while(stack.length){const current=stack.pop();group.push(current);const r=Math.floor(current/8),c=current%8;for(const[dr,dc]of DIRECTIONS){const nr=r+dr,nc=c+dc,next=at(nr,nc);if(inside(nr,nc)&&remaining.has(next)){remaining.delete(next);stack.push(next);}}}groups.push(group);}
  return groups;
}

export function chooseLoaComputerMove(game) {
  if(!game||game.finished||game.mode!=='computer'||game.turn!==2)throw new RangeError('The computer can move only in its active turn.');
  const moves=legalLoaMoves(game.board,2); if(!moves.length)return null;
  let best=moves[0],bestScore=-Infinity;
  for(const move of moves){const board=[...game.board];board[move.to]=board[move.from];board[move.from]=0;const groups=components(board,2);let nearest=0;if(groups.length>1){nearest=Math.min(...groups.flatMap((a,i)=>groups.slice(i+1).flatMap((b)=>a.flatMap((x)=>b.map((y)=>Math.max(Math.abs(Math.floor(x/8)-Math.floor(y/8)),Math.abs(x%8-y%8)))))));}const opponentConnected=loaIsConnected(board,1);const score=(loaIsConnected(board,2)?100000:0)+(opponentConnected?-100000:0)-groups.length*100-nearest+(move.captured?2:0);if(score>bestScore){bestScore=score;best=move;}}
  return best;
}
