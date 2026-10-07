import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateMulch } from './logic.mjs';

const sample = { shape: 'rectangle', length: 5, width: 4, bedCount: 1, areaUnit: 'm2', depth: 5, depthUnit: 'cm', bagVolume: 50, bagUnit: 'L' };

test('matches the plan acceptance example and rounds bags upward', () => {
  const result = calculateMulch(sample);
  assert.equal(result.areaM2, 20);
  assert.equal(result.volumeM3, 1);
  assert.equal(result.orderVolumeM3, 1);
  assert.equal(result.bags, 20);
});

test('supports repeated circular beds, imperial units, waste and optional cost', () => {
  const result = calculateMulch({ shape: 'circle', diameter: 10, bedCount: 2, areaUnit: 'ft2', depth: 2, depthUnit: 'in', bagVolume: 2, bagUnit: 'ft3', wastePercent: 10, pricePerBag: 5.25, currency: 'USD' });
  assert.ok(Math.abs(result.areaM2 - 14.5932) < 0.001);
  assert.ok(Math.abs(result.depthM - 0.0508) < 1e-12);
  assert.equal(result.bags, 15);
  assert.equal(result.estimatedCost, 78.75);
});

test('zero waste and zero-priced bags are valid and cost is not invented when omitted', () => {
  const free = calculateMulch({ ...sample, wastePercent: 0, pricePerBag: 0 });
  assert.equal(free.bags, 20);
  assert.equal(free.estimatedCost, 0);
  assert.equal(calculateMulch(sample).estimatedCost, null);
});

test('rejects invalid sizes, counts, units, negative cost and currency codes', () => {
  for (const invalid of [
    { ...sample, shape: 'triangle' }, { ...sample, length: 0 }, { ...sample, bedCount: 1.5 },
    { ...sample, depth: 0 }, { ...sample, wastePercent: 51 }, { ...sample, bagVolume: 0 },
    { ...sample, areaUnit: 'acre' }, { ...sample, pricePerBag: -1 },
    { ...sample, pricePerBag: 3, currency: 'US' },
    { ...sample, length: 100_000, width: 100_000, depth: 100, depthUnit: 'in', bagVolume: 0.1, bagUnit: 'L', pricePerBag: 1_000_000, currency: 'USD' },
  ]) assert.throws(() => calculateMulch(invalid), RangeError);
});
