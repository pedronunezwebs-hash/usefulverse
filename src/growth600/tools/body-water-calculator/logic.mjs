const LIMITS = Object.freeze({ age: [18, 100], heightCm: [120, 230], weightKg: [25, 300] });

function bounded(name, value) {
  const [min, max] = LIMITS[name];
  if (!Number.isFinite(value) || value < min || value > max) throw new RangeError(`${name} is outside the supported adult estimate range.`);
  return value;
}

/** Watson et al. adult anthropometric estimates; output is not a measurement. */
export function estimateTotalBodyWater({ age, heightCm, weightKg, equation }) {
  const years = bounded('age', Number(age));
  if (!Number.isInteger(years)) throw new RangeError('Age must be a whole number of years.');
  const height = bounded('heightCm', Number(heightCm));
  const weight = bounded('weightKg', Number(weightKg));
  if (!['male', 'female'].includes(equation)) throw new TypeError('Choose a published equation variant.');

  const liters = equation === 'male'
    ? 2.447 - (0.09516 * years) + (0.1074 * height) + (0.3362 * weight)
    : -2.097 + (0.1069 * height) + (0.2466 * weight);
  const percent = (liters / weight) * 100;
  if (!Number.isFinite(liters) || liters <= 0 || liters > 250 || !Number.isFinite(percent) || percent > 100) {
    throw new RangeError('Inputs are outside the supported range for this estimate.');
  }
  return Object.freeze({ liters, percent, equation, age: years, heightCm: height, weightKg: weight });
}
