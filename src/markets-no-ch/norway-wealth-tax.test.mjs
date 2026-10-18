import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateNorwayWealthTax, compareNorwayWealthTaxSensitivity, norwayWealthTaxRules2026 } from './norway-wealth-tax.mjs';

test('2026 rates, asset discounts, proportional debt reduction and municipal/state split', () => {
  const result = calculateNorwayWealthTax({ primaryHome: 10_000_000, secondaryHome: 2_000_000, shares: 1_000_000, businessAssets: 500_000, cashOther: 300_000, debt: 3_800_000 });
  assert.equal(result.year, 2026);
  assert.equal(result.taxableValues.primaryHome, 2_500_000);
  assert.equal(result.taxableValues.secondaryHome, 2_000_000);
  assert.equal(result.taxableValues.shares, 800_000);
  assert.equal(result.taxableValues.businessAssets, 350_000);
  assert.equal(result.taxableAssets, 5_950_000);
  assert.equal(result.debtReduction, 96_377);
  assert.equal(result.deductibleDebt, 3_703_623);
  assert.equal(result.netWealth, 2_246_377);
  assert.equal(result.taxableWealth, 346_377);
  assert.equal(result.municipalTax, 1_212);
  assert.equal(result.stateTax, 2_251);
  assert.equal(result.totalTax, result.municipalTax + result.stateTax);
});

test('primary residence uses 25% through NOK 14m and 70% above it', () => {
  const result = calculateNorwayWealthTax({ primaryHome: 15_000_000 });
  assert.equal(result.taxableValues.primaryHome, 4_200_000);
});

test('secondary homes and cash do not receive a valuation discount in 2026', () => {
  const result = calculateNorwayWealthTax({ secondaryHome: 5_000_000, cashOther: 2_000_000, debt: 1_000_000 });
  assert.equal(result.taxableAssets, 7_000_000);
  assert.equal(result.debtReduction, 0);
  assert.equal(result.deductibleDebt, 1_000_000);
});

test('debt assigned to discounted shares and business assets is reduced by the matching percentage', () => {
  const result = calculateNorwayWealthTax({ shares: 2_000_000, businessAssets: 1_000_000, cashOther: 1_000_000, debt: 1_000_000 });
  assert.equal(result.debtReduction, 175_000);
  assert.equal(result.deductibleDebt, 825_000);
});

test('matches Skatteetaten debt-allocation example for a home, shares and bank deposits', () => {
  const result = calculateNorwayWealthTax({ primaryHome: 4_800_000, shares: 1_000_000, cashOther: 200_000, debt: 1_800_000 });
  assert.equal(result.taxableValues.primaryHome, 1_200_000);
  assert.equal(result.taxableValues.shares, 800_000);
  assert.equal(result.taxableAssets, 2_200_000);
  assert.equal(result.debtReduction, 60_000);
  assert.equal(result.deductibleDebt, 1_740_000);
  assert.equal(result.netWealth, 460_000);
});

test('allowance and second state band double for a jointly taxed couple', () => {
  const single = calculateNorwayWealthTax({ cashOther: 2_000_000 });
  const couple = calculateNorwayWealthTax({ cashOther: 2_000_000, jointlyTaxed: true });
  assert.equal(single.allowance, 1_900_000);
  assert.equal(single.totalTax, 1_000);
  assert.equal(couple.allowance, 3_800_000);
  assert.equal(couple.totalTax, 0);
  assert.equal(calculateNorwayWealthTax({ cashOther: 43_000_000, jointlyTaxed: true }).stateSecondBandTax, 0);
  assert.ok(calculateNorwayWealthTax({ cashOther: 43_000_000 }).stateSecondBandTax > 0);
});

test('tax is zero at or below the single-person exemption and begins above it', () => {
  for (const value of [0, 1_899_999, 1_900_000]) assert.equal(calculateNorwayWealthTax({ cashOther: value }).totalTax, 0);
  assert.equal(calculateNorwayWealthTax({ cashOther: 1_900_100 }).totalTax, 1);
});

test('municipal rate is capped at the official 0.35% maximum', () => {
  assert.throws(() => calculateNorwayWealthTax({ cashOther: 5_000_000, municipalRate: 0.004 }), RangeError);
  assert.equal(calculateNorwayWealthTax({ cashOther: 5_000_000, municipalRate: 0 }).municipalTax, 0);
});

test('sensitivity compares lower/base/higher declared home values without changing other assets', () => {
  const result = compareNorwayWealthTaxSensitivity({ primaryHome: 12_000_000, shares: 2_000_000, debt: 2_000_000 }, 0.1);
  assert.equal(result.percentage, 0.1);
  assert.ok(result.low.totalTax < result.base.totalTax);
  assert.ok(result.high.totalTax > result.base.totalTax);
  assert.equal(result.base.taxableValues.shares, 1_600_000);
  assert.throws(() => compareNorwayWealthTaxSensitivity({}, 0.6), RangeError);
});

test('rejects invalid values and invalid household switches', () => {
  assert.throws(() => calculateNorwayWealthTax({ shares: -1 }), RangeError);
  assert.throws(() => calculateNorwayWealthTax({ primaryHome: 10_000_000_001 }), RangeError);
  assert.throws(() => calculateNorwayWealthTax({ jointlyTaxed: 'yes' }), TypeError);
  assert.equal(norwayWealthTaxRules2026.year, 2026);
});
