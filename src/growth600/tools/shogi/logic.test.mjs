import test from 'node:test';
import assert from 'node:assert/strict';
import { createShogiGame, legalShogiMoves, selectShogiPiece, playShogiMove, selectShogiDrop, shogiSfen } from './logic.mjs';

test('shogi initializes a complete 9x9 board and standard opening SFEN', () => {
  const game = createShogiGame();
  assert.equal(game.board.length, 9);
  assert.ok(game.board.every((row) => row.length === 9));
  assert.equal(legalShogiMoves(game, 'sente').length, 30);
  assert.equal(shogiSfen(game), 'lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1');
});

test('shogi validates legal turns, forced promotion and alternates sides', () => {
  const game = createShogiGame({ opponent: 'local' });
  const moves = selectShogiPiece(game, 4, 6);
  assert.ok(moves.some(({ to }) => to.x === 4 && to.y === 5));
  assert.deepEqual(playShogiMove(game, { x: 4, y: 6 }, { x: 4, y: 5 }), { played: true, promoted: false, captured: undefined, check: false, winner: null });
  assert.equal(game.turn, 'gote');

  const promotion = createShogiGame({ opponent: 'local' });
  promotion.board = Array.from({ length: 9 }, () => Array(9).fill(null));
  promotion.board[8][8] = { side: 'sente', type: 'king', promoted: false };
  promotion.board[0][0] = { side: 'gote', type: 'king', promoted: false };
  promotion.board[1][4] = { side: 'sente', type: 'pawn', promoted: false };
  const forced = selectShogiPiece(promotion, 4, 1).find(({ to }) => to.x === 4 && to.y === 0);
  assert.equal(forced.mustPromote, true);
  assert.equal(playShogiMove(promotion, { x: 4, y: 1 }, { x: 4, y: 0 }, false).played, false);
  selectShogiPiece(promotion, 4, 1);
  assert.equal(playShogiMove(promotion, { x: 4, y: 1 }, { x: 4, y: 0 }, true).played, true);
  assert.equal(promotion.board[0][4].promoted, true);
});

test('shogi drop rules reject nifu on an occupied unpromoted pawn file', () => {
  const game = createShogiGame({ opponent: 'local' });
  game.board = Array.from({ length: 9 }, () => Array(9).fill(null));
  game.board[8][8] = { side: 'sente', type: 'king', promoted: false };
  game.board[0][0] = { side: 'gote', type: 'king', promoted: false };
  game.board[5][4] = { side: 'sente', type: 'pawn', promoted: false };
  game.hands.sente.push('pawn');
  const drops = selectShogiDrop(game, 'pawn');
  assert.ok(drops.length > 0);
  assert.ok(drops.every(({ to }) => to.x !== 4));
});
