const VOLTAGE = Object.freeze({ V: 1, kV: 1000 });
const CURRENT = Object.freeze({ A: 1, kA: 1000 });

function bounded(name, value, min, max) {
  if (!Number.isFinite(value) || value < min || value > max) throw new RangeError(`${name} is outside its allowed range.`);
  return value;
}

/** Balanced sinusoidal AC power estimate; PF is a magnitude and reactive power is reported unsigned. */
export function calculateAcPower({ system = 'three-phase', topology = 'star', lineVoltage, voltageUnit = 'V', lineCurrent, currentUnit = 'A', powerFactor } = {}) {
  if (!['single-phase', 'three-phase'].includes(system)) throw new TypeError('Choose single-phase or three-phase AC.');
  if (system === 'three-phase' && !['star', 'delta'].includes(topology)) throw new TypeError('Choose star or delta connection.');
  const voltageFactor = VOLTAGE[voltageUnit];
  const currentFactor = CURRENT[currentUnit];
  if (!Number.isFinite(voltageFactor) || !Number.isFinite(currentFactor)) throw new TypeError('Choose supported voltage and current units.');
  const voltageV = bounded('Line voltage', lineVoltage, 0.001, 1e9) * voltageFactor;
  const currentA = bounded('Line current', lineCurrent, 0, 1e9) * currentFactor;
  const pf = bounded('Power factor', powerFactor, 0, 1);
  const phaseFactor = system === 'three-phase' ? Math.sqrt(3) : 1;
  const apparentPowerVA = phaseFactor * voltageV * currentA;
  const activePowerW = apparentPowerVA * pf;
  const reactivePowerVar = apparentPowerVA * Math.sqrt(Math.max(0, 1 - pf ** 2));
  const phaseVoltageV = system === 'single-phase' || topology === 'delta' ? voltageV : voltageV / Math.sqrt(3);
  const phaseCurrentA = system === 'single-phase' || topology === 'star' ? currentA : currentA / Math.sqrt(3);
  if (![apparentPowerVA, activePowerW, reactivePowerVar, phaseVoltageV, phaseCurrentA].every(Number.isFinite)) throw new RangeError('Power result is outside the supported range.');
  return Object.freeze({ system, topology: system === 'three-phase' ? topology : null, lineVoltageV: voltageV, lineCurrentA: currentA, phaseVoltageV, phaseCurrentA, powerFactor: pf, apparentPowerVA, activePowerW, reactivePowerVar });
}
