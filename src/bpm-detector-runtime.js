import { buildOnsetEnvelope, estimateBpm, calculateTapTempo } from './bpm-detector-logic.mjs';

const $ = (selector, root) => root.querySelector(selector);
const locale = window.usefulverseLocale ?? {};
const say = (phrase) => locale.runtime?.[phrase] ?? locale.messages?.[phrase] ?? phrase;
const fill = (phrase, values) => Object.entries(values).reduce((text, [key, value]) => text.replaceAll(`{${key}}`, String(value)), say(phrase));
const MAX_FILE_BYTES = 50 * 1024 * 1024;
const MAX_DURATION_SECONDS = 180;
const MAX_DECODED_SAMPLES = 24_000_000;

export function setupBpmDetector(root) {
  const fileInput = $('[data-bpm-file]', root);
  const analyze = $('[data-bpm-analyze]', root);
  const tap = $('[data-bpm-tap]', root);
  const clearTaps = $('[data-bpm-clear-taps]', root);
  const value = $('[data-bpm-value]', root);
  const detail = $('[data-bpm-detail]', root);
  const status = $('[data-bpm-status]', root);
  let tapTimes = [];
  const sayStatus = (message, kind = '') => { status.textContent = message; status.dataset.state = kind; };

  fileInput.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    analyze.disabled = !file;
    value.textContent = '—';
    detail.textContent = file ? fill('Selected: {name} ({size} MB).', { name: file.name, size: (file.size / 1048576).toFixed(1) }) : say('Choose a file or tap a steady beat at least four times.');
    sayStatus(file ? say('Audio file ready.') : '');
  });

  analyze.addEventListener('click', async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) { sayStatus(say('The file is too large. Choose audio under 50 MB.'), 'error'); return; }
    const Context = window.AudioContext ?? window.webkitAudioContext;
    if (!Context) { sayStatus(say('Audio analysis is not supported in this browser.'), 'error'); return; }
    let audio;
    analyze.disabled = true;
    value.textContent = '—';
    sayStatus(say('Analyzing audio locally…'));
    try {
      audio = new Context();
      const buffer = await audio.decodeAudioData(await file.arrayBuffer());
      if (buffer.duration > MAX_DURATION_SECONDS || buffer.length * buffer.numberOfChannels > MAX_DECODED_SAMPLES) {
        throw new RangeError('limit');
      }
      const channels = Array.from({ length: buffer.numberOfChannels }, (_, index) => buffer.getChannelData(index));
      const { values, frameSeconds } = buildOnsetEnvelope(channels, buffer.sampleRate);
      const result = estimateBpm(values, frameSeconds);
      if (result.bpm === null) {
        detail.textContent = say('Not enough rhythm was found. Try a steady section or tap the beat.');
        sayStatus(say('No clear tempo found.'), 'warning');
      } else {
        value.textContent = String(result.bpm);
        detail.textContent = result.alternatives.length
          ? fill('Tempo estimate. Other possible tempos: {tempos} BPM. Tap along to check.', { tempos: result.alternatives.join(', ') })
          : say('Tempo estimate ready. Tap along to check it.');
        sayStatus(say('Estimate ready. Compare it by tapping along.'), 'success');
      }
    } catch (error) {
      if (error instanceof RangeError || error.message === 'limit') sayStatus(say('The file is too large or long for this device. Choose audio under 50 MB and 3 minutes.'), 'error');
      else if (error.name === 'NotSupportedError' || error.name === 'EncodingError') sayStatus(say('This browser could not decode that audio format.'), 'error');
      else sayStatus(say('Could not analyze the audio. Try another format or a shorter file.'), 'error');
    } finally {
      audio?.close().catch(() => {});
      analyze.disabled = !fileInput.files?.length;
    }
  });

  tap.addEventListener('click', () => {
    const now = performance.now();
    if (tapTimes.length && now - tapTimes.at(-1) > 3000) tapTimes = [];
    tapTimes.push(now);
    tapTimes = tapTimes.slice(-8);
    clearTaps.disabled = false;
    const bpm = calculateTapTempo(tapTimes);
    if (bpm) {
      value.textContent = String(bpm);
      detail.textContent = say('Tempo from your taps.');
      sayStatus(fill('Tempo from your taps: {bpm} BPM.', { bpm }), 'success');
    } else {
      detail.textContent = fill('Tap at a steady pace. {count} of 4 taps.', { count: tapTimes.length });
      sayStatus(say('Tap at least four beats at a steady pace.'));
    }
  });
  clearTaps.addEventListener('click', () => {
    tapTimes = [];
    value.textContent = '—';
    detail.textContent = say('Choose a file or tap a steady beat at least four times.');
    clearTaps.disabled = true;
    sayStatus('');
  });
}
