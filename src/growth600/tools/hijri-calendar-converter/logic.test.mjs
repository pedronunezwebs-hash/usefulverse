import test from 'node:test';
import assert from 'node:assert/strict';
import { gregorianToHijri, hijriToGregorian, isHijriLeapYear } from './logic.mjs';

test('Hijri and Gregorian conversion round-trips representative dates in the declared range', () => {
  for (const input of [
    { year: 622, month: 7, day: 19 },
    { year: 1445, month: 9, day: 1, calendar: 'hijri' },
    { year: 2024, month: 3, day: 11 },
    { year: 2000, month: 2, day: 29 },
    { year: 9999, month: 12, day: 31 },
  ]) {
    if (input.calendar === 'hijri') {
      const gregorian = hijriToGregorian(input);
      assert.deepEqual(gregorianToHijri(gregorian), { year: input.year, month: input.month, day: input.day });
    } else {
      const hijri = gregorianToHijri(input);
      assert.deepEqual(hijriToGregorian(hijri), input);
    }
  }
});

test('tabular 30-year leap cycle adds one day to month 12 in leap years only', () => {
  assert.equal(isHijriLeapYear(2), true);
  assert.equal(isHijriLeapYear(3), false);
  const leapLastDay = hijriToGregorian({ year: 2, month: 12, day: 30 });
  assert.deepEqual(gregorianToHijri(leapLastDay), { year: 2, month: 12, day: 30 });
  assert.throws(() => hijriToGregorian({ year: 3, month: 12, day: 30 }), /outside the supported range/u);
});

test('rejects impossible, malformed and out-of-range dates instead of allowing Date rollover', () => {
  for (const value of [
    () => gregorianToHijri({ year: 2023, month: 2, day: 29 }),
    () => gregorianToHijri({ year: 2024, month: 13, day: 1 }),
    () => gregorianToHijri({ year: 621, month: 12, day: 31 }),
    () => gregorianToHijri({ year: 10000, month: 1, day: 1 }),
    () => hijriToGregorian({ year: 1445, month: 13, day: 1 }),
    () => hijriToGregorian({ year: 1445, month: 2, day: 30 }),
    () => hijriToGregorian({ year: 0, month: 1, day: 1 }),
  ]) assert.throws(value, RangeError);
});
