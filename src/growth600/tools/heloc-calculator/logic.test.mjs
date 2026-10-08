import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateHelocScenario } from './logic.mjs';

test('matches the interest-only acceptance example and models the later amortizing phase', () => {
  const result = calculateHelocScenario({ creditLimit: 25_000, balance: 12_000, annualAprPercent: 10, drawMonths: 120, repaymentMonths: 240 });
  assert.equal(result.interestOnlyPayment, 100);
  assert.equal(result.availableCredit, 13_000);
  assert.equal(result.drawInterest, 12_000);
  assert.ok(Math.abs(result.repaymentPayment - 115.802) < 0.01);
  assert.ok(result.repaymentInterest > 0);
  assert.equal(result.totalInterest, result.drawInterest + result.repaymentInterest);
  assert.equal(result.totalPayments, result.drawInterest + result.repaymentTotal);
});

test('zero APR and the shortest repayment term remain finite and deterministic', () => {
  const result = calculateHelocScenario({ creditLimit: 12_000, balance: 12_000, annualAprPercent: 0, drawMonths: 1, repaymentMonths: 1, currency: 'CAD' });
  assert.equal(result.interestOnlyPayment, 0);
  assert.equal(result.repaymentPayment, 12_000);
  assert.equal(result.totalInterest, 0);
  assert.equal(result.availableCredit, 0);
  assert.equal(result.currency, 'CAD');
});

test('a line with no current balance has no interest or payment and keeps the full limit available', () => {
  const result = calculateHelocScenario({ creditLimit: 25_000, balance: 0, annualAprPercent: 10, drawMonths: 120, repaymentMonths: 240 });
  assert.equal(result.availableCredit, 25_000);
  assert.equal(result.interestOnlyPayment, 0);
  assert.equal(result.repaymentPayment, 0);
  assert.equal(result.totalInterest, 0);
});

test('rejects invalid balances, limits, rates, terms, currencies and unsupported values', () => {
  const valid = { creditLimit: 25_000, balance: 12_000, annualAprPercent: 10, drawMonths: 120, repaymentMonths: 240 };
  for (const changes of [
    { balance: -1 }, { creditLimit: 0 }, { balance: 25_001 }, { annualAprPercent: -1 }, { annualAprPercent: 101 },
    { drawMonths: 0 }, { drawMonths: 1.5 }, { drawMonths: 361 }, { repaymentMonths: 0 }, { repaymentMonths: 24.5 },
    { creditLimit: 100_000_001 }, { currency: 'XYZ' }, { balance: Number.NaN },
  ]) assert.throws(() => calculateHelocScenario({ ...valid, ...changes }), RangeError);
});
