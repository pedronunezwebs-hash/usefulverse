import test from 'node:test';
import assert from 'node:assert/strict';
import { calculatePanchangSnapshot } from './logic.mjs';

test('Panchang snapshot uses the selected local date and reports bounded components', () => {
  const result = calculatePanchangSnapshot({
    date: '2026-10-19', latitude: 28.6139, longitude: 77.209, timeZone: 'Asia/Kolkata',
  });
  assert.equal(result.localDate, '2026-10-19');
  assert.equal(result.timeZone, 'Asia/Kolkata');
  assert.ok(Number.isFinite(Date.parse(result.sunriseUtc)));
  assert.equal(new Intl.DateTimeFormat('en-CA', { timeZone: result.timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(result.sunriseUtc)), '2026-10-19');
  assert.ok(result.tithiNumber >= 1 && result.tithiNumber <= 15);
  assert.ok(['bright', 'dark'].includes(result.paksha));
  assert.ok(Number.isFinite(result.ayanamsaDegrees));
  assert.ok(result.nakshatra.length > 0);
  assert.ok(result.yoga.length > 0);
  assert.ok(result.karana.length > 0);
});

test('Panchang snapshot handles leap days and zones west of UTC', () => {
  const result = calculatePanchangSnapshot({
    date: '2024-02-29', latitude: 51.5072, longitude: -0.1276, timeZone: 'Europe/London',
  });
  assert.equal(result.localDate, '2024-02-29');
  assert.equal(new Intl.DateTimeFormat('en-CA', { timeZone: result.timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(result.sunriseUtc)), '2024-02-29');
});

test('Panchang snapshot rejects invalid dates, coordinates and IANA zones', () => {
  const base = { date: '2026-10-19', latitude: 28, longitude: 77, timeZone: 'Asia/Kolkata' };
  for (const patch of [
    { date: '2025-02-29' }, { date: '2026-13-01' }, { latitude: '' }, { latitude: 91 },
    { longitude: -181 }, { timeZone: 'Mars/Olympus' },
  ]) assert.throws(() => calculatePanchangSnapshot({ ...base, ...patch }), RangeError);
});

test('Panchang snapshot explains when sunrise is unavailable at a polar location', () => {
  assert.throws(
    () => calculatePanchangSnapshot({ date: '2026-12-21', latitude: 89, longitude: 0, timeZone: 'UTC' }),
    /Sun does not rise/u,
  );
});
