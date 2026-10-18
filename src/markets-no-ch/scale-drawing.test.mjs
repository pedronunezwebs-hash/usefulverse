import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateScale, calculateScaleTable, createScaleBarSvg, scaleTableCsv } from './scale-drawing.mjs';

test('1:100 and 10 mm on paper represent 1 m in reality', () => {
  const result = calculateScale({ sourceDenominator: 100, targetDenominator: 100, drawingDistance: 10, drawingUnit: 'mm' });
  assert.equal(result.realLengthMm, 1000);
  assert.equal(result.targetDrawingLengthMm, 10);
});

test('changing from 1:100 to 1:50 produces a 200% print factor', () => {
  const result = calculateScale({ sourceDenominator: 100, targetDenominator: 50, drawingDistance: 10, drawingUnit: 'mm' });
  assert.equal(result.printScalePercent, 200);
  assert.equal(result.targetDrawingLengthMm, 20);
});

test('supports unit conversions and preserves ratios when reversing a scale', () => {
  const metres = calculateScale({ sourceDenominator: 100, targetDenominator: 100, drawingDistance: 1, drawingUnit: 'cm' });
  const inches = calculateScale({ sourceDenominator: 100, targetDenominator: 50, drawingDistance: 1, drawingUnit: 'in' });
  assert.equal(metres.realLengthMm, 1000);
  assert.equal(inches.targetDrawingLengthMm, 50.8);
  assert.equal(calculateScale({ sourceDenominator: 50, targetDenominator: 100, drawingDistance: 20, drawingUnit: 'mm' }).printScalePercent, 50);
});

test('builds a bounded measurement table for multiple real distances', () => {
  const rows = calculateScaleTable({ sourceDenominator: 100, targetDenominator: 50, distances: [1, 2.5], realUnit: 'm' });
  assert.deepEqual(rows.map(({ sourceDrawingMm, targetDrawingMm }) => [sourceDrawingMm, targetDrawingMm]), [[10, 20], [25, 50]]);
  assert.throws(() => calculateScaleTable({ sourceDenominator: 100, distances: Array(101).fill(1) }), /100/u);
});

test('scale bar uses its physical length and rejects bars outside print bounds', () => {
  const bar = createScaleBarSvg({ denominator: 100, realDistance: 10, realUnit: 'm' });
  assert.equal(bar.widthMm, 100);
  assert.match(bar.svg, /width="100mm"/u);
  assert.throws(() => createScaleBarSvg({ denominator: 10000, realDistance: 1, realUnit: 'm' }), /between 1 mm and 250 mm/u);
});

test('rejects zero denominators, zero distances, nonfinite input, and unknown units', () => {
  assert.throws(() => calculateScale({ sourceDenominator: 0, drawingDistance: 10 }), /between 1 and/u);
  assert.throws(() => calculateScale({ sourceDenominator: 100, drawingDistance: 0 }), /greater than zero/u);
  assert.throws(() => calculateScale({ sourceDenominator: 100, drawingDistance: Infinity }), /finite number/u);
  assert.throws(() => calculateScale({ sourceDenominator: 100, drawingDistance: 10, drawingUnit: 'parsec' }), /supported length unit/u);
});

test('CSV is escaped, deterministic, and handles an empty table', () => {
  const rows = calculateScaleTable({ sourceDenominator: 100, targetDenominator: 50, distances: [1], realUnit: 'm' });
  assert.match(scaleTableCsv(rows), /"1","1","m","10","20"/u);
  assert.match(scaleTableCsv([]), /"row","real_distance"/u);
});
