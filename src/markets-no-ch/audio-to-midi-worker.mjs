import { detectMonophonicNotes } from './audio-to-midi-transcriber.mjs';

self.addEventListener('message', (event) => {
  const { samples, sampleRate } = event.data ?? {};
  if (!(samples instanceof Float32Array) || !Number.isFinite(sampleRate)) {
    self.postMessage({ type: 'error', message: 'Invalid audio data.' });
    return;
  }
  try {
    const notes = detectMonophonicNotes(samples, sampleRate, { onProgress: (progress) => self.postMessage({ type: 'progress', progress }) });
    self.postMessage({ type: 'complete', notes });
  } catch {
    self.postMessage({ type: 'error', message: 'Audio analysis failed.' });
  }
});
