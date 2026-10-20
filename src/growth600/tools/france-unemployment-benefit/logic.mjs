const REVIEW_DUE = '2027-01-01';
const FIXED_PART = 13.18;
const MINIMUM = 32.13;

export function estimateFranceAreMonthlyPayment(sjrInput, daysInput, partTimeFactorInput = 1, asOf = new Date().toISOString().slice(0, 10)) {
  if (asOf >= REVIEW_DUE) throw Object.assign(new Error('rules-review-due'), { code: 'rules-review-due' });
  const sjr = Number(sjrInput);
  const days = Number(daysInput);
  const partTimeFactor = Number(partTimeFactorInput);
  if (!Number.isFinite(sjr) || sjr <= 0 || sjr > 10000 || !Number.isInteger(days) || days < 28 || days > 31 || !Number.isFinite(partTimeFactor) || partTimeFactor <= 0 || partTimeFactor > 1) {
    throw Object.assign(new Error('invalid-input'), { code: 'invalid-input' });
  }
  const formula406 = sjr * 0.404 + FIXED_PART * partTimeFactor;
  const formula57 = sjr * 0.57;
  const floor = MINIMUM * partTimeFactor;
  const dailyGross = Math.round(Math.min(Math.max(formula406, formula57, floor), sjr * 0.75) * 100) / 100;
  return Object.freeze({ sjr, days, partTimeFactor, formula406: Math.round(formula406 * 100) / 100, formula57: Math.round(formula57 * 100) / 100, dailyGross, monthlyGross: Math.round(dailyGross * days * 100) / 100, reviewDue: REVIEW_DUE });
}
