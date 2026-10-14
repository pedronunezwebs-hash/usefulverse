import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateRentalYield } from './logic.mjs';

test('gross rental yield matches the plan acceptance example', () => {
  const result = calculateRentalYield({ propertyPrice: 200000, monthlyRent: 1000 });
  assert.equal(result.grossAnnualRent, 12000);
  assert.equal(result.grossYieldPercent, 6);
  assert.equal(result.netYieldPercent, 6);
});

test('net yield subtracts vacancy and annual property expenses without financing', () => {
  const result = calculateRentalYield({ propertyPrice: 200000, monthlyRent: 1000, vacancyPercent: 5, annualPropertyTax: 1800, annualMaintenance: 900, annualInsurance: 600, annualAssociationFees: 300 });
  assert.equal(result.vacancyLoss, 600);
  assert.equal(result.effectiveAnnualRent, 11400);
  assert.equal(result.totalAnnualExpenses, 3600);
  assert.equal(result.netOperatingIncome, 7800);
  assert.equal(result.netYieldPercent, 3.9);
  assert.equal(result.monthlyNetIncome, 650);
});

test('vacancy or expenses can produce a negative net income without invalidating the estimate', () => {
  const result = calculateRentalYield({ propertyPrice: 100000, monthlyRent: 500, vacancyPercent: 100, annualOtherExpenses: 1000 });
  assert.equal(result.grossYieldPercent, 6);
  assert.equal(result.netOperatingIncome, -1000);
  assert.equal(result.netYieldPercent, -1);
});

test('rejects zero price, invalid vacancy, negative costs, and out-of-range amounts', () => {
  assert.throws(() => calculateRentalYield({ propertyPrice: 0, monthlyRent: 100 }), /Property price/u);
  assert.throws(() => calculateRentalYield({ propertyPrice: 1, monthlyRent: 100, vacancyPercent: 101 }), /Vacancy rate/u);
  assert.throws(() => calculateRentalYield({ propertyPrice: 1, monthlyRent: 100, annualInsurance: -1 }), /Annual expense/u);
  assert.throws(() => calculateRentalYield({ propertyPrice: 1e13, monthlyRent: 100 }), /Property price/u);
  assert.throws(() => calculateRentalYield({ propertyPrice: 100000, monthlyRent: '' }), /Monthly rent/u);
});
