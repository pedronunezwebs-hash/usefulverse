const AREA_TO_M2 = Object.freeze({ m2: 1, ft2: 0.09290304 });
const THICKNESS_TO_M = Object.freeze({ mm: 0.001, cm: 0.01, in: 0.0254 });
const DENSITY_TO_KGM3 = Object.freeze({ kgm3: 1, lbft3: 16.01846337396 });

function finiteRange(value, label, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) throw new RangeError(`${label} must be between ${min} and ${max}.`);
  return number;
}

export function calculateAsphalt({ area, areaUnit = 'm2', compactedThickness, thicknessUnit = 'mm', density = 2400, densityUnit = 'kgm3', wastePercent = 0, pricePerTonne = null }) {
  const areaFactor = AREA_TO_M2[areaUnit];
  const thicknessFactor = THICKNESS_TO_M[thicknessUnit];
  const densityFactor = DENSITY_TO_KGM3[densityUnit];
  if (!areaFactor || !thicknessFactor || !densityFactor) throw new TypeError('Choose supported units.');
  const areaM2 = finiteRange(area, 'Area', 0.1, 100_000_000) * areaFactor;
  const thicknessM = finiteRange(compactedThickness, 'Compacted thickness', 1, 1000) * thicknessFactor;
  const densityKgM3 = finiteRange(density, 'Density', 1000 / densityFactor, 4000 / densityFactor) * densityFactor;
  const waste = finiteRange(wastePercent, 'Waste', 0, 30);
  const price = pricePerTonne === '' || pricePerTonne == null ? null : finiteRange(pricePerTonne, 'Price per tonne', 0, 1_000_000);
  const compactedVolumeM3 = areaM2 * thicknessM;
  const orderVolumeM3 = compactedVolumeM3 * (1 + waste / 100);
  const estimatedMassKg = compactedVolumeM3 * densityKgM3 * (1 + waste / 100);
  const metricTonnes = estimatedMassKg / 1000;
  return Object.freeze({
    areaM2,
    compactedThicknessM: thicknessM,
    densityKgM3,
    wastePercent: waste,
    compactedVolumeM3,
    orderVolumeM3,
    estimatedMassKg,
    metricTonnes,
    usShortTons: estimatedMassKg / 907.18474,
    pricePerTonne: price,
    estimatedCost: price == null ? null : metricTonnes * price,
  });
}
