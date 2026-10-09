const MAX_COUNT = 1_000_000_000_000;
const Z_95 = 1.959963984540054;

function count(value, name, { min = 0 } = {}) {
  const parsed = typeof value === 'string' && value.trim() === '' ? NaN : Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < min || parsed > MAX_COUNT) {
    throw new RangeError(`${name} must be a whole number from ${min} to ${MAX_COUNT}.`);
  }
  return parsed;
}

function wilsonInterval(successes, trials) {
  const p = successes / trials;
  const z2 = Z_95 ** 2;
  const denominator = 1 + z2 / trials;
  const center = (p + z2 / (2 * trials)) / denominator;
  const margin = Z_95 * Math.sqrt((p * (1 - p) / trials) + (z2 / (4 * trials ** 2))) / denominator;
  return Object.freeze({ lower: Math.max(0, center - margin), upper: Math.min(1, center + margin) });
}

function normalCdf(value) {
  const x = Math.abs(value);
  const t = 1 / (1 + 0.2316419 * x);
  const density = 0.3989422804014327 * Math.exp(-0.5 * x * x);
  const tail = density * t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return value >= 0 ? 1 - tail : tail;
}

export function calculateAbTest(raw) {
  const visitorsA = count(raw.visitorsA, 'Group A visitors', { min: 1 });
  const conversionsA = count(raw.conversionsA, 'Group A conversions');
  const visitorsB = count(raw.visitorsB, 'Group B visitors', { min: 1 });
  const conversionsB = count(raw.conversionsB, 'Group B conversions');
  if (conversionsA > visitorsA || conversionsB > visitorsB) throw new RangeError('Conversions cannot exceed visitors.');

  const rateA = conversionsA / visitorsA;
  const rateB = conversionsB / visitorsB;
  const difference = rateB - rateA;
  const pooled = (conversionsA + conversionsB) / (visitorsA + visitorsB);
  const standardError = Math.sqrt(pooled * (1 - pooled) * (1 / visitorsA + 1 / visitorsB));
  const zScore = standardError === 0 ? 0 : difference / standardError;
  const pValue = difference === 0 ? 1 : Math.min(1, 2 * (1 - normalCdf(Math.abs(zScore))));
  const intervalA = wilsonInterval(conversionsA, visitorsA);
  const intervalB = wilsonInterval(conversionsB, visitorsB);
  const differenceInterval = Object.freeze({
    lower: difference - Math.hypot(rateB - intervalB.lower, intervalA.upper - rateA),
    upper: difference + Math.hypot(intervalB.upper - rateB, rateA - intervalA.lower),
  });

  return Object.freeze({
    visitorsA, conversionsA, visitorsB, conversionsB, rateA, rateB,
    difference, percentagePointDifference: difference * 100,
    relativeLift: rateA === 0 ? null : difference / rateA,
    intervalA, intervalB, differenceInterval, zScore, pValue,
    significantAtFivePercent: pValue < 0.05,
    method: 'Two-sided pooled two-proportion z-test; 95% Wilson/Newcombe intervals',
  });
}

export const AB_TEST_LIMITS = Object.freeze({ minVisitorsPerGroup: 1, maxCount: MAX_COUNT, confidenceLevel: 0.95, alpha: 0.05 });
