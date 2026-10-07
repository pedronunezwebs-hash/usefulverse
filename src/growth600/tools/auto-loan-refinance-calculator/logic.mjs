function positive(value, name, { allowZero = false } = {}) {
  const number = Number(value);
  if (!Number.isFinite(number) || (allowZero ? number < 0 : number <= 0)) throw new RangeError(`${name} must be ${allowZero ? 'zero or greater' : 'greater than zero'}.`);
  return number;
}

export function monthlyLoanPayment(principal, annualAprPercent, months) {
  const amount = positive(principal, 'Principal');
  const apr = positive(annualAprPercent, 'APR', { allowZero: true });
  const term = positive(months, 'Term');
  if (!Number.isInteger(term)) throw new RangeError('Term must be a whole number of months.');
  const monthlyRate = apr / 100 / 12;
  return monthlyRate === 0 ? amount / term : amount * monthlyRate / (1 - (1 + monthlyRate) ** -term);
}

export function compareAutoLoanRefinance({ balance, currentApr, currentMonths, newApr, newMonths, fees = 0, feeTreatment = 'upfront' }) {
  const amount = positive(balance, 'Payoff balance');
  const fee = positive(fees, 'Fees', { allowZero: true });
  if (!['upfront', 'rolled-in'].includes(feeTreatment)) throw new RangeError('Choose upfront or rolled-in fees.');
  const currentPayment = monthlyLoanPayment(amount, currentApr, currentMonths);
  const refinancePrincipal = amount + (feeTreatment === 'rolled-in' ? fee : 0);
  const newPayment = monthlyLoanPayment(refinancePrincipal, newApr, newMonths);
  const currentTotal = currentPayment * Number(currentMonths);
  const refinancePayments = newPayment * Number(newMonths);
  const refinanceTotal = refinancePayments + (feeTreatment === 'upfront' ? fee : 0);
  const monthlyDifference = currentPayment - newPayment;
  let breakEvenMonths = fee === 0 ? 0 : null;
  if (fee > 0) {
    let currentPaid = 0;
    let refinancePaid = feeTreatment === 'upfront' ? fee : 0;
    const maxMonths = Math.max(Number(currentMonths), Number(newMonths));
    for (let month = 1; month <= maxMonths; month += 1) {
      if (month <= Number(currentMonths)) currentPaid += currentPayment;
      if (month <= Number(newMonths)) refinancePaid += newPayment;
      if (refinancePaid <= currentPaid + 1e-8) { breakEvenMonths = month; break; }
    }
  }
  return {
    currentPayment,
    refinancePayment: newPayment,
    monthlyDifference,
    currentTotal,
    refinanceTotal,
    estimatedSavings: currentTotal - refinanceTotal,
    breakEvenMonths,
    refinancePrincipal,
    feeTreatment,
  };
}
