import { fingerprintAudio } from '../music-identifier/logic.mjs';

const NOTE_NAMES = Object.freeze(['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B']);
const CHORDS = Object.freeze([
  ['maj', [0, 4, 7]], ['min', [0, 3, 7]], ['dim', [0, 3, 6]], ['aug', [0, 4, 8]],
  ['sus2', [0, 2, 7]], ['sus4', [0, 5, 7]], ['7', [0, 4, 7, 10]], ['maj7', [0, 4, 7, 11]],
  ['min7', [0, 3, 7, 10]], ['m7♭5', [0, 3, 6, 10]], ['6', [0, 4, 7, 9]], ['min6', [0, 3, 7, 9]],
]);
const clamp01 = (n) => Math.max(0, Math.min(1, n));

export function estimateChords(samples, sampleRate = 11025) {
  const fingerprint = fingerprintAudio(samples, sampleRate);
  const timeline = [];
  for (const frame of fingerprint.frames) {
    const pitchClasses = new Float64Array(12);
    for (let i = 0; i < frame.features.length; i += 1) pitchClasses[(45 + i) % 12] += frame.features[i];
    const total = pitchClasses.reduce((a, b) => a + b, 0);
    let best = null;
    for (let root = 0; root < 12; root += 1) {
      for (const [quality, intervals] of CHORDS) {
        const chord = new Set(intervals.map((interval) => (root + interval) % 12));
        const inChord = pitchClasses.reduce((sum, value, note) => sum + (chord.has(note) ? value : 0), 0) / total;
        const outside = pitchClasses.reduce((sum, value, note) => sum + (!chord.has(note) ? value : 0), 0) / total;
        const score = clamp01(inChord - outside * 0.35 - Math.max(0, intervals.length - 3) * 0.12);
        if (!best || score > best.score) best = { name: `${NOTE_NAMES[root]}${quality}`, score };
      }
    }
    const chord = best.score >= 0.54 ? best.name : 'N.C.';
    const previous = timeline.at(-1);
    if (previous?.chord === chord) previous.endSeconds = frame.time + 0.5;
    else timeline.push({ startSeconds: frame.time, endSeconds: frame.time + 0.5, chord, similarity: best.score });
  }
  return Object.freeze({ durationSeconds: fingerprint.durationSeconds, timeline: Object.freeze(timeline.map((row) => Object.freeze(row))) });
}
