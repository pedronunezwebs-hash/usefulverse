const KG_PER_LB = 0.45359237;
const CM_PER_IN = 2.54;

export function calculateLeanBodyMass({ weight, height, bodyFatPercent, method = 'body-fat', equation = 'male', unitSystem = 'metric' }) {
  if (!Number.isFinite(weight) || weight <= 0) throw new RangeError('Enter a positive body weight.');
  if (!['metric', 'imperial'].includes(unitSystem)) throw new RangeError('Choose metric or imperial units.');
  const weightKg = unitSystem === 'metric' ? weight : weight * KG_PER_LB;
  if (weightKg < 20 || weightKg > 350) throw new RangeError('Weight must be from 20 to 350 kg (44 to 772 lb).');
  let leanKg;
  let formula;
  if (method === 'body-fat') {
    if (!Number.isFinite(bodyFatPercent) || bodyFatPercent < 0 || bodyFatPercent > 75) throw new RangeError('Body-fat percentage must be from 0 to 75.');
    leanKg = weightKg * (1 - bodyFatPercent / 100);
    formula = 'body-fat';
  } else if (method === 'boer') {
    if (!Number.isFinite(height) || !['male', 'female'].includes(equation)) throw new RangeError('Enter a valid height and equation set.');
    const heightCm = unitSystem === 'metric' ? height : height * CM_PER_IN;
    if (heightCm < 100 || heightCm > 250) throw new RangeError('Height must be from 100 to 250 cm (39 to 98 in).');
    leanKg = equation === 'male' ? 0.407 * weightKg + 0.267 * heightCm - 19.2 : 0.252 * weightKg + 0.473 * heightCm - 48.3;
    formula = equation === 'male' ? 'boer-male' : 'boer-female';
  } else {
    throw new RangeError('Choose a supported calculation method.');
  }
  if (!Number.isFinite(leanKg) || leanKg <= 0 || leanKg > weightKg) throw new RangeError('This equation produced an implausible result for these inputs. Check them or use a measured body-fat estimate.');
  const factor = unitSystem === 'metric' ? 1 : 1 / KG_PER_LB;
  const unit = unitSystem === 'metric' ? 'kg' : 'lb';
  const leanMass = leanKg * factor;
  const totalWeight = weightKg * factor;
  return Object.freeze({ method, equation, unit, leanMass, fatMass: totalWeight - leanMass, leanPercent: (leanKg / weightKg) * 100, formula });
}
