import test from 'node:test';
import assert from 'node:assert/strict';
import { projectIndiaPpf } from '../pending-23/logic.mjs';

test('PPF projection applies each annual contribution before interest and reconciles totals', () => {
  const result = projectIndiaPpf({ annualDeposit: 1000, annualRate: 7.1, years: 2 });
  assert.deepEqual(result.schedule.map(({ openingBalance, interest, balance }) => ({ openingBalance, interest, balance })), [
    { openingBalance: 0, interest: 71, balance: 1071 },
    { openingBalance: 1071, interest: 147.04, balance: 2218.04 },
  ]);
  assert.equal(result.totalDeposits, 2000);
  assert.equal(result.totalInterest, 218.04);
  assert.equal(result.maturityValue, result.totalDeposits + result.totalInterest);
});

test('PPF projection bounds rate, amount and whole-year term', () => {
  for (const input of [{ annualDeposit: -1 }, { annualRate: 100.01 }, { years: 1.5 }, { years: 16 }]) {
    assert.throws(() => projectIndiaPpf({ annualDeposit: 1000, annualRate: 7.1, years: 2, ...input }));
  }
});
