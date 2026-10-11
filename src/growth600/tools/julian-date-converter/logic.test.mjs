import test from 'node:test';
import assert from 'node:assert/strict';
import { julianDateToUtc, utcToJulianDate } from './logic.mjs';

test('converts the J2000 epoch and returns modified JD plus UTC day fraction', () => {
  const result = utcToJulianDate('2000-01-01T12:00:00Z');
  assert.equal(result.jd, 2_451_545);
  assert.equal(result.mjd, 51_544.5);
  assert.equal(result.dayFraction, 0.5);
});

test('round trips UTC milliseconds and supports ISO minutes without seconds', () => {
  for (const utc of ['2024-02-29T23:59:59.123Z', '1900-03-01T00:00:00.000Z', '2000-01-01T12:00:00.001Z']) {
    const { jd } = utcToJulianDate(utc);
    assert.equal(julianDateToUtc({ value: jd }).utc, utc);
  }
  assert.equal(utcToJulianDate('2000-01-01T12:00').jd, 2_451_545);
});

test('JD and MJD inverses agree, including midnight and day rollover rounding', () => {
  const jd = utcToJulianDate('2026-10-11T23:59:59.999Z').jd;
  const mjd = jd - 2_400_000.5;
  assert.equal(julianDateToUtc({ value: jd }).utc, '2026-10-11T23:59:59.999Z');
  assert.equal(julianDateToUtc({ value: mjd, kind: 'mjd' }).utc, '2026-10-11T23:59:59.999Z');
  assert.equal(julianDateToUtc({ value: 2_451_545.5 }).utc, '2000-01-02T00:00:00.000Z');
});

test('supports year 0001 and the final millisecond of year 9999 but not outside the range', () => {
  assert.equal(julianDateToUtc({ value: utcToJulianDate('0001-01-01T00:00:00Z').jd }).utc, '0001-01-01T00:00:00.000Z');
  const final = '9999-12-31T23:59:59.999Z';
  assert.equal(julianDateToUtc({ value: utcToJulianDate(final).jd }).utc, final);
  assert.throws(() => utcToJulianDate('0000-01-01T00:00:00Z'), RangeError);
  assert.throws(() => julianDateToUtc({ value: 5_373_484.5 }), RangeError);
});

test('rejects invalid Gregorian dates, leap seconds, unsupported kinds and out-of-range values', () => {
  for (const date of ['1900-02-29T00:00:00Z', '2024-13-01T00:00:00Z', '2024-01-01T24:00:00Z', '2024-01-01T00:00:60Z', '2024-01-01']) {
    assert.throws(() => utcToJulianDate(date));
  }
  assert.throws(() => julianDateToUtc({ value: 0 }), RangeError);
  assert.throws(() => julianDateToUtc({ value: NaN }), TypeError);
  assert.throws(() => julianDateToUtc({ value: 60_000, kind: 'utc' }), TypeError);
  assert.throws(() => julianDateToUtc({ value: true }), TypeError);
});
