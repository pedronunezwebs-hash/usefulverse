import * as ort from 'onnxruntime-web/wasm';

const MODEL_URL = 'https://huggingface.co/MixDirective/open-unmix-umxhq-vocals-onnx/resolve/e06097d3193a4c3168b5ddd2a479a680b1176c16/model.onnx';
const MODEL_SHA256 = 'f27742bb52b24cb039614dc76d0764e279df3eb2a9d6daa82c6daee3369ec747';
const N = 4096; const HOP = 1024; const BINS = N / 2 + 1; const RATE = 44100; let sessionPromise;

function reflect(index, length) {
  if (length <= 1) return 0;
  const period = 2 * length - 2; let x = ((index % period) + period) % period;
  if (x >= length) x = period - x;
  return x;
}

function fft(real, imag, inverse = false) {
  const n = real.length;
  for (let i = 1, j = 0; i < n; i += 1) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) { [real[i], real[j]] = [real[j], real[i]]; [imag[i], imag[j]] = [imag[j], imag[i]]; }
  }
  for (let size = 2; size <= n; size <<= 1) {
    const half = size >> 1; const sign = inverse ? 1 : -1; const angle = sign * 2 * Math.PI / size;
    for (let start = 0; start < n; start += size) for (let j = 0; j < half; j += 1) {
      const wr = Math.cos(angle * j); const wi = Math.sin(angle * j); const even = start + j; const odd = even + half;
      const tr = wr * real[odd] - wi * imag[odd]; const ti = wr * imag[odd] + wi * real[odd];
      real[odd] = real[even] - tr; imag[odd] = imag[even] - ti; real[even] += tr; imag[even] += ti;
    }
  }
  if (inverse) for (let i = 0; i < n; i += 1) { real[i] /= n; imag[i] /= n; }
}

async function getSession() {
  if (!sessionPromise) {
    ort.env.wasm.wasmPaths = '/assets/vocal-remover/';
    ort.env.wasm.numThreads = 1;
    sessionPromise = (async () => {
      postMessage({ type: 'progress', key: 'downloading' });
      const response = await fetch(MODEL_URL, { cache: 'force-cache', mode: 'cors' });
      if (!response.ok) throw new Error('model-download');
      const bytes = await response.arrayBuffer();
      if (bytes.byteLength !== 35_623_512) throw new Error('model-size');
      const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map((b) => b.toString(16).padStart(2, '0')).join('');
      if (hash !== MODEL_SHA256) throw new Error('model-hash');
      return ort.InferenceSession.create(bytes, { executionProviders: ['wasm'], graphOptimizationLevel: 'all' });
    })();
  }
  return sessionPromise;
}

function wav(channels) {
  const length = channels[0].length; const bytes = new ArrayBuffer(44 + length * channels.length * 2); const view = new DataView(bytes);
  const str = (offset, value) => { for (let i = 0; i < value.length; i += 1) view.setUint8(offset + i, value.charCodeAt(i)); };
  str(0, 'RIFF'); view.setUint32(4, bytes.byteLength - 8, true); str(8, 'WAVE'); str(12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, channels.length, true); view.setUint32(24, RATE, true); view.setUint32(28, RATE * channels.length * 2, true); view.setUint16(32, channels.length * 2, true); view.setUint16(34, 16, true); str(36, 'data'); view.setUint32(40, bytes.byteLength - 44, true);
  let offset = 44;
  for (let i = 0; i < length; i += 1) for (const channel of channels) { const sample = Math.max(-1, Math.min(1, channel[i])); view.setInt16(offset, sample < 0 ? sample * 32768 : sample * 32767, true); offset += 2; }
  return bytes;
}

async function separate(channels) {
  const length = channels[0].length;
  if (!length || length > RATE * 30 || channels.length !== 2 || channels.some((channel) => channel.length !== length)) throw new Error('audio-limit');
  const frames = Math.floor(length / HOP) + 1; const plane = frames * N;
  const real = new Float32Array(2 * plane); const imag = new Float32Array(2 * plane); const magnitudes = new Float32Array(2 * BINS * frames);
  const fftReal = new Float64Array(N); const fftImag = new Float64Array(N);
  for (let channel = 0; channel < 2; channel += 1) {
    for (let frame = 0; frame < frames; frame += 1) {
      const center = frame * HOP; const base = channel * plane + frame * N;
      for (let i = 0; i < N; i += 1) { const sample = channels[channel][reflect(center + i - N / 2, length)]; const window = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / N); fftReal[i] = sample * window; fftImag[i] = 0; }
      fft(fftReal, fftImag);
      const magBase = (channel * BINS) * frames + frame;
      for (let bin = 0; bin < BINS; bin += 1) { real[base + bin] = fftReal[bin]; imag[base + bin] = fftImag[bin]; magnitudes[magBase + bin * frames] = Math.hypot(fftReal[bin], fftImag[bin]); }
      if (channel === 0 && frame % 64 === 0) postMessage({ type: 'progress', key: 'processing', fraction: frame / (frames * 2) });
    }
  }
  const session = await getSession();
  postMessage({ type: 'progress', key: 'processing', fraction: 0.52 });
  const feeds = { magnitude: new ort.Tensor('float32', magnitudes, [1, 2, BINS, frames]) };
  const result = await session.run(feeds); const vocalMagnitude = result.vocals_magnitude.data;
  const vocal = [new Float32Array(length), new Float32Array(length)]; const denom = new Float32Array(length);
  const outRe = new Float64Array(N); const outIm = new Float64Array(N); const vocalPadded = [new Float64Array(length + N), new Float64Array(length + N)]; const accDenom = new Float64Array(length + N);
  for (let frame = 0; frame < frames; frame += 1) {
    for (let channel = 0; channel < 2; channel += 1) {
      const base = channel * plane + frame * N; const magBase = (channel * BINS) * frames + frame;
      outRe.fill(0); outIm.fill(0);
      for (let bin = 0; bin < BINS; bin += 1) {
        const originalMag = magnitudes[magBase + bin * frames]; const estimate = vocalMagnitude[magBase + bin * frames]; const mask = originalMag > 1e-8 ? Math.max(0, Math.min(1, estimate / originalMag)) : 0;
        const r = real[base + bin] * mask; const im = imag[base + bin] * mask;
        outRe[bin] = r; outIm[bin] = im;
        if (bin > 0 && bin < N / 2) { outRe[N - bin] = r; outIm[N - bin] = -im; }
      }
      fft(outRe, outIm, true);
      const start = frame * HOP;
      for (let i = 0; i < N; i += 1) { const index = start + i; if (index >= vocalPadded[channel].length) continue; const w = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / N); vocalPadded[channel][index] += outRe[i] * w; if (channel === 0) accDenom[index] += w * w; }
    }
    if (frame % 64 === 0) postMessage({ type: 'progress', key: 'processing', fraction: 0.52 + 0.48 * frame / frames });
  }
  const pad = N / 2;
  for (let i = 0; i < length; i += 1) {
    const d = accDenom[i + pad] || 1;
    for (let channel = 0; channel < 2; channel += 1) vocal[channel][i] = vocalPadded[channel][i + pad] / d;
  }
  const accompaniment = channels.map((channel, i) => Float32Array.from(channel, (sample, index) => sample - vocal[i][index]));
  return [wav(vocal), wav(accompaniment)];
}

self.addEventListener('message', async ({ data }) => {
  if (data?.type !== 'separate') return;
  try { const stems = await separate(data.channels.map((channel) => new Float32Array(channel))); postMessage({ type: 'complete', stems }, stems); }
  catch (error) { postMessage({ type: 'error', message: String(error?.message ?? 'processing') }); }
});
