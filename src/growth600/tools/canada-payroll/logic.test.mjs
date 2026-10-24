import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateCanadaCppEi } from './logic.mjs';

test('calculates published 2026 annual CPP and EI maximums', () => {
  const result = estimateCanadaCppEi(85000, 40);
  assert.equal(result.cppBase, 3519.45); assert.equal(result.cppFirstAdditional, 711);
  assert.equal(result.cppSecondAdditional, 416); assert.equal(result.cppEmployee, 4646.45);
  assert.equal(result.eiEmployee, 1123.07); assert.equal(result.eiEmployer, 1572.3);
  assert.equal(result.employeeTotal, 5769.52); assert.equal(result.employerTotal, 6218.75);
});
test('uses basic exemption and income caps', () => {
  const result = estimateCanadaCppEi(1000000, 30);
  assert.equal(result.cppEmployee, 4646.45); assert.equal(result.eiEmployee, 1123.07);
  assert.equal(estimateCanadaCppEi(3500, 30).cppEmployee, 0);
});
test('rejects ages outside regular CPP employee scope and bad income', () => {
  assert.throws(() => estimateCanadaCppEi(50000, 17), { code: 'unsupported-age' });
  assert.throws(() => estimateCanadaCppEi(-1, 30), { code: 'invalid-income' });
});
test('expires 2026-only rates after the rate year', () => { assert.throws(() => estimateCanadaCppEi(50000, 30, '2027-01-01'), { code: 'table-expired' }); });
