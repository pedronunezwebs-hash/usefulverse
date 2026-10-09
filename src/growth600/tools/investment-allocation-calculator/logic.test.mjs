import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateInvestmentAllocation } from './logic.mjs';

test('a 60/40 allocation of 10,000 targets 6,000 and 4,000 with weights totaling 100', () => {
  const result = calculateInvestmentAllocation({
    currency: 'USD', contribution: 0,
    assets: [
      { name: 'Fund A', currentValue: 6_000, targetWeight: 60 },
      { name: 'Fund B', currentValue: 4_000, targetWeight: 40 },
    ],
  });
  assert.equal(result.currentTotal, 10_000);
  assert.equal(result.weightTotal, 100);
  assert.equal(result.rows[0].targetValue, 6_000);
  assert.equal(result.rows[1].targetValue, 4_000);
  assert.equal(result.rows.reduce((sum, row) => sum + row.difference, 0), 0);
});

test('a new contribution is split by target weights and reflected in target changes', () => {
  const result = calculateInvestmentAllocation({
    currency: 'EUR', contribution: 4_000,
    assets: [
      { name: 'Equity', currentValue: 4_000, targetWeight: 60 },
      { name: 'Bonds', currentValue: 2_000, targetWeight: 40 },
    ],
  });
  assert.equal(result.projectedTotal, 10_000);
  assert.deepEqual(result.rows.map((row) => row.contributionShare), [2_400, 1_600]);
  assert.deepEqual(result.rows.map((row) => row.targetValue), [6_000, 4_000]);
  assert.deepEqual(result.rows.map((row) => row.difference), [2_000, 2_000]);
});

test('normalizes target weights within the advertised rounding tolerance', () => {
  const result = calculateInvestmentAllocation({
    assets: [
      { name: 'A', currentValue: 1, targetWeight: 60 },
      { name: 'B', currentValue: 1, targetWeight: 39.995 },
    ],
  });
  assert.equal(result.rows.reduce((sum, row) => sum + row.targetValue, 0), 2);
  assert.ok(Math.abs(result.rows[0].normalizedWeight + result.rows[1].normalizedWeight - 100) < 1e-10);
});

test('allows an explicitly zero target weight without losing rounding remainder', () => {
  const result = calculateInvestmentAllocation({
    assets: [
      { name: 'Cash', currentValue: 0, targetWeight: 0 },
      { name: 'A', currentValue: 2, targetWeight: 60 },
      { name: 'B', currentValue: 1, targetWeight: 40 },
    ],
  });
  assert.equal(result.rows[0].targetValue, 0);
  assert.equal(result.rows.reduce((sum, row) => sum + row.targetValue, 0), 3);
});

test('rejects invalid asset counts, currency, weights, names and amount boundaries', () => {
  const base = { currency: 'USD', contribution: 0, assets: [
    { name: 'A', currentValue: 1, targetWeight: 60 },
    { name: 'B', currentValue: 1, targetWeight: 40 },
  ] };
  assert.throws(() => calculateInvestmentAllocation({ ...base, assets: base.assets.slice(0, 1) }), /between 2 and 8/);
  assert.throws(() => calculateInvestmentAllocation({ ...base, currency: 'US' }), /three-letter/);
  assert.throws(() => calculateInvestmentAllocation({ ...base, assets: [{ ...base.assets[0], targetWeight: 61 }, base.assets[1]] }), /add up to 100/);
  assert.throws(() => calculateInvestmentAllocation({ ...base, assets: [{ ...base.assets[0], name: '' }, base.assets[1]] }), /needs a name/);
  assert.throws(() => calculateInvestmentAllocation({ ...base, contribution: -1 }), /between 0 and/);
  assert.throws(() => calculateInvestmentAllocation({ ...base, assets: [{ ...base.assets[0], currentValue: '1e20' }, base.assets[1]] }), /between 0 and/);
  assert.throws(() => calculateInvestmentAllocation({ ...base, contribution: 1_000_000_000_000 }), /cannot exceed/);
});
