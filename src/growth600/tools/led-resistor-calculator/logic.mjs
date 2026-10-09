const SERIES_VALUES = Object.freeze({
  E12: Object.freeze([1, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2]),
  E24: Object.freeze([1, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2, 2.2, 2.4, 2.7, 3, 3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1]),
});
const POWER_RATINGS_W = Object.freeze([0.125, 0.25, 0.5, 1, 2, 3, 5, 10, 25, 50, 100]);

function positive(value, name, { allowZero = false, max = 1e12 } = {}) {
  if (value === '' || value === null || value === undefined) throw new RangeError(`${name} is required.`);
  const number = Number(value);
  if (!Number.isFinite(number) || number > max || (allowZero ? number < 0 : number <= 0)) {
    throw new RangeError(`${name} is outside the supported range.`);
  }
  return number;
}

function nextStandardResistance(requiredOhms, series) {
  const values = SERIES_VALUES[series];
  if (!values) throw new TypeError('Choose E12 or E24 values.');
  const exponent = Math.floor(Math.log10(requiredOhms));
  const scale = 10 ** exponent;
  const mantissa = requiredOhms / scale;
  const rounded = values.find((value) => value + Number.EPSILON * 8 >= mantissa);
  return rounded === undefined ? 10 * scale : rounded * scale;
}

export function calculateLedResistor({ supplyVoltage, forwardVoltage, ledCount = 1, targetCurrentMa, series = 'E12' } = {}) {
  const supplyV = positive(supplyVoltage, 'Supply voltage', { max: 1e6 });
  const forwardV = positive(forwardVoltage, 'LED forward voltage', { max: 1e6 });
  const count = Number(ledCount);
  if (!Number.isInteger(count) || count < 1 || count > 100) throw new RangeError('Use 1 to 100 series LEDs.');
  const currentMa = positive(targetCurrentMa, 'Target current', { max: 1e6 });
  const totalLedVoltageV = forwardV * count;
  const resistorVoltageV = supplyV - totalLedVoltageV;
  if (!Number.isFinite(totalLedVoltageV) || resistorVoltageV <= 0) {
    throw new RangeError('Supply voltage must be greater than the combined LED forward voltage.');
  }

  const targetCurrentA = currentMa / 1000;
  const requiredResistanceOhms = resistorVoltageV / targetCurrentA;
  if (!Number.isFinite(requiredResistanceOhms) || requiredResistanceOhms <= 0 || requiredResistanceOhms > 1e12) {
    throw new RangeError('The required resistor is outside the supported range.');
  }
  const resistorOhms = nextStandardResistance(requiredResistanceOhms, series);
  const actualCurrentA = resistorVoltageV / resistorOhms;
  const resistorPowerW = resistorVoltageV * actualCurrentA;
  const minimumPowerRatingW = POWER_RATINGS_W.find((rating) => rating >= resistorPowerW * 2) ?? null;
  if (![resistorOhms, actualCurrentA, resistorPowerW].every(Number.isFinite)) {
    throw new RangeError('The result is outside the supported calculation range.');
  }

  return Object.freeze({
    supplyVoltage: supplyV,
    forwardVoltage: forwardV,
    ledCount: count,
    totalLedVoltage: totalLedVoltageV,
    resistorVoltage: resistorVoltageV,
    targetCurrentMa: currentMa,
    requiredResistanceOhms,
    standardSeries: series,
    resistorOhms,
    actualCurrentMa: actualCurrentA * 1000,
    resistorPowerW,
    minimumPowerRatingW,
  });
}
