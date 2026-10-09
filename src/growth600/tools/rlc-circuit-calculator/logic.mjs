const inductanceScale = Object.freeze({ H: 1, mH: 1e-3, uH: 1e-6 });
const capacitanceScale = Object.freeze({ F: 1, uF: 1e-6, nF: 1e-9, pF: 1e-12 });
const frequencyScale = Object.freeze({ Hz: 1, kHz: 1e3 });

function positive(value, name, maximum = 1e15) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0 || number > maximum) throw new RangeError(`Enter a positive ${name} within the supported range.`);
  return number;
}

function scaled(value, unit, factors, name) {
  if (!(unit in factors)) throw new RangeError(`Choose a supported ${name} unit.`);
  return positive(value, name) * factors[unit];
}

function impedanceAt(mode, resistance, inductance, capacitance, frequencyHz) {
  const omega = 2 * Math.PI * frequencyHz;
  const xL = omega * inductance;
  const xC = 1 / (omega * capacitance);
  if (mode === 'series') {
    const real = resistance;
    const rawImaginary = xL - xC;
    const imaginary = Math.abs(rawImaginary) <= resistance * 1e-8 ? 0 : rawImaginary;
    return { xL, xC, real, imaginary, magnitude: Math.hypot(real, imaginary), phase: Math.atan2(imaginary, real) * 180 / Math.PI };
  }
  const conductance = 1 / resistance;
  const susceptance = 1 / xC - 1 / xL;
  const admittanceSquared = conductance ** 2 + susceptance ** 2;
  const real = conductance / admittanceSquared;
  const rawImaginary = -susceptance / admittanceSquared;
  const imaginary = Math.abs(rawImaginary) <= Math.abs(real) * 1e-8 ? 0 : rawImaginary;
  return { xL, xC, real, imaginary, magnitude: 1 / Math.sqrt(admittanceSquared), phase: Math.atan2(imaginary, real) * 180 / Math.PI };
}

export function calculateRlcCircuit(input) {
  const mode = String(input.mode ?? 'series');
  if (!['series', 'parallel'].includes(mode)) throw new RangeError('Choose series or parallel RLC mode.');
  const resistance = positive(input.resistance, 'resistance', 1e12);
  const inductance = scaled(input.inductance, input.inductanceUnit ?? 'mH', inductanceScale, 'inductance');
  const capacitance = scaled(input.capacitance, input.capacitanceUnit ?? 'uF', capacitanceScale, 'capacitance');
  const frequencyUnit = input.frequencyUnit ?? 'Hz';
  if (!(frequencyUnit in frequencyScale)) throw new RangeError('Choose a supported frequency unit.');
  const frequency = positive(input.frequency, 'frequency', 1e12) * frequencyScale[frequencyUnit];
  const voltage = Number(input.voltage ?? 0);
  if (!Number.isFinite(voltage) || voltage < 0 || voltage > 1e9) throw new RangeError('Enter a non-negative RMS voltage within the supported range.');

  const resonanceHz = 1 / (2 * Math.PI * Math.sqrt(inductance * capacitance));
  const q = mode === 'series'
    ? (2 * Math.PI * resonanceHz * inductance) / resistance
    : resistance / (2 * Math.PI * resonanceHz * inductance);
  const bandwidthHz = mode === 'series'
    ? resistance / (2 * Math.PI * inductance)
    : 1 / (2 * Math.PI * resistance * capacitance);
  const operating = impedanceAt(mode, resistance, inductance, capacitance, frequency);
  const currentA = voltage / operating.magnitude;
  if (![resonanceHz, q, bandwidthHz, ...Object.values(operating), currentA].every(Number.isFinite)) throw new RangeError('These values exceed the calculator’s supported numeric range.');
  const sweep = Array.from({ length: 61 }, (_, index) => {
    const frequencyHz = resonanceHz * 10 ** (-1 + index / 30);
    const impedance = impedanceAt(mode, resistance, inductance, capacitance, frequencyHz).magnitude;
    if (!Number.isFinite(impedance)) throw new RangeError('The frequency sweep exceeds the supported numeric range.');
    return { frequencyHz, impedanceOhms: impedance };
  });
  return { mode, resistanceOhms: resistance, inductanceH: inductance, capacitanceF: capacitance, frequencyHz: frequency, voltageRmsV: voltage, resonanceHz, q, bandwidthHz, xLOhms: operating.xL, xCOhms: operating.xC, impedanceRealOhms: operating.real, impedanceImaginaryOhms: operating.imaginary, impedanceMagnitudeOhms: operating.magnitude, impedancePhaseDegrees: operating.phase, currentRmsA: currentA, sweep };
}
