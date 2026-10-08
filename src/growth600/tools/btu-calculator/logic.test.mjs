import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateBtu } from './logic.mjs';

const normalRoom = { length: 12, width: 12, ceilingHeight: 8, dimensionUnit: 'ft', ceilingUnit: 'ft' };

test('uses the ENERGY STAR area band and exposes area and volume', () => {
  const result = calculateBtu(normalRoom);
  assert.equal(result.estimatedBtuPerHour, 5000);
  assert.equal(result.baseBtuPerHour, 5000);
  assert.equal(result.areaFt2, 144);
  assert.equal(result.volumeFt3, 1152);
});

test('applies transparent ceiling, insulation, sun, occupant and kitchen assumptions', () => {
  const result = calculateBtu({ ...normalRoom, ceilingHeight: 10, insulationAdjustmentPercent: 20, sunExposure: 'sunny', occupants: 4, kitchen: true });
  assert.equal(result.occupantAdjustmentBtuPerHour, 1200);
  assert.equal(result.kitchenAdjustmentBtuPerHour, 4000);
  assert.equal(result.estimatedBtuPerHour, 14_000);
});

test('converts metric inputs and never returns a negative value for zero floor area', () => {
  const metric = calculateBtu({ length: 3.6576, width: 3.6576, ceilingHeight: 2.4384, dimensionUnit: 'm', ceilingUnit: 'm' });
  assert.equal(metric.estimatedBtuPerHour, 5000);
  const zero = calculateBtu({ ...normalRoom, length: 0, insulationAdjustmentPercent: -30, sunExposure: 'shaded' });
  assert.equal(zero.estimatedBtuPerHour, 0);
  assert.ok(zero.estimatedBtuPerHour >= 0);
});

test('flags sub-100 sq ft rooms and rejects over-chart rooms, invalid units and assumptions', () => {
  assert.equal(calculateBtu({ ...normalRoom, length: 8, width: 10 }).belowReferenceBand, true);
  for (const input of [
    { ...normalRoom, length: 51, width: 50 }, { ...normalRoom, dimensionUnit: 'yd' },
    { ...normalRoom, insulationAdjustmentPercent: 51 }, { ...normalRoom, sunExposure: 'windy' },
    { ...normalRoom, occupants: 2.5 }, { ...normalRoom, kitchen: 'yes' },
  ]) assert.throws(() => calculateBtu(input), RangeError);
});
