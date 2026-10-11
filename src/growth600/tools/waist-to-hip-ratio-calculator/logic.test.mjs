import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateWaistHipRatio } from './logic.mjs';

test('80 cm waist divided by 100 cm hips returns the unitless 0.8 ratio', () => {
  assert.equal(calculateWaistHipRatio({ waist: '80', hip: '100', unit: 'cm' }).ratio, 0.8);
});

test('equivalent inch measurements return the same ratio and preserve the chosen unit', () => {
  const result = calculateWaistHipRatio({ waist: '32', hip: '40', unit: 'in' });
  assert.equal(result.ratio, 0.8);
  assert.equal(result.unit, 'in');
});

test('does not impose sex-, age- or population-specific health categories', () => {
  assert.equal(calculateWaistHipRatio({ waist: '110', hip: '90', unit: 'cm' }).ratio, 110 / 90);
});

test('rejects zero, negative, non-finite, excessive measurements and unsupported units', () => {
  for (const waist of ['0', '-1', 'NaN', 'Infinity', '500.1']) {
    assert.throws(() => calculateWaistHipRatio({ waist, hip: '100', unit: 'cm' }));
  }
  assert.throws(() => calculateWaistHipRatio({ waist: '80', hip: '0', unit: 'cm' }));
  assert.throws(() => calculateWaistHipRatio({ waist: '80', hip: '100', unit: 'm' }));
});
