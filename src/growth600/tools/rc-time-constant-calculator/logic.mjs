const RESISTANCE_TO_OHMS = Object.freeze({ ohm: 1, kohm: 1e3, mohm: 1e6 });
const CAPACITANCE_TO_FARADS = Object.freeze({ F: 1, mF: 1e-3, uF: 1e-6, nF: 1e-9, pF: 1e-12 });
const MAX_VOLTAGE = 1e9;
const MAX_TIME = 1e12;

function finite(value, name, min, max, minExclusive = false) {
  const number = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(number) || number < min || (minExclusive && number === min) || number > max) {
    throw new RangeError(`${name} is outside the supported range.`);
  }
  return Object.is(number, -0) ? 0 : number;
}

export function calculateRcTimeConstant({ resistance, resistanceUnit = 'ohm', capacitance, capacitanceUnit = 'uF' } = {}) {
  const rScale = RESISTANCE_TO_OHMS[resistanceUnit];
  const cScale = CAPACITANCE_TO_FARADS[capacitanceUnit];
  if (!rScale || !cScale) throw new RangeError('Choose supported resistance and capacitance units.');
  const r = finite(resistance, 'Resistance', 0, 1e12, true) * rScale;
  const c = finite(capacitance, 'Capacitance', 0, 1e12, true) * cScale;
  const tauSeconds = r * c;
  if (!Number.isFinite(tauSeconds) || tauSeconds <= 0 || tauSeconds > MAX_TIME) throw new RangeError('The time constant is outside the supported range.');
  return Object.freeze({ resistanceOhms: r, capacitanceFarads: c, tauSeconds, rise10To90Seconds: tauSeconds * Math.log(9), chargeAtTauFraction: 1 - Math.exp(-1), dischargeAtTauFraction: Math.exp(-1) });
}

/** First-order RC response: V(t) = V∞ + (V0 − V∞)e^(−t/RC). */
export function calculateRcTransient({ resistance, resistanceUnit = 'ohm', capacitance, capacitanceUnit = 'uF', initialVoltage = 0, finalVoltage = 0, time, targetVoltage } = {}) {
  const tau = calculateRcTimeConstant({ resistance, resistanceUnit, capacitance, capacitanceUnit });
  const v0 = finite(initialVoltage, 'Initial voltage', -MAX_VOLTAGE, MAX_VOLTAGE);
  const vinf = finite(finalVoltage, 'Final voltage', -MAX_VOLTAGE, MAX_VOLTAGE);
  if (v0 === vinf) throw new RangeError('Initial and final voltages must differ.');
  if (time !== undefined && time !== null && time !== '') {
    const t = finite(time, 'Time', 0, MAX_TIME);
    const voltage = vinf + (v0 - vinf) * Math.exp(-t / tau.tauSeconds);
    return Object.freeze({ ...tau, mode: 'voltage', initialVoltage: v0, finalVoltage: vinf, timeSeconds: t, voltage, ratio: (voltage - vinf) / (v0 - vinf) });
  }
  const target = finite(targetVoltage, 'Target voltage', -MAX_VOLTAGE, MAX_VOLTAGE);
  const ratio = (target - vinf) / (v0 - vinf);
  if (!(ratio > 0 && ratio < 1)) throw new RangeError('The target must lie strictly between the initial and final voltages.');
  const timeSeconds = -tau.tauSeconds * Math.log(ratio);
  if (!Number.isFinite(timeSeconds) || timeSeconds > MAX_TIME) throw new RangeError('The threshold time is outside the supported range.');
  return Object.freeze({ ...tau, mode: 'time', initialVoltage: v0, finalVoltage: vinf, targetVoltage: target, timeSeconds, ratio });
}

export const RC_TIME_MAX_SECONDS = MAX_TIME;
