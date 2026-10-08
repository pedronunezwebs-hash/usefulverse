const LENGTH_TO_M = Object.freeze({ m: 1, cm: 0.01, mm: 0.001, ft: 0.3048, in: 0.0254 });
const SQFT_PER_SQUARE = 100;
const SQFT_TO_M2 = 0.09290304;

function finiteRange(value, label, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) throw new RangeError(`${label} must be between ${min} and ${max}.`);
  return number;
}

export function calculateRoofing({ projectedArea, areaUnit = 'ft2', rise, run, pitchUnit = 'ft', wastePercent = 10, bundlesPerSquare = 3, pricePerBundle = null }) {
  const areaFactor = { m2: 1, ft2: SQFT_TO_M2 }[areaUnit];
  const lengthFactor = LENGTH_TO_M[pitchUnit];
  if (!areaFactor) throw new TypeError('Choose square metres or square feet.');
  if (!lengthFactor) throw new TypeError('Choose a supported pitch unit.');
  const projectedAreaM2 = finiteRange(projectedArea, 'Projected roof area', 0.1, 100_000_000) * areaFactor;
  const riseM = finiteRange(rise, 'Rise', 0, 100_000) * lengthFactor;
  const runM = finiteRange(run, 'Run', 0.001, 100_000) * lengthFactor;
  const waste = finiteRange(wastePercent, 'Waste', 0, 30);
  const bundlesPerSquareValue = finiteRange(bundlesPerSquare, 'Bundles per square', 0.1, 20);
  const price = pricePerBundle === null || pricePerBundle === '' ? null : finiteRange(pricePerBundle, 'Price per bundle', 0, 1_000_000);

  const slopeFactor = Math.hypot(runM, riseM) / runM;
  const roofAreaM2 = projectedAreaM2 * slopeFactor;
  const orderAreaM2 = roofAreaM2 * (1 + waste / 100);
  const roofingSquares = orderAreaM2 / (SQFT_PER_SQUARE * SQFT_TO_M2);
  const bundles = Math.ceil(roofingSquares * bundlesPerSquareValue);
  return Object.freeze({
    projectedAreaM2, riseM, runM, slopeFactor, roofAreaM2, orderAreaM2,
    roofingSquares, bundlesPerSquare: bundlesPerSquareValue, bundles,
    estimatedCost: price === null ? null : bundles * price,
  });
}

export { LENGTH_TO_M as ROOFING_LENGTH_TO_M, SQFT_PER_SQUARE, SQFT_TO_M2 };
