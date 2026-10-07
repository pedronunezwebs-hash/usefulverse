const MASS_TO_KG = Object.freeze({ kg: 1, lb: 0.45359237 });

function bounded(name, value, min, max) {
  if (!Number.isFinite(value) || value < min || value > max) throw new RangeError(`${name} is outside its allowed range.`);
  return value;
}

export function calculateCompostMix({ materials = [], massUnit = 'kg', targetMoisturePercent = null } = {}) {
  const unitFactor = MASS_TO_KG[massUnit];
  if (!unitFactor) throw new TypeError('Choose kilograms or pounds.');
  if (!Array.isArray(materials) || materials.length > 4) throw new RangeError('Use at most four materials.');
  const included = materials.map((material, index) => {
    const name = String(material?.name ?? '').trim();
    const values = [material?.wetMass, material?.moisturePercent, material?.carbonPercent, material?.carbonNitrogenRatio];
    if ([...values, name].every((value) => value === null || value === undefined || value === '')) return null;
    if (values.some((value) => value === null || value === undefined || value === '')) throw new RangeError(`Complete every value for material ${index + 1}.`);
    const wetMassKg = bounded(`Material ${index + 1} mass`, material.wetMass, 0.001, 1_000_000) * unitFactor;
    const moisturePercent = bounded(`Material ${index + 1} moisture`, material.moisturePercent, 0, 99.9);
    const carbonPercent = bounded(`Material ${index + 1} dry carbon`, material.carbonPercent, 0.01, 100);
    const carbonNitrogenRatio = bounded(`Material ${index + 1} C:N ratio`, material.carbonNitrogenRatio, 0.1, 1000);
    const dryMassKg = wetMassKg * (1 - moisturePercent / 100);
    const waterKg = wetMassKg - dryMassKg;
    const carbonKg = dryMassKg * carbonPercent / 100;
    const nitrogenKg = carbonKg / carbonNitrogenRatio;
    return Object.freeze({
      name: name.slice(0, 60) || `Material ${index + 1}`,
      wetMassKg, dryMassKg, waterKg, carbonKg, nitrogenKg, moisturePercent, carbonPercent, carbonNitrogenRatio,
    });
  }).filter(Boolean);
  if (!included.length) throw new RangeError('Enter at least one material with a mass above zero.');

  const wetMassKg = included.reduce((sum, material) => sum + material.wetMassKg, 0);
  const dryMassKg = included.reduce((sum, material) => sum + material.dryMassKg, 0);
  const waterKg = included.reduce((sum, material) => sum + material.waterKg, 0);
  const carbonKg = included.reduce((sum, material) => sum + material.carbonKg, 0);
  const nitrogenKg = included.reduce((sum, material) => sum + material.nitrogenKg, 0);
  const target = targetMoisturePercent === null || targetMoisturePercent === undefined || targetMoisturePercent === ''
    ? null
    : bounded('Target moisture', targetMoisturePercent, 0, 90);
  const targetWaterKg = target === null ? null : dryMassKg * target / (100 - target);
  return Object.freeze({
    materials: Object.freeze(included), wetMassKg, dryMassKg, waterKg, carbonKg, nitrogenKg,
    carbonNitrogenRatio: carbonKg / nitrogenKg,
    moisturePercent: wetMassKg > 0 ? waterKg / wetMassKg * 100 : 0,
    targetMoisturePercent: target,
    waterToAddKg: target === null ? null : Math.max(0, targetWaterKg - waterKg),
    waterToRemoveKg: target === null ? null : Math.max(0, waterKg - targetWaterKg),
  });
}
