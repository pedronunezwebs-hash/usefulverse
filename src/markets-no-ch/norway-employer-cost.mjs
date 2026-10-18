export const norwayEmployerCostRates2026 = Object.freeze({
  taxYear: 2026,
  sourcedOn: '2026-10-16',
  source: 'https://www.skatteetaten.no/satser/arbeidsgiveravgift',
  zones: Object.freeze({
    I: Object.freeze({ ordinary: 14.1, agricultureFishing: 14.1 }),
    Ia: Object.freeze({ ordinary: 14.1, agricultureFishing: 10.6, reducedOrdinary: 10.6, allowanceNok: 850000 }),
    II: Object.freeze({ ordinary: 10.6, agricultureFishing: 10.6 }),
    III: Object.freeze({ ordinary: 6.4, agricultureFishing: 6.4 }),
    IV: Object.freeze({ ordinary: 5.1, agricultureFishing: 5.1 }),
    IVa: Object.freeze({ ordinary: 7.9, agricultureFishing: 5.1 }),
    V: Object.freeze({ ordinary: 0, agricultureFishing: 0 }),
  }),
});

const finite = (value, name, { min = 0, max = 1e12 } = {}) => {
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) throw new RangeError(`${name} must be between ${min} and ${max}.`);
  return number;
};

export function estimateNorwayEmployerCost({
  annualPayrollNok,
  holidayPayBaseNok = annualPayrollNok,
  holidayPayRatePct = 10.2,
  taxableOtherPayNok = 0,
  pensionablePayrollNok = annualPayrollNok,
  pensionRatePct = 0,
  otherEmployerCostsNok = 0,
  zone = 'I',
  sector = 'ordinary',
  differentialAllowanceUsedNok = 0,
} = {}) {
  const rates = norwayEmployerCostRates2026.zones[zone];
  if (!rates) throw new RangeError('Choose a supported Norwegian employer contribution zone.');
  if (!['ordinary', 'agricultureFishing'].includes(sector)) throw new RangeError('Choose ordinary or agriculture/fishing activity.');
  const payroll = finite(annualPayrollNok, 'Annual payroll');
  const holidayBase = finite(holidayPayBaseNok, 'Holiday-pay basis');
  const holidayRate = finite(holidayPayRatePct, 'Holiday-pay rate', { max: 30 });
  const otherPay = finite(taxableOtherPayNok, 'Other taxable pay');
  const pensionBase = finite(pensionablePayrollNok, 'Pensionable payroll');
  const pensionRate = finite(pensionRatePct, 'Pension rate', { max: 20 });
  const otherCosts = finite(otherEmployerCostsNok, 'Other employer costs');
  const allowanceUsed = finite(differentialAllowanceUsedNok, 'Differential allowance used', { max: rates.allowanceNok ?? 0 });

  const holidayPay = holidayBase * holidayRate / 100;
  const pensionContribution = pensionBase * pensionRate / 100;
  const contributionBasis = payroll + holidayPay + otherPay + pensionContribution;
  const headlineRatePct = rates[sector];
  let employerContributionNok;
  let reducedBasisNok = 0;
  let allowanceConsumedNok = 0;
  if (zone === 'Ia' && sector === 'ordinary') {
    const reducedRatePct = rates.reducedOrdinary;
    const discountPerNok = (headlineRatePct - reducedRatePct) / 100;
    const allowanceRemainingNok = Math.max(0, rates.allowanceNok - allowanceUsed);
    reducedBasisNok = Math.min(contributionBasis, allowanceRemainingNok / discountPerNok);
    allowanceConsumedNok = reducedBasisNok * discountPerNok;
    employerContributionNok = reducedBasisNok * reducedRatePct / 100 + (contributionBasis - reducedBasisNok) * headlineRatePct / 100;
  } else {
    employerContributionNok = contributionBasis * headlineRatePct / 100;
  }
  const totalEmployerCostNok = payroll + holidayPay + otherPay + pensionContribution + otherCosts + employerContributionNok;
  return Object.freeze({
    taxYear: norwayEmployerCostRates2026.taxYear,
    sourcedOn: norwayEmployerCostRates2026.sourcedOn,
    zone,
    sector,
    headlineRatePct,
    annualPayrollNok: payroll,
    holidayPayBaseNok: holidayBase,
    holidayPayRatePct: holidayRate,
    holidayPayNok: holidayPay,
    taxableOtherPayNok: otherPay,
    pensionablePayrollNok: pensionBase,
    pensionRatePct: pensionRate,
    pensionContributionNok: pensionContribution,
    contributionBasisNok: contributionBasis,
    employerContributionNok,
    effectiveEmployerContributionRatePct: contributionBasis === 0 ? 0 : employerContributionNok / contributionBasis * 100,
    reducedBasisNok: reducedBasisNok,
    allowanceUsedBeforeNok: allowanceUsed,
    allowanceConsumedNok,
    allowanceUsedAfterNok: allowanceUsed + allowanceConsumedNok,
    otherEmployerCostsNok: otherCosts,
    totalEmployerCostNok,
    costPerMonthNok: totalEmployerCostNok / 12,
  });
}
