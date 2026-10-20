import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateFaceShape } from './logic.mjs';

test('face proportion guide returns transparent ratios for common geometric patterns', () => {
  assert.equal(estimateFaceShape({ foreheadWidth: 70, cheekboneWidth: 100, jawWidth: 60, faceLength: 130 }).shape, 'diamond');
  assert.equal(estimateFaceShape({ foreheadWidth: 100, cheekboneWidth: 90, jawWidth: 60, faceLength: 130 }).shape, 'heart');
  assert.equal(estimateFaceShape({ foreheadWidth: 80, cheekboneWidth: 80, jawWidth: 80, faceLength: 132 }).shape, 'oblong');
  assert.equal(estimateFaceShape({ foreheadWidth: 100, cheekboneWidth: 100, jawWidth: 100, faceLength: 120 }).shape, 'round-or-square');
  assert.ok(Math.abs(estimateFaceShape({ foreheadWidth: 80, cheekboneWidth: 80, jawWidth: 80, faceLength: 120 }).ratios.lengthToCheek - 1.5) < 1e-12);
});

test('face proportion guide rejects missing, non-finite and out-of-range measurements', () => {
  for (const value of [0, -1, Infinity, 'nope', 1001]) {
    assert.throws(() => estimateFaceShape({ foreheadWidth: value, cheekboneWidth: 80, jawWidth: 70, faceLength: 100 }));
  }
});
