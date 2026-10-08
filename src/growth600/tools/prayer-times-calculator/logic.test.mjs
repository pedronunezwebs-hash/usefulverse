import test from 'node:test';
import assert from 'node:assert/strict';
import { calculatePrayerTimes } from './logic.mjs';

const input = { date: '2026-03-20', latitude: 40.7128, longitude: -74.006, utcOffsetHours: -4, method: 'isna' };

test('returns ordered, minute-rounded daily prayer times for New York with the selected civil offset', () => {
  const { times } = calculatePrayerTimes(input);
  for (const key of ['fajr', 'sunrise', 'dhuhr', 'asr', 'sunset', 'maghrib', 'isha']) assert.match(times[key], /^\d{2}:\d{2}$/u);
  assert.ok(times.fajr < times.sunrise);
  assert.ok(times.sunrise < times.dhuhr);
  assert.ok(times.dhuhr < times.asr);
  assert.equal(times.sunset, times.maghrib);
  assert.ok(times.maghrib < times.isha);
});

test('changing UTC offset shifts all clock times by the same amount without changing solar intervals', () => {
  const standard = calculatePrayerTimes({ ...input, utcOffsetHours: -5 });
  const daylight = calculatePrayerTimes({ ...input, utcOffsetHours: -4 });
  assert.equal(standard.times.dhuhr, '12:04');
  assert.equal(daylight.times.dhuhr, '13:04');
});

test('supports named methods, Ramadan Umm al-Qura timing, and Hanafi Asr', () => {
  const normal = calculatePrayerTimes({ ...input, method: 'makkah', highLatitudeMethod: 'none' });
  const ramadan = calculatePrayerTimes({ ...input, method: 'makkah', ramadan: true, highLatitudeMethod: 'none' });
  const hanafi = calculatePrayerTimes({ ...input, asrMethod: 'hanafi' });
  assert.equal(normal.method, 'makkah');
  assert.equal(ramadan.method, 'makkahRamadan');
  assert.equal(normal.times.isha, '20:37');
  assert.equal(ramadan.times.isha, '21:07');
  assert.ok(hanafi.times.asr > calculatePrayerTimes(input).times.asr);
});

test('returns a clear unavailable time for polar day and does not invent a sunrise', () => {
  const result = calculatePrayerTimes({ date: '2026-06-21', latitude: 89, longitude: 0, utcOffsetHours: 0, method: 'mwl' });
  assert.equal(result.times.sunrise, null);
  assert.equal(result.times.sunset, null);
  assert.equal(result.times.fajr, null);
  assert.equal(result.times.isha, null);
});

test('uses selected high-latitude adjustment only when twilight angle is unavailable', () => {
  const adjusted = calculatePrayerTimes({ date: '2026-06-21', latitude: 60, longitude: 25, utcOffsetHours: 3, method: 'mwl', highLatitudeMethod: 'angle' });
  const unadjusted = calculatePrayerTimes({ date: '2026-06-21', latitude: 60, longitude: 25, utcOffsetHours: 3, method: 'mwl', highLatitudeMethod: 'none' });
  const middle = calculatePrayerTimes({ date: '2026-06-21', latitude: 60, longitude: 25, utcOffsetHours: 3, method: 'mwl', highLatitudeMethod: 'middle' });
  const seventh = calculatePrayerTimes({ date: '2026-06-21', latitude: 60, longitude: 25, utcOffsetHours: 3, method: 'mwl', highLatitudeMethod: 'seventh' });
  assert.equal(adjusted.highLatitudeAdjusted, true);
  assert.match(adjusted.times.fajr, /^\d{2}:\d{2}$/u);
  assert.equal(unadjusted.times.fajr, null);
  assert.equal(middle.highLatitudeAdjusted, true);
  assert.equal(seventh.highLatitudeAdjusted, true);
  assert.notEqual(middle.times.fajr, seventh.times.fajr);
});

test('rejects impossible dates, coordinates, offsets and unsupported options', () => {
  assert.throws(() => calculatePrayerTimes({ ...input, date: '2026-02-30' }));
  assert.throws(() => calculatePrayerTimes({ ...input, latitude: 90.1 }));
  assert.throws(() => calculatePrayerTimes({ ...input, longitude: 181 }));
  assert.throws(() => calculatePrayerTimes({ ...input, utcOffsetHours: 15 }));
  assert.throws(() => calculatePrayerTimes({ ...input, method: 'invented' }));
  assert.throws(() => calculatePrayerTimes({ ...input, highLatitudeMethod: 'invented' }));
});
