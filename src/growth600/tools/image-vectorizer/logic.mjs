export const IMAGE_VECTORIZER_LIMITS = Object.freeze({ maxDimension: 256, maxPixels: 256 * 256, maxColors: 16, maxPaths: 32768 });

function validateRaster({ width, height, data, colorCount, alphaThreshold }) {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || width > IMAGE_VECTORIZER_LIMITS.maxDimension || height > IMAGE_VECTORIZER_LIMITS.maxDimension || width * height > IMAGE_VECTORIZER_LIMITS.maxPixels) throw new RangeError('Raster dimensions exceed the supported limit.');
  if (!data || data.length !== width * height * 4) throw new RangeError('Raster pixel data is invalid.');
  if (!Number.isInteger(colorCount) || colorCount < 2 || colorCount > IMAGE_VECTORIZER_LIMITS.maxColors) throw new RangeError('Choose 2 to 16 colors.');
  if (!Number.isInteger(alphaThreshold) || alphaThreshold < 0 || alphaThreshold > 255) throw new RangeError('Transparency threshold must be from 0 to 255.');
}

function paletteFor(data, alphaThreshold, colorCount) {
  const histogram = new Map();
  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3];
    if (alpha < alphaThreshold || alpha === 0) continue;
    const inverse = (255 - alpha) / 255;
    const red = Math.round(data[i] + 255 * inverse);
    const green = Math.round(data[i + 1] + 255 * inverse);
    const blue = Math.round(data[i + 2] + 255 * inverse);
    const key = (red << 16) | (green << 8) | blue;
    const entry = histogram.get(key) ?? { red, green, blue, count: 0 };
    entry.count += 1;
    histogram.set(key, entry);
  }
  if (histogram.size === 0) return [];
  let boxes = [[...histogram.values()]];
  while (boxes.length < colorCount) {
    let splitIndex = -1;
    let splitChannel = 'red';
    let largestRange = 0;
    for (let i = 0; i < boxes.length; i += 1) {
      const box = boxes[i];
      if (box.length < 2) continue;
      for (const channel of ['red', 'green', 'blue']) {
        let minimum = 255, maximum = 0;
        for (const item of box) { minimum = Math.min(minimum, item[channel]); maximum = Math.max(maximum, item[channel]); }
        const range = maximum - minimum;
        if (range > largestRange) { largestRange = range; splitIndex = i; splitChannel = channel; }
      }
    }
    if (splitIndex < 0 || largestRange === 0) break;
    const sorted = boxes[splitIndex].slice().sort((a, b) => a[splitChannel] - b[splitChannel]);
    const half = sorted.reduce((sum, item) => sum + item.count, 0) / 2;
    let cumulative = 0;
    let cut = 1;
    for (; cut < sorted.length; cut += 1) { cumulative += sorted[cut - 1].count; if (cumulative >= half) break; }
    boxes.splice(splitIndex, 1, sorted.slice(0, cut), sorted.slice(cut));
  }
  return boxes.map((box) => {
    const total = box.reduce((sum, item) => sum + item.count, 0);
    return box.reduce((average, item) => ({ red: average.red + item.red * item.count / total, green: average.green + item.green * item.count / total, blue: average.blue + item.blue * item.count / total }), { red: 0, green: 0, blue: 0 });
  }).map(({ red, green, blue }) => ({ red: Math.round(red), green: Math.round(green), blue: Math.round(blue) }));
}

const colorHex = ({ red, green, blue }) => `#${[red, green, blue].map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;

export function traceRasterToSvg({ width, height, data, colorCount = 8, alphaThreshold = 128, mergeRuns = true }) {
  validateRaster({ width, height, data, colorCount, alphaThreshold });
  const palette = paletteFor(data, alphaThreshold, colorCount);
  if (palette.length === 0) throw new RangeError('No visible pixels remain. Lower the transparency threshold.');
  const assignments = new Int16Array(width * height).fill(-1);
  for (let pixel = 0; pixel < assignments.length; pixel += 1) {
    const offset = pixel * 4;
    const alpha = data[offset + 3];
    if (alpha < alphaThreshold || alpha === 0) continue;
    const inverse = (255 - alpha) / 255;
    const red = data[offset] + 255 * inverse;
    const green = data[offset + 1] + 255 * inverse;
    const blue = data[offset + 2] + 255 * inverse;
    let nearest = 0;
    let distance = Infinity;
    for (let index = 0; index < palette.length; index += 1) {
      const dr = red - palette[index].red, dg = green - palette[index].green, db = blue - palette[index].blue;
      const candidate = dr * dr + dg * dg + db * db;
      if (candidate < distance) { distance = candidate; nearest = index; }
    }
    assignments[pixel] = nearest;
  }

  const paths = palette.map(() => []);
  let active = new Map();
  let rectangleCount = 0;
  for (let y = 0; y < height; y += 1) {
    const next = new Map();
    let start = 0;
    while (start < width) {
      const color = assignments[y * width + start];
      if (color < 0) { start += 1; continue; }
      let end = start + 1;
      while (end < width && assignments[y * width + end] === color) end += 1;
      const key = mergeRuns ? `${color}:${start}:${end}` : `${color}:${start}:${end}:${y}`;
      const prior = mergeRuns ? active.get(key) : null;
      if (prior) { prior.height += 1; next.set(key, prior); }
      else next.set(key, { color, x: start, y, width: end - start, height: 1 });
      start = end;
    }
    for (const [key, rectangle] of active) {
      if (next.has(key)) continue;
      paths[rectangle.color].push(rectangle);
      rectangleCount += 1;
      if (rectangleCount > IMAGE_VECTORIZER_LIMITS.maxPaths) throw new RangeError('This image creates too many path sections. Reduce the detail or use simpler artwork.');
    }
    active = next;
  }
  for (const rectangle of active.values()) {
    paths[rectangle.color].push(rectangle);
    rectangleCount += 1;
    if (rectangleCount > IMAGE_VECTORIZER_LIMITS.maxPaths) throw new RangeError('This image creates too many path sections. Reduce the detail or use simpler artwork.');
  }
  const svgPaths = paths.map((rectangles, index) => {
    if (!rectangles.length) return '';
    const commands = rectangles.map(({ x, y, width: runWidth, height: runHeight }) => `M${x} ${y}h${runWidth}v${runHeight}h-${runWidth}Z`).join('');
    return `<path fill="${colorHex(palette[index])}" d="${commands}"/>`;
  }).filter(Boolean);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" shape-rendering="crispEdges">${svgPaths.join('')}</svg>`;
  return Object.freeze({ svg, width, height, colorCount: svgPaths.length, pathCount: rectangleCount, palette: Object.freeze(palette.map(colorHex)) });
}
