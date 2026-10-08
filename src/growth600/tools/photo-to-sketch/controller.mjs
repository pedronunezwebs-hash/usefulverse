import { sketchImageData, sketchImageDataChunks, validateSketchSize } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="photo-to-sketch"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const fileInput = form.elements.namedItem('imageFile');
  const canvas = root.querySelector('[data-sketch-preview]');
  const context = canvas.getContext('2d', { willReadFrequently: true });
  const workbench = root.querySelector('[data-sketch-workbench]');
  const exportButton = root.querySelector('[data-action="export"]');
  const cancelButton = root.querySelector('[data-action="cancel"]');
  const exportLink = root.querySelector('[data-export]');
  let bitmap = null;
  let imageRequest = 0;
  let exportRequest = 0;
  let exportUrl = '';
  let previewFrame = 0;

  function revokeExport() {
    exportRequest += 1;
    if (exportUrl) URL.revokeObjectURL(exportUrl);
    exportUrl = '';
    exportLink.hidden = true;
    exportLink.removeAttribute('href');
    exportButton.disabled = !bitmap;
    cancelButton.hidden = true;
  }

  function settings() {
    return { intensity: Number(form.elements.namedItem('intensity').value), detail: Number(form.elements.namedItem('detail').value) };
  }

  function previewDimensions() {
    const scale = Math.min(1, 1400 / bitmap.width, 1400 / bitmap.height);
    return { width: Math.max(1, Math.round(bitmap.width * scale)), height: Math.max(1, Math.round(bitmap.height * scale)) };
  }

  function renderPreview() {
    if (!bitmap) return;
    revokeExport();
    const { width, height } = previewDimensions();
    canvas.width = width; canvas.height = height;
    context.clearRect(0, 0, width, height);
    context.imageSmoothingQuality = 'high';
    context.drawImage(bitmap, 0, 0, width, height);
    if (!form.elements.namedItem('compare').checked) {
      const pixels = context.getImageData(0, 0, width, height);
      const sketch = sketchImageData(pixels, settings());
      context.putImageData(new ImageData(sketch.data, width, height), 0, 0);
    }
  }

  function schedulePreview() {
    if (previewFrame) cancelAnimationFrame(previewFrame);
    previewFrame = requestAnimationFrame(() => { previewFrame = 0; renderPreview(); });
  }

  async function loadImage(file, request) {
    if (!file || !['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif', 'image/bmp'].includes(file.type)) throw new TypeError(copy.messages.unsupportedImage);
    let nextBitmap;
    try { nextBitmap = await createImageBitmap(file, { imageOrientation: 'from-image' }); }
    catch { throw new TypeError(copy.messages.unsupportedImage); }
    try { validateSketchSize(nextBitmap.width, nextBitmap.height); }
    catch (error) { nextBitmap.close?.(); throw error; }
    if (request !== imageRequest) { nextBitmap.close?.(); return; }
    bitmap?.close?.(); bitmap = nextBitmap;
    workbench.hidden = false;
    exportButton.disabled = false;
    renderPreview();
    announce(root, `${copy.messages.imageReady} ${bitmap.width} × ${bitmap.height} px.`, 'success');
  }

  fileInput.addEventListener('change', async (event) => {
    const request = ++imageRequest;
    revokeExport(); bitmap?.close?.(); bitmap = null; workbench.hidden = true; exportButton.disabled = true;
    canvas.width = 1; canvas.height = 1;
    try { await loadImage(event.target.files?.[0], request); }
    catch (error) { if (request === imageRequest) announce(root, error instanceof RangeError ? copy.messages.imageTooLarge : copy.messages.unsupportedImage, 'error'); }
  });

  for (const control of form.querySelectorAll('input[type="range"]')) control.addEventListener('input', schedulePreview);
  form.elements.namedItem('compare').addEventListener('change', schedulePreview);

  cancelButton.addEventListener('click', () => {
    revokeExport();
    exportButton.disabled = !bitmap;
    announce(root, copy.messages.cancelled, 'info');
  });

  exportButton.addEventListener('click', async () => {
    if (!bitmap) { announce(root, copy.messages.selectImage, 'error'); return; }
    revokeExport();
    const request = exportRequest;
    exportButton.disabled = true;
    cancelButton.hidden = false;
    announce(root, copy.messages.exporting, 'info');
    const output = document.createElement('canvas');
    output.width = bitmap.width; output.height = bitmap.height;
    try {
      const outputContext = output.getContext('2d', { willReadFrequently: true });
      if (!outputContext) throw new Error('Canvas export is unavailable.');
      outputContext.drawImage(bitmap, 0, 0);
      const pixels = outputContext.getImageData(0, 0, output.width, output.height);
      const processor = sketchImageDataChunks(pixels, settings(), 32);
      let step = processor.next();
      while (!step.done) {
        await new Promise((resolve) => requestAnimationFrame(resolve));
        if (request !== exportRequest) { output.width = 0; output.height = 0; return; }
        step = processor.next();
      }
      outputContext.putImageData(new ImageData(step.value.data, output.width, output.height), 0, 0);
      const blob = await new Promise((resolve) => output.toBlob(resolve, 'image/png'));
      output.width = 0; output.height = 0;
      if (request !== exportRequest) return;
      if (!blob) throw new Error('PNG encoding failed.');
      exportUrl = URL.createObjectURL(blob);
      exportLink.href = exportUrl;
      exportLink.download = 'usefulverse-photo-sketch.png';
      exportLink.textContent = copy.actions.download;
      exportLink.hidden = false;
      announce(root, copy.messages.exportReady, 'success');
    } catch {
      output.width = 0; output.height = 0;
      if (request === exportRequest) announce(root, copy.messages.exportFailed, 'error');
    } finally {
      if (request === exportRequest) { exportButton.disabled = !bitmap; cancelButton.hidden = true; }
    }
  });

  form.addEventListener('reset', () => setTimeout(() => {
    imageRequest += 1; revokeExport(); bitmap?.close?.(); bitmap = null;
    workbench.hidden = true; exportButton.disabled = true; canvas.width = 1; canvas.height = 1;
    announce(root, '');
  }, 0));
  window.addEventListener('pagehide', () => { bitmap?.close?.(); if (exportUrl) URL.revokeObjectURL(exportUrl); });
}
