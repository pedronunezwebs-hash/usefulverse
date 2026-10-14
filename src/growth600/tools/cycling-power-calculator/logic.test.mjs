import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateCyclingPower, convertCyclingUnits } from './logic.mjs';

test('on level ground, higher speed requires more estimated rider power', () => {
  const slow = calculateCyclingPower({ mass: 80, speed: 20, gradientPercent: 0, headwind: 0 });
  const fast = calculateCyclingPower({ mass: 80, speed: 30, gradientPercent: 0, headwind: 0 });
  assert.ok(fast.riderWatts > slow.riderWatts);
});

test('climbing adds power and a tailwind reduces aerodynamic demand', () => {
  const flat = calculateCyclingPower({ mass: 85, speed: 30, gradientPercent: 0, headwind: 0 });
  const climb = calculateCyclingPower({ mass: 85, speed: 30, gradientPercent: 5, headwind: 0 });
  const tailwind = calculateCyclingPower({ mass: 85, speed: 30, gradientPercent: 0, headwind: -10 });
  assert.ok(climb.riderWatts > flat.riderWatts);
  assert.ok(tailwind.aeroWatts < flat.aeroWatts);
});

test('imperial input converts to the same physical estimate as metric input', () => {
  const metric = calculateCyclingPower({ mass: 80, speed: 30, headwind: 0, unitSystem: 'metric' });
  const imperial = calculateCyclingPower({ mass: 176.36981, speed: 18.641136, headwind: 0, unitSystem: 'imperial' });
  assert.ok(Math.abs(metric.riderWatts - imperial.riderWatts) < 0.01);
});

test('switching units converts mass, speed, and signed headwind without changing the physical inputs', () => {
  const imperial = convertCyclingUnits({ mass: 85, speed: 30, headwind: -12, from: 'metric', to: 'imperial' });
  assert.ok(Math.abs(imperial.mass - 187.392922) < 1e-6);
  assert.ok(Math.abs(imperial.speed - 18.641136) < 1e-6);
  assert.ok(Math.abs(imperial.headwind + 7.4564544) < 1e-6);
  const metric = convertCyclingUnits({ ...imperial, from: 'imperial', to: 'metric' });
  assert.ok(Math.abs(metric.mass - 85) < 1e-6);
  assert.ok(Math.abs(metric.speed - 30) < 1e-6);
  assert.ok(Math.abs(metric.headwind + 12) < 1e-6);
  assert.throws(() => convertCyclingUnits({ from: 'unknown', to: 'metric' }), RangeError);
});

test('downhill estimates never imply regenerative rider power', () => {
  const result = calculateCyclingPower({ mass: 80, speed: 20, gradientPercent: -30, headwind: -20 });
  assert.equal(result.riderWatts, 0);
  assert.equal(result.wattsPerKg, 0);
});

test('rejects invalid and out-of-range values', () => {
  for (const input of [
    { mass: 0, speed: 20 },
    { mass: 80, speed: 0 },
    { mass: 80, speed: 20, gradientPercent: 40 },
    { mass: 80, speed: 20, rollingResistance: -1 },
    { mass: 80, speed: 20, unitSystem: 'unknown' },
  ]) assert.throws(() => calculateCyclingPower(input), RangeError);
});
