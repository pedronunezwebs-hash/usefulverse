const ENERGY_TO_WH = Object.freeze({ Wh: 1, kWh: 1000 });

function bounded(name, value, min, max) {
  if (!Number.isFinite(value) || value < min || value > max) throw new RangeError(`${name} is outside its allowed range.`);
  return value;
}

export function calculateBatteryRuntime({ mode = 'energy', capacityEnergy, energyUnit = 'Wh', capacityAh, voltage, loadWatts, depthOfDischargePercent = 100, efficiencyPercent = 100 } = {}) {
  const load = bounded('Load power', loadWatts, 0.001, 100_000_000);
  const depth = bounded('Depth of discharge', depthOfDischargePercent, 0, 100);
  const efficiency = bounded('System efficiency', efficiencyPercent, 0.1, 100);
  let nominalEnergyWh;
  if (mode === 'energy') {
    const factor = ENERGY_TO_WH[energyUnit];
    if (!factor) throw new TypeError('Choose Wh or kWh for battery energy.');
    nominalEnergyWh = bounded('Battery energy', capacityEnergy, 0.001, 1_000_000_000) * factor;
  } else if (mode === 'ah') {
    const ampHours = bounded('Battery capacity', capacityAh, 0.001, 1_000_000_000);
    const volts = bounded('Battery voltage', voltage, 0.01, 1_000_000);
    nominalEnergyWh = ampHours * volts;
  } else {
    throw new TypeError('Choose energy or amp-hour battery capacity mode.');
  }
  const usableEnergyWh = nominalEnergyWh * depth / 100 * efficiency / 100;
  const runtimeHours = usableEnergyWh / load;
  if (![nominalEnergyWh, usableEnergyWh, runtimeHours].every(Number.isFinite)) throw new RangeError('The requested runtime is too large to estimate.');
  return Object.freeze({ mode, energyUnit: mode === 'energy' ? energyUnit : 'Wh', capacityAh: mode === 'ah' ? capacityAh : null, voltage: mode === 'ah' ? voltage : null, loadWatts: load, depthOfDischargePercent: depth, efficiencyPercent: efficiency, nominalEnergyWh, usableEnergyWh, runtimeHours, runtimeDays: runtimeHours / 24 });
}
