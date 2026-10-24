export const PHOTO_LIMITS = Object.freeze({ fileBytes: 20 * 1024 * 1024, pixels: 12_000_000 });
const SUPPORTED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export function validateBackgroundImageFile(file) {
  if (!(file instanceof Blob) || !SUPPORTED_TYPES.has(file.type)) throw new TypeError('Choose a JPEG, PNG or WebP image.');
  if (file.size <= 0 || file.size > PHOTO_LIMITS.fileBytes) throw new RangeError('Choose an image up to 20 MiB.');
  return true;
}

export function validatePhotoDimensions(width, height) {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || width * height > PHOTO_LIMITS.pixels) {
    throw new RangeError('The image must be 12 megapixels or smaller.');
  }
  return Object.freeze({ width, height, pixels: width * height });
}

export function coverRect(sourceWidth, sourceHeight, targetWidth, targetHeight) {
  for (const value of [sourceWidth, sourceHeight, targetWidth, targetHeight]) {
    if (!Number.isFinite(value) || value <= 0) throw new RangeError('Image dimensions must be positive.');
  }
  const scale = Math.max(targetWidth / sourceWidth, targetHeight / sourceHeight);
  const width = sourceWidth * scale; const height = sourceHeight * scale;
  return Object.freeze({ x: (targetWidth - width) / 2, y: (targetHeight - height) / 2, width, height });
}
