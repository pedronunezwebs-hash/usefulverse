import test from 'node:test';
import assert from 'node:assert/strict';
import { ENNEAGRAM_QUESTION_THEMES, scoreEnneagramReflection } from './logic.mjs';

test('Enneagram reflection scores each of nine themes and preserves ties without choosing a type', () => {
  const tied = scoreEnneagramReflection(Array(27).fill('3'));
  assert.equal(tied.ranking.length, 9);
  assert.deepEqual(tied.leaders.map(({ theme }) => theme), [1,2,3,4,5,6,7,8,9]);
  assert.deepEqual(tied.leaders.map(({ points, outOf }) => [points, outOf]), Array(9).fill([9,15]));
  const distinct = scoreEnneagramReflection(Array.from({ length: 27 }, (_, index) => String(index < 3 ? 5 : index < 6 ? 4 : 1)));
  assert.deepEqual(distinct.leaders.map(({ theme }) => theme), [1]);
  assert.deepEqual(distinct.closeMatches.map(({ theme }) => theme), [2]);
  assert.deepEqual(ENNEAGRAM_QUESTION_THEMES, Array.from({ length: 9 }, (_, index) => Array(3).fill(index + 1)).flat());
});

test('Enneagram reflection rejects missing, malformed and incorrectly grouped answers', () => {
  assert.throws(() => scoreEnneagramReflection(Array(26).fill('3')), RangeError);
  assert.throws(() => scoreEnneagramReflection(Array(27).fill(true)), RangeError);
  assert.throws(() => scoreEnneagramReflection(Array(27).fill('6')), RangeError);
  assert.throws(() => scoreEnneagramReflection(Array(27).fill('3'), Array(27).fill(1)), RangeError);
  assert.throws(() => scoreEnneagramReflection(Array(27).fill('3'), Array(27).fill(10)), RangeError);
});
