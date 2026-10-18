import assert from 'node:assert/strict';
import test from 'node:test';
import { chooseDotsBoxesComputerEdge, createDotsBoxesGame, getDotsBoxesLegalEdges, playDotsBoxesEdge } from './logic.mjs';

test('board sizes and modes are bounded', () => {
  assert.equal(createDotsBoxesGame({ size: 3 }).horizontal.length, 12);
  assert.equal(createDotsBoxesGame({ size: 5 }).vertical.length, 30);
  assert.throws(() => createDotsBoxesGame({ size: 6 }), /3, 4 or 5/u);
  assert.throws(() => createDotsBoxesGame({ mode: 'online' }), /computer or two-player/u);
});

test('a completed box scores once and lets the same player keep the turn', () => {
  const game = createDotsBoxesGame({ size: 3, mode: 'two-player' });
  for (const edge of [{ orientation: 'h', row: 0, column: 0 }, { orientation: 'h', row: 1, column: 0 }, { orientation: 'v', row: 0, column: 0 }]) {
    assert.equal(playDotsBoxesEdge(game, edge).ok, true);
  }
  assert.equal(game.turn, 1);
  const close = playDotsBoxesEdge(game, { orientation: 'v', row: 0, column: 1 });
  assert.deepEqual(close.captured, [{ row: 0, column: 0 }]);
  assert.equal(game.scores[1], 1);
  assert.equal(game.turn, 1);
  assert.equal(playDotsBoxesEdge(game, { orientation: 'v', row: 0, column: 1 }).reason, 'already-drawn');
});

test('edge bounds, end state and remaining legal edges stay consistent', () => {
  const game = createDotsBoxesGame({ size: 3, mode: 'two-player' });
  assert.equal(playDotsBoxesEdge(game, { orientation: 'h', row: 4, column: 0 }).reason, 'invalid-edge');
  assert.equal(getDotsBoxesLegalEdges(game).length, 24);
  while (!game.finished) {
    const edge = getDotsBoxesLegalEdges(game)[0];
    playDotsBoxesEdge(game, edge);
  }
  assert.equal(game.boxes.length, 9);
  assert.equal(game.boxes.every(Boolean), true);
  assert.equal(playDotsBoxesEdge(game, { orientation: 'h', row: 0, column: 0 }).reason, 'finished');
});

test('computer closes a box before choosing a neutral move', () => {
  const game = createDotsBoxesGame({ size: 3 });
  for (const edge of [{ orientation: 'h', row: 0, column: 0 }, { orientation: 'h', row: 1, column: 0 }, { orientation: 'v', row: 0, column: 0 }]) playDotsBoxesEdge(game, edge);
  assert.deepEqual(chooseDotsBoxesComputerEdge(game, { random: () => 0 }), { orientation: 'v', row: 0, column: 1 });
});
