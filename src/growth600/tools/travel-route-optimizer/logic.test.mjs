import test from 'node:test';
import assert from 'node:assert/strict';
import { optimizeCoordinateRoute } from './logic.mjs';

test('coordinate route keeps the start, visits each location once and does not worsen input order', () => {
  const points = [
    { name: 'Start', lat: 0, lon: 0 }, { name: 'Far east', lat: 0, lon: 10 },
    { name: 'Near east', lat: 0, lon: 1 }, { name: 'North', lat: 1, lon: 0 },
  ];
  const open = optimizeCoordinateRoute(points);
  const loop = optimizeCoordinateRoute(points, { closeLoop: true });
  assert.equal(open.order[0], 0);
  assert.deepEqual([...open.order].sort(), [0, 1, 2, 3]);
  assert.ok(open.optimizedKm <= open.originalKm);
  assert.ok(loop.optimizedKm <= loop.originalKm);
  assert.equal(loop.closeLoop, true);
  assert.equal(open.exact, false);
});

test('coordinate route rejects duplicate names independent of case and normalization', () => {
  assert.throws(() => optimizeCoordinateRoute([{ name: 'Café', lat: 0, lon: 0 }, { name: 'Café', lat: 1, lon: 1 }]));
  assert.throws(() => optimizeCoordinateRoute([{ name: 'A', lat: 0, lon: 0 }, { name: 'a', lat: 1, lon: 1 }]));
  assert.throws(() => optimizeCoordinateRoute([{ name: 'A', lat: 91, lon: 0 }, { name: 'B', lat: 1, lon: 1 }]));
});
