import { env, pipeline } from '@huggingface/transformers';

const MODEL = 'Xenova/whisper-tiny';
const MODEL_REVISION = '5332fcc35e32a33b86612b9a57a89be7906102b1';
let transcriber;

function post(type, id, values = {}) {
  self.postMessage({ type, id, ...values });
}

self.addEventListener('message', async ({ data }) => {
  if (data.type === 'initialize') {
    try {
      env.backends.onnx.wasm.numThreads = 1;
      env.backends.onnx.wasm.proxy = false;
      env.backends.onnx.wasm.wasmPaths = {
        mjs: new URL('/assets/vendor/onnx/ort-wasm-simd-threaded.mjs', self.location.origin).href,
        wasm: new URL('/assets/vendor/onnx/ort-wasm-simd-threaded.wasm', self.location.origin).href,
      };
      env.useBrowserCache = true;
      transcriber = await pipeline('automatic-speech-recognition', MODEL, {
        revision: MODEL_REVISION,
        dtype: 'q8',
        device: 'wasm',
        progress_callback: (info) => {
          if (info.status === 'progress' && Number.isFinite(info.progress)) {
            post('model-progress', data.id, { progress: Math.max(0, Math.min(100, Math.round(info.progress))) });
          } else if (info.status === 'initiate' || info.status === 'download') {
            post('model-stage', data.id, { stage: info.status });
          }
        },
      });
      post('ready', data.id);
    } catch (error) {
      post('error', data.id, { message: error instanceof Error ? error.message : String(error) });
    }
    return;
  }

  if (data.type === 'transcribe') {
    try {
      if (!transcriber) throw new Error('The speech model did not finish loading. Refresh this page and try again.');
      const audio = new Float32Array(data.audioBuffer);
      const result = await transcriber(audio, {
        sampling_rate: 16_000,
        task: 'transcribe',
        ...(data.language ? { language: data.language } : {}),
      });
      post('transcript', data.id, { text: result.text ?? '' });
    } catch (error) {
      post('error', data.id, { message: error instanceof Error ? error.message : String(error) });
    }
    return;
  }

  if (data.type === 'dispose') {
    transcriber = undefined;
  }
});
