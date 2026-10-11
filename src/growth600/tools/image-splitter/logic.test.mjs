import test from 'node:test';
import assert from 'node:assert/strict';
import { createImageTilePlan, formatTileName, safeImageBaseName } from './logic.mjs';

test('grid cores cover every source pixel exactly once without gaps or duplicate core pixels', () => {
  const plan = createImageTilePlan({ width: 13, height: 7, columns: 4, rows: 3 });
  const covered = new Uint8Array(plan.width * plan.height);
  for (const tile of plan.tiles) {
    for (let y = 0; y < tile.core.height; y += 1) for (let x = 0; x < tile.core.width; x += 1) {
      const sourceX = tile.x + tile.core.x + x;
      const sourceY = tile.y + tile.core.y + y;
      covered[sourceY * plan.width + sourceX] += 1;
    }
  }
  assert.ok(covered.every((count) => count === 1));
  assert.equal(plan.tiles.length, 12);
});

test('overlap expands tile crops but preserves gapless core stitching metadata', () => {
  const plan = createImageTilePlan({ width: 100, height: 60, columns: 2, rows: 2, overlap: 5 });
  assert.deepEqual(plan.tiles.map(({ x, y, width, height }) => [x, y, width, height]), [
    [0, 0, 55, 35], [45, 0, 55, 35], [0, 25, 55, 35], [45, 25, 55, 35],
  ]);
  assert.deepEqual(plan.tiles[0].core, { x: 0, y: 0, width: 50, height: 30 });
  assert.deepEqual(plan.tiles[3].core, { x: 5, y: 5, width: 50, height: 30 });
});

test('fixed tile dimensions create predictable edge tiles and cover odd image dimensions exactly once', () => {
  const plan = createImageTilePlan({ width: 13, height: 7, mode: 'tile-size', tileWidth: 5, tileHeight: 3, overlap: 1 });
  assert.equal(plan.columns, 3);
  assert.equal(plan.rows, 3);
  assert.equal(plan.tiles.length, 9);
  assert.equal(plan.tiles.at(-1).core.width, 3);
  assert.equal(plan.tiles.at(-1).core.height, 1);
  const covered = new Uint8Array(plan.width * plan.height);
  for (const tile of plan.tiles) {
    for (let y = 0; y < tile.core.height; y += 1) for (let x = 0; x < tile.core.width; x += 1) {
      covered[(tile.y + tile.core.y + y) * plan.width + tile.x + tile.core.x + x] += 1;
    }
  }
  assert.ok(covered.every((count) => count === 1));
});

test('fixed tile dimensions reject invalid dimensions and more than 100 resulting tiles', () => {
  assert.throws(() => createImageTilePlan({ width: 10, height: 10, mode: 'tile-size', tileWidth: 0, tileHeight: 2 }), RangeError);
  assert.throws(() => createImageTilePlan({ width: 100, height: 100, mode: 'tile-size', tileWidth: 9, tileHeight: 9 }), /more than 100 tiles/u);
});

test('rejects oversized images, excessive tile count, fractional input, and empty tiles', () => {
  assert.throws(() => createImageTilePlan({ width: 5000, height: 3000, columns: 1, rows: 1 }), RangeError);
  assert.throws(() => createImageTilePlan({ width: 10, height: 10, columns: 11, rows: 1 }), RangeError);
  assert.throws(() => createImageTilePlan({ width: 10, height: 10, columns: 10, rows: 11 }), RangeError);
  assert.throws(() => createImageTilePlan({ width: 10.5, height: 10, columns: 2, rows: 2 }), RangeError);
});

test('tile names are safe and deterministic for international filenames', () => {
  assert.equal(safeImageBaseName('../Mi viaje: 東京!.jpg'), 'Mi-viaje-東京');
  assert.equal(formatTileName('Mi viaje.jpg', 0, 9), 'Mi-viaje-r01-c10.png');
  assert.equal(safeImageBaseName('...'), 'image');
});
