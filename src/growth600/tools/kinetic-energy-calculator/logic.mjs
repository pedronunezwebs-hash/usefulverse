const MAX_INPUT = 1e12;
const MAX_ENERGY = 1e24;

function bounded(name, raw, { min = 0, max = MAX_INPUT } = {}) {
  const value = Number(raw);
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new RangeError(`${name} must be between ${min} and ${max}.`);
  }
  return value;
}

function checkedEnergy(value, name) {
  if (!Number.isFinite(value) || Math.abs(value) > MAX_ENERGY) throw new RangeError(`${name} is outside the supported range.`);
  return value;
}

export function calculateKineticEnergy({ mode = 'energy', massKg, velocityMps = 0, kineticEnergyJ, heightM = 0, gravityMps2 = 9.80665 } = {}) {
  if (!['energy', 'solve-speed'].includes(mode)) throw new TypeError('Choose energy or solve-speed mode.');
  const mass = bounded('Mass', massKg, { min: Number.MIN_VALUE });
  const height = bounded('Height', heightM, { min: -MAX_INPUT });
  const gravity = bounded('Gravity', gravityMps2, { min: Number.MIN_VALUE, max: 100 });
  let speed;
  let kinetic;
  if (mode === 'energy') {
    speed = bounded('Speed', velocityMps);
    kinetic = checkedEnergy(0.5 * mass * speed ** 2, 'Kinetic energy');
  } else {
    kinetic = bounded('Kinetic energy', kineticEnergyJ);
    speed = Math.sqrt((2 * kinetic) / mass);
    if (!Number.isFinite(speed) || speed > MAX_INPUT) throw new RangeError('Calculated speed is outside the supported range.');
  }
  const potential = checkedEnergy(mass * gravity * height, 'Potential energy');
  const total = checkedEnergy(kinetic + potential, 'Total mechanical energy');
  return Object.freeze({ mode, massKg: mass, velocityMps: speed, kineticEnergyJ: kinetic, heightM: height, gravityMps2: gravity, potentialEnergyJ: potential, totalMechanicalEnergyJ: total });
}
