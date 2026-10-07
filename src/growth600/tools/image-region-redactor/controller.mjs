import { mapPointerRegion, normalizeRedactionRegion, validateImageSize, validateRedactionMode } from './logic.mjs';
import { announce, clearResult, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="image-region-redactor"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const fileInput = form.elements.namedItem('imageFile');
  const canvas = root.querySelector('[data-preview]');
  const context = canvas.getContext('2d', { willReadFrequently: false });
  const messages = copy.messages;
  const workbench = root.querySelector('[data-workbench]');
  const exportLink = root.querySelector('[data-export]');
  const exportButton = root.querySelector('[data-action="export"]');
  const regionList = root.querySelector('[data-region-list]');
  let bitmap = null;
  let exportUrl = '';
  let exportRequest = 0;
  let imageRequest = 0;
  let regions = [];
  let dragStart = null;
  let dragCurrent = null;

  function clearObjectUrl(value) { if (value) URL.revokeObjectURL(value); }
  function invalidateExport() {
    exportRequest += 1;
    clearObjectUrl(exportUrl); exportUrl = '';
    exportLink.hidden = true; exportLink.removeAttribute('href');
    exportButton.disabled = false;
  }
  function mode() { return validateRedactionMode(form.elements.namedItem('mode').value); }
  function text(tag, content) { const element = document.createElement(tag); element.textContent = content; return element; }

  function scale() { return Math.min(1, 1400 / bitmap.width, 1400 / bitmap.height); }
  function renderRegionList() {
    regionList.replaceChildren();
    regions.forEach((region, index) => {
      const item = document.createElement('li');
      item.append(text('span', `${copy.messages.region} ${index + 1}: ${region.x}, ${region.y}, ${region.width} × ${region.height} px`));
      const remove = document.createElement('button');
      remove.type = 'button'; remove.className = 'button button--secondary';
      remove.textContent = `${copy.actions.removeRegion} ${index + 1}`;
      remove.addEventListener('click', () => { regions.splice(index, 1); renderPreview(); announce(root, messages.regionRemoved, 'success'); });
      item.append(remove); regionList.append(item);
    });
  }

  function paintEffect(targetContext, source, region, factor, selectedMode, strength) {
    const x = Math.round(region.x * factor), y = Math.round(region.y * factor);
    const width = Math.max(1, Math.round(region.width * factor)), height = Math.max(1, Math.round(region.height * factor));
    if (selectedMode === 'black') { targetContext.fillStyle = '#000'; targetContext.fillRect(x, y, width, height); return; }
    const scratch = document.createElement('canvas');
    scratch.width = width; scratch.height = height;
    const scratchContext = scratch.getContext('2d');
    if (selectedMode === 'pixelate') {
      const block = Math.max(2, Math.min(48, Number(strength) || 12));
      const small = document.createElement('canvas');
      small.width = Math.max(1, Math.ceil(width / block)); small.height = Math.max(1, Math.ceil(height / block));
      const smallContext = small.getContext('2d');
      smallContext.imageSmoothingEnabled = true;
      smallContext.drawImage(source, region.x, region.y, region.width, region.height, 0, 0, small.width, small.height);
      scratchContext.imageSmoothingEnabled = false;
      scratchContext.drawImage(small, 0, 0, width, height);
      small.width = 0; small.height = 0;
    } else {
      scratchContext.filter = `blur(${Math.max(2, Math.min(32, Number(strength) || 10))}px)`;
      scratchContext.drawImage(source, region.x, region.y, region.width, region.height, -2, -2, width + 4, height + 4);
      scratchContext.filter = 'none';
    }
    targetContext.drawImage(scratch, x, y);
    scratch.width = 0; scratch.height = 0;
  }

  function renderPreview() {
    if (!bitmap) return;
    invalidateExport();
    const factor = scale();
    canvas.width = Math.max(1, Math.round(bitmap.width * factor));
    canvas.height = Math.max(1, Math.round(bitmap.height * factor));
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const selectedMode = mode();
    const strength = form.elements.namedItem('strength').value;
    for (const region of regions) paintEffect(context, bitmap, region, factor, selectedMode, strength);
    if (dragStart && dragCurrent) {
      const x = Math.min(dragStart.x, dragCurrent.x), y = Math.min(dragStart.y, dragCurrent.y);
      context.save(); context.strokeStyle = '#d7fa63'; context.lineWidth = 2; context.setLineDash([7, 4]);
      context.strokeRect(x + 1, y + 1, Math.abs(dragCurrent.x - dragStart.x), Math.abs(dragCurrent.y - dragStart.y)); context.restore();
    }
    renderRegionList();
  }

  function updateCoordinates(region) {
    for (const [key, name] of [['x', 'regionX'], ['y', 'regionY'], ['width', 'regionWidth'], ['height', 'regionHeight']]) form.elements.namedItem(name).value = String(region[key]);
  }

  async function loadImage(file, request) {
    if (!file || !['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif', 'image/bmp'].includes(file.type)) throw new TypeError(messages.unsupportedImage);
    let nextBitmap;
    try { nextBitmap = await createImageBitmap(file, { imageOrientation: 'from-image' }); }
    catch { throw new TypeError(messages.unsupportedImage); }
    try { validateImageSize(nextBitmap.width, nextBitmap.height); }
    catch (error) { nextBitmap.close(); throw error; }
    if (request !== imageRequest) { nextBitmap.close(); return; }
    bitmap?.close?.(); bitmap = nextBitmap;
    regions = []; workbench.hidden = false; exportLink.hidden = true;
    const [x, y, width, height] = ['regionX', 'regionY', 'regionWidth', 'regionHeight'].map((key) => form.elements.namedItem(key));
    for (const input of [x, y]) input.max = String(Math.max(0, (input === x ? bitmap.width : bitmap.height) - 1));
    width.max = String(bitmap.width); height.max = String(bitmap.height);
    x.value = '0'; y.value = '0'; width.value = String(Math.min(200, bitmap.width)); height.value = String(Math.min(200, bitmap.height));
    renderPreview(); announce(root, `${messages.imageReady} ${bitmap.width} × ${bitmap.height} px.`, 'success');
  }

  async function addFromFields() {
    if (!bitmap) throw new TypeError(messages.selectImage);
    const region = normalizeRedactionRegion({
      x: Number(form.elements.namedItem('regionX').value), y: Number(form.elements.namedItem('regionY').value),
      width: Number(form.elements.namedItem('regionWidth').value), height: Number(form.elements.namedItem('regionHeight').value),
    }, bitmap.width, bitmap.height);
    regions.push(region); renderPreview(); announce(root, messages.regionAdded, 'success');
  }

  function pointerPoint(event) {
    const rect = canvas.getBoundingClientRect();
    return { x: Math.max(0, Math.min(canvas.width, (event.clientX - rect.left) * canvas.width / rect.width)), y: Math.max(0, Math.min(canvas.height, (event.clientY - rect.top) * canvas.height / rect.height)) };
  }

  form.elements.namedItem('imageFile').addEventListener('change', async (event) => {
    const request = ++imageRequest;
    clearResult(root); invalidateExport();
    bitmap?.close?.(); bitmap = null; regions = []; workbench.hidden = true;
    canvas.width = 1; canvas.height = 1;
    try { await loadImage(event.target.files?.[0], request); }
    catch (error) { if (request === imageRequest) announce(root, error instanceof RangeError ? messages.imageTooLarge : messages.unsupportedImage, 'error'); }
  });
  form.addEventListener('submit', (event) => { event.preventDefault(); addFromFields().catch(() => announce(root, messages.invalidRegion, 'error')); });
  for (const input of form.querySelectorAll('select[name="mode"],input[name="strength"]')) input.addEventListener('input', renderPreview);
  root.querySelector('[data-action="undo"]')?.addEventListener('click', () => { if (regions.length) { regions.pop(); renderPreview(); announce(root, messages.regionRemoved, 'success'); } });
  root.querySelector('[data-action="clear"]')?.addEventListener('click', () => { regions = []; renderPreview(); exportLink.hidden = true; announce(root, messages.regionsCleared, 'success'); });
  root.querySelector('[data-action="export"]')?.addEventListener('click', () => {
    if (!bitmap || !regions.length) { announce(root, messages.addRegionFirst, 'error'); return; }
    invalidateExport();
    const request = exportRequest;
    exportButton.disabled = true;
    announce(root, messages.exporting);
    let result;
    try {
      const selectedMode = mode();
      result = document.createElement('canvas'); result.width = bitmap.width; result.height = bitmap.height;
      const resultContext = result.getContext('2d');
      if (!resultContext) throw new Error('Canvas export is unavailable.');
      const format = form.elements.namedItem('format').value;
      if (format === 'image/jpeg') { resultContext.fillStyle = '#fff'; resultContext.fillRect(0, 0, result.width, result.height); }
      resultContext.drawImage(bitmap, 0, 0);
      for (const region of regions) paintEffect(resultContext, bitmap, region, 1, selectedMode, form.elements.namedItem('strength').value);
      result.toBlob((blob) => {
        result.width = 0; result.height = 0;
        if (request !== exportRequest) return;
        exportButton.disabled = false;
        if (!blob) { announce(root, messages.exportFailed, 'error'); return; }
        clearObjectUrl(exportUrl); exportUrl = URL.createObjectURL(blob);
        exportLink.href = exportUrl; exportLink.download = `usefulverse-redacted.${format === 'image/jpeg' ? 'jpg' : 'png'}`;
        exportLink.textContent = copy.actions.download; exportLink.hidden = false;
        announce(root, messages.exportReady, 'success');
      }, format, format === 'image/jpeg' ? 0.92 : undefined);
    } catch {
      if (result) { result.width = 0; result.height = 0; }
      if (request === exportRequest) { exportButton.disabled = false; announce(root, messages.exportFailed, 'error'); }
    }
  });
  canvas.addEventListener('pointerdown', (event) => { if (!bitmap) return; canvas.setPointerCapture(event.pointerId); dragStart = pointerPoint(event); dragCurrent = dragStart; renderPreview(); });
  canvas.addEventListener('pointermove', (event) => { if (!dragStart) return; dragCurrent = pointerPoint(event); renderPreview(); });
  canvas.addEventListener('pointerup', (event) => {
    if (!dragStart || !bitmap) return;
    dragCurrent = pointerPoint(event);
    const factor = scale();
    try {
      const region = mapPointerRegion(dragStart, dragCurrent, 1 / factor, 1 / factor, bitmap.width, bitmap.height);
      if (region.width < 2 || region.height < 2) throw new RangeError('Select a larger image region.');
      updateCoordinates(region); addFromFields().catch(() => announce(root, messages.invalidRegion, 'error'));
    } catch { announce(root, messages.invalidRegion, 'error'); }
    dragStart = null; dragCurrent = null; renderPreview();
  });
  canvas.addEventListener('pointercancel', () => { dragStart = null; dragCurrent = null; renderPreview(); });
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => fileInput.click());
  form.addEventListener('reset', () => setTimeout(() => {
    imageRequest += 1;
    bitmap?.close?.(); bitmap = null; regions = []; invalidateExport();
    workbench.hidden = true; exportLink.hidden = true; canvas.width = 1; canvas.height = 1; regionList.replaceChildren(); announce(root, '');
  }, 0));
  window.addEventListener('pagehide', () => { bitmap?.close?.(); clearObjectUrl(exportUrl); });
}
