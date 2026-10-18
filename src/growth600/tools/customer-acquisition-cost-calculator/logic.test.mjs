import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateCustomerAcquisitionCost } from './logic.mjs';

const base = { marketingSpend: 1000, salesSpend: 0, toolsSpend: 0, agencySpend: 0, otherSpend: 0, newCustomers: 10, monthlyRevenuePerCustomer: 50, grossMarginPercent: 80, currency: 'USD' };

test('computes total acquisition spend, CAC and gross-profit payback', () => {
  const result = calculateCustomerAcquisitionCost(base);
  assert.equal(result.totalSpend, 1000);
  assert.equal(result.cac, 100);
  assert.equal(result.monthlyGrossProfit, 40);
  assert.equal(result.paybackMonths, 2.5);
});

test('adds all acquisition cost categories and accepts zero spend', () => {
  const result = calculateCustomerAcquisitionCost({ ...base, marketingSpend: 0, salesSpend: 300, toolsSpend: 50, agencySpend: 150, otherSpend: 25 });
  assert.equal(result.totalSpend, 525);
  assert.equal(result.cac, 52.5);
});

test('reports payback as unavailable when gross profit per customer is zero', () => {
  assert.equal(calculateCustomerAcquisitionCost({ ...base, grossMarginPercent: 0 }).paybackMonths, null);
  assert.equal(calculateCustomerAcquisitionCost({ ...base, monthlyRevenuePerCustomer: 0 }).paybackMonths, null);
});

test('rejects zero customers, fractional customers, negative costs and out-of-range margin', () => {
  for (const change of [{ newCustomers: 0 }, { newCustomers: 1.5 }, { marketingSpend: -1 }, { grossMarginPercent: 100.1 }]) {
    assert.throws(() => calculateCustomerAcquisitionCost({ ...base, ...change }));
  }
});

test('rejects invalid currency and numeric overflow', () => {
  assert.throws(() => calculateCustomerAcquisitionCost({ ...base, currency: 'US' }), /three-letter/u);
  assert.throws(() => calculateCustomerAcquisitionCost({ ...base, currency: 'ZZZ' }), /supported/u);
  assert.throws(() => calculateCustomerAcquisitionCost({ ...base, marketingSpend: 'Infinity' }), /Marketing spend/u);
});
