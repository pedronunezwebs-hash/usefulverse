const RESISTIVITY_OHM_MM2_PER_M = Object.freeze({ copper: 0.01724, aluminum: 0.02806 });

function bounded(name, value, min, max) {
  if (!Number.isFinite(value) || value < min || value > max) throw new RangeError(`${name} is outside its allowed range.`);
  return value;
}

/** Resistive-only estimate using 20 °C material resistivity; not conductor sizing. */
export function calculateVoltageDrop({ material = 'copper', oneWayLengthM, currentA, crossSectionMm2, supplyVoltageV, circuit = 'single-phase', powerFactor = 1 } = {}) {
  const resistivity = RESISTIVITY_OHM_MM2_PER_M[material];
  if (!resistivity) throw new TypeError('Choose copper or aluminum.');
  if (!['dc', 'single-phase', 'three-phase'].includes(circuit)) throw new TypeError('Choose DC, single-phase, or three-phase.');
  const length = bounded('One-way length', oneWayLengthM, 0, 1_000_000);
  const current = bounded('Current', currentA, 0, 1_000_000);
  const section = bounded('Cross-sectional area', crossSectionMm2, 0.0001, 1_000_000);
  const supply = bounded('Supply voltage', supplyVoltageV, 0.001, 10_000_000);
  const pf = circuit === 'dc' ? 1 : bounded('Power factor', powerFactor, 0, 1);
  const pathFactor = circuit === 'three-phase' ? Math.sqrt(3) : 2;
  const resistanceOhmPerConductor = resistivity / section;
  const voltageDropV = pathFactor * current * length * resistanceOhmPerConductor * pf;
  const voltageDropPercent = voltageDropV / supply * 100;
  return Object.freeze({
    material, circuit, oneWayLengthM: length, currentA: current, crossSectionMm2: section,
    supplyVoltageV: supply, powerFactor: pf, resistanceOhmPerConductor,
    voltageDropV, voltageDropPercent, estimatedReceivingVoltageV: supply - voltageDropV,
  });
}
