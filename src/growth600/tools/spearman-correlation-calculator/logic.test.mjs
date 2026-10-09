import assert from 'node:assert/strict';
import test from 'node:test';
import { averageRanks, calculateSpearman, parseSpearmanPairs, SPEARMAN_LIMITS } from './logic.mjs';

test('identical increasing ranks give rho 1 and reverse ranks give rho -1', () => {
  assert.equal(calculateSpearman('1, 10\n2, 20\n3, 30').rho, 1);
  assert.equal(calculateSpearman('1 30\n2 20\n3 10').rho, -1);
});

test('ties use average ranks and rho matches the Pearson correlation of those ranks', () => {
  const result = calculateSpearman('1, 10\n1, 20\n3, 20\n4, 40');
  assert.deepEqual(result.pairs.map(({ rankX }) => rankX), [1.5, 1.5, 3, 4]);
  assert.deepEqual(result.pairs.map(({ rankY }) => rankY), [1, 2.5, 2.5, 4]);
  assert.ok(result.tiedX.length === 1 && result.tiedY.length === 1);
  assert.ok(Math.abs(result.rho - 0.8333333333333334) < 1e-12);
});

test('Arabic and Persian digits and Arabic decimal separators parse locally', () => {
  const pairs = parseSpearmanPairs('١٫٥، ٢\n۲٫۵؛ ٣');
  assert.deepEqual(pairs.map(({ x, y }) => [x, y]), [[1.5, 2], [2.5, 3]]);
});

test('constant ranks, malformed rows, excessive points and out-of-range values are rejected', () => {
  assert.throws(() => calculateSpearman('1, 5\n2, 5\n3, 5'), /undefined/u);
  assert.throws(() => parseSpearmanPairs('1,2,3\n4,5'), /exactly two/u);
  assert.throws(() => parseSpearmanPairs('1,2'), /between 2/u);
  assert.throws(() => parseSpearmanPairs(`1,2\n${'1,2\n'.repeat(SPEARMAN_LIMITS.maxPoints)}`), /between 2/u);
  assert.throws(() => parseSpearmanPairs('1000000000001,2\n3,4'), /1,000,000,000,000/u);
});

test('controller-facing calculation does not mutate input pairs', () => {
  const pairs = [{ x: 1, y: 2 }, { x: 2, y: 3 }];
  calculateSpearman(pairs);
  assert.deepEqual(pairs, [{ x: 1, y: 2 }, { x: 2, y: 3 }]);
});
