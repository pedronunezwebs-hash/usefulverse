import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateSolarPanel } from './logic.mjs';

test('estimates daily, monthly and yearly output with explicit loss assumptions', () => {
  const result = calculateSolarPanel({ panelCount: 2, panelWatts: 500, peakSunHours: 5, lossPercent: 20 });
  assert.equal(result.systemSizeKw, 1);
  assert.equal(result.dailyProductionKwh, 4);
  assert.equal(result.monthlyProductionKwh, 4 * 365 / 12);
  assert.equal(result.annualProductionKwh, 1460);
});

test('estimates an integer panel count rounded up for a daily energy target', () => {
  const result = calculateSolarPanel({ mode: 'sizing', dailyTargetKwh: 4, panelWatts: 400, peakSunHours: 5, lossPercent: 20 });
  assert.equal(result.panelCount, 3);
  assert.ok(result.dailyProductionKwh >= 4);
});

test('calculates optional area, bill offset and simple payback from entered assumptions', () => {
  const result = calculateSolarPanel({ panelCount: 10, panelWatts: 100, peakSunHours: 5, lossPercent: 0, panelLengthM: 1, panelWidthM: 0.5, electricityRate: 0.15, systemCost: 5000 });
  assert.equal(result.panelAreaM2, 5);
  assert.equal(result.annualBillOffset, 273.75);
  assert.equal(result.simplePaybackYears, 5000 / 273.75);
});

test('returns no payback when annual offset is zero or the installation cost is absent', () => {
  assert.equal(calculateSolarPanel({ panelWatts: 400, peakSunHours: 5, lossPercent: 0, electricityRate: 0, systemCost: 5000 }).simplePaybackYears, null);
  assert.equal(calculateSolarPanel({ panelWatts: 400, peakSunHours: 5, lossPercent: 0, electricityRate: 0.2 }).simplePaybackYears, null);
});

test('rejects unsupported modes, non-integer panel counts, invalid paired dimensions and unsafe estimates', () => {
  assert.throws(() => calculateSolarPanel({ mode: 'quote' }), /production or sizing/u);
  assert.throws(() => calculateSolarPanel({ panelCount: 1.5, panelWatts: 400, peakSunHours: 5 }), /whole number/u);
  assert.throws(() => calculateSolarPanel({ panelWatts: 400, peakSunHours: 5, panelLengthM: 1 }), /both panel dimensions/u);
  assert.throws(() => calculateSolarPanel({ panelWatts: 400, peakSunHours: 5, electricityRate: 0.2, currency: 'XYZ' }), /supported currency/u);
  assert.throws(() => calculateSolarPanel({ mode: 'sizing', dailyTargetKwh: 1000, panelWatts: 50, peakSunHours: 0.1 }), /supported range/u);
});
