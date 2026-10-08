import { sharpenImageData, sharpenImageDataChunks, validateSharpenerSize } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="image-sharpener"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const fileInput = form.elements.namedItem('imageFile');
  const canvas = root.querySelector('[data-sharpener-preview]');
  const context = canvas.getContext('2d');
  const workbench = root.querySelector('[data-sharpener-workbench]');
  const exportLink = root.querySelector('[data-export]');
  const exportButton = root.querySelector('[data-action="export"]');
  let bitmap = null;
  let imageRequest = 0;
  let exportRequest = 0;
  let exportUrl = '';

  function revokeExport() {
    exportRequest += 1;
    if (exportUrl) URL.revokeObjectURL(exportUrl);
    exportUrl = '';
    exportLink.hidden = true;
    exportLink.removeAttribute('href');
    exportButton.disabled = !bitmap;
  }

  function options() {
    return {
      amount: Number(form.elements.namedItem('amount').value),
      radius: Number(form.elements.namedItem('radius').value),
      threshold: Number(form.elements.namedItem('threshold').value),
    };
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
    if (!form.elements.namedItem('compare').checked && options().amount > 0) {
      const pixels = context.getImageData(0, 0, width, height);
      const sharpened = sharpenImageData(pixels, options());
      context.putImageData(new ImageData(sharpened.data, width, height), 0, 0);
    }
  }

  async function loadImage(file, request) {
    if (!file || !['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif', 'image/bmp'].includes(file.type)) throw new TypeError(copy.messages.unsupportedImage);
    let nextBitmap;
    try { nextBitmap = await createImageBitmap(file, { imageOrientation: 'from-image' }); }
    catch { throw new TypeError(copy.messages.unsupportedImage); }
    try { validateSharpenerSize(nextBitmap.width, nextBitmap.height); }
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

  for (const control of form.querySelectorAll('input[type="range"]')) control.addEventListener('input', renderPreview);
  form.elements.namedItem('compare').addEventListener('change', renderPreview);

  exportButton.addEventListener('click', async () => {
    if (!bitmap) { announce(root, copy.messages.selectImage, 'error'); return; }
    revokeExport();
    const request = exportRequest;
    exportButton.disabled = true;
    announce(root, copy.messages.exporting);
    const output = document.createElement('canvas');
    output.width = bitmap.width; output.height = bitmap.height;
    try {
      const outputContext = output.getContext('2d', { willReadFrequently: true });
      if (!outputContext) throw new Error('Canvas export is unavailable.');
      outputContext.drawImage(bitmap, 0, 0);
      const settings = options();
      if (settings.amount > 0) {
        const pixels = outputContext.getImageData(0, 0, output.width, output.height);
        const processor = sharpenImageDataChunks(pixels, settings, 48);
        let result = processor.next();
        while (!result.done) {
          await new Promise((resolve) => requestAnimationFrame(resolve));
          if (request !== exportRequest) { output.width = 0; output.height = 0; return; }
          result = processor.next();
        }
        outputContext.putImageData(new ImageData(result.value.data, output.width, output.height), 0, 0);
      }
      const format = form.elements.namedItem('format').value;
      const blob = await new Promise((resolve) => output.toBlob(resolve, format, format === 'image/jpeg' ? 0.92 : undefined));
      output.width = 0; output.height = 0;
      if (request !== exportRequest) return;
      exportButton.disabled = false;
      if (!blob) throw new Error('Image encoding failed.');
      exportUrl = URL.createObjectURL(blob);
      exportLink.href = exportUrl;
      exportLink.download = `usefulverse-sharpened.${format === 'image/jpeg' ? 'jpg' : 'png'}`;
      exportLink.textContent = copy.actions.download;
      exportLink.hidden = false;
      announce(root, copy.messages.exportReady, 'success');
    } catch {
      output.width = 0; output.height = 0;
      if (request === exportRequest) { exportButton.disabled = false; announce(root, copy.messages.exportFailed, 'error'); }
    }
  });

  form.addEventListener('reset', () => setTimeout(() => {
    imageRequest += 1; revokeExport(); bitmap?.close?.(); bitmap = null;
    workbench.hidden = true; exportButton.disabled = true; canvas.width = 1; canvas.height = 1;
    announce(root, '');
  }, 0));
  window.addEventListener('pagehide', () => { bitmap?.close?.(); if (exportUrl) URL.revokeObjectURL(exportUrl); });
}
