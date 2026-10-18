import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateYatzyTotals, scoreYatzyCategory } from './yatzy.mjs';

test('scores upper categories and common lower combinations', () => {
  assert.equal(scoreYatzyCategory([2, 2, 3, 3, 3], 'ones2'), 4);
  assert.equal(scoreYatzyCategory([2, 2, 3, 3, 3], 'onePair'), 6);
  assert.equal(scoreYatzyCategory([2, 2, 3, 3, 4], 'twoPairs'), 10);
  assert.equal(scoreYatzyCategory([2, 2, 3, 3, 3], 'fullHouse'), 13);
  assert.equal(scoreYatzyCategory([6, 6, 6, 6, 2], 'fourKind'), 26);
  assert.equal(scoreYatzyCategory([1, 2, 3, 4, 5], 'smallStraight'), 15);
  assert.equal(scoreYatzyCategory([2, 3, 4, 5, 6], 'largeStraight'), 20);
  assert.equal(scoreYatzyCategory([4, 4, 4, 4, 4], 'yatzy'), 50);
  assert.equal(scoreYatzyCategory([4, 4, 4, 4, 4], 'onePair'), 8);
});

test('two-pair scoring requires two distinct ranks', () => {
  assert.equal(scoreYatzyCategory([5, 5, 5, 5, 2], 'twoPairs'), 0);
  assert.equal(scoreYatzyCategory([6, 6, 4, 4, 1], 'twoPairs'), 20);
});

test('upper bonus appears only after all upper rows are scored and reach 63', () => {
  const upper = { ones1: 3, ones2: 6, ones3: 9, ones4: 12, ones5: 15 };
  assert.deepEqual(calculateYatzyTotals(upper), { upperSubtotal: 45, bonus: 0, lowerSubtotal: 0, total: 45 });
  const complete = { ...upper, ones6: 18, chance: 20 };
  assert.deepEqual(calculateYatzyTotals(complete), { upperSubtotal: 63, bonus: 50, lowerSubtotal: 20, total: 133 });
});

test('rejects malformed dice, unknown categories and invalid score sheets', () => {
  assert.throws(() => scoreYatzyCategory([1, 2, 3, 4], 'chance'), /five dice/u);
  assert.throws(() => scoreYatzyCategory([1, 2, 3, 4, 7], 'chance'), /five dice/u);
  assert.throws(() => scoreYatzyCategory([1, 2, 3, 4, 5], 'unknown'), /Unknown/u);
  assert.throws(() => calculateYatzyTotals({ yatzy: -1 }), /invalid category or score/u);
});
