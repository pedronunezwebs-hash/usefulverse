const MAX_SHARES = 1_000_000_000;
const MAX_PRICE = 1_000_000_000;
const MAX_FEE = 1_000_000_000;
const MAX_LOTS = 20;

function finite(value, name, min = 0, max = MAX_PRICE) {
  const parsed = typeof value === 'string' && value.trim() === '' ? NaN : Number(value);
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) throw new RangeError(`${name} is outside the supported range.`);
  return parsed;
}

export function calculateStockProfit(input) {
  const lots = Array.isArray(input?.lots) ? input.lots : [];
  if (!lots.length || lots.length > MAX_LOTS) throw new RangeError(`Enter between 1 and ${MAX_LOTS} purchase lots.`);
  const currency = String(input.currency ?? 'USD').trim().toUpperCase();
  if (!/^[A-Z]{3}$/u.test(currency)) throw new RangeError('Enter a three-letter currency code.');

  const purchases = lots.map((lot, index) => {
    const quantity = finite(lot?.quantity, `Lot ${index + 1} shares`, 0.00000001, MAX_SHARES);
    const price = finite(lot?.price, `Lot ${index + 1} purchase price`);
    const fee = finite(lot?.fee ?? 0, `Lot ${index + 1} purchase fee`, 0, MAX_FEE);
    const grossCost = quantity * price;
    if (!Number.isFinite(grossCost) || grossCost + fee > MAX_FEE) throw new RangeError(`Lot ${index + 1} cost exceeds the supported range.`);
    return { quantity, price, fee, grossCost, totalCost: grossCost + fee };
  });
  const sharesOwned = purchases.reduce((sum, lot) => sum + lot.quantity, 0);
  const totalCost = purchases.reduce((sum, lot) => sum + lot.totalCost, 0);
  if (!Number.isFinite(sharesOwned) || sharesOwned > MAX_SHARES || !Number.isFinite(totalCost) || totalCost > MAX_FEE) {
    throw new RangeError('Combined purchases exceed the supported range.');
  }
  const sharesSold = finite(input.sharesSold, 'Shares to sell', 0.00000001, sharesOwned);
  const salePrice = finite(input.salePrice, 'Sale price');
  const saleFee = finite(input.saleFee ?? 0, 'Sale fee', 0, MAX_FEE);
  const method = input.method ?? 'average';
  if (!['average', 'fifo'].includes(method)) throw new RangeError('Choose average cost or FIFO.');

  let costBasis;
  if (method === 'fifo') {
    let remainingToSell = sharesSold;
    costBasis = 0;
    for (const lot of purchases) {
      const taken = Math.min(remainingToSell, lot.quantity);
      costBasis += taken * (lot.totalCost / lot.quantity);
      remainingToSell -= taken;
      if (remainingToSell <= Math.max(1, sharesSold) * 1e-12) break;
    }
  } else {
    costBasis = totalCost * (sharesSold / sharesOwned);
  }

  const grossProceeds = sharesSold * salePrice;
  const netProceeds = grossProceeds - saleFee;
  const profit = netProceeds - costBasis;
  const remainingShares = Math.max(0, sharesOwned - sharesSold);
  const remainingCostBasis = Math.max(0, totalCost - costBasis);
  const averageCostPerShare = totalCost / sharesOwned;
  const breakevenSalePrice = (costBasis + saleFee) / sharesSold;
  const returnPercent = costBasis <= 1e-12 ? null : profit / costBasis * 100;
  for (const value of [grossProceeds, netProceeds, profit, remainingCostBasis, averageCostPerShare, breakevenSalePrice, ...(returnPercent === null ? [] : [returnPercent])]) {
    if (!Number.isFinite(value) || Math.abs(value) > MAX_FEE) throw new RangeError('The result exceeds the supported range.');
  }
  return Object.freeze({
    currency, method, sharesOwned, sharesSold, remainingShares, totalCost, costBasis,
    grossProceeds, saleFee, netProceeds, profit, returnPercent,
    averageCostPerShare, remainingCostBasis, breakevenSalePrice,
  });
}

export const STOCK_PROFIT_LIMITS = Object.freeze({ maxLots: MAX_LOTS, maxShares: MAX_SHARES, maxPrice: MAX_PRICE, maxFee: MAX_FEE });
