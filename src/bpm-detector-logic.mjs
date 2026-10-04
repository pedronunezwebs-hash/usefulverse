export function buildOnsetEnvelope(channels, sampleRate, frameMs = 10) {
  if (!Array.isArray(channels) || channels.length === 0 || !Number.isFinite(sampleRate) || sampleRate <= 0) throw new TypeError('Audio samples and sample rate are required.');
  const length = Math.min(...channels.map((channel) => channel.length));
  const frameSize = Math.max(1, Math.round(sampleRate * frameMs / 1000));
  const frameCount = Math.floor(length / frameSize);
  if (frameCount < 100) throw new RangeError('Choose at least one second of audio.');
  const energy = new Float32Array(frameCount);
  for (let frame = 0; frame < frameCount; frame++) {
    const start = frame * frameSize;
    const end = start + frameSize;
    let sum = 0;
    let count = 0;
    for (const channel of channels) {
      for (let i = start; i < end; i++) { const sample = channel[i]; sum += sample * sample; count++; }
    }
    energy[frame] = Math.sqrt(sum / count);
  }
  const onsets = new Float32Array(frameCount);
  for (let i = 4; i < frameCount; i++) {
    const baseline = (energy[i - 1] + energy[i - 2] + energy[i - 3] + energy[i - 4]) / 4;
    onsets[i] = Math.max(0, energy[i] - baseline);
  }
  return { values: onsets, frameSeconds: frameMs / 1000 };
}

function normalizedCorrelation(values, lag) {
  let numerator = 0;
  let left = 0;
  let right = 0;
  for (let i = lag; i < values.length; i++) {
    const a = values[i];
    const b = values[i - lag];
    numerator += a * b;
    left += a * a;
    right += b * b;
  }
  return left && right ? numerator / Math.sqrt(left * right) : 0;
}

export function estimateBpm(envelope, frameSeconds, { minBpm = 45, maxBpm = 220 } = {}) {
  if (!envelope || envelope.length < 100 || !Number.isFinite(frameSeconds) || frameSeconds <= 0) throw new TypeError('A valid audio onset envelope is required.');
  if (!Number.isFinite(minBpm) || !Number.isFinite(maxBpm) || minBpm < 30 || maxBpm > 300 || minBpm >= maxBpm) throw new RangeError('Tempo range must be between 30 and 300 BPM.');
  const mean = envelope.reduce((sum, value) => sum + value, 0) / envelope.length;
  const centered = Float32Array.from(envelope, (value) => value - mean);
  let peak = 0;
  for (const value of centered) peak = Math.max(peak, value);
  if (peak < 1e-7) return { bpm: null, confidence: 0, alternatives: [] };
  const minLag = Math.max(1, Math.floor(60 / (maxBpm * frameSeconds)));
  const maxLag = Math.min(centered.length - 1, Math.ceil(60 / (minBpm * frameSeconds)));
  const scores = [];
  for (let lag = minLag; lag <= maxLag; lag++) {
    scores.push({ bpm: 60 / (lag * frameSeconds), score: normalizedCorrelation(centered, lag) });
  }
  scores.sort((a, b) => b.score - a.score);
  const candidates = [];
  for (const item of scores) {
    if (!candidates.some((candidate) => Math.abs(candidate.bpm - item.bpm) < 4)) candidates.push(item);
    if (candidates.length === 3) break;
  }
  const best = candidates[0];
  if (!best || best.score < 0.08) return { bpm: null, confidence: 0, alternatives: [] };
  const next = candidates[1]?.score ?? 0;
  const confidence = Math.max(0, Math.min(1, best.score * Math.max(0, (best.score - next) / Math.max(best.score, 0.001))));
  return { bpm: Math.round(best.bpm), confidence: Math.round(confidence * 100), alternatives: candidates.slice(1).map(({ bpm }) => Math.round(bpm)) };
}

export function calculateTapTempo(timestamps, { minimumTaps = 3, maxGapMs = 3000 } = {}) {
  if (!Array.isArray(timestamps) || timestamps.some((time, index) => !Number.isFinite(time) || (index && time <= timestamps[index - 1]))) return null;
  let segment = timestamps.slice(-8);
  const lastGap = segment.findLastIndex((time, index) => index > 0 && time - segment[index - 1] > maxGapMs);
  if (lastGap >= 0) segment = segment.slice(lastGap);
  const recent = segment;
  if (recent.length < minimumTaps) return null;
  const intervals = recent.slice(1).map((time, index) => time - recent[index]).filter((gap) => gap <= maxGapMs && gap >= 250 && gap <= 2000);
  if (intervals.length < minimumTaps - 1) return null;
  intervals.sort((a, b) => a - b);
  const median = intervals[Math.floor(intervals.length / 2)];
  return Math.round(60000 / median);
}
