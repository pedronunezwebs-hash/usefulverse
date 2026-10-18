const MAX_CHF = 1_000_000_000;

function amount(value, field) {
  if (typeof value === 'string' && !value.trim()) throw new TypeError(`${field} is required.`);
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0 || number > MAX_CHF) {
    throw new RangeError(`${field} must be between CHF 0 and CHF ${MAX_CHF}.`);
  }
  return Math.round(number * 100) / 100;
}

/**
 * Compares amounts entered from official Swiss tax-calculator results.
 * This intentionally applies no Swiss tax rules or canton-specific rates.
 */
export function calculateSwissTaxComparisonScenario(input) {
  const label = String(input.label ?? '').trim().slice(0, 60);
  const year = Number(input.year);
  const location = String(input.location ?? '').trim().slice(0, 100);
  if (!label) throw new TypeError('Enter a name for this scenario.');
  if (!Number.isInteger(year) || year < 2010 || year > 2100) throw new RangeError('Enter a tax year from 2010 to 2100.');
  if (!location) throw new TypeError('Enter the municipality or profile shown in the official result.');

  const taxableFederalIncome = amount(input.taxableFederalIncome, 'Federal taxable income');
  const taxableCantonalIncome = amount(input.taxableCantonalIncome, 'Cantonal taxable income');
  const taxableWealth = amount(input.taxableWealth, 'Taxable wealth');
  const federalIncomeTax = amount(input.federalIncomeTax, 'Federal income tax');
  const cantonalIncomeTax = amount(input.cantonalIncomeTax, 'Cantonal income tax');
  const municipalIncomeTax = amount(input.municipalIncomeTax, 'Municipal income tax');
  const churchIncomeTax = amount(input.churchIncomeTax, 'Church income tax');
  const wealthTax = amount(input.wealthTax, 'Wealth tax');
  const personalTax = amount(input.personalTax, 'Personal or poll tax');
  const incomeTaxTotal = Math.round((federalIncomeTax + cantonalIncomeTax + municipalIncomeTax + churchIncomeTax + personalTax) * 100) / 100;
  const totalTax = Math.round((incomeTaxTotal + wealthTax) * 100) / 100;
  return Object.freeze({
    label, year, location,
    taxableFederalIncome, taxableCantonalIncome, taxableWealth,
    federalIncomeTax, cantonalIncomeTax, municipalIncomeTax, churchIncomeTax, wealthTax, personalTax,
    incomeTaxTotal,
    totalTax,
    incomeEffectiveRate: taxableCantonalIncome > 0 ? incomeTaxTotal / taxableCantonalIncome : null,
    wealthEffectiveRate: taxableWealth > 0 ? wealthTax / taxableWealth : null,
  });
}

export function compareSwissTaxScenarios(inputs) {
  if (!Array.isArray(inputs) || inputs.length < 1 || inputs.length > 4) throw new RangeError('Compare between one and four scenarios.');
  const scenarios = inputs.map(calculateSwissTaxComparisonScenario);
  const reference = scenarios[0];
  return Object.freeze(scenarios.map((scenario) => Object.freeze({
    ...scenario,
    deltaFromFirst: Math.round((scenario.totalTax - reference.totalTax) * 100) / 100,
    comparableWithFirst: scenario.year === reference.year
      && scenario.taxableFederalIncome === reference.taxableFederalIncome
      && scenario.taxableCantonalIncome === reference.taxableCantonalIncome
      && scenario.taxableWealth === reference.taxableWealth,
  })));
}
