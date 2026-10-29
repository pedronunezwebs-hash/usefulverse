export const US_SE_TAX_RULES_2026 = Object.freeze({
  taxYear: 2026,
  socialSecurityWageBase: 184500,
  netEarningsFactor: 0.9235,
  socialSecurityRate: 0.124,
  medicareRate: 0.029,
  filingThreshold: 400,
  effectiveFrom: '2026-01-01',
  checkedAt: '2026-10-19',
  reviewDue: '2027-01-19',
});

function amount(value, name) {
  if (value === null || value === undefined || (typeof value === 'string' && !value.trim())) throw new RangeError(`${name} is required.`);
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0 || n > 1_000_000_000) throw new RangeError(`${name} must be between 0 and 1,000,000,000.`);
  return Math.round(n * 100) / 100;
}

export function calculateSelfEmploymentTax({ netBusinessProfit, socialSecurityWages = 0, taxYear = 2026 } = {}) {
  if (taxYear !== US_SE_TAX_RULES_2026.taxYear) throw new RangeError('Only the 2026 rule snapshot is supported.');
  const profit = amount(netBusinessProfit, 'netBusinessProfit');
  const wages = amount(socialSecurityWages, 'socialSecurityWages');
  const netEarnings = Math.round(profit * US_SE_TAX_RULES_2026.netEarningsFactor * 100) / 100;
  const qualifies = netEarnings >= US_SE_TAX_RULES_2026.filingThreshold;
  const remainingSocialSecurityBase = Math.max(0, US_SE_TAX_RULES_2026.socialSecurityWageBase - wages);
  const socialSecurityTaxableEarnings = qualifies ? Math.min(netEarnings, remainingSocialSecurityBase) : 0;
  const medicareTaxableEarnings = qualifies ? netEarnings : 0;
  const socialSecurityTax = Math.round(socialSecurityTaxableEarnings * US_SE_TAX_RULES_2026.socialSecurityRate * 100) / 100;
  const medicareTax = Math.round(medicareTaxableEarnings * US_SE_TAX_RULES_2026.medicareRate * 100) / 100;
  const totalTax = Math.round((socialSecurityTax + medicareTax) * 100) / 100;
  return Object.freeze({
    currency: 'USD', taxYear, netBusinessProfit: profit, socialSecurityWages: wages,
    netEarnings, qualifies, remainingSocialSecurityBase,
    socialSecurityTaxableEarnings, medicareTaxableEarnings,
    socialSecurityTax, medicareTax, totalTax,
    deductibleHalf: Math.round(totalTax * 50) / 100,
    rules: US_SE_TAX_RULES_2026,
  });
}
