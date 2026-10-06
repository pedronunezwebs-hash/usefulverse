import test from 'node:test';
import assert from 'node:assert/strict';
import { isSlidingPuzzleSolvable, isSlidingPuzzleSolved, moveSlidingTile, newSlidingPuzzle } from './sliding-puzzle-logic.mjs';

function seeded(seed) {
  let state = seed >>> 0;
  return () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state / 0x1_0000_0000; };
}

test('new sliding puzzle uses only legal shuffles and is always solvable by reversing the move sequence', () => {
  for (const size of [3, 4, 5]) {
    const game = newSlidingPuzzle(size, seeded(size), 120);
    assert.equal(game.length, size * size);
    assert.deepEqual([...game].sort((a, b) => a - b), Array.from({ length: size * size }, (_, index) => index));
    assert.equal(isSlidingPuzzleSolved(game), false);
    assert.equal(isSlidingPuzzleSolvable(game, size), true);
  }
});

test('legal tile move changes a copy; non-neighbor and invalid moves are rejected', () => {
  const solved = [1, 2, 3, 4, 5, 6, 7, 0, 8];
  assert.deepEqual(moveSlidingTile(solved, 8, 3), [1, 2, 3, 4, 5, 6, 7, 8, 0]);
  assert.deepEqual(solved, [1, 2, 3, 4, 5, 6, 7, 0, 8]);
  assert.equal(moveSlidingTile(solved, 0, 3), null);
  assert.equal(moveSlidingTile(solved, 9, 3), null);
  assert.equal(moveSlidingTile([1, 2, 0, 4, 5, 6, 7, 8, 8], 1, 3), null);
});

test('solved-state check and generator guard boundaries', () => {
  assert.equal(isSlidingPuzzleSolved([1, 2, 3, 4, 5, 6, 7, 8, 0]), true);
  assert.equal(isSlidingPuzzleSolved([1, 2, 3, 4, 5, 6, 8, 7, 0]), false);
  assert.equal(isSlidingPuzzleSolvable([1, 2, 3, 4, 5, 6, 7, 8, 0], 3), true);
  assert.equal(isSlidingPuzzleSolvable([1, 2, 3, 4, 5, 6, 8, 7, 0], 3), false);
  assert.equal(isSlidingPuzzleSolvable([1, 2, 3, 4, 5, 6, 7, 0, 8], 3), true);
  assert.equal(isSlidingPuzzleSolvable([1, 2, 3, 4, 5, 6, 7, 8, 8], 3), false);
  assert.throws(() => newSlidingPuzzle(2), RangeError);
  assert.throws(() => newSlidingPuzzle(3, () => 1), RangeError);
  assert.throws(() => newSlidingPuzzle(3, Math.random, 0), RangeError);
});
