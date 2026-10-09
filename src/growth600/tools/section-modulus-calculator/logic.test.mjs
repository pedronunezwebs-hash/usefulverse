import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateSectionProperties } from './logic.mjs';

test('square section has equal Ix and Iy and expected centroid and section modulus', () => {
  const result = calculateSectionProperties({ shape: 'rectangle', width: 10, height: 10 });
  assert.equal(result.area, 100);
  assert.equal(result.centroidX, 5);
  assert.equal(result.centroidY, 5);
  assert.equal(result.ix, 10 ** 4 / 12);
  assert.equal(result.ix, result.iy);
  assert.equal(result.zxTop, result.zxBottom);
});

test('circle and hollow circle use centroidal second-moment formulas', () => {
  const solid = calculateSectionProperties({ shape: 'circle', diameter: 8 });
  assert.equal(solid.ix, Math.PI * 8 ** 4 / 64);
  assert.equal(solid.ix, solid.iy);
  const tube = calculateSectionProperties({ shape: 'hollow-circle', outerDiameter: 8, innerDiameter: 4 });
  assert.equal(tube.area, Math.PI * (8 ** 2 - 4 ** 2) / 4);
  assert.equal(tube.ix, Math.PI * (8 ** 4 - 4 ** 4) / 64);
});

test('hollow rectangle subtracts the centered void from area and both moments', () => {
  const result = calculateSectionProperties({ shape: 'hollow-rectangle', outerWidth: 10, outerHeight: 8, innerWidth: 6, innerHeight: 4 });
  assert.equal(result.area, 56);
  assert.equal(result.ix, (10 * 8 ** 3 - 6 * 4 ** 3) / 12);
  assert.equal(result.iy, (8 * 10 ** 3 - 4 * 6 ** 3) / 12);
});

test('triangle centroid and top/bottom section moduli reflect the asymmetric section', () => {
  const result = calculateSectionProperties({ shape: 'triangle', width: 6, height: 3 });
  assert.equal(result.area, 9);
  assert.equal(result.centroidY, 1);
  assert.equal(result.ix, 4.5);
  assert.equal(result.zxBottom, 4.5);
  assert.equal(result.zxTop, 2.25);
});

test('rejects invalid shapes, nonpositive dimensions, and voids that do not fit', () => {
  assert.throws(() => calculateSectionProperties({ shape: 'ibeam' }), TypeError);
  assert.throws(() => calculateSectionProperties({ shape: 'rectangle', width: 0, height: 2 }), RangeError);
  assert.throws(() => calculateSectionProperties({ shape: 'hollow-rectangle', outerWidth: 4, outerHeight: 4, innerWidth: 4, innerHeight: 2 }), RangeError);
  assert.throws(() => calculateSectionProperties({ shape: 'hollow-circle', outerDiameter: 4, innerDiameter: 4 }), RangeError);
});
