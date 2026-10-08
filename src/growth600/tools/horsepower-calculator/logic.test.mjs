import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateHorsepower } from './logic.mjs';

test('converts torque and RPM to mechanical horsepower', () => {
  const result = calculateHorsepower({ torque: 100, torqueUnit: 'lb·ft', rpm: 5252, powerUnit: 'hp' });
  assert.ok(Math.abs(result.power - 100) < 0.02);
  assert.equal(result.powerUnit, 'hp');
});

test('zero torque gives zero power', () => {
  const result = calculateHorsepower({ torque: 0, rpm: 2400 });
  assert.equal(result.watts, 0);
  assert.equal(result.power, 0);
});

test('solves torque and RPM from power', () => {
  const torque = calculateHorsepower({ mode: 'solve-torque', power: 10, powerUnit: 'kW', rpm: 1000 });
  assert.ok(Math.abs(torque.torqueNm - 95.492965855) < 1e-8);
  const rpm = calculateHorsepower({ mode: 'solve-rpm', power: 10, powerUnit: 'kW', torque: torque.torqueNm });
  assert.ok(Math.abs(rpm.rpm - 1000) < 1e-9);
});

test('converts lb·ft and metric horsepower without changing the physical result', () => {
  const result = calculateHorsepower({ torque: 100 / 1.3558179483314, torqueUnit: 'lb·ft', rpm: 1000, powerUnit: 'PS' });
  assert.ok(Math.abs(result.torqueNm - 100) < 1e-6);
  assert.ok(Math.abs(result.power - (100 * 2 * Math.PI * 1000 / 60 / 735.49875)) < 1e-10);
});

test('rejects singular, incompatible, invalid and out-of-range input', () => {
  assert.throws(() => calculateHorsepower({ mode: 'solve-torque', power: 5, rpm: 0 }), /supported range/);
  assert.throws(() => calculateHorsepower({ mode: 'solve-rpm', power: 5, torque: 0 }), /must not be zero/);
  assert.throws(() => calculateHorsepower({ mode: 'solve-rpm', power: -5, torque: 10 }), /matching signs/);
  assert.throws(() => calculateHorsepower({ torque: '', rpm: 1 }), /required/);
  assert.throws(() => calculateHorsepower({ torque: 1, rpm: -1 }), /supported range/);
  assert.throws(() => calculateHorsepower({ torque: 1, rpm: 1, torqueUnit: 'kg' }), /supported units/);
  assert.throws(() => calculateHorsepower({ mode: 'unknown' }), /supported calculation/);
});
