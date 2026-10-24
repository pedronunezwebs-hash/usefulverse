import test from 'node:test';
import assert from 'node:assert/strict';
import { planTransit } from './logic.mjs';

const feed = {
  stops: [{ id: 'a', name: 'Alpha Central' }, { id: 'b', name: 'Beta Square' }, { id: 'c', name: 'Gamma Park' }],
  routes: [{ id: 'r1', name: 'R1' }, { id: 'r2', name: 'R2' }],
  trips: [{ id: 't1', routeId: 'r1', serviceId: 'weekday' }, { id: 't2', routeId: 'r2', serviceId: 'weekday' }],
  stopTimes: [
    { tripId: 't1', stopId: 'a', departure: '08:00:00', arrival: '08:00:00', sequence: 1 },
    { tripId: 't1', stopId: 'b', departure: '08:10:00', arrival: '08:10:00', sequence: 2 },
    { tripId: 't2', stopId: 'b', departure: '08:15:00', arrival: '08:15:00', sequence: 1 },
    { tripId: 't2', stopId: 'c', departure: '08:25:00', arrival: '08:25:00', sequence: 2 },
  ],
  calendar: [{ service_id: 'weekday', start_date: '20261001', end_date: '20261031', monday: '1', tuesday: '1', wednesday: '1', thursday: '1', friday: '1', saturday: '0', sunday: '0' }],
  exceptions: [], agencyTimezone: 'Europe/Madrid', feedName: 'test.zip',
};

test('transit planner finds a direct trip and a one-transfer trip from local GTFS-like data', () => {
  const directFeed = { ...feed, trips: [feed.trips[0]], routes: [feed.routes[0]], stopTimes: feed.stopTimes.slice(0, 2) };
  const direct = planTransit({ feed: directFeed, origin: 'Alpha', destination: 'Beta', date: '2026-10-19', time: '07:55' });
  assert.equal(direct.resultCount, 1);
  assert.equal(direct.results[0].legs[0].route, 'R1');
  assert.equal(direct.results[0].arrival, 490);
  const transfer = planTransit({ feed, origin: 'Alpha', destination: 'Gamma', date: '2026-10-19', time: '07:55', transferMinutes: 5 });
  assert.equal(transfer.resultCount, 1);
  assert.equal(transfer.results[0].transferCount, 1);
  assert.equal(transfer.results[0].arrival, 505);
});

test('transit planner respects departure time and rejects invalid date, clock and transfer limits', () => {
  assert.equal(planTransit({ feed, origin: 'Alpha', destination: 'Gamma', date: '2026-10-19', time: '08:30' }).resultCount, 0);
  assert.throws(() => planTransit({ feed, origin: 'Alpha', destination: 'Gamma', date: '2026-02-30' }), (error) => error.code === 'invalid-date');
  for (const time of ['24:00', '25:00', '8:00', '08:60']) assert.throws(() => planTransit({ feed, origin: 'Alpha', destination: 'Gamma', date: '2026-10-19', time }), (error) => error.code === 'invalid-time');
  assert.throws(() => planTransit({ feed, origin: 'Alpha', destination: 'Gamma', date: '2026-10-19', transferMinutes: 61 }), (error) => error.code === 'invalid-buffer');
  assert.throws(() => planTransit({ feed, origin: 'Alpha', destination: 'Alpha', date: '2026-10-19' }), (error) => error.code === 'same-stop');
});
