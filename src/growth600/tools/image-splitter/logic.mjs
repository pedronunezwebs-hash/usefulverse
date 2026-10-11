export const MAX_SPLITTER_PIXELS = 12_000_000;
export const MAX_SPLITTER_TILES = 100;
export const MAX_SPLITTER_OVERLAP = 256;

export function createImageTilePlan({ width, height, mode = 'grid', columns, rows, tileWidth, tileHeight, overlap = 0, maxPixels = MAX_SPLITTER_PIXELS }) {
  if (![width, height, overlap].every(Number.isInteger)
    || width < 1 || height < 1 || overlap < 0 || overlap > MAX_SPLITTER_OVERLAP
    || !Number.isSafeInteger(maxPixels) || maxPixels < 1 || width * height > maxPixels) {
    throw new RangeError('Choose valid image dimensions, a grid of at most 100 tiles, and a supported overlap.');
  }
  if (mode === 'grid') {
    if (![columns, rows].every(Number.isInteger) || columns < 1 || rows < 1 || columns > 20 || rows > 20 || columns * rows > MAX_SPLITTER_TILES || columns > width || rows > height) {
      throw new RangeError('Choose valid image dimensions, a grid of at most 100 tiles, and a supported overlap.');
    }
  } else if (mode === 'tile-size') {
    if (![tileWidth, tileHeight].every(Number.isInteger) || tileWidth < 1 || tileHeight < 1 || tileWidth > MAX_SPLITTER_PIXELS || tileHeight > MAX_SPLITTER_PIXELS) {
      throw new RangeError('Tile width and height must be positive whole pixels.');
    }
    columns = Math.ceil(width / tileWidth);
    rows = Math.ceil(height / tileHeight);
    if (columns * rows > MAX_SPLITTER_TILES) throw new RangeError('The fixed tile size would create more than 100 tiles.');
  } else throw new RangeError('Choose grid or fixed tile dimensions.');

  const tiles = [];
  for (let row = 0; row < rows; row += 1) {
    const coreY = mode === 'tile-size' ? row * tileHeight : Math.floor(row * height / rows);
    const coreBottom = mode === 'tile-size' ? Math.min(height, (row + 1) * tileHeight) : Math.floor((row + 1) * height / rows);
    for (let column = 0; column < columns; column += 1) {
      const coreX = mode === 'tile-size' ? column * tileWidth : Math.floor(column * width / columns);
      const coreRight = mode === 'tile-size' ? Math.min(width, (column + 1) * tileWidth) : Math.floor((column + 1) * width / columns);
      const x = Math.max(0, coreX - overlap);
      const y = Math.max(0, coreY - overlap);
      const right = Math.min(width, coreRight + overlap);
      const bottom = Math.min(height, coreBottom + overlap);
      tiles.push(Object.freeze({
        index: tiles.length,
        row,
        column,
        x,
        y,
        width: right - x,
        height: bottom - y,
        core: Object.freeze({ x: coreX - x, y: coreY - y, width: coreRight - coreX, height: coreBottom - coreY }),
      }));
    }
  }
  return Object.freeze({ width, height, mode, columns, rows, tileWidth: mode === 'tile-size' ? tileWidth : null, tileHeight: mode === 'tile-size' ? tileHeight : null, overlap, tiles: Object.freeze(tiles) });
}

export function safeImageBaseName(filename) {
  const withoutExtension = String(filename ?? '').replace(/\.[^.]*$/u, '');
  const safe = withoutExtension.normalize('NFKC').replace(/[^\p{L}\p{N}_-]+/gu, '-').replace(/^-+|-+$/gu, '').slice(0, 70);
  return safe || 'image';
}

export function formatTileName(baseName, row, column) {
  const digits = (value) => String(value + 1).padStart(2, '0');
  return `${safeImageBaseName(baseName)}-r${digits(row)}-c${digits(column)}.png`;
}
