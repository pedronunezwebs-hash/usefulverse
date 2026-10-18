import test from 'node:test';
import assert from 'node:assert/strict';
import { getNorwayParentalBenefitEntitlement, norwayParentalBenefitRules2026 } from './norway-parental-benefit.mjs';

test('NAV source date and Norwegian 2026 basic amount are explicit', () => {
  assert.equal(norwayParentalBenefitRules2026.checkedAt, '2026-10-17');
  assert.equal(norwayParentalBenefitRules2026.supportedFrom, '2022-08-02');
  assert.equal(norwayParentalBenefitRules2026.schemeChangeDate, '2024-07-01');
  assert.equal(norwayParentalBenefitRules2026.basicAmountNok, 136549);
  assert.equal(norwayParentalBenefitRules2026.minimumAnnualIncomeNok, 68275);
  assert.equal(norwayParentalBenefitRules2026.benefitBasisCapNok, 819294);
});

test('birth with one child at 100% allocates prenatal, parental quotas and shared weeks', () => {
  const plan = getNorwayParentalBenefitEntitlement({ eventType: 'birth', eventDate: '2026-11-01', children: 1, coveragePct: 100 });
  assert.deepEqual(plan.total, { weeks: 49, days: 0, benefitDays: 245 });
  assert.deepEqual(plan.prenatal, { weeks: 3, days: 0, benefitDays: 15 });
  assert.deepEqual(plan.motherQuota, { weeks: 15, days: 0, benefitDays: 75 });
  assert.deepEqual(plan.otherParentQuota, { weeks: 15, days: 0, benefitDays: 75 });
  assert.deepEqual(plan.shared, { weeks: 16, days: 0, benefitDays: 80 });
});

test('birth with one child at 80% follows the extended post-July-2024 NAV table', () => {
  const plan = getNorwayParentalBenefitEntitlement({ eventType: 'birth', eventDate: '2026-11-01', children: 1, coveragePct: 80 });
  assert.deepEqual(plan.total, { weeks: 61, days: 1, benefitDays: 306 });
  assert.deepEqual(plan.shared, { weeks: 20, days: 1, benefitDays: 101 });
});

test('pre-July-2024 birth and adoption use their earlier 80% tables', () => {
  const birth = getNorwayParentalBenefitEntitlement({ eventType: 'birth', eventDate: '2024-06-30', coveragePct: 80 });
  const adoption = getNorwayParentalBenefitEntitlement({ eventType: 'adoption', eventDate: '2024-06-30', coveragePct: 80 });
  assert.equal(birth.cohort, 'beforeSchemeChange');
  assert.deepEqual(birth.total, { weeks: 59, days: 0, benefitDays: 295 });
  assert.deepEqual(birth.shared, { weeks: 18, days: 0, benefitDays: 90 });
  assert.deepEqual(adoption.total, { weeks: 56, days: 0, benefitDays: 280 });
  assert.deepEqual(adoption.shared, { weeks: 18, days: 0, benefitDays: 90 });
});

test('adoption starts at care transfer and does not invent prenatal leave', () => {
  const plan = getNorwayParentalBenefitEntitlement({ eventType: 'adoption', eventDate: '2026-11-01', children: 1, coveragePct: 100 });
  assert.deepEqual(plan.total, { weeks: 46, days: 0, benefitDays: 230 });
  assert.deepEqual(plan.prenatal, { weeks: 0, days: 0, benefitDays: 0 });
  assert.deepEqual(plan.shared, { weeks: 16, days: 0, benefitDays: 80 });
});

test('multiple birth or adoption totals follow the corresponding official table', () => {
  const birthTwins = getNorwayParentalBenefitEntitlement({ eventType: 'birth', eventDate: '2026-11-01', children: 2, coveragePct: 100 });
  const adoptTriplets = getNorwayParentalBenefitEntitlement({ eventType: 'adoption', eventDate: '2026-11-01', children: 3, coveragePct: 80 });
  assert.deepEqual(birthTwins.total, { weeks: 66, days: 0, benefitDays: 330 });
  assert.deepEqual(birthTwins.shared, { weeks: 33, days: 0, benefitDays: 165 });
  assert.deepEqual(adoptTriplets.total, { weeks: 115, days: 4, benefitDays: 579 });
  assert.deepEqual(adoptTriplets.shared, { weeks: 77, days: 4, benefitDays: 389 });
});

test('coverage table rejects pre-effective cohorts and invalid calendar dates', () => {
  assert.throws(() => getNorwayParentalBenefitEntitlement({ eventType: 'birth', eventDate: '2022-08-01' }), /older NAV table/u);
  assert.throws(() => getNorwayParentalBenefitEntitlement({ eventType: 'birth', eventDate: '2026-02-30' }), /real calendar date/u);
});

test('unsupported eligibility and coverage cases are sent to NAV rather than guessed', () => {
  assert.throws(() => getNorwayParentalBenefitEntitlement({ eventType: 'birth', eventDate: '2026-11-01', bothParentsEligible: false }), /outside this version|standard case/u);
  assert.throws(() => getNorwayParentalBenefitEntitlement({ eventType: 'birth', eventDate: '2026-11-01', coveragePct: 90 }), /80 or 100/u);
  assert.throws(() => getNorwayParentalBenefitEntitlement({ eventType: 'foster', eventDate: '2026-11-01' }), /birth or adoption/u);
});

test('result is immutable and flags that simultaneous use is not modeled', () => {
  const plan = getNorwayParentalBenefitEntitlement({ eventType: 'birth', eventDate: '2026-11-01' });
  assert.equal(plan.simultaneousParentUse, false);
  assert.ok(Object.isFrozen(plan));
  assert.ok(Object.isFrozen(plan.notes));
});
