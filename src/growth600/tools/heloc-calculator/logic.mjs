const MAX_MONEY = 100_000_000;
const CURRENCIES = Object.freeze(['USD', 'CAD', 'AUD', 'GBP', 'EUR']);

function bounded(value, name, min, max, integer = false) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max || (integer && !Number.isInteger(number))) {
    throw new RangeError(`${name} is outside the supported range.`);
  }
  return number;
}

function principalAndInterestPayment(balance, monthlyRate, months) {
  return monthlyRate === 0 ? balance / months : balance * monthlyRate / (1 - (1 + monthlyRate) ** -months);
}

export function calculateHelocScenario({ creditLimit, balance, annualAprPercent, drawMonths, repaymentMonths, currency = 'USD' }) {
  const limit = bounded(creditLimit, 'Credit limit', 0.01, MAX_MONEY);
  const principal = bounded(balance, 'Current balance', 0, MAX_MONEY);
  const apr = bounded(annualAprPercent, 'APR', 0, 100);
  const drawTerm = bounded(drawMonths, 'Draw period', 1, 360, true);
  const repaymentTerm = bounded(repaymentMonths, 'Repayment period', 1, 360, true);
  if (principal > limit) throw new RangeError('Current balance cannot exceed the credit limit.');
  if (!CURRENCIES.includes(currency)) throw new RangeError('Choose a supported currency.');

  const monthlyRate = apr / 100 / 12;
  const interestOnlyPayment = principal * monthlyRate;
  // This model assumes no further withdrawals or principal payments in the draw phase.
  const drawInterest = interestOnlyPayment * drawTerm;
  const repaymentPayment = principalAndInterestPayment(principal, monthlyRate, repaymentTerm);
  const repaymentTotal = repaymentPayment * repaymentTerm;
  const repaymentInterest = Math.max(0, repaymentTotal - principal);
  const totalInterest = drawInterest + repaymentInterest;

  return Object.freeze({
    currency,
    creditLimit: limit,
    balance: principal,
    availableCredit: limit - principal,
    annualAprPercent: apr,
    drawMonths: drawTerm,
    repaymentMonths: repaymentTerm,
    interestOnlyPayment,
    drawInterest,
    repaymentPayment,
    repaymentInterest,
    repaymentTotal,
    totalInterest,
    totalPayments: drawInterest + repaymentTotal,
    paymentChange: repaymentPayment - interestOnlyPayment,
  });
}
