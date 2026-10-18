import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { calculateNatalChart, resolveBirthMoment, zodiacPosition } from './natal-chart.mjs';

function localAstronomy() {
  const context = { console, setTimeout, clearTimeout, Date, Math, Intl };
  context.globalThis = context;
  context.window = context;
  context.self = context;
  vm.runInNewContext(readFileSync(new URL('./vendor/astronomy.browser.min.js', import.meta.url), 'utf8'), context);
  return context.Astronomy;
}

test('zodiac positions normalize angles and keep exact 30-degree sign boundaries', () => {
  assert.deepEqual(zodiacPosition(0), { signIndex: 0, sign: 'Aries', degree: 0, longitude: 0 });
  assert.equal(zodiacPosition(30).sign, 'Taurus');
  assert.equal(zodiacPosition(-1).sign, 'Pisces');
  assert.equal(zodiacPosition(721).longitude, 1);
  assert.throws(() => zodiacPosition(Infinity), /finite/u);
});

test('IANA timezone conversion observes UTC offset and daylight-saving gaps/folds', () => {
  assert.equal(resolveBirthMoment({ localDateTime: '2000-01-01T12:00', timeZone: 'Europe/Zurich' }).date.toISOString(), '2000-01-01T11:00:00.000Z');
  assert.throws(() => resolveBirthMoment({ localDateTime: '2026-03-29T02:30', timeZone: 'Europe/Zurich' }), /does not exist/u);
  assert.throws(() => resolveBirthMoment({ localDateTime: '2026-10-25T02:30', timeZone: 'Europe/Zurich' }), /occurs twice/u);
  assert.equal(resolveBirthMoment({ localDateTime: '2026-10-25T02:30', timeZone: 'Europe/Zurich', utcOffsetMinutes: 120 }).date.toISOString(), '2026-10-25T00:30:00.000Z');
  assert.equal(resolveBirthMoment({ localDateTime: '2026-10-25T02:30', timeZone: 'Europe/Zurich', utcOffsetMinutes: 60 }).date.toISOString(), '2026-10-25T01:30:00.000Z');
});

test('rejects invalid dates, zones, blank birth times and inconsistent offset overrides', () => {
  assert.throws(() => resolveBirthMoment({ localDateTime: '2024-02-30T12:00', timeZone: 'UTC' }), /calendar date/u);
  assert.throws(() => resolveBirthMoment({ localDateTime: '2000-01-01T12:00', timeZone: 'Not/A_Zone' }), /IANA time zone/u);
  assert.throws(() => resolveBirthMoment({ localDateTime: '', timeZone: 'UTC' }), /valid birth date/u);
  assert.throws(() => resolveBirthMoment({ localDateTime: '2000-01-01T12:00', timeZone: 'Europe/Zurich', utcOffsetMinutes: 0 }), /does not match/u);
});

test('uses geocentric ecliptic positions and computes ascendant/midheaven from birth place', () => {
  const Astronomy = localAstronomy();
  const input = { Astronomy, localDateTime: '2000-01-01T12:00', timeZone: 'UTC', latitude: 0, longitude: 0 };
  const chart = calculateNatalChart(input);
  assert.equal(chart.positions.length, 10);
  assert.equal(chart.positions[0].sign, 'Capricorn');
  assert.ok(Math.abs(chart.positions[0].longitude - 280.37) < 0.1);
  assert.equal(chart.ascendant.sign, 'Aries');
  const otherPlace = calculateNatalChart({ ...input, latitude: 47.3769, longitude: 8.5417 });
  assert.notEqual(otherPlace.ascendant.longitude, chart.ascendant.longitude);
  assert.deepEqual(otherPlace.positions.map(({ longitude }) => longitude), chart.positions.map(({ longitude }) => longitude));
});

test('midheaven agrees with the documented independent 2024 reference fixture', () => {
  const chart = calculateNatalChart({
    Astronomy: localAstronomy(), localDateTime: '2024-03-30T08:03', timeZone: 'UTC',
    latitude: 18.966666, longitude: 72.833333,
  });
  assert.ok(Math.abs(chart.midheaven.longitude - 23.54) < 0.02);
});

test('validates geographic bounds and requires the local library', () => {
  const common = { localDateTime: '2000-01-01T12:00', timeZone: 'UTC', latitude: 0, longitude: 0 };
  assert.throws(() => calculateNatalChart({ ...common, latitude: 91, Astronomy: localAstronomy() }), /Latitude/u);
  assert.throws(() => calculateNatalChart({ ...common, longitude: 181, Astronomy: localAstronomy() }), /longitude/u);
  assert.throws(() => calculateNatalChart({ ...common, Astronomy: null }), /library/u);
});
