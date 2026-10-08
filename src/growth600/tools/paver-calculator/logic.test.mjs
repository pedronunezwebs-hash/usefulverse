import assert from 'node:assert/strict';
import test from 'node:test';
import { calculatePavers } from './logic.mjs';

const basic = {
  length: 10, width: 10, surfaceUnit: 'm', moduleLength: 40, moduleWidth: 40, moduleUnit: 'cm',
  paversPerModule: 1, baseDepth: 10, baseDepthUnit: 'cm',
};

test('counts full repeating modules, border perimeter and base volume', () => {
  const result = calculatePavers(basic);
  assert.equal(result.areaM2, 100);
  assert.equal(result.modulesAlongLength, 25);
  assert.equal(result.modulesAlongWidth, 25);
  assert.equal(result.repeatModules, 625);
  assert.equal(result.paversToBuy, 625);
  assert.equal(result.perimeterM, 40);
  assert.equal(result.baseVolumeM3, 10);
});

test('handles modular patterns, boundary modules, material allowances and optional costs', () => {
  const result = calculatePavers({
    ...basic, length: 10.1, width: 8.2, moduleLength: 20, moduleWidth: 10, paversPerModule: 3,
    paverWastePercent: 5, baseDepth: 4, baseDepthUnit: 'in', baseWastePercent: 10,
    pricePerPaver: 2.5, basePricePerM3: 50, currency: 'EUR',
  });
  assert.equal(result.repeatModules, 4182);
  assert.equal(result.paversBeforeWaste, 12546);
  assert.equal(result.paversToBuy, 13174);
  assert.ok(Math.abs(result.perimeterM - 36.6) < 1e-10);
  assert.ok(Math.abs(result.baseOrderVolumeM3 - (10.1 * 8.2 * 0.1016 * 1.1)) < 1e-10);
  assert.equal(result.paverCost, 32935);
  assert.ok(Math.abs(result.baseCost - result.baseOrderVolumeM3 * 50) < 1e-10);
  assert.equal(result.estimatedCost, result.paverCost + result.baseCost);
});

test('supports imperial units, no base layer and an omitted cost', () => {
  const result = calculatePavers({
    length: 12, width: 10, surfaceUnit: 'ft', moduleLength: 12, moduleWidth: 12, moduleUnit: 'in',
    paversPerModule: 2, baseDepth: 0, baseDepthUnit: 'mm',
  });
  assert.equal(result.repeatModules, 120);
  assert.equal(result.paversToBuy, 240);
  assert.equal(result.baseVolumeM3, 0);
  assert.equal(result.estimatedCost, null);
  assert.ok(Math.abs(result.areaFt2 - 120) < 1e-10);
});

test('rejects invalid dimensions, modules, counts, depth, waste, currency and totals', () => {
  for (const input of [
    { ...basic, length: 0 }, { ...basic, surfaceUnit: 'yd' }, { ...basic, moduleWidth: 0 },
    { ...basic, moduleUnit: 'ft' }, { ...basic, paversPerModule: 1.5 }, { ...basic, paversPerModule: 1001 },
    { ...basic, baseDepth: -1 }, { ...basic, baseDepth: 101 }, { ...basic, baseDepthUnit: 'ft' },
    { ...basic, paverWastePercent: 51 }, { ...basic, baseWastePercent: -1 },
    { ...basic, pricePerPaver: -1 }, { ...basic, basePricePerM3: 5, currency: 'EU' },
    { ...basic, length: 100_000, width: 100_000, moduleLength: 1, moduleWidth: 1, paversPerModule: 1000 },
  ]) assert.throws(() => calculatePavers(input), RangeError);
});
