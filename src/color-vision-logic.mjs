const MATRICES = Object.freeze({
  protanopia: [[0.567, 0.433, 0], [0.558, 0.442, 0], [0, 0.242, 0.758]],
  deuteranopia: [[0.625, 0.375, 0], [0.7, 0.3, 0], [0, 0.3, 0.7]],
  tritanopia: [[0.95, 0.05, 0], [0, 0.433, 0.567], [0, 0.475, 0.525]],
});

export const COLOR_VISION_MODES = Object.freeze(['normal', 'protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia']);
export const COLOR_IMAGE_MAX_BYTES = 10 * 1024 * 1024;
export const COLOR_IMAGE_MAX_PIXELS = 4_000_000;
const SUPPORTED_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/bmp']);

export function validateColorImage({ type, size, width, height } = {}) {
  if (!SUPPORTED_IMAGE_TYPES.has(type)) return 'type';
  if (!Number.isSafeInteger(size) || size < 0 || size > COLOR_IMAGE_MAX_BYTES) return 'size';
  if (!Number.isSafeInteger(width) || !Number.isSafeInteger(height) || width < 1 || height < 1 || width * height > COLOR_IMAGE_MAX_PIXELS) return 'pixels';
  return 'ok';
}

export function simulateColorVision(data, mode) {
  if (!data || !ArrayBuffer.isView(data) || data.length % 4 !== 0 || !COLOR_VISION_MODES.includes(mode)) return null;
  const output = new Uint8ClampedArray(data.length);
  const matrix = MATRICES[mode];
  for (let index = 0; index < data.length; index += 4) {
    const red = data[index]; const green = data[index + 1]; const blue = data[index + 2]; const alpha = data[index + 3];
    if (mode === 'normal') { output.set([red, green, blue, alpha], index); continue; }
    if (mode === 'achromatopsia') {
      const gray = Math.round(0.2126 * red + 0.7152 * green + 0.0722 * blue);
      output.set([gray, gray, gray, alpha], index); continue;
    }
    output[index] = Math.round(matrix[0][0] * red + matrix[0][1] * green + matrix[0][2] * blue);
    output[index + 1] = Math.round(matrix[1][0] * red + matrix[1][1] * green + matrix[1][2] * blue);
    output[index + 2] = Math.round(matrix[2][0] * red + matrix[2][1] * green + matrix[2][2] * blue);
    output[index + 3] = alpha;
  }
  return output;
}
