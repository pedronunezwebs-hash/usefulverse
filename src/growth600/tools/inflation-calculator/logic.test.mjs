import assert from 'node:assert/strict';
import test from 'node:test';
import { adjustByIndex, calculateCpiInflation, calculateCustomInflation, CPI_U_ANNUAL, CPI_U_FIRST_YEAR, CPI_U_LAST_YEAR } from './logic.mjs';

test('CPI table spans all years with official annual average data', () => {
  assert.equal(Object.keys(CPI_U_ANNUAL).length, 113);
  assert.equal(CPI_U_ANNUAL[CPI_U_FIRST_YEAR], 9.9);
  assert.equal(CPI_U_ANNUAL[CPI_U_LAST_YEAR], 321.943);
  assert.equal(CPI_U_ANNUAL[2024], 313.689);
});

test('100 indexed from 100 to 110 becomes 110 with 10% cumulative change', () => {
  const result = adjustByIndex({ amount: 100, startIndex: 100, endIndex: 110 });
  assert.ok(Math.abs(result.adjustedAmount - 110) < 1e-12);
  assert.ok(Math.abs(result.cumulativeChangePercent - 10) < 1e-12);
  assert.equal(result.priceLevelRatio, 1.1);
});

test('US CPI adjusts the same amount using the annual-average index ratio', () => {
  const result = calculateCpiInflation({ amount: 100, startYear: 2020, endYear: 2025 });
  assert.equal(result.adjustedAmount, 100 * 321.943 / 258.811);
  assert.equal(result.cumulativeChangePercent, (321.943 / 258.811 - 1) * 100);
  assert.equal(result.years, 5);
});

test('custom rate compounds annually and supports zero inflation', () => {
  assert.ok(Math.abs(calculateCustomInflation({ amount: 100, annualRatePercent: 10, years: 2 }).adjustedAmount - 121) < 1e-12);
  assert.equal(calculateCustomInflation({ amount: 50, annualRatePercent: 0, years: 25 }).adjustedAmount, 50);
});

test('deflation is supported without allowing a total price level of zero', () => {
  assert.equal(calculateCustomInflation({ amount: 100, annualRatePercent: -10, years: 2 }).adjustedAmount, 81);
  assert.throws(() => calculateCustomInflation({ amount: 100, annualRatePercent: -100, years: 2 }), RangeError);
});

test('rejects invalid years, non-positive amounts, invalid indexes and overflow', () => {
  assert.throws(() => calculateCpiInflation({ amount: 100, startYear: 2025, endYear: 2025 }), RangeError);
  assert.throws(() => calculateCpiInflation({ amount: 100, startYear: 1912, endYear: 2025 }), RangeError);
  assert.throws(() => calculateCustomInflation({ amount: -1, annualRatePercent: 3, years: 5 }), RangeError);
  assert.throws(() => calculateCustomInflation({ amount: 100, annualRatePercent: 3, years: 1.5 }), RangeError);
  assert.throws(() => calculateCustomInflation({ amount: 1e12, annualRatePercent: 1000, years: 200 }), RangeError);
  assert.throws(() => adjustByIndex({ amount: 0, startIndex: 1, endIndex: 1 }), RangeError);
});
