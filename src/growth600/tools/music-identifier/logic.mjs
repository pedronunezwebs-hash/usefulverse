const ANALYSIS_RATE = 11025;
const WINDOW = 2048;
const HOP_SECONDS = 0.5;
const MIDI_NOTES = Array.from({ length: 48 }, (_, i) => i + 45);
const clamp01 = (n) => Math.max(0, Math.min(1, n));

function normalizedFrame(samples, offset, sampleRate) {
  const powers = new Float64Array(MIDI_NOTES.length);
  let energy = 0;
  for (let i = 0; i < WINDOW; i += 1) {
    const sample = samples[offset + i] * (0.5 - 0.5 * Math.cos(2 * Math.PI * i / (WINDOW - 1)));
    energy += sample * sample;
  }
  if (energy / WINDOW < 0.000004) return null;
  for (let noteIndex = 0; noteIndex < MIDI_NOTES.length; noteIndex += 1) {
    const frequency = 440 * 2 ** ((MIDI_NOTES[noteIndex] - 69) / 12);
    if (frequency >= sampleRate / 2) continue;
    const coefficient = 2 * Math.cos(2 * Math.PI * frequency / sampleRate);
    let s1 = 0, s2 = 0;
    for (let i = 0; i < WINDOW; i += 1) {
      const sample = samples[offset + i] * (0.5 - 0.5 * Math.cos(2 * Math.PI * i / (WINDOW - 1)));
      const s0 = sample + coefficient * s1 - s2;
      s2 = s1; s1 = s0;
    }
    powers[noteIndex] = Math.max(0, s1 * s1 + s2 * s2 - coefficient * s1 * s2);
  }
  const norm = Math.sqrt(powers.reduce((sum, value) => sum + value * value, 0));
  if (norm < 1e-10) return null;
  return Object.freeze(Array.from(powers, (value) => value / norm));
}

export function fingerprintAudio(samples, sampleRate = ANALYSIS_RATE) {
  if (!(samples instanceof Float32Array) || samples.length < WINDOW || samples.length > sampleRate * 120 || !Number.isFinite(sampleRate) || sampleRate < 8000 || sampleRate > 48000) {
    throw new RangeError('Audio samples must cover 0.19 to 120 seconds at 8–48 kHz.');
  }
  if (samples.some((sample) => !Number.isFinite(sample) || Math.abs(sample) > 1.01)) throw new RangeError('Audio samples must be finite normalized PCM.');
  const hop = Math.max(1, Math.round(sampleRate * HOP_SECONDS));
  const frames = [];
  for (let offset = 0; offset + WINDOW <= samples.length; offset += hop) {
    const features = normalizedFrame(samples, offset, sampleRate);
    if (features) frames.push(Object.freeze({ time: offset / sampleRate, features }));
  }
  if (!frames.length) throw new RangeError('No stable tonal content was found in this audio.');
  return Object.freeze({ frames: Object.freeze(frames), durationSeconds: samples.length / sampleRate, feature: 'local pitch-energy fingerprint v1' });
}

function similarity(a, b) {
  let dot = 0;
  for (let i = 0; i < a.length; i += 1) dot += a[i] * b[i];
  return clamp01(dot);
}

export function findAudioMatch(query, candidates) {
  if (!query?.frames?.length || !Array.isArray(candidates) || !candidates.length || candidates.length > 8) throw new RangeError('Compare one clip with 1–8 reference tracks.');
  let best = null;
  for (const candidate of candidates) {
    if (!candidate?.name || candidate.name.length > 120 || !candidate.fingerprint?.frames?.length) throw new RangeError('Each reference needs a name and a valid fingerprint.');
    const q = query.frames, r = candidate.fingerprint.frames;
    if (r.length < q.length) continue;
    for (let start = 0; start <= r.length - q.length; start += 1) {
      let score = 0;
      for (let i = 0; i < q.length; i += 1) score += similarity(q[i].features, r[start + i].features);
      score /= q.length;
      if (!best || score > best.score) best = { name: candidate.name, score, offsetSeconds: r[start].time, comparedFrames: q.length };
    }
  }
  return best ? Object.freeze(best) : null;
}
