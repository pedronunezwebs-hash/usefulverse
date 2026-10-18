import { orderDicomSeries, windowDicomPixels } from './dicom-viewer.mjs';

const root = document.querySelector('[data-market-tool="dicomViewer"]');
if (root) {
  const copy = JSON.parse(root.querySelector('[data-tool-copy]').textContent);
  const f = copy.fields;
  const q = (selector) => root.querySelector(selector);
  const input = q('[data-dicom-files]');
  const status = q('[data-dicom-status]');
  const output = q('[data-dicom-viewer]');
  const canvas = q('[data-dicom-canvas]');
  const context = canvas.getContext('2d', { alpha: false, willReadFrequently: false });
  const slice = q('[data-dicom-slice]');
  const center = q('[data-dicom-center]');
  const width = q('[data-dicom-width]');
  const cancelButton = q('[data-action="cancelDicom"]');
  const clearButton = q('[data-action="clearDicom"]');
  const previousButton = q('[data-action="previousDicom"]');
  const nextButton = q('[data-action="nextDicom"]');
  const metadata = q('[data-dicom-metadata]');
  let images = [];
  let worker = null;
  let requestId = 0;
  let cancelled = false;
  let pendingReject = null;

  function setStatus(message, error = false) {
    status.textContent = message;
    status.classList.toggle('result--error', error);
  }

  function resetView() {
    images = [];
    output.hidden = true;
    metadata.replaceChildren();
    canvas.width = 0; canvas.height = 0;
    slice.value = '0'; slice.max = '0';
    center.value = ''; width.value = '';
    slice.disabled = true; center.disabled = true; width.disabled = true;
    previousButton.disabled = true; nextButton.disabled = true;
    q('[data-dicom-slice-label]').textContent = '—';
  }

  function cancel() {
    cancelled = true;
    pendingReject?.(new Error('cancelled')); pendingReject = null;
    if (worker) worker.terminate();
    worker = null;
    input.value = '';
    resetView();
    cancelButton.disabled = true;
    setStatus(f.cancelled);
  }

  function decode(file) {
    return new Promise(async (resolve, reject) => {
      pendingReject = reject;
      const id = ++requestId;
      worker = new Worker(new URL('./dicom-viewer-worker.mjs', import.meta.url), { type: 'module' });
      worker.onmessage = ({ data }) => {
        if (data?.id !== id) return;
        pendingReject = null;
        worker?.terminate(); worker = null;
        if (data.error) reject(new Error(data.error));
        else resolve({ ...data.image, pixels: new Float32Array(data.image.pixels) });
      };
      worker.onerror = () => { pendingReject = null; worker?.terminate(); worker = null; reject(new Error('invalidDicom')); };
      try {
        const buffer = await file.arrayBuffer();
        if (cancelled) return reject(new Error('cancelled'));
        worker.postMessage({ id, buffer, name: file.name }, [buffer]);
      } catch (error) { reject(error); }
    });
  }

  function formatVector(values) {
    return values.length ? values.map((value) => new Intl.NumberFormat(document.documentElement.lang, { maximumFractionDigits: 3 }).format(value)).join(', ') : f.notAvailable;
  }

  function setMetadata(image, index) {
    const values = [
      [f.slice, `${index + 1} / ${images.length}`],
      [f.modality, image.modality || f.notAvailable],
      [f.dimensions, `${image.columns} × ${image.rows}`],
      [f.pixelSpacing, image.pixelSpacing.length === 2 ? `${formatVector(image.pixelSpacing)} mm` : f.notAvailable],
      [f.sliceThickness, image.sliceThickness ? `${image.sliceThickness} mm` : f.notAvailable],
      [f.imagePosition, formatVector(image.imagePosition)],
      [f.imageOrientation, formatVector(image.imageOrientation)],
      [f.photometric, image.photometric],
      [f.pixelFormat, `${image.bitsStored}/${image.bitsAllocated} bit`],
      [f.transferSyntax, image.transferSyntaxName],
    ];
    const fragment = document.createDocumentFragment();
    for (const [label, value] of values) {
      const term = document.createElement('dt'); term.textContent = label;
      const description = document.createElement('dd'); description.textContent = value;
      fragment.append(term, description);
    }
    metadata.replaceChildren(fragment);
  }

  function draw() {
    if (!images.length) return;
    const index = Number(slice.value);
    const image = images[index];
    const values = windowDicomPixels(image, Number(center.value), Number(width.value));
    canvas.width = image.columns; canvas.height = image.rows;
    const pixels = context.createImageData(image.columns, image.rows);
    for (let source = 0, target = 0; source < values.length; source += 1, target += 4) {
      const value = values[source];
      pixels.data[target] = value; pixels.data[target + 1] = value; pixels.data[target + 2] = value; pixels.data[target + 3] = 255;
    }
    context.putImageData(pixels, 0, 0);
    setMetadata(image, index);
    q('[data-dicom-slice-label]').textContent = `${index + 1} / ${images.length}`;
    previousButton.disabled = index <= 0; nextButton.disabled = index >= images.length - 1;
  }

  function displayError(error) {
    resetView();
    const messages = {
      notPart10: f.notPart10, malformed: f.malformed, unsupportedTransfer: f.unsupportedTransfer,
      unsupportedUndefinedLength: f.unsupportedTransfer, noPixelData: f.noPixelData,
      dimensions: f.dimensionsUnsupported, unsupportedPhotometric: f.unsupportedPhotometric,
      unsupportedPixelFormat: f.unsupportedPixelFormat, multiFrame: f.multiFrame,
      unsupportedModalityLut: f.unsupportedModalityLut, invalidRescale: f.invalidRescale, fileTooLarge: f.fileTooLarge,
    };
    setStatus(messages[error.message] ?? f.invalid, true);
  }

  input.addEventListener('change', async () => {
    cancelled = false;
    if (worker) worker.terminate(); worker = null;
    resetView();
    const files = [...input.files];
    if (!files.length) { setStatus(f.ready); return; }
    const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
    if (files.length > 100 || totalBytes > 128 * 1024 * 1024) { setStatus(f.seriesTooLarge, true); return; }
    if (files.some((file) => file.size > 16 * 1024 * 1024 || file.size === 0)) { setStatus(f.fileTooLarge, true); return; }
    cancelButton.disabled = false;
    input.disabled = true;
    try {
      const decoded = [];
      let pixelsTotal = 0;
      for (let index = 0; index < files.length; index += 1) {
        if (cancelled) throw new Error('cancelled');
        setStatus(`${f.loading} ${index + 1} / ${files.length}`);
        const image = await decode(files[index]);
        pixelsTotal += image.pixels.length;
        if (pixelsTotal > 20_000_000) throw new Error('seriesTooLarge');
        decoded.push(image);
      }
      if (cancelled) return;
      const series = new Set(decoded.map((image) => image.seriesInstanceUid).filter(Boolean));
      if (series.size > 1) throw new Error('multipleSeries');
      if (decoded.some((image) => image.columns !== decoded[0].columns || image.rows !== decoded[0].rows)) throw new Error('mixedDimensions');
      const referenceOrientation = decoded.find((image) => image.imageOrientation.length === 6)?.imageOrientation;
      if (referenceOrientation && decoded.some((image) => image.imageOrientation.length === 6 && image.imageOrientation.some((value, index) => Math.abs(value - referenceOrientation[index]) > 0.0001))) throw new Error('mixedOrientation');
      images = orderDicomSeries(decoded);
      slice.min = '0'; slice.max = String(images.length - 1); slice.value = '0';
      center.value = String(images[0].windowCenter); width.value = String(Math.max(1, images[0].windowWidth));
      slice.disabled = false; center.disabled = false; width.disabled = false;
      output.hidden = false; draw();
      setStatus(series.size ? f.loaded : f.loadedNoSeriesId);
    } catch (error) {
      if (error.message === 'cancelled' || cancelled) { setStatus(f.cancelled); return; }
      if (error.message === 'seriesTooLarge' || error.message === 'multipleSeries' || error.message === 'mixedDimensions' || error.message === 'mixedOrientation') {
        resetView(); setStatus(error.message === 'multipleSeries' ? f.multipleSeries : error.message === 'mixedDimensions' ? f.mixedDimensions : error.message === 'mixedOrientation' ? f.mixedOrientation : f.seriesTooLarge, true);
      } else displayError(error);
    } finally { cancelButton.disabled = true; input.disabled = false; worker?.terminate(); worker = null; }
  });
  slice.addEventListener('input', draw);
  for (const field of [center, width]) field.addEventListener('change', () => {
    if (!images.length) return;
    if (!Number.isFinite(Number(center.value)) || !Number.isFinite(Number(width.value)) || Number(width.value) < 1) {
      setStatus(f.invalidWindow, true); return;
    }
    setStatus(f.loaded); draw();
  });
  previousButton.addEventListener('click', () => { slice.value = String(Math.max(0, Number(slice.value) - 1)); draw(); });
  nextButton.addEventListener('click', () => { slice.value = String(Math.min(images.length - 1, Number(slice.value) + 1)); draw(); });
  cancelButton.addEventListener('click', cancel);
  clearButton.addEventListener('click', () => { if (worker) worker.terminate(); pendingReject?.(new Error('cancelled')); pendingReject = null; worker = null; cancelled = false; resetView(); input.value = ''; cancelButton.disabled = true; setStatus(f.ready); input.focus(); });
  setStatus(f.ready);
}
