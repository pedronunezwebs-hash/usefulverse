const MAX_WORK_SECONDS = 7_200;
const MAX_REST_SECONDS = 3_600;
const MAX_PREP_SECONDS = 300;
const MAX_ROUNDS = 99;

function integerInRange(value, name, min, max) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < min || number > max) {
    throw new RangeError(`${name} must be an integer from ${min} to ${max}.`);
  }
  return number;
}

export function normalizeIntervalConfig({ workSeconds, restSeconds, rounds, prepSeconds = 0 } = {}) {
  const work = integerInRange(workSeconds, 'Work interval', 1, MAX_WORK_SECONDS);
  const rest = integerInRange(restSeconds, 'Rest interval', 0, MAX_REST_SECONDS);
  const count = integerInRange(rounds, 'Rounds', 1, MAX_ROUNDS);
  const prep = integerInRange(prepSeconds, 'Preparation interval', 0, MAX_PREP_SECONDS);
  const totalSeconds = prep + count * work + Math.max(0, count - 1) * rest;
  return Object.freeze({ workSeconds: work, restSeconds: rest, rounds: count, prepSeconds: prep, totalSeconds });
}

export function intervalPhaseAt(config, elapsedSeconds) {
  const safe = normalizeIntervalConfig(config);
  const elapsed = Number(elapsedSeconds);
  if (!Number.isFinite(elapsed) || elapsed < 0) throw new RangeError('Elapsed time must be a non-negative finite number.');
  if (elapsed >= safe.totalSeconds) return Object.freeze({ phase: 'complete', round: safe.rounds, elapsedSeconds: safe.totalSeconds, remainingSeconds: 0, totalSeconds: safe.totalSeconds, progress: 1 });

  let cursor = 0;
  let phase = 'work';
  let round = 1;
  let duration = safe.workSeconds;
  if (safe.prepSeconds > 0) {
    if (elapsed < safe.prepSeconds) {
      phase = 'prep'; duration = safe.prepSeconds;
      return snapshot(safe, phase, 0, elapsed, cursor, duration);
    }
    cursor = safe.prepSeconds;
  }
  for (round = 1; round <= safe.rounds; round += 1) {
    duration = safe.workSeconds;
    if (elapsed < cursor + duration) return snapshot(safe, 'work', round, elapsed, cursor, duration);
    cursor += duration;
    if (round < safe.rounds && safe.restSeconds > 0) {
      duration = safe.restSeconds;
      if (elapsed < cursor + duration) return snapshot(safe, 'rest', round, elapsed, cursor, duration);
      cursor += duration;
    }
  }
  return Object.freeze({ phase: 'complete', round: safe.rounds, elapsedSeconds: safe.totalSeconds, remainingSeconds: 0, totalSeconds: safe.totalSeconds, progress: 1 });
}

function snapshot(config, phase, round, elapsed, start, duration) {
  return Object.freeze({
    phase,
    round,
    elapsedSeconds: elapsed,
    remainingSeconds: Math.max(0, start + duration - elapsed),
    totalSeconds: config.totalSeconds,
    progress: Math.min(1, elapsed / config.totalSeconds),
  });
}

export const INTERVAL_TIMER_LIMITS = Object.freeze({ maxWorkSeconds: MAX_WORK_SECONDS, maxRestSeconds: MAX_REST_SECONDS, maxPrepSeconds: MAX_PREP_SECONDS, maxRounds: MAX_ROUNDS });
