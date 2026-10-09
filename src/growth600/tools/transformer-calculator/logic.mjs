const LIMIT = 1e12;

function positive(name, value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0 || number > LIMIT) {
    throw new RangeError(`${name} must be greater than zero and within the supported range.`);
  }
  return number;
}

export function calculateTransformer({ mode, primaryVoltage, secondaryVoltage, primaryTurns, secondaryTurns, primaryCurrent, efficiencyPercent = 100 }) {
  if (!['ratio', 'voltage', 'current'].includes(mode)) throw new TypeError('Choose voltage, turns ratio or current mode.');
  if (mode === 'ratio') {
    const vp = positive('Primary voltage', primaryVoltage);
    const vs = positive('Secondary voltage', secondaryVoltage);
    return Object.freeze({ mode, primaryVoltage: vp, secondaryVoltage: vs, turnsRatio: vs / vp, direction: vs > vp ? 'step-up' : vs < vp ? 'step-down' : '1:1' });
  }

  const np = positive('Primary turns', primaryTurns);
  const ns = positive('Secondary turns', secondaryTurns);
  const turnsRatio = ns / np;
  if (!Number.isFinite(turnsRatio) || turnsRatio <= 0 || turnsRatio > LIMIT) throw new RangeError('Turns ratio is outside the supported range.');

  if (mode === 'voltage') {
    const vp = positive('Primary voltage', primaryVoltage);
    const vs = vp * turnsRatio;
    if (!Number.isFinite(vs) || vs <= 0 || vs > LIMIT) throw new RangeError('Calculated secondary voltage is outside the supported range.');
    return Object.freeze({ mode, primaryVoltage: vp, secondaryVoltage: vs, primaryTurns: np, secondaryTurns: ns, turnsRatio, direction: turnsRatio > 1 ? 'step-up' : turnsRatio < 1 ? 'step-down' : '1:1' });
  }

  if (mode === 'current') {
    const ip = positive('Primary current', primaryCurrent);
    const efficiency = Number(efficiencyPercent);
    if (!Number.isFinite(efficiency) || efficiency <= 0 || efficiency > 100) throw new RangeError('Efficiency must be greater than 0 and no more than 100 percent.');
    const is = ip / turnsRatio * (efficiency / 100);
    if (!Number.isFinite(is) || is <= 0 || is > LIMIT) throw new RangeError('Calculated secondary current is outside the supported range.');
    return Object.freeze({ mode, primaryCurrent: ip, secondaryCurrent: is, primaryTurns: np, secondaryTurns: ns, turnsRatio, efficiencyPercent: efficiency, direction: turnsRatio > 1 ? 'step-up' : turnsRatio < 1 ? 'step-down' : '1:1' });
  }

  throw new TypeError('Choose voltage, turns ratio or current mode.');
}
