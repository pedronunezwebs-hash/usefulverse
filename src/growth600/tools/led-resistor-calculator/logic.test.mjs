import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateLedResistor } from './logic.mjs';

test('calculates the requested LED series resistance and a conservative E12 choice', () => {
  const result = calculateLedResistor({ supplyVoltage: 12, forwardVoltage: 2, targetCurrentMa: 20 });
  assert.equal(result.requiredResistanceOhms, 500);
  assert.equal(result.resistorOhms, 560);
  assert.ok(result.actualCurrentMa < 20);
  assert.equal(result.resistorPowerW, 10 / 560 * 10);
  assert.equal(result.minimumPowerRatingW, 0.5);
});

test('supports multiple LEDs in series and the denser E24 series', () => {
  const result = calculateLedResistor({ supplyVoltage: 9, forwardVoltage: 2, ledCount: 2, targetCurrentMa: 20, series: 'E24' });
  assert.equal(result.totalLedVoltage, 4);
  assert.equal(result.requiredResistanceOhms, 250);
  assert.equal(result.resistorOhms, 270);
  assert.ok(result.actualCurrentMa < result.targetCurrentMa);
});

test('rejects missing, invalid and physically impossible inputs', () => {
  assert.throws(() => calculateLedResistor({}), /required/u);
  assert.throws(() => calculateLedResistor({ supplyVoltage: 2, forwardVoltage: 2, targetCurrentMa: 20 }), /greater than/u);
  assert.throws(() => calculateLedResistor({ supplyVoltage: 12, forwardVoltage: 2, ledCount: 0, targetCurrentMa: 20 }), /1 to 100/u);
  assert.throws(() => calculateLedResistor({ supplyVoltage: 12, forwardVoltage: 2, targetCurrentMa: 0 }), /outside the supported range/u);
  assert.throws(() => calculateLedResistor({ supplyVoltage: 12, forwardVoltage: 2, targetCurrentMa: 20, series: 'E48' }), /E12 or E24/u);
});
