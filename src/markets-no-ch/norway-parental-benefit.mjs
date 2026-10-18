/**
 * NAV parental-benefit period tables for births/adoptions from 2022-08-02.
 * This describes the standard case where both parents have earned a right.
 * It is not an eligibility ruling or an individual NAV calculation.
 */
export const norwayParentalBenefitRules2026 = Object.freeze({
  rulesYear: 2026,
  checkedAt: '2026-10-17',
  supportedFrom: '2022-08-02',
  schemeChangeDate: '2024-07-01',
  source: 'https://www.nav.no/foreldrepenger',
  basicAmountSource: 'https://www.nav.no/grunnbelopet',
  basicAmountNok: 136549,
  minimumAnnualIncomeNok: 68275,
  benefitBasisCapNok: 819294,
  daysPerWeek: 5,
  entitlements: Object.freeze({
    beforeSchemeChange: Object.freeze({
      birth: Object.freeze({
        100: Object.freeze({ 1: [49, 0], 2: [66, 0], 3: [95, 0], prenatalWeeks: 3, motherQuotaWeeks: 15, otherParentQuotaWeeks: 15 }),
        80: Object.freeze({ 1: [59, 0], 2: [80, 0], 3: [115, 0], prenatalWeeks: 3, motherQuotaWeeks: 19, otherParentQuotaWeeks: 19 }),
      }),
      adoption: Object.freeze({
        100: Object.freeze({ 1: [46, 0], 2: [63, 0], 3: [92, 0], prenatalWeeks: 0, motherQuotaWeeks: 15, otherParentQuotaWeeks: 15 }),
        80: Object.freeze({ 1: [56, 0], 2: [77, 0], 3: [112, 0], prenatalWeeks: 0, motherQuotaWeeks: 19, otherParentQuotaWeeks: 19 }),
      }),
    }),
    fromSchemeChange: Object.freeze({
    birth: Object.freeze({
      100: Object.freeze({ 1: [49, 0], 2: [66, 0], 3: [95, 0], prenatalWeeks: 3, motherQuotaWeeks: 15, otherParentQuotaWeeks: 15 }),
      80: Object.freeze({ 1: [61, 1], 2: [82, 2], 3: [118, 4], prenatalWeeks: 3, motherQuotaWeeks: 19, otherParentQuotaWeeks: 19 }),
    }),
    adoption: Object.freeze({
      100: Object.freeze({ 1: [46, 0], 2: [63, 0], 3: [92, 0], prenatalWeeks: 0, motherQuotaWeeks: 15, otherParentQuotaWeeks: 15 }),
      80: Object.freeze({ 1: [58, 1], 2: [79, 2], 3: [115, 4], prenatalWeeks: 0, motherQuotaWeeks: 19, otherParentQuotaWeeks: 19 }),
    }),
    }),
  }),
});

const parseDate = (value, name) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/u.test(value)) throw new TypeError(`${name} must be a YYYY-MM-DD date.`);
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) throw new RangeError(`${name} is not a real calendar date.`);
  return value;
};

const toWeekDay = (weeks, days) => weeks * norwayParentalBenefitRules2026.daysPerWeek + days;
const fromWeekDay = (days) => Object.freeze({ weeks: Math.floor(days / 5), days: days % 5, benefitDays: days });

/** Returns the dated standard entitlement table for one Norwegian family scenario. */
export function getNorwayParentalBenefitEntitlement({ eventType, eventDate, children = 1, coveragePct = 100, bothParentsEligible = true } = {}) {
  const rules = norwayParentalBenefitRules2026;
  const date = parseDate(eventDate, 'Birth/adoption date');
  if (!['birth', 'adoption'].includes(eventType)) throw new RangeError('Choose birth or adoption.');
  if (date < rules.supportedFrom) throw new RangeError('Cases before 2022-08-02 use an older NAV table and are outside this version.');
  if (![1, 2, 3].includes(children) || !Number.isInteger(children)) throw new RangeError('Choose one, two, or three-or-more children.');
  if (![80, 100].includes(coveragePct)) throw new RangeError('Coverage must be 80 or 100 percent.');
  if (bothParentsEligible !== true) throw new RangeError('This version models only the standard case where both parents have earned a right. Check NAV for other family situations.');

  const cohort = date < rules.schemeChangeDate ? 'beforeSchemeChange' : 'fromSchemeChange';
  const table = rules.entitlements[cohort][eventType][coveragePct];
  const [totalWeeks, totalDays] = table[children];
  const totalBenefitDays = toWeekDay(totalWeeks, totalDays);
  const prenatalDays = toWeekDay(table.prenatalWeeks, 0);
  const motherQuotaDays = toWeekDay(table.motherQuotaWeeks, 0);
  const otherParentQuotaDays = toWeekDay(table.otherParentQuotaWeeks, 0);
  const sharedDays = totalBenefitDays - prenatalDays - motherQuotaDays - otherParentQuotaDays;
  if (sharedDays < 0) throw new Error('NAV entitlement table is internally inconsistent.');

  return Object.freeze({
    rulesYear: rules.rulesYear,
    checkedAt: rules.checkedAt,
    schemeChangeDate: rules.schemeChangeDate,
    cohort,
    eventType,
    eventDate: date,
    children,
    coveragePct,
    total: fromWeekDay(totalBenefitDays),
    prenatal: fromWeekDay(prenatalDays),
    motherQuota: fromWeekDay(motherQuotaDays),
    otherParentQuota: fromWeekDay(otherParentQuotaDays),
    shared: fromWeekDay(sharedDays),
    simultaneousParentUse: false,
    notes: Object.freeze(['Standard entitlement only; both parents are assumed to have earned a right.', 'Work fraction, activity requirements, early birth, illness, sole care, disability benefit and international coordination are not adjudicated.', 'Coverage choice applies to both parents and NAV states it cannot be changed later.']),
  });
}
