export const MAX_IMAGE_BYTES = 12 * 1024 * 1024;
export const MAX_IMAGE_SIDE = 6000;
export const MAX_PREVIEW_SIDE = 2500;
export const MAX_PANORAMA_PIXELS = 30_000_000;
export const ACCEPTED_IMAGE_TYPES = Object.freeze(['image/jpeg', 'image/png', 'image/webp']);

export function validatePanoramaInputs(files) {
  if (!Array.isArray(files) || files.length !== 2) throw new Error('choose-two-images');
  for (const file of files) {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) throw new Error('unsupported-image-type');
    if (!Number.isFinite(file.size) || file.size <= 0 || file.size > MAX_IMAGE_BYTES) throw new Error('image-size-limit');
    if (!Number.isInteger(file.width) || !Number.isInteger(file.height) || file.width < 1 || file.height < 1 || file.width > MAX_IMAGE_SIDE || file.height > MAX_IMAGE_SIDE) throw new Error('image-dimension-limit');
  }
  return true;
}

export function fitImageDimensions(width, height, maxSide = MAX_PREVIEW_SIDE) {
  if (![width, height, maxSide].every(Number.isFinite) || width <= 0 || height <= 0 || maxSide < 1) throw new Error('invalid-image-dimensions');
  const scale = Math.min(1, maxSide / Math.max(width, height));
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
}

export function validatePanoramaBounds(width, height) {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || width * height > MAX_PANORAMA_PIXELS) throw new Error('panorama-too-large');
  return { width, height };
}
