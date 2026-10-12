const MAX_SHARES = 1_000_000_000;
const MAX_PRICE = 1_000_000_000;
const MAX_YEARS = 50;
const MAX_PERCENT = 1_000;

function finiteRange(value, name, min, max, { exclusiveMin = false } = {}) {
  const number = Number(value);
  if (!Number.isFinite(number) || (exclusiveMin ? number <= min : number < min) || number > max) {
    throw new RangeError(`${name} must be between ${min} and ${max}.`);
  }
  return number;
}

function nonNegativeGrowth(value, name, min = -99) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= min || number > MAX_PERCENT) {
    throw new RangeError(`${name} must be greater than ${min}% and no more than ${MAX_PERCENT}%.`);
  }
  return number / 100;
}

export function calculateDividendProjection({
  shares,
  sharePrice,
  annualDividendPerShare,
  paymentsPerYear = 4,
  dividendGrowthPercent = 0,
  priceGrowthPercent = 0,
  years = 10,
  reinvestDividends = false,
} = {}) {
  const initialShares = finiteRange(shares, 'Shares', 0, MAX_SHARES, { exclusiveMin: true });
  const initialPrice = finiteRange(sharePrice, 'Share price', 0, MAX_PRICE, { exclusiveMin: true });
  const annualDividend = finiteRange(annualDividendPerShare, 'Annual dividend per share', 0, MAX_PRICE);
  const payoutFrequency = Number(paymentsPerYear);
  if (![1, 2, 4, 12].includes(payoutFrequency)) throw new RangeError('Choose annual, semiannual, quarterly or monthly payments.');
  const dividendGrowth = nonNegativeGrowth(dividendGrowthPercent, 'Dividend growth');
  const priceGrowth = nonNegativeGrowth(priceGrowthPercent, 'Share-price growth');
  const horizonYears = finiteRange(years, 'Projection years', 1, MAX_YEARS);
  if (!Number.isInteger(horizonYears)) throw new RangeError('Projection years must be a whole number.');

  const startingInvestment = initialShares * initialPrice;
  const currentAnnualIncome = initialShares * annualDividend;
  if (![startingInvestment, currentAnnualIncome].every(Number.isFinite)) throw new RangeError('The entered values are too large to calculate safely.');

  let projectedShares = initialShares;
  let totalReinvested = 0;
  const annualRows = [];
  for (let year = 1; year <= horizonYears; year += 1) {
    const annualPerShareDividend = annualDividend * (1 + dividendGrowth) ** (year - 1);
    const firstPrice = initialPrice * (1 + priceGrowth) ** (year - 1);
    const periodPriceGrowth = (1 + priceGrowth) ** (1 / payoutFrequency);
    let incomePaidThisYear = 0;
    for (let payment = 0; payment < payoutFrequency; payment += 1) {
      const paymentPrice = firstPrice * periodPriceGrowth ** payment;
      const paymentAmount = projectedShares * annualPerShareDividend / payoutFrequency;
      if (![paymentPrice, paymentAmount].every(Number.isFinite) || paymentPrice <= 0) throw new RangeError('The projection is outside the safe calculation range.');
      if (reinvestDividends) {
        projectedShares += paymentAmount / paymentPrice;
        totalReinvested += paymentAmount;
      } else {
        incomePaidThisYear += paymentAmount;
      }
    }
    const endPrice = initialPrice * (1 + priceGrowth) ** year;
    const nextAnnualDividendPerShare = annualDividend * (1 + dividendGrowth) ** year;
    const nextAnnualIncome = projectedShares * nextAnnualDividendPerShare;
    const portfolioValue = projectedShares * endPrice;
    if (![endPrice, nextAnnualIncome, portfolioValue, projectedShares, totalReinvested].every(Number.isFinite)) throw new RangeError('The projection is outside the safe calculation range.');
    annualRows.push(Object.freeze({
      year,
      shares: projectedShares,
      sharePrice: endPrice,
      annualIncome: nextAnnualIncome,
      incomePaid: incomePaidThisYear,
      portfolioValue,
      totalReinvested,
    }));
  }

  const final = annualRows.at(-1);
  return Object.freeze({
    startingInvestment,
    currentAnnualIncome,
    currentIncomePerPayment: currentAnnualIncome / payoutFrequency,
    currentYield: annualDividend / initialPrice * 100,
    yieldOnCost: currentAnnualIncome / startingInvestment * 100,
    paymentsPerYear: payoutFrequency,
    reinvestDividends: Boolean(reinvestDividends),
    projectedShares: final.shares,
    projectedSharePrice: final.sharePrice,
    projectedAnnualIncome: final.annualIncome,
    projectedPortfolioValue: final.portfolioValue,
    totalReinvested,
    years: horizonYears,
    annualRows: Object.freeze(annualRows),
  });
}

export const DIVIDEND_CALCULATOR_LIMITS = Object.freeze({ maxShares: MAX_SHARES, maxSharePrice: MAX_PRICE, maxYears: MAX_YEARS, maxGrowthPercent: MAX_PERCENT });
