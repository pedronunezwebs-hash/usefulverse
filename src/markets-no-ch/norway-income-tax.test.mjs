import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateNorwayIncomeTax, norwayTaxRules2026 } from './norway-income-tax.mjs';

test('salary calculation applies the standard deduction, personal allowance, five brackets and insurance', () => {
  const result = calculateNorwayIncomeTax({ income: 600_000 });
  assert.equal(result.year, 2026);
  assert.equal(result.standardDeduction, 95_700);
  assert.equal(result.ordinaryIncomeBase, 389_760);
  assert.equal(result.ordinaryIncomeTax, 85_747);
  assert.equal(result.bracketTax, 12_835);
  assert.equal(result.nationalInsurance, 45_600);
  assert.equal(result.pensionCredit, 0);
  assert.equal(result.tax, 144_182);
  assert.equal(result.net, 455_818);
});

test('national insurance lower threshold and 25 percent cap are respected at edge incomes', () => {
  assert.equal(calculateNorwayIncomeTax({ income: 99_650 }).nationalInsurance, 0);
  assert.equal(calculateNorwayIncomeTax({ income: 100_000 }).nationalInsurance, 88);
  assert.equal(calculateNorwayIncomeTax({ income: 300_000 }).nationalInsurance, 22_800);
});

test('tax brackets are continuous across each threshold', () => {
  for (const { from } of norwayTaxRules2026.brackets) {
    const below = calculateNorwayIncomeTax({ income: from - 1 }).bracketTax;
    const at = calculateNorwayIncomeTax({ income: from }).bracketTax;
    assert.ok(at >= below, `bracket tax fell at NOK ${from}`);
    assert.ok(at - below < 1, `unexpected jump at NOK ${from}`);
  }
});

test('pension credit follows both phase-down rates and cannot exceed calculated tax', () => {
  const below = calculateNorwayIncomeTax({ income: 284_950, type: 'pension' });
  const first = calculateNorwayIncomeTax({ income: 350_000, type: 'pension' });
  const second = calculateNorwayIncomeTax({ income: 480_000, type: 'pension' });
  assert.equal(below.pensionCredit, 36_434);
  assert.equal(first.pensionCredit, Math.round(37_100 - (350_000 - 284_950) * 0.167));
  assert.equal(second.pensionCredit, Math.round(37_100 - (436_050 - 284_950) * 0.167 - (480_000 - 436_050) * 0.06));
  assert.ok(below.pensionCredit <= below.ordinaryIncomeTax + below.bracketTax + below.nationalInsurance);
  assert.equal(calculateNorwayIncomeTax({ income: 10_000, type: 'pension' }).tax, 0);
});

test('measures zone uses the published special rate and deduction', () => {
  const standard = calculateNorwayIncomeTax({ income: 600_000 });
  const measures = calculateNorwayIncomeTax({ income: 600_000, zone: 'measuresZone' });
  assert.equal(measures.zoneDeduction, 45_000);
  assert.equal(measures.ordinaryIncomeBase, standard.ordinaryIncomeBase - 45_000);
  assert.ok(measures.ordinaryIncomeTax < standard.ordinaryIncomeTax);
  assert.equal(measures.bracketTax, standard.bracketTax);
  assert.equal(measures.nationalInsurance, standard.nationalInsurance);
});

test('invalid income, source type and zone are rejected', () => {
  assert.throws(() => calculateNorwayIncomeTax({ income: -1 }), RangeError);
  assert.throws(() => calculateNorwayIncomeTax({ income: 10_000_001 }), RangeError);
  assert.throws(() => calculateNorwayIncomeTax({ income: 10, type: 'mixed' }), TypeError);
  assert.throws(() => calculateNorwayIncomeTax({ income: 10, zone: 'unknown' }), TypeError);
});
