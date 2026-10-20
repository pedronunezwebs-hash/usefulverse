import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateRothConversion } from './logic.mjs';

test('reports tax due and the three distinct account balance assumptions', () => {
  const result = estimateRothConversion({ amount: 10_000, currentRatePercent: 20, futureRatePercent: 25, annualReturnPercent: 0, years: 1 });
  assert.equal(result.taxDueNow, 2_000);
  assert.equal(result.rothIfTaxPaidOutside, 10_000);
  assert.equal(result.rothIfTaxWithheld, 8_000);
  assert.equal(result.traditionalAfterTax, 7_500);
});

test('compounds the converted amount under the entered annual return', () => {
  const result = estimateRothConversion({ amount: 10_000, currentRatePercent: 20, futureRatePercent: 25, annualReturnPercent: 10, years: 2 });
  assert.equal(result.rothIfTaxPaidOutside, 12_100);
  assert.equal(result.rothIfTaxWithheld, 9_680);
  assert.equal(result.traditionalAfterTax, 9_075);
});

test('rejects unsupported or fractional horizons and non-finite assumptions', () => {
  for (const years of [0, 1.5, 81, Infinity]) assert.throws(() => estimateRothConversion({ amount: 100, currentRatePercent: 20, futureRatePercent: 20, annualReturnPercent: 0, years }));
  assert.throws(() => estimateRothConversion({ amount: 100, currentRatePercent: 61, futureRatePercent: 20, annualReturnPercent: 0, years: 1 }));
});
