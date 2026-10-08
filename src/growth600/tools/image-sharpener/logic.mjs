export const MAX_SHARPENER_PIXELS = 8_000_000;

export function validateSharpenerOptions({ amount, radius, threshold }) {
  if (!Number.isFinite(amount) || amount < 0 || amount > 3
    || !Number.isInteger(radius) || radius < 1 || radius > 8
    || !Number.isInteger(threshold) || threshold < 0 || threshold > 64) {
    throw new RangeError('Choose an amount from 0–3, radius from 1–8 and threshold from 0–64.');
  }
  return { amount, radius, threshold };
}

export function validateSharpenerSize(width, height, maxPixels = MAX_SHARPENER_PIXELS) {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1
    || !Number.isSafeInteger(maxPixels) || maxPixels < 1 || width * height > maxPixels) {
    throw new RangeError('Image exceeds the supported pixel count for this device-safe tool.');
  }
  return { width, height, pixels: width * height };
}

function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }

function horizontalBlurRow(source, width, y, radius) {
  const row = new Uint8ClampedArray(width * 4);
  const count = radius * 2 + 1;
  const first = y * width * 4;
  for (let channel = 0; channel < 3; channel += 1) {
    let sum = 0;
    for (let offset = -radius; offset <= radius; offset += 1) sum += source[first + clamp(offset, 0, width - 1) * 4 + channel];
    for (let x = 0; x < width; x += 1) {
      row[x * 4 + channel] = sum / count;
      sum += source[first + clamp(x + radius + 1, 0, width - 1) * 4 + channel]
        - source[first + clamp(x - radius, 0, width - 1) * 4 + channel];
    }
  }
  return row;
}

// Separable box-blur unsharp mask. Only 2r+1 blurred rows are cached, keeping
// temporary memory proportional to image width instead of image area.
export function* sharpenImageDataChunks(imageData, options, rowsPerChunk = 48) {
  const { width, height, data } = imageData ?? {};
  validateSharpenerSize(width, height);
  const { amount, radius, threshold } = validateSharpenerOptions(options ?? {});
  if (!Number.isInteger(rowsPerChunk) || rowsPerChunk < 1 || rowsPerChunk > 256) throw new RangeError('Chunk size must be from 1 to 256 rows.');
  if (!(data instanceof Uint8ClampedArray) || data.length !== width * height * 4) throw new TypeError('A complete RGBA image is required.');
  const output = new Uint8ClampedArray(data);
  if (amount === 0) return { width, height, data: output };

  const rowCache = new Map();
  const getRow = (y) => {
    const rowIndex = clamp(y, 0, height - 1);
    if (!rowCache.has(rowIndex)) rowCache.set(rowIndex, horizontalBlurRow(data, width, rowIndex, radius));
    return rowCache.get(rowIndex);
  };
  const sums = new Float32Array(width * 3);
  for (let offset = -radius; offset <= radius; offset += 1) {
    const row = getRow(offset);
    for (let x = 0; x < width; x += 1) for (let channel = 0; channel < 3; channel += 1) sums[x * 3 + channel] += row[x * 4 + channel];
  }
  const count = radius * 2 + 1;
  for (let y = 0; y < height; y += 1) {
    if (y > 0) {
      const leaving = getRow(y - radius - 1), entering = getRow(y + radius);
      for (let x = 0; x < width; x += 1) for (let channel = 0; channel < 3; channel += 1) sums[x * 3 + channel] += entering[x * 4 + channel] - leaving[x * 4 + channel];
    }
    const rowStart = y * width * 4;
    for (let x = 0; x < width; x += 1) {
      const pixel = rowStart + x * 4, sum = x * 3;
      const red = data[pixel] - sums[sum] / count;
      const green = data[pixel + 1] - sums[sum + 1] / count;
      const blue = data[pixel + 2] - sums[sum + 2] / count;
      if (Math.max(Math.abs(red), Math.abs(green), Math.abs(blue)) < threshold) continue;
      output[pixel] = clamp(data[pixel] + red * amount, 0, 255);
      output[pixel + 1] = clamp(data[pixel + 1] + green * amount, 0, 255);
      output[pixel + 2] = clamp(data[pixel + 2] + blue * amount, 0, 255);
    }
    for (const index of rowCache.keys()) if (index < Math.max(0, y - radius) || index > Math.min(height - 1, y + radius)) rowCache.delete(index);
    if ((y + 1) % rowsPerChunk === 0 && y + 1 < height) yield { rows: y + 1, totalRows: height };
  }
  return { width, height, data: output };
}

export function sharpenImageData(imageData, options) {
  const process = sharpenImageDataChunks(imageData, options);
  let result = process.next();
  while (!result.done) result = process.next();
  return result.value;
}
