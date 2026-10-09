import assert from 'node:assert/strict';
import test from 'node:test';
import { averageAbsoluteRanks, calculateWilcoxonSignedRank, parseWilcoxonPairs, WILCOXON_LIMITS } from './logic.mjs';

test('all-zero paired differences return a dedicated non-test state', () => {
  const result = calculateWilcoxonSignedRank('5, 5\n10, 10');
  assert.equal(result.status, 'all-zero');
  assert.equal(result.zeroDifferenceCount, 2);
  assert.equal(result.pValue, null);
});

test('three positive untied differences use an exact two-sided distribution', () => {
  const result = calculateWilcoxonSignedRank('0, 1\n0, 2\n0, 3');
  assert.equal(result.status, 'calculated');
  assert.equal(result.positiveRankSum, 6);
  assert.equal(result.negativeRankSum, 0);
  assert.equal(result.pValue, 0.25);
  assert.match(result.method, /Exact/u);
});

test('zero differences are excluded and tied absolute differences receive average ranks', () => {
  const ranking = averageAbsoluteRanks([1, -1, 0, 3]);
  assert.deepEqual(ranking.ranks, [1.5, 1.5, null, 3]);
  const result = calculateWilcoxonSignedRank('0, 1\n0, -1\n5, 5\n0, 3');
  assert.equal(result.zeroDifferenceCount, 1);
  assert.equal(result.nonzeroCount, 3);
  assert.equal(result.tiedGroups[0].rank, 1.5);
  assert.deepEqual(result.pairs.map(({ signedRank }) => signedRank), [1.5, -1.5, 0, 3]);
});

test('large samples use a documented continuity-corrected normal approximation', () => {
  const source = Array.from({ length: WILCOXON_LIMITS.exactMaxNonzero + 1 }, (_, index) => `0, ${index + 1}`).join('\n');
  const result = calculateWilcoxonSignedRank(source);
  assert.match(result.method, /normal approximation with continuity correction/u);
  assert.ok(result.pValue >= 0 && result.pValue <= 1);
  assert.ok(Number.isFinite(result.zStatistic));
});

test('Arabic digits, decimal punctuation, boundaries and malformed pairs are checked', () => {
  assert.deepEqual(parseWilcoxonPairs('٠٫٥، ١٫٥\n۲؛ ٣').map(({ before, after }) => [before, after]), [[0.5, 1.5], [2, 3]]);
  assert.throws(() => parseWilcoxonPairs('1,2'), /between 2/u);
  assert.throws(() => parseWilcoxonPairs('1,2,3\n4,5'), /exactly two/u);
  assert.throws(() => parseWilcoxonPairs('1000000000001,2\n3,4'), /±1,000,000,000,000/u);
  assert.throws(() => parseWilcoxonPairs(`${'0,1\n'.repeat(WILCOXON_LIMITS.maxPairs + 1)}`), /between 2/u);
});
