import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateFranceIncomeTax2025 } from './logic.mjs';

test('applies official 2025 taxable income rates per tax part', () => {
  const result = estimateFranceIncomeTax2025(30000);
  assert.equal(result.tax, 2104); assert.equal(result.marginalRate, 0.30); assert.equal(result.taxYear, '2025');
});
test('returns no tax through the zero-rate threshold and progressive marginal slices', () => {
  assert.equal(estimateFranceIncomeTax2025(11600).tax, 0);
  const result = estimateFranceIncomeTax2025(100000);
  assert.equal(result.breakdown.length, 4); assert.equal(result.marginalRate, 0.41);
  assert.equal(result.tax, 24801);
});
test('rejects negative or excessive income', () => {
  assert.throws(() => estimateFranceIncomeTax2025(-1), { code: 'invalid-income' });
  assert.throws(() => estimateFranceIncomeTax2025(100000001), { code: 'invalid-income' });
});
