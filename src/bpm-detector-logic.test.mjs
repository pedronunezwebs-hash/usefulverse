import test from 'node:test';
import assert from 'node:assert/strict';
import { buildOnsetEnvelope, calculateTapTempo, estimateBpm } from './bpm-detector-logic.mjs';

test('detects a steady 120 BPM pulse from an onset envelope', () => {
  const frameSeconds = 0.01;
  const values = new Float32Array(12000);
  for (let second = 0; second < 120; second += 0.5) values[Math.round(second / frameSeconds)] = 1;
  const result = estimateBpm(values, frameSeconds);
  assert.ok(Math.abs(result.bpm - 120) <= 2, JSON.stringify(result));
  assert.ok(result.confidence >= 0 && result.confidence <= 100);
});

test('returns no estimate for silence and rejects invalid range', () => {
  assert.equal(estimateBpm(new Float32Array(1000), 0.01).bpm, null);
  assert.throws(() => estimateBpm(new Float32Array(1000), 0.01, { minBpm: 220, maxBpm: 45 }), RangeError);
});

test('tap tempo needs enough valid taps and handles a stale pause', () => {
  assert.equal(calculateTapTempo([0, 500]), null);
  assert.equal(calculateTapTempo([0, 500, 1000, 1500]), 120);
  assert.equal(calculateTapTempo([0, 500, 4500, 5000]), null);
});

test('creates a compact onset envelope from decoded audio channels', () => {
  const sampleRate = 1000;
  const left = new Float32Array(4000);
  const right = new Float32Array(4000);
  for (const start of [500, 1500, 2500]) for (let i = start; i < start + 70; i++) left[i] = right[i] = 0.8;
  const result = buildOnsetEnvelope([left, right], sampleRate, 10);
  assert.equal(result.values.length, 400);
  assert.equal(result.frameSeconds, 0.01);
  assert.ok(Math.max(...result.values) > 0.1);
  assert.throws(() => buildOnsetEnvelope([new Float32Array(20)], sampleRate), RangeError);
});

test('recovers a 120 BPM beat from a synthetic click track after audio framing', () => {
  const sampleRate = 8000;
  const seconds = 20;
  const samples = new Float32Array(sampleRate * seconds);
  for (let beat = 0; beat < seconds; beat += 0.5) {
    const start = Math.round(beat * sampleRate);
    for (let i = start; i < Math.min(samples.length, start + 260); i++) {
      const age = (i - start) / sampleRate;
      samples[i] = Math.sin(age * 2 * Math.PI * 950) * Math.exp(-age * 48);
    }
  }
  const { values, frameSeconds } = buildOnsetEnvelope([samples], sampleRate);
  const result = estimateBpm(values, frameSeconds);
  assert.ok(Math.abs(result.bpm - 120) <= 3, JSON.stringify(result));
});
