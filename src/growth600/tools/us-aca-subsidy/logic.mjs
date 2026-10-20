const REVIEW_DUE = '2026-12-31';
const GUIDELINES = Object.freeze({
  contiguous: Object.freeze([15650, 21150, 26650, 32150, 37650, 43150, 48650, 54150]),
  alaska: Object.freeze([19550, 26430, 33310, 40190, 47070, 53950, 60830, 67710]),
  hawaii: Object.freeze([17990, 24320, 30650, 36980, 43310, 49640, 55970, 62300]),
});
const EXTRA_PER_PERSON = Object.freeze({ contiguous: 5500, alaska: 6880, hawaii: 6330 });
const PERCENTAGE_BANDS = Object.freeze([
  Object.freeze({ from: 133, to: 150, initial: 3.14, final: 4.19 }),
  Object.freeze({ from: 150, to: 200, initial: 4.19, final: 6.60 }),
  Object.freeze({ from: 200, to: 250, initial: 6.60, final: 8.44 }),
  Object.freeze({ from: 250, to: 300, initial: 8.44, final: 9.96 }),
]);

function fail(code) {
  throw Object.assign(new RangeError(code), { code });
}

function amount(value, name, min, max) {
  if (value === null || value === undefined || (typeof value === 'string' && !value.trim())) fail(`invalid-${name}`);
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) fail(`invalid-${name}`);
  return number;
}

export function getAcaFpl(familySizeInput, region) {
  const familySize = amount(familySizeInput, 'family-size', 1, 20);
  if (!Number.isInteger(familySize)) fail('invalid-family-size');
  const table = GUIDELINES[region];
  if (!table) fail('invalid-region');
  return table[Math.min(familySize, 8) - 1] + Math.max(0, familySize - 8) * EXTRA_PER_PERSON[region];
}

export function acaApplicablePercentage(fplPercent) {
  const percent = amount(fplPercent, 'fpl-percent', 0, 10000);
  if (percent < 133) return 2.1;
  if (percent >= 300) return 9.96;
  const band = PERCENTAGE_BANDS.find(({ from, to }) => percent >= from && percent < to);
  if (!band) fail('invalid-fpl-percent');
  return band.initial + (percent - band.from) / (band.to - band.from) * (band.final - band.initial);
}

export function estimateAcaPremiumTaxCredit({ householdIncome, familySize, region = 'contiguous', benchmarkPremium, enrollmentPremium, asOf = new Date().toISOString().slice(0, 10) } = {}) {
  if (asOf >= REVIEW_DUE) fail('rules-review-due');
  const income = amount(householdIncome, 'income', 0, 10_000_000);
  const benchmark = amount(benchmarkPremium, 'benchmark-premium', 0, 1_000_000);
  const enrollment = amount(enrollmentPremium, 'enrollment-premium', 0, 1_000_000);
  const fpl = getAcaFpl(familySize, region);
  const fplPercent = income / fpl * 100;
  const eligibilityBand = fplPercent < 100 ? 'belowRange' : fplPercent > 400 ? 'overRange' : 'inRange';
  const applicablePercent = acaApplicablePercentage(fplPercent);
  const expectedAnnualContribution = income * applicablePercent / 100;
  const uncappedAnnualCredit = eligibilityBand === 'inRange'
    ? Math.max(0, Math.min(benchmark, enrollment) - expectedAnnualContribution)
    : 0;
  const annualCredit = Math.round(uncappedAnnualCredit * 100) / 100;

  return Object.freeze({
    familySize: Number(familySize),
    region,
    fpl,
    householdIncome: Math.round(income * 100) / 100,
    fplPercent: Math.round(fplPercent * 100) / 100,
    eligibilityBand,
    applicablePercent: Math.round(applicablePercent * 10000) / 10000,
    expectedAnnualContribution: Math.round(expectedAnnualContribution * 100) / 100,
    benchmarkPremium: Math.round(benchmark * 100) / 100,
    enrollmentPremium: Math.round(enrollment * 100) / 100,
    annualCredit,
    monthlyCredit: Math.round(annualCredit / 12 * 100) / 100,
    monthlyNetPremium: Math.round((enrollment - annualCredit) / 12 * 100) / 100,
    reviewDue: REVIEW_DUE,
  });
}
