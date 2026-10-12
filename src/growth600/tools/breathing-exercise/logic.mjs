const MAX_PHASE_SECONDS = 30;
const MIN_SESSION_SECONDS = 30;
const MAX_SESSION_SECONDS = 3_600;

function boundedInteger(value, name, minimum, maximum) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < minimum || number > maximum) {
    throw new RangeError(`${name} must be an integer from ${minimum} to ${maximum}.`);
  }
  return number;
}

export function normalizeBreathingConfig({ inhaleSeconds, holdAfterInhaleSeconds = 0, exhaleSeconds, holdAfterExhaleSeconds = 0, durationSeconds } = {}) {
  const inhale = boundedInteger(inhaleSeconds, 'Inhale', 1, MAX_PHASE_SECONDS);
  const holdIn = boundedInteger(holdAfterInhaleSeconds, 'Hold after inhale', 0, MAX_PHASE_SECONDS);
  const exhale = boundedInteger(exhaleSeconds, 'Exhale', 1, MAX_PHASE_SECONDS);
  const holdOut = boundedInteger(holdAfterExhaleSeconds, 'Hold after exhale', 0, MAX_PHASE_SECONDS);
  const duration = boundedInteger(durationSeconds, 'Session duration', MIN_SESSION_SECONDS, MAX_SESSION_SECONDS);
  const cycleSeconds = inhale + holdIn + exhale + holdOut;
  return Object.freeze({ inhaleSeconds: inhale, holdAfterInhaleSeconds: holdIn, exhaleSeconds: exhale, holdAfterExhaleSeconds: holdOut, durationSeconds: duration, cycleSeconds });
}

const phasesFor = (config) => [
  { phase: 'inhale', seconds: config.inhaleSeconds },
  ...(config.holdAfterInhaleSeconds ? [{ phase: 'hold', seconds: config.holdAfterInhaleSeconds }] : []),
  { phase: 'exhale', seconds: config.exhaleSeconds },
  ...(config.holdAfterExhaleSeconds ? [{ phase: 'hold', seconds: config.holdAfterExhaleSeconds }] : []),
];

/** Returns a stable snapshot derived from elapsed monotonic time; caller owns and can cancel its timer. */
export function breathingPhaseAt(configInput, elapsedSeconds) {
  const config = normalizeBreathingConfig(configInput);
  const elapsed = Number(elapsedSeconds);
  if (!Number.isFinite(elapsed) || elapsed < 0) throw new RangeError('Elapsed time must be a non-negative finite number.');
  if (elapsed >= config.durationSeconds) {
    return Object.freeze({ phase: 'complete', phaseElapsedSeconds: 0, phaseRemainingSeconds: 0, elapsedSeconds: config.durationSeconds, remainingSeconds: 0, cycle: Math.ceil(config.durationSeconds / config.cycleSeconds), progress: 1 });
  }
  const cycle = Math.floor(elapsed / config.cycleSeconds) + 1;
  const withinCycle = elapsed % config.cycleSeconds;
  let cursor = 0;
  for (const { phase, seconds } of phasesFor(config)) {
    if (withinCycle < cursor + seconds) {
      const phaseElapsedSeconds = withinCycle - cursor;
      return Object.freeze({ phase, phaseElapsedSeconds, phaseRemainingSeconds: cursor + seconds - withinCycle, elapsedSeconds: elapsed, remainingSeconds: Math.ceil(config.durationSeconds - elapsed), cycle, progress: elapsed / config.durationSeconds });
    }
    cursor += seconds;
  }
  throw new RangeError('Breathing cycle configuration is invalid.');
}

export const BREATHING_EXERCISE_LIMITS = Object.freeze({ minSessionSeconds: MIN_SESSION_SECONDS, maxSessionSeconds: MAX_SESSION_SECONDS, maxPhaseSeconds: MAX_PHASE_SECONDS });
