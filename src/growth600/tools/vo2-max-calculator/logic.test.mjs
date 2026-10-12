import assert from 'node:assert/strict';
import test from 'node:test';
import { estimateCooperVo2Max, estimateRockportVo2Max } from './logic.mjs';

test('Cooper example uses the 12-minute distance equation and reports relative units', () => {
  const result = estimateCooperVo2Max({ distance: 2.4, unit: 'km' });
  assert.equal(result.distanceMeters, 2400);
  assert.equal(result.unit, 'mL/kg/min');
  assert.ok(Math.abs(result.vo2Max - 42.3544) < 0.001);
});

test('Cooper distance units produce equivalent estimates', () => {
  const meters = estimateCooperVo2Max({ distance: 2400, unit: 'm' });
  const miles = estimateCooperVo2Max({ distance: 2400 / 1609.344, unit: 'mi' });
  assert.ok(Math.abs(meters.vo2Max - miles.vo2Max) < 1e-10);
});

test('Rockport example reproduces the cited Kline field-test equation', () => {
  const result = estimateRockportVo2Max({ age: 30, weight: 70, weightUnit: 'kg', sexCoefficient: 'male', minutes: 15, seconds: 0, finishHeartRate: 150 });
  assert.equal(result.equationSexCoefficient, 1);
  assert.ok(Math.abs(result.vo2Max - 43.2215) < 0.01);
});

test('Rockport weight units are equivalent and seconds are included in decimal time', () => {
  const metric = estimateRockportVo2Max({ age: 45, weight: 80, weightUnit: 'kg', sexCoefficient: 'female', minutes: 16, seconds: 30, finishHeartRate: 142 });
  const imperial = estimateRockportVo2Max({ age: 45, weight: 80 * 2.20462262185, weightUnit: 'lb', sexCoefficient: 'female', minutes: 16.5, seconds: 0, finishHeartRate: 142 });
  assert.ok(Math.abs(metric.vo2Max - imperial.vo2Max) < 1e-9);
  assert.equal(metric.walkMinutes, 16.5);
});

test('Rockport enforces source population and plausible protocol-input bounds', () => {
  const valid = { age: 40, weight: 75, sexCoefficient: 'female', minutes: 16, seconds: 0, finishHeartRate: 140 };
  assert.throws(() => estimateRockportVo2Max({ ...valid, age: 29 }), RangeError);
  assert.throws(() => estimateRockportVo2Max({ ...valid, age: 70 }), RangeError);
  assert.throws(() => estimateRockportVo2Max({ ...valid, seconds: 60 }), RangeError);
  assert.throws(() => estimateRockportVo2Max({ ...valid, finishHeartRate: 221 }), RangeError);
  assert.throws(() => estimateRockportVo2Max({ ...valid, weightUnit: 'stone' }), RangeError);
});
