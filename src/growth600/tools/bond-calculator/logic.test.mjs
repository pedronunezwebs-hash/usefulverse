import assert from 'node:assert/strict';
import test from 'node:test';
import { bondPriceAtYield, buildBondYieldCurve, calculateBondPrice, solveBondYield } from './logic.mjs';

const parBond = { faceValue: '1000', couponPercent: '5', years: '5', frequency: 'annual' };

test('coupon equal to yield prices a fixed coupon bond at par', () => {
  const estimate = calculateBondPrice({ ...parBond, yieldPercent: '5' });
  assert.ok(Math.abs(estimate.price - 1000) < 1e-9);
  assert.equal(estimate.premiumDiscount, 0);
  assert.ok(Math.abs(solveBondYield({ ...parBond, marketPrice: '1000' }).yieldPercent - 5) < 1e-9);
});

test('yield solving and price work with semiannual cash flows and fractional-year maturity', () => {
  const terms = { faceValue: '1000', couponPercent: '5', years: '2.5', frequency: 'semiannual' };
  const price = calculateBondPrice({ ...terms, yieldPercent: '5' });
  assert.equal(price.periods, 5);
  assert.equal(price.couponPayment, 25);
  assert.ok(Math.abs(price.price - 1000) < 1e-9);
  assert.ok(Math.abs(solveBondYield({ ...terms, marketPrice: String(price.price) }).yieldPercent - 5) < 1e-8);
});

test('higher yields lower price and lower yields raise price', () => {
  assert.ok(bondPriceAtYield(parBond, 6) < bondPriceAtYield(parBond, 5));
  assert.ok(bondPriceAtYield(parBond, 4) > bondPriceAtYield(parBond, 5));
});

test('zero-coupon bond has no coupons and yield comes from the discount to face', () => {
  const terms = { faceValue: '1000', couponPercent: '0', years: '2', frequency: 'annual' };
  const solved = solveBondYield({ ...terms, marketPrice: '907.029478458' });
  assert.ok(Math.abs(solved.yieldPercent - 5) < 1e-8);
  assert.equal(solved.currentYieldPercent, 0);
  assert.equal(calculateBondPrice({ ...terms, yieldPercent: '5' }).totalCouponPayments, 0);
});

test('coupon yield curve is bounded, finite around the solved yield and decreasing', () => {
  const curve = buildBondYieldCurve(parBond, 5);
  assert.equal(curve.length, 41);
  assert.ok(curve.every(({ price }) => Number.isFinite(price)));
  assert.ok(curve[0].yieldPercent < 5 && curve.at(-1).yieldPercent > 5);
  assert.ok(curve[0].price > curve.at(-1).price);
});

test('rejects invalid prices, terms, coupon schedules and out-of-domain yields', () => {
  assert.throws(() => solveBondYield({ ...parBond, marketPrice: '0' }));
  assert.throws(() => calculateBondPrice({ ...parBond, yieldPercent: '-100' }), /Yield/u);
  assert.throws(() => calculateBondPrice({ ...parBond, frequency: 'weekly' }));
  assert.throws(() => calculateBondPrice({ ...parBond, years: '5.5', frequency: 'annual' }), (error) => error.code === 'invalidPeriods');
  assert.throws(() => calculateBondPrice({ ...parBond, years: '99.99', frequency: 'monthly' }), (error) => error.code === 'invalidPeriods');
  assert.throws(() => calculateBondPrice({ ...parBond, couponPercent: '1001' }));
});
