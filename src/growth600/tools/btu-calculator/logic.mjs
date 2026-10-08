const LENGTH_TO_FEET = Object.freeze({ ft: 1, m: 3.280839895013123, in: 1 / 12 });
const SUN_FACTORS = Object.freeze({ shaded: 0.9, typical: 1, sunny: 1.1 });
const ROOM_BANDS = Object.freeze([
  [150, 5000], [250, 6000], [300, 7000], [350, 8000], [400, 9000], [450, 10000],
  [550, 12000], [700, 14000], [1000, 18000], [1200, 21000], [1400, 23000],
  [1500, 24000], [2000, 30000], [2500, 34000],
]);

function bounded(name, value, minimum, maximum) {
  if (!Number.isFinite(value) || value < minimum || value > maximum) throw new RangeError(`${name} must be from ${minimum} to ${maximum}.`);
  return value;
}

export function calculateBtu({
  length, width, ceilingHeight, dimensionUnit = 'ft', ceilingUnit = dimensionUnit,
  insulationAdjustmentPercent = 0, sunExposure = 'typical', occupants = 2, kitchen = false,
} = {}) {
  const lengthFactor = LENGTH_TO_FEET[dimensionUnit];
  const heightFactor = LENGTH_TO_FEET[ceilingUnit];
  if (!lengthFactor || !heightFactor) throw new RangeError('Choose supported length units.');
  const lengthFt = bounded('Room length', length, 0, 1000) * lengthFactor;
  const widthFt = bounded('Room width', width, 0, 1000) * lengthFactor;
  const ceilingFt = bounded('Ceiling height', ceilingHeight, 0.1, 40) * heightFactor;
  const insulationAdjustment = bounded('Insulation adjustment', insulationAdjustmentPercent, -30, 50);
  if (!Object.hasOwn(SUN_FACTORS, sunExposure)) throw new RangeError('Choose a supported sun exposure.');
  bounded('Occupants', occupants, 0, 50);
  if (!Number.isInteger(occupants)) throw new RangeError('Occupants must be a whole number.');
  if (typeof kitchen !== 'boolean') throw new RangeError('Kitchen must be true or false.');

  const areaFt2 = lengthFt * widthFt;
  if (!Number.isFinite(areaFt2) || areaFt2 > 2500) throw new RangeError('Room area is outside the supported 0–2,500 sq ft reference range.');
  const volumeFt3 = areaFt2 * ceilingFt;
  if (!Number.isFinite(volumeFt3)) throw new RangeError('Room volume is too large to calculate.');

  if (areaFt2 === 0) return Object.freeze({ areaFt2, areaM2: 0, volumeFt3: 0, volumeM3: 0, baseBtuPerHour: 0, ceilingFactor: 0, insulationAdjustmentPercent: insulationAdjustment, sunFactor: SUN_FACTORS[sunExposure], occupantAdjustmentBtuPerHour: 0, kitchenAdjustmentBtuPerHour: 0, estimatedBtuPerHour: 0, tons: 0, belowReferenceBand: false });

  // The lowest published ENERGY STAR band begins at 100 sq ft. For smaller rooms
  // return its 5,000 Btu/h floor and disclose that the reference chart starts higher.
  const band = ROOM_BANDS.find(([maximumArea]) => areaFt2 <= maximumArea);
  if (!band) throw new RangeError('Room area exceeds the published 2,500 sq ft reference range; use a professional load calculation.');
  const belowReferenceBand = areaFt2 < 100;
  const baseBtuPerHour = band[1];
  const ceilingFactor = ceilingFt / 8;
  const sunFactor = SUN_FACTORS[sunExposure];
  const occupantAdjustmentBtuPerHour = Math.max(0, occupants - 2) * 600;
  const kitchenAdjustmentBtuPerHour = kitchen ? 4000 : 0;
  const adjusted = baseBtuPerHour * ceilingFactor * (1 + insulationAdjustment / 100) * sunFactor
    + occupantAdjustmentBtuPerHour + kitchenAdjustmentBtuPerHour;
  if (!Number.isFinite(adjusted) || adjusted < 0 || adjusted > 1_000_000) throw new RangeError('The requested estimate is outside the supported range.');
  const estimatedBtuPerHour = Math.ceil(adjusted / 1000) * 1000;
  return Object.freeze({
    areaFt2, areaM2: areaFt2 * 0.09290304, volumeFt3, volumeM3: volumeFt3 * 0.028316846592,
    baseBtuPerHour, ceilingFactor, insulationAdjustmentPercent: insulationAdjustment, sunFactor,
    occupantAdjustmentBtuPerHour, kitchenAdjustmentBtuPerHour, estimatedBtuPerHour,
    tons: estimatedBtuPerHour / 12_000, belowReferenceBand,
  });
}
