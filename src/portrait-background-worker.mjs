import { env, pipeline } from '@huggingface/transformers';

let removerPromise;
const modelRevision = 'fa2fa546052fba4c08921230a26cc69a333fca12';

function getRemover(onProgress) {
  removerPromise ??= (async () => {
    env.allowRemoteModels = false;
    env.allowLocalModels = true;
    env.localModelPath = `/assets/models-${modelRevision}/`;
    env.useBrowserCache = true;
    env.backends.onnx.wasm.numThreads = 1;
    env.backends.onnx.wasm.proxy = false;
    env.backends.onnx.wasm.wasmPaths = {
      mjs: new URL('/assets/vendor/onnx/ort-wasm-simd-threaded.mjs', self.location.origin).href,
      wasm: new URL('/assets/vendor/onnx/ort-wasm-simd-threaded.wasm', self.location.origin).href,
    };
    return pipeline('background-removal', 'Xenova/modnet', {
      dtype: 'q8',
      device: 'wasm',
      progress_callback: onProgress,
    });
  })();
  return removerPromise;
}

self.addEventListener('message', async ({ data }) => {
  if (data?.type !== 'remove-background') return;
  try {
    self.postMessage({ type: 'model-loading', id: data.id });
    const remover = await getRemover((info) => {
      if (info.status === 'progress' && Number.isFinite(info.progress)) {
        self.postMessage({ type: 'model-progress', id: data.id, progress: Math.max(0, Math.min(100, Math.round(info.progress))) });
      }
    });
    self.postMessage({ type: 'processing', id: data.id });
    const image = await remover(data.file);
    const png = await image.toBlob('image/png');
    self.postMessage({ type: 'result', id: data.id, png, width: image.width, height: image.height });
  } catch (error) {
    self.postMessage({ type: 'error', id: data.id, message: error instanceof Error ? error.message : String(error) });
  }
});
