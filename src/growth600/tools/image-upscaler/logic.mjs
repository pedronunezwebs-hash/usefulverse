export const MAX_UPSCALER_PIXELS = 1_000_000;
export const UPSCALER_SCALE = 2;
export const UPSCALER_TILE_CORE = 224;
export const UPSCALER_TILE_OVERLAP = 16;

export function validateUpscalerSize(width, height, maxPixels = MAX_UPSCALER_PIXELS) {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1
    || !Number.isSafeInteger(maxPixels) || maxPixels < 1 || width * height > maxPixels) {
    throw new RangeError('Image exceeds the supported pixel count for this device-safe tool.');
  }
  return { width, height, pixels: width * height, outputWidth: width * UPSCALER_SCALE, outputHeight: height * UPSCALER_SCALE };
}

export function createUpscaleTiles(width, height, core = UPSCALER_TILE_CORE, overlap = UPSCALER_TILE_OVERLAP) {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1
    || !Number.isInteger(core) || core < 8 || core % 8 !== 0
    || !Number.isInteger(overlap) || overlap < 0 || overlap > 64) throw new RangeError('Invalid tile dimensions.');
  const tiles = [];
  for (let y = 0; y < height; y += core) for (let x = 0; x < width; x += core) {
    const coreWidth = Math.min(core, width - x);
    const coreHeight = Math.min(core, height - y);
    const left = Math.max(0, x - overlap);
    const top = Math.max(0, y - overlap);
    const right = Math.min(width, x + coreWidth + overlap);
    const bottom = Math.min(height, y + coreHeight + overlap);
    tiles.push({ x, y, coreWidth, coreHeight, left, top, width: right - left, height: bottom - top, cropX: (x - left) * UPSCALER_SCALE, cropY: (y - top) * UPSCALER_SCALE });
  }
  return tiles;
}

export function validateUpscaledOutput(width, height, outputWidth, outputHeight) {
  validateUpscalerSize(width, height);
  if (outputWidth !== width * UPSCALER_SCALE || outputHeight !== height * UPSCALER_SCALE) {
    throw new RangeError('The upscaler output must be exactly twice the source dimensions.');
  }
  return { width: outputWidth, height: outputHeight };
}
