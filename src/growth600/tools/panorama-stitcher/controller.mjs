import { fitImageDimensions, validatePanoramaInputs } from './logic.mjs';

const root = document.querySelector('[data-panorama-stitcher]');
if (root) {
  const copy = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const form = root.querySelector('[data-panorama-form]');
  const input = form.elements.namedItem('images');
  const status = root.querySelector('[data-status]');
  const result = root.querySelector('[data-result]');
  const image = root.querySelector('[data-panorama-preview]');
  const download = root.querySelector('[data-download]');
  let worker;
  let objectUrl;

  function announce(message, error = false) {
    status.textContent = message;
    status.classList.toggle('status--error', error);
    status.classList.toggle('status--success', Boolean(message) && !error);
  }
  function stopWorker() { worker?.terminate(); worker = undefined; }
  function clearOutput() {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = undefined; image.removeAttribute('src'); download.removeAttribute('href'); result.hidden = true;
  }
  function errorMessage(code) {
    return copy.messages[code] ?? copy.messages.failed;
  }
  async function imageData(file) {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    try {
      if (bitmap.width > 6000 || bitmap.height > 6000) throw new Error('image-dimension-limit');
      const size = fitImageDimensions(bitmap.width, bitmap.height);
      const canvas = new OffscreenCanvas(size.width, size.height);
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) throw new Error('canvas-unavailable');
      context.drawImage(bitmap, 0, 0, size.width, size.height);
      const data = context.getImageData(0, 0, size.width, size.height);
      return { data: data.data.buffer, width: data.width, height: data.height };
    } finally { bitmap.close(); }
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault(); clearOutput(); stopWorker();
    const files = Array.from(input.files ?? []);
    try {
      if (files.length !== 2 || files.some(file => file.type === '')) throw new Error('choose-two-images');
      if (files.some(file => file.size > 12 * 1024 * 1024 || file.size <= 0)) throw new Error('image-size-limit');
      const dimensions = await Promise.all(files.map(async (file) => { const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' }); const value = { width: bitmap.width, height: bitmap.height }; bitmap.close(); return value; }));
      validatePanoramaInputs(files.map((file, i) => ({ type: file.type, size: file.size, ...dimensions[i] })));
      announce(copy.messages.loading);
      const [left, right] = await Promise.all(files.map(imageData));
      worker = new Worker('/assets/panorama-stitcher/worker.js');
      worker.addEventListener('message', (messageEvent) => {
        const data = messageEvent.data;
        if (data.type === 'progress') { announce(copy.messages[data.message] ?? copy.messages.aligning); return; }
        if (data.type === 'error') { announce(errorMessage(data.code), true); stopWorker(); return; }
        if (data.type === 'result') {
          const blob = new Blob([data.buffer], { type: 'image/jpeg' });
          objectUrl = URL.createObjectURL(blob); image.src = objectUrl; result.hidden = false;
          download.href = objectUrl; download.download = 'usefulverse-panorama.jpg'; download.hidden = false;
          root.querySelector('[data-panorama-dimensions]').textContent = copy.messages.dimensions.replace('{width}', String(data.width)).replace('{height}', String(data.height));
          announce(copy.messages.complete); stopWorker();
        }
      });
      worker.addEventListener('error', () => { announce(copy.messages.failed, true); stopWorker(); });
      worker.postMessage({ left, right }, [left.data, right.data]);
    } catch (error) {
      announce(errorMessage(error?.message), true);
    }
  });

  form.addEventListener('reset', () => {
    stopWorker(); clearOutput(); announce(copy.messages.cleared);
  });
  input.addEventListener('change', () => { clearOutput(); announce(''); });
  window.addEventListener('pagehide', () => { stopWorker(); clearOutput(); }, { once: true });
}
