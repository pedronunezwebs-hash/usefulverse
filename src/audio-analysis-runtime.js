import {
  analyzeSamples,
  estimateSongKey,
  validateAudioInput,
} from './audio-analysis-logic.mjs';
const $ = (selector, root) => root.querySelector(selector);
const localized = (root, key) => JSON.parse(root.dataset.plannerMessages || '{}')[key] ?? key;

function monoSamples(buffer) {
  const length = buffer.length; const channelCount = buffer.numberOfChannels;
  const mono = new Float32Array(length); const channel = new Float32Array(length);
  for (let index = 0; index < channelCount; index += 1) {
    buffer.copyFromChannel(channel, index);
    for (let sample = 0; sample < length; sample += 1) mono[sample] += channel[sample] / channelCount;
  }
  return mono;
}

function paintSpectrogram(canvas, result) {
  const context = canvas.getContext('2d', { alpha: false });
  if (!context) throw new Error('canvas');
  const width = canvas.width; const height = canvas.height; const image = context.createImageData(width, height);
  const nyquist = result.sampleRate / 2; const low = Math.log(55); const high = Math.log(Math.min(8000, nyquist));
  for (let x = 0; x < width; x += 1) {
    const frame = result.frames[Math.min(result.frames.length - 1, Math.floor(x * result.frames.length / width))];
    for (let y = 0; y < height; y += 1) {
      const frequency = Math.exp(high - (high - low) * y / Math.max(1, height - 1));
      const bin = Math.min(frame.length - 1, Math.max(1, Math.round(frequency * result.fftSize / result.sampleRate)));
      const db = 20 * Math.log10(Math.max(frame[bin], 1e-5)); const amount = Math.max(0, Math.min(1, (db + 72) / 54));
      const offset = (y * width + x) * 4;
      image.data[offset] = Math.round(18 + amount * 220);
      image.data[offset + 1] = Math.round(28 + Math.max(0, amount - 0.28) * 210);
      image.data[offset + 2] = Math.round(55 + (1 - amount) * 130);
      image.data[offset + 3] = 255;
    }
  }
  context.putImageData(image, 0, 0);
}

function getLocalDuration(file) {
  return new Promise((resolve, reject) => {
    const audio = document.createElement('audio'); const url = URL.createObjectURL(file); let settled = false;
    const finish = (duration) => { if (settled) return; settled = true; clearTimeout(timeout); audio.removeAttribute('src'); audio.load(); URL.revokeObjectURL(url); Number.isFinite(duration) ? resolve(duration) : reject(new Error('duration')); };
    const timeout = setTimeout(() => finish(NaN), 8000);
    audio.preload = 'metadata'; audio.onloadedmetadata = () => finish(audio.duration); audio.onerror = () => finish(NaN); audio.src = url; audio.load();
  });
}

function setupAudioAnalysisTool(root) {
  const panel = $('[data-audio-analysis]', root); const mode = panel.dataset.audioMode;
  const fileInput = $('#audio-analysis-file', panel); const analyzeButton = $('[data-audio-analyze]', panel); const clearButton = $('[data-audio-clear]', panel);
  const status = $('#op-status', root); const canvas = $('[data-audio-chart]', panel); const keyOutput = $('[data-audio-key]', panel); const alternatives = $('[data-audio-alternatives]', panel);
  let selectedFile = null; let runId = 0;
  const say = (key) => localized(root, key);
  const setStatus = (key, failed = false) => { status.textContent = say(key); status.classList.toggle('is-error', failed); status.classList.toggle('is-success', !failed && key !== 'No audio selected.'); };
  const clearResult = () => {
    if (canvas) canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
    if (keyOutput) keyOutput.textContent = say('Run analysis to see likely keys.');
    alternatives?.replaceChildren();
  };
  const clear = () => {
    runId += 1; selectedFile = null; fileInput.value = ''; analyzeButton.disabled = true; setStatus('No audio selected.');
    clearResult();
  };
  fileInput.addEventListener('change', () => {
    runId += 1;
    selectedFile = fileInput.files?.[0] ?? null; analyzeButton.disabled = !selectedFile;
    if (!selectedFile) { setStatus('No audio selected.'); return; }
    clearResult();
    status.textContent = selectedFile.name; status.classList.remove('is-error', 'is-success');
  });
  clearButton.addEventListener('click', clear);
  analyzeButton.addEventListener('click', async () => {
    const file = selectedFile; if (!file) { setStatus('No audio selected.', true); return; }
    if (validateAudioInput(file.size, null) === 'file-too-large') { setStatus('The file is larger than 25 MB.', true); return; }
    const currentRun = ++runId; analyzeButton.disabled = true; setStatus('Analyzing audio on this device…');
    let audioContext;
    try {
      const duration = await getLocalDuration(file);
      if (currentRun !== runId) return;
      const validation = validateAudioInput(file.size, duration);
      if (validation === 'duration-too-long') { setStatus('The decoded clip is longer than 3 minutes.', true); return; }
      if (validation) throw new Error('decode');
      const AudioContextClass = window.AudioContext ?? window.webkitAudioContext;
      if (!AudioContextClass) throw new Error('decode');
      audioContext = new AudioContextClass({ sampleRate: 22050 });
      const buffer = await audioContext.decodeAudioData(await file.arrayBuffer());
      if (currentRun !== runId) return;
      const decodedValidation = validateAudioInput(file.size, buffer.duration);
      if (decodedValidation === 'duration-too-long') { setStatus('The decoded clip is longer than 3 minutes.', true); return; }
      if (decodedValidation) throw new Error('decode');
      const analysis = analyzeSamples(monoSamples(buffer), buffer.sampleRate, { fftSize: 2048, hopSize: 1024, maxFrames: 800 });
      if (mode === 'spectrogram') paintSpectrogram(canvas, analysis);
      else {
        const [best, ...other] = estimateSongKey(analysis.chroma);
        if (!best) { keyOutput.textContent = say('No clear key detected. Try a longer section with clear harmony.'); alternatives.replaceChildren(); }
        else {
          keyOutput.textContent = `${best.tonic} ${best.mode}`;
          alternatives.replaceChildren(...other.map((candidate) => { const item = document.createElement('li'); item.textContent = `${candidate.tonic} ${candidate.mode}`; return item; }));
        }
      }
      setStatus('Analysis complete.');
    } catch {
      if (currentRun === runId) setStatus('This browser could not decode this audio format.', true);
    } finally {
      await audioContext?.close().catch(() => {});
      if (currentRun === runId) analyzeButton.disabled = !selectedFile;
    }
  });
  clear();
}

export function setupAudioAnalysis(root) { setupAudioAnalysisTool(root); }
