const ENERGY_PER_UNIT = Object.freeze({ kg: 7700, lb: 3500 });

function finiteNumber(value, field, { zero = false } = {}) {
  const number = Number(value);
  if (!Number.isFinite(number) || (zero ? number < 0 : number <= 0)) {
    throw new RangeError(`${field} must be ${zero ? 'zero or greater' : 'greater than zero'}.`);
  }
  return number;
}

export function estimateLinearWeightLossScenario({ currentWeight, targetWeight, dailyDeficit, unit = 'kg' }) {
  const current = finiteNumber(currentWeight, 'Current weight');
  const target = finiteNumber(targetWeight, 'Target weight');
  const deficit = finiteNumber(dailyDeficit, 'Daily deficit', { zero: true });
  if (!Object.hasOwn(ENERGY_PER_UNIT, unit)) throw new RangeError('Choose kilograms or pounds.');
  if (target > current) throw new RangeError('The target weight must be below the current weight.');

  const amountToLose = current - target;
  const energyEquivalentKcal = amountToLose * ENERGY_PER_UNIT[unit];
  const estimatedDays = deficit === 0 ? null : energyEquivalentKcal / deficit;
  const estimatedWeeks = estimatedDays === null ? null : estimatedDays / 7;
  const weeklyRate = deficit === 0 || amountToLose === 0 ? 0 : amountToLose / estimatedWeeks;
  const gradualReference = unit === 'kg' ? 0.90718474 : 2;
  const paceAboveReference = weeklyRate > gradualReference;

  if (!Number.isFinite(energyEquivalentKcal) || (estimatedDays !== null && !Number.isFinite(estimatedDays))) {
    throw new RangeError('The scenario is too large to calculate.');
  }
  return { unit, amountToLose, energyEquivalentKcal, dailyDeficit: deficit, estimatedDays, estimatedWeeks, weeklyRate, paceAboveReference };
}
