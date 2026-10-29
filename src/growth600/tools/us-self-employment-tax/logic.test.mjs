import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateSelfEmploymentTax } from './logic.mjs';

test('2026 estimate applies 92.35%, 12.4%, 2.9%, and the one-half deduction', () => {
  const r = calculateSelfEmploymentTax({ netBusinessProfit: 100000 });
  assert.equal(r.netEarnings, 92350);
  assert.equal(r.socialSecurityTax, 11451.4);
  assert.equal(r.medicareTax, 2678.15);
  assert.equal(r.totalTax, 14129.55);
  assert.equal(r.deductibleHalf, 7064.78);
});

test('coordinates the social security wage base with W-2 social security wages', () => {
  const r = calculateSelfEmploymentTax({ netBusinessProfit: 100000, socialSecurityWages: 100000 });
  assert.equal(r.remainingSocialSecurityBase, 84500);
  assert.equal(r.socialSecurityTaxableEarnings, 84500);
  assert.equal(r.socialSecurityTax, 10478);
  assert.equal(r.medicareTax, 2678.15);
});

test('medicare remains uncapped when W-2 wages use all of the social security base', () => {
  const r = calculateSelfEmploymentTax({ netBusinessProfit: 200000, socialSecurityWages: 184500 });
  assert.equal(r.socialSecurityTax, 0);
  assert.equal(r.medicareTax, 5356.3);
});

test('applies the $400 net earnings filing threshold and rejects unsupported rules or amounts', () => {
  assert.equal(calculateSelfEmploymentTax({ netBusinessProfit: 400 }).totalTax, 0);
  assert.ok(calculateSelfEmploymentTax({ netBusinessProfit: 500 }).totalTax > 0);
  assert.throws(() => calculateSelfEmploymentTax({ netBusinessProfit: -1 }), RangeError);
  assert.throws(() => calculateSelfEmploymentTax({ netBusinessProfit: 100, taxYear: 2027 }), RangeError);
});
