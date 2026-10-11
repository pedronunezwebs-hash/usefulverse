const MAX_REVENUE = 1_000_000_000;
const MAX_CHURN = 100;
const MAX_MARGIN = 100;
const MAX_CAC = 1_000_000_000;
const MAX_RESULT = 1_000_000_000_000_000;

function number(raw, label, min, max) {
  const value = typeof raw === 'string' && raw.trim() === '' ? NaN : Number(raw);
  if (!Number.isFinite(value) || value < min || value > max) throw new RangeError(`${label} is outside the supported range.`);
  return value;
}

/** Simple constant-monthly-churn LTV estimate; not a forecast of future customer behavior. */
export function calculateLifetimeValue(input) {
  const monthlyRevenue = number(input?.monthlyRevenue, 'Monthly revenue per customer', Number.MIN_VALUE, MAX_REVENUE);
  const grossMarginPercent = number(input?.grossMarginPercent, 'Gross margin', 0, MAX_MARGIN);
  const monthlyChurnPercent = number(input?.monthlyChurnPercent, 'Monthly churn', Number.MIN_VALUE, MAX_CHURN);
  const customerAcquisitionCost = number(input?.customerAcquisitionCost ?? 0, 'Customer acquisition cost', 0, MAX_CAC);
  const currency = String(input?.currency ?? 'USD').trim().toUpperCase();
  if (!/^[A-Z]{3}$/u.test(currency)) throw new RangeError('Enter a three-letter currency code.');

  const monthlyGrossProfit = monthlyRevenue * grossMarginPercent / 100;
  const expectedLifetimeMonths = 100 / monthlyChurnPercent;
  const lifetimeValue = monthlyGrossProfit * expectedLifetimeMonths;
  const cacPaybackMonths = monthlyGrossProfit > 0 ? customerAcquisitionCost / monthlyGrossProfit : null;
  const lifetimeValueToCac = customerAcquisitionCost > 0 ? lifetimeValue / customerAcquisitionCost : null;
  if ([monthlyGrossProfit, expectedLifetimeMonths, lifetimeValue, ...(cacPaybackMonths === null ? [] : [cacPaybackMonths]), ...(lifetimeValueToCac === null ? [] : [lifetimeValueToCac])].some((value) => !Number.isFinite(value) || value > MAX_RESULT)) {
    throw new RangeError('The result exceeds the supported range.');
  }
  return Object.freeze({ currency, monthlyRevenue, grossMarginPercent, monthlyChurnPercent, customerAcquisitionCost, monthlyGrossProfit, expectedLifetimeMonths, lifetimeValue, cacPaybackMonths, lifetimeValueToCac });
}

export const LIFETIME_VALUE_LIMITS = Object.freeze({ maxMonthlyRevenue: MAX_REVENUE, maxMonthlyChurnPercent: MAX_CHURN, maxGrossMarginPercent: MAX_MARGIN, maxCAC: MAX_CAC });
