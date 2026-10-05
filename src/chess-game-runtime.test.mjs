import test from 'node:test';
import assert from 'node:assert/strict';
import { Chess } from 'chess.js';

test('chess engine validates the initial position and rejects illegal moves', () => {
  const game = new Chess();
  assert.equal(game.moves().length, 20);
  assert.throws(() => game.move({ from: 'e2', to: 'e5' }));
  assert.equal(game.history().length, 0);
});

test('chess engine supports castling on both sides', () => {
  const game = new Chess('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1');
  assert.ok(game.moves({ square: 'e1' }).includes('O-O'));
  assert.ok(game.moves({ square: 'e1' }).includes('O-O-O'));
  game.move('O-O');
  assert.equal(game.get('g1').type, 'k');
  assert.equal(game.get('f1').type, 'r');
});

test('chess engine applies en passant and promotion', () => {
  const enPassant = new Chess();
  for (const move of ['e4', 'a6', 'e5', 'd5']) enPassant.move(move);
  assert.ok(enPassant.moves({ square: 'e5' }).includes('exd6'));
  enPassant.move('exd6');
  assert.equal(enPassant.get('d5'), undefined);
  assert.equal(enPassant.get('d6').type, 'p');

  const promotion = new Chess('8/P7/8/8/8/8/7p/4k2K w - - 0 1');
  promotion.move({ from: 'a7', to: 'a8', promotion: 'n' });
  assert.equal(promotion.get('a8').type, 'n');
});

test('chess engine detects checkmate, stalemate and round-trips a saved PGN', () => {
  const checkmate = new Chess();
  for (const move of ['f3', 'e5', 'g4', 'Qh4#']) checkmate.move(move);
  assert.equal(checkmate.isCheckmate(), true);

  const stalemate = new Chess('7k/5Q2/6K1/8/8/8/8/8 b - - 0 1');
  assert.equal(stalemate.isStalemate(), true);

  const original = new Chess();
  for (const move of ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5']) original.move(move);
  const pgn = original.pgn();
  const restored = new Chess();
  restored.loadPgn(pgn);
  assert.deepEqual(restored.history(), original.history());
  restored.undo();
  assert.equal(restored.history().length, 4);
});
