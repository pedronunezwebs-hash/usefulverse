import assert from 'node:assert/strict';
import test from 'node:test';
import { parseNumberLineIntervals } from './logic.mjs';

test('acceptance interval keeps open and closed endpoints distinct', () => {
  const { intervals } = parseNumberLineIntervals('(1,3]');
  assert.deepEqual(intervals[0], { lower: 1, upper: 3, lowerClosed: false, upperClosed: true, point: false, source: '(1,3]' });
});

test('fractions, standalone points, multiple rows and negative zero normalize for plotting', () => {
  const result = parseNumberLineIntervals('[1/2, 3/2]\n-2\n[-3, -1)');
  assert.equal(result.intervals.length, 3);
  assert.equal(result.intervals[0].lower, 0.5);
  assert.equal(result.intervals[0].upper, 1.5);
  assert.equal(result.intervals[1].point, true);
  assert.ok(result.plotMin < -3 && result.plotMax > 1.5);
});

test('one-sided and fully unbounded intervals are accepted with open infinity', () => {
  assert.equal(parseNumberLineIntervals('(-∞, 2]').intervals[0].lower, -Infinity);
  assert.equal(parseNumberLineIntervals('[0, infinity)').intervals[0].upper, Infinity);
  assert.deepEqual(parseNumberLineIntervals('(-infinity, infinity)').intervals[0], { lower: -Infinity, upper: Infinity, lowerClosed: false, upperClosed: false, point: false, source: '(-infinity, infinity)' });
});

test('rejects empty, reversed, invalid, out-of-range and excessive inputs', () => {
  for (const input of ['', '(3, 1]', '(1, 1)', '[1, infinity]', '(-infinity, -infinity)', '[1/0, 2]', '(1, 1000000001]', 'hello']) {
    assert.throws(() => parseNumberLineIntervals(input), RangeError, input);
  }
  assert.throws(() => parseNumberLineIntervals(Array.from({ length: 21 }, () => '[0,1]').join('\n')), /no more than 20/u);
});
