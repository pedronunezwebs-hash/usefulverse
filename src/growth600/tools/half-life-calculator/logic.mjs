const MAX_INPUT = 1e100;
const MIN_INPUT = Number.MIN_VALUE;

function positiveFinite(value, name, { allowZero = false } = {}) {
  const number = Number(value);
  if (!Number.isFinite(number) || number > MAX_INPUT || number < (allowZero ? 0 : MIN_INPUT)) {
    throw new RangeError(`${name} must be ${allowZero ? 'a non-negative' : 'a positive'} finite number no greater than 1e100.`);
  }
  return number;
}

export function calculateHalfLife({ mode, initialAmount, remainingAmount, halfLife, elapsedTime }) {
  if (!['remaining', 'initial', 'elapsed', 'halfLife'].includes(mode)) throw new TypeError('Choose a supported value to solve.');
  const values = {
    initial: mode === 'initial' ? null : positiveFinite(initialAmount, 'Initial amount'),
    remaining: mode === 'remaining' ? null : positiveFinite(remainingAmount, 'Remaining amount'),
    halfLife: mode === 'halfLife' ? null : positiveFinite(halfLife, 'Half-life'),
    elapsed: mode === 'elapsed' ? null : positiveFinite(elapsedTime, 'Elapsed time', { allowZero: true }),
  };

  if (mode === 'remaining') {
    const logRemaining = Math.log(values.initial) - (Math.LN2 * values.elapsed) / values.halfLife;
    values.remaining = Math.exp(logRemaining);
    if (!Number.isFinite(values.remaining) || values.remaining === 0 || values.remaining > MAX_INPUT) throw new RangeError('The remaining amount is outside the supported numeric range.');
  } else if (mode === 'initial') {
    if (values.remaining > MAX_INPUT) throw new RangeError('The remaining amount is outside the supported numeric range.');
    const logInitial = Math.log(values.remaining) + (Math.LN2 * values.elapsed) / values.halfLife;
    values.initial = Math.exp(logInitial);
    if (!Number.isFinite(values.initial) || values.initial === 0 || values.initial > MAX_INPUT) throw new RangeError('The initial amount is outside the supported numeric range.');
  } else if (mode === 'elapsed') {
    if (values.remaining > values.initial) throw new RangeError('Remaining amount cannot exceed the initial amount for decay.');
    values.elapsed = values.remaining === values.initial ? 0 : (values.halfLife * (Math.log(values.initial) - Math.log(values.remaining))) / Math.LN2;
    if (!Number.isFinite(values.elapsed) || values.elapsed > MAX_INPUT) throw new RangeError('Elapsed time is outside the supported numeric range.');
  } else {
    if (values.remaining >= values.initial) throw new RangeError('To solve for half-life, remaining amount must be below the initial amount and elapsed time must be positive.');
    if (values.elapsed === 0) throw new RangeError('Elapsed time must be positive to solve for half-life.');
    values.halfLife = (values.elapsed * Math.LN2) / (Math.log(values.initial) - Math.log(values.remaining));
    if (!Number.isFinite(values.halfLife) || values.halfLife <= 0 || values.halfLife > MAX_INPUT) throw new RangeError('Half-life is outside the supported numeric range.');
  }

  const remainingPercent = (values.remaining / values.initial) * 100;
  const halfLivesElapsed = values.elapsed / values.halfLife;
  if (!Number.isFinite(remainingPercent) || !Number.isFinite(halfLivesElapsed)) throw new RangeError('The result is outside the supported numeric range.');
  return Object.freeze({
    mode,
    initialAmount: values.initial,
    remainingAmount: values.remaining,
    halfLife: values.halfLife,
    elapsedTime: values.elapsed,
    remainingPercent,
    halfLivesElapsed,
  });
}
