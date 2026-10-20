import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateBrazilSeguroDesemprego2026 } from './logic.mjs';

test('applies the first salary bracket and the 2026 statutory floor', () => {
  assert.equal(estimateBrazilSeguroDesemprego2026(2000, '2026-10-20').installment, 1621);
});
test('applies the middle bracket and fixed maximum', () => {
  assert.equal(estimateBrazilSeguroDesemprego2026(2500, '2026-10-20').installment, 1916.66);
  assert.equal(estimateBrazilSeguroDesemprego2026(4000, '2026-10-20').installment, 2518.65);
});
test('rejects invalid wages and expires before next annual adjustment', () => {
  assert.throws(() => estimateBrazilSeguroDesemprego2026(-1, '2026-10-20'), { code: 'invalid-wage' });
  assert.throws(() => estimateBrazilSeguroDesemprego2026(2500, '2027-01-11'), { code: 'rules-review-due' });
});
