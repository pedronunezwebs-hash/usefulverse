export function calculateSwissPremiumReduction({ monthlyPremium, monthlyReduction }) {
  const premium = Number(monthlyPremium);
  const reduction = Number(monthlyReduction);
  if (!Number.isFinite(premium) || premium <= 0 || premium > 100_000) throw new RangeError('Monthly premium must be positive and within the supported range.');
  if (!Number.isFinite(reduction) || reduction < 0 || reduction > premium) throw new RangeError('Monthly reduction must be between zero and the premium.');
  const netMonthlyPremium = Math.round((premium - reduction) * 100) / 100;
  const annualReduction = Math.round(reduction * 1200) / 100;
  return Object.freeze({ monthlyPremium: premium, monthlyReduction: reduction, netMonthlyPremium, annualReduction, reductionPercent: Math.round(reduction / premium * 10_000) / 100 });
}
