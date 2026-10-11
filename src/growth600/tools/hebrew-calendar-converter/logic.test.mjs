import test from 'node:test';
import assert from 'node:assert/strict';
import { gregorianToHebrew, hebrewToGregorian, isHebrewLeapYear } from './logic.mjs';

test('Gregorian 11 March 2024 is 1 Adar II 5784 in a leap year', () => {
  assert.deepEqual(gregorianToHebrew({ year: 2024, month: 3, day: 11 }), { year: 5784, month: 7, day: 1, monthKey: 'adarII', leapYear: true });
});

test('the day before 1 Adar II is 30 Adar I', () => {
  assert.deepEqual(gregorianToHebrew({ year: 2024, month: 3, day: 10 }), { year: 5784, month: 6, day: 30, monthKey: 'adarI', leapYear: true });
});

test('Gregorian New Year example maps to 1 Tishri 5784 and converts back', () => {
  const result = gregorianToHebrew({ year: 2023, month: 9, day: 16 });
  assert.deepEqual(result, { year: 5784, month: 1, day: 1, monthKey: 'tishri', leapYear: true });
  assert.deepEqual(hebrewToGregorian({ year: result.year, month: result.month, day: result.day }), { year: 2023, month: 9, day: 16 });
});

test('both Adar months round-trip to the exact Gregorian civil date', () => {
  for (const date of [{ year: 2024, month: 3, day: 10 }, { year: 2024, month: 3, day: 11 }]) {
    const hebrew = gregorianToHebrew(date);
    assert.deepEqual(hebrewToGregorian(hebrew), date);
  }
});

test('Hebrew leap-year cycle has seven leap years in each 19-year cycle', () => {
  assert.deepEqual(Array.from({ length: 19 }, (_, index) => index + 1).filter(isHebrewLeapYear), [3, 6, 8, 11, 14, 17, 19]);
  assert.equal(isHebrewLeapYear(5784), true);
  assert.equal(isHebrewLeapYear(5783), false);
});

test('rejects Adar II in a common year and day 30 in a 29-day Adar II', () => {
  assert.throws(() => hebrewToGregorian({ year: 5783, month: 13, day: 1 }), /outside the supported range/u);
  assert.throws(() => hebrewToGregorian({ year: 5784, month: 7, day: 30 }), /does not exist/u);
});

test('rejects impossible Gregorian dates and out-of-range years', () => {
  assert.throws(() => gregorianToHebrew({ year: 2024, month: 2, day: 30 }), /valid Gregorian date/u);
  assert.throws(() => gregorianToHebrew({ year: 10_000, month: 1, day: 1 }), /supported range/u);
});

test('out-of-calendar-range Hebrew dates do not wrap into unrelated Gregorian dates', () => {
  assert.throws(() => hebrewToGregorian({ year: 1, month: 1, day: 1 }), /outside Gregorian years/u);
});
