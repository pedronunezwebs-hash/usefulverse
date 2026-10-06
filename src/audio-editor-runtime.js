import { encodePcm16Wav, validateAudioEdit } from './audio-editor-logic.mjs';

const $ = (selector, root) => root.querySelector(selector);
const cache = new WeakMap();
function say(root, key) {
  let messages = cache.get(root);
  if (!messages) { try { messages = JSON.parse(root.dataset.plannerMessages || '{}'); } catch { messages = {}; } cache.set(root, messages); }
  return messages[key] ?? key;
}
function status(root, key, error = false) { const node = $('#op-status', root); if (node) { node.textContent = say(root, key); node.className = `tool-status${error ? ' is-error' : ''}`; } }
function formatTime(seconds) { const minutes = Math.floor(seconds / 60); return `${minutes}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`; }
function probeDuration(file) {
  const url = URL.createObjectURL(file); const audio = new Audio(); audio.preload = 'metadata'; audio.src = url;
  let settled = false;
  return new Promise((resolve, reject) => {
    const finish = (error, duration) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout); audio.removeAttribute('src'); audio.load(); URL.revokeObjectURL(url);
      if (error) reject(error); else resolve(duration);
    };
    const timeout = setTimeout(() => finish(new Error('Audio metadata timeout.')), 10000);
    audio.addEventListener('loadedmetadata', () => finish(null, audio.duration), { once: true });
    audio.addEventListener('error', () => finish(new Error('Unsupported audio format.')), { once: true });
    audio.load();
  });
}

export function setupAudioEditor(root) {
  const file = $('[data-audio-edit-file]', root); const startInput = $('[data-audio-edit-start]', root); const endInput = $('[data-audio-edit-end]', root);
  let context; let buffer; let source; let generation = 0;
  const cleanup = async () => {
    generation += 1;
    try { source?.stop(); } catch { /* already stopped */ }
    source = null;
    if (context && context.state !== 'closed') await context.close().catch(() => {});
    context = null; buffer = null;
    const link = $('[data-audio-edit-download]', root);
    if (link?.dataset.url) URL.revokeObjectURL(link.dataset.url);
    if (link) { link.removeAttribute('href'); delete link.dataset.url; link.hidden = true; }
  };
  const readRange = () => {
    if (!buffer) throw new TypeError('Choose an audio file first.');
    return validateAudioEdit(startInput.value, endInput.value, buffer.duration, $('[data-audio-edit-volume]', root).value, $('[data-audio-edit-fade-in]', root).value, $('[data-audio-edit-fade-out]', root).value);
  };
  file.addEventListener('change', async () => {
    await cleanup(); const picked = file.files?.[0]; if (!picked) return status(root, 'Choose a short audio file to begin.');
    if (picked.size > 25 * 1024 * 1024) { file.value = ''; return status(root, 'Choose an audio file under 25 MB.', true); }
    const request = generation;
    try {
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtor) throw new Error('This browser does not support local audio editing.');
      const duration = await probeDuration(picked);
      if (request !== generation) return;
      if (!Number.isFinite(duration) || duration <= 0 || duration > 180) throw new RangeError('Choose audio up to 3 minutes with one or two channels.');
      context = new AudioCtor();
      const decoder = context;
      const decoded = await decoder.decodeAudioData(await picked.arrayBuffer());
      if (request !== generation) return;
      if (decoded.numberOfChannels > 2) throw new RangeError('Choose audio up to 3 minutes with one or two channels.');
      buffer = decoded; startInput.min = '0'; startInput.max = String(decoded.duration); startInput.step = '0.01'; startInput.value = '0';
      endInput.min = '0.01'; endInput.max = String(decoded.duration); endInput.step = '0.01'; endInput.value = String(decoded.duration);
      $('[data-audio-edit-duration]', root).textContent = formatTime(decoded.duration);
      $('[data-audio-edit-play]', root).disabled = false; $('[data-audio-edit-export]', root).disabled = false;
      status(root, 'Audio loaded locally. Adjust the trim and export settings.');
    } catch (error) {
      if (request !== generation) return;
      await cleanup(); file.value = '';
      status(root, error instanceof RangeError ? 'Choose audio up to 3 minutes with one or two channels.' : 'This audio format could not be opened in this browser.', true);
    }
  });
  root.addEventListener('click', async (event) => {
    if (event.target.closest('[data-audio-edit-stop]')) { try { source?.stop(); } catch {} source = null; return status(root, 'Playback stopped.'); }
    if (event.target.closest('[data-audio-edit-play]')) {
      try {
        const range = readRange(); if (!context || context.state === 'closed') context = new (window.AudioContext || window.webkitAudioContext)();
        await context.resume(); try { source?.stop(); } catch {}
        source = context.createBufferSource(); const gain = context.createGain(); source.buffer = buffer; source.connect(gain); gain.connect(context.destination);
        const at = context.currentTime + 0.02; gain.gain.setValueAtTime(0, at); gain.gain.linearRampToValueAtTime(range.volume, at + Math.min(0.02, range.duration / 3));
        if (range.fadeIn) gain.gain.setValueAtTime(0, at), gain.gain.linearRampToValueAtTime(range.volume, at + range.fadeIn);
        if (range.fadeOut) { gain.gain.setValueAtTime(range.volume, at + range.duration - range.fadeOut); gain.gain.linearRampToValueAtTime(0, at + range.duration); }
        const currentSource = source;
        source.start(at, range.start, range.duration); currentSource.onended = () => { if (source === currentSource) { source = null; status(root, 'Playback finished.'); } };
        status(root, 'Playing the edited selection.');
      } catch { status(root, 'Choose a valid trim range and audio file first.', true); }
    }
    if (event.target.closest('[data-audio-edit-export]')) {
      try {
        const range = readRange(); const length = Math.max(1, Math.ceil(range.duration * buffer.sampleRate));
        if (length * buffer.numberOfChannels * 2 > 128 * 1024 * 1024) throw new RangeError('WAV export exceeds the 128 MiB safety limit.');
        const OfflineCtor = window.OfflineAudioContext || window.webkitOfflineAudioContext;
        if (!OfflineCtor) throw new Error('Offline audio export is unavailable in this browser.');
        const offline = new OfflineCtor(buffer.numberOfChannels, length, buffer.sampleRate); const clip = offline.createBufferSource(); const gain = offline.createGain();
        clip.buffer = buffer; clip.connect(gain); gain.connect(offline.destination); gain.gain.setValueAtTime(range.fadeIn ? 0 : range.volume, 0);
        if (range.fadeIn) gain.gain.linearRampToValueAtTime(range.volume, range.fadeIn);
        if (range.fadeOut) { gain.gain.setValueAtTime(range.volume, Math.max(0, range.duration - range.fadeOut)); gain.gain.linearRampToValueAtTime(0, range.duration); }
        clip.start(0, range.start, range.duration); status(root, 'Rendering WAV on this device…');
        const rendered = await offline.startRendering(); const channels = Array.from({ length: rendered.numberOfChannels }, (_, index) => rendered.getChannelData(index));
        const blob = new Blob([encodePcm16Wav(channels, rendered.sampleRate)], { type: 'audio/wav' });
        const link = $('[data-audio-edit-download]', root); if (link.dataset.url) URL.revokeObjectURL(link.dataset.url);
        link.href = URL.createObjectURL(blob); link.dataset.url = link.href; link.hidden = false; status(root, 'WAV export is ready to download.');
      } catch (error) { status(root, error instanceof RangeError && /128 MiB/u.test(error.message) ? 'WAV export exceeds the 128 MiB safety limit.' : error instanceof RangeError ? 'Choose valid volume, fades and trim values.' : 'Audio export failed. Try a shorter supported clip.', true); }
    }
    if (event.target.closest('[data-audio-edit-clear]')) { await cleanup(); file.value = ''; startInput.value = ''; endInput.value = ''; $('[data-audio-edit-duration]', root).textContent = '—'; $('[data-audio-edit-play]', root).disabled = true; $('[data-audio-edit-export]', root).disabled = true; status(root, 'Audio cleared from this page.'); }
  });
}
