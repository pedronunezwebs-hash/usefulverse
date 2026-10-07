export const MAX_IMAGE_PIXELS = 24_000_000;
export const REDACTION_MODES = Object.freeze(['black', 'pixelate', 'blur']);

export function validateImageSize(width, height, maxPixels = MAX_IMAGE_PIXELS) {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1) throw new RangeError('Image dimensions must be positive integers.');
  if (!Number.isSafeInteger(maxPixels) || maxPixels < 1 || width * height > maxPixels) throw new RangeError('Image exceeds the supported pixel count for this device-safe tool.');
  return Object.freeze({ width, height, pixels: width * height });
}

export function normalizeRedactionRegion({ x, y, width, height }, imageWidth, imageHeight) {
  if (![x, y, width, height, imageWidth, imageHeight].every(Number.isFinite)
    || !Number.isInteger(x) || !Number.isInteger(y) || !Number.isInteger(width) || !Number.isInteger(height)
    || !Number.isInteger(imageWidth) || !Number.isInteger(imageHeight)
    || x < 0 || y < 0 || width < 1 || height < 1 || x + width > imageWidth || y + height > imageHeight) {
    throw new RangeError('Redaction region must be a positive whole-pixel rectangle inside the image.');
  }
  return Object.freeze({ x, y, width, height });
}

export function mapPointerRegion(start, end, scaleX, scaleY, imageWidth, imageHeight) {
  if (![start?.x, start?.y, end?.x, end?.y, scaleX, scaleY].every(Number.isFinite) || scaleX <= 0 || scaleY <= 0) {
    throw new RangeError('Pointer coordinates and canvas scales must be valid.');
  }
  const left = Math.max(0, Math.min(start.x, end.x));
  const top = Math.max(0, Math.min(start.y, end.y));
  const right = Math.min(imageWidth, Math.max(start.x, end.x));
  const bottom = Math.min(imageHeight, Math.max(start.y, end.y));
  return normalizeRedactionRegion({
    x: Math.floor(left * scaleX), y: Math.floor(top * scaleY),
    width: Math.ceil((right - left) * scaleX), height: Math.ceil((bottom - top) * scaleY),
  }, imageWidth, imageHeight);
}

export function validateRedactionMode(mode) {
  if (!REDACTION_MODES.includes(mode)) throw new RangeError('Choose black, pixelate or blur redaction.');
  return mode;
}
