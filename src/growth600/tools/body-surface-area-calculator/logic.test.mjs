import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateBodySurfaceArea } from './logic.mjs';

test('calculates both formulas for the plan acceptance example', () => {
  const result = calculateBodySurfaceArea({ height: 170, weight: 70 });
  assert.ok(Math.abs(result.mosteller - 1.818) < 0.001);
  assert.ok(Math.abs(result.duBois - 1.809) < 0.002);
});

test('converts independent customary units to the same estimates', () => {
  const metric = calculateBodySurfaceArea({ height: 170, heightUnit: 'cm', weight: 70, weightUnit: 'kg' });
  const customary = calculateBodySurfaceArea({ height: 170 / 2.54, heightUnit: 'in', weight: 70 / 0.45359237, weightUnit: 'lb' });
  assert.ok(Math.abs(metric.mosteller - customary.mosteller) < 1e-12);
  assert.ok(Math.abs(metric.duBois - customary.duBois) < 1e-12);
});

test('rejects unsupported units, invalid values and out-of-scope measurements', () => {
  assert.throws(() => calculateBodySurfaceArea({ height: 170, heightUnit: 'ft', weight: 70 }), /supported/u);
  assert.throws(() => calculateBodySurfaceArea({ height: 0, weight: 70 }), /range/u);
  assert.throws(() => calculateBodySurfaceArea({ height: 260, weight: 70 }), /adult estimate range/u);
  assert.throws(() => calculateBodySurfaceArea({ height: 170, weight: 1_200, weightUnit: 'lb' }), /adult estimate range/u);
  assert.throws(() => calculateBodySurfaceArea({ height: Number.NaN, weight: 70 }), /range/u);
});
