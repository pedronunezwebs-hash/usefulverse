import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateChords } from './logic.mjs';

function chordTone(notes, seconds = 1.2, sampleRate = 11025) {
  const samples = new Float32Array(Math.floor(seconds * sampleRate));
  notes.forEach((midi, index) => {
    const frequency = 440 * 2 ** ((midi - 69) / 12);
    for (let i = 0; i < samples.length; i += 1) samples[i] += 0.24 * Math.sin(2 * Math.PI * frequency * i / sampleRate + index * 0.17);
  });
  return samples;
}

test('estimates common triads from a local synthetic audio frame', () => {
  assert.match(estimateChords(chordTone([60, 64, 67])).timeline[0].chord, /^Cmaj$/);
  assert.match(estimateChords(chordTone([57, 60, 64])).timeline[0].chord, /^Amin$/);
});

test('reports timeline intervals with bounded heuristic scores', () => {
  const result = estimateChords(chordTone([62, 65, 69]));
  assert.ok(result.durationSeconds > 1);
  assert.ok(result.timeline.length > 0);
  for (const row of result.timeline) {
    assert.ok(row.endSeconds > row.startSeconds);
    assert.ok(row.similarity >= 0 && row.similarity <= 1);
  }
});

test('rejects invalid or silent audio instead of inventing a chord', () => {
  assert.throws(() => estimateChords(new Float32Array(500)), RangeError);
  assert.throws(() => estimateChords(new Float32Array(4096)), /No stable tonal content/);
});
