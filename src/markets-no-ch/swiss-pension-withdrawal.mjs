const MAX_CHF = 1_000_000_000;

function amount(value, field) {
  if (typeof value === 'string' && !value.trim()) throw new TypeError(`${field} is required.`);
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0 || number > MAX_CHF) throw new RangeError(`${field} must be between CHF 0 and CHF ${MAX_CHF}.`);
  return Math.round(number * 100) / 100;
}

/** Compares user-entered results from the current official ESTV pension-capital calculator. */
export function compareSwissPensionWithdrawals(inputs) {
  if (!Array.isArray(inputs) || inputs.length < 1 || inputs.length > 4) throw new RangeError('Compare one to four withdrawal scenarios.');
  const scenarios = inputs.map((input) => {
    const label = String(input.label ?? '').trim().slice(0, 60);
    const year = Number(input.year);
    const location = String(input.location ?? '').trim().slice(0, 100);
    const household = String(input.household ?? '').trim().slice(0, 100);
    if (!label) throw new TypeError('Enter a name for this scenario.');
    if (!Number.isInteger(year) || year < 2010 || year > 2100) throw new RangeError('Enter a valid tax year.');
    if (!location || !household) throw new TypeError('Enter the municipality and household profile used in the official calculation.');
    const capital = amount(input.capital, 'Total capital benefits due in this tax year');
    const tax = amount(input.tax, 'Official ESTV capital-benefit tax result');
    if (capital === 0) throw new RangeError('The total capital withdrawal must be greater than zero.');
    if (tax > capital) throw new RangeError('The entered tax cannot exceed the capital amount.');
    return Object.freeze({ label, year, location, household, capital, tax,
      effectiveRate: tax / capital,
      afterTaxCapital: Math.round((capital - tax) * 100) / 100,
    });
  });
  const reference = scenarios[0];
  return Object.freeze(scenarios.map((scenario) => Object.freeze({
    ...scenario,
    deltaTaxFromFirst: Math.round((scenario.tax - reference.tax) * 100) / 100,
    comparableWithFirst: scenario.year === reference.year
      && scenario.location.toLocaleLowerCase() === reference.location.toLocaleLowerCase()
      && scenario.household.toLocaleLowerCase() === reference.household.toLocaleLowerCase(),
  })));
}
