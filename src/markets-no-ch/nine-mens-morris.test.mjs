import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MORRIS_MILLS, MORRIS_NEIGHBORS, createMorrisGame, getMorrisRemovablePoints, millsAt,
  legalMorrisMoves, moveMorrisPiece, placeMorrisPiece, playMorrisCpuTurn, removeMorrisPiece,
} from './nine-mens-morris.mjs';

function fixture({ playerPieces, cpuPieces, toMove = 0, phase = 'moving', pendingMill = false, lastMillBy = null, turnCount = 0 } = {}) {
  const base = createMorrisGame({ seed: 91 });
  const board = Array(24).fill(null);
  playerPieces.forEach((point) => { board[point] = 0; });
  cpuPieces.forEach((point) => { board[point] = 1; });
  return Object.freeze({ ...base, board: Object.freeze(board), placed: Object.freeze([9, 9]), onBoard: Object.freeze([playerPieces.length, cpuPieces.length]), toMove, phase, pendingMill, lastMillBy, turnCount });
}

test('the mill graph has 24 points, 16 distinct lines, symmetric edges and degree at most four', () => {
  assert.equal(MORRIS_MILLS.length, 16);
  assert.equal(new Set(MORRIS_MILLS.map((mill) => [...mill].sort((a, b) => a - b).join(','))).size, 16);
  assert.equal(MORRIS_NEIGHBORS.length, 24);
  for (const [point, neighbors] of MORRIS_NEIGHBORS.entries()) {
    assert.ok(neighbors.length >= 2 && neighbors.length <= 4);
    for (const neighbor of neighbors) assert.ok(MORRIS_NEIGHBORS[neighbor].includes(point), `${point} ↔ ${neighbor}`);
  }
});

test('radial connector lines count as mills in all four directions', () => {
  const board = Array(24).fill(null);
  for (const mill of [[1, 9, 17], [3, 11, 19], [5, 13, 21], [7, 15, 23]]) {
    for (const point of mill) board[point] = 0;
    assert.ok(millsAt(board, 0, mill[1]).some((line) => line.join(',') === mill.join(',')));
    for (const point of mill) board[point] = null;
  }
});

test('placement alternates turns and forming a mill requires one legal removal', () => {
  let game = createMorrisGame({ seed: 7 });
  game = placeMorrisPiece(game, 0, 0);
  game = placeMorrisPiece(game, 1, 8);
  game = placeMorrisPiece(game, 0, 1);
  game = placeMorrisPiece(game, 1, 10);
  game = placeMorrisPiece(game, 0, 2);
  assert.equal(game.pendingMill, true);
  assert.equal(game.toMove, 0);
  assert.deepEqual(getMorrisRemovablePoints(game), [8, 10]);
  game = removeMorrisPiece(game, 0, 8);
  assert.equal(game.pendingMill, false);
  assert.equal(game.toMove, 1);
  assert.equal(game.onBoard[1], 1);
  assert.throws(() => removeMorrisPiece(game, 0, 10));
});

test('a mill cannot remove a piece in another mill while an unprotected piece exists', () => {
  const game = fixture({ playerPieces: [0, 1, 2], cpuPieces: [8, 9, 10, 11], pendingMill: true, lastMillBy: 0 });
  assert.deepEqual(getMorrisRemovablePoints(game), [11]);
  assert.throws(() => removeMorrisPiece(game, 0, 8), /cannot be removed/u);
  const next = removeMorrisPiece(game, 0, 11);
  assert.equal(next.onBoard[1], 3);
});

test('a valid capture that reduces a side to two pieces wins after placement is complete', () => {
  const game = fixture({ playerPieces: [0, 1, 2], cpuPieces: [8, 10, 12], pendingMill: true, lastMillBy: 0 });
  const next = removeMorrisPiece(game, 0, 8);
  assert.equal(next.status, 'won');
  assert.equal(next.winner, 0);
});

test('moving phase permits only adjacent empty points and moving into a mill creates a capture', () => {
  const game = fixture({ playerPieces: [0, 1, 8, 14], cpuPieces: [3, 5, 10, 12] });
  assert.ok(legalMorrisMoves(game).some(({ from, to }) => from === 8 && to === 9));
  assert.ok(!legalMorrisMoves(game).some(({ from, to }) => from === 8 && to === 16));
  assert.throws(() => moveMorrisPiece(game, 0, 8, 16), /not legal/u);
  const millSetup = fixture({ playerPieces: [1, 2, 7, 14], cpuPieces: [3, 5, 10, 12] });
  const next = moveMorrisPiece(millSetup, 0, 7, 0);
  assert.equal(next.pendingMill, true);
  assert.equal(next.lastMillBy, 0);
});

test('a side on three pieces may fly, while a side with four remains adjacent-only', () => {
  const game = fixture({ playerPieces: [0, 2, 4], cpuPieces: [8, 10, 12, 14], phase: 'flying' });
  const moves = legalMorrisMoves(game, 0);
  assert.ok(moves.some(({ from, to }) => from === 0 && to === 9));
  const cpuGame = Object.freeze({ ...game, toMove: 1 });
  assert.ok(!legalMorrisMoves(cpuGame, 1).some(({ from, to }) => from === 8 && to === 16));
});

test('CPU turns use legal actions and are deterministic for an identical saved state', () => {
  const initial = createMorrisGame({ seed: 444 });
  const first = placeMorrisPiece(initial, 0, 0);
  const cpuA = playMorrisCpuTurn(first);
  const cpuB = playMorrisCpuTurn(first);
  assert.equal(cpuA.toMove, 0);
  assert.deepEqual(cpuA.board, cpuB.board);
  assert.equal(cpuA.placed[1], 1);
  assert.equal(cpuA.board.filter((point) => point === 1).length, 1);
});

test('invalid points, turns and captures are rejected without mutating the original state', () => {
  const game = createMorrisGame();
  assert.throws(() => placeMorrisPiece(game, 1, 4));
  assert.throws(() => placeMorrisPiece(game, 0, 24));
  const next = placeMorrisPiece(game, 0, 4);
  assert.equal(game.board[4], null);
  assert.equal(next.board[4], 0);
});
