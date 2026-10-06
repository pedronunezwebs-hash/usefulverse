export function validateAudioEdit(start, end, duration, volume = 1, fadeIn = 0, fadeOut = 0) {
  const values = [start, end, duration, volume, fadeIn, fadeOut].map(Number);
  if (values.some((value) => !Number.isFinite(value))) throw new TypeError('Audio edit values must be finite numbers.');
  const [from, to, total, gain, fadeUp, fadeDown] = values;
  if (total <= 0 || from < 0 || to > total || from >= to) throw new RangeError('Choose a trim range inside the audio duration.');
  if (gain < 0 || gain > 2 || fadeUp < 0 || fadeDown < 0 || fadeUp + fadeDown > to - from) throw new RangeError('Choose valid volume and fade settings.');
  return { start: from, end: to, duration: to - from, volume: gain, fadeIn: fadeUp, fadeOut: fadeDown };
}

export function encodePcm16Wav(channels, sampleRate) {
  if (!Array.isArray(channels) || channels.length < 1 || channels.length > 2 || !Number.isInteger(sampleRate) || sampleRate < 8000 || sampleRate > 192000) throw new TypeError('Use one or two audio channels and a supported sample rate.');
  const frames = channels[0]?.length;
  if (!Number.isInteger(frames) || frames < 1 || channels.some((channel) => channel.length !== frames)) throw new TypeError('Audio channels must have the same nonzero length.');
  const bytes = frames * channels.length * 2;
  if (bytes > 128 * 1024 * 1024) throw new RangeError('The WAV export exceeds the 128 MiB safety limit.');
  const buffer = new ArrayBuffer(44 + bytes); const view = new DataView(buffer);
  const write = (offset, text) => [...text].forEach((character, index) => view.setUint8(offset + index, character.charCodeAt(0)));
  write(0, 'RIFF'); view.setUint32(4, 36 + bytes, true); write(8, 'WAVE'); write(12, 'fmt '); view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); view.setUint16(22, channels.length, true); view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * channels.length * 2, true); view.setUint16(32, channels.length * 2, true); view.setUint16(34, 16, true);
  write(36, 'data'); view.setUint32(40, bytes, true);
  let offset = 44;
  for (let frame = 0; frame < frames; frame += 1) for (const channel of channels) {
    const sample = Math.max(-1, Math.min(1, Number.isFinite(channel[frame]) ? channel[frame] : 0));
    view.setInt16(offset, sample < 0 ? Math.round(sample * 32768) : Math.round(sample * 32767), true); offset += 2;
  }
  return buffer;
}
