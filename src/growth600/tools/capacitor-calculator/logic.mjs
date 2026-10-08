const UNIT_TO_FARADS = Object.freeze({ F: 1, mF: 1e-3, uF: 1e-6, nF: 1e-9, pF: 1e-12 });
const MAX_CAPACITORS = 20;

function finiteRange(value, name, min, max, allowZero = false) {
  const number = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(number) || number < (allowZero ? 0 : min) || number > max) {
    throw new RangeError(`${name} is outside the supported range.`);
  }
  return number;
}

export function parseCapacitanceLines(text, parseNumber = Number) {
  const lines = String(text ?? '').split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
  if (lines.length < 1 || lines.length > MAX_CAPACITORS) throw new RangeError(`Enter 1 to ${MAX_CAPACITORS} capacitance values.`);
  return lines.map((line) => {
    const value = parseNumber(line);
    return finiteRange(value, 'Capacitance', 1e-12, 1e12);
  });
}

export function calculateCapacitorNetwork({ values, unit = 'uF', connection = 'parallel', voltage } = {}) {
  if (!Array.isArray(values) || values.length < 1 || values.length > MAX_CAPACITORS) throw new RangeError(`Enter 1 to ${MAX_CAPACITORS} capacitors.`);
  const multiplier = UNIT_TO_FARADS[unit];
  if (!multiplier) throw new RangeError('Choose a supported capacitance unit.');
  if (connection !== 'series' && connection !== 'parallel') throw new RangeError('Choose series or parallel connection.');
  const capacitances = values.map((value) => finiteRange(value, 'Capacitance', 1e-12, 1e12) * multiplier);
  const equivalentFarads = connection === 'parallel'
    ? capacitances.reduce((sum, value) => sum + value, 0)
    : 1 / capacitances.reduce((sum, value) => sum + 1 / value, 0);
  if (!Number.isFinite(equivalentFarads) || equivalentFarads <= 0) throw new RangeError('The equivalent capacitance is outside the supported range.');
  const result = { connection, unit, capacitancesFarads: capacitances, equivalentFarads };
  if (voltage !== undefined && voltage !== null && voltage !== '') {
    const volts = finiteRange(voltage, 'Voltage', 0, 1e9, true);
    const chargeCoulombs = equivalentFarads * volts;
    const energyJoules = 0.5 * equivalentFarads * volts ** 2;
    if (![chargeCoulombs, energyJoules].every(Number.isFinite)) throw new RangeError('The result is outside the supported range.');
    result.voltageVolts = volts;
    result.chargeCoulombs = chargeCoulombs;
    result.energyJoules = energyJoules;
    result.components = capacitances.map((capacitance) => connection === 'parallel'
      ? { voltageVolts: volts, chargeCoulombs: capacitance * volts }
      : { voltageVolts: chargeCoulombs / capacitance, chargeCoulombs });
  }
  return Object.freeze(result);
}

export const CAPACITOR_MAX_INPUTS = MAX_CAPACITORS;
