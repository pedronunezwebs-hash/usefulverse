import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateNorwayCompanyCarBenefit } from './norway-company-car.mjs';

test('2026 list-price tiers apply 30% then 20%', () => {
  const result = calculateNorwayCompanyCarBenefit({ listPriceNewNok: 500000, marginalTaxRatePct: 30 });
  assert.equal(result.annualTaxableBenefitNok, 137030);
  assert.equal(result.estimatedPersonalTaxNok, 41109);
});

test('vehicle over three years old uses 75% base', () => {
  const result = calculateNorwayCompanyCarBenefit({ listPriceNewNok: 500000, olderThanThreeYearsOnJan1: true });
  assert.equal(result.reducedListPriceNok, 375000);
  assert.equal(result.annualTaxableBenefitNok, 112030);
});

test('documented work mileage must exceed 40,000 km', () => {
  const exact = calculateNorwayCompanyCarBenefit({ listPriceNewNok: 400000, documentedWorkKm: 40000, hasMileageLog: true });
  const above = calculateNorwayCompanyCarBenefit({ listPriceNewNok: 400000, documentedWorkKm: 40001, hasMileageLog: true });
  const undocumented = calculateNorwayCompanyCarBenefit({ listPriceNewNok: 400001, documentedWorkKm: 50000, hasMileageLog: false });
  assert.equal(exact.highMileageEligible, false);
  assert.equal(above.reducedListPriceNok, 300000);
  assert.equal(undocumented.highMileageEligible, false);
});

test('age and documented high work mileage reductions combine', () => {
  const result = calculateNorwayCompanyCarBenefit({ listPriceNewNok: 800000, olderThanThreeYearsOnJan1: true, documentedWorkKm: 40001, hasMileageLog: true });
  assert.equal(result.baseFactor, 0.5625);
  assert.equal(result.reducedListPriceNok, 450000);
  assert.equal(result.annualTaxableBenefitNok, 127030);
});

test('part-year availability prorates by entered commenced months', () => {
  const annual = calculateNorwayCompanyCarBenefit({ listPriceNewNok: 300000 });
  const partial = calculateNorwayCompanyCarBenefit({ listPriceNewNok: 300000, monthsAvailable: 5 });
  assert.equal(partial.taxableBenefitNok, annual.taxableBenefitNok * 5 / 12);
});

test('own-car comparison is contextual and marginal rate estimates tax only', () => {
  const result = calculateNorwayCompanyCarBenefit({ listPriceNewNok: 300000, marginalTaxRatePct: 30, ownCarAnnualCostNok: 50000 });
  assert.equal(result.estimatedPersonalTaxNok, 27000);
  assert.equal(result.contextDifferenceOwnCostMinusEstimatedTaxNok, 23000);
});

test('invalid data is rejected', () => {
  assert.throws(() => calculateNorwayCompanyCarBenefit({ listPriceNewNok: 0 }), RangeError);
  assert.throws(() => calculateNorwayCompanyCarBenefit({ listPriceNewNok: 100000, monthsAvailable: 13 }), RangeError);
  assert.throws(() => calculateNorwayCompanyCarBenefit({ listPriceNewNok: 100000, marginalTaxRatePct: 101 }), RangeError);
});
