const MAX_AMOUNT = 1_000_000_000_000;
const MIN_ASSETS = 2;
const MAX_ASSETS = 8;
const WEIGHT_TOLERANCE = 0.01;

function amount(value, label) {
  const parsed = typeof value === 'string' && value.trim() === '' ? NaN : Number(value);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > MAX_AMOUNT) {
    throw new RangeError(`${label} must be between 0 and ${MAX_AMOUNT}.`);
  }
  return parsed;
}

export function calculateInvestmentAllocation(input) {
  const assets = Array.isArray(input?.assets) ? input.assets : [];
  if (assets.length < MIN_ASSETS || assets.length > MAX_ASSETS) {
    throw new RangeError(`Choose between ${MIN_ASSETS} and ${MAX_ASSETS} assets.`);
  }

  const currency = String(input.currency ?? 'USD').trim().toUpperCase();
  if (!/^[A-Z]{3}$/u.test(currency)) throw new RangeError('Enter a three-letter currency code.');

  const normalizedAssets = assets.map((asset, index) => {
    const name = String(asset?.name ?? '').trim();
    if (!name || [...name].length > 32) throw new RangeError(`Asset ${index + 1} needs a name of 1–32 characters.`);
    const currentValue = amount(asset.currentValue, `Asset ${index + 1} current value`);
    const targetWeight = amount(asset.targetWeight, `Asset ${index + 1} target weight`);
    if (targetWeight > 100) throw new RangeError(`Asset ${index + 1} target weight cannot exceed 100%.`);
    return { name, currentValue, targetWeight };
  });

  const weightTotal = normalizedAssets.reduce((sum, asset) => sum + asset.targetWeight, 0);
  if (!(weightTotal > 0) || Math.abs(weightTotal - 100) > WEIGHT_TOLERANCE) {
    throw new RangeError('Target weights must add up to 100%.');
  }

  const currentTotal = normalizedAssets.reduce((sum, asset) => sum + asset.currentValue, 0);
  const contribution = amount(input.contribution ?? 0, 'New contribution');
  const projectedTotal = currentTotal + contribution;
  if (!Number.isFinite(projectedTotal) || projectedTotal > MAX_AMOUNT) {
    throw new RangeError(`Current value plus contribution cannot exceed ${MAX_AMOUNT}.`);
  }

  const weights = normalizedAssets.map((asset) => asset.targetWeight / weightTotal);
  let lastFunded = -1;
  weights.forEach((weight, index) => { if (weight > 0) lastFunded = index; });
  let allocatedTarget = 0;
  let allocatedContribution = 0;
  const rows = normalizedAssets.map((asset, index) => {
    const targetValue = index === lastFunded
      ? projectedTotal - allocatedTarget
      : projectedTotal * weights[index];
    const contributionShare = index === lastFunded
      ? contribution - allocatedContribution
      : contribution * weights[index];
    allocatedTarget += targetValue;
    allocatedContribution += contributionShare;
    return Object.freeze({
      ...asset,
      normalizedWeight: weights[index] * 100,
      targetValue,
      contributionShare,
      difference: targetValue - asset.currentValue,
    });
  });

  return Object.freeze({
    currency,
    weightTotal,
    currentTotal,
    contribution,
    projectedTotal,
    rows: Object.freeze(rows),
  });
}

export const INVESTMENT_ALLOCATION_LIMITS = Object.freeze({
  minAssets: MIN_ASSETS,
  maxAssets: MAX_ASSETS,
  maxAmount: MAX_AMOUNT,
  weightTolerancePercent: WEIGHT_TOLERANCE,
  currencyCodeLength: 3,
});
