import { validateUpscalerSize } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="image-upscaler"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const fileInput = form.elements.namedItem('imageFile');
  const runButton = root.querySelector('[data-action="upscale"]');
  const cancelButton = root.querySelector('[data-action="cancel"]');
  const workbench = root.querySelector('[data-upscaler-workbench]');
  const sourceCanvas = root.querySelector('[data-upscaler-source]');
  const resultCanvas = root.querySelector('[data-upscaler-result]');
  const sourceContext = sourceCanvas.getContext('2d');
  const resultContext = resultCanvas.getContext('2d');
  const progress = root.querySelector('[data-progress]');
  const exportLink = root.querySelector('[data-export]');
  let bitmap = null; let worker = null; let imageRequest = 0; let outputUrl = '';

  function clearOutput() {
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    outputUrl = '';
    exportLink.hidden = true;
    exportLink.removeAttribute('href');
    resultCanvas.width = 1; resultCanvas.height = 1;
    resultCanvas.hidden = true;
  }

  function stopWorker({ announceCancel = false } = {}) {
    if (!worker) return;
    worker.terminate(); worker = null;
    runButton.disabled = !bitmap;
    cancelButton.disabled = true; cancelButton.hidden = true;
    progress.hidden = true;
    if (announceCancel) announce(root, copy.messages.cancelled);
  }

  async function loadImage(file, request) {
    if (!file || !['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/bmp'].includes(file.type)) throw new TypeError(copy.messages.unsupportedImage);
    let nextBitmap;
    try { nextBitmap = await createImageBitmap(file, { imageOrientation: 'from-image' }); }
    catch { throw new TypeError(copy.messages.unsupportedImage); }
    try { validateUpscalerSize(nextBitmap.width, nextBitmap.height); }
    catch (error) { nextBitmap.close?.(); throw error; }
    if (request !== imageRequest) { nextBitmap.close?.(); return; }
    bitmap?.close?.(); bitmap = nextBitmap;
    sourceCanvas.width = bitmap.width; sourceCanvas.height = bitmap.height;
    sourceContext.fillStyle = '#fff'; sourceContext.fillRect(0, 0, bitmap.width, bitmap.height);
    sourceContext.drawImage(bitmap, 0, 0);
    const scale = Math.min(1, 700 / bitmap.width, 500 / bitmap.height);
    sourceCanvas.style.width = `${Math.max(1, Math.round(bitmap.width * scale))}px`;
    sourceCanvas.style.height = `${Math.max(1, Math.round(bitmap.height * scale))}px`;
    sourceCanvas.hidden = false; workbench.hidden = false; runButton.disabled = false;
    announce(root, `${copy.messages.imageReady} ${bitmap.width} × ${bitmap.height} px.`, 'success');
  }

  fileInput.addEventListener('change', async (event) => {
    const request = ++imageRequest;
    stopWorker(); clearOutput(); bitmap?.close?.(); bitmap = null;
    sourceCanvas.width = 1; sourceCanvas.height = 1; sourceCanvas.hidden = true;
    workbench.hidden = true; runButton.disabled = true;
    try { await loadImage(event.target.files?.[0], request); }
    catch (error) {
      if (request === imageRequest) announce(root, error instanceof RangeError ? copy.messages.imageTooLarge : copy.messages.unsupportedImage, 'error');
    }
  });

  runButton.addEventListener('click', () => {
    const file = fileInput.files?.[0];
    if (!bitmap || !file) { announce(root, copy.messages.selectImage, 'error'); return; }
    stopWorker(); clearOutput();
    try { worker = new Worker(form.dataset.workerSrc, { type: 'module', name: 'UsefulVerse local image upscaler' }); }
    catch { announce(root, copy.messages.workerUnavailable, 'error'); return; }
    runButton.disabled = true; cancelButton.hidden = false; cancelButton.disabled = false;
    progress.hidden = false; progress.value = 0;
    announce(root, copy.messages.modelLoading);
    const request = imageRequest;
    worker.addEventListener('message', async ({ data }) => {
      if (request !== imageRequest) return;
      if (data?.type === 'model-progress') {
        progress.value = Math.max(0, Math.min(100, data.progress));
        announce(root, `${copy.messages.modelLoading} ${progress.value}%`);
      } else if (data?.type === 'tile-progress') {
        progress.value = Math.round(data.current / data.total * 100);
        announce(root, `${copy.messages.processing} ${data.current}/${data.total}`);
      } else if (data?.type === 'result') {
        stopWorker();
        try {
          resultCanvas.width = data.width; resultCanvas.height = data.height;
          resultCanvas.hidden = false;
          const resultBitmap = await createImageBitmap(data.blob);
          if (request !== imageRequest) { resultBitmap.close?.(); return; }
          resultContext.drawImage(resultBitmap, 0, 0); resultBitmap.close?.();
          resultCanvas.style.width = `${Math.min(700, data.width)}px`;
          resultCanvas.style.height = 'auto';
          outputUrl = URL.createObjectURL(data.blob);
          exportLink.href = outputUrl; exportLink.download = `usefulverse-upscaled-${data.width}x${data.height}.png`;
          exportLink.textContent = copy.actions.download; exportLink.hidden = false;
          announce(root, `${copy.messages.outputReady} ${data.width} × ${data.height} px.`, 'success');
        } catch {
          clearOutput(); announce(root, copy.messages.processingFailed, 'error');
        }
      } else if (data?.type === 'error') {
        stopWorker(); announce(root, copy.messages[data.code] ?? copy.messages.processingFailed, 'error');
      }
    });
    worker.addEventListener('error', () => { stopWorker(); announce(root, copy.messages.processingFailed, 'error'); }, { once: true });
    worker.postMessage({ type: 'upscale', file });
  });

  cancelButton.addEventListener('click', () => stopWorker({ announceCancel: true }));
  form.addEventListener('reset', () => setTimeout(() => {
    imageRequest += 1; stopWorker(); clearOutput(); bitmap?.close?.(); bitmap = null;
    fileInput.value = ''; sourceCanvas.width = 1; sourceCanvas.height = 1; sourceCanvas.hidden = true;
    workbench.hidden = true; runButton.disabled = true; progress.hidden = true;
    announce(root, '');
  }, 0));
  window.addEventListener('pagehide', () => { stopWorker(); bitmap?.close?.(); if (outputUrl) URL.revokeObjectURL(outputUrl); }, { once: true });
}
