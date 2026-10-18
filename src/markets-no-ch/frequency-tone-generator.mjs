const WAVEFORMS = new Set(['sine', 'square', 'triangle', 'sawtooth']);

export function validateToneSettings(input) {
  const settings = {
    mode: input?.mode ?? 'tone',
    startFrequency: Number(input?.startFrequency),
    endFrequency: Number(input?.endFrequency ?? input?.startFrequency),
    waveform: input?.waveform ?? 'sine',
    channel: input?.channel ?? 'mono',
    duration: Number(input?.duration),
    volume: Number(input?.volume),
    sampleRate: Number(input?.sampleRate ?? 48000),
  };
  if (!['tone', 'sweep'].includes(settings.mode)) throw new RangeError('Choose a tone or sweep.');
  if (!WAVEFORMS.has(settings.waveform)) throw new RangeError('Unsupported waveform.');
  if (!['mono', 'stereo'].includes(settings.channel)) throw new RangeError('Choose mono or stereo.');
  if (!Number.isFinite(settings.sampleRate) || settings.sampleRate < 8000 || settings.sampleRate > 96000) throw new RangeError('Sample rate must be between 8 kHz and 96 kHz.');
  const nyquist = settings.sampleRate / 2;
  if (![settings.startFrequency, settings.endFrequency].every((frequency) => Number.isFinite(frequency) && frequency >= 20 && frequency <= 20000 && frequency < nyquist)) throw new RangeError(`Frequency must be 20–20,000 Hz and below Nyquist (${Math.floor(nyquist)} Hz) for this output rate.`);
  if (!Number.isFinite(settings.duration) || settings.duration < 0.25 || settings.duration > 10) throw new RangeError('Duration must be between 0.25 and 10 seconds.');
  if (!Number.isFinite(settings.volume) || settings.volume < 0 || settings.volume > 0.1) throw new RangeError('Output amplitude must be between 0 and 10%.');
  return Object.freeze(settings);
}

function waveformValue(waveform, cycles) {
  const phase = cycles - Math.floor(cycles);
  if (waveform === 'square') return phase < 0.5 ? 1 : -1;
  if (waveform === 'triangle') return 1 - 4 * Math.abs(phase - 0.5);
  if (waveform === 'sawtooth') return 2 * phase - 1;
  return Math.sin(2 * Math.PI * cycles);
}

export function generateToneSamples(input) {
  const settings = validateToneSettings(input);
  const frameCount = Math.round(settings.sampleRate * settings.duration);
  const channelCount = settings.channel === 'stereo' ? 2 : 1;
  const channels = Array.from({ length: channelCount }, () => new Float32Array(frameCount));
  const fadeFrames = Math.min(Math.round(settings.sampleRate * 0.01), Math.floor(frameCount / 2));
  for (let frame = 0; frame < frameCount; frame += 1) {
    const time = frame / settings.sampleRate;
    const cycles = settings.mode === 'sweep'
      ? settings.startFrequency * time + ((settings.endFrequency - settings.startFrequency) * time * time) / (2 * settings.duration)
      : settings.startFrequency * time;
    const fadeIn = fadeFrames ? Math.min(1, frame / fadeFrames) : 1;
    const fadeOut = fadeFrames ? Math.min(1, (frameCount - 1 - frame) / fadeFrames) : 1;
    const rawSample = waveformValue(settings.waveform, cycles) * settings.volume * Math.max(0, Math.min(fadeIn, fadeOut));
    const sample = rawSample === 0 ? 0 : rawSample;
    for (const channel of channels) channel[frame] = sample;
  }
  return Object.freeze({ sampleRate: settings.sampleRate, duration: settings.duration, channels });
}

export function encodeToneWav(input) {
  const { sampleRate, channels } = input ?? {};
  if (!Number.isInteger(sampleRate) || !Array.isArray(channels) || channels.length < 1 || channels.length > 2) throw new TypeError('Provide one mono or two stereo sample channels.');
  const frameCount = channels[0]?.length;
  if (!Number.isInteger(frameCount) || frameCount < 1 || channels.some((channel) => !(channel instanceof Float32Array) || channel.length !== frameCount) || frameCount > sampleRate * 10) throw new RangeError('WAV output is limited to ten seconds of matching mono or stereo samples.');
  const blockAlign = channels.length * 2;
  const dataBytes = frameCount * blockAlign;
  const bytes = new ArrayBuffer(44 + dataBytes);
  const view = new DataView(bytes);
  const text = (offset, value) => [...value].forEach((character, index) => view.setUint8(offset + index, character.charCodeAt(0)));
  text(0, 'RIFF'); view.setUint32(4, 36 + dataBytes, true); text(8, 'WAVE'); text(12, 'fmt ');
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, channels.length, true);
  view.setUint32(24, sampleRate, true); view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true); view.setUint16(34, 16, true); text(36, 'data'); view.setUint32(40, dataBytes, true);
  let offset = 44;
  for (let frame = 0; frame < frameCount; frame += 1) for (const channel of channels) {
    const sample = Math.max(-1, Math.min(1, channel[frame]));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
    offset += 2;
  }
  return new Uint8Array(bytes);
}
