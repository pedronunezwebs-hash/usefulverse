import test from 'node:test';
import assert from 'node:assert/strict';
import { INTERVAL_TIMER_LIMITS, intervalPhaseAt, normalizeIntervalConfig } from './logic.mjs';

test('validates bounded whole-second settings and calculates total time without a trailing rest', () => {
  const config = normalizeIntervalConfig({ workSeconds: 20, restSeconds: 10, rounds: 8 });
  assert.equal(config.totalSeconds, 230);
  assert.equal(normalizeIntervalConfig({ workSeconds: 60, restSeconds: 30, rounds: 4, prepSeconds: 5 }).totalSeconds, 335);
  assert.throws(() => normalizeIntervalConfig({ workSeconds: 0, restSeconds: 10, rounds: 2 }), RangeError);
  assert.throws(() => normalizeIntervalConfig({ workSeconds: 1.5, restSeconds: 10, rounds: 2 }), RangeError);
  assert.throws(() => normalizeIntervalConfig({ workSeconds: 1, restSeconds: 3_601, rounds: 2 }), RangeError);
  assert.throws(() => normalizeIntervalConfig({ workSeconds: 1, restSeconds: 0, rounds: 100 }), RangeError);
  assert.deepEqual(INTERVAL_TIMER_LIMITS, { maxWorkSeconds: 7_200, maxRestSeconds: 3_600, maxPrepSeconds: 300, maxRounds: 99 });
});

test('runs work/rest phases in order and omits rest after the final round', () => {
  const config = normalizeIntervalConfig({ workSeconds: 20, restSeconds: 10, rounds: 2 });
  assert.deepEqual([0, 19, 20, 29, 30, 49].map((time) => intervalPhaseAt(config, time).phase), ['work', 'work', 'rest', 'rest', 'work', 'work']);
  assert.equal(intervalPhaseAt(config, 19).remainingSeconds, 1);
  assert.equal(intervalPhaseAt(config, 20).round, 1);
  assert.equal(intervalPhaseAt(config, 30).round, 2);
  assert.equal(intervalPhaseAt(config, 50).phase, 'complete');
  assert.equal(intervalPhaseAt(config, 80).elapsedSeconds, 50);
});

test('supports preparation, disabled rest, fractional elapsed time and exact boundaries', () => {
  const config = normalizeIntervalConfig({ workSeconds: 5, restSeconds: 0, rounds: 2, prepSeconds: 3 });
  assert.equal(intervalPhaseAt(config, 0).phase, 'prep');
  assert.equal(intervalPhaseAt(config, 3).phase, 'work');
  assert.equal(intervalPhaseAt(config, 7.5).remainingSeconds, 0.5);
  assert.equal(intervalPhaseAt(config, 8).round, 2);
  assert.equal(intervalPhaseAt(config, 13).phase, 'complete');
  assert.throws(() => intervalPhaseAt(config, -1), RangeError);
  assert.throws(() => intervalPhaseAt(config, Number.NaN), RangeError);
});
