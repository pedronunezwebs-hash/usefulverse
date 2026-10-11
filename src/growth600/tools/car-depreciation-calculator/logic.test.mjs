import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateCarDepreciation } from './logic.mjs';

test('10,000 with 10% annual depreciation becomes 9,000 after one year when distance is zero', () => {
  const result = calculateCarDepreciation({ purchasePrice: 10000, yearsOwned: 0, odometerAtPurchase: 0, currentDistance: 0, annualDistance: 0, annualDepreciationPercent: 10, distanceDepreciationPercent: 0, projectionYears: 1 });
  assert.equal(result.currentValue, 10000);
  assert.equal(result.projectedValue, 9000);
});

test('combines elapsed age and distance driven since purchase, then projects both factors', () => {
  const result = calculateCarDepreciation({ purchasePrice: 20000, yearsOwned: 2, odometerAtPurchase: 12000, currentDistance: 20000, annualDistance: 10000, annualDepreciationPercent: 10, distanceDepreciationPercent: 5, projectionYears: 2, distanceUnit: 'km', currency: 'EUR' });
  assert.ok(Math.abs(result.currentValue - 20000 * 0.9 ** 2 * 0.95 ** 0.8) < 1e-10);
  assert.ok(Math.abs(result.projectedValue - 20000 * 0.9 ** 4 * 0.95 ** 2.8) < 1e-10);
  assert.equal(result.schedule.at(-1).distance, 40000);
  assert.equal(result.schedule.at(-1).age, 4);
  assert.equal(result.currency, 'EUR');
});

test('zero rates preserve value and 100 percent rates reach zero without NaN', () => {
  const flat = calculateCarDepreciation({ purchasePrice: 12345, yearsOwned: 8, odometerAtPurchase: 0, currentDistance: 120000, annualDistance: 20000, annualDepreciationPercent: 0, distanceDepreciationPercent: 0, projectionYears: 10 });
  assert.equal(flat.projectedValue, 12345);
  const total = calculateCarDepreciation({ purchasePrice: 10000, yearsOwned: 0, odometerAtPurchase: 0, currentDistance: 0, annualDistance: 0, annualDepreciationPercent: 100, distanceDepreciationPercent: 0, projectionYears: 1 });
  assert.equal(total.projectedValue, 0);
});

test('validates blanks, non-integers, bounds, units and currency without mutating inputs', () => {
  const base = { purchasePrice: 10000, yearsOwned: 0, odometerAtPurchase: 0, currentDistance: 0, annualDistance: 0, annualDepreciationPercent: 10, distanceDepreciationPercent: 0, projectionYears: 1 };
  for (const change of [{ purchasePrice: '' }, { projectionYears: 1.2 }, { yearsOwned: -1 }, { annualDepreciationPercent: 101 }, { currentDistance: 1e8 }, { odometerAtPurchase: 1 }, { distanceUnit: 'yd' }, { currency: 'XXX' }]) {
    assert.throws(() => calculateCarDepreciation({ ...base, ...change }), RangeError);
  }
  assert.throws(() => calculateCarDepreciation({ ...base, odometerAtPurchase: 100, currentDistance: 99 }), /below the odometer at purchase/u);
  const input = { ...base };
  calculateCarDepreciation(input);
  assert.deepEqual(input, base);
});

test('equivalent odometer unit and distance rate preserve the mileage effect', () => {
  const common = { purchasePrice: 20000, yearsOwned: 1, odometerAtPurchase: 1000, annualDistance: 12000, annualDepreciationPercent: 10, projectionYears: 0 };
  const miles = calculateCarDepreciation({ ...common, currentDistance: 11000, distanceUnit: 'mi', distanceDepreciationPercent: 3 });
  const factor = 1.609344;
  const kmRate = 100 * (1 - (1 - 3 / 100) ** (1 / factor));
  const kilometers = calculateCarDepreciation({ ...common, currentDistance: 1000 + 10000 * factor, distanceUnit: 'km', distanceDepreciationPercent: kmRate });
  assert.ok(Math.abs(miles.currentValue - kilometers.currentValue) < 1e-9);
});
