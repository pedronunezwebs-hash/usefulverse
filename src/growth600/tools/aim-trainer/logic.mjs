export const AIM_TRAINER_DEFAULTS = Object.freeze({ durationSeconds: 30, targetDiameter: 64 });
export const AIM_TRAINER_DURATIONS = Object.freeze([15, 30, 60]);
export const AIM_TRAINER_TARGET_DIAMETERS = Object.freeze({ large: 88, regular: 64, small: 44 });

function finitePositive(value, name) {
  if (!Number.isFinite(value) || value <= 0) throw new RangeError(`${name} must be a positive finite number.`);
}

export function placeAimTarget({ width, height, diameter, random = Math.random } = {}) {
  finitePositive(width, 'width'); finitePositive(height, 'height'); finitePositive(diameter, 'diameter');
  if (typeof random !== 'function') throw new TypeError('A random-number function is required.');
  const xRandom = random(); const yRandom = random();
  if (![xRandom, yRandom].every((value) => Number.isFinite(value) && value >= 0 && value < 1)) throw new RangeError('The random source must return values from 0 inclusive to 1 exclusive.');
  const radius = Math.min(diameter / 2, width / 2, height / 2);
  const left = width >= radius * 2 ? radius : width / 2;
  const right = width >= radius * 2 ? width - radius : width / 2;
  const top = height >= radius * 2 ? radius : height / 2;
  const bottom = height >= radius * 2 ? height - radius : height / 2;
  return Object.freeze({ x: left + xRandom * (right - left), y: top + yRandom * (bottom - top), radius });
}

export function createAimSession({ durationSeconds = AIM_TRAINER_DEFAULTS.durationSeconds, diameter = AIM_TRAINER_DEFAULTS.targetDiameter } = {}) {
  if (!AIM_TRAINER_DURATIONS.includes(durationSeconds)) throw new RangeError('Choose a 15, 30 or 60 second round.');
  if (!Object.values(AIM_TRAINER_TARGET_DIAMETERS).includes(diameter)) throw new RangeError('Choose one of the supported target sizes.');
  return Object.freeze({ durationSeconds, diameter, hits: 0, misses: 0, status: 'ready' });
}

export function recordAimAttempt(session, hit) {
  if (!session || !['ready', 'running'].includes(session.status)) return session;
  if (typeof hit !== 'boolean') throw new TypeError('An aim attempt must be marked hit or miss.');
  return Object.freeze({ ...session, hits: session.hits + Number(hit), misses: session.misses + Number(!hit), status: 'running' });
}

export function finishAimSession(session) {
  if (!session || !['ready', 'running'].includes(session.status)) return session;
  return Object.freeze({ ...session, status: 'finished' });
}

export function getAimAccuracy(session) {
  if (!session || !Number.isInteger(session.hits) || !Number.isInteger(session.misses)) throw new TypeError('Invalid aim session.');
  const attempts = session.hits + session.misses;
  return attempts ? Math.round(session.hits / attempts * 10_000) / 100 : 0;
}
