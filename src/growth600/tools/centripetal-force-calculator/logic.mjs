const MASS_TO_KG = Object.freeze({ kg: 1, lb: 0.45359237 });
const LENGTH_TO_M = Object.freeze({ m: 1, cm: 1e-2, mm: 1e-3, in: 0.0254, ft: 0.3048 });
const SPEED_TO_MS = Object.freeze({ 'm/s': 1, 'km/h': 1 / 3.6, mph: 0.44704 });

function positive(value, name, maximum = 1e12) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0 || number > maximum) throw new RangeError(`Enter a positive ${name} within the supported range.`);
  return number;
}

export function calculateCentripetal(input) {
  const mode = String(input.mode ?? 'speed');
  if (!['speed', 'frequency'].includes(mode)) throw new RangeError('Choose speed or rotation-frequency input.');
  const massUnit = String(input.massUnit ?? 'kg');
  if (!(massUnit in MASS_TO_KG)) throw new RangeError('Choose a supported mass unit.');
  const radiusUnit = String(input.radiusUnit ?? 'm');
  if (!(radiusUnit in LENGTH_TO_M)) throw new RangeError('Choose a supported radius unit.');
  const massKg = positive(input.mass, 'mass', 1e9) * MASS_TO_KG[massUnit];
  const radiusM = positive(input.radius, 'radius', 1e9) * LENGTH_TO_M[radiusUnit];
  let speedMs;
  let frequencyHz;

  if (mode === 'speed') {
    const speedUnit = String(input.speedUnit ?? 'm/s');
    if (!(speedUnit in SPEED_TO_MS)) throw new RangeError('Choose a supported speed unit.');
    speedMs = positive(input.speed, 'speed', 1e9) * SPEED_TO_MS[speedUnit];
    frequencyHz = speedMs / (2 * Math.PI * radiusM);
  } else {
    const frequencyUnit = String(input.frequencyUnit ?? 'Hz');
    if (!['Hz', 'rpm'].includes(frequencyUnit)) throw new RangeError('Choose hertz or revolutions per minute.');
    const frequency = positive(input.frequency, 'rotation frequency', 1e12);
    frequencyHz = frequencyUnit === 'rpm' ? frequency / 60 : frequency;
    speedMs = 2 * Math.PI * radiusM * frequencyHz;
  }
  if (speedMs > 1e6) throw new RangeError('The calculated speed is outside this classical calculator’s supported range.');

  const angularVelocityRadS = 2 * Math.PI * frequencyHz;
  const periodS = 1 / frequencyHz;
  const accelerationMs2 = speedMs ** 2 / radiusM;
  const forceN = massKg * accelerationMs2;
  const results = { mode, massKg, radiusM, speedMs, frequencyHz, rpm: frequencyHz * 60, angularVelocityRadS, periodS, accelerationMs2, forceN, forceLbf: forceN / 4.4482216152605 };
  if (!Object.values(results).filter((value) => typeof value === 'number').every(Number.isFinite)) throw new RangeError('These values exceed the supported numeric range.');
  return results;
}
