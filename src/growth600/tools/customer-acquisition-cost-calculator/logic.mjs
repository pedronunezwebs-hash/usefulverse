const MAX_AMOUNT = 1_000_000_000_000;
const MAX_CUSTOMERS = 1_000_000_000;

function amount(value, label) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0 || number > MAX_AMOUNT) throw new RangeError(`${label} must be from 0 to ${MAX_AMOUNT}.`);
  return number;
}

function integer(value, label) {
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number < 1 || number > MAX_CUSTOMERS) throw new RangeError(`${label} must be a whole number from 1 to ${MAX_CUSTOMERS}.`);
  return number;
}

export function calculateCustomerAcquisitionCost({ marketingSpend, salesSpend, toolsSpend, agencySpend, otherSpend, newCustomers, monthlyRevenuePerCustomer, grossMarginPercent, currency = 'USD' } = {}) {
  const costs = {
    marketing: amount(marketingSpend, 'Marketing spend'),
    sales: amount(salesSpend, 'Sales spend'),
    tools: amount(toolsSpend, 'Tools spend'),
    agency: amount(agencySpend, 'Agency spend'),
    other: amount(otherSpend, 'Other spend'),
  };
  const customers = integer(newCustomers, 'New customers');
  const monthlyRevenue = amount(monthlyRevenuePerCustomer, 'Monthly revenue per customer');
  const margin = Number(grossMarginPercent);
  if (!Number.isFinite(margin) || margin < 0 || margin > 100) throw new RangeError('Gross margin must be from 0 to 100 percent.');
  const currencyCode = String(currency).trim().toUpperCase();
  if (!/^[A-Z]{3}$/u.test(currencyCode)) throw new TypeError('Enter a three-letter ISO currency code, such as USD or EUR.');
  try { new Intl.NumberFormat('en', { style: 'currency', currency: currencyCode }); }
  catch { throw new TypeError('Choose a supported ISO 4217 currency code.'); }
  const supportedCurrencies = Intl.supportedValuesOf?.('currency');
  if (supportedCurrencies && !supportedCurrencies.includes(currencyCode)) throw new TypeError('Choose a supported ISO 4217 currency code.');

  const totalSpend = Object.values(costs).reduce((sum, cost) => sum + cost, 0);
  const cac = totalSpend / customers;
  const monthlyGrossProfit = monthlyRevenue * margin / 100;
  const paybackMonths = monthlyGrossProfit > 0 ? cac / monthlyGrossProfit : null;
  if (![totalSpend, cac, monthlyGrossProfit, ...(paybackMonths === null ? [] : [paybackMonths])].every(Number.isFinite)) throw new RangeError('The result exceeds the supported numeric range.');
  return Object.freeze({ costs: Object.freeze(costs), totalSpend, customers, cac, monthlyRevenue, grossMarginPercent: margin, monthlyGrossProfit, paybackMonths, currency: currencyCode });
}
