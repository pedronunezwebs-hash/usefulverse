import test from 'node:test';
import assert from 'node:assert/strict';
import { getNorwayParentalBenefitEntitlement } from './norway-parental-benefit.mjs';
import { createNorwayParentalPlanIcs, validateNorwayParentalCalendar } from './norway-parental-calendar.mjs';

const entitlement = () => getNorwayParentalBenefitEntitlement({ eventType: 'birth', eventDate: '2026-11-01', children: 1, coveragePct: 100 });
const period = (overrides = {}) => ({ id: 'mother-1', label: 'Mother leave', parent: 'mother', quota: 'mother', startDate: '2026-11-02', endDate: '2026-11-20', withdrawalPct: 100, ...overrides });

test('calendar checks quota use on weekdays and preserves the official remaining balances', () => {
  const result = validateNorwayParentalCalendar(entitlement(), [period()]);
  assert.equal(result.periods[0].weekdays, 15);
  assert.equal(result.used.mother, 15);
  assert.equal(result.remaining.mother, 60);
  assert.equal(result.totalUsed, 15);
});

test('partial work reduces withdrawal and extends the calendar over more weekdays', () => {
  const result = validateNorwayParentalCalendar(entitlement(), [period({ endDate: '2026-11-27', withdrawalPct: 50 })]);
  assert.equal(result.periods[0].weekdays, 20);
  assert.equal(result.used.mother, 10);
});

test('mother-only, other-parent and shared quota rules are enforced', () => {
  assert.throws(() => validateNorwayParentalCalendar(entitlement(), [period({ parent: 'otherParent' })]), /mother-only/u);
  assert.throws(() => validateNorwayParentalCalendar(entitlement(), [period({ parent: 'mother', quota: 'otherParent' })]), /other parent's quota/u);
  const shared = validateNorwayParentalCalendar(entitlement(), [period({ parent: 'otherParent', quota: 'shared' })]);
  assert.equal(shared.used.shared, 15);
});

test('combined simultaneous withdrawal cannot exceed 100 percent', () => {
  const rows = [
    period({ id: 'a', quota: 'mother', withdrawalPct: 60 }),
    period({ id: 'b', parent: 'otherParent', quota: 'otherParent', withdrawalPct: 40 }),
  ];
  assert.equal(validateNorwayParentalCalendar(entitlement(), rows).simultaneousWithdrawalMaxPct, 100);
  assert.throws(() => validateNorwayParentalCalendar(entitlement(), [...rows, period({ id: 'c', quota: 'mother', withdrawalPct: 1 })]), /exceeds 100 percent/u);
});

test('quota and overall allocation cannot be exceeded', () => {
  assert.throws(() => validateNorwayParentalCalendar(entitlement(), [period({ startDate: '2026-11-02', endDate: '2027-02-19' })]), /mother quota/u);
});

test('periods end no later than three years after birth or adoption', () => {
  assert.throws(() => validateNorwayParentalCalendar(entitlement(), [period({ startDate: '2029-11-02', endDate: '2029-11-02' })]), /three-year NAV window/u);
});

test('invalid ranges, repeated IDs, invalid roles and adoption prenatal periods are rejected', () => {
  assert.throws(() => validateNorwayParentalCalendar(entitlement(), [period({ startDate: '2026-12-01', endDate: '2026-11-30' })]), /ends before/u);
  assert.throws(() => validateNorwayParentalCalendar(entitlement(), [period(), period({ startDate: '2026-12-01', endDate: '2026-12-01' })]), /duplicated/u);
  assert.throws(() => validateNorwayParentalCalendar(entitlement(), [period({ parent: 'child' })]), /must name a parent/u);
  const adopted = getNorwayParentalBenefitEntitlement({ eventType: 'adoption', eventDate: '2026-11-01' });
  assert.throws(() => validateNorwayParentalCalendar(adopted, [period({ quota: 'prenatal' })]), /do not have prenatal/u);
});

test('ICS exports local all-day events with exclusive end dates and escaped text', () => {
  const result = validateNorwayParentalCalendar(entitlement(), [period({ label: 'Leave; family, week 1' })]);
  const ics = createNorwayParentalPlanIcs(result, 'Family; plan, 2026');
  assert.match(ics, /DTSTART;VALUE=DATE:20261102/u);
  assert.match(ics, /DTEND;VALUE=DATE:20261121/u);
  assert.match(ics, /SUMMARY:Leave\\; family\\, week 1/u);
  assert.match(ics, /X-WR-CALNAME:Family\\; plan\\, 2026/u);
  assert.throws(() => createNorwayParentalPlanIcs({}), /Validate the calendar/u);
});
