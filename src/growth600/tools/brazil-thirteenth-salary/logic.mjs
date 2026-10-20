const roundMoney = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

export function getBrazilYear(now = new Date()) {
  if (!(now instanceof Date) || !Number.isFinite(now.getTime())) throw new TypeError('A valid date is required.');
  return Number(new Intl.DateTimeFormat('en', { timeZone: 'America/Sao_Paulo', year: 'numeric' }).format(now));
}

export function estimateBrazilThirteenth({ monthlyRemuneration, eligibleMonths, advancePaid = 0, inssWithheld = 0, incomeTaxWithheld = 0 } = {}) {
  const values = { monthlyRemuneration, eligibleMonths, advancePaid, inssWithheld, incomeTaxWithheld };
  for (const [name, value] of Object.entries(values)) {
    if (value === '' || value === undefined || !Number.isFinite(Number(value)) || Number(value) < 0) {
      throw Object.assign(new RangeError(`Invalid ${name}.`), { code: 'invalid-input' });
    }
  }
  const salary = Number(monthlyRemuneration);
  const months = Number(eligibleMonths);
  if (salary <= 0 || salary > 100_000_000 || Math.abs(salary * 100 - Math.round(salary * 100)) > 1e-7) {
    throw Object.assign(new RangeError('Enter a monthly remuneration greater than zero with at most two decimal places.'), { code: 'invalid-salary' });
  }
  if (!Number.isInteger(months) || months > 12) {
    throw Object.assign(new RangeError('Eligible months must be a whole number from 0 to 12.'), { code: 'invalid-months' });
  }
  const amounts = ['advancePaid', 'inssWithheld', 'incomeTaxWithheld'];
  if (amounts.some((name) => Number(values[name]) > 100_000_000 || Math.abs(Number(values[name]) * 100 - Math.round(Number(values[name]) * 100)) > 1e-7)) {
    throw Object.assign(new RangeError('Enter amounts with at most two decimal places.'), { code: 'invalid-input' });
  }
  const gross = roundMoney(salary * months / 12);
  const advance = roundMoney(Number(advancePaid));
  const inss = roundMoney(Number(inssWithheld));
  const incomeTax = roundMoney(Number(incomeTaxWithheld));
  return Object.freeze({
    monthlyRemuneration: roundMoney(salary),
    eligibleMonths: months,
    gross,
    advance,
    inssWithheld: inss,
    incomeTaxWithheld: incomeTax,
    enteredDeductions: roundMoney(inss + incomeTax),
    remainingEstimate: roundMoney(gross - advance - inss - incomeTax),
    year: getBrazilYear(),
  });
}
