import test from 'node:test';
import assert from 'node:assert/strict';
import { layoutSpriteFrames, spriteSheetMetadata } from './sprite-sheet-logic.mjs';

const frames = [
  { name: 'café.png', width: 64, height: 32 },
  { name: '二.png', width: 32, height: 64 },
  { name: 'three.png', width: 20, height: 20 },
];

test('lays out frames in order with gaps and padding and preserves Unicode names', () => {
  const layout = layoutSpriteFrames(frames, { frameWidth: 64, frameHeight: 64, columns: 2, gap: 4, padding: 2 });
  assert.equal(layout.width, 136);
  assert.equal(layout.height, 136);
  assert.deepEqual(layout.items.map(({ x, y }) => [x, y]), [[2, 2], [70, 2], [2, 70]]);
  assert.deepEqual(layout.items.map(({ drawWidth, drawHeight }) => [drawWidth, drawHeight]), [[64, 32], [32, 64], [20, 20]]);
  assert.equal(spriteSheetMetadata(layout).frames[1].name, '二.png');
});

test('fits images inside frames without upscaling or cropping', () => {
  const item = layoutSpriteFrames([{ name: 'large', width: 200, height: 100 }], { frameWidth: 64, frameHeight: 64, columns: 1 });
  assert.deepEqual([item.items[0].drawWidth, item.items[0].drawHeight, item.items[0].drawX, item.items[0].drawY], [64, 32, 0, 16]);
});

test('rejects empty, excessive and malformed frame dimensions', () => {
  assert.throws(() => layoutSpriteFrames([], { frameWidth: 64, frameHeight: 64, columns: 1 }), /Choose between/u);
  assert.throws(() => layoutSpriteFrames(Array.from({ length: 129 }, () => frames[0]), { frameWidth: 64, frameHeight: 64, columns: 8 }), /Choose between/u);
  assert.throws(() => layoutSpriteFrames([{ name: 'bad', width: 0, height: 1 }], { frameWidth: 64, frameHeight: 64, columns: 1 }), /unsupported dimensions/u);
  assert.throws(() => layoutSpriteFrames(frames, { frameWidth: 64, frameHeight: 64, columns: 4 }), /valid frame size/u);
});

test('rejects dimensions that exceed browser-safe canvas limits', () => {
  assert.throws(() => layoutSpriteFrames(frames, { frameWidth: 4096, frameHeight: 4096, columns: 2 }), /too large/u);
});
