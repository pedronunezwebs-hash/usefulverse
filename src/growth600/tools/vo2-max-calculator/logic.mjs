const KM_PER_MILE = 1.609344;
const LB_PER_KG = 2.20462262185;

export const VO2_LIMITS = Object.freeze({
  cooperDistanceMeters: Object.freeze([100, 100_000]),
  rockportAge: Object.freeze([30, 69]),
  rockportWeightKg: Object.freeze([30, 300]),
  rockportMinutes: Object.freeze([8, 30]),
  heartRateBpm: Object.freeze([40, 220]),
});

function finiteInRange(value, [minimum, maximum], label, { integer = false } = {}) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < minimum || number > maximum || (integer && !Number.isInteger(number))) {
    throw new RangeError(`${label} must be ${integer ? 'a whole number ' : ''}from ${minimum} to ${maximum}.`);
  }
  return number;
}

export function estimateCooperVo2Max({ distance, unit = 'm' }) {
  const metersPerUnit = { m: 1, km: 1000, mi: KM_PER_MILE * 1000 }[unit];
  if (!metersPerUnit) throw new RangeError('Choose meters, kilometers, or miles.');
  const enteredDistance = finiteInRange(distance, [VO2_LIMITS.cooperDistanceMeters[0] / metersPerUnit, VO2_LIMITS.cooperDistanceMeters[1] / metersPerUnit], 'Distance');
  const distanceMeters = enteredDistance * metersPerUnit;
  const estimate = (distanceMeters / 1000 * 22.351) - 11.288;
  return Object.freeze({ method: 'cooper-12-minute-run', distanceMeters, vo2Max: estimate, unit: 'mL/kg/min' });
}

export function estimateRockportVo2Max({ age, weight, weightUnit = 'kg', sexCoefficient, minutes, seconds = 0, finishHeartRate }) {
  if (!['male', 'female'].includes(sexCoefficient)) throw new RangeError('Choose the equation coefficient shown for the original model.');
  const ageYears = finiteInRange(age, VO2_LIMITS.rockportAge, 'Age', { integer: true });
  const weightFactor = { kg: LB_PER_KG, lb: 1 }[weightUnit];
  if (!weightFactor) throw new RangeError('Choose kilograms or pounds.');
  const weightValue = finiteInRange(weight, weightUnit === 'kg' ? VO2_LIMITS.rockportWeightKg : [VO2_LIMITS.rockportWeightKg[0] * LB_PER_KG, VO2_LIMITS.rockportWeightKg[1] * LB_PER_KG], 'Weight');
  const walkMinutes = finiteInRange(minutes, VO2_LIMITS.rockportMinutes, 'Walk time');
  const walkSeconds = finiteInRange(seconds, [0, 59], 'Seconds', { integer: true });
  const totalMinutes = walkMinutes + walkSeconds / 60;
  if (totalMinutes > VO2_LIMITS.rockportMinutes[1]) throw new RangeError('Walk time must be no more than 30 minutes.');
  const heartRate = finiteInRange(finishHeartRate, VO2_LIMITS.heartRateBpm, 'Finishing heart rate', { integer: true });
  const codedSex = sexCoefficient === 'male' ? 1 : 0;
  const weightLb = weightValue * weightFactor;
  const vo2Max = 132.853 - (0.0769 * weightLb) - (0.3877 * ageYears) + (6.315 * codedSex) - (3.2649 * totalMinutes) - (0.1565 * heartRate);
  return Object.freeze({ method: 'rockport-one-mile-walk', age: ageYears, weightKg: weightUnit === 'kg' ? weightValue : weightValue / LB_PER_KG, walkMinutes: totalMinutes, finishHeartRate: heartRate, equationSexCoefficient: codedSex, vo2Max, unit: 'mL/kg/min' });
}

export function estimateVo2Max(input) {
  if (input?.method === 'cooper') return estimateCooperVo2Max(input);
  if (input?.method === 'rockport') return estimateRockportVo2Max(input);
  throw new RangeError('Choose the Cooper 12-minute run or Rockport one-mile walk.');
}
