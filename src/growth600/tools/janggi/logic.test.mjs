import test from 'node:test';
import assert from 'node:assert/strict';
import {createJanggiGame,janggiMoves,playJanggiMove,passJanggiTurn} from './logic.mjs';

const has=(moves,x,y)=>moves.some((move)=>move.x===x&&move.y===y);
const emptyBoard=()=>Array.from({length:10},()=>Array(9).fill(null));
const put=(board,x,y,side,kind)=>{board[y][x]={side,kind};};

test('starting formation has 16 pieces per side and Cho moves first',()=>{
  const game=createJanggiGame();
  assert.equal(game.turn,'cho');
  assert.equal(game.board.flat().filter((piece)=>piece?.side==='cho').length,16);
  assert.equal(game.board.flat().filter((piece)=>piece?.side==='han').length,16);
  assert.equal(game.board[1][4].kind,'general');
  assert.equal(game.board[8][4].kind,'general');
});

test('general and guards move one connected step inside their own palace',()=>{
  const board=emptyBoard();put(board,4,1,'cho','general');
  const moves=janggiMoves(board,4,1);
  assert.equal(moves.length,8);
  assert.ok(has(moves,3,0));assert.ok(has(moves,5,2));assert.ok(!has(moves,2,1));
  board[0][3]={side:'cho',kind:'guard'};board[1][4]=null;
  assert.ok(has(janggiMoves(board,3,0),4,1));
  assert.ok(!has(janggiMoves(board,3,0),4,2));
});

test('chariot slides orthogonally and follows palace diagonals only on marked points',()=>{
  const board=emptyBoard();put(board,3,0,'cho','chariot');
  const moves=janggiMoves(board,3,0);
  assert.ok(has(moves,3,9));assert.ok(has(moves,4,1));assert.ok(has(moves,5,2));
  assert.ok(!has(moves,6,3));
});

test('cannon must jump one non-cannon piece to move or capture',()=>{
  const board=emptyBoard();put(board,0,4,'cho','cannon');put(board,0,2,'cho','soldier');put(board,0,0,'han','horse');
  let moves=janggiMoves(board,0,4);
  assert.ok(!has(moves,0,3));assert.ok(has(moves,0,1));assert.ok(has(moves,0,0));
  put(board,0,2,'han','cannon');moves=janggiMoves(board,0,4);
  assert.equal(moves.length,0);
});

test('horse and elephant paths are blocked by pieces on their intermediate points',()=>{
  const board=emptyBoard();put(board,4,4,'cho','horse');
  assert.ok(has(janggiMoves(board,4,4),6,5));put(board,5,4,'han','soldier');
  assert.ok(!has(janggiMoves(board,4,4),6,5));
  board[4][5]=null;put(board,4,4,'cho','elephant');
  assert.ok(has(janggiMoves(board,4,4),7,4));put(board,6,4,'han','soldier');
  assert.ok(!has(janggiMoves(board,4,4),7,4));
});

test('soldier moves forward and sideways; forward palace diagonals apply in enemy palace',()=>{
  const board=emptyBoard();put(board,4,3,'cho','soldier');
  assert.ok(has(janggiMoves(board,4,3),4,4));assert.ok(has(janggiMoves(board,4,3),3,3));assert.ok(!has(janggiMoves(board,4,3),4,2));
  put(board,3,7,'cho','soldier');assert.ok(has(janggiMoves(board,3,7),4,8));
});

test('a general capture wins; two consecutive passes settle by material with Han compensation',()=>{
  const capture=createJanggiGame();capture.board=emptyBoard();put(capture.board,4,3,'cho','chariot');put(capture.board,4,8,'han','general');
  const result=playJanggiMove(capture,{x:4,y:3},{x:4,y:8});
  assert.equal(result.moved,true);assert.equal(capture.winner,'cho');
  const game=createJanggiGame();game.board=emptyBoard();put(game.board,0,0,'cho','chariot');put(game.board,8,9,'han','horse');
  assert.equal(passJanggiTurn(game).passed,true);
  const settled=passJanggiTurn(game);
  assert.equal(settled.winner,'cho');assert.deepEqual(settled.scores,{cho:13,han:6.5});
});

test('setup alternatives place each side independently',()=>{
  const game=createJanggiGame({choSetup:'elephant-horse',hanSetup:'horse-elephant'});
  assert.equal(game.board[0][1].kind,'elephant');assert.equal(game.board[0][2].kind,'horse');
  assert.equal(game.board[9][1].kind,'horse');assert.equal(game.board[9][2].kind,'elephant');
});
