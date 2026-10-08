export const MAX_SKETCH_PIXELS = 8_000_000;

export function validateSketchSize(width, height, maxPixels = MAX_SKETCH_PIXELS) {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1
    || !Number.isSafeInteger(maxPixels) || maxPixels < 1 || width * height > maxPixels) {
    throw new RangeError('Image exceeds the supported pixel count for this device-safe tool.');
  }
  return { width, height, pixels: width * height };
}

export function validateSketchOptions({ intensity, detail }) {
  if (!Number.isFinite(intensity) || intensity < 0.25 || intensity > 1.5
    || !Number.isInteger(detail) || detail < 0 || detail > 100) {
    throw new RangeError('Choose intensity from 0.25 to 1.5 and detail from 0 to 100.');
  }
  return { intensity, detail };
}

const clampByte = (value) => Math.max(0, Math.min(255, Math.round(value)));

function lumaAt(gray, width, height, x, y) {
  const px = Math.max(0, Math.min(width - 1, x));
  const py = Math.max(0, Math.min(height - 1, y));
  return gray[py * width + px];
}

export function* sketchImageDataChunks(imageData, options, rowsPerChunk = 48) {
  const { width, height, data } = imageData ?? {};
  validateSketchSize(width, height);
  const { intensity, detail } = validateSketchOptions(options ?? {});
  if (!Number.isInteger(rowsPerChunk) || rowsPerChunk < 1 || rowsPerChunk > 256) throw new RangeError('Chunk size must be from 1 to 256 rows.');
  if (!(data instanceof Uint8ClampedArray) || data.length !== width * height * 4) throw new TypeError('A complete RGBA image is required.');

  const gray = new Uint8Array(width * height);
  for (let pixel = 0; pixel < gray.length; pixel += 1) {
    const offset = pixel * 4;
    gray[pixel] = clampByte(data[offset] * 0.2126 + data[offset + 1] * 0.7152 + data[offset + 2] * 0.0722);
  }
  const output = new Uint8ClampedArray(data);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const gx = -lumaAt(gray, width, height, x - 1, y - 1) + lumaAt(gray, width, height, x + 1, y - 1)
        - 2 * lumaAt(gray, width, height, x - 1, y) + 2 * lumaAt(gray, width, height, x + 1, y)
        - lumaAt(gray, width, height, x - 1, y + 1) + lumaAt(gray, width, height, x + 1, y + 1);
      const gy = -lumaAt(gray, width, height, x - 1, y - 1) - 2 * lumaAt(gray, width, height, x, y - 1) - lumaAt(gray, width, height, x + 1, y - 1)
        + lumaAt(gray, width, height, x - 1, y + 1) + 2 * lumaAt(gray, width, height, x, y + 1) + lumaAt(gray, width, height, x + 1, y + 1);
      const edge = Math.max(0, Math.hypot(gx, gy) / 4 - detail) * intensity;
      const tone = (255 - gray[y * width + x]) * 0.22 * intensity;
      const value = clampByte(255 - Math.max(edge, tone));
      const offset = (y * width + x) * 4;
      output[offset] = value;
      output[offset + 1] = value;
      output[offset + 2] = value;
    }
    if ((y + 1) % rowsPerChunk === 0 && y + 1 < height) yield { rows: y + 1, totalRows: height };
  }
  return { width, height, data: output };
}

export function sketchImageData(imageData, options) {
  const processor = sketchImageDataChunks(imageData, options);
  let step = processor.next();
  while (!step.done) step = processor.next();
  return step.value;
}
