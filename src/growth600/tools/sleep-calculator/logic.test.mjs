import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateSleepTime } from './logic.mjs';

test('calculates in-bed time from wake time, sleep duration and latency', () => {
  assert.deepEqual(calculateSleepTime({ time: '07:00', durationHours: 8, latencyMinutes: 0 }), { time: '23:00', dayOffset: -1, direction: 'bedtime', sleepMinutes: 480, latencyMinutes: 0 });
  assert.equal(calculateSleepTime({ time: '07:00', durationHours: 8, latencyMinutes: 15 }).time, '22:45');
});

test('calculates wake time from bedtime and marks next-day rollover', () => {
  assert.deepEqual(calculateSleepTime({ time: '23:00', durationHours: 8, latencyMinutes: 0, direction: 'wake' }), { time: '07:00', dayOffset: 1, direction: 'wake', sleepMinutes: 480, latencyMinutes: 0 });
  assert.equal(calculateSleepTime({ time: '05:00', durationHours: 7, latencyMinutes: 15, direction: 'wake' }).time, '12:15');
});

test('keeps same-day results and supports fractional quarter-hour duration', () => {
  assert.equal(calculateSleepTime({ time: '20:00', durationHours: 8, durationMinutes: 30, latencyMinutes: 0 }).time, '11:30');
  assert.equal(calculateSleepTime({ time: '20:00', durationHours: 3, direction: 'wake' }).dayOffset, 0);
});

test('rejects invalid times, durations, latency and direction', () => {
  for (const options of [
    { time: '24:00', durationHours: 8 }, { time: '07:00', durationHours: 0 }, { time: '07:00', durationHours: 17 },
    { time: '07:00', durationHours: 8, durationMinutes: 10 }, { time: '07:00', durationHours: 8, latencyMinutes: -1 },
    { time: '07:00', durationHours: 8, latencyMinutes: 181 }, { time: '07:00', durationHours: 8, direction: 'cycles' },
  ]) assert.throws(() => calculateSleepTime(options), RangeError);
});
