import assert from 'node:assert/strict';
import test from 'node:test';
import { createWorldClockSnapshot, formatOffsetDifference, formatUtcOffset, getDefaultWorldClockZones, getTimeZoneOffsetMinutes, MAX_WORLD_CLOCKS, normalizeWorldClockZones, WORLD_CLOCK_ZONES } from './logic.mjs';

test('default set starts with local zone and avoids duplicates', () => {
  assert.deepEqual(getDefaultWorldClockZones('Europe/London'), ['Europe/London', 'America/New_York', 'Asia/Tokyo']);
});

test('zone choices are valid, unique, capped, and always include local time', () => {
  assert.deepEqual(normalizeWorldClockZones(['UTC', 'UTC', 'Asia/Tokyo'], 'Europe/Paris'), ['Europe/Paris', 'UTC', 'Asia/Tokyo']);
  assert.throws(() => normalizeWorldClockZones(['Not/AZone']), /supported time zone/u);
  assert.throws(() => normalizeWorldClockZones(WORLD_CLOCK_ZONES.slice(0, MAX_WORLD_CLOCKS).map(({ id }) => id), 'Europe/Paris'), /no more than/u);
  assert.throws(() => normalizeWorldClockZones('UTC'), /array/u);
});

test('offsets account for DST at the instant, not a fixed city offset', () => {
  assert.equal(getTimeZoneOffsetMinutes(new Date('2026-01-15T12:00:00Z'), 'America/New_York'), -300);
  assert.equal(getTimeZoneOffsetMinutes(new Date('2026-07-15T12:00:00Z'), 'America/New_York'), -240);
  assert.equal(getTimeZoneOffsetMinutes(new Date('2026-01-15T12:00:00Z'), 'Europe/London'), 0);
  assert.equal(getTimeZoneOffsetMinutes(new Date('2026-07-15T12:00:00Z'), 'Europe/London'), 60);
});

test('UTC and Tokyo differ correctly across midnight with localized date labels', () => {
  const snapshot = createWorldClockSnapshot({ date: new Date('2026-01-01T15:30:00Z'), zones: ['UTC', 'Asia/Tokyo'], localZone: 'UTC', locale: 'en' });
  assert.equal(snapshot.clocks[0].utcOffset, 'UTC+00:00');
  assert.equal(snapshot.clocks[0].time, '15:30:00');
  assert.equal(snapshot.clocks[1].utcOffset, 'UTC+09:00');
  assert.equal(snapshot.clocks[1].time, '00:30:00');
  assert.match(snapshot.clocks[1].date, /Friday, January 2, 2026/u);
  assert.equal(snapshot.clocks[1].difference, '+9 h');
});

test('offset strings support half-hour and quarter-hour zones', () => {
  assert.equal(formatUtcOffset(330), 'UTC+05:30');
  assert.equal(formatUtcOffset(345), 'UTC+05:45');
  assert.equal(formatUtcOffset(-210), 'UTC−03:30');
  assert.equal(formatOffsetDifference(330, 0, 'en'), '+5 h 30 min');
  assert.equal(formatOffsetDifference(0, 330, 'en'), '−5 h 30 min');
});

test('invalid dates and out-of-range offsets are rejected', () => {
  assert.throws(() => createWorldClockSnapshot({ date: new Date('bad'), zones: ['UTC'], localZone: 'UTC' }), /valid instant/u);
  assert.throws(() => formatUtcOffset(900), /supported range/u);
  assert.throws(() => getTimeZoneOffsetMinutes(new Date(), 'Bad/Zone'), /supported time zone/u);
});

test('every published preset is accepted by Intl time-zone support', () => {
  for (const { id } of WORLD_CLOCK_ZONES) assert.doesNotThrow(() => createWorldClockSnapshot({ date: new Date('2026-06-01T12:00:00Z'), zones: [id], localZone: 'UTC' }), id);
});
