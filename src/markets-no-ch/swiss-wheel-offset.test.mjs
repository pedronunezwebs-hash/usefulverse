import test from 'node:test';
import assert from 'node:assert/strict';
import { compareWheelOffset, wheelMovementCsv } from './swiss-wheel-offset.mjs';

test('same width and ET increased by 10 mm moves center and inner lip 10 mm inward', () => {
  const result = compareWheelOffset({ currentWidth: 8, newWidth: 8, widthUnit: 'in', currentEt: 35, newEt: 45 });
  assert.equal(result.centerlineMovementMm, -10);
  assert.equal(result.innerMovementMm, 10);
  assert.equal(result.outerMovementMm, -10);
});

test('width and spacer effects are independent and combine with correct signs', () => {
  const wider = compareWheelOffset({ currentWidth: 8, newWidth: 9, currentEt: 35, newEt: 35 });
  assert.ok(Math.abs(wider.innerMovementMm - 12.7) < 1e-9);
  assert.ok(Math.abs(wider.outerMovementMm - 12.7) < 1e-9);
  const spacer = compareWheelOffset({ currentWidth: 8, newWidth: 8, currentEt: 35, newEt: 35, currentSpacer: 0, newSpacer: 10 });
  assert.equal(spacer.centerlineMovementMm, 10);
  assert.equal(spacer.innerMovementMm, -10);
  assert.equal(spacer.outerMovementMm, 10);
});

test('converts inch-based ET, spacer and clearance inputs to consistent millimetres', () => {
  const result = compareWheelOffset({ currentWidth: 203.2, newWidth: 203.2, widthUnit: 'mm', currentEt: 1.378, newEt: 1.772, offsetUnit: 'in', currentInnerClearance: 1, clearanceUnit: 'in' });
  assert.ok(Math.abs(result.centerlineMovementMm + 10.0076) < 1e-9);
  assert.ok(Math.abs(result.remainingInnerClearanceMm - 15.3924) < 1e-9);
});

test('optional baseline clearances estimate remaining room without calling it fitment approval', () => {
  const result = compareWheelOffset({ currentWidth: 8, newWidth: 9, currentEt: 35, newEt: 35, currentInnerClearance: 10, currentOuterClearance: 20 });
  assert.ok(Math.abs(result.remainingInnerClearanceMm + 2.7) < 1e-9);
  assert.ok(Math.abs(result.remainingOuterClearanceMm - 7.3) < 1e-9);
  assert.equal(result.isInnerClearanceNegative, true);
  assert.equal(result.isOuterClearanceNegative, false);
});

test('rejects missing, nonfinite, implausible or negative measurement values', () => {
  assert.throws(() => compareWheelOffset({ currentWidth: '', newWidth: 8, currentEt: 35, newEt: 35 }), /finite/u);
  assert.throws(() => compareWheelOffset({ currentWidth: 8, newWidth: 8, currentEt: NaN, newEt: 35 }), /finite/u);
  assert.throws(() => compareWheelOffset({ currentWidth: 1, newWidth: 8, currentEt: 35, newEt: 35 }), /50 and 1,000/u);
  assert.throws(() => compareWheelOffset({ currentWidth: 8, newWidth: 8, currentEt: 35, newEt: 35, currentInnerClearance: -1 }), /negative/u);
  assert.throws(() => compareWheelOffset({ currentWidth: 8, newWidth: 8, widthUnit: 'cm', currentEt: 35, newEt: 35 }), /inches or millimetres/u);
});

test('CSV export is deterministic, escaped and unavailable before a result', () => {
  assert.throws(() => wheelMovementCsv(null), /Calculate/u);
  const result = compareWheelOffset({ currentWidth: 8, newWidth: 8, currentEt: 35, newEt: 45 });
  assert.match(wheelMovementCsv(result), /inner rim movement/iu);
  assert.match(wheelMovementCsv(result), /"-10"/u);
});
