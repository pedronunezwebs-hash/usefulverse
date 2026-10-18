export function pitchRate(semitones) {
  if (!Number.isFinite(semitones) || semitones < -12 || semitones > 12) throw new RangeError('Pitch must be between -12 and 12 semitones.');
  return 2 ** (semitones / 12);
}

export function effectParameters(preset, semitones = 0, volume = 0.7) {
  if (!['clean', 'radio', 'deep', 'bright', 'echo'].includes(preset)) throw new RangeError('Unsupported effect preset.');
  if (!Number.isFinite(volume) || volume < 0 || volume > 1) throw new RangeError('Volume must be between 0 and 1.');
  const base = { clean: 0, radio: 0, deep: -4, bright: 3, echo: 0 }[preset];
  const shift = Math.max(-12, Math.min(12, base + semitones));
  return Object.freeze({
    playbackRate: pitchRate(shift), volume,
    filter: preset === 'radio' ? 'bandpass' : preset === 'deep' ? 'lowpass' : preset === 'bright' ? 'highpass' : 'allpass',
    frequency: preset === 'radio' ? 1500 : preset === 'deep' ? 850 : preset === 'bright' ? 240 : 18000,
    echo: preset === 'echo',
  });
}

export function encodeWav(audioBuffer) {
  if (!audioBuffer || !Number.isInteger(audioBuffer.numberOfChannels) || !Number.isInteger(audioBuffer.sampleRate) || audioBuffer.length < 1) throw new TypeError('A decoded audio buffer is required.');
  const channels = audioBuffer.numberOfChannels;
  if (channels < 1 || channels > 2 || audioBuffer.length > audioBuffer.sampleRate * 60) throw new RangeError('WAV export is limited to one minute and two channels.');
  const bytesPerSample = 2;
  const dataLength = audioBuffer.length * channels * bytesPerSample;
  const output = new ArrayBuffer(44 + dataLength);
  const view = new DataView(output);
  const ascii = (offset, value) => [...value].forEach((character, index) => view.setUint8(offset + index, character.charCodeAt(0)));
  ascii(0, 'RIFF'); view.setUint32(4, 36 + dataLength, true); ascii(8, 'WAVE'); ascii(12, 'fmt ');
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, channels, true);
  view.setUint32(24, audioBuffer.sampleRate, true); view.setUint32(28, audioBuffer.sampleRate * channels * bytesPerSample, true);
  view.setUint16(32, channels * bytesPerSample, true); view.setUint16(34, 16, true); ascii(36, 'data'); view.setUint32(40, dataLength, true);
  let offset = 44;
  for (let frame = 0; frame < audioBuffer.length; frame += 1) {
    for (let channel = 0; channel < channels; channel += 1) {
      const sample = Math.max(-1, Math.min(1, audioBuffer.getChannelData(channel)[frame]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += bytesPerSample;
    }
  }
  return new Uint8Array(output);
}
