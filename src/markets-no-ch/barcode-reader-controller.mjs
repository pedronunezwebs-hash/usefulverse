import { detectorFormats, formatsAvailable, mergeDetections } from './barcode-reader.mjs';

export function initBarcodeReader(documentRef = document, windowRef = window, navigatorRef = navigator) {
  const root = documentRef.querySelector('[data-barcode-reader]');
  if (!root) return () => {};
  let copy;
  try { copy = JSON.parse(documentRef.querySelector('[data-tool-copy]')?.textContent ?? '{}').fields; } catch { return () => {}; }
  if (!copy) return () => {};
  const q = (selector) => root.querySelector(selector);
  const file = q('[data-barcode-file]'); const scanButton = q('[data-barcode-scan]'); const cameraButton = q('[data-barcode-camera]');
  const stopButton = q('[data-barcode-stop]'); const rotation = q('[data-barcode-rotation]'); const video = q('[data-barcode-video]');
  const resultList = q('[data-barcode-results]'); const status = q('[data-barcode-status]'); const resultCount = q('[data-barcode-count]');
  const clearButton = q('[data-barcode-clear]'); const copyAllButton = q('[data-barcode-copy-all]');
  let detector; let stream; let frameId; let lastScanAt = 0; let busy = false; let destroyed = false; let results = [];
  const say = (message) => { status.textContent = message; };
  const updateButtons = () => { const ready = Boolean(detector); scanButton.disabled = !ready || !file.files?.[0]; cameraButton.disabled = !ready || Boolean(stream); stopButton.disabled = !stream; copyAllButton.disabled = !results.length; };

  function renderResults(next, capped = false) {
    results = next;
    resultList.replaceChildren();
    for (const [index, result] of results.entries()) {
      const item = documentRef.createElement('li'); item.className = 'barcode-result';
      const heading = documentRef.createElement('strong'); heading.textContent = `${copy.format}: ${result.format}`;
      const value = documentRef.createElement('code'); value.textContent = result.value;
      const check = documentRef.createElement('small');
      check.textContent = result.checksum === 'valid' ? `${copy.checksum}: ${copy.checksumValid}` : result.checksum === 'invalid' ? `${copy.checksum}: ${copy.checksumInvalid}` : `${copy.checksum}: ${copy.checksumDecoder}`;
      const button = documentRef.createElement('button'); button.type = 'button'; button.textContent = copy.copy;
      button.setAttribute('aria-label', `${copy.copy} ${result.format} ${index + 1}`);
      button.addEventListener('click', () => copyText(result.value));
      item.append(heading, value, check, button); resultList.append(item);
    }
    resultCount.textContent = results.length ? copy.resultCount.replace('{count}', String(results.length)) : '';
    updateButtons();
    if (capped) say(copy.countLimit);
    else if (results.length) say(copy.resultCount.replace('{count}', String(results.length)));
  }

  async function copyText(text) {
    try { await navigatorRef.clipboard.writeText(text); say(copy.copied); }
    catch { say(copy.copyFailed); }
  }

  function canvasFor(source, width, height, degrees) {
    const canvas = documentRef.createElement('canvas'); const sideways = degrees === 90 || degrees === 270;
    canvas.width = sideways ? height : width; canvas.height = sideways ? width : height;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) throw new Error('canvas');
    if (degrees === 90) { context.translate(canvas.width, 0); context.rotate(Math.PI / 2); }
    else if (degrees === 180) { context.translate(canvas.width, canvas.height); context.rotate(Math.PI); }
    else if (degrees === 270) { context.translate(0, canvas.height); context.rotate(-Math.PI / 2); }
    context.drawImage(source, 0, 0, width, height);
    return canvas;
  }

  async function scanSource(source, width, height, clearBefore = false) {
    if (!width || !height) { say(copy.imageError); return; }
    const scale = Math.min(1, 1800 / Math.max(width, height));
    const canvas = canvasFor(source, Math.max(1, Math.round(width * scale)), Math.max(1, Math.round(height * scale)), Number(rotation.value));
    const detections = await detector.detect(canvas);
    const next = mergeDetections(clearBefore ? [] : results, detections, 100);
    renderResults(next, next.length >= 100);
    if (!next.length) say(copy.none);
  }

  scanButton.addEventListener('click', async () => {
    const image = file.files?.[0];
    if (!image || image.size > 12 * 1024 * 1024) { say(copy.imageError); return; }
    let bitmap;
    try {
      bitmap = await windowRef.createImageBitmap(image, { imageOrientation: 'from-image' });
      await scanSource(bitmap, bitmap.width, bitmap.height, true);
    } catch { say(copy.imageError); }
    finally { bitmap?.close?.(); }
  });
  file.addEventListener('change', () => { updateButtons(); if (file.files?.[0]?.size > 12 * 1024 * 1024) say(copy.imageError); });
  rotation.addEventListener('change', () => { if (!stream) return; lastScanAt = 0; });

  async function cameraFrame(now) {
    if (!stream || destroyed || !video.videoWidth) { frameId = windowRef.requestAnimationFrame(cameraFrame); return; }
    if (!busy && now - lastScanAt > 300) {
      busy = true; lastScanAt = now;
      try {
        const canvas = canvasFor(video, video.videoWidth, video.videoHeight, Number(rotation.value));
        const detections = await detector.detect(canvas);
        if (!stream || destroyed) return;
        const next = mergeDetections(results, detections, 100);
        if (next.length !== results.length) renderResults(next, next.length >= 100);
      } catch { /* A transient frame can be undecodable; keep scanning. */ }
      finally { busy = false; }
    }
    if (stream && !destroyed) frameId = windowRef.requestAnimationFrame(cameraFrame);
  }

  cameraButton.addEventListener('click', async () => {
    if (!detector || !navigatorRef.mediaDevices?.getUserMedia) { say(copy.permission); return; }
    try {
      stream = await navigatorRef.mediaDevices.getUserMedia({ audio: false, video: { facingMode: { ideal: 'environment' } } });
      if (destroyed) { stream.getTracks().forEach((track) => track.stop()); stream = undefined; return; }
      video.srcObject = stream; video.hidden = false; await video.play();
      cameraButton.disabled = true; stopButton.disabled = false; say(copy.scanning);
      frameId = windowRef.requestAnimationFrame(cameraFrame);
    } catch { if (stream) stream.getTracks().forEach((track) => track.stop()); stream = undefined; video.srcObject = null; video.hidden = true; updateButtons(); say(copy.permission); }
  });

  function stopCamera() {
    if (frameId !== undefined) windowRef.cancelAnimationFrame(frameId);
    frameId = undefined; stream?.getTracks().forEach((track) => track.stop()); stream = undefined;
    video.pause(); video.srcObject = null; video.hidden = true; updateButtons();
    if (!results.length) say(copy.ready);
  }
  stopButton.addEventListener('click', stopCamera);
  clearButton.addEventListener('click', () => { renderResults([]); say(copy.ready); });
  copyAllButton.addEventListener('click', () => copyText(results.map((result) => `${result.format}: ${result.value}`).join('\n')));
  documentRef.addEventListener('visibilitychange', () => { if (documentRef.hidden) stopCamera(); });

  const Detector = windowRef.BarcodeDetector;
  if (!Detector || typeof Detector.getSupportedFormats !== 'function') { say(copy.unsupported); updateButtons(); }
  else Detector.getSupportedFormats().then((available) => {
    if (destroyed) return;
    const formats = detectorFormats(available);
    if (!formats.length) { say(copy.unsupported); return; }
    detector = new Detector({ formats });
    const readable = formatsAvailable(available).map((format) => format.replaceAll('_', '-').toUpperCase()).join(', ');
    const help = q('[data-barcode-supported]'); if (help) help.textContent = `${copy.noLookup} ${readable}`;
    updateButtons();
  }).catch(() => say(copy.unsupported));

  const destroy = () => { destroyed = true; stopCamera(); };
  return destroy;
}

if (typeof document !== 'undefined') initBarcodeReader();
