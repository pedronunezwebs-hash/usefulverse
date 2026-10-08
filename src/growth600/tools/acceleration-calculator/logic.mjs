const MAX_INPUT = 1e9;
const MAX_RESULT = 1e18;
const UNIT_SCALE = Object.freeze({ metric: 1, imperial: 0.3048 });
const MODES = new Set(['acceleration', 'time', 'final-velocity', 'displacement']);

function finite(name, raw, { min = -MAX_INPUT, max = MAX_INPUT } = {}) {
  const value = Number(raw);
  if (!Number.isFinite(value) || value < min || value > max) throw new RangeError(`${name} is outside the supported range.`);
  return value;
}

function checked(name, value) {
  if (!Number.isFinite(value) || Math.abs(value) > MAX_RESULT) throw new RangeError(`${name} is outside the supported range.`);
  return value;
}

export function calculateAcceleration({ mode = 'acceleration', units = 'metric', initialVelocity = 0, finalVelocity = 0, acceleration = 0, timeSeconds = 0, initialPosition = 0 } = {}) {
  if (!MODES.has(mode)) throw new TypeError('Choose a supported value to solve.');
  if (!Object.hasOwn(UNIT_SCALE, units)) throw new TypeError('Choose metric or imperial units.');
  const scale = UNIT_SCALE[units];
  const vi = finite('Initial velocity', initialVelocity) * scale;
  const vfInput = finite('Final velocity', finalVelocity) * scale;
  const aInput = finite('Acceleration', acceleration) * scale;
  const timeInput = finite('Time', timeSeconds);
  const positionInput = finite('Initial position', initialPosition) * scale;
  let a, time, vf, displacement;

  if (mode === 'acceleration') {
    if (timeInput <= 0) throw new RangeError('Time must be greater than zero.');
    time = timeInput;
    vf = vfInput;
    a = (vf - vi) / time;
    displacement = vi * time + 0.5 * a * time ** 2;
  } else if (mode === 'time') {
    a = aInput;
    if (a === 0) throw new RangeError('Acceleration must be non-zero to solve time from two velocities.');
    time = (vfInput - vi) / a;
    if (!Number.isFinite(time) || time <= 0) throw new RangeError('The selected velocities and acceleration do not produce a positive time.');
    vf = vfInput;
    displacement = vi * time + 0.5 * a * time ** 2;
  } else {
    if (timeInput <= 0) throw new RangeError('Time must be greater than zero.');
    time = timeInput;
    a = aInput;
    vf = vi + a * time;
    displacement = vi * time + 0.5 * a * time ** 2;
  }

  const finalPosition = positionInput + displacement;
  for (const [name, value] of Object.entries({ acceleration: a, time, finalVelocity: vf, displacement, finalPosition })) checked(name, value);
  return Object.freeze({ mode, units, acceleration: a / scale, timeSeconds: time, initialVelocity: vi / scale, finalVelocity: vf / scale, initialPosition: positionInput / scale, displacement: displacement / scale, finalPosition: finalPosition / scale });
}
