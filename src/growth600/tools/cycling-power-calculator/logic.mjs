const GRAVITY = 9.80665;
const LB_TO_KG = 0.45359237;
const MPH_TO_MPS = 0.44704;
const KG_TO_LB = 1 / LB_TO_KG;
const KMH_TO_MPH = 1 / 1.609344;

export function convertCyclingUnits({ mass, speed, headwind, from, to } = {}) {
  if (!['metric', 'imperial'].includes(from) || !['metric', 'imperial'].includes(to)) {
    throw new RangeError('Choose metric or imperial units.');
  }
  if (from === to) return Object.freeze({ mass, speed, headwind });
  const factor = from === 'metric' ? { mass: KG_TO_LB, speed: KMH_TO_MPH } : { mass: LB_TO_KG, speed: 1 / KMH_TO_MPH };
  return Object.freeze({
    mass: Number.isFinite(mass) ? mass * factor.mass : mass,
    speed: Number.isFinite(speed) ? speed * factor.speed : speed,
    headwind: Number.isFinite(headwind) ? headwind * factor.speed : headwind,
  });
}

function bounded(name, value, min, max) {
  if (!Number.isFinite(value) || value < min || value > max) throw new RangeError(`${name} is outside its allowed range.`);
  return value;
}

export function calculateCyclingPower({
  mass, speed, gradientPercent = 0, headwind = 0, rollingResistance = 0.004,
  dragArea = 0.32, airDensity = 1.225, drivetrainEfficiency = 97,
  unitSystem = 'metric',
} = {}) {
  if (!['metric', 'imperial'].includes(unitSystem)) throw new RangeError('Choose metric or imperial units.');
  bounded('Rider and bicycle mass', mass, unitSystem === 'metric' ? 20 : 44.1, unitSystem === 'metric' ? 250 : 551.2);
  bounded('Ground speed', speed, 0.1, unitSystem === 'metric' ? 100 : 62.2);
  bounded('Gradient', gradientPercent, -30, 30);
  bounded('Headwind', headwind, unitSystem === 'metric' ? -100 : -62.2, unitSystem === 'metric' ? 100 : 62.2);
  bounded('Rolling resistance coefficient', rollingResistance, 0, 0.05);
  bounded('Drag area', dragArea, 0.05, 1.5);
  bounded('Air density', airDensity, 0.5, 1.5);
  bounded('Drivetrain efficiency', drivetrainEfficiency, 50, 100);

  const massKg = unitSystem === 'metric' ? mass : mass * LB_TO_KG;
  const speedMps = unitSystem === 'metric' ? speed / 3.6 : speed * MPH_TO_MPS;
  const windMps = unitSystem === 'metric' ? headwind / 3.6 : headwind * MPH_TO_MPS;
  const relativeAirSpeed = speedMps + windMps;
  const aeroForceN = 0.5 * airDensity * dragArea * relativeAirSpeed * Math.abs(relativeAirSpeed);
  const aeroWatts = aeroForceN * speedMps;
  const rollingWatts = massKg * GRAVITY * rollingResistance * speedMps;
  const climbingWatts = massKg * GRAVITY * (gradientPercent / 100) * speedMps;
  const wheelWatts = Math.max(0, aeroWatts + rollingWatts + climbingWatts);
  const riderWatts = wheelWatts / (drivetrainEfficiency / 100);
  const wattsPerKg = riderWatts / massKg;
  if (![aeroWatts, rollingWatts, climbingWatts, riderWatts, wattsPerKg].every(Number.isFinite)) throw new RangeError('The requested estimate is too large.');

  return Object.freeze({
    riderWatts, wattsPerKg, aeroWatts, rollingWatts, climbingWatts, wheelWatts,
    massKg, speedMps, relativeAirSpeed, unitSystem,
  });
}
