const REVIEW_DUE = '2027-04-20';
export function estimateGermanAlgIMonthlyPayment(dailyLeistungsentgelt, qualifyingChild, asOf = new Date().toISOString().slice(0, 10)) {
  if (asOf >= REVIEW_DUE) throw Object.assign(new Error('rules-review-due'), { code: 'rules-review-due' });
  const daily = Number(dailyLeistungsentgelt);
  if (!Number.isFinite(daily) || daily < 0 || daily > 10_000 || !['none', 'qualifying'].includes(qualifyingChild)) {
    throw Object.assign(new Error('invalid-input'), { code: 'invalid-input' });
  }
  const rate = qualifyingChild === 'qualifying' ? 0.67 : 0.60;
  const dailyPayment = Math.round((daily * rate + Number.EPSILON) * 100) / 100;
  return Object.freeze({ dailyLeistungsentgelt: daily, rate, dailyPayment, monthlyPayment: Math.round((dailyPayment * 30 + Number.EPSILON) * 100) / 100, reviewDue: REVIEW_DUE });
}
