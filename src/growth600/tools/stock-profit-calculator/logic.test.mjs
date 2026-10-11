import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateStockProfit } from './logic.mjs';

const lot = (quantity, price, fee = 0) => ({ quantity, price, fee });

test('matches the plan acceptance example before fees', () => {
  const result = calculateStockProfit({ lots: [lot(10, 20)], sharesSold: 10, salePrice: 30 });
  assert.equal(result.profit, 100);
  assert.equal(result.costBasis, 200);
  assert.equal(result.remainingShares, 0);
});

test('includes buy and sale costs and estimates break-even price', () => {
  const result = calculateStockProfit({ lots: [lot(10, 20, 2)], sharesSold: 10, salePrice: 21, saleFee: 3 });
  assert.equal(result.costBasis, 202);
  assert.equal(result.netProceeds, 207);
  assert.equal(result.profit, 5);
  assert.equal(result.breakevenSalePrice, 20.5);
});

test('weighted-average basis allocates fees proportionally when selling part', () => {
  const result = calculateStockProfit({ lots: [lot(10, 10, 10), lot(10, 20)], sharesSold: 5, salePrice: 25 });
  assert.equal(result.averageCostPerShare, 15.5);
  assert.equal(result.costBasis, 77.5);
  assert.equal(result.remainingShares, 15);
  assert.equal(result.remainingCostBasis, 232.5);
});

test('FIFO basis uses earliest shares and apportions each lot purchase fee', () => {
  const result = calculateStockProfit({ lots: [lot(10, 10, 10), lot(10, 20, 20)], sharesSold: 12, salePrice: 22, method: 'fifo' });
  assert.equal(result.costBasis, 154);
  assert.equal(result.grossProceeds, 264);
  assert.equal(result.profit, 110);
  assert.equal(result.remainingShares, 8);
});

test('rejects invalid quantities, fees, method and unsupported partial-over-sale', () => {
  const base = { lots: [lot(10, 20)], sharesSold: 10, salePrice: 30 };
  assert.throws(() => calculateStockProfit({ ...base, sharesSold: 11 }), /Shares to sell/u);
  assert.throws(() => calculateStockProfit({ ...base, lots: [lot(0, 20)] }), /Lot 1 shares/u);
  assert.throws(() => calculateStockProfit({ ...base, saleFee: -1 }), /Sale fee/u);
  assert.throws(() => calculateStockProfit({ ...base, method: 'lifo' }), /Choose average cost or FIFO/u);
  assert.throws(() => calculateStockProfit({ ...base, currency: 'US' }), /three-letter/u);
});

test('breakeven and returns are explicit when purchase price is zero', () => {
  const result = calculateStockProfit({ lots: [lot(2, 0)], sharesSold: 1, salePrice: 5 });
  assert.equal(result.profit, 5);
  assert.equal(result.returnPercent, null);
});
