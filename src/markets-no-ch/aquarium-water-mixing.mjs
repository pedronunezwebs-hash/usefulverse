const TO_DH = Object.freeze({ dH: 1, fH: 0.56, ppm: 1 / 17.848, meq: 2.8 });
const EPSILON = 1e-9;
const TOLERANCE_DH = 0.05;

export function hardnessToGermanDegrees(value, unit) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0 || !Object.hasOwn(TO_DH, unit)) throw new RangeError('Enter a non-negative hardness and a supported unit.');
  return number * TO_DH[unit];
}

function fractionFor(a, b, target) {
  if (Math.abs(a - b) <= EPSILON) return Math.abs(target - a) <= TOLERANCE_DH ? { free: true } : { outside: true };
  const fraction = (target - b) / (a - b);
  return fraction < -EPSILON || fraction > 1 + EPSILON ? { outside: true, fraction } : { fraction: Math.min(1, Math.max(0, fraction)) };
}

export function calculateAquariumMix({ sourceA, sourceB, target, volume, unit = 'dH' }) {
  const values = [sourceA?.gh, sourceA?.kh, sourceB?.gh, sourceB?.kh, target?.gh, target?.kh, volume].map(Number);
  if (values.some((value) => !Number.isFinite(value)) || values.slice(0, 6).some((value) => value < 0 || value > 10000) || values[6] <= 0 || values[6] > 100000) {
    throw new RangeError('Hardness must be between 0 and 10,000; volume must be above 0 and at most 100,000 litres.');
  }
  if (!Object.hasOwn(TO_DH, unit)) throw new RangeError('Unsupported hardness unit.');
  const [aGhRaw, aKhRaw, bGhRaw, bKhRaw, goalGhRaw, goalKhRaw] = values;
  const [aGh, aKh, bGh, bKh, goalGh, goalKh] = [aGhRaw, aKhRaw, bGhRaw, bKhRaw, goalGhRaw, goalKhRaw].map((value) => value * TO_DH[unit]);
  const gh = fractionFor(aGh, bGh, goalGh);
  const kh = fractionFor(aKh, bKh, goalKh);
  if (gh.outside || kh.outside) return { status: 'unreachable', unit, goalGh: goalGhRaw, goalKh: goalKhRaw, ghFraction: gh.fraction ?? null, khFraction: kh.fraction ?? null };

  const constrained = [gh, kh].filter((result) => !result.free);
  const fractionA = constrained.length ? constrained.reduce((sum, result) => sum + result.fraction, 0) / constrained.length : 0.5;
  const finalGh = fractionA * aGh + (1 - fractionA) * bGh;
  const finalKh = fractionA * aKh + (1 - fractionA) * bKh;
  const compatible = Math.abs(finalGh - goalGh) <= TOLERANCE_DH && Math.abs(finalKh - goalKh) <= TOLERANCE_DH;
  if (!compatible) return { status: 'incompatible', unit, goalGh: goalGhRaw, goalKh: goalKhRaw, ghFraction: gh.fraction ?? null, khFraction: kh.fraction ?? null, predictedGh: finalGh / TO_DH[unit], predictedKh: finalKh / TO_DH[unit], tolerance: TOLERANCE_DH / TO_DH[unit] };
  const litresA = fractionA * values[6];
  return { status: 'compatible', unit, fractionA, percentA: fractionA * 100, litresA, litresB: values[6] - litresA, volume: values[6], targetGh: goalGhRaw, targetKh: goalKhRaw, predictedGh: finalGh / TO_DH[unit], predictedKh: finalKh / TO_DH[unit], ghFraction: gh.fraction ?? null, khFraction: kh.fraction ?? null, tolerance: TOLERANCE_DH / TO_DH[unit] };
}

export const aquariumMixLimits = Object.freeze({ maxHardnessInput: 10000, maxVolumeLitres: 100000, toleranceGermanDegrees: TOLERANCE_DH });
