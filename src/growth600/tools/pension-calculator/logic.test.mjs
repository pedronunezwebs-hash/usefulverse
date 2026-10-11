import test from 'node:test';
import assert from 'node:assert/strict';
import { calculatePension } from './logic.mjs';

const base = { finalSalary: 50000, yearsOfService: 30, accrualPercent: 2, commutationPercent: 0, commutationFactor: 12 };

test('matches the plan defined-benefit example', () => {
  const result = calculatePension(base);
  assert.equal(result.annualPension, 30000);
  assert.equal(result.monthlyPension, 2500);
});

test('shows annual benefit surrendered and derived lump sum transparently', () => {
  const result = calculatePension({ ...base, commutationPercent: 25, commutationFactor: 12 });
  assert.equal(result.annualPension, 30000);
  assert.equal(result.convertedAnnualPension, 7500);
  assert.equal(result.lumpSum, 90000);
  assert.equal(result.remainingAnnualPension, 22500);
});

test('zero service and zero accrual yield zero benefit', () => {
  assert.equal(calculatePension({ ...base, yearsOfService: 0 }).annualPension, 0);
  assert.equal(calculatePension({ ...base, accrualPercent: 0 }).annualPension, 0);
});

test('rejects non-finite, negative and excessive values', () => {
  for (const invalid of [
    { ...base, finalSalary: -1 }, { ...base, finalSalary: ' ' }, { ...base, yearsOfService: 81 },
    { ...base, accrualPercent: 101 }, { ...base, commutationPercent: 101 }, { ...base, commutationFactor: -1 },
  ]) assert.throws(() => calculatePension(invalid), RangeError);
});
