const MAX_CELLS = 10_000;
const SYMBOLS = Object.freeze([...`123456789ABCDEFGHIJKLMNO`]);

const clamp = (value) => Math.max(0, Math.min(255, value));
const colorHex = ({ r, g, b }) => `#${[r, g, b].map((value) => Math.round(value).toString(16).padStart(2, '0')).join('').toUpperCase()}`;

function sampleGrid(rgba, sourceWidth, sourceHeight, columns, rows, preserveTransparency) {
  const colors = Array(columns * rows);
  for (let row = 0; row < rows; row += 1) {
    const y0 = Math.floor(row * sourceHeight / rows);
    const y1 = Math.max(y0 + 1, Math.floor((row + 1) * sourceHeight / rows));
    for (let column = 0; column < columns; column += 1) {
      const x0 = Math.floor(column * sourceWidth / columns);
      const x1 = Math.max(x0 + 1, Math.floor((column + 1) * sourceWidth / columns));
      let red = 0; let green = 0; let blue = 0; let alpha = 0; let count = 0;
      for (let y = y0; y < Math.min(y1, sourceHeight); y += 1) {
        for (let x = x0; x < Math.min(x1, sourceWidth); x += 1) {
          const offset = (y * sourceWidth + x) * 4;
          red += rgba[offset]; green += rgba[offset + 1]; blue += rgba[offset + 2]; alpha += rgba[offset + 3]; count += 1;
        }
      }
      const averageAlpha = alpha / count;
      if (preserveTransparency && averageAlpha < 8) { colors[row * columns + column] = null; continue; }
      const opacity = preserveTransparency ? averageAlpha / 255 : 1;
      colors[row * columns + column] = {
        r: (red / count) * opacity + 255 * (1 - opacity),
        g: (green / count) * opacity + 255 * (1 - opacity),
        b: (blue / count) * opacity + 255 * (1 - opacity),
      };
    }
  }
  return colors;
}

function makePalette(colors, limit) {
  const points = new Map();
  for (const color of colors) {
    if (!color) continue;
    // Bound palette work for photographs with millions of unique RGB values.
    // Five-bit bins cap median-cut input at 32,768 points and avoid spreading
    // large arrays into Math.min/Math.max (which can overflow the call stack).
    const r = Math.round(color.r); const g = Math.round(color.g); const b = Math.round(color.b);
    const key = `${r >> 3},${g >> 3},${b >> 3}`;
    const current = points.get(key) ?? { r: 0, g: 0, b: 0, count: 0 };
    current.r += r; current.g += g; current.b += b; current.count += 1; points.set(key, current);
  }
  let boxes = [[...points.values()].map((point) => ({
    r: point.r / point.count, g: point.g / point.count, b: point.b / point.count, count: point.count,
  }))];
  while (boxes.length < limit) {
    let selected = -1; let selectedScore = 0; let selectedChannel = 'r';
    for (let index = 0; index < boxes.length; index += 1) {
      const box = boxes[index];
      if (box.length < 2) continue;
      const channels = ['r', 'g', 'b'].map((channel) => {
        const values = box.map((point) => point[channel]);
        return { channel, range: Math.max(...values) - Math.min(...values) };
      }).sort((a, b) => b.range - a.range);
      const score = channels[0].range * Math.log2(box.reduce((sum, point) => sum + point.count, 0) + 1);
      if (score > selectedScore) { selected = index; selectedScore = score; selectedChannel = channels[0].channel; }
    }
    if (selected < 0) break;
    const box = boxes[selected].slice().sort((a, b) => a[selectedChannel] - b[selectedChannel]);
    const total = box.reduce((sum, point) => sum + point.count, 0);
    let seen = 0; let splitAt = 1;
    for (let index = 0; index < box.length - 1; index += 1) {
      seen += box[index].count;
      if (seen >= total / 2) { splitAt = index + 1; break; }
    }
    boxes.splice(selected, 1, box.slice(0, splitAt), box.slice(splitAt));
  }
  return boxes.map((box) => {
    const count = box.reduce((sum, point) => sum + point.count, 0);
    return {
      r: box.reduce((sum, point) => sum + point.r * point.count, 0) / count,
      g: box.reduce((sum, point) => sum + point.g * point.count, 0) / count,
      b: box.reduce((sum, point) => sum + point.b * point.count, 0) / count,
    };
  });
}

function nearest(color, palette) {
  let choice = 0; let best = Infinity;
  for (let index = 0; index < palette.length; index += 1) {
    const item = palette[index];
    const red = color.r - item.r; const green = color.g - item.g; const blue = color.b - item.b;
    const distance = red * red * 0.299 + green * green * 0.587 + blue * blue * 0.114;
    if (distance < best) { choice = index; best = distance; }
  }
  return choice;
}

function assignColors(colors, palette, columns, rows, dither) {
  const working = colors.map((color) => color ? { ...color } : null);
  const cells = Array(working.length).fill(null);
  const addError = (index, channel, amount) => {
    if (index < 0 || index >= working.length || !working[index]) return;
    working[index][channel] = clamp(working[index][channel] + amount);
  };
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const index = row * columns + column; const color = working[index];
      if (!color) continue;
      const paletteIndex = nearest(color, palette); cells[index] = paletteIndex;
      if (!dither) continue;
      const chosen = palette[paletteIndex];
      const errors = { r: color.r - chosen.r, g: color.g - chosen.g, b: color.b - chosen.b };
      for (const channel of ['r', 'g', 'b']) {
        if (column + 1 < columns) addError(index + 1, channel, errors[channel] * 7 / 16);
        if (row + 1 < rows) {
          if (column > 0) addError(index + columns - 1, channel, errors[channel] * 3 / 16);
          addError(index + columns, channel, errors[channel] * 5 / 16);
          if (column + 1 < columns) addError(index + columns + 1, channel, errors[channel] / 16);
        }
      }
    }
  }
  const counts = Array(palette.length).fill(0);
  for (const index of cells) if (index !== null) counts[index] += 1;
  return { cells, counts };
}

/** Convert local raster pixels into a deterministic, counted craft pattern. */
export function buildBeadPattern({ rgba, sourceWidth, sourceHeight, columns, rows, paletteSize, dither = false, preserveTransparency = false } = {}) {
  const width = Number(sourceWidth); const height = Number(sourceHeight);
  const cols = Number(columns); const requestedRows = Number(rows);
  const rowCount = requestedRows === 0 ? Math.max(1, Math.round(cols * height / width)) : requestedRows;
  const limit = Number(paletteSize);
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || width * height > 4_000_000) throw new RangeError('Image dimensions are outside the supported range.');
  if (!(rgba instanceof Uint8Array || rgba instanceof Uint8ClampedArray) || rgba.length !== width * height * 4) throw new TypeError('Image pixel data is incomplete.');
  if (!Number.isInteger(cols) || cols < 1 || cols > 80 || !Number.isInteger(rowCount) || rowCount < 1 || rowCount > 125 || cols * rowCount > MAX_CELLS) throw new RangeError('Choose a grid of at most 10,000 cells.');
  if (!Number.isInteger(limit) || limit < 1 || limit > SYMBOLS.length) throw new RangeError('Choose between 1 and 24 palette colors.');
  const sampled = sampleGrid(rgba, width, height, cols, rowCount, Boolean(preserveTransparency));
  const palette = makePalette(sampled, limit);
  if (!palette.length) throw new RangeError('The image has no visible cells.');
  const assigned = assignColors(sampled, palette, cols, rowCount, Boolean(dither));
  const colors = palette.map((color, index) => Object.freeze({
    index, symbol: SYMBOLS[index], hex: colorHex(color), count: assigned.counts[index],
  })).filter((color) => color.count > 0);
  const emptyCells = assigned.cells.length - assigned.cells.filter((index) => index !== null).length;
  return Object.freeze({
    columns: cols, rows: rowCount, cellCount: cols * rowCount,
    filledCells: cols * rowCount - emptyCells, emptyCells,
    cells: Object.freeze(assigned.cells), colors: Object.freeze(colors),
    sourceWidth: width, sourceHeight: height,
  });
}

export function beadPatternSvg(pattern, { title = 'Craft pattern', emptyLabel = 'Transparent empty cells', cellSize = 24 } = {}) {
  const width = pattern.columns * cellSize; const height = pattern.rows * cellSize;
  const legendRows = pattern.colors.length + (pattern.emptyCells ? 1 : 0);
  const legendHeight = Math.max(1, legendRows) * 30 + 24;
  const colors = new Map(pattern.colors.map((color) => [color.index, color]));
  const rectangles = [];
  for (let row = 0; row < pattern.rows; row += 1) {
    for (let column = 0; column < pattern.columns; column += 1) {
      const index = pattern.cells[row * pattern.columns + column];
      const x = column * cellSize; const y = row * cellSize;
      if (index === null) rectangles.push(`<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="#fff" stroke="#888"/><text x="${x + cellSize / 2}" y="${y + cellSize * 0.68}" text-anchor="middle" font-family="Arial,sans-serif" font-size="${cellSize * 0.56}" fill="#444">·</text>`);
      else {
        const item = colors.get(index);
        const luminance = item.hex.slice(1).match(/.{2}/gu).map((part) => parseInt(part, 16) / 255).map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
        const ink = luminance[0] * 0.2126 + luminance[1] * 0.7152 + luminance[2] * 0.0722 > 0.42 ? '#111' : '#fff';
        rectangles.push(`<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${item.hex}" stroke="#888"/><text x="${x + cellSize / 2}" y="${y + cellSize * 0.68}" text-anchor="middle" font-family="Arial,sans-serif" font-size="${cellSize * 0.56}" fill="${ink}">${item.symbol}</text>`);
      }
    }
  }
  const legend = pattern.colors.map((color, index) => `<g transform="translate(0 ${height + 22 + index * 30})"><rect width="20" height="20" fill="${color.hex}" stroke="#555"/><text x="28" y="15" font-family="Arial,sans-serif" font-size="14">${color.symbol} · ${color.hex} · ${color.count}</text></g>`).join('');
  const safeEmptyLabel = String(emptyLabel).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
  const emptyLegend = pattern.emptyCells ? `<g transform="translate(0 ${height + 22 + pattern.colors.length * 30})"><rect width="20" height="20" fill="#fff" stroke="#888"/><text x="28" y="15" font-family="Arial,sans-serif" font-size="14">· · ${safeEmptyLabel} · ${pattern.emptyCells}</text></g>` : '';
  const safeTitle = String(title).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height + legendHeight}" viewBox="0 0 ${width} ${height + legendHeight}" role="img" aria-label="${safeTitle}"><title>${safeTitle}</title><rect width="100%" height="100%" fill="#fff"/>${rectangles.join('')}${legend}${emptyLegend}</svg>`;
}

export { MAX_CELLS as BEAD_PATTERN_MAX_CELLS, SYMBOLS as BEAD_PATTERN_SYMBOLS };
