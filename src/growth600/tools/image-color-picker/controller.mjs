import { addColorSample, formatColorSample, mapPreviewPoint, normalizeColorSample, validateColorPickerSize } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="image-color-picker"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const fileInput = form.elements.namedItem('imageFile');
  const zoomInput = form.elements.namedItem('zoom');
  const canvas = root.querySelector('[data-color-picker-preview]');
  const context = canvas.getContext('2d');
  const probe = document.createElement('canvas');
  probe.width = 1; probe.height = 1;
  const probeContext = probe.getContext('2d', { willReadFrequently: true });
  const workbench = root.querySelector('[data-color-picker-workbench]');
  const marker = root.querySelector('[data-color-picker-marker]');
  const currentPanel = root.querySelector('[data-color-picker-current]');
  const currentSwatch = root.querySelector('[data-current-swatch]');
  const currentValue = root.querySelector('[data-current-value]');
  const addButton = root.querySelector('[data-action="add-sample"]');
  const copyPaletteButton = root.querySelector('[data-action="copy-palette"]');
  const clearButton = root.querySelector('[data-action="clear"]');
  const paletteList = root.querySelector('[data-color-picker-palette]');
  let bitmap = null;
  let imageRequest = 0;
  let currentPoint = null;
  let sourceRect = null;
  let samples = [];

  function setMarker(point) {
    if (!bitmap || !sourceRect || !point || point.x < sourceRect.x || point.y < sourceRect.y
      || point.x >= sourceRect.x + sourceRect.width || point.y >= sourceRect.y + sourceRect.height) {
      marker.hidden = true;
      return;
    }
    marker.hidden = false;
    marker.style.left = `${((point.x - sourceRect.x) / sourceRect.width) * 100}%`;
    marker.style.top = `${((point.y - sourceRect.y) / sourceRect.height) * 100}%`;
  }

  function renderPreview(focus = currentPoint) {
    if (!bitmap) return;
    const zoom = Number(zoomInput.value);
    const width = bitmap.width / zoom;
    const height = bitmap.height / zoom;
    const focusX = focus?.x ?? Math.floor(bitmap.width / 2);
    const focusY = focus?.y ?? Math.floor(bitmap.height / 2);
    const x = Math.max(0, Math.min(bitmap.width - width, focusX + 0.5 - width / 2));
    const y = Math.max(0, Math.min(bitmap.height - height, focusY + 0.5 - height / 2));
    sourceRect = { x, y, width, height };
    const scale = Math.min(zoom, 1400 / width, 900 / height);
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.imageSmoothingEnabled = zoom === 1;
    context.imageSmoothingQuality = 'high';
    context.drawImage(bitmap, x, y, width, height, 0, 0, canvas.width, canvas.height);
    setMarker(currentPoint);
  }

  function readPixel(point) {
    probeContext.clearRect(0, 0, 1, 1);
    probeContext.drawImage(bitmap, point.x, point.y, 1, 1, 0, 0, 1, 1);
    const [r, g, b, a] = probeContext.getImageData(0, 0, 1, 1).data;
    return normalizeColorSample({ x: point.x, y: point.y, r, g, b, a });
  }

  function showCurrent(sample) {
    const color = formatColorSample(sample);
    currentPanel.hidden = false;
    currentSwatch.style.backgroundColor = color.cssColor;
    currentValue.textContent = `${copy.fields.currentColor}: (${sample.x}, ${sample.y}) · ${color.hex} · RGB ${color.rgb} · ${color.rgba}`;
    addButton.disabled = false;
  }

  function updateCurrent(point, { announceSelection = false, recenter = false } = {}) {
    if (!bitmap) return;
    currentPoint = {
      x: Math.max(0, Math.min(bitmap.width - 1, Math.floor(point.x))),
      y: Math.max(0, Math.min(bitmap.height - 1, Math.floor(point.y))),
    };
    showCurrent(readPixel(currentPoint));
    if (recenter && Number(zoomInput.value) > 1) renderPreview(currentPoint);
    else setMarker(currentPoint);
    if (announceSelection) announce(root, `${copy.messages.pixelSelected} ${currentValue.textContent}`, 'success');
  }

  function pointerPoint(event) {
    return mapPreviewPoint(event.clientX, event.clientY, canvas.getBoundingClientRect(), sourceRect, bitmap.width, bitmap.height);
  }

  function renderPalette() {
    paletteList.replaceChildren();
    samples.forEach((sample, index) => {
      const color = formatColorSample(sample);
      const item = document.createElement('li');
      item.className = 'color-picker-sample';
      const swatch = document.createElement('span');
      swatch.className = 'color-picker-swatch';
      swatch.setAttribute('aria-hidden', 'true');
      swatch.style.backgroundColor = color.cssColor;
      const value = document.createElement('code');
      value.textContent = `${color.hex} · RGB ${color.rgb} · (${sample.x}, ${sample.y})`;
      const copyButton = document.createElement('button');
      copyButton.type = 'button'; copyButton.className = 'button button--secondary';
      copyButton.textContent = copy.actions.copyColor;
      copyButton.setAttribute('aria-label', `${copy.actions.copyColor} ${color.hex}`);
      copyButton.addEventListener('click', () => copyText(color.hex, copy.messages.copiedColor));
      const removeButton = document.createElement('button');
      removeButton.type = 'button'; removeButton.className = 'button button--secondary';
      removeButton.textContent = copy.actions.remove;
      removeButton.setAttribute('aria-label', `${copy.actions.remove} ${index + 1}: ${color.hex}`);
      removeButton.addEventListener('click', () => { samples = samples.filter((_, sampleIndex) => sampleIndex !== index); renderPalette(); });
      item.append(swatch, value, copyButton, removeButton);
      paletteList.append(item);
    });
    copyPaletteButton.disabled = samples.length === 0;
    clearButton.disabled = samples.length === 0;
  }

  async function copyText(value, successMessage) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable.');
      await navigator.clipboard.writeText(value);
      announce(root, successMessage, 'success');
    } catch { announce(root, copy.messages.copyUnavailable, 'error'); }
  }

  async function loadImage(file, request) {
    if (!file || !['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif', 'image/bmp'].includes(file.type)) throw new TypeError(copy.messages.unsupportedImage);
    let nextBitmap;
    try { nextBitmap = await createImageBitmap(file, { imageOrientation: 'from-image' }); }
    catch { throw new TypeError(copy.messages.unsupportedImage); }
    try { validateColorPickerSize(nextBitmap.width, nextBitmap.height); }
    catch (error) { nextBitmap.close?.(); throw error; }
    if (request !== imageRequest) { nextBitmap.close?.(); return; }
    bitmap?.close?.(); bitmap = nextBitmap;
    samples = []; currentPoint = null; currentPanel.hidden = true; addButton.disabled = true;
    workbench.hidden = false; renderPalette(); renderPreview();
    announce(root, `${copy.messages.imageReady} ${bitmap.width} × ${bitmap.height} px.`, 'success');
  }

  fileInput.addEventListener('change', async (event) => {
    const request = ++imageRequest;
    bitmap?.close?.(); bitmap = null; currentPoint = null; sourceRect = null; samples = [];
    workbench.hidden = true; marker.hidden = true; currentPanel.hidden = true; addButton.disabled = true;
    canvas.width = 1; canvas.height = 1; renderPalette();
    try { await loadImage(event.target.files?.[0], request); }
    catch (error) { if (request === imageRequest) announce(root, error instanceof RangeError ? copy.messages.imageTooLarge : copy.messages.unsupportedImage, 'error'); }
  });

  canvas.addEventListener('pointermove', (event) => { if (bitmap) updateCurrent(pointerPoint(event)); });
  canvas.addEventListener('click', (event) => {
    if (!bitmap) return;
    updateCurrent(pointerPoint(event), { announceSelection: true, recenter: true });
    canvas.focus({ preventScroll: true });
  });
  canvas.addEventListener('keydown', (event) => {
    if (!bitmap || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Enter', ' '].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Enter' || event.key === ' ') { addButton.click(); return; }
    const point = currentPoint ?? { x: Math.floor(bitmap.width / 2), y: Math.floor(bitmap.height / 2) };
    const step = event.shiftKey ? 10 : 1;
    const delta = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[event.key];
    updateCurrent({ x: point.x + delta[0], y: point.y + delta[1] }, { announceSelection: true, recenter: true });
  });
  zoomInput.addEventListener('change', () => { if (bitmap) renderPreview(currentPoint); });
  addButton.addEventListener('click', () => {
    if (!currentPoint) { announce(root, copy.messages.selectImage, 'error'); return; }
    try { samples = addColorSample(samples, readPixel(currentPoint)); renderPalette(); announce(root, copy.messages.sampleAdded, 'success'); }
    catch { announce(root, copy.messages.paletteFull, 'error'); }
  });
  copyPaletteButton.addEventListener('click', () => copyText(samples.map((sample) => formatColorSample(sample).hex).join('\n'), copy.messages.copiedPalette));
  clearButton.addEventListener('click', () => { samples = []; renderPalette(); announce(root, copy.messages.paletteCleared, 'success'); });
  form.addEventListener('reset', () => setTimeout(() => {
    imageRequest += 1; bitmap?.close?.(); bitmap = null; currentPoint = null; sourceRect = null; samples = [];
    workbench.hidden = true; marker.hidden = true; currentPanel.hidden = true; addButton.disabled = true;
    canvas.width = 1; canvas.height = 1; renderPalette(); announce(root, '');
  }, 0));
  window.addEventListener('pagehide', () => { bitmap?.close?.(); canvas.width = 0; canvas.height = 0; probe.width = 0; probe.height = 0; });
}
