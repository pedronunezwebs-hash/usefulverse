import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateFourierSeries, parsePeriodicSamples } from './logic.mjs';

test('constant periodic signal has only DC and reconstructs without RMS error', () => {
  const result = calculateFourierSeries({ samples: Array(16).fill(5), period: 2, harmonics: 7 });
  assert.equal(result.dc, 5);
  assert.equal(result.fundamentalFrequency, 0.5);
  assert.ok(result.coefficients.every(({ a, b }) => a === 0 && b === 0));
  assert.ok(result.coefficients.every(({ phaseRadians }) => phaseRadians === 0));
  assert.ok(result.reconstruction.every((value) => value === 5));
  assert.equal(result.rmsError, 0);
});

test('sampled sine wave returns the expected first sine coefficient', () => {
  const samples = Array.from({ length: 32 }, (_, index) => 2 + 3 * Math.sin(2 * Math.PI * index / 32));
  const result = calculateFourierSeries({ samples, period: 4, harmonics: 3 });
  assert.ok(Math.abs(result.dc - 2) < 1e-12);
  assert.ok(Math.abs(result.coefficients[0].a) < 1e-12);
  assert.ok(Math.abs(result.coefficients[0].b - 3) < 1e-12);
  assert.ok(result.rmsError < 1e-12);
});

test('harmonic truncation reports reconstruction error for a square-wave sample', () => {
  const samples = Array.from({ length: 32 }, (_, index) => index < 16 ? 1 : -1);
  const one = calculateFourierSeries({ samples, harmonics: 1 });
  const many = calculateFourierSeries({ samples, harmonics: 15 });
  assert.equal(one.coefficients.length, 1);
  assert.ok(many.rmsError < one.rmsError);
});

test('sample text accepts semicolon/newline separated localized-ready numbers', () => {
  assert.deepEqual(parsePeriodicSamples('1; 2\n-3;4'), [1, 2, -3, 4]);
});

test('sample count, amplitude, period, and harmonic bounds are enforced', () => {
  assert.throws(() => calculateFourierSeries({ samples: [1, 2, 3] }), RangeError);
  assert.throws(() => calculateFourierSeries({ samples: [...Array(129)].map(() => 1) }), RangeError);
  assert.throws(() => calculateFourierSeries({ samples: [1, 2, 3, 1e13] }), RangeError);
  assert.throws(() => calculateFourierSeries({ samples: [1, 2, 3, 4], period: 0 }), RangeError);
  assert.throws(() => calculateFourierSeries({ samples: [1, 2, 3, 4], harmonics: 2 }), RangeError);
});

test('a period too small for a finite frequency is rejected', () => {
  assert.throws(() => calculateFourierSeries({ samples: [1, 2, 3, 4], period: Number.MIN_VALUE }), RangeError);
});
