const MAX_PRICE = 1e12;
const MAX_RENT = 1e9;
const MAX_ANNUAL_EXPENSES = 1e12;

function amount(value, label, max, { allowZero = true } = {}) {
  if (value === '' || value === null || value === undefined) throw new TypeError(`${label} is required.`);
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < (allowZero ? 0 : Number.EPSILON) || parsed > max) throw new RangeError(`${label} must be between ${allowZero ? 0 : 'more than 0'} and ${max}.`);
  return parsed;
}

export function calculateRentalYield({ propertyPrice, monthlyRent, vacancyPercent = 0, annualPropertyTax = 0, annualMaintenance = 0, annualInsurance = 0, annualAssociationFees = 0, annualOtherExpenses = 0 } = {}) {
  const price = amount(propertyPrice, 'Property price', MAX_PRICE, { allowZero: false });
  const rent = amount(monthlyRent, 'Monthly rent', MAX_RENT);
  const vacancy = amount(vacancyPercent === '' ? 0 : vacancyPercent, 'Vacancy rate', 100);
  const expenseInputs = [annualPropertyTax, annualMaintenance, annualInsurance, annualAssociationFees, annualOtherExpenses];
  const expenses = expenseInputs.map((value, index) => amount(value === '' ? 0 : value, `Annual expense ${index + 1}`, MAX_ANNUAL_EXPENSES));
  const grossAnnualRent = rent * 12;
  const vacancyLoss = grossAnnualRent * vacancy / 100;
  const effectiveAnnualRent = grossAnnualRent - vacancyLoss;
  const totalAnnualExpenses = expenses.reduce((sum, value) => sum + value, 0);
  const netOperatingIncome = effectiveAnnualRent - totalAnnualExpenses;
  const result = { propertyPrice: price, monthlyRent: rent, vacancyPercent: vacancy, grossAnnualRent, vacancyLoss, effectiveAnnualRent, annualExpenses: Object.freeze(expenses), totalAnnualExpenses, netOperatingIncome, grossYieldPercent: grossAnnualRent / price * 100, netYieldPercent: netOperatingIncome / price * 100, monthlyNetIncome: netOperatingIncome / 12 };
  if (Object.values(result).some((value) => typeof value === 'number' && !Number.isFinite(value))) throw new RangeError('The result is outside the supported numeric range.');
  return Object.freeze(result);
}
