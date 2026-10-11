import test from 'node:test';
import assert from 'node:assert/strict';
import { calculatePolarGraph } from './logic.mjs';

test('r=1 draws a unit circle in degree mode with endpoints preserved', () => {
  const result = calculatePolarGraph({ radiusExpression: '1', angleMin: 0, angleMax: 360, angleUnit: 'degrees', samples: 361 });
  assert.equal(result.validCount, 361);
  assert.ok(Math.abs(result.points[0].x - 1) < 1e-12);
  assert.ok(Math.abs(result.points[0].y) < 1e-12);
  assert.ok(Math.abs(result.points[90].x) < 1e-12);
  assert.ok(Math.abs(result.points[90].y - 1) < 1e-12);
  assert.ok(Math.abs(result.points.at(-1).x - 1) < 1e-12);
});

test('uses the angle variable, supports thetas and bounded trigonometric expressions', () => {
  const result = calculatePolarGraph({ radiusExpression: '2*cos(θ)', angleMin: 0, angleMax: Math.PI, angleUnit: 'radians', samples: 101 });
  assert.equal(result.points[0].radius, 2);
  assert.ok(Math.abs(result.points[50].radius) < 1e-12);
  assert.equal(result.points.at(-1).radius, -2);
  const degreeGraph = calculatePolarGraph({ radiusExpression: 'cos(θ)', angleMin: 0, angleMax: 180, angleUnit: 'degrees', samples: 181 });
  assert.ok(Math.abs(degreeGraph.points[90].radius) < 1e-12);
});

test('rejects invalid expressions, unsafe angles, units and excessive sample counts', () => {
  const base = { radiusExpression: '1', angleMin: 0, angleMax: 6.28, samples: 50 };
  assert.throws(() => calculatePolarGraph({ ...base, radiusExpression: 'globalThis.alert(1)' }), SyntaxError);
  for (const input of [
    { ...base, angleMax: 0 }, { ...base, angleUnit: 'turns' },
    { ...base, samples: 2000 }, { ...base, angleMin: -20000 },
  ]) assert.throws(() => calculatePolarGraph(input), RangeError);
});

test('invalid or singular samples break the curve instead of becoming unbounded coordinates', () => {
  const result = calculatePolarGraph({ radiusExpression: '1/(t-180)', angleMin: 0, angleMax: 360, angleUnit: 'degrees', samples: 361 });
  assert.equal(result.points[180].valid, false);
  assert.equal(result.validCount, 360);
});
