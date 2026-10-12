import assert from 'node:assert/strict';
import test from 'node:test';
import { calculate401kProjection } from './logic.mjs';

const run = (overrides = {}) => calculate401kProjection({
  annualSalary: 80000,
  currentBalance: 0,
  employeeContributionPercent: 6,
  employerMatchPercent: 50,
  matchLimitPercent: 4,
  vestingPercent: 100,
  years: 10,
  annualReturnPercent: 0,
  ...overrides,
});

test('calculates personal contributions and caps eligible salary percentage for match', () => {
  const result = run();
  assert.equal(result.annualEmployeeContribution, 4800);
  assert.equal(result.annualEmployerMatch, 1600);
  assert.equal(result.totalAnnualContribution, 6400);
});

test('matches 50 percent of a 4,000 contribution as the plan example specifies', () => {
  const result = run({ annualSalary: 100000, employeeContributionPercent: 4, matchLimitPercent: 4, employerMatchPercent: 50, years: 1 });
  assert.equal(result.annualEmployeeContribution, 4000);
  assert.equal(result.annualEmployerMatch, 2000);
});

test('limits employer match to the entered eligible contribution percentage', () => {
  assert.equal(run({ employeeContributionPercent: 10, matchLimitPercent: 4 }).annualEmployerMatch, 1600);
  assert.equal(run({ employeeContributionPercent: 2, matchLimitPercent: 4 }).annualEmployerMatch, 800);
});

test('vested balance excludes the unvested share of projected employer match', () => {
  const result = run({ vestingPercent: 50, years: 1 });
  assert.ok(Math.abs(result.accountBalance - 6400) < 1e-8);
  assert.ok(Math.abs(result.vestedBalance - 5600) < 1e-8);
  assert.ok(Math.abs(result.vestedEmployerContributions - 800) < 1e-8);
});

test('zero return and zero years preserve transparent contribution arithmetic', () => {
  const zeroReturn = run({ years: 2, annualReturnPercent: 0 });
  assert.ok(Math.abs(zeroReturn.accountBalance - 12800) < 1e-8);
  const noProjection = run({ years: 0, currentBalance: 1234 });
  assert.equal(noProjection.accountBalance, 1234);
  assert.equal(noProjection.vestedBalance, 1234);
  assert.deepEqual(noProjection.yearly, []);
});

test('positive return compounds opening balance and month-end deposits', () => {
  const result = run({ annualSalary: 0, currentBalance: 1000, employeeContributionPercent: 0, employerMatchPercent: 0, matchLimitPercent: 0, years: 1, annualReturnPercent: 12 });
  assert.ok(result.accountBalance > 1000);
  assert.equal(result.accountBalance, result.vestedBalance);
});

test('rejects invalid ranges and fractional projection years', () => {
  for (const change of [
    { annualSalary: -1 }, { employeeContributionPercent: 101 }, { employerMatchPercent: 501 },
    { matchLimitPercent: -1 }, { vestingPercent: 101 }, { years: 1.5 },
    { years: 61 }, { annualReturnPercent: -100 }, { currentBalance: Infinity },
  ]) assert.throws(() => run(change), RangeError);
});
