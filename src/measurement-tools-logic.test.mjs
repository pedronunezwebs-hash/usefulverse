import test from 'node:test';
import assert from 'node:assert/strict';
import { angleBetweenRays, calibrateRuler, protractorPoint, rulerDistance } from './measurement-tools-logic.mjs';

test('screen ruler measures either marker order and permits zero distance', () => {
  assert.equal(rulerDistance(40, 240), 200);
  assert.equal(rulerDistance(240, 40), 200);
  assert.equal(rulerDistance(12, 12), 0);
  assert.throws(() => rulerDistance(0.5, 10), /whole CSS pixels/u);
  assert.throws(() => rulerDistance(0, 501), /0 to 500/u);
});

test('physical calibration reports millimeters and inches only from supplied reference', () => {
  assert.deepEqual(calibrateRuler(200, 400, 100), { millimeters: 50, inches: 50 / 25.4 });
  assert.deepEqual(calibrateRuler(0, 100, 50), { millimeters: 0, inches: 0 });
  assert.throws(() => calibrateRuler(30, 0, 10), /pixels must be greater than 0/u);
  assert.throws(() => calibrateRuler(30, 100, -1), /length must be greater than 0/u);
});

test('protractor calculates the smaller angle and maps endpoints consistently', () => {
  assert.equal(angleBetweenRays(30, 120), 90);
  assert.equal(angleBetweenRays(180, 0), 180);
  assert.deepEqual(protractorPoint(0), { x: 300, y: 160 });
  assert.deepEqual(protractorPoint(90), { x: 160, y: 20 });
  assert.deepEqual(protractorPoint(180), { x: 20, y: 159.99999999999997 });
  assert.throws(() => angleBetweenRays(181, 0), /0 to 180/u);
  assert.throws(() => protractorPoint(-1), /0 to 180/u);
});
