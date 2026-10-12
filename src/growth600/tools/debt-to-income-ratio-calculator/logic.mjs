export function calculateDebtToIncome({ grossMonthlyIncome, housingPayment = 0, monthlyDebts = [] }) {
  const income = Number(grossMonthlyIncome);
  const housing = Number(housingPayment);
  if (!Number.isFinite(income) || income <= 0 || income > 1e12) throw new RangeError('Enter a gross monthly income greater than zero.');
  if (!Number.isFinite(housing) || housing < 0 || housing > 1e12) throw new RangeError('Housing costs must be a non-negative monthly amount.');
  if (!Array.isArray(monthlyDebts) || monthlyDebts.length > 20) throw new RangeError('Enter up to 20 monthly debt payments.');
  if (monthlyDebts.some((value) => typeof value === 'string' && !value.trim())) throw new RangeError('Enter a monthly amount for each debt field, or enter zero.');
  const debts = monthlyDebts.map(Number);
  if (debts.some((value) => !Number.isFinite(value) || value < 0 || value > 1e12)) throw new RangeError('Debt payments must be non-negative monthly amounts.');
  const otherDebtTotal = debts.reduce((sum, value) => sum + value, 0);
  const totalMonthlyDebt = housing + otherDebtTotal;
  return Object.freeze({ grossMonthlyIncome: income, housingPayment: housing, otherDebtTotal, totalMonthlyDebt, housingRatio: housing / income * 100, totalRatio: totalMonthlyDebt / income * 100 });
}
