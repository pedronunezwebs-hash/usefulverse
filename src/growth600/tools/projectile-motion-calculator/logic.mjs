const SPEED_TO_MPS = Object.freeze({ 'm/s': 1, 'km/h': 1 / 3.6, mph: 0.44704 });
const LENGTH_TO_METERS = Object.freeze({ m: 1, ft: 0.3048 });

function finiteInRange(value, name, min, max) {
  const number = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(number) || number < min || number > max) throw new RangeError(`${name} must be between ${min} and ${max}.`);
  return number;
}

export function calculateProjectileMotion({ speed = 20, speedUnit = 'm/s', angleDegrees = 45, initialHeight = 0, lengthUnit = 'm', gravity = 9.80665 } = {}) {
  const launchSpeed = finiteInRange(speed, 'Launch speed', 0, 10000);
  const angle = finiteInRange(angleDegrees, 'Launch angle', 0, 90);
  const height = finiteInRange(initialHeight, 'Initial height', 0, 1e6);
  const acceleration = finiteInRange(gravity, 'Gravity', 1e-6, 100);
  if (!Object.hasOwn(SPEED_TO_MPS, speedUnit)) throw new TypeError('Choose a supported speed unit.');
  if (!Object.hasOwn(LENGTH_TO_METERS, lengthUnit)) throw new TypeError('Choose a supported length unit.');

  const v0 = launchSpeed * SPEED_TO_MPS[speedUnit];
  const heightM = height * LENGTH_TO_METERS[lengthUnit];
  const angleRad = angle * Math.PI / 180;
  const vx = v0 * Math.cos(angleRad);
  const vy = v0 * Math.sin(angleRad);
  const timeOfFlight = (vy + Math.sqrt(vy ** 2 + 2 * acceleration * heightM)) / acceleration;
  const rangeM = vx * timeOfFlight;
  const apexTime = vy / acceleration;
  const maxHeightM = heightM + vy ** 2 / (2 * acceleration);
  const impactVerticalVelocity = vy - acceleration * timeOfFlight;
  const impactSpeedMps = Math.hypot(vx, impactVerticalVelocity);
  const lengthScale = 1 / LENGTH_TO_METERS[lengthUnit];
  const range = Math.abs(rangeM) < 1e-12 ? 0 : rangeM * lengthScale;
  const xVelocityMps = Math.abs(vx) < 1e-12 ? 0 : vx;

  return Object.freeze({
    speed: launchSpeed, speedUnit, angleDegrees: angle, initialHeight: height, lengthUnit, gravity: acceleration,
    initialSpeedMps: v0, horizontalVelocityMps: xVelocityMps, verticalVelocityMps: vy,
    timeOfFlight, range, rangeM, maxHeight: maxHeightM * lengthScale, maxHeightM,
    apexTime, impactSpeedMps, impactSpeed: impactSpeedMps / SPEED_TO_MPS[speedUnit],
    impactVerticalVelocityMps: impactVerticalVelocity,
  });
}

export function projectilePositionAt(result, timeSeconds) {
  const time = finiteInRange(timeSeconds, 'Time', 0, result.timeOfFlight);
  const xM = result.horizontalVelocityMps * time;
  const yM = result.initialHeight * LENGTH_TO_METERS[result.lengthUnit] + result.verticalVelocityMps * time - 0.5 * result.gravity * time ** 2;
  const height = yM / LENGTH_TO_METERS[result.lengthUnit];
  return Object.freeze({ x: xM / LENGTH_TO_METERS[result.lengthUnit], y: Math.abs(height) < 1e-12 ? 0 : Math.max(0, height), time });
}

export function sampleProjectilePath(result, sampleCount = 41) {
  const count = finiteInRange(sampleCount, 'Sample count', 2, 201);
  if (!Number.isInteger(count)) throw new RangeError('Sample count must be an integer.');
  return Object.freeze(Array.from({ length: count }, (_, index) => projectilePositionAt(result, result.timeOfFlight * index / (count - 1))));
}
