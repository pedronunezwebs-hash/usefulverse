const A4 = 440;
const noteNames = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
const majorProfile = [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88];
const minorProfile = [6.33, 2.68, 3.52, 5.38, 2.6, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17];
export const AUDIO_ANALYSIS_MAX_BYTES = 25 * 1024 * 1024;
export const AUDIO_ANALYSIS_MAX_SECONDS = 180;

export function validateAudioInput(fileSize, durationSeconds) {
  if (!Number.isFinite(fileSize) || fileSize <= 0) return 'invalid-file';
  if (fileSize > AUDIO_ANALYSIS_MAX_BYTES) return 'file-too-large';
  if (durationSeconds === null) return 'duration-unknown';
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) return 'invalid-duration';
  if (durationSeconds > AUDIO_ANALYSIS_MAX_SECONDS) return 'duration-too-long';
  return null;
}

export function fft(real, imaginary) {
  const length = real.length;
  if (length < 2 || (length & (length - 1)) !== 0 || imaginary.length !== length) throw new RangeError('FFT input must be equal power-of-two arrays.');
  for (let i = 1, j = 0; i < length; i += 1) {
    let bit = length >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) { [real[i], real[j]] = [real[j], real[i]]; [imaginary[i], imaginary[j]] = [imaginary[j], imaginary[i]]; }
  }
  for (let size = 2; size <= length; size <<= 1) {
    const angle = -2 * Math.PI / size; const stepReal = Math.cos(angle); const stepImag = Math.sin(angle);
    for (let start = 0; start < length; start += size) {
      let wr = 1; let wi = 0; const half = size >> 1;
      for (let offset = 0; offset < half; offset += 1) {
        const even = start + offset; const odd = even + half;
        const tr = wr * real[odd] - wi * imaginary[odd]; const ti = wr * imaginary[odd] + wi * real[odd];
        real[odd] = real[even] - tr; imaginary[odd] = imaginary[even] - ti;
        real[even] += tr; imaginary[even] += ti;
        const nextWr = wr * stepReal - wi * stepImag; wi = wr * stepImag + wi * stepReal; wr = nextWr;
      }
    }
  }
  return { real, imaginary };
}

function spectrumForFrame(samples, start, size, sampleRate) {
  const real = new Float64Array(size); const imaginary = new Float64Array(size);
  for (let i = 0; i < size; i += 1) {
    const sample = samples[start + i] ?? 0;
    real[i] = sample * (0.5 - 0.5 * Math.cos(2 * Math.PI * i / (size - 1)));
  }
  fft(real, imaginary);
  const bins = new Float32Array(size / 2);
  for (let i = 1; i < bins.length; i += 1) bins[i] = Math.hypot(real[i], imaginary[i]) * 2 / size;
  return { bins, sampleRate };
}

export function analyzeSamples(samples, sampleRate, { fftSize = 2048, hopSize = 1024, maxFrames = 800 } = {}) {
  if (!(samples instanceof Float32Array) || !Number.isFinite(sampleRate) || sampleRate < 4000) throw new TypeError('Valid mono audio samples and sample rate are required.');
  if (fftSize < 256 || fftSize > 4096 || (fftSize & (fftSize - 1)) !== 0 || hopSize < 1 || hopSize > fftSize || maxFrames < 1 || maxFrames > 1200) throw new RangeError('Audio analysis settings are outside safe limits.');
  if (!samples.length) throw new RangeError('Audio contains no samples.');
  const frameCount = Math.min(maxFrames, Math.max(1, Math.ceil(samples.length / hopSize)));
  const stride = Math.max(1, Math.floor((samples.length - fftSize) / Math.max(1, frameCount - 1)));
  const frames = []; const chroma = new Float64Array(12);
  for (let frame = 0, start = 0; frame < frameCount; frame += 1, start += stride) {
    const { bins } = spectrumForFrame(samples, start, fftSize, sampleRate); frames.push(bins);
    for (let bin = 2; bin < bins.length; bin += 1) {
      const frequency = bin * sampleRate / fftSize;
      if (frequency < 55 || frequency > 2200 || bins[bin] < 0.0002) continue;
      const note = Math.round(12 * Math.log2(frequency / A4)) + 9;
      chroma[((note % 12) + 12) % 12] += bins[bin];
    }
  }
  return { frames, sampleRate, fftSize, chroma };
}

const correlation = (left, right) => {
  const meanA = left.reduce((sum, value) => sum + value, 0) / left.length;
  const meanB = right.reduce((sum, value) => sum + value, 0) / right.length;
  let numerator = 0; let denominatorA = 0; let denominatorB = 0;
  for (let i = 0; i < left.length; i += 1) { const a = left[i] - meanA; const b = right[i] - meanB; numerator += a * b; denominatorA += a * a; denominatorB += b * b; }
  return denominatorA && denominatorB ? numerator / Math.sqrt(denominatorA * denominatorB) : 0;
};

export function estimateSongKey(chroma) {
  if (!Array.isArray(chroma) && !(chroma instanceof Float32Array) && !(chroma instanceof Float64Array)) throw new TypeError('A 12-note chroma profile is required.');
  if (chroma.length !== 12 || chroma.some((value) => !Number.isFinite(value) || value < 0)) throw new RangeError('Chroma must contain 12 non-negative values.');
  if (chroma.reduce((sum, value) => sum + value, 0) === 0) return [];
  const candidates = [];
  for (let root = 0; root < 12; root += 1) {
    const rotated = Array.from({ length: 12 }, (_, index) => chroma[(index + root) % 12]);
    candidates.push({ tonic: noteNames[root], mode: 'major', score: correlation(rotated, majorProfile) });
    candidates.push({ tonic: noteNames[root], mode: 'minor', score: correlation(rotated, minorProfile) });
  }
  return candidates.sort((a, b) => b.score - a.score).slice(0, 3).map((candidate, rank) => ({ ...candidate, rank: rank + 1 }));
}

export function formatPitchFrequency(frequency) {
  if (!Number.isFinite(frequency) || frequency <= 0) return null;
  const midi = Math.round(69 + 12 * Math.log2(frequency / A4));
  const cents = Math.round(1200 * Math.log2(frequency / (A4 * 2 ** ((midi - 69) / 12))));
  return { note: noteNames[((midi % 12) + 12) % 12], octave: Math.floor(midi / 12) - 1, cents };
}
