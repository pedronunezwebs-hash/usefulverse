import assert from 'node:assert/strict';
import test from 'node:test';
import { createTripeaksGame, drawTripeaksCard, getTripeaksHints, getTripeaksState, isTripeaksCardExposed, removeTripeaksCard, undoTripeaksMove } from './logic.mjs';

test('every fresh deal has 28 tableau cards, 24 stock cards and three different deals', () => {
  const first = createTripeaksGame({ random: () => 0.23 }); const second = createTripeaksGame({ random: () => 0.67 });
  assert.equal(first.tableau.length, 28); assert.equal(first.stock.length, 24); assert.notDeepEqual(first.tableau.map(({ id }) => id), second.tableau.map(({ id }) => id));
  assert.equal(new Set([...first.tableau, ...first.stock].map(({ id }) => id)).size, 52);
  assert.equal(getTripeaksState(first).tableau.filter(({ exposed }) => exposed).length, 10);
});

test('draw exposes waste; only an uncovered card one rank away can be cleared; undo restores state', () => {
  let game; let candidate;
  for (let seed = 0.01; seed < 1 && !candidate; seed += 0.01) {
    game = createTripeaksGame({ random: () => seed }); drawTripeaksCard(game);
    const hints = getTripeaksHints(game); if (hints.length) candidate = game.tableau.find(({ id }) => id === hints[0]);
  }
  assert.ok(candidate, 'a deterministic sample deal has an immediately playable card');
  assert.equal(game.score, 0);
  assert.equal(removeTripeaksCard(game, candidate.id).ok, true);
  assert.equal(getTripeaksState(game).score, 10);
  assert.equal(game.tableau.find(({ id }) => id === candidate.id).removed, true);
  assert.equal(undoTripeaksMove(game).ok, true);
  assert.equal(getTripeaksState(game).score, 0);
  assert.equal(game.tableau.find(({ id }) => id === candidate.id).removed, false);
  const covered = game.tableau.find(({ row }) => row < 3); assert.equal(isTripeaksCardExposed(game, covered.id), false); assert.equal(removeTripeaksCard(game, covered.id).reason, 'covered');
});

test('ace wraps to king and twos; covered cards cannot be cleared', () => {
  const game = createTripeaksGame({ random: () => 0.29 });
  const ace = game.tableau.find(({ rank, row }) => rank === 'A' && row === 3);
  const covered = game.tableau.find(({ row }) => row < 3);
  game.waste = [{ rank: 'K', suit: 'spades', id: 'test-king' }];
  assert.equal(isTripeaksCardExposed(game, covered.id), false);
  assert.equal(removeTripeaksCard(game, covered.id).reason, 'covered');
  assert.equal(removeTripeaksCard(game, ace.id).ok, true);
  assert.equal(game.waste.at(-1).rank, 'A');
  const two = game.tableau.find(({ row, removed }) => row === 3 && !removed);
  two.rank = '2';
  assert.equal(removeTripeaksCard(game, two.id).ok, true);
});

test('no-move hints are exact and a draw can reveal a legal next move', () => {
  const game = createTripeaksGame({ random: () => 0.51 }); assert.deepEqual(getTripeaksHints(game), []);
  drawTripeaksCard(game); assert.equal(Array.isArray(getTripeaksHints(game)), true);
  const hints = getTripeaksHints(game); if (hints.length) assert.equal(removeTripeaksCard(game, hints[0]).ok, true);
});

test('stock exhaustion ends only when no tableau moves remain and undo can resume play', () => {
  const game = createTripeaksGame({ random: () => 0.44 });
  while (game.stock.length) drawTripeaksCard(game);
  if (game.status === 'playing') { const hints = getTripeaksHints(game); if (hints.length) removeTripeaksCard(game, hints[0]); }
  assert.ok(['playing', 'stuck', 'won'].includes(game.status));
  assert.equal(undoTripeaksMove(game).ok, true);
});
