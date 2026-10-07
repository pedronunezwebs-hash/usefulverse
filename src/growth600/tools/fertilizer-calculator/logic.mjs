const MASS_TO_KG = Object.freeze({ kg: 1, lb: 0.45359237 });
const AREA_TO_M2 = Object.freeze({ m2: 1, ha: 10_000, ft2: 0.09290304, acre: 4046.8564224 });
const RATE_TO_KG_PER_M2 = Object.freeze({ kg100m2: 0.01, kgHa: 0.0001, lb1000ft2: 0.45359237 / 92.90304, lbAcre: 0.45359237 / 4046.8564224 });

function bounded(name, value, min, max) {
  if (!Number.isFinite(value) || value < min || value > max) throw new RangeError(`${name} is outside its allowed range.`);
  return value;
}

export function calculateFertilizer({ mode = 'product', productMass, massUnit = 'kg', area, areaUnit = 'm2', productRate, rateUnit = 'kg100m2', nitrogenPercent, phosphatePercent = 0, potashPercent = 0 } = {}) {
  const massFactor = MASS_TO_KG[massUnit];
  if (!massFactor) throw new TypeError('Choose kilograms or pounds.');
  const nitrogen = bounded('Nitrogen percentage', nitrogenPercent, 0, 100);
  const phosphate = bounded('Phosphate percentage', phosphatePercent, 0, 100);
  const potash = bounded('Potash percentage', potashPercent, 0, 100);
  if (nitrogen + phosphate + potash <= 0) throw new RangeError('Enter at least one non-zero N-P-K percentage.');
  let productMassKg;
  if (mode === 'product') {
    productMassKg = bounded('Product mass', productMass, 0.001, 1_000_000) * massFactor;
  } else if (mode === 'area') {
    const areaFactor = AREA_TO_M2[areaUnit];
    const rateFactor = RATE_TO_KG_PER_M2[rateUnit];
    if (!areaFactor || !rateFactor) throw new TypeError('Choose supported area and application-rate units.');
    const areaM2 = bounded('Area', area, 0.01, 1_000_000_000) * areaFactor;
    const rateKgPerM2 = bounded('Product application rate', productRate, 0.000001, 1_000_000) * rateFactor;
    productMassKg = areaM2 * rateKgPerM2;
    if (!Number.isFinite(productMassKg) || productMassKg <= 0 || productMassKg > 1_000_000_000) throw new RangeError('Calculated product mass is outside its allowed range.');
  } else {
    throw new TypeError('Choose product amount or area-rate mode.');
  }
  const toUnit = (kg) => kg / massFactor;
  return Object.freeze({
    mode, massUnit, productMass: toUnit(productMassKg), productMassKg,
    nitrogenPercent: nitrogen, phosphatePercent: phosphate, potashPercent: potash,
    nitrogenMass: toUnit(productMassKg * nitrogen / 100),
    phosphateMass: toUnit(productMassKg * phosphate / 100),
    potashMass: toUnit(productMassKg * potash / 100),
    area: mode === 'area' ? area : null, areaUnit: mode === 'area' ? areaUnit : null,
    productRate: mode === 'area' ? productRate : null, rateUnit: mode === 'area' ? rateUnit : null,
  });
}
