import test from 'node:test';
import assert from 'node:assert/strict';
import { validateVideoTimeline } from './logic.mjs';

const clip = (duration, start = 0, end = duration, size = 1024) => ({ file: { size }, duration, start, end });

test('video editor accepts up to three clips and totals only selected trim durations', () => {
  const result = validateVideoTimeline([clip(20, 2, 8), clip(30, 10, 20), clip(40, 0, 4)]);
  assert.equal(result.clips.length, 3);
  assert.equal(result.totalDuration, 20);
  assert.equal(result.totalBytes, 3072);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.clips), true);
});

test('video editor enforces clip count, duration, size and valid trim boundaries', () => {
  assert.throws(() => validateVideoTimeline([]), RangeError);
  assert.throws(() => validateVideoTimeline([clip(1), clip(1), clip(1), clip(1)]), RangeError);
  assert.throws(() => validateVideoTimeline([clip(121)]), RangeError);
  assert.throws(() => validateVideoTimeline([clip(1, 0, 1, 100), clip(1, 0, 1, 101)], { maxBytes: 200 }), RangeError);
  for (const invalid of [clip(0), clip(10, -1, 4), clip(10, 4, 4), clip(10, 0, 11), clip(10, Number.NaN, 4)]) {
    assert.throws(() => validateVideoTimeline([invalid]), RangeError);
  }
});

test('video editor accepts exact configured duration and byte limits', () => {
  const result = validateVideoTimeline([clip(60, 0, 60, 100), clip(60, 0, 60, 100)], { maxDuration: 120, maxBytes: 200 });
  assert.equal(result.totalDuration, 120);
  assert.equal(result.totalBytes, 200);
});
