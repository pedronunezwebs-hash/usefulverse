import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateStudentLoan, RULES } from './logic.mjs';
const common = { firstRepaymentYear: 2020, firstLoanDate: '2018-09-01' };

test('2026-27 Plan 1 repayment uses official threshold and 9 percent', () => {
  const result = calculateStudentLoan({ ...common, income: 33000, plan: 'Plan 1' });
  assert.equal(result.annualRepayment, 549);
  assert.equal(result.interestRate, 4.1);
});
test('postgraduate loan uses its separate 6 percent threshold and rate', () => {
  const result = calculateStudentLoan({ ...common, income: 30000, plan: 'Postgraduate', balance: 10000 });
  assert.equal(result.annualRepayment, 540);
  assert.equal(result.interestEstimate, 600);
  assert.equal(result.cancellation.scope, 'England and Wales only');
});
test('Plan 2 interest estimate follows the post-study income scale and 6 percent cap', () => {
  assert.equal(calculateStudentLoan({ ...common, income: 29385, plan: 'Plan 2' }).interestRate, 4.1);
  assert.equal(calculateStudentLoan({ ...common, income: 60000, plan: 'Plan 2' }).interestRate, 6);
});
test('write-off timing follows the published plan terms', () => {
  assert.equal(calculateStudentLoan({ ...common, income: 40000, plan: 'Plan 2' }).cancellation.year, 2050);
  assert.equal(calculateStudentLoan({ ...common, firstRepaymentYear: 2026, firstLoanDate: '2023-09-01', income: 40000, plan: 'Plan 5' }).cancellation.year, 2066);
});
test('pre-cutoff Plan 1 loans use age 65 and require date of birth', () => {
  const oldPlan = { ...common, income: 30000, plan: 'Plan 1', firstRepaymentYear: 2000, firstLoanDate: '2006-08-31' };
  assert.throws(() => calculateStudentLoan(oldPlan), { code: 'birth-date-required' });
  assert.equal(calculateStudentLoan({ ...oldPlan, birthDate: '1980-02-01' }).cancellation.date, '2045-02-01');
});
test('official annual tables fail closed at review date and reject invalid inputs', () => {
  assert.equal(calculateStudentLoan({ ...common, income: 30000, plan: 'Plan 1', now: new Date(RULES.reviewDue + 'T00:00:00Z') }).expired, true);
  assert.throws(() => calculateStudentLoan({ ...common, income: -1, plan: 'Plan 1' }), { code: 'invalid-input' });
  assert.equal(RULES.reviewDue, '2026-11-19');
});
