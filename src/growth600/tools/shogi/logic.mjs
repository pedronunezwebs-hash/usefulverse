export const SHOGI_SIZE=9;
const TYPES=Object.freeze(['king','rook','bishop','gold','silver','knight','lance','pawn']);
const inside=(x,y)=>x>=0&&x<9&&y>=0&&y<9;
const opposite=(side)=>side==='sente'?'gote':'sente';
const promotedTypes=new Set(['rook','bishop','silver','knight','lance','pawn']);

export function createShogiGame({opponent='computer'}={}){
  const board=Array.from({length:9},()=>Array(9).fill(null));
  const back=['lance','knight','silver','gold','king','gold','silver','knight','lance'];
  for(let x=0;x<9;x+=1){board[0][x]={side:'gote',type:back[x],promoted:false};board[8][x]={side:'sente',type:back[8-x],promoted:false};board[2][x]={side:'gote',type:'pawn',promoted:false};board[6][x]={side:'sente',type:'pawn',promoted:false};}
  board[1][1]={side:'gote',type:'rook',promoted:false};board[1][7]={side:'gote',type:'bishop',promoted:false};
  board[7][1]={side:'sente',type:'bishop',promoted:false};board[7][7]={side:'sente',type:'rook',promoted:false};
  return {board,hands:{sente:[],gote:[]},turn:'sente',selected:null,selectedDrop:null,winner:null,check:false,moves:0,reason:'',opponent};
}

function kingAt(board,side){for(let y=0;y<9;y+=1)for(let x=0;x<9;x+=1)if(board[y][x]?.side===side&&board[y][x]?.type==='king')return{x,y};return null;}
function boardAfter(board,from,to,promotion=false){const next=board.map((row)=>row.slice());const moving=next[from.y][from.x];next[to.y][to.x]=moving?{...moving,promoted:moving.promoted||promotion}:null;next[from.y][from.x]=null;return next;}
function canPromote(piece,fromY,toY){return promotedTypes.has(piece.type)&&!piece.promoted&&(piece.side==='sente'?(fromY<=2||toY<=2):(fromY>=6||toY>=6));}
function mustPromote(piece,toY){if(piece.promoted)return false;const last=piece.side==='sente'?0:8;const lastTwo=piece.side==='sente'?toY<=1:toY>=7;return ((piece.type==='pawn'||piece.type==='lance')&&toY===last)||(piece.type==='knight'&&lastTwo);}
function add(board,piece,moves,x,y){if(!inside(x,y)||board[y][x]?.side===piece.side)return;moves.push({x,y});}
function movesForPiece(board,x,y){
  const piece=board[y]?.[x];if(!piece)return[];const moves=[];const forward=piece.side==='sente'?-1:1;
  const step=(dx,dy)=>add(board,piece,moves,x+dx,y+dy);const ray=(dx,dy)=>{let nx=x+dx,ny=y+dy;while(inside(nx,ny)){if(board[ny][nx]){if(board[ny][nx].side!==piece.side)moves.push({x:nx,y:ny});break;}moves.push({x:nx,y:ny});nx+=dx;ny+=dy;}};
  if(piece.type==='king'){for(let dx=-1;dx<=1;dx+=1)for(let dy=-1;dy<=1;dy+=1)if(dx||dy)step(dx,dy);return moves;}
  if(piece.promoted&&['silver','knight','lance','pawn'].includes(piece.type)){for(const [dx,dy] of [[0,forward],[-1,forward],[1,forward],[-1,0],[1,0],[0,-forward]])step(dx,dy);return moves;}
  if(piece.type==='gold'){for(const [dx,dy] of [[0,forward],[-1,forward],[1,forward],[-1,0],[1,0],[0,-forward]])step(dx,dy);return moves;}
  if(piece.type==='silver'){for(const [dx,dy] of [[0,forward],[-1,forward],[1,forward],[-1,-forward],[1,-forward]])step(dx,dy);return moves;}
  if(piece.type==='knight'){step(-1,2*forward);step(1,2*forward);return moves;}
  if(piece.type==='pawn'){step(0,forward);return moves;}
  if(piece.type==='lance'){ray(0,forward);return moves;}
  if(piece.type==='rook'||(piece.promoted&&piece.type==='rook')){for(const [dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]])ray(dx,dy);if(piece.promoted)for(const [dx,dy]of[[1,1],[1,-1],[-1,1],[-1,-1]])step(dx,dy);return moves;}
  if(piece.type==='bishop'||(piece.promoted&&piece.type==='bishop')){for(const [dx,dy]of[[1,1],[1,-1],[-1,1],[-1,-1]])ray(dx,dy);if(piece.promoted)for(const [dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]])step(dx,dy);return moves;}
  return moves;
}
function inCheck(board,side){const king=kingAt(board,side);if(!king)return true;const enemy=opposite(side);for(let y=0;y<9;y+=1)for(let x=0;x<9;x+=1)if(board[y][x]?.side===enemy&&movesForPiece(board,x,y).some((move)=>move.x===king.x&&move.y===king.y))return true;return false;}
function nifu(board,side,file){return board.some((row)=>row[file]?.side===side&&row[file]?.type==='pawn'&&!row[file].promoted);}
function legalBoardMoves(board,side){const moves=[];for(let y=0;y<9;y+=1)for(let x=0;x<9;x+=1){const piece=board[y][x];if(piece?.side!==side)continue;for(const to of movesForPiece(board,x,y)){if(board[to.y][to.x]?.type==='king')continue;const next=boardAfter(board,{x,y},to);if(!inCheck(next,side))moves.push({from:{x,y},to,canPromote:canPromote(piece,y,to.y),mustPromote:mustPromote(piece,to.y),type:piece.type});}}return moves;}
function legalDrops(board,hand,side){const drops=[];for(const type of new Set(hand)){if(!TYPES.includes(type))continue;for(let y=0;y<9;y+=1)for(let x=0;x<9;x+=1){if(board[y][x]||(type==='pawn'&&nifu(board,side,x)))continue;const last=side==='sente'?0:8;const lastTwo=side==='sente'?y<=1:y>=7;if((type==='pawn'||type==='lance')&&y===last)continue;if(type==='knight'&&lastTwo)continue;const next=board.map((row)=>row.slice());next[y][x]={side,type,promoted:false};if(inCheck(next,side))continue;if(type==='pawn'&&inCheck(next,opposite(side))&&!legalBoardMoves(next,opposite(side)).length)continue;drops.push({drop:type,to:{x,y}});}}return drops;}
export function legalShogiMoves(game,side=game.turn){return [...legalBoardMoves(game.board,side),...legalDrops(game.board,game.hands[side],side)];}
export function selectShogiPiece(game,x,y){if(game.winner||game.board[y]?.[x]?.side!==game.turn){game.selected=null;game.selectedDrop=null;return[];}game.selected={x,y};game.selectedDrop=null;return legalBoardMoves(game.board,game.turn).filter((move)=>move.from.x===x&&move.from.y===y);}
export function selectShogiDrop(game,type){if(game.winner||!game.hands[game.turn].includes(type)){game.selected=null;game.selectedDrop=null;return[];}game.selected=null;game.selectedDrop=type;return legalDrops(game.board,game.hands[game.turn],game.turn).filter((move)=>move.drop===type);}
function finishTurn(game){game.turn=opposite(game.turn);game.moves+=1;game.check=inCheck(game.board,game.turn);if(!legalShogiMoves(game).length){game.winner=opposite(game.turn);game.reason=game.check?'checkmate':'no-legal-moves';}return game;}
export function playShogiMove(game,from,to,promote=false){if(game.winner||!game.selected||game.selected.x!==from.x||game.selected.y!==from.y)return{played:false};const move=legalBoardMoves(game.board,game.turn).find((m)=>m.to.x===to.x&&m.to.y===to.y);if(!move||move.mustPromote&&!promote||promote&&!move.canPromote)return{played:false};const piece=game.board[from.y][from.x];const captured=game.board[to.y][to.x];game.board=boardAfter(game.board,from,to,promote);if(captured)game.hands[piece.side].push(captured.type);game.selected=null;game.selectedDrop=null;finishTurn(game);return{played:true,promoted:promote,captured:captured?.type,check:game.check,winner:game.winner};}
export function playShogiDrop(game,type,to){if(game.winner||game.selectedDrop!==type)return{played:false};const move=legalDrops(game.board,game.hands[game.turn],game.turn).find((m)=>m.to.x===to.x&&m.to.y===to.y);if(!move)return{played:false};const handIndex=game.hands[game.turn].indexOf(type);game.hands[game.turn].splice(handIndex,1);game.board[to.y][to.x]={side:game.turn,type,promoted:false};game.selected=null;game.selectedDrop=null;finishTurn(game);return{played:true,check:game.check,winner:game.winner};}
function promoteString(piece){return piece.promoted?'+':'';}
export function shogiSfen(game){const code={king:'K',rook:'R',bishop:'B',gold:'G',silver:'S',knight:'N',lance:'L',pawn:'P'};const rows=game.board.map((row)=>{let out='',empty=0;for(let x=0;x<9;x+=1){const p=row[x];if(!p){empty+=1;continue;}if(empty){out+=empty;empty=0;}let letter=code[p.type];if(p.side==='gote')letter=letter.toLowerCase();out+=promoteString(p)+letter;}if(empty)out+=empty;return out;}).join('/');let hand='';for(const side of ['sente','gote'])for(const type of ['rook','bishop','gold','silver','knight','lance','pawn']){const count=game.hands[side].filter((item)=>item===type).length;if(count)hand+=`${count>1?count:''}${side==='gote'?code[type].toLowerCase():code[type]}`;}return`${rows} ${game.turn==='sente'?'b':'w'} ${hand||'-'} ${game.moves+1}`;}
export function shogiPieceSymbol(piece){const glyph={king:'玉',rook:'飛',bishop:'角',gold:'金',silver:'銀',knight:'桂',lance:'香',pawn:'歩'};const promoted={rook:'龍',bishop:'馬',silver:'全',knight:'圭',lance:'杏',pawn:'と'};return piece?.promoted?promoted[piece.type]??glyph[piece.type]:glyph[piece?.type]??'';}
export function chooseShogiBotMove(game,side='gote'){const legal=legalShogiMoves(game,side);if(!legal.length)return null;const value={pawn:1,lance:2,knight:3,silver:4,gold:5,bishop:7,rook:8,king:100};return legal.map((move)=>{if(move.drop)return{move,score:Math.random()*.1};const target=game.board[move.to.y][move.to.x];const score=(target?value[target.type]*10:0)+(move.canPromote?3:0)+(move.mustPromote?8:0)+(target&&target.side!==side?1:0)+Math.random()*.01;return{move,score};}).sort((a,b)=>b.score-a.score)[0].move;}
