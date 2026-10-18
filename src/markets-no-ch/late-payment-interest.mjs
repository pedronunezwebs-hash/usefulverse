/** Simple late-interest estimate using supplied annual-rate periods and principal payments. */
export const norwayLateInterest2026Periods = Object.freeze([
  Object.freeze({ startDate: '2026-01-01', endDate: '2026-06-30', annualRatePct: 12 }),
  Object.freeze({ startDate: '2026-07-01', endDate: '2026-12-31', annualRatePct: 12.25 }),
]);

const dayMs = 86400000;
function day(date, name) {
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(String(date))) throw new RangeError(`${name} must be a calendar date.`);
  const value = Date.parse(`${date}T00:00:00Z`);
  if (!Number.isFinite(value) || new Date(value).toISOString().slice(0, 10) !== date) throw new RangeError(`${name} is invalid.`);
  return value;
}
function finite(value, name, min = 0, max = 1e12) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) throw new RangeError(`${name} is outside the supported range.`);
  return number;
}
function round(value) { return Math.round((value + Number.EPSILON) * 100) / 100; }

/**
 * Interest accrues each calendar day from the first accrual day through the
 * calculation/settlement date inclusive. Payments reduce principal after that
 * day's interest. A payment amount must represent principal actually reduced.
 */
export function estimateLatePaymentInterest({ principal, currencyCode = 'NOK', dueDate, interestStartDate, calculationDate, payments = [], ratePeriods = norwayLateInterest2026Periods } = {}) {
  const principalAmount = finite(principal, 'Principal', 0.01);
  const currency = String(currencyCode).toUpperCase();
  if (!/^[A-Z]{3}$/u.test(currency)) throw new RangeError('Currency must be a three-letter ISO code.');
  new Intl.NumberFormat('en', { style: 'currency', currency });
  const due = day(dueDate, 'Due date');
  const startDate = interestStartDate ?? String(dueDate);
  const start = day(startDate, 'First interest day');
  const end = day(calculationDate, 'Calculation date');
  if (start < due) throw new RangeError('Interest cannot start before the stated due date in this scenario.');
  if (end < start) throw new RangeError('Calculation date must be on or after the first interest day.');
  if (end - start > 366 * 50 * dayMs) throw new RangeError('The supported interest period is limited to 50 years.');
  if (!Array.isArray(ratePeriods) || !ratePeriods.length) throw new RangeError('Enter annual interest-rate periods covering the full calculation.');
  const periods = ratePeriods.map((period, index) => {
    const from = day(period.startDate, `Rate period ${index + 1} start`);
    const to = day(period.endDate, `Rate period ${index + 1} end`);
    if (to < from) throw new RangeError(`Rate period ${index + 1} ends before it starts.`);
    return { startDate: period.startDate, endDate: period.endDate, start: from, end: to, annualRatePct: finite(period.annualRatePct, `Rate period ${index + 1} rate`, 0, 1000) };
  }).sort((a, b) => a.start - b.start);
  for (let index = 1; index < periods.length; index += 1) if (periods[index].start <= periods[index - 1].end) throw new RangeError('Rate periods cannot overlap.');
  if (!Array.isArray(payments) || payments.length > 1000) throw new RangeError('Enter no more than 1,000 principal payments.');
  const sortedPayments = payments.map((payment, index) => ({ date: payment.date, dateMs: day(payment.date, `Payment ${index + 1} date`), amount: finite(payment.principalPayment, `Payment ${index + 1} principal amount`, 0.01) })).sort((a, b) => a.dateMs - b.dateMs);
  if (sortedPayments.some((payment) => payment.dateMs < start || payment.dateMs > end)) throw new RangeError('Payments must fall between the first interest day and calculation date.');
  let balance = principalAmount;
  let interestTotal = 0;
  let periodIndex = 0;
  let paymentIndex = 0;
  const byRate = new Map();
  const daily = [];
  for (let cursor = start; cursor <= end; cursor += dayMs) {
    while (periodIndex < periods.length && periods[periodIndex].end < cursor) periodIndex += 1;
    const period = periods[periodIndex];
    if (!period || period.start > cursor || period.end < cursor) throw new RangeError(`No interest rate covers ${new Date(cursor).toISOString().slice(0, 10)}.`);
    const year = new Date(cursor).getUTCFullYear();
    const denominator = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 366 : 365;
    const openingPrincipal = balance;
    const accrued = openingPrincipal * period.annualRatePct / 100 / denominator;
    interestTotal += accrued;
    const key = `${period.startDate}|${period.endDate}|${period.annualRatePct}`;
    const previous = byRate.get(key) ?? { startDate: new Date(cursor).toISOString().slice(0, 10), endDate: new Date(cursor).toISOString().slice(0, 10), annualRatePct: period.annualRatePct, days: 0, interestNok: 0 };
    previous.endDate = new Date(cursor).toISOString().slice(0, 10);
    previous.days += 1;
    previous.interestNok += accrued;
    byRate.set(key, previous);
    while (paymentIndex < sortedPayments.length && sortedPayments[paymentIndex].dateMs === cursor) {
      const payment = sortedPayments[paymentIndex];
      if (payment.amount > balance + 0.005) throw new RangeError('Principal payments cannot exceed the remaining principal on their date.');
      balance = Math.max(0, balance - payment.amount);
      paymentIndex += 1;
    }
    daily.push(Object.freeze({ date: new Date(cursor).toISOString().slice(0, 10), openingPrincipal: round(openingPrincipal), interest: round(accrued), closingPrincipal: round(balance), annualRatePct: period.annualRatePct }));
  }
  return Object.freeze({
    currencyCode: currency, dueDate: String(dueDate), interestStartDate: startDate, calculationDate: String(calculationDate),
    initialPrincipal: round(principalAmount), remainingPrincipal: round(balance), principalPaid: round(principalAmount - balance),
    totalInterest: round(interestTotal), totalAmount: round(balance + interestTotal), days: daily.length,
    ratePeriods: Object.freeze([...byRate.values()].map((period) => Object.freeze({ ...period, interestNok: round(period.interestNok) }))),
    payments: Object.freeze(sortedPayments.map(({ date, amount }) => Object.freeze({ date, principalPayment: round(amount) }))),
    daily: Object.freeze(daily),
  });
}
