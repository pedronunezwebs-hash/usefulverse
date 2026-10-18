import { encodeToneWav, generateToneSamples, validateToneSettings } from './frequency-tone-generator.mjs';

export function initFrequencyToneGenerator(documentRef = document, windowRef = window) {
  const root = documentRef.querySelector('[data-frequency-tone]');
  if (!root) return () => {};
  let fields;
  try { fields = JSON.parse(documentRef.querySelector('[data-tool-copy]')?.textContent ?? '{}').fields; } catch { return () => {}; }
  if (!fields) return () => {};
  const q = (selector) => root.querySelector(selector);
  const mode = q('[data-tone-mode]'); const frequency = q('[data-tone-frequency]'); const start = q('[data-tone-start]'); const end = q('[data-tone-end]');
  const waveform = q('[data-tone-waveform]'); const channel = q('[data-tone-channel]'); const duration = q('[data-tone-duration]'); const volume = q('[data-tone-volume]');
  const preset = q('[data-tone-preset]'); const playButton = q('[data-tone-play]'); const stopButton = q('[data-tone-stop]'); const exportButton = q('[data-tone-export]'); const status = q('[data-tone-status]');
  let context; let oscillator; let gain; let merger; let timer; let token = 0;

  const say = (message) => { status.textContent = message; };
  function updateMode() {
    const sweeping = mode.value === 'sweep';
    q('[data-tone-single]').hidden = sweeping;
    q('[data-tone-sweep]').hidden = !sweeping;
  }
  function readSettings(sampleRate = 48000) {
    return validateToneSettings({ mode: mode.value, startFrequency: mode.value === 'sweep' ? start.value : frequency.value, endFrequency: mode.value === 'sweep' ? end.value : frequency.value, waveform: waveform.value, channel: channel.value, duration: duration.value, volume: Number(volume.value) / 100, sampleRate });
  }
  function cleanup() {
    token += 1;
    windowRef.clearTimeout(timer); timer = undefined;
    try { oscillator?.stop(); } catch {}
    oscillator?.disconnect(); gain?.disconnect(); merger?.disconnect();
    oscillator = gain = merger = undefined;
    const oldContext = context; context = undefined;
    if (oldContext && oldContext.state !== 'closed') oldContext.close().catch(() => {});
    playButton.disabled = false; stopButton.disabled = true;
  }
  function stop(message = fields.finished) { cleanup(); say(message); }

  mode.addEventListener('change', updateMode);
  preset.addEventListener('change', () => {
    if (preset.value === 'sweep') { mode.value = 'sweep'; start.value = '200'; end.value = '1200'; }
    else if (preset.value !== 'custom') { mode.value = 'tone'; frequency.value = preset.value; }
    updateMode();
  });
  playButton.addEventListener('click', async () => {
    cleanup();
    const currentToken = token;
    const Audio = windowRef.AudioContext ?? windowRef.webkitAudioContext;
    if (!Audio) { say(fields.unsupported); return; }
    try {
      context = new Audio();
      const settings = readSettings(context.sampleRate);
      await context.resume();
      if (currentToken !== token) return;
      oscillator = context.createOscillator(); gain = context.createGain();
      oscillator.type = settings.waveform;
      const at = context.currentTime + 0.015;
      oscillator.frequency.setValueAtTime(settings.startFrequency, at);
      if (settings.mode === 'sweep') oscillator.frequency.linearRampToValueAtTime(settings.endFrequency, at + settings.duration);
      gain.gain.setValueAtTime(0, at);
      gain.gain.linearRampToValueAtTime(settings.volume, at + Math.min(0.015, settings.duration / 4));
      gain.gain.setValueAtTime(settings.volume, at + settings.duration - Math.min(0.02, settings.duration / 4));
      gain.gain.linearRampToValueAtTime(0, at + settings.duration);
      oscillator.connect(gain);
      if (settings.channel === 'stereo') {
        merger = context.createChannelMerger(2);
        gain.connect(merger, 0, 0); gain.connect(merger, 0, 1); merger.connect(context.destination);
      } else gain.connect(context.destination);
      oscillator.onended = () => { if (currentToken === token) stop(fields.finished); };
      oscillator.start(at); oscillator.stop(at + settings.duration + 0.01);
      playButton.disabled = true; stopButton.disabled = false; say(fields.playing);
      timer = windowRef.setTimeout(() => { if (currentToken === token) stop(fields.finished); }, (settings.duration + 0.1) * 1000);
    } catch (error) {
      cleanup();
      say(error instanceof RangeError && /frequency/iu.test(error.message) ? fields.tooHigh : fields.invalid);
    }
  });
  stopButton.addEventListener('click', () => stop(fields.finished));
  exportButton.addEventListener('click', () => {
    try {
      const settings = readSettings(48000);
      const wav = encodeToneWav(generateToneSamples(settings));
      const url = windowRef.URL.createObjectURL(new Blob([wav], { type: 'audio/wav' }));
      const link = documentRef.createElement('a'); link.href = url; link.download = 'usefulverse-frequency-tone.wav';
      documentRef.body.append(link); link.click(); link.remove(); windowRef.setTimeout(() => windowRef.URL.revokeObjectURL(url), 1000);
      say(fields.exported);
    } catch (error) { say(error instanceof RangeError && /frequency/iu.test(error.message) ? fields.tooHigh : fields.invalid); }
  });
  documentRef.addEventListener('visibilitychange', () => { if (documentRef.hidden && oscillator) stop(fields.finished); });
  updateMode();
  return () => { cleanup(); mode.removeEventListener('change', updateMode); };
}

if (typeof document !== 'undefined') initFrequencyToneGenerator();
