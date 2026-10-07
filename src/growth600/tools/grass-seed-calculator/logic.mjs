const AREA_TO_M2 = Object.freeze({ m2: 1, ft2: 0.09290304, acre: 4046.8564224 });
const RATE_TO_KG_PER_M2 = Object.freeze({ 'g-m2': 0.001, 'lb-1000ft2': 0.004882427636 });
const KG_PER_POUND = 0.45359237;

function bounded(name, value, min, max) {
  if (!Number.isFinite(value) || value < min || value > max) throw new RangeError(`${name} must be from ${min} to ${max}.`);
  return value;
}

export function calculateGrassSeed({ area, areaUnit = 'm2', seedingRate, rateUnit = 'g-m2', wastePercent = 0, varietyA = 'Seed A', percentA = 100, varietyB = '', percentB = 0, bagSize = 0, bagUnit = 'kg' } = {}) {
  const areaFactor = AREA_TO_M2[areaUnit];
  const rateFactor = RATE_TO_KG_PER_M2[rateUnit];
  if (!areaFactor || !rateFactor || !['kg', 'lb'].includes(bagUnit)) throw new TypeError('Choose supported area, rate and bag units.');
  const areaM2 = bounded('Area', area, 0.01, 100_000_000) * areaFactor;
  const rateKgM2 = bounded('Seeding rate', seedingRate, 0, 1_000_000) * rateFactor;
  const extra = bounded('Extra seed', wastePercent, 0, 50);
  const shareA = bounded('Variety A share', percentA, 0, 100);
  const shareB = bounded('Variety B share', percentB, 0, 100);
  if (Math.abs(shareA + shareB - 100) > 1e-8) throw new RangeError('Seed mix percentages must add up to 100%.');
  const cleanName = (value, fallback) => {
    const name = typeof value === 'string' ? value.trim() : '';
    if (name.length > 50) throw new RangeError('Seed variety names must be 50 characters or fewer.');
    return name || fallback;
  };
  const names = [cleanName(varietyA, 'Seed A'), cleanName(varietyB, 'Seed B')];
  const baseKg = areaM2 * rateKgM2;
  const totalKg = baseKg * (1 + extra / 100);
  const components = [shareA, shareB].map((share, index) => Object.freeze({ name: names[index], sharePercent: share, weightKg: totalKg * share / 100 }));
  const size = bounded('Bag size', bagSize, 0, 1_000_000);
  const bagSizeKg = size === 0 ? null : size * (bagUnit === 'lb' ? KG_PER_POUND : 1);
  return Object.freeze({
    areaM2, baseKg, totalKg, extraPercent: extra, seedingRate, rateUnit, areaUnit,
    areaInSelectedUnit: area,
    bagSizeKg,
    bagsNeeded: bagSizeKg ? Math.ceil(totalKg / bagSizeKg - 1e-12) : null,
    estimatedPackedKg: bagSizeKg ? Math.ceil(totalKg / bagSizeKg - 1e-12) * bagSizeKg : null,
    totalLb: totalKg / KG_PER_POUND,
    components: Object.freeze(components),
  });
}
