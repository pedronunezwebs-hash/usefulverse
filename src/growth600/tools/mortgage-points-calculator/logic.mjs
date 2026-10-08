const MAX_PRINCIPAL = 1e12;
const MAX_RATE = 100;
const MAX_TERM_MONTHS = 600;

function numeric(value, label, { min = 0, max = Number.MAX_VALUE, integer = false } = {}) {
  const raw = String(value ?? '').trim();
  const number = Number(raw);
  if (!raw || !Number.isFinite(number) || number < min || number > max || (integer && !Number.isInteger(number))) {
    throw new RangeError(`${label} is outside the supported range.`);
  }
  return number;
}

function paymentFor(principal, annualRatePercent, months) {
  if (annualRatePercent === 0) return principal / months;
  const monthlyRate = annualRatePercent / 1200;
  const denominator = -Math.expm1(-months * Math.log1p(monthlyRate));
  return (principal * monthlyRate) / denominator;
}

function schedule(principal, annualRatePercent, payment, months) {
  const monthlyRate = annualRatePercent / 1200;
  let balance = principal;
  let interestPaid = 0;
  const balances = [principal];
  for (let month = 1; month <= months; month += 1) {
    const interest = balance * monthlyRate;
    interestPaid += interest;
    const principalPaid = Math.min(balance, payment - interest);
    balance = Math.max(0, balance - principalPaid);
    balances.push(balance);
  }
  return Object.freeze({ balances: Object.freeze(balances), interestPaid, endingBalance: balance });
}

export function calculateMortgagePoints({ principal, termMonths, rateWithoutPoints, rateWithPoints, pointsPercent, horizonMonths }) {
  const loanPrincipal = numeric(principal, 'Loan amount', { min: Number.MIN_VALUE, max: MAX_PRINCIPAL });
  const months = numeric(termMonths, 'Loan term', { min: 1, max: MAX_TERM_MONTHS, integer: true });
  const originalRate = numeric(rateWithoutPoints, 'Rate without points', { max: MAX_RATE });
  const discountedRate = numeric(rateWithPoints, 'Rate with points', { max: MAX_RATE });
  const points = numeric(pointsPercent, 'Discount points', { max: 100 });
  const horizon = numeric(horizonMonths, 'Comparison horizon', { max: MAX_TERM_MONTHS, integer: true });
  if (discountedRate > originalRate) throw new RangeError('The rate with points cannot be higher than the rate without points.');

  const upfrontCost = loanPrincipal * (points / 100);
  if (!Number.isFinite(upfrontCost)) throw new RangeError('Point cost is outside the supported range.');
  const paymentWithoutPoints = paymentFor(loanPrincipal, originalRate, months);
  const paymentWithPoints = paymentFor(loanPrincipal, discountedRate, months);
  const scheduleWithoutPoints = schedule(loanPrincipal, originalRate, paymentWithoutPoints, months);
  const scheduleWithPoints = schedule(loanPrincipal, discountedRate, paymentWithPoints, months);
  const monthlyPaymentSavings = paymentWithoutPoints - paymentWithPoints;
  const paymentOnlyBreakEvenMonths = upfrontCost === 0 ? 0 : monthlyPaymentSavings > 0 ? Math.ceil(upfrontCost / monthlyPaymentSavings) : null;
  let netBreakEvenMonth = upfrontCost === 0 ? 0 : null;
  for (let month = 1; month <= months && netBreakEvenMonth === null; month += 1) {
    const savedPayments = monthlyPaymentSavings * month;
    const differenceInPayoff = scheduleWithoutPoints.balances[month] - scheduleWithPoints.balances[month];
    if (savedPayments + differenceInPayoff >= upfrontCost) netBreakEvenMonth = month;
  }

  const monthsCompared = Math.min(horizon, months);
  const netBenefitAtHorizon = (monthlyPaymentSavings * monthsCompared)
    + scheduleWithoutPoints.balances[monthsCompared]
    - scheduleWithPoints.balances[monthsCompared]
    - upfrontCost;
  return Object.freeze({
    principal: loanPrincipal,
    termMonths: months,
    rateWithoutPoints: originalRate,
    rateWithPoints: discountedRate,
    pointsPercent: points,
    horizonMonths: monthsCompared,
    upfrontCost,
    paymentWithoutPoints,
    paymentWithPoints,
    monthlyPaymentSavings,
    interestWithoutPoints: scheduleWithoutPoints.interestPaid,
    interestWithPoints: scheduleWithPoints.interestPaid,
    lifetimeInterestSavings: scheduleWithoutPoints.interestPaid - scheduleWithPoints.interestPaid,
    balanceWithoutPointsAtHorizon: scheduleWithoutPoints.balances[monthsCompared],
    balanceWithPointsAtHorizon: scheduleWithPoints.balances[monthsCompared],
    netBenefitAtHorizon,
    paymentOnlyBreakEvenMonths: paymentOnlyBreakEvenMonths !== null && paymentOnlyBreakEvenMonths <= months ? paymentOnlyBreakEvenMonths : null,
    netBreakEvenMonth,
  });
}
