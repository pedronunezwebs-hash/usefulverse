const FORCE_TO_N = Object.freeze({ N: 1, kN: 1000, lbf: 4.4482216152605 });
const AREA_TO_M2 = Object.freeze({ m2: 1, cm2: 1e-4, mm2: 1e-6, ft2: 0.09290304, in2: 0.00064516 });
const DENSITY_TO_KGM3 = Object.freeze({ kgm3: 1, lbft3: 16.01846337396 });
const DEPTH_TO_M = Object.freeze({ m: 1, cm: 0.01, ft: 0.3048, in: 0.0254 });
const PRESSURE_TO_PA = Object.freeze({ Pa: 1, kPa: 1e3, MPa: 1e6, bar: 1e5, atm: 101325, psi: 6894.757293168, torr: 101325 / 760 });
const MAX = 1e12;
function number(name, raw, { min = 0, max = MAX } = {}) { const value = Number(raw); if (!Number.isFinite(value) || value < min || value > max) throw new RangeError(`${name} is outside the supported range.`); return value; }
function checked(value) { if (!Number.isFinite(value) || value < 0 || value > 1e18) throw new RangeError('The pressure result is outside the supported range.'); return value; }
export function calculatePressure({ mode = 'force-area', force = 100, forceUnit = 'N', area = 2, areaUnit = 'm2', density = 1000, densityUnit = 'kgm3', depth = 1, depthUnit = 'm', gravity = 9.80665, pressureUnit = 'Pa' } = {}) {
  if (!Object.hasOwn(PRESSURE_TO_PA, pressureUnit)) throw new TypeError('Choose a supported pressure unit.');
  let pascals; let inputs;
  if (mode === 'force-area') {
    if (!Object.hasOwn(FORCE_TO_N, forceUnit) || !Object.hasOwn(AREA_TO_M2, areaUnit)) throw new TypeError('Choose supported force and area units.');
    const forceN = number('Force', force) * FORCE_TO_N[forceUnit]; const areaM2 = number('Area', area, { min: Number.MIN_VALUE }) * AREA_TO_M2[areaUnit];
    pascals = checked(forceN / areaM2); inputs = Object.freeze({ force: Number(force), forceUnit, forceN, area: Number(area), areaUnit, areaM2 });
  } else if (mode === 'hydrostatic') {
    if (!Object.hasOwn(DENSITY_TO_KGM3, densityUnit) || !Object.hasOwn(DEPTH_TO_M, depthUnit)) throw new TypeError('Choose supported density and depth units.');
    const densityKgm3 = number('Density', density, { min: Number.MIN_VALUE }) * DENSITY_TO_KGM3[densityUnit]; const depthM = number('Depth', depth) * DEPTH_TO_M[depthUnit]; const gravityMps2 = number('Gravity', gravity, { min: Number.MIN_VALUE, max: 100 });
    pascals = checked(densityKgm3 * gravityMps2 * depthM); inputs = Object.freeze({ density: Number(density), densityUnit, densityKgm3, depth: Number(depth), depthUnit, depthM, gravityMps2 });
  } else throw new TypeError('Choose a supported pressure model.');
  return Object.freeze({ mode, pressurePa: pascals, pressure: pascals / PRESSURE_TO_PA[pressureUnit], pressureUnit, inputs });
}
