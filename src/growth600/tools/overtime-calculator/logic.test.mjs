import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateOvertime } from './logic.mjs';

test('uses the entered threshold and multiplier without assuming a jurisdiction rule', () => {
  const result = calculateOvertime({ totalHours: 45, hourlyRate: 20, thresholdHours: 40, overtimeMultiplier: 1.5 });
  assert.deepEqual([result.regularHours, result.overtimeHours, result.regularPay, result.overtimePay, result.totalPay], [40, 5, 800, 150, 950]);
});

test('does not create overtime at or below the threshold', () => {
  assert.equal(calculateOvertime({ totalHours: 40, hourlyRate: 20, thresholdHours: 40, overtimeMultiplier: 1.5 }).overtimePay, 0);
  assert.equal(calculateOvertime({ totalHours: 12, hourlyRate: 18, thresholdHours: 40, overtimeMultiplier: 2 }).totalPay, 216);
});

test('supports zero hours and a user-selected threshold without inventing rules', () => {
  const zero = calculateOvertime({ totalHours: 0, hourlyRate: 20, thresholdHours: 40, overtimeMultiplier: 1.5 });
  assert.equal(zero.totalPay, 0); assert.equal(zero.blendedHourlyRate, null);
  assert.equal(calculateOvertime({ totalHours: 10, hourlyRate: 20, thresholdHours: 8, overtimeMultiplier: 2 }).totalPay, 240);
});

test('rejects invalid numbers, negative entries, excessive hours and multipliers', () => {
  for (const input of [
    { totalHours: -1, hourlyRate: 20, thresholdHours: 40, overtimeMultiplier: 1.5 },
    { totalHours: 169, hourlyRate: 20, thresholdHours: 40, overtimeMultiplier: 1.5 },
    { totalHours: 45, hourlyRate: -1, thresholdHours: 40, overtimeMultiplier: 1.5 },
    { totalHours: 45, hourlyRate: 20, thresholdHours: 40, overtimeMultiplier: 0.9 },
    { totalHours: Number.NaN, hourlyRate: 20, thresholdHours: 40, overtimeMultiplier: 1.5 },
  ]) assert.throws(() => calculateOvertime(input), RangeError);
});
