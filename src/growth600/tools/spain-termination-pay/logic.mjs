const REVIEW_DUE = '2027-01-15';

export function estimateSpainDismissalCompensation(annualRemuneration, serviceMonths, dismissalType, asOf = new Date().toISOString().slice(0, 10)) {
  if (asOf >= REVIEW_DUE) throw Object.assign(new Error('rules-review-due'), { code: 'rules-review-due' });
  const annual = Number(annualRemuneration); const months = Number(serviceMonths);
  if (!Number.isFinite(annual) || annual <= 0 || annual > 100_000_000 || !Number.isFinite(months) || !Number.isInteger(months) || months < 1 || months > 720 || !['objective', 'unfair'].includes(dismissalType)) {
    throw Object.assign(new Error('invalid-input'), { code: 'invalid-input' });
  }
  const daysPerYear = dismissalType === 'objective' ? 20 : 33;
  const capDays = dismissalType === 'objective' ? 365 : 720;
  const dailyWage = annual / 365;
  const accruedDays = daysPerYear * months / 12;
  const compensationDays = Math.min(accruedDays, capDays);
  const amount = Math.round(dailyWage * compensationDays * 100) / 100;
  return Object.freeze({ annualRemuneration: annual, serviceMonths: months, dismissalType, dailyWage, daysPerYear, accruedDays, capDays, compensationDays, amount, reviewDue: REVIEW_DUE });
}
