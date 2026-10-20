const PERIODS_PER_YEAR = Object.freeze({ weekly: 52, biweekly: 26, semimonthly: 24, monthly: 12 });

export function calculatePaycheck({ gross, frequency, federal = 0, fica = 0, stateLocal = 0, benefits = 0, other = 0 } = {}) {
  const values = { gross, federal, fica, stateLocal, benefits, other };
  for (const [key, value] of Object.entries(values)) {
    const number = Number(value);
    if (!Number.isFinite(number) || number < 0 || number > 1_000_000_000) throw new RangeError(`${key} must be a finite non-negative amount.`);
    values[key] = Math.round(number * 100) / 100;
  }
  if (values.gross <= 0) throw new RangeError('Gross pay must be greater than zero.');
  if (!Object.prototype.hasOwnProperty.call(PERIODS_PER_YEAR, frequency)) throw new RangeError('Choose a supported pay frequency.');
  const cents = Object.fromEntries(Object.entries(values).map(([key, value]) => [key, Math.round(value * 100)]));
  const deductionCents = cents.federal + cents.fica + cents.stateLocal + cents.benefits + cents.other;
  if (deductionCents > cents.gross) throw new RangeError('Deductions cannot exceed gross pay.');
  const totalDeductions = deductionCents / 100;
  const net = (cents.gross - deductionCents) / 100;
  const periods = PERIODS_PER_YEAR[frequency];
  const grossPerPay = cents.gross / 100;
  return Object.freeze({ currency: 'USD', frequency, periods, grossPerPay, deductionsPerPay: totalDeductions, netPerPay: net, annualGross: cents.gross * periods / 100, annualDeductions: deductionCents * periods / 100, annualNet: (cents.gross - deductionCents) * periods / 100, deductionRate: cents.gross ? deductionCents / cents.gross : 0, breakdown: Object.freeze({ federal: cents.federal / 100, fica: cents.fica / 100, stateLocal: cents.stateLocal / 100, benefits: cents.benefits / 100, other: cents.other / 100 }) });
}
