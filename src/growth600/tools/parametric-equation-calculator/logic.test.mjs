import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateParametricCurve } from './logic.mjs';

const circle = () => calculateParametricCurve({ xExpression: 'cos(t)', yExpression: 'sin(t)', tMin: 0, tMax: 2 * Math.PI, samples: 361 });

test('plots a unit circle and includes both endpoints', () => {
  const result = circle();
  assert.equal(result.validCount, 361);
  assert.ok(Math.abs(result.points[0].x - 1) < 1e-12);
  assert.ok(Math.abs(result.points[0].y) < 1e-12);
  assert.ok(Math.abs(result.points.at(-1).x - 1) < 1e-12);
  assert.ok(Math.abs(result.points.at(-1).y) < 1e-12);
});

test('supports powers, unary signs, constants and nested whitelisted functions', () => {
  const result = calculateParametricCurve({ xExpression: '-t^2 + 2*pi', yExpression: 'sqrt(abs(t)) + ln(e)', tMin: 1, tMax: 2, samples: 50 });
  assert.ok(Math.abs(result.points[0].x - (2 * Math.PI - 1)) < 1e-12);
  assert.ok(Math.abs(result.points[0].y - 2) < 1e-12);
});

test('marks singular or non-finite samples invalid instead of connecting arbitrary values', () => {
  const result = calculateParametricCurve({ xExpression: '1/(t-1)', yExpression: 't', tMin: 0, tMax: 2, samples: 101 });
  assert.equal(result.points[50].valid, false);
  assert.equal(result.validCount, 100);
});

test('rejects JavaScript, unknown names, malformed syntax and unsafe bounds', () => {
  for (const xExpression of ['globalThis.alert(1)', 'constructor(t)', 'sin(t);', '2**t', 'sin(t']) {
    assert.throws(() => calculateParametricCurve({ xExpression, yExpression: 't', tMin: 0, tMax: 1, samples: 50 }));
  }
  assert.throws(() => calculateParametricCurve({ xExpression: 't', yExpression: 't', tMin: 1, tMax: 1, samples: 50 }));
  assert.throws(() => calculateParametricCurve({ xExpression: 't', yExpression: 't', tMin: 0, tMax: 1, samples: 5000 }));
});

test('supports low and high sample counts within fixed limits', () => {
  assert.equal(calculateParametricCurve({ xExpression: 't', yExpression: 't^2', tMin: -1, tMax: 1, samples: 50 }).validCount, 50);
  assert.equal(calculateParametricCurve({ xExpression: 't', yExpression: 't^2', tMin: -1, tMax: 1, samples: 1500 }).validCount, 1500);
});

test('normalizes Arabic-Indic and Persian digits plus typographic minus signs', () => {
  const result = calculateParametricCurve({ xExpression: '−٢ + t', yExpression: '۳', tMin: 0, tMax: 1, samples: 50 });
  assert.equal(result.points[0].x, -2);
  assert.equal(result.points[0].y, 3);
});
