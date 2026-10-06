export const MUSIC_SCALES = Object.freeze({
  major: { label: 'Major', degrees: [1, 2, 3, 4, 5, 6, 7], semitones: [0, 2, 4, 5, 7, 9, 11] },
  minor: { label: 'Natural minor', degrees: [1, 2, 3, 4, 5, 6, 7], semitones: [0, 2, 3, 5, 7, 8, 10] },
  harmonicMinor: { label: 'Harmonic minor', degrees: [1, 2, 3, 4, 5, 6, 7], semitones: [0, 2, 3, 5, 7, 8, 11] },
  majorPentatonic: { label: 'Major pentatonic', degrees: [1, 2, 3, 5, 6], semitones: [0, 2, 4, 7, 9] },
  minorPentatonic: { label: 'Minor pentatonic', degrees: [1, 3, 4, 5, 7], semitones: [0, 3, 5, 7, 10] },
  blues: { label: 'Blues', degrees: [1, 3, 4, '♭5', 5, 7], semitones: [0, 3, 5, 6, 7, 10] },
  dorian: { label: 'Dorian', degrees: [1, 2, '♭3', 4, 5, 6, '♭7'], semitones: [0, 2, 3, 5, 7, 9, 10] },
  mixolydian: { label: 'Mixolydian', degrees: [1, 2, 3, 4, 5, 6, '♭7'], semitones: [0, 2, 4, 5, 7, 9, 10] },
});

const SHARP_NOTES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
const FLAT_NOTES = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'];
const ROOTS = Object.freeze({ C: 0, 'C♯': 1, 'D♭': 1, D: 2, 'D♯': 3, 'E♭': 3, E: 4, F: 5, 'F♯': 6, 'G♭': 6, G: 7, 'G♯': 8, 'A♭': 8, A: 9, 'A♯': 10, 'B♭': 10, B: 11 });

export function buildScale({ root, scale } = {}) {
  const rootIndex = ROOTS[root];
  const pattern = MUSIC_SCALES[scale];
  if (rootIndex === undefined) throw new RangeError('Choose a supported root note.');
  if (!pattern) throw new RangeError('Choose a supported scale.');
  const preferFlats = /[♭]/u.test(root);
  const names = preferFlats ? FLAT_NOTES : SHARP_NOTES;
  return pattern.semitones.map((semitones, index) => ({
    note: names[(rootIndex + semitones) % 12],
    degree: String(pattern.degrees[index]),
    semitones,
    midi: 60 + rootIndex + semitones,
  }));
}

export function validateScalePlayback({ durationMs = 380, volume = 0.12 } = {}) {
  const duration = Number(durationMs);
  const gain = Number(volume);
  if (!Number.isFinite(duration) || duration < 100 || duration > 1500) throw new RangeError('Note duration must be 100 to 1500 milliseconds.');
  if (!Number.isFinite(gain) || gain < 0 || gain > 0.35) throw new RangeError('Volume must be from 0 to 0.35.');
  return { durationMs: duration, volume: gain };
}
