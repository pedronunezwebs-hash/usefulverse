import { effectParameters, encodeWav } from './voice-changer.mjs';

export function initVoiceChanger(documentRef = document, windowRef = window) {
  const root = documentRef.querySelector('[data-voice-changer]');
  if (!root) return () => {};
  const copyNode = documentRef.querySelector('[data-tool-copy]');
  let fields;
  try { fields = JSON.parse(copyNode?.textContent ?? '{}').fields; } catch { return () => {}; }
  if (!fields) return () => {};
  const q = (selector) => root.querySelector(selector);
  const input = q('[data-vc-file]'); const loadButton = q('[data-vc-load]'); const previewButton = q('[data-vc-preview]'); const stopButton = q('[data-vc-stop]');
  const exportButton = q('[data-vc-export]'); const clearButton = q('[data-vc-clear]'); const preset = q('[data-vc-preset]');
  const pitch = q('[data-vc-pitch]'); const volume = q('[data-vc-volume]'); const status = q('[data-vc-status]');
  const pitchValue = q('[data-vc-pitch-value]'); const volumeValue = q('[data-vc-volume-value]');
  let buffer = null; let context = null; let source = null; let disconnectEffect = () => {}; let decodeVersion = 0; let exporting = false;

  function say(message) { status.textContent = message; }
  function options() { return effectParameters(preset.value, Number(pitch.value), Number(volume.value) / 100); }
  function stop() {
    try { source?.stop(); } catch {}
    source?.disconnect(); source = null;
    disconnectEffect(); disconnectEffect = () => {};
    stopButton.disabled = true;
    previewButton.disabled = !buffer;
    loadButton.disabled = !buffer;
  }
  function connectEffect(audioContext, audioSource, destination, settings) {
    const filter = audioContext.createBiquadFilter();
    filter.type = settings.filter;
    filter.frequency.value = settings.frequency;
    filter.Q.value = settings.filter === 'bandpass' ? 0.8 : 0.7;
    const output = audioContext.createGain(); output.gain.value = Math.min(0.8, settings.volume);
    audioSource.connect(filter); filter.connect(output);
    const nodes = [filter, output];
    if (settings.echo) {
      const dry = audioContext.createGain(); dry.gain.value = 0.76;
      const delay = audioContext.createDelay(0.8); delay.delayTime.value = 0.22;
      const feedback = audioContext.createGain(); feedback.gain.value = 0.2;
      const wet = audioContext.createGain(); wet.gain.value = 0.35;
      filter.connect(dry); dry.connect(output);
      filter.connect(delay); delay.connect(wet); wet.connect(output);
      delay.connect(feedback); feedback.connect(delay);
      nodes.push(dry, delay, feedback, wet);
    } else filter.connect(output);
    output.connect(destination);
    return () => nodes.forEach((node) => { try { node.disconnect(); } catch {} });
  }
  async function loadAudio() {
    const file = input.files?.[0];
    if (!file) { say(fields.chooseFirst); return; }
    if (file.size > 25 * 1024 * 1024) { say(fields.tooLarge); return; }
    const version = ++decodeVersion; stop(); buffer = null; loadButton.disabled = true; exportButton.disabled = true;
    say(fields.loading);
    try {
      context ??= new (windowRef.AudioContext ?? windowRef.webkitAudioContext)();
      await context.resume();
      const decoded = await context.decodeAudioData(await file.arrayBuffer());
      if (version !== decodeVersion) return;
      if (decoded.duration > 30) { say(fields.tooLong); return; }
      buffer = decoded;
      loadButton.disabled = false; previewButton.disabled = false; exportButton.disabled = false;
      say(fields.loaded.replace('{duration}', decoded.duration.toFixed(1)));
    } catch { if (version === decodeVersion) say(fields.decodeFailed); }
    finally { if (version === decodeVersion && !buffer) loadButton.disabled = false; }
  }
  function preview() {
    if (!buffer) { say(fields.noAudio); return; }
    stop();
    const settings = options();
    source = context.createBufferSource(); source.buffer = buffer; source.playbackRate.value = settings.playbackRate;
    disconnectEffect = connectEffect(context, source, context.destination, settings);
    source.onended = () => { if (source) { source.disconnect(); source = null; disconnectEffect(); disconnectEffect = () => {}; stopButton.disabled = true; loadButton.disabled = false; } };
    source.start(); stopButton.disabled = false; loadButton.disabled = true;
    say(fields.playbackRateNote);
  }
  async function exportWav() {
    if (!buffer) { say(fields.noAudio); return; }
    if (exporting) return;
    const settings = options(); const rate = settings.playbackRate;
    const tail = settings.echo ? 1 : 0.05;
    const duration = buffer.duration / rate + tail;
    if (!Number.isFinite(duration) || duration > 60) { say(fields.tooLong); return; }
    const Offline = windowRef.OfflineAudioContext ?? windowRef.webkitOfflineAudioContext;
    if (!Offline) { say(fields.decodeFailed); return; }
    exporting = true; exportButton.disabled = true; say(fields.processing);
    try {
      const sampleRate = Math.min(buffer.sampleRate, 48000);
      const length = Math.ceil(duration * sampleRate);
      const offline = new Offline(Math.min(2, buffer.numberOfChannels), length, sampleRate);
      const offlineSource = offline.createBufferSource(); offlineSource.buffer = buffer; offlineSource.playbackRate.value = rate;
      connectEffect(offline, offlineSource, offline.destination, settings);
      offlineSource.start();
      const rendered = await offline.startRendering();
      const wav = encodeWav(rendered);
      const url = windowRef.URL.createObjectURL(new Blob([wav], { type: 'audio/wav' }));
      const link = documentRef.createElement('a'); link.href = url; link.download = fields.outputName;
      documentRef.body.append(link); link.click(); link.remove(); windowRef.setTimeout(() => windowRef.URL.revokeObjectURL(url), 1500);
      say(fields.exportReady);
    } catch { say(fields.decodeFailed); }
    finally { exporting = false; exportButton.disabled = !buffer; }
  }

  input.addEventListener('change', () => { decodeVersion += 1; stop(); buffer = null; loadButton.disabled = false; previewButton.disabled = true; exportButton.disabled = true; say(fields.chooseFirst); });
  pitch.addEventListener('input', () => { pitchValue.value = `${Number(pitch.value) > 0 ? '+' : ''}${pitch.value}`; });
  volume.addEventListener('input', () => { volumeValue.value = `${volume.value}%`; });
  loadButton.addEventListener('click', loadAudio);
  previewButton.addEventListener('click', preview);
  stopButton.addEventListener('click', () => { stop(); say(fields.chooseFirst); });
  exportButton.addEventListener('click', exportWav);
  clearButton.addEventListener('click', () => { decodeVersion += 1; stop(); buffer = null; input.value = ''; previewButton.disabled = true; exportButton.disabled = true; say(fields.chooseFirst); });
  return () => { decodeVersion += 1; stop(); context?.close(); context = null; buffer = null; };
}

if (typeof document !== 'undefined') initVoiceChanger();
