import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateDebtToIncome } from './logic.mjs';

test('calculates front-end housing ratio and total DTI from gross monthly income', () => {
  const result = calculateDebtToIncome({ grossMonthlyIncome: 5000, housingPayment: 1200, monthlyDebts: [500, 300] });
  assert.equal(result.housingRatio, 24);
  assert.equal(result.totalMonthlyDebt, 2000);
  assert.equal(result.totalRatio, 40);
});

test('matches the plan acceptance example when 2,000 debt is compared with 5,000 income', () => {
  assert.equal(calculateDebtToIncome({ grossMonthlyIncome: 5000, monthlyDebts: [2000] }).totalRatio, 40);
});

test('validates incomplete, negative, non-finite and oversized values', () => {
  for (const input of [
    { grossMonthlyIncome: 0 }, { grossMonthlyIncome: -1 }, { grossMonthlyIncome: 5000, housingPayment: -1 },
    { grossMonthlyIncome: 5000, monthlyDebts: [''] }, { grossMonthlyIncome: 5000, monthlyDebts: [Infinity] },
    { grossMonthlyIncome: 5000, monthlyDebts: Array(21).fill(1) },
  ]) assert.throws(() => calculateDebtToIncome(input), RangeError);
});

test('all zero obligations produce zero ratios while income remains required', () => {
  assert.deepEqual(calculateDebtToIncome({ grossMonthlyIncome: 2500 }), { grossMonthlyIncome: 2500, housingPayment: 0, otherDebtTotal: 0, totalMonthlyDebt: 0, housingRatio: 0, totalRatio: 0 });
});
