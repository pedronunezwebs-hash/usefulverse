import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateAcPower } from './logic.mjs';

test('balanced three-phase active, apparent and reactive powers use the line values and power factor', () => {
  const result = calculateAcPower({ lineVoltage: 400, lineCurrent: 10, powerFactor: 0.8 });
  assert.ok(Math.abs(result.activePowerW - Math.sqrt(3) * 400 * 10 * 0.8) < 1e-9);
  assert.ok(Math.abs(result.apparentPowerVA - Math.sqrt(3) * 4000) < 1e-9);
  assert.ok(Math.abs(result.reactivePowerVar - Math.sqrt(3) * 4000 * 0.6) < 1e-9);
  assert.ok(Math.abs(result.phaseVoltageV - 400 / Math.sqrt(3)) < 1e-9);
  assert.equal(result.phaseCurrentA, 10);
});

test('star and delta produce the corresponding phase voltage/current relationships without changing total power', () => {
  const input = { lineVoltage: 400, lineCurrent: 10, powerFactor: 0.8 };
  const star = calculateAcPower({ ...input, topology: 'star' });
  const delta = calculateAcPower({ ...input, topology: 'delta' });
  assert.ok(Math.abs(star.activePowerW - delta.activePowerW) < 1e-9);
  assert.equal(delta.phaseVoltageV, 400);
  assert.ok(Math.abs(delta.phaseCurrentA - 10 / Math.sqrt(3)) < 1e-9);
});

test('single-phase power follows S=VI and P=S×PF without applying the three-phase factor', () => {
  const result = calculateAcPower({ system: 'single-phase', lineVoltage: 230, lineCurrent: 10, powerFactor: 0.8, topology: 'ignored' });
  assert.equal(result.activePowerW, 1840);
  assert.equal(result.apparentPowerVA, 2300);
  assert.equal(result.reactivePowerVar, 1379.9999999999998);
  assert.equal(result.topology, null);
  assert.equal(result.phaseVoltageV, 230);
  assert.equal(result.phaseCurrentA, 10);
});

test('supports kV/kA inputs, unity and zero power factor, and zero current', () => {
  const kilo = calculateAcPower({ lineVoltage: 0.4, voltageUnit: 'kV', lineCurrent: 0.01, currentUnit: 'kA', powerFactor: 1 });
  assert.ok(Math.abs(kilo.activePowerW - Math.sqrt(3) * 400 * 10) < 1e-9);
  assert.equal(kilo.reactivePowerVar, 0);
  assert.equal(calculateAcPower({ lineVoltage: 400, lineCurrent: 10, powerFactor: 0 }).activePowerW, 0);
  assert.equal(calculateAcPower({ lineVoltage: 400, lineCurrent: 0, powerFactor: 0.8 }).apparentPowerVA, 0);
});

test('rejects invalid systems, topology, units, non-finite values and out-of-range power factor', () => {
  for (const patch of [{ system: 'dc' }, { topology: 'open-delta' }, { voltageUnit: 'mV' }, { currentUnit: 'mA' }, { lineVoltage: 0 }, { lineCurrent: -1 }, { powerFactor: -0.1 }, { powerFactor: 1.1 }, { powerFactor: NaN }]) {
    assert.throws(() => calculateAcPower({ lineVoltage: 400, lineCurrent: 10, powerFactor: 0.8, ...patch }));
  }
});
