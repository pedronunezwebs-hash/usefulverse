import test from 'node:test';
import assert from 'node:assert/strict';
import { createBaseballGame, playBaseballTurn } from './logic.mjs';

test('baseball game resolves a deterministic pitch and freezes updated game state', () => {
  const initial = createBaseballGame(() => 0);
  const next = playBaseballTurn(initial, 'fastball');
  assert.equal(initial.inning, 1);
  assert.equal(next.half, 'top');
  assert.equal(next.strikes, 1);
  assert.equal(next.outcome, 'strike');
  assert.equal(next.lastAction, 'fastball-swing');
  assert.ok(Object.isFrozen(next) && Object.isFrozen(next.score) && Object.isFrozen(next.bases));
});

test('baseball game rejects batting while pitching, pitching while batting and invalid randomness', () => {
  const game = createBaseballGame(() => 0);
  assert.throws(() => playBaseballTurn(game, 'swing'), RangeError);
  const batting = Object.freeze({ ...game, half: 'bottom' });
  assert.throws(() => playBaseballTurn(batting, 'fastball'), RangeError);
  assert.throws(() => playBaseballTurn(createBaseballGame(() => 1), 'fastball'), RangeError);
});
