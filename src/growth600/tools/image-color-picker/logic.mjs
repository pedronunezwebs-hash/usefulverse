export const MAX_IMAGE_COLOR_PICKER_PIXELS = 12_000_000;
export const MAX_IMAGE_COLOR_SAMPLES = 24;

export function validateColorPickerSize(width, height, maxPixels = MAX_IMAGE_COLOR_PICKER_PIXELS) {
  if (!Number.isSafeInteger(width) || !Number.isSafeInteger(height) || width < 1 || height < 1
    || !Number.isSafeInteger(maxPixels) || maxPixels < 1 || width * height > maxPixels) {
    throw new RangeError('Image exceeds the supported pixel count for this device-safe tool.');
  }
  return Object.freeze({ width, height, pixels: width * height });
}

function validateByte(value, name) {
  if (!Number.isInteger(value) || value < 0 || value > 255) throw new RangeError(`${name} must be a whole byte from 0 to 255.`);
  return value;
}

export function normalizeColorSample({ x, y, r, g, b, a }) {
  if (!Number.isSafeInteger(x) || !Number.isSafeInteger(y) || x < 0 || y < 0) throw new RangeError('Pixel coordinates must be non-negative whole numbers.');
  return Object.freeze({ x, y, r: validateByte(r, 'Red'), g: validateByte(g, 'Green'), b: validateByte(b, 'Blue'), a: validateByte(a, 'Alpha') });
}

export function formatColorSample(sample) {
  const { r, g, b, a } = normalizeColorSample(sample);
  const hex = (value) => value.toString(16).padStart(2, '0').toUpperCase();
  const alpha = Number((a / 255).toFixed(3));
  return Object.freeze({
    hex: `#${hex(r)}${hex(g)}${hex(b)}${a === 255 ? '' : hex(a)}`,
    rgb: `${r}, ${g}, ${b}`,
    rgba: `rgba(${r}, ${g}, ${b}, ${alpha})`,
    cssColor: `rgba(${r}, ${g}, ${b}, ${alpha})`,
  });
}

export function mapPreviewPoint(clientX, clientY, rect, sourceRect, imageWidth, imageHeight) {
  const values = [clientX, clientY, rect?.left, rect?.top, rect?.width, rect?.height, sourceRect?.x, sourceRect?.y, sourceRect?.width, sourceRect?.height];
  validateColorPickerSize(imageWidth, imageHeight, Number.MAX_SAFE_INTEGER);
  if (!values.every(Number.isFinite) || rect.width <= 0 || rect.height <= 0
    || sourceRect.x < 0 || sourceRect.y < 0 || sourceRect.width <= 0 || sourceRect.height <= 0
    || sourceRect.x + sourceRect.width > imageWidth || sourceRect.y + sourceRect.height > imageHeight) {
    throw new RangeError('Preview and source image coordinates must be valid.');
  }
  const previewX = Math.max(0, Math.min(1 - Number.EPSILON, (clientX - rect.left) / rect.width));
  const previewY = Math.max(0, Math.min(1 - Number.EPSILON, (clientY - rect.top) / rect.height));
  return Object.freeze({
    x: Math.min(imageWidth - 1, Math.floor(sourceRect.x + previewX * sourceRect.width)),
    y: Math.min(imageHeight - 1, Math.floor(sourceRect.y + previewY * sourceRect.height)),
  });
}

export function addColorSample(palette, sample, limit = MAX_IMAGE_COLOR_SAMPLES) {
  if (!Array.isArray(palette) || !Number.isSafeInteger(limit) || limit < 1) throw new TypeError('A palette and a positive sample limit are required.');
  if (palette.length >= limit) throw new RangeError('The palette has reached its sample limit.');
  return Object.freeze([...palette, normalizeColorSample(sample)]);
}
