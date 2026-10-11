const MAX_CURRENCY = 1_000_000_000;

function boundedNumber(value, name, { min = 0, max = MAX_CURRENCY } = {}) {
  if (!['number', 'string'].includes(typeof value) || (typeof value === 'string' && value.trim() === '')) {
    throw new RangeError(`${name} must be a number.`);
  }
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) throw new RangeError(`${name} is outside the supported range.`);
  return number;
}

function boundedInteger(value, name, { min, max }) {
  if (!['number', 'string'].includes(typeof value) || (typeof value === 'string' && value.trim() === '')) {
    throw new RangeError(`${name} must be a whole number.`);
  }
  const number = Number(value);
  if (!Number.isInteger(number) || number < min || number > max) throw new RangeError(`${name} must be a whole number in range.`);
  return number;
}

/** Estimate a user-entered college funding target and savings path. */
export function calculate529Plan(input) {
  const currentSavings = boundedNumber(input.currentSavings, 'Current savings');
  const monthlyContribution = boundedNumber(input.monthlyContribution, 'Monthly contribution', { max: 10_000_000 });
  const yearsUntilCollege = boundedInteger(input.yearsUntilCollege, 'Years until college', { min: 0, max: 50 });
  const annualCostToday = boundedNumber(input.annualCostToday, 'Annual college cost');
  const collegeYears = boundedInteger(input.collegeYears, 'College years', { min: 1, max: 8 });
  const tuitionInflationPercent = boundedNumber(input.tuitionInflationPercent, 'Tuition inflation', { max: 30 });
  const annualReturnPercent = boundedNumber(input.annualReturnPercent, 'Annual return', { max: 30 });
  const scholarshipPerYear = boundedNumber(input.scholarshipPerYear, 'Scholarship per year');

  const inflation = tuitionInflationPercent / 100;
  const annualReturn = annualReturnPercent / 100;
  const annualCostAtStart = annualCostToday * ((1 + inflation) ** yearsUntilCollege);
  const annualScholarshipAtStart = scholarshipPerYear;
  const projectedCosts = [];
  let totalGrossCost = 0;
  let totalScholarship = 0;
  for (let year = 0; year < collegeYears; year += 1) {
    const gross = annualCostAtStart * ((1 + inflation) ** year);
    const scholarship = Math.min(annualScholarshipAtStart, gross);
    projectedCosts.push(Object.freeze({ year: year + 1, gross, scholarship, net: gross - scholarship }));
    totalGrossCost += gross;
    totalScholarship += scholarship;
  }
  // Tuition is modeled as paid at the start of each study year. Discount later
  // years back to enrollment using the same steady effective annual return.
  const targetAtEnrollment = projectedCosts.reduce(
    (target, { net }, index) => target + net / ((1 + annualReturn) ** index),
    0,
  );

  const months = yearsUntilCollege * 12;
  const monthlyReturn = Math.expm1(Math.log1p(annualReturn) / 12);
  const growthFactor = (1 + monthlyReturn) ** months;
  const currentSavingsAtEnrollment = currentSavings * growthFactor;
  const contributionFactor = monthlyReturn === 0
    ? months
    : Math.expm1(months * Math.log1p(monthlyReturn)) / monthlyReturn;
  const projectedSavings = currentSavingsAtEnrollment + monthlyContribution * contributionFactor;
  const fundingGap = Math.max(0, targetAtEnrollment - projectedSavings);
  const monthlyContributionNeeded = months === 0
    ? null
    : Math.max(0, (targetAtEnrollment - currentSavingsAtEnrollment) / contributionFactor);
  const amountNeededNow = months === 0 ? Math.max(0, targetAtEnrollment - currentSavings) : null;
  const surplus = Math.max(0, projectedSavings - targetAtEnrollment);

  const numericResults = [annualCostAtStart, totalGrossCost, totalScholarship, targetAtEnrollment, currentSavingsAtEnrollment, projectedSavings, fundingGap, surplus, ...(monthlyContributionNeeded === null ? [] : [monthlyContributionNeeded])];
  if (numericResults.some((value) => !Number.isFinite(value) || value > 1e15)) throw new RangeError('The projection exceeds the supported calculation range.');

  return Object.freeze({
    yearsUntilCollege, collegeYears, months, annualReturnPercent, tuitionInflationPercent,
    annualCostAtStart, totalGrossCost, totalScholarship, targetAtEnrollment,
    currentSavingsAtEnrollment, projectedSavings, fundingGap, surplus,
    monthlyContributionNeeded, amountNeededNow, projectedCosts: Object.freeze(projectedCosts),
  });
}
