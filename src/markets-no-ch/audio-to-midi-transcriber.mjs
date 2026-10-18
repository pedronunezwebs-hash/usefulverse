const DEFAULTS = Object.freeze({ minHz: 55, maxHz: 1200, confidence: 0.78, minDuration: 0.09, frameSize: 768, hopSize: 256 });

export function estimatePitch(frame, sampleRate, options = {}) {
  const { minHz, maxHz, confidence, frameSize } = { ...DEFAULTS, ...options };
  if (!(frame instanceof Float32Array) || frame.length < frameSize || !Number.isFinite(sampleRate) || sampleRate < 1000) return null;
  let mean = 0;
  for (let i = 0; i < frameSize; i += 1) mean += frame[i];
  mean /= frameSize;
  let rms = 0;
  for (let i = 0; i < frameSize; i += 1) { const value = frame[i] - mean; rms += value * value; }
  rms = Math.sqrt(rms / frameSize);
  if (rms < 0.006) return null;

  const minLag = Math.max(2, Math.floor(sampleRate / maxHz));
  const maxLag = Math.min(frameSize - 2, Math.ceil(sampleRate / minHz));
  const compared = frameSize - maxLag;
  const difference = new Float64Array(maxLag + 1);
  const normalized = new Float64Array(maxLag + 1);
  let running = 0;
  for (let lag = 1; lag <= maxLag; lag += 1) {
    let sum = 0;
    for (let i = 0; i < compared; i += 1) {
      const delta = frame[i] - frame[i + lag];
      sum += delta * delta;
    }
    difference[lag] = sum;
    running += sum;
    normalized[lag] = running === 0 ? 1 : sum * lag / running;
  }
  let chosen = -1;
  for (let lag = minLag; lag <= maxLag; lag += 1) {
    if (normalized[lag] < confidence) {
      while (lag < maxLag && normalized[lag + 1] < normalized[lag]) lag += 1;
      chosen = lag;
      break;
    }
  }
  if (chosen < 0) return null;
  const left = normalized[chosen - 1] ?? normalized[chosen];
  const center = normalized[chosen];
  const right = normalized[chosen + 1] ?? center;
  const curve = left - 2 * center + right;
  const refined = chosen + (curve === 0 ? 0 : Math.max(-0.5, Math.min(0.5, 0.5 * (left - right) / curve)));
  const hz = sampleRate / refined;
  if (!Number.isFinite(hz) || hz < minHz || hz > maxHz) return null;
  return { hz, midi: Math.max(0, Math.min(127, Math.round(69 + 12 * Math.log2(hz / 440)))), confidence: Math.max(0, Math.min(1, 1 - center)), rms };
}

export function detectMonophonicNotes(samples, sampleRate, options = {}) {
  const settings = { ...DEFAULTS, ...options };
  if (!(samples instanceof Float32Array) || samples.length < settings.frameSize || !Number.isFinite(sampleRate) || sampleRate < 1000) return [];
  const stride = Math.max(1, Math.ceil(sampleRate / 11025));
  const reduced = stride === 1 ? samples : Float32Array.from({ length: Math.ceil(samples.length / stride) }, (_, index) => samples[index * stride]);
  const reducedRate = sampleRate / stride;
  const frames = [];
  const frameCount = Math.max(1, Math.floor((reduced.length - settings.frameSize) / settings.hopSize) + 1);
  let frameIndex = 0;
  for (let start = 0; start + settings.frameSize <= reduced.length; start += settings.hopSize) {
    const pitch = estimatePitch(reduced.subarray(start, start + settings.frameSize), reducedRate, settings);
    frames.push({ start: start / reducedRate, end: (start + settings.frameSize) / reducedRate, pitch });
    frameIndex += 1;
    if (frameIndex % 24 === 0) options.onProgress?.(Math.min(0.95, frameIndex / frameCount));
  }
  const segments = [];
  for (const frame of frames) {
    const midi = frame.pitch?.midi ?? null;
    const last = segments.at(-1);
    if (midi !== null && last && last.midi === midi && frame.start - last.end <= 0.12) {
      last.end = frame.end;
      last.confidenceSum += frame.pitch.confidence;
      last.confidenceCount += 1;
      last.rms = Math.max(last.rms, frame.pitch.rms);
    } else if (midi !== null) {
      segments.push({ midi, start: frame.start, end: frame.end, velocity: Math.max(1, Math.min(127, Math.round(35 + frame.pitch.rms * 500))), confidenceSum: frame.pitch.confidence, confidenceCount: 1, rms: frame.pitch.rms });
    }
  }
  const result = segments.filter((note) => note.end - note.start >= settings.minDuration).map((note, index) => ({ id: index + 1, midi: note.midi, start: Math.max(0, note.start), duration: Math.max(settings.minDuration, note.end - note.start), velocity: note.velocity, confidence: note.confidenceSum / note.confidenceCount }));
  // A monophonic transcription must not emit overlapping pitches. Analysis windows
  // overlap by design, so cut a transition at the midpoint between adjacent events.
  for (let index = 0; index < result.length - 1; index += 1) {
    const current = result[index]; const next = result[index + 1];
    if (current.start + current.duration > next.start) {
      const boundary = Math.max(current.start + settings.minDuration, (current.start + current.duration + next.start) / 2);
      current.duration = Math.max(settings.minDuration, boundary - current.start);
      next.start = current.start + current.duration;
    }
  }
  return result;
}

export function quantizeNotes(notes, bpm, subdivision = 0) {
  if (!Array.isArray(notes) || !Number.isFinite(bpm) || bpm < 30 || bpm > 240 || ![0, 4, 8, 16].includes(subdivision)) throw new RangeError('Use a tempo from 30 to 240 BPM and a supported grid.');
  if (subdivision === 0) return notes.map((note) => ({ ...note }));
  const step = 60 / bpm * 4 / subdivision;
  return notes.map((note) => {
    const start = Math.max(0, Math.round(note.start / step) * step);
    const end = Math.max(start + step, Math.round((note.start + note.duration) / step) * step);
    return { ...note, start, duration: end - start };
  });
}

function variableLength(value) {
  let buffer = value & 0x7f;
  const bytes = [];
  while ((value >>= 7)) { buffer <<= 8; buffer |= (value & 0x7f) | 0x80; }
  while (true) { bytes.push(buffer & 0xff); if (buffer & 0x80) buffer >>= 8; else break; }
  return bytes;
}

export function encodeMidi(notes, { bpm = 120, channel = 0 } = {}) {
  if (!Array.isArray(notes) || notes.length > 10000 || !Number.isFinite(bpm) || bpm < 30 || bpm > 240 || !Number.isInteger(channel) || channel < 0 || channel > 15) throw new RangeError('Invalid MIDI export settings.');
  const events = [];
  for (const note of notes) {
    const { midi, start, duration, velocity } = note;
    if (!Number.isInteger(midi) || midi < 0 || midi > 127 || !Number.isFinite(start) || start < 0 || !Number.isFinite(duration) || duration <= 0 || !Number.isInteger(velocity) || velocity < 1 || velocity > 127) throw new RangeError('Invalid note event.');
    const startTick = Math.round(start * bpm / 60 * 480);
    const endTick = Math.max(startTick + 1, Math.round((start + duration) * bpm / 60 * 480));
    events.push({ tick: startTick, priority: 1, data: [0x90 | channel, midi, velocity] }, { tick: endTick, priority: 0, data: [0x80 | channel, midi, 0] });
  }
  events.sort((a, b) => a.tick - b.tick || a.priority - b.priority);
  const tempo = Math.round(60_000_000 / bpm);
  const track = [0, 0xff, 0x51, 0x03, (tempo >> 16) & 255, (tempo >> 8) & 255, tempo & 255];
  let previous = 0;
  for (const event of events) { track.push(...variableLength(event.tick - previous), ...event.data); previous = event.tick; }
  track.push(0, 0xff, 0x2f, 0);
  const header = [0x4d, 0x54, 0x68, 0x64, 0, 0, 0, 6, 0, 0, 0, 1, 1, 0xe0];
  const trackHeader = [0x4d, 0x54, 0x72, 0x6b, (track.length >>> 24) & 255, (track.length >>> 16) & 255, (track.length >>> 8) & 255, track.length & 255];
  return Uint8Array.from([...header, ...trackHeader, ...track]);
}
