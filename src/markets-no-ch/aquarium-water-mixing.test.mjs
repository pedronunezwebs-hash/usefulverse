import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateAquariumMix, hardnessToGermanDegrees } from './aquarium-water-mixing.mjs';

test('converts common aquarium hardness units to German degrees', () => {
  assert.equal(hardnessToGermanDegrees(10, 'dH'), 10);
  assert.equal(hardnessToGermanDegrees(17.848, 'ppm'), 1);
  assert.equal(hardnessToGermanDegrees(1.7857142857142856, 'fH'), 1);
  assert.equal(hardnessToGermanDegrees(1, 'meq'), 2.8);
  assert.throws(() => hardnessToGermanDegrees(-1, 'dH'), RangeError);
  assert.throws(() => hardnessToGermanDegrees(1, 'unknown'), RangeError);
});

test('calculates a compatible tap/RO blend using GH and KH together', () => {
  const result = calculateAquariumMix({ sourceA: { gh: 10, kh: 5 }, sourceB: { gh: 0, kh: 0 }, target: { gh: 5, kh: 2.5 }, volume: 100 });
  assert.equal(result.status, 'compatible');
  assert.equal(result.percentA, 50);
  assert.equal(result.litresA, 50);
  assert.equal(result.litresB, 50);
  assert.equal(result.predictedGh, 5);
  assert.equal(result.predictedKh, 2.5);
});

test('uses measured source values rather than assuming RO is exactly zero', () => {
  const result = calculateAquariumMix({ sourceA: { gh: 12, kh: 6 }, sourceB: { gh: 2, kh: 1 }, target: { gh: 7, kh: 3.5 }, volume: 40 });
  assert.equal(result.status, 'compatible');
  assert.equal(result.percentA, 50);
  assert.equal(result.litresA + result.litresB, 40);
});

test('reports independently reachable but mutually incompatible GH/KH targets without inventing a recipe', () => {
  const result = calculateAquariumMix({ sourceA: { gh: 10, kh: 10 }, sourceB: { gh: 0, kh: 0 }, target: { gh: 5, kh: 2 }, volume: 100 });
  assert.equal(result.status, 'incompatible');
  assert.equal(result.ghFraction, 0.5);
  assert.equal(result.khFraction, 0.2);
  assert.equal('litresA' in result, false);
  assert.equal('litresB' in result, false);
});

test('reports targets outside both measured source ranges as unreachable', () => {
  const result = calculateAquariumMix({ sourceA: { gh: 10, kh: 5 }, sourceB: { gh: 2, kh: 1 }, target: { gh: 12, kh: 3 }, volume: 80 });
  assert.equal(result.status, 'unreachable');
});

test('supports a hardness dimension that is identical in both sources', () => {
  const result = calculateAquariumMix({ sourceA: { gh: 10, kh: 4 }, sourceB: { gh: 0, kh: 4 }, target: { gh: 7, kh: 4 }, volume: 30 });
  assert.equal(result.status, 'compatible');
  assert.equal(result.percentA, 70);
});

test('converts ppm inputs and target to a consistent blend', () => {
  const result = calculateAquariumMix({ sourceA: { gh: 178.48, kh: 89.24 }, sourceB: { gh: 0, kh: 0 }, target: { gh: 89.24, kh: 44.62 }, volume: 50, unit: 'ppm' });
  assert.equal(result.status, 'compatible');
  assert.equal(result.percentA, 50);
  assert.ok(Math.abs(result.predictedGh - 89.24) < 1e-9);
});

test('rejects incomplete, negative, unsupported and oversized inputs', () => {
  const valid = { sourceA: { gh: 10, kh: 5 }, sourceB: { gh: 0, kh: 0 }, target: { gh: 5, kh: 2.5 }, volume: 100 };
  assert.throws(() => calculateAquariumMix({ ...valid, sourceA: { gh: NaN, kh: 5 } }), RangeError);
  assert.throws(() => calculateAquariumMix({ ...valid, sourceB: { gh: -1, kh: 0 } }), RangeError);
  assert.throws(() => calculateAquariumMix({ ...valid, volume: 0 }), RangeError);
  assert.throws(() => calculateAquariumMix({ ...valid, volume: 100001 }), RangeError);
  assert.throws(() => calculateAquariumMix({ ...valid, unit: 'psi' }), RangeError);
});
