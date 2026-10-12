export const FIRE_LIMITS = Object.freeze({ maxAmount: 1_000_000_000_000, maxPercent: 100, maxMonths: 1200, maxBalance: 1_000_000_000_000_000 });

export function calculateFireTarget({ annualSpending, withdrawalRatePercent, currentPortfolio = 0, monthlyContribution = 0, expectedAnnualReturnPercent = 0, inflationPercent = 0 }) {
  const raw = { annualSpending, withdrawalRatePercent, currentPortfolio, monthlyContribution, expectedAnnualReturnPercent, inflationPercent };
  if (Object.values(raw).some((value) => typeof value === 'string' && !value.trim())) throw new RangeError('Enter a value for every field, or enter zero where appropriate.');
  const values = Object.fromEntries(Object.entries(raw).map(([key, value]) => [key, Number(value)]));
  if (Object.values(values).some((value) => !Number.isFinite(value))) throw new RangeError('Enter finite numbers.');
  const { annualSpending: spending, withdrawalRatePercent: withdrawal, currentPortfolio: current, monthlyContribution: contribution, expectedAnnualReturnPercent: nominalReturn, inflationPercent: inflation } = values;
  for (const amount of [spending, current, contribution]) if (amount < 0 || amount > FIRE_LIMITS.maxAmount) throw new RangeError('Money amounts must be non-negative and within the supported range.');
  if (withdrawal <= 0 || withdrawal > FIRE_LIMITS.maxPercent) throw new RangeError('Withdrawal rate must be greater than 0% and at most 100%.');
  if (nominalReturn < -100 || nominalReturn > FIRE_LIMITS.maxPercent || inflation <= -100 || inflation > FIRE_LIMITS.maxPercent) throw new RangeError('Return must be from -100% to 100%, and inflation must be greater than -100% and at most 100%.');

  const targetAmount = spending / (withdrawal / 100);
  const realAnnualGrowth = ((1 + nominalReturn / 100) / (1 + inflation / 100)) - 1;
  const monthlyGrowth = realAnnualGrowth <= -1 ? -1 : (1 + realAnnualGrowth) ** (1 / 12) - 1;
  let balance = current;
  let monthsToTarget = balance >= targetAmount ? 0 : null;
  for (let month = 1; monthsToTarget === null && month <= FIRE_LIMITS.maxMonths; month += 1) {
    balance = balance * (1 + monthlyGrowth) + contribution;
    if (!Number.isFinite(balance) || balance > FIRE_LIMITS.maxBalance) throw new RangeError('Projection exceeds the supported numeric range.');
    if (balance >= targetAmount) monthsToTarget = month;
  }
  return Object.freeze({
    annualSpending: spending, withdrawalRatePercent: withdrawal, targetAmount, currentPortfolio: current,
    monthlyContribution: contribution, expectedAnnualReturnPercent: nominalReturn, inflationPercent: inflation,
    realAnnualGrowthPercent: realAnnualGrowth * 100, monthlyRealGrowthPercent: monthlyGrowth * 100,
    monthsToTarget, yearsToTarget: monthsToTarget === null ? null : monthsToTarget / 12,
    projectedBalance: balance,
  });
}
