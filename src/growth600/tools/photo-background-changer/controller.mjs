import { announce, readToolCopy } from '../controller-helpers.mjs';
import { coverRect, validateBackgroundImageFile, validatePhotoDimensions } from './logic.mjs';

const root = document.querySelector('[data-tool="photo-background-changer"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const portraitInput = form.elements.namedItem('portrait');
  const backgroundInput = form.elements.namedItem('background');
  const modeInput = form.elements.namedItem('mode');
  const colorInput = form.elements.namedItem('color');
  const scaleInput = form.elements.namedItem('scale');
  const softnessInput = form.elements.namedItem('softness');
  const shadowInput = form.elements.namedItem('shadow');
  const colorField = root.querySelector('[data-background-color-field]');
  const imageField = root.querySelector('[data-background-image-field]');
  const run = root.querySelector('[data-photo-run]');
  const cancel = root.querySelector('[data-photo-cancel]');
  const clear = root.querySelector('[data-photo-clear]');
  const download = root.querySelector('[data-photo-download]');
  const resultSection = root.querySelector('[data-photo-result]');
  const progress = root.querySelector('[data-photo-progress]');
  const canvas = root.querySelector('[data-photo-preview]');
  let worker; let requestId = 0; let backgroundRequest = 0; let sourceBitmap; let foregroundBitmap; let backgroundBitmap;

  const stopWorker = () => { worker?.terminate(); worker = undefined; cancel.hidden = true; cancel.disabled = true; run.disabled = !sourceBitmap; progress.hidden = true; };
  const closeBitmap = (bitmap) => { try { bitmap?.close?.(); } catch { /* already closed */ } };
  const releaseImages = () => { closeBitmap(sourceBitmap); closeBitmap(foregroundBitmap); closeBitmap(backgroundBitmap); sourceBitmap = foregroundBitmap = backgroundBitmap = undefined; canvas.width = 1; canvas.height = 1; download.disabled = true; resultSection.hidden = true; };
  const syncBackgroundFields = () => { colorField.hidden = modeInput.value !== 'color'; imageField.hidden = modeInput.value !== 'image'; };

  function render(target = canvas) {
    if (!target || !foregroundBitmap) return;
    const draw = target.getContext('2d'); if (!draw) return;
    draw.clearRect(0, 0, target.width, target.height);
    if (modeInput.value === 'color') { draw.fillStyle = colorInput.value; draw.fillRect(0, 0, target.width, target.height); }
    else if (modeInput.value === 'image' && backgroundBitmap) {
      const rect = coverRect(backgroundBitmap.width, backgroundBitmap.height, target.width, target.height);
      draw.drawImage(backgroundBitmap, rect.x, rect.y, rect.width, rect.height);
    }
    const scale = Number(scaleInput.value) / 100; const width = target.width * scale; const height = target.height * scale;
    const x = (target.width - width) / 2; const y = (target.height - height) / 2;
    const blur = Number(softnessInput.value) * Math.max(target.width, target.height) / 1800;
    if (blur > 0) { draw.save(); draw.filter = `blur(${blur.toFixed(1)}px)`; draw.drawImage(foregroundBitmap, x, y, width, height); draw.restore(); }
    const shadow = Number(shadowInput.value);
    if (shadow > 0) { draw.save(); draw.shadowColor = `rgba(0,0,0,${(shadow / 100).toFixed(2)})`; draw.shadowBlur = shadow / 100 * 36; draw.shadowOffsetY = shadow / 100 * 14; draw.drawImage(foregroundBitmap, x, y, width, height); draw.restore(); }
    draw.drawImage(foregroundBitmap, x, y, width, height);
  }

  const readBitmap = async (file) => {
    validateBackgroundImageFile(file);
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    try { validatePhotoDimensions(bitmap.width, bitmap.height); return bitmap; }
    catch (error) { bitmap.close?.(); throw error; }
  };
  const normalizePhoto = async (bitmap) => {
    const staging = document.createElement('canvas'); staging.width = bitmap.width; staging.height = bitmap.height;
    const stagingContext = staging.getContext('2d'); if (!stagingContext) throw new Error(copy.messages.canvasUnavailable);
    stagingContext.drawImage(bitmap, 0, 0);
    return new Promise((resolve, reject) => staging.toBlob((blob) => blob ? resolve(blob) : reject(new Error(copy.messages.canvasUnavailable)), 'image/png'));
  };

  portraitInput.addEventListener('change', async () => {
    const currentRequest = ++requestId; backgroundRequest += 1; stopWorker(); releaseImages(); backgroundInput.value = ''; run.disabled = true;
    const file = portraitInput.files?.[0]; if (!file) return;
    try {
      validateBackgroundImageFile(file);
      const bitmap = await readBitmap(file);
      if (currentRequest !== requestId) { closeBitmap(bitmap); return; }
      sourceBitmap = bitmap;
      run.disabled = false; announce(root, copy.messages.photoReady, 'success');
    } catch (error) { announce(root, error instanceof RangeError ? copy.messages.tooLarge : copy.messages.badPhoto, 'error'); }
  });
  backgroundInput.addEventListener('change', async () => {
    const currentRequest = ++backgroundRequest;
    closeBitmap(backgroundBitmap); backgroundBitmap = undefined;
    const file = backgroundInput.files?.[0]; if (!file) { render(); return; }
    try {
      const bitmap = await readBitmap(file);
      if (currentRequest !== backgroundRequest) { closeBitmap(bitmap); return; }
      backgroundBitmap = bitmap; syncBackgroundFields(); render();
      announce(root, copy.messages.backgroundReady, 'success');
    } catch (error) { backgroundInput.value = ''; announce(root, error instanceof RangeError ? copy.messages.tooLarge : copy.messages.badBackground, 'error'); }
  });
  modeInput.addEventListener('change', () => { syncBackgroundFields(); render(); });
  for (const control of [colorInput, scaleInput, softnessInput, shadowInput]) control.addEventListener('input', render);

  run.addEventListener('click', async () => {
    if (!sourceBitmap || !portraitInput.files?.[0]) { announce(root, copy.messages.choosePhoto, 'error'); return; }
    if (modeInput.value === 'image' && !backgroundBitmap) { announce(root, copy.messages.chooseBackground, 'error'); return; }
    stopWorker(); closeBitmap(foregroundBitmap); foregroundBitmap = undefined; canvas.width = 1; canvas.height = 1; download.disabled = true; resultSection.hidden = true;
    run.disabled = true; cancel.hidden = false; cancel.disabled = false; progress.hidden = false; progress.value = 0;
    const id = ++requestId;
    try {
      const normalized = await normalizePhoto(sourceBitmap);
      if (id !== requestId) return;
      worker = new Worker(form.dataset.workerSrc, { type: 'module', name: 'UsefulVerse local background matting' });
      worker.addEventListener('message', async ({ data }) => {
        if (data?.id !== id) return;
        if (data.type === 'model-loading') announce(root, copy.messages.modelLoading);
        else if (data.type === 'model-progress') progress.value = Math.max(0, Math.min(100, Number(data.progress) || 0));
        else if (data.type === 'processing') { progress.value = 100; announce(root, copy.messages.processing); }
        else if (data.type === 'result') {
          try {
            foregroundBitmap = await createImageBitmap(data.png);
            validatePhotoDimensions(foregroundBitmap.width, foregroundBitmap.height);
            canvas.width = foregroundBitmap.width; canvas.height = foregroundBitmap.height; syncBackgroundFields(); render(); resultSection.hidden = false;
            run.disabled = false; cancel.hidden = true; cancel.disabled = true; progress.hidden = true; download.disabled = false;
            announce(root, copy.messages.complete, 'success');
          } catch { closeBitmap(foregroundBitmap); foregroundBitmap = undefined; resultSection.hidden = true; download.disabled = true; stopWorker(); announce(root, copy.messages.failed, 'error'); }
          finally { worker?.terminate(); worker = undefined; }
        } else if (data.type === 'error') { stopWorker(); announce(root, copy.messages.failed, 'error'); }
      });
      worker.addEventListener('error', () => { stopWorker(); announce(root, copy.messages.failed, 'error'); }, { once: true });
      worker.postMessage({ type: 'remove-background', id, file: normalized });
    } catch { stopWorker(); announce(root, copy.messages.failed, 'error'); }
  });
  cancel.addEventListener('click', () => { requestId += 1; stopWorker(); announce(root, copy.messages.cancelled); });
  clear.addEventListener('click', () => { requestId += 1; backgroundRequest += 1; stopWorker(); releaseImages(); portraitInput.value = ''; backgroundInput.value = ''; run.disabled = true; announce(root, copy.messages.cleared); });
  download.addEventListener('click', () => {
    if (!foregroundBitmap) return;
    const output = document.createElement('canvas'); output.width = foregroundBitmap.width; output.height = foregroundBitmap.height;
    render(output);
    output.toBlob((blob) => {
      if (!blob) { announce(root, copy.messages.exportFailed, 'error'); return; }
      const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'usefulverse-background-changed.png'; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000); announce(root, copy.messages.downloaded, 'success');
    }, 'image/png');
  });
  window.addEventListener('pagehide', () => { requestId += 1; backgroundRequest += 1; stopWorker(); releaseImages(); }, { once: true });
  syncBackgroundFields();
  run.disabled = !sourceBitmap; download.disabled = true;
}
