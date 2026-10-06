export const DRUM_TRACKS = Object.freeze(['kick', 'snare', 'hat']);
export const DRUM_STEPS = 16;
export const DEFAULT_DRUM_PATTERN = Object.freeze({
  kick: Object.freeze([1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]),
  snare: Object.freeze([0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]),
  hat: Object.freeze([1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]),
});

export function validateDrumTempo(value) {
  const tempo = Number(value);
  if (!Number.isInteger(tempo) || tempo < 40 || tempo > 240) throw new RangeError('Tempo must be a whole number from 40 to 240 BPM.');
  return tempo;
}

export function normalizeDrumPattern(pattern) {
  if (!pattern || typeof pattern !== 'object' || Array.isArray(pattern)) throw new TypeError('Choose a drum pattern.');
  const result = {};
  for (const track of DRUM_TRACKS) {
    if (!Array.isArray(pattern[track]) || pattern[track].length !== DRUM_STEPS
      || pattern[track].some((step) => step !== 0 && step !== 1)) throw new TypeError('Each drum track must have 16 on/off steps.');
    result[track] = [...pattern[track]];
  }
  return result;
}

export function toggleDrumStep(pattern, track, index) {
  const next = normalizeDrumPattern(pattern);
  if (!DRUM_TRACKS.includes(track)) throw new RangeError('Choose kick, snare or hat.');
  if (!Number.isInteger(index) || index < 0 || index >= DRUM_STEPS) throw new RangeError('Choose one of the 16 steps.');
  next[track][index] = next[track][index] ? 0 : 1;
  return next;
}

export function drumStepSeconds(tempo) {
  return 60 / validateDrumTempo(tempo) / 4;
}
