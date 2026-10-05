import { COLOR_IMAGE_MAX_BYTES, COLOR_IMAGE_MAX_PIXELS, COLOR_VISION_MODES, simulateColorVision, validateColorImage } from './color-vision-logic.mjs';

export function setupColorVision(root) {
  const box = root.querySelector('[data-color-vision]');
  if (!box) return;
  const input = box.querySelector('#color-vision-file');
  const mode = box.querySelector('[data-color-vision-mode]');
  const originalCanvas = box.querySelector('[data-color-vision-original]');
  const resultCanvas = box.querySelector('[data-color-vision-result]');
  const status = box.querySelector('#op-status');
  const messages = JSON.parse(box.closest('[data-planner-messages]')?.dataset.plannerMessages ?? '{}');
  let originalPixels = null;
  let width = 0;
  let height = 0;
  let generation = 0;

  const say = (message, state = '') => {
    status.textContent = message;
    status.dataset.state = state;
  };
  const release = () => {
    generation += 1;
    originalPixels = null; width = 0; height = 0;
    for (const canvas of [originalCanvas, resultCanvas]) {
      canvas.width = 0; canvas.height = 0;
      canvas.removeAttribute('style');
    }
  };
  const draw = () => {
    if (!originalPixels) return;
    const context = resultCanvas.getContext('2d', { willReadFrequently: true });
    const simulated = simulateColorVision(originalPixels.data, mode.value);
    if (!simulated || !COLOR_VISION_MODES.includes(mode.value)) {
      say(messages['Color vision simulation failed. Try another image.'], 'error'); return;
    }
    originalCanvas.width = resultCanvas.width = width;
    originalCanvas.height = resultCanvas.height = height;
    originalCanvas.getContext('2d').putImageData(originalPixels, 0, 0);
    context.putImageData(new ImageData(simulated, width, height), 0, 0);
  };
  const loadImage = async (file) => {
    release();
    const currentGeneration = generation;
    if (validateColorImage({ type: file.type, size: file.size, width: 1, height: 1 }) === 'type') { input.value = ''; say(messages['Choose a PNG, JPEG, WebP, GIF or BMP image.'], 'error'); return; }
    if (file.size > COLOR_IMAGE_MAX_BYTES) { input.value = ''; say(messages['The image is larger than 10 MB. Choose a smaller file.'], 'error'); return; }
    let bitmap;
    try {
      bitmap = await createImageBitmap(file);
      if (currentGeneration !== generation) return;
      width = bitmap.width; height = bitmap.height;
      if (validateColorImage({ type: file.type, size: file.size, width, height }) === 'pixels') {
        release(); input.value = '';
        say(messages['The image exceeds the 8-megapixel limit. Choose a smaller image.'], 'error'); return;
      }
      originalCanvas.width = resultCanvas.width = width;
      originalCanvas.height = resultCanvas.height = height;
      const context = originalCanvas.getContext('2d', { willReadFrequently: true });
      context.drawImage(bitmap, 0, 0);
      originalPixels = context.getImageData(0, 0, width, height);
      draw(); say(messages['Image loaded locally. Choose a simulation mode.']);
    } catch {
      release(); input.value = ''; say(messages['This image could not be opened by your browser.'], 'error');
    } finally { bitmap?.close(); }
  };
  input.addEventListener('change', () => { const file = input.files?.[0]; if (file) void loadImage(file); });
  mode.addEventListener('change', () => {
    draw();
    if (originalPixels) say(mode.options[mode.selectedIndex].text);
  });
  box.querySelector('[data-color-vision-clear]').addEventListener('click', () => {
    release(); input.value = ''; mode.value = 'normal'; say(messages['Image cleared.']);
  });
  box.querySelector('[data-color-vision-sample]').addEventListener('click', () => {
    release(); input.value = ''; mode.value = 'normal';
    width = 600; height = 320; originalCanvas.width = resultCanvas.width = width; originalCanvas.height = resultCanvas.height = height;
    const context = originalCanvas.getContext('2d', { willReadFrequently: true });
    context.fillStyle = '#fff'; context.fillRect(0, 0, width, height);
    const colors = ['#e53935', '#fb8c00', '#fdd835', '#43a047', '#00acc1', '#1e88e5', '#3949ab', '#8e24aa', '#ec407a', '#795548', '#757575', '#111111'];
    colors.forEach((color, index) => {
      const x = 16 + (index % 4) * 145; const y = 16 + Math.floor(index / 4) * 96;
      context.fillStyle = color; context.fillRect(x, y, 120, 56);
      context.fillStyle = '#111'; context.font = '14px sans-serif'; context.fillText(color, x, y + 76);
    });
    originalPixels = context.getImageData(0, 0, width, height); draw(); say(messages['Sample palette created.']);
  });
}
