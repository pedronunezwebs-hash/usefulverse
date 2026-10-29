import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateSingaporeCpf2026 } from './logic.mjs';

test('2026 full-rate contribution for a citizen or third-year PR age 55 and under', () => {
  assert.deepEqual(estimateSingaporeCpf2026(55, 8000), { age: 55, ordinaryWage: 8000, wageSubjectToCpf: 8000, employerRate: 17, employeeRate: 20, employer: 1360, employee: 1600, total: 2960, tableYear: 2026, effectiveFrom: '2026-01-01' });
});
test('applies 2026 age band changes and ordinary wage ceiling', () => {
  const result = estimateSingaporeCpf2026(60, 9000);
  assert.equal(result.wageSubjectToCpf, 8000); assert.equal(result.employerRate, 16); assert.equal(result.employeeRate, 18);
  assert.equal(result.total, 2720); assert.equal(result.employee, 1440); assert.equal(result.employer, 1280);
});
test('rounds total nearest dollar and employee share down', () => {
  const result = estimateSingaporeCpf2026(56, 751);
  assert.equal(result.total, 255); assert.equal(result.employee, 135); assert.equal(result.employer, 120);
});
test('rejects unsupported ages and wage bands', () => {
  assert.throws(() => estimateSingaporeCpf2026(15, 2000), { code: 'invalid-age' });
  assert.throws(() => estimateSingaporeCpf2026(30, 750), { code: 'unsupported-wage' });
});
test('fails closed when the 2026 rates expire', () => {
  assert.throws(() => estimateSingaporeCpf2026(35, 5000, '2027-01-01'), { code: 'table-expired' });
});
