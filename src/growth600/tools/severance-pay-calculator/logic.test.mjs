import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateSeverance } from './logic.mjs';

test('custom scenario follows the entered weekly-pay, years and weeks assumption', () => {
  const result = calculateSeverance({ weeklyPay: 500, yearsOfService: 10, weeksPerYear: 2 });
  assert.equal(result.amount, 10_000);
  assert.equal(result.totalWeeks, 20);
});

test('UK versioned statutory estimate counts service years backwards from the relevant date', () => {
  const result = calculateSeverance({ mode: 'uk-statutory', weeklyPay: 500, birthDate: '1980-01-01', employmentStartDate: '2010-01-01', redundancyDate: '2026-04-06' });
  assert.equal(result.yearsOfService, 16);
  assert.equal(result.totalWeeks, 18.5);
  assert.equal(result.amount, 9_250);
  assert.equal(result.rulesAsOf, '2026-04-06');
});

test('UK maximum weekly pay, twenty-year service and thirty-week monetary caps are enforced', () => {
  const result = calculateSeverance({ mode: 'uk-statutory', weeklyPay: 2_000, birthDate: '1950-01-01', employmentStartDate: '2000-01-01', redundancyDate: '2026-04-06' });
  assert.equal(result.yearsOfService, 20);
  assert.equal(result.appliedWeeklyPay, 751);
  assert.equal(result.amount, 22_530);
  assert.equal(result.capped, true);
});

test('UK statutory mode reports less than two completed service years as not eligible', () => {
  const result = calculateSeverance({ mode: 'uk-statutory', weeklyPay: 500, birthDate: '1990-01-01', employmentStartDate: '2025-01-01', redundancyDate: '2026-04-06' });
  assert.equal(result.eligible, false);
  assert.equal(result.amount, 0);
});

test('UK mode counts completed backward years and does not upgrade a year containing only part of a higher age band', () => {
  const result = calculateSeverance({ mode: 'uk-statutory', weeklyPay: 400, birthDate: '1984-10-01', employmentStartDate: '2016-01-01', redundancyDate: '2027-03-31' });
  assert.equal(result.yearsOfService, 11);
  assert.equal(result.totalWeeks, 11.5);
  assert.equal(result.amount, 4_600);
});

test('UK mode handles completed service years across the employee’s 22nd birthday', () => {
  const result = calculateSeverance({ mode: 'uk-statutory', weeklyPay: 400, birthDate: '2003-06-01', employmentStartDate: '2024-06-01', redundancyDate: '2026-06-02' });
  assert.equal(result.yearsOfService, 2);
  assert.equal(result.totalWeeks, 1.5);
  assert.equal(result.amount, 600);
});

test('UK mode handles a leap-day birth date using the last valid calendar day in non-leap years', () => {
  const result = calculateSeverance({ mode: 'uk-statutory', weeklyPay: 400, birthDate: '1990-02-28', employmentStartDate: '2024-02-29', redundancyDate: '2026-04-06' });
  assert.equal(result.yearsOfService, 2);
  assert.equal(result.totalWeeks, 2);
});

test('UK mode refuses dates before the pinned rules take effect instead of reusing today’s cap', () => {
  assert.throws(() => calculateSeverance({ mode: 'uk-statutory', weeklyPay: 500, birthDate: '1980-01-01', employmentStartDate: '2010-01-01', redundancyDate: '2026-04-05' }), /only cover redundancy dates/u);
});

test('invalid ages, dates, rates and user-defined assumptions are rejected', () => {
  assert.throws(() => calculateSeverance({ weeklyPay: -1, yearsOfService: 10, weeksPerYear: 2 }), /Weekly pay/u);
  assert.throws(() => calculateSeverance({ weeklyPay: 500, yearsOfService: 10, weeksPerYear: 60 }), /Weeks per service year/u);
  assert.throws(() => calculateSeverance({ mode: 'uk-statutory', weeklyPay: 500, birthDate: '2000-02-30', employmentStartDate: '2010-01-01', redundancyDate: '2026-04-06' }), /real calendar date/u);
  assert.throws(() => calculateSeverance({ mode: 'uk-statutory', weeklyPay: 500, birthDate: '1980-01-01', employmentStartDate: '2026-04-07', redundancyDate: '2026-04-06' }), /chronological order/u);
  assert.throws(() => calculateSeverance({ mode: 'uk-statutory', weeklyPay: 500, birthDate: '2000-01-01', employmentStartDate: '1999-01-01', redundancyDate: '2026-04-06' }), /chronological order/u);
});
