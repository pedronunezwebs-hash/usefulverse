const MAX_RESISTANCE = 1e12;
const MAX_CAPACITANCE = 1e3;
const MAX_TIME_SECONDS = 1e12;

function positive(value, name, maximum) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0 || number > maximum) throw new RangeError(`${name} must be a positive value within the supported range.`);
  return number;
}

function safeTime(value) {
  if (!Number.isFinite(value) || value <= 0 || value > MAX_TIME_SECONDS) throw new RangeError('The timing result is outside the supported range.');
  return value;
}

export function calculate555Astable({ rAOhms, rBOhms, capacitanceFarads } = {}) {
  const rA = positive(rAOhms, 'R_A', MAX_RESISTANCE);
  const rB = positive(rBOhms, 'R_B', MAX_RESISTANCE);
  const capacitance = positive(capacitanceFarads, 'Capacitance', MAX_CAPACITANCE);
  const highSeconds = safeTime(0.693 * (rA + rB) * capacitance);
  const lowSeconds = safeTime(0.693 * rB * capacitance);
  const periodSeconds = safeTime(highSeconds + lowSeconds);
  const frequencyHz = 1 / periodSeconds;
  const waveformDutyPercent = 100 * highSeconds / periodSeconds;
  const dischargeDutyPercent = 100 * lowSeconds / periodSeconds;
  if (![frequencyHz, waveformDutyPercent, dischargeDutyPercent].every(Number.isFinite)) throw new RangeError('The result is outside the supported range.');
  return Object.freeze({ mode: 'astable', highSeconds, lowSeconds, periodSeconds, frequencyHz, waveformDutyPercent, dischargeDutyPercent, aboveTypicalNe555Frequency: frequencyHz > 100_000 });
}

export function calculate555Monostable({ resistanceOhms, capacitanceFarads } = {}) {
  const resistance = positive(resistanceOhms, 'R', MAX_RESISTANCE);
  const capacitance = positive(capacitanceFarads, 'Capacitance', MAX_CAPACITANCE);
  const pulseSeconds = safeTime(1.1 * resistance * capacitance);
  return Object.freeze({ mode: 'monostable', pulseSeconds });
}

export const TIMER_555_LIMITS = Object.freeze({ maxResistanceOhms: MAX_RESISTANCE, maxCapacitanceFarads: MAX_CAPACITANCE, maxTimeSeconds: MAX_TIME_SECONDS });
