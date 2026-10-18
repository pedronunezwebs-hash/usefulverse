const ADULT_DEDUCTIBLES = Object.freeze([300, 500, 1000, 1500, 2000, 2500]);
const CHILD_DEDUCTIBLES = Object.freeze([0, 100, 200, 300, 400, 500, 600]);
const MAX_ANNUAL_AMOUNT = 10_000_000;
const RETENTION_RATE = 0.1;
const ADULT_RETENTION_CAP = 700;
const CHILD_RETENTION_CAP = 350;

function nonnegativeAmount(value, field) {
  if (typeof value === 'string' && !value.trim()) throw new TypeError(`${field} is required.`);
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0 || number > MAX_ANNUAL_AMOUNT) throw new RangeError(`${field} must be between CHF 0 and CHF ${MAX_ANNUAL_AMOUNT}.`);
  return Math.round(number * 100) / 100;
}

function costSharing(eligibleCosts, deductible, retentionCap) {
  const deductiblePaid = Math.min(eligibleCosts, deductible);
  const retentionPaid = Math.min(Math.max(eligibleCosts - deductible, 0) * RETENTION_RATE, retentionCap);
  return Math.round((deductiblePaid + retentionPaid) * 100) / 100;
}

function breakEvenSpend(reference, option, retentionCap) {
  const annualPremiumSaving = reference.annualPremium - option.annualPremium;
  if (annualPremiumSaving <= 0) return null;
  const maxCostShareGap = option.deductible - reference.deductible;
  if (annualPremiumSaving >= maxCostShareGap) return null;
  const gapAt = (spend) => costSharing(spend, option.deductible, retentionCap)
    - costSharing(spend, reference.deductible, retentionCap);
  let upper = Math.max(option.deductible, reference.deductible, 1);
  while (gapAt(upper) < annualPremiumSaving && upper < MAX_ANNUAL_AMOUNT) upper *= 2;
  if (gapAt(upper) < annualPremiumSaving) return null;
  let lower = 0;
  for (let step = 0; step < 60; step += 1) {
    const middle = (lower + upper) / 2;
    if (gapAt(middle) < annualPremiumSaving) lower = middle;
    else upper = middle;
  }
  return Math.round(upper * 100) / 100;
}

/** Compares user-entered Swiss compulsory-insurance premiums and eligible annual costs. */
export function compareSwissHealthDeductibles(input) {
  if (!input || !['adult', 'child'].includes(input.insuredGroup)) throw new TypeError('Choose the adult or child deductible schedule.');
  const legalDeductibles = input.insuredGroup === 'adult' ? ADULT_DEDUCTIBLES : CHILD_DEDUCTIBLES;
  const retentionCap = input.insuredGroup === 'adult' ? ADULT_RETENTION_CAP : CHILD_RETENTION_CAP;
  const lowSpend = nonnegativeAmount(input.lowSpend, 'Low annual eligible treatment-cost scenario');
  const expectedSpend = nonnegativeAmount(input.expectedSpend, 'Expected annual eligible treatment costs');
  const highSpend = nonnegativeAmount(input.highSpend, 'High annual eligible treatment-cost scenario');
  if (lowSpend > expectedSpend || expectedSpend > highSpend) throw new RangeError('Order the cost scenarios from low to expected to high.');
  if (!Array.isArray(input.quotes) || input.quotes.length < 2 || input.quotes.length > legalDeductibles.length) throw new RangeError('Enter monthly premiums for at least two available deductible options.');

  const seen = new Set();
  const options = input.quotes.map((quote) => {
    const deductible = Number(quote.deductible);
    if (!legalDeductibles.includes(deductible)) throw new RangeError(`CHF ${quote.deductible} is not an available deductible in the selected age group.`);
    if (seen.has(deductible)) throw new RangeError(`Enter the CHF ${deductible} deductible only once.`);
    seen.add(deductible);
    const monthlyPremium = nonnegativeAmount(quote.monthlyPremium, `Monthly premium for CHF ${deductible}`);
    if (monthlyPremium <= 0 || monthlyPremium > 20_000) throw new RangeError('Enter a positive monthly premium up to CHF 20,000 for each option.');
    return { deductible, monthlyPremium, annualPremium: Math.round(monthlyPremium * 1200) / 100 };
  }).sort((a, b) => a.deductible - b.deductible);

  const reference = options[0];
  return Object.freeze(options.map((option) => {
    const lowCostSharing = costSharing(lowSpend, option.deductible, retentionCap);
    const expectedCostSharing = costSharing(expectedSpend, option.deductible, retentionCap);
    const highCostSharing = costSharing(highSpend, option.deductible, retentionCap);
    return Object.freeze({
      ...option,
      lowCostSharing,
      expectedCostSharing,
      highCostSharing,
      lowAnnualTotal: Math.round((option.annualPremium + lowCostSharing) * 100) / 100,
      expectedAnnualTotal: Math.round((option.annualPremium + expectedCostSharing) * 100) / 100,
      highAnnualTotal: Math.round((option.annualPremium + highCostSharing) * 100) / 100,
      expectedDifferenceFromLowestDeductible: Math.round((option.annualPremium + expectedCostSharing - reference.annualPremium - costSharing(expectedSpend, reference.deductible, retentionCap)) * 100) / 100,
      annualPremiumSavingVsLowestDeductible: Math.round((reference.annualPremium - option.annualPremium) * 100) / 100,
      isLowestDeductible: option.deductible === reference.deductible,
      breakEvenEligibleSpend: option.deductible === reference.deductible ? null : breakEvenSpend(reference, option, retentionCap),
    });
  }).sort((a, b) => a.expectedAnnualTotal - b.expectedAnnualTotal || a.deductible - b.deductible));
}

export const swissHealthDeductibleRules = Object.freeze({
  adultDeductibles: ADULT_DEDUCTIBLES,
  childDeductibles: CHILD_DEDUCTIBLES,
  retentionRate: RETENTION_RATE,
  adultRetentionCap: ADULT_RETENTION_CAP,
  childRetentionCap: CHILD_RETENTION_CAP,
});
