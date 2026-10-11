import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateEffectiveInterest } from './logic.mjs';

test('monthly-compounded 12% nominal APR produces about 12.6825% APY', () => {
  const result = calculateEffectiveInterest({ mode: 'apr-to-apy', ratePercent: 12, frequency: 'monthly' });
  assert.equal(result.aprPercent, 12);
  assert.ok(Math.abs(result.apyPercent - 12.6825030132) < 1e-9);
  assert.equal(result.periodicRatePercent, 1);
});

test('inverse conversion recovers the original nominal APR', () => {
  const result = calculateEffectiveInterest({ mode: 'apy-to-apr', ratePercent: 12.6825030132, frequency: 'monthly' });
  assert.ok(Math.abs(result.aprPercent - 12) < 1e-8);
  assert.ok(Math.abs(result.apyPercent - 12.6825030132) < 1e-9);
});

test('annual compounding makes APR and APY equal', () => {
  const result = calculateEffectiveInterest({ mode: 'apr-to-apy', ratePercent: 5.25, frequency: 'annual' });
  assert.equal(result.aprPercent, 5.25);
  assert.equal(result.apyPercent, 5.25);
});

test('continuous compounding uses the exponential relationship and has no periodic rate', () => {
  const forward = calculateEffectiveInterest({ mode: 'apr-to-apy', ratePercent: 12, frequency: 'continuous' });
  assert.ok(Math.abs(forward.apyPercent - (Math.exp(0.12) - 1) * 100) < 1e-12);
  assert.equal(forward.periodicRatePercent, null);
  const inverse = calculateEffectiveInterest({ mode: 'apy-to-apr', ratePercent: forward.apyPercent, frequency: 'continuous' });
  assert.ok(Math.abs(inverse.aprPercent - 12) < 1e-12);
});

test('zero rate remains zero in both directions', () => {
  for (const mode of ['apr-to-apy', 'apy-to-apr']) {
    const result = calculateEffectiveInterest({ mode, ratePercent: 0, frequency: 'daily' });
    assert.equal(result.aprPercent, 0);
    assert.equal(result.apyPercent, 0);
    assert.equal(result.periodicRatePercent, 0);
  }
});

test('rejects invalid modes, frequencies, negative and out-of-range values', () => {
  for (const input of [
    { mode: 'other', ratePercent: 5, frequency: 'monthly' },
    { mode: 'apr-to-apy', ratePercent: 5, frequency: 'hourly' },
    { mode: 'apr-to-apy', ratePercent: -1, frequency: 'monthly' },
    { mode: 'apy-to-apr', ratePercent: Infinity, frequency: 'monthly' },
    { mode: 'apr-to-apy', ratePercent: 1_000_000, frequency: 'daily' },
  ]) assert.throws(() => calculateEffectiveInterest(input), RangeError);
});

test('all finite common-frequency calculations remain inverse-consistent', () => {
  for (const frequency of ['semiannual', 'quarterly', 'monthly', 'twiceMonthly', 'biweekly', 'weekly', 'daily']) {
    const forward = calculateEffectiveInterest({ mode: 'apr-to-apy', ratePercent: 8.75, frequency });
    const inverse = calculateEffectiveInterest({ mode: 'apy-to-apr', ratePercent: forward.apyPercent, frequency });
    assert.ok(Math.abs(inverse.aprPercent - 8.75) < 1e-10, frequency);
  }
});
