import { env, pipeline } from '@huggingface/transformers';
import { createUpscaleTiles, validateUpscalerSize, validateUpscaledOutput, UPSCALER_SCALE } from './logic.mjs';

const MODEL_REVISION = '92a21aca5713f20faf9a87590cdfbdce2e34112c';
let upscalerPromise;

function getUpscaler() {
  upscalerPromise ??= (async () => {
    env.allowRemoteModels = false;
    env.allowLocalModels = true;
    env.localModelPath = `/assets/models-image-upscaler-${MODEL_REVISION}/`;
    env.useBrowserCache = true;
    env.backends.onnx.wasm.numThreads = 1;
    env.backends.onnx.wasm.proxy = false;
    env.backends.onnx.wasm.wasmPaths = {
      mjs: new URL('/assets/vendor/onnx/ort-wasm-simd-threaded.mjs', self.location.origin).href,
      wasm: new URL('/assets/vendor/onnx/ort-wasm-simd-threaded.wasm', self.location.origin).href,
    };
    return pipeline('image-to-image', 'Xenova/swin2SR-lightweight-x2-64', {
      dtype: 'q4', device: 'wasm', progress_callback: (info) => {
        if (info.status === 'progress' && Number.isFinite(info.progress)) self.postMessage({ type: 'model-progress', progress: Math.round(Math.max(0, Math.min(100, info.progress))) });
      },
    });
  })();
  return upscalerPromise;
}

self.addEventListener('message', async ({ data }) => {
  if (data?.type !== 'upscale' || !(data.file instanceof Blob)) return;
  let source; let canvas;
  try {
    self.postMessage({ type: 'model-loading' });
    const model = await getUpscaler();
    source = await createImageBitmap(data.file, { imageOrientation: 'from-image' });
    const { width, height } = validateUpscalerSize(source.width, source.height);
    canvas = new OffscreenCanvas(width * UPSCALER_SCALE, height * UPSCALER_SCALE);
    const output = canvas.getContext('2d', { alpha: false });
    if (!output) throw Object.assign(new Error('Canvas is unavailable.'), { code: 'workerUnavailable' });
    output.fillStyle = '#fff'; output.fillRect(0, 0, canvas.width, canvas.height);
    const tiles = createUpscaleTiles(width, height);
    for (let index = 0; index < tiles.length; index += 1) {
      const tile = tiles[index];
      const inputCanvas = new OffscreenCanvas(tile.width, tile.height);
      const input = inputCanvas.getContext('2d', { alpha: false, willReadFrequently: true });
      if (!input) throw new Error('Could not prepare an image tile.');
      input.fillStyle = '#fff'; input.fillRect(0, 0, tile.width, tile.height);
      input.drawImage(source, tile.left, tile.top, tile.width, tile.height, 0, 0, tile.width, tile.height);
      const enhanced = await model(inputCanvas);
      const targetWidth = tile.width * UPSCALER_SCALE;
      const targetHeight = tile.height * UPSCALER_SCALE;
      if (enhanced.width < targetWidth || enhanced.height < targetHeight || enhanced.channels !== 3) throw new Error('The model returned an unexpected image size.');
      const rgba = new Uint8ClampedArray(targetWidth * targetHeight * 4);
      for (let pixel = 0, rgb = 0; pixel < rgba.length; pixel += 4, rgb += enhanced.channels) {
        rgba[pixel] = enhanced.data[rgb]; rgba[pixel + 1] = enhanced.data[rgb + 1]; rgba[pixel + 2] = enhanced.data[rgb + 2]; rgba[pixel + 3] = 255;
      }
      const tileOutput = new OffscreenCanvas(targetWidth, targetHeight);
      const tileContext = tileOutput.getContext('2d', { alpha: false });
      tileContext.putImageData(new ImageData(rgba, targetWidth, targetHeight), 0, 0);
      const destX = tile.x * UPSCALER_SCALE; const destY = tile.y * UPSCALER_SCALE;
      const coreWidth = tile.coreWidth * UPSCALER_SCALE; const coreHeight = tile.coreHeight * UPSCALER_SCALE;
      output.drawImage(tileOutput, tile.cropX, tile.cropY, coreWidth, coreHeight, destX, destY, coreWidth, coreHeight);
      inputCanvas.width = 0; inputCanvas.height = 0; tileOutput.width = 0; tileOutput.height = 0;
      self.postMessage({ type: 'tile-progress', current: index + 1, total: tiles.length });
    }
    validateUpscaledOutput(width, height, canvas.width, canvas.height);
    const blob = await canvas.convertToBlob({ type: 'image/png' });
    self.postMessage({ type: 'result', width: canvas.width, height: canvas.height, blob });
  } catch (error) {
    self.postMessage({ type: 'error', code: error?.code ?? (error instanceof RangeError ? 'imageTooLarge' : 'processingFailed') });
  } finally {
    source?.close?.(); if (canvas) { canvas.width = 0; canvas.height = 0; }
  }
});
