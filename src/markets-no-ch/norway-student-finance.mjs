/** 2026 Lånekassen conversion scenario for Norwegian higher-education basis loans. */
export const norwayStudentFinanceRules2026 = Object.freeze({
  year: 2026,
  checkedAt: '2026-10-17',
  basisLoanGrantMaxRate: 0.40,
  passedCreditsGrantRate: 0.15,
  completedDegreeGrantRate: 0.25,
  fullYearIncomeLimitNok: 234821,
  shortYearIncomeLimitNok: 587053,
  unmarriedNetAssetsLimitNok: 534225,
  sharedFamilyNetAssetsLimitNok: 1026024,
  incomeReductionRatePerSupportMonth: 0.05,
  unmarriedAssetReductionRatePerSupportMonth: 0.02,
  sharedFamilyAssetReductionRatePerSupportMonth: 0.01,
  maximumMonthsForHigherIncomeLimit: 7,
  sourceConversion: 'https://lanekassen.no/nb-NO/stipend-og-lan/omgjoring-av-basislan/',
  sourceRules: 'https://lanekassen.no/nb-NO/regelverk/tildeling/del3-kapittel12/slik-fungerer-omgjoring/',
  source2026_27: 'https://lanekassen.no/nb-NO/hjelp-og-kontakt/tre-ting-du-ma-vite-om-stipend-og-lan-for-2026-2027/',
});

function finite(value, name, { min = 0, max = 1e9 } = {}) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) throw new RangeError(`${name} is outside the supported range.`);
  return number;
}

/**
 * Estimates only conversion of an eligible basis loan for higher education.
 * Income and net assets are calendar-year figures. A household away-status,
 * study progression and completed degree are user-entered assumptions.
 */
export function estimateNorwayStudentFinance({
  eligibleBasisLoanNok,
  supportMonthsInCalendarYear,
  personalAndCapitalIncomeNok,
  netAssetsNok,
  passedCredits,
  supportedCredits,
  completedEligibleDegree = false,
  qualifiesAsLivingAwayFromParents = false,
  sharedFamilyAssets = false,
  additionalNonConvertibleDebtNok = 0,
  repaymentAnnualRatePct = 0,
  repaymentYears = 20,
} = {}) {
  const rules = norwayStudentFinanceRules2026;
  const basis = finite(eligibleBasisLoanNok, 'Eligible basis loan');
  const months = finite(supportMonthsInCalendarYear, 'Support months', { min: 1, max: 12 });
  const income = finite(personalAndCapitalIncomeNok, 'Personal and capital income');
  const assets = finite(netAssetsNok, 'Net assets', { min: -1e9 });
  const passed = finite(passedCredits, 'Credits passed', { max: 1000 });
  const supported = finite(supportedCredits, 'Credits supported', { max: 1000 });
  const additionalDebt = finite(additionalNonConvertibleDebtNok, 'Other loan balance');
  const annualRate = finite(repaymentAnnualRatePct, 'Annual repayment interest rate', { max: 100 });
  const years = finite(repaymentYears, 'Repayment years', { min: 1, max: 60 });
  for (const [value, name] of [[completedEligibleDegree, 'Completed degree'], [qualifiesAsLivingAwayFromParents, 'Living-away status'], [sharedFamilyAssets, 'Shared-family assets']]) {
    if (typeof value !== 'boolean') throw new TypeError(`${name} must be true or false.`);
  }
  if (supported <= 0 || passed > supported) throw new RangeError('Passed credits must be from zero up to the supported credits.');
  if (!Number.isInteger(months) || !Number.isInteger(years)) throw new RangeError('Support months and repayment years must be whole numbers.');
  const progress = passed / supported;
  const grantRateBeforeNeedsTest = (rules.passedCreditsGrantRate * progress)
    + (completedEligibleDegree ? rules.completedDegreeGrantRate : 0);
  const academicEligibleGrantNok = qualifiesAsLivingAwayFromParents ? basis * Math.min(rules.basisLoanGrantMaxRate, grantRateBeforeNeedsTest) : 0;
  const incomeLimitNok = months <= rules.maximumMonthsForHigherIncomeLimit ? rules.shortYearIncomeLimitNok : rules.fullYearIncomeLimitNok;
  const assetsLimitNok = sharedFamilyAssets ? rules.sharedFamilyNetAssetsLimitNok : rules.unmarriedNetAssetsLimitNok;
  const incomeReductionNok = Math.max(0, income - incomeLimitNok) * rules.incomeReductionRatePerSupportMonth * months;
  const assetReductionRate = sharedFamilyAssets ? rules.sharedFamilyAssetReductionRatePerSupportMonth : rules.unmarriedAssetReductionRatePerSupportMonth;
  const assetReductionNok = Math.max(0, assets - assetsLimitNok) * assetReductionRate * months;
  const estimatedGrantNok = Math.max(0, academicEligibleGrantNok - incomeReductionNok - assetReductionNok);
  const remainingBasisLoanNok = Math.max(0, basis - estimatedGrantNok);
  const repaymentPrincipalNok = remainingBasisLoanNok + additionalDebt;
  const paymentMonths = years * 12;
  const monthlyRate = annualRate / 1200;
  const estimatedMonthlyRepaymentNok = monthlyRate === 0
    ? repaymentPrincipalNok / paymentMonths
    : repaymentPrincipalNok * monthlyRate / (1 - (1 + monthlyRate) ** -paymentMonths);
  return Object.freeze({
    rulesYear: rules.year,
    checkedAt: rules.checkedAt,
    eligibleBasisLoanNok: basis,
    supportMonthsInCalendarYear: months,
    passedCredits: passed,
    supportedCredits: supported,
    creditProgressRate: progress,
    completedEligibleDegree,
    qualifiesAsLivingAwayFromParents,
    sharedFamilyAssets,
    incomeLimitNok,
    assetsLimitNok,
    academicEligibleGrantNok,
    incomeReductionNok,
    assetReductionNok,
    estimatedGrantNok,
    remainingBasisLoanNok,
    additionalNonConvertibleDebtNok: additionalDebt,
    repaymentAnnualRatePct: annualRate,
    repaymentYears: years,
    estimatedMonthlyRepaymentNok,
  });
}
