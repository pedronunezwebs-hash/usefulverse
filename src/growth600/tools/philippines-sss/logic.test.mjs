import test from 'node:test';
import assert from 'node:assert/strict';
import { estimatePhilippinesSss } from './logic.mjs';

test('SSS table matches 2025 minimum and contribution split', () => {
  assert.deepEqual(estimatePhilippinesSss(5000), { salary: 5000, msc: 5000, regularMsc: 5000, mpfMsc: 0, employerRegular: 500, employerMpf: 0, ecEmployer: 10, employerTotal: 510, employeeRegular: 250, employeeMpf: 0, employeeTotal: 250, combinedTotal: 760, tableYear: 2025, effectiveFrom: '2025-01-01' });
});
test('salary brackets round to the official nearest 500 MSC schedule', () => {
  assert.equal(estimatePhilippinesSss(5249.99).msc, 5000);
  assert.equal(estimatePhilippinesSss(5250).msc, 5500);
  assert.equal(estimatePhilippinesSss(24999).msc, 25000);
});
test('MPF is split 10/5 above 20000 MSC and MSC is capped', () => {
  const result = estimatePhilippinesSss(50000);
  assert.equal(result.msc, 35000); assert.equal(result.regularMsc, 20000); assert.equal(result.mpfMsc, 15000);
  assert.equal(result.employerTotal, 3530); assert.equal(result.employeeTotal, 1750); assert.equal(result.combinedTotal, 5280);
});
test('invalid compensation is rejected', () => { for (const value of [-1, Infinity, NaN, 'x']) assert.throws(() => estimatePhilippinesSss(value), { code: 'invalid-salary' }); });
