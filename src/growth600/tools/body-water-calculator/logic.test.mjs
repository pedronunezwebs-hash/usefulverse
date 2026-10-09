import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateTotalBodyWater } from './logic.mjs';

test('Watson adult equation reproduces male reference calculation', () => {
  const result = estimateTotalBodyWater({ age: 30, heightCm: 175, weightKg: 70, equation: 'male' });
  assert.ok(Math.abs(result.liters - 41.9212) < 1e-10);
  assert.ok(Math.abs(result.percent - 59.88742857142857) < 1e-10);
});

test('Watson adult equation reproduces female reference calculation', () => {
  const result = estimateTotalBodyWater({ age: 30, heightCm: 175, weightKg: 70, equation: 'female' });
  assert.ok(Math.abs(result.liters - 33.8725) < 1e-10);
});

test('rejects minors, out-of-domain measurements, and unknown equation', () => {
  for (const input of [
    { age: 17, heightCm: 175, weightKg: 70, equation: 'male' },
    { age: 30, heightCm: 0, weightKg: 70, equation: 'male' },
    { age: 30, heightCm: 175, weightKg: 0, equation: 'male' },
    { age: 30, heightCm: 175, weightKg: 70, equation: 'unknown' },
  ]) assert.throws(() => estimateTotalBodyWater(input));
});

test('rejects estimates inconsistent with body-mass limit', () => {
  assert.throws(() => estimateTotalBodyWater({ age: 18, heightCm: 230, weightKg: 25, equation: 'male' }));
});
