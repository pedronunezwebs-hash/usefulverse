const integerInRange = (value, min, max, label) => {
  const number = Number(value);
  if (!Number.isInteger(number) || number < min || number > max) {
    throw new RangeError(`${label} must be a whole number from ${min} to ${max}.`);
  }
  return number;
};

export function validateChessClockSettings({ minutes, incrementSeconds = 0 } = {}) {
  return {
    minutes: integerInRange(minutes, 1, 180, 'Starting time'),
    incrementSeconds: integerInRange(incrementSeconds, 0, 60, 'Increment'),
  };
}

export function createChessClock(settings, now = 0) {
  const valid = validateChessClockSettings(settings);
  const startingMs = valid.minutes * 60_000;
  return {
    startingMs,
    incrementMs: valid.incrementSeconds * 1_000,
    whiteMs: startingMs,
    blackMs: startingMs,
    active: null,
    deadline: null,
    running: false,
    flagged: null,
    updatedAt: now,
  };
}

const remainingFor = (clock, color, now) => {
  const stored = clock[`${color}Ms`];
  return clock.running && clock.active === color
    ? Math.max(0, clock.deadline - now)
    : stored;
};

export function getChessClockSnapshot(clock, now = 0) {
  if (!clock) throw new TypeError('A chess clock is required.');
  const whiteMs = remainingFor(clock, 'white', now);
  const blackMs = remainingFor(clock, 'black', now);
  const flagged = clock.flagged ?? (clock.running && (clock.active === 'white' ? whiteMs : blackMs) === 0 ? clock.active : null);
  return { whiteMs, blackMs, active: clock.active, running: clock.running && !flagged, flagged };
}

export function startChessClock(clock, now = 0) {
  if (!clock || clock.flagged) return clock;
  if (clock.running) return clock;
  const active = clock.active ?? 'white';
  const remaining = clock[`${active}Ms`];
  if (remaining <= 0) return { ...clock, active, running: false, flagged: active, deadline: null, updatedAt: now };
  return { ...clock, active, running: true, deadline: now + remaining, updatedAt: now };
}

export function pauseChessClock(clock, now = 0) {
  if (!clock?.running) return clock;
  const remaining = remainingFor(clock, clock.active, now);
  return {
    ...clock,
    [`${clock.active}Ms`]: remaining,
    deadline: null,
    running: false,
    flagged: remaining === 0 ? clock.active : null,
    updatedAt: now,
  };
}

export function switchChessClockPlayer(clock, now = 0) {
  if (!clock?.running || clock.flagged) return clock;
  const remaining = remainingFor(clock, clock.active, now);
  if (remaining <= 0) {
    return { ...clock, [`${clock.active}Ms`]: 0, deadline: null, running: false, flagged: clock.active, updatedAt: now };
  }
  const completedMove = clock.active;
  const active = completedMove === 'white' ? 'black' : 'white';
  const nextTime = remainingFor(clock, active, now);
  return {
    ...clock,
    [`${completedMove}Ms`]: remaining + clock.incrementMs,
    active,
    deadline: now + nextTime,
    updatedAt: now,
  };
}

export function resetChessClock(clock, now = 0) {
  if (!clock) throw new TypeError('A chess clock is required.');
  return {
    ...clock,
    whiteMs: clock.startingMs,
    blackMs: clock.startingMs,
    active: null,
    deadline: null,
    running: false,
    flagged: null,
    updatedAt: now,
  };
}
