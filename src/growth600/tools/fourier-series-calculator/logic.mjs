const MAX_SAMPLES = 128;
const MAX_AMPLITUDE = 1e12;
const MAX_PERIOD = 1e12;
const RECONSTRUCTION_POINTS = 192;

function finitePositive(value, label, max) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0 || number > max) throw new RangeError(`${label} must be positive and within the supported range.`);
  return number;
}

export function parsePeriodicSamples(values) {
  const samples = Array.isArray(values) ? values.map(Number) : String(values ?? '').split(/[;\s]+/u).filter(Boolean).map(Number);
  if (samples.length < 4 || samples.length > MAX_SAMPLES || samples.some((value) => !Number.isFinite(value) || Math.abs(value) > MAX_AMPLITUDE)) {
    throw new RangeError(`Enter 4–${MAX_SAMPLES} finite samples within the supported amplitude range.`);
  }
  return samples;
}

export function calculateFourierSeries({ samples: rawSamples, period: rawPeriod = 1, harmonics: rawHarmonics = 1 } = {}) {
  const samples = parsePeriodicSamples(rawSamples);
  const period = finitePositive(rawPeriod, 'Period', MAX_PERIOD);
  const fundamentalFrequency = 1 / period;
  if (!Number.isFinite(fundamentalFrequency)) throw new RangeError('Period is too small to represent a finite fundamental frequency.');
  const harmonics = Number(rawHarmonics);
  const maxHarmonics = Math.floor((samples.length - 1) / 2);
  if (!Number.isInteger(harmonics) || harmonics < 0 || harmonics > maxHarmonics) throw new RangeError(`Harmonics must be an integer from 0 to ${maxHarmonics}.`);

  const count = samples.length;
  const scale = Math.max(1, ...samples.map(Math.abs));
  const dc = samples.reduce((sum, value) => sum + value, 0) / count;
  const isConstant = Math.max(...samples) - Math.min(...samples) <= Number.EPSILON * scale * 16;
  const coefficients = [];
  for (let n = 1; n <= harmonics; n += 1) {
    let cosine = 0;
    let sine = 0;
    for (let j = 0; j < count; j += 1) {
      const angle = 2 * Math.PI * n * j / count;
      cosine += samples[j] * Math.cos(angle);
      sine += samples[j] * Math.sin(angle);
    }
    let a = 2 * cosine / count;
    let b = 2 * sine / count;
    const noiseFloor = Number.EPSILON * scale * 16;
    if (Math.abs(a) < noiseFloor) a = 0;
    if (Math.abs(b) < noiseFloor) b = 0;
    const amplitude = Math.hypot(a, b);
    coefficients.push(Object.freeze({ harmonic: n, a, b, amplitude, phaseRadians: amplitude === 0 ? 0 : Math.atan2(-b, a) }));
  }

  const valueAt = (phase) => coefficients.reduce((sum, { harmonic, a, b }) => sum + a * Math.cos(2 * Math.PI * harmonic * phase) + b * Math.sin(2 * Math.PI * harmonic * phase), dc);
  const reconstruction = Array.from({ length: RECONSTRUCTION_POINTS }, (_, index) => valueAt(index / RECONSTRUCTION_POINTS));
  let squaredError = 0;
  for (let j = 0; j < count; j += 1) squaredError += (valueAt(j / count) - samples[j]) ** 2;

  return Object.freeze({
    period,
    fundamentalFrequency,
    sampleCount: count,
    maxHarmonics,
    harmonics,
    dc,
    isConstant,
    coefficients: Object.freeze(coefficients),
    reconstruction: Object.freeze(reconstruction),
    rmsError: Math.sqrt(squaredError / count),
    samples: Object.freeze([...samples]),
  });
}

export const FOURIER_LIMITS = Object.freeze({ maxSamples: MAX_SAMPLES, maxAmplitude: MAX_AMPLITUDE, maxPeriod: MAX_PERIOD, reconstructionPoints: RECONSTRUCTION_POINTS });
