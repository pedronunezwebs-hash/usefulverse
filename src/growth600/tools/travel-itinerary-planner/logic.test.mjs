import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeItinerary, buildItineraryIcs, createTravelPlan, removeItineraryItem, restoreItineraryPlan, serializeItineraryBackup, upsertItineraryItem } from './logic.mjs';

const trip = (overrides = {}) => createTravelPlan({ title: 'Kyoto trip', startDate: '2026-11-01', endDate: '2026-11-03', bufferMinutes: 30, ...overrides });
const stop = (overrides = {}) => ({ id: 'visit-a', date: '2026-11-01', startTime: '09:00', endTime: '10:00', title: 'Temple visit', category: 'activity', location: 'East Kyoto', reservation: '', notes: '', ...overrides });

test('trip dates are real, ordered and bounded', () => {
  assert.throws(() => trip({ startDate: '2026-02-30' }), /valid date/u);
  assert.throws(() => trip({ endDate: '2026-10-31' }), /on or after/u);
  assert.throws(() => trip({ endDate: '2028-01-01' }), /no more than/u);
  assert.equal(trip().items.length, 0);
});

test('itinerary rejects malformed times, invalid categories and stops outside the trip', () => {
  assert.throws(() => upsertItineraryItem(trip(), stop({ startTime: '09:70' })), /24-hour/u);
  assert.throws(() => upsertItineraryItem(trip(), stop({ endTime: '09:00' })), /later than/u);
  assert.throws(() => upsertItineraryItem(trip(), stop({ date: '2026-11-04' })), /within the trip/u);
  assert.throws(() => upsertItineraryItem(trip(), stop({ category: 'flight' })), /supported/u);
});

test('add, edit and remove preserve stable IDs and chronological ordering', () => {
  let plan = trip();
  plan = upsertItineraryItem(plan, stop({ id: 'later', startTime: '14:00', endTime: '15:00', title: 'Museum' }));
  plan = upsertItineraryItem(plan, stop());
  assert.deepEqual(plan.items.map(({ id }) => id), ['visit-a', 'later']);
  plan = upsertItineraryItem(plan, stop({ title: 'Temple booked', reservation: 'Code 34' }));
  assert.equal(plan.items.length, 2);
  assert.equal(plan.items[0].title, 'Temple booked');
  assert.equal(removeItineraryItem(plan, 'visit-a').items.length, 1);
});

test('schedule analysis reports actual overlaps separately from short non-overlap connections', () => {
  const plan = trip({ items: [
    stop({ id: 'a', startTime: '09:00', endTime: '10:00' }),
    stop({ id: 'b', startTime: '09:45', endTime: '10:30', title: 'Overlapping visit' }),
    stop({ id: 'c', startTime: '10:40', endTime: '11:00', title: 'Tight connection' }),
    stop({ id: 'd', date: '2026-11-02', startTime: '09:00', endTime: '10:00', title: 'Next day' }),
  ] });
  const analysis = analyzeItinerary(plan);
  assert.deepEqual(analysis.overlaps, [{ firstId: 'a', secondId: 'b', overlapMinutes: 15 }]);
  assert.deepEqual(analysis.shortConnections, [{ firstId: 'b', secondId: 'c', gapMinutes: 10, neededMinutes: 30 }]);
  assert.deepEqual(analyzeItinerary(trip({ bufferMinutes: 0, items: [stop(), stop({ id: 'b', startTime: '10:00', endTime: '11:00' })] })).shortConnections, []);
});

test('schedule analysis finds overlaps hidden by a shorter nested event and measures the nearest completed stop', () => {
  const plan = trip({ items: [
    stop({ id: 'long', startTime: '09:00', endTime: '12:00' }),
    stop({ id: 'nested', startTime: '09:30', endTime: '09:45' }),
    stop({ id: 'inside-long', startTime: '10:00', endTime: '10:15' }),
    stop({ id: 'after', startTime: '12:10', endTime: '12:30' }),
  ] });
  const analysis = analyzeItinerary(plan);
  assert.deepEqual(analysis.overlaps, [
    { firstId: 'long', secondId: 'nested', overlapMinutes: 150 },
    { firstId: 'long', secondId: 'inside-long', overlapMinutes: 120 },
  ]);
  assert.deepEqual(analysis.shortConnections, [
    { firstId: 'nested', secondId: 'inside-long', gapMinutes: 15, neededMinutes: 30 },
    { firstId: 'long', secondId: 'after', gapMinutes: 10, neededMinutes: 30 },
  ]);
});

test('JSON backup round-trips validated itinerary data and rejects unsupported/corrupt structures', () => {
  const original = trip({ items: [stop({ reservation: 'Table 19', notes: 'Arrive early' })] });
  assert.deepEqual(restoreItineraryPlan(JSON.parse(serializeItineraryBackup(original))), original);
  assert.throws(() => restoreItineraryPlan({ ...original, schemaVersion: 2 }), /supported/u);
  assert.throws(() => restoreItineraryPlan({ ...original, items: [{ ...original.items[0], title: '' }] }), /required/u);
  assert.throws(() => serializeItineraryBackup({ ...original, items: new Array(251).fill(original.items[0]) }), /no more than/u);
});

test('ICS export uses CRLF, floating local times, escaping, and valid UTF-8 line folding', () => {
  const plan = trip({ title: 'Kyoto, family trip', items: [stop({ title: 'Tea; & temple, 日本語', location: 'Gion\\west', notes: 'Meet\nby gate' })] });
  const ics = buildItineraryIcs(plan, new Date('2026-10-08T12:34:56.000Z'));
  assert.match(ics, /BEGIN:VCALENDAR\r\nVERSION:2\.0/u);
  assert.match(ics, /DTSTART:20261101T090000\r\nDTEND:20261101T100000/u);
  assert.match(ics, /SUMMARY:Tea\\; & temple\\, 日本語/u);
  assert.match(ics, /LOCATION:Gion\\\\west/u);
  assert.match(ics, /DESCRIPTION:Meet\\nby gate/u);
  assert.doesNotMatch(ics, /TZID=/u);
  assert.match(ics, /^DTSTART:20261101T090000$/mu);
  assert.doesNotMatch(ics, /^DTSTART:[^\r\n]*Z/mu);
  for (const line of ics.split('\r\n')) assert.ok(new TextEncoder().encode(line).byteLength <= 75, line);
  assert.ok(ics.endsWith('END:VCALENDAR\r\n'));
});
