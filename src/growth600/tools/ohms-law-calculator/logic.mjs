function bounded(name, value, min = 1e-12, max = 1e12) {
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new RangeError(`${name} must be between ${min} and ${max}.`);
  }
  return value;
}

const symbols = Object.freeze({ voltage: 'V', current: 'I', resistance: 'R', power: 'P' });

export function solveOhmsLaw(values = {}) {
  const names = Object.keys(symbols);
  const known = names.filter((name) => values[name] !== undefined && values[name] !== null && values[name] !== '');
  if (known.length !== 2 || Object.keys(values).some((name) => !names.includes(name))) {
    throw new TypeError('Enter exactly two of voltage, current, resistance and power.');
  }
  const input = Object.fromEntries(known.map((name) => [name, bounded(symbols[name], Number(values[name]))]));
  let { voltage: V, current: I, resistance: R, power: P } = input;

  if (V !== undefined && I !== undefined) { R = V / I; P = V * I; }
  else if (V !== undefined && R !== undefined) { I = V / R; P = V * I; }
  else if (V !== undefined && P !== undefined) { I = P / V; R = V / I; }
  else if (I !== undefined && R !== undefined) { V = I * R; P = V * I; }
  else if (I !== undefined && P !== undefined) { V = P / I; R = V / I; }
  else { I = Math.sqrt(P / R); V = I * R; }

  const result = { voltage: V, current: I, resistance: R, power: P };
  for (const [name, value] of Object.entries(result)) {
    if (!Number.isFinite(value) || value <= 0 || value > 1e24) throw new RangeError(`Calculated ${symbols[name]} is outside the supported range.`);
  }
  return Object.freeze(result);
}

export function calculateEquivalentResistance(resistorValues, topology = 'series') {
  if (!['series', 'parallel'].includes(topology)) throw new TypeError('Choose series or parallel topology.');
  if (!Array.isArray(resistorValues) || resistorValues.length < 2 || resistorValues.length > 20) {
    throw new RangeError('Enter from 2 to 20 resistor values.');
  }
  const resistors = resistorValues.map((value, index) => bounded(`Resistor ${index + 1}`, Number(value)));
  const resistance = topology === 'series'
    ? resistors.reduce((sum, value) => sum + value, 0)
    : 1 / resistors.reduce((sum, value) => sum + (1 / value), 0);
  if (!Number.isFinite(resistance) || resistance <= 0) throw new RangeError('Equivalent resistance is outside the supported range.');
  return Object.freeze({ topology, count: resistors.length, resistance });
}
