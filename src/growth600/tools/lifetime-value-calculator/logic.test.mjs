import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateLifetimeValue } from './logic.mjs';

const sample = { monthlyRevenue: 100, grossMarginPercent: 50, monthlyChurnPercent: 5, customerAcquisitionCost: 100, currency: 'USD' };

test('matches the plan simple lifetime-value example', () => {
  const result = calculateLifetimeValue(sample);
  assert.equal(result.lifetimeValue, 1000);
  assert.equal(result.expectedLifetimeMonths, 20);
  assert.equal(result.monthlyGrossProfit, 50);
});

test('adds customer acquisition cost payback and LTV-to-CAC ratio without changing LTV', () => {
  const result = calculateLifetimeValue(sample);
  assert.equal(result.cacPaybackMonths, 2);
  assert.equal(result.lifetimeValueToCac, 10);
  assert.equal(calculateLifetimeValue({ ...sample, customerAcquisitionCost: 0 }).lifetimeValue, 1000);
  assert.equal(calculateLifetimeValue({ ...sample, customerAcquisitionCost: 0 }).lifetimeValueToCac, null);
});

test('handles zero margin without claiming revenue-based CAC payback', () => {
  const result = calculateLifetimeValue({ ...sample, grossMarginPercent: 0 });
  assert.equal(result.lifetimeValue, 0);
  assert.equal(result.cacPaybackMonths, null);
});

test('rejects zero churn, invalid margin, oversized values and invalid currency', () => {
  for (const invalid of [
    { ...sample, monthlyChurnPercent: 0 }, { ...sample, grossMarginPercent: 101 },
    { ...sample, monthlyRevenue: -1 }, { ...sample, customerAcquisitionCost: 1e12 }, { ...sample, currency: 'US' },
  ]) assert.throws(() => calculateLifetimeValue(invalid), RangeError);
});
