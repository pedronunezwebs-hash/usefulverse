import assert from 'node:assert/strict';
import test from 'node:test';
import { addNetWorthSnapshot, calculateNetWorth, compareNetWorthSnapshots, exportNetWorthCsv } from './logic.mjs';

test('calculates asset totals, liabilities, net worth and debt-to-asset ratio by category', () => {
  const result = calculateNetWorth([
    { type: 'asset', category: 'Cash', amount: 10_000 },
    { type: 'asset', category: 'Investments', amount: 90_000 },
    { type: 'liability', category: 'Mortgage', amount: 30_000 },
    { type: 'liability', category: 'Card', amount: 10_000 },
  ]);
  assert.equal(result.totalAssets, 100_000);
  assert.equal(result.totalLiabilities, 40_000);
  assert.equal(result.netWorth, 60_000);
  assert.equal(result.debtToAssetPercent, 40);
  assert.equal(result.assetCategories.length, 2);
});

test('accepts zero balances, but validates categories, amount bounds and aggregate overflow', () => {
  assert.equal(calculateNetWorth([{ type: 'asset', category: 'Cash', amount: 0 }]).netWorth, 0);
  assert.equal(calculateNetWorth([{ type: 'liability', category: 'Debt', amount: 10 }]).debtToAssetPercent, null);
  assert.throws(() => calculateNetWorth([{ type: 'other', category: 'Unknown', amount: 3 }]), /balance item/u);
  assert.throws(() => calculateNetWorth([{ type: 'asset', category: 'Cash', amount: -1 }]), /non-negative/u);
  assert.throws(() => calculateNetWorth([{ type: 'asset', category: 'Cash', amount: 1e13 }]), /non-negative/u);
  assert.throws(() => calculateNetWorth(Array.from({ length: 101 }, (_, index) => ({ type: 'asset', category: String(index), amount: 1 }))), /100/u);
});

test('stores date-validated local snapshots, replaces same-date entries and compares only matching currencies', () => {
  let snapshots = addNetWorthSnapshot([], { date: '2026-01-31', currency: 'USD', items: [{ type: 'asset', category: 'Cash', amount: 10 }] });
  snapshots = addNetWorthSnapshot(snapshots, { date: '2026-02-28', currency: 'USD', items: [{ type: 'asset', category: 'Cash', amount: 15 }] });
  snapshots = addNetWorthSnapshot(snapshots, { date: '2026-02-28', currency: 'USD', items: [{ type: 'asset', category: 'Cash', amount: 20 }] });
  assert.equal(snapshots.length, 2);
  assert.deepEqual(compareNetWorthSnapshots(snapshots[1], snapshots[0]), { change: 10, percentChange: 100 });
  assert.equal(compareNetWorthSnapshots({ ...snapshots[1], currency: 'EUR' }, snapshots[0]), null);
  assert.throws(() => addNetWorthSnapshot([], { date: '2026-02-30', currency: 'USD', items: [] }), /valid snapshot date/u);
});

test('CSV export quotes values and neutralizes spreadsheet formulas', () => {
  const snapshots = addNetWorthSnapshot([], { date: '2026-01-01', currency: 'USD', items: [{ type: 'asset', category: '=IMPORT("x")', amount: 20 }] });
  const csv = exportNetWorthCsv(snapshots);
  assert.match(csv, /"'=IMPORT\(""x""\)"/u);
  assert.match(csv, /"20"/u);
});
