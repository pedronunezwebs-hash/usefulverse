import test from 'node:test';
import assert from 'node:assert/strict';
import { createSnakesAndLaddersGame, getSnakesAndLaddersPathPosition, rollSnakesAndLaddersDie, SNAKES_AND_LADDERS_JUMPS } from './snakes-and-ladders.mjs';

test('snakes and ladders creates 2–4 players and bounds its seed and names', () => {
  const game = createSnakesAndLaddersGame({ seed: 12, playerCount: 3, names: ['  Alex  ', '', 'A'.repeat(40)] });
  assert.deepEqual(game.positions, [0, 0, 0]);
  assert.deepEqual(game.names, ['Alex', 'Player 2', 'A'.repeat(24)]);
  assert.throws(() => createSnakesAndLaddersGame({ playerCount: 1 }), /2 to 4/u);
  assert.throws(() => createSnakesAndLaddersGame({ playerCount: 5 }), /2 to 4/u);
});

test('die outcomes are reproducible, valid, and alternate turns', () => {
  const first = createSnakesAndLaddersGame({ seed: 123 });
  const a = rollSnakesAndLaddersDie(first);
  const b = rollSnakesAndLaddersDie(createSnakesAndLaddersGame({ seed: 123 }));
  assert.equal(a.lastRoll, b.lastRoll);
  assert.ok(a.lastRoll >= 1 && a.lastRoll <= 6);
  assert.equal(a.toMove, 1);
  assert.equal(a.turnCount, 1);
});

test('known ladders move up and snakes move down on landing', () => {
  const start = createSnakesAndLaddersGame({ seed: 1 });
  const ladder = rollSnakesAndLaddersDie({ ...start, positions: [2, 0] }, 1);
  assert.equal(ladder.positions[0], 22);
  assert.equal(ladder.lastMove.jump, 'ladder');
  const snake = rollSnakesAndLaddersDie({ ...start, positions: [26, 0] }, 1);
  assert.equal(snake.positions[0], 1);
  assert.equal(snake.lastMove.jump, 'snake');
  assert.equal(Object.keys(SNAKES_AND_LADDERS_JUMPS).length, 17);
});

test('exact finish rule leaves a token in place after an overshoot', () => {
  const game = createSnakesAndLaddersGame({ seed: 8, finishRule: 'exact' });
  const next = rollSnakesAndLaddersDie({ ...game, positions: [98, 20] }, 3);
  assert.equal(next.positions[0], 98);
  assert.equal(next.status, 'playing');
  assert.equal(next.lastMove.landed, 98);
});

test('bounce rule reflects the overshoot from the final cell', () => {
  const game = createSnakesAndLaddersGame({ seed: 8, finishRule: 'bounce' });
  const next = rollSnakesAndLaddersDie({ ...game, positions: [98, 20] }, 5);
  assert.equal(next.positions[0], 97);
  assert.equal(next.lastMove.landed, 97);
});

test('game ends only when a player reaches cell 100', () => {
  const game = createSnakesAndLaddersGame({ seed: 8 });
  const next = rollSnakesAndLaddersDie({ ...game, positions: [94, 20] }, 6);
  assert.equal(next.status, 'won');
  assert.equal(next.winner, 0);
  assert.equal(next.toMove, 0);
  assert.throws(() => rollSnakesAndLaddersDie(next, 1), /not accepting/u);
});

test('board numbering follows an alternating serpentine route', () => {
  assert.deepEqual(getSnakesAndLaddersPathPosition(1), { row: 9, column: 0 });
  assert.deepEqual(getSnakesAndLaddersPathPosition(10), { row: 9, column: 9 });
  assert.deepEqual(getSnakesAndLaddersPathPosition(11), { row: 8, column: 9 });
  assert.deepEqual(getSnakesAndLaddersPathPosition(20), { row: 8, column: 0 });
  assert.deepEqual(getSnakesAndLaddersPathPosition(100), { row: 0, column: 0 });
});
