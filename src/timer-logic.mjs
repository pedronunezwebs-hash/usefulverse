export const DEFAULT_POMODORO_SETTINGS = Object.freeze({
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakEvery: 4,
  autoStart: false,
  sound: true,
  volume: 35,
});

export function normalizePomodoroSettings(value = {}) {
  const integer = (candidate, fallback, min, max) => {
    const parsed = Number(candidate);
    return Number.isInteger(parsed) && parsed >= min && parsed <= max ? parsed : fallback;
  };
  return {
    focusMinutes: integer(value.focusMinutes, DEFAULT_POMODORO_SETTINGS.focusMinutes, 1, 180),
    shortBreakMinutes: integer(value.shortBreakMinutes, DEFAULT_POMODORO_SETTINGS.shortBreakMinutes, 1, 60),
    longBreakMinutes: integer(value.longBreakMinutes, DEFAULT_POMODORO_SETTINGS.longBreakMinutes, 1, 120),
    longBreakEvery: integer(value.longBreakEvery, DEFAULT_POMODORO_SETTINGS.longBreakEvery, 2, 12),
    autoStart: value.autoStart === true,
    sound: value.sound !== false,
    volume: integer(value.volume, DEFAULT_POMODORO_SETTINGS.volume, 0, 100),
  };
}

export function nextPomodoroPhase(phase, completedFocusSessions, longBreakEvery = 4) {
  if (phase === 'focus') {
    const completed = Number(completedFocusSessions);
    const interval = Number(longBreakEvery);
    if (!Number.isInteger(completed) || completed < 1 || !Number.isInteger(interval) || interval < 2) {
      throw new RangeError('Use a completed focus-session count of at least 1 and a long-break interval of at least 2.');
    }
    return completed % interval === 0 ? 'long-break' : 'short-break';
  }
  if (phase === 'short-break' || phase === 'long-break') return 'focus';
  throw new TypeError('Choose a valid Pomodoro phase.');
}

export function remainingUntil(deadline, now = Date.now()) {
  const end = Number(deadline);
  const current = Number(now);
  if (!Number.isFinite(end) || !Number.isFinite(current)) throw new TypeError('Timer timestamps must be finite numbers.');
  return Math.max(0, end - current);
}
