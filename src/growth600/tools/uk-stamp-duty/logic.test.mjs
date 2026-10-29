import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateUKPurchaseTax, UK_PROPERTY_TAX_MAINTENANCE } from './logic.mjs';

test('UK property tax estimate applies England bands, first-time relief and stackable surcharges', () => {
  assert.equal(estimateUKPurchaseTax({ price: 500_000 }).tax, 15_000);
  assert.equal(estimateUKPurchaseTax({ price: 500_000, firstTime: true }).tax, 10_000);
  const surcharges = estimateUKPurchaseTax({ price: 500_000, additionalProperty: true, nonResident: true });
  assert.equal(surcharges.mainTax, 15_000);
  assert.equal(surcharges.additionalCharge, 35_000);
  assert.equal(surcharges.tax, 50_000);
  assert.equal(estimateUKPurchaseTax({ price: 300_000, region: 'northern-ireland', firstTime: true }).tax, 0);
});

test('UK property tax estimate applies Scottish and Welsh territory-specific bands', () => {
  assert.equal(estimateUKPurchaseTax({ price: 200_000, region: 'scotland', firstTime: true }).tax, 500);
  const scottishAdditional = estimateUKPurchaseTax({ price: 200_000, region: 'scotland', additionalProperty: true });
  assert.equal(scottishAdditional.mainTax, 1_100);
  assert.equal(scottishAdditional.additionalCharge, 16_000);
  assert.equal(scottishAdditional.tax, 17_100);
  assert.equal(estimateUKPurchaseTax({ price: 280_000, region: 'wales' }).tax, 3_300);
  assert.equal(estimateUKPurchaseTax({ price: 260_000, region: 'wales', additionalProperty: true }).tax, 15_950);
  assert.throws(() => estimateUKPurchaseTax({ price: 200_000, region: 'wales', firstTime: true }), RangeError);
});

test('UK property tax snapshot carries source dates and expires safely after review', () => {
  assert.deepEqual([UK_PROPERTY_TAX_MAINTENANCE.effectiveFrom, UK_PROPERTY_TAX_MAINTENANCE.checkedAt, UK_PROPERTY_TAX_MAINTENANCE.reviewDue], ['2026-04-01', '2026-10-19', '2026-11-19']);
  assert.equal(estimateUKPurchaseTax({ price: 100_000, asOf: '2026-11-19' }).checkedDate, '2026-10-19');
  assert.throws(() => estimateUKPurchaseTax({ price: 100_000, asOf: '2026-03-31' }), (error) => error.code === 'rules-not-effective');
  assert.throws(() => estimateUKPurchaseTax({ price: 100_000, asOf: '2026-11-20' }), (error) => error.code === 'rules-expired');
  assert.throws(() => estimateUKPurchaseTax({ price: 100_000, asOf: '2026-02-30' }), RangeError);
});
