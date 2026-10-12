import assert from 'node:assert/strict';
import test from 'node:test';
import { buildColorRamp, mixColors, parseMixerHex } from './logic.mjs';

test('normalizes short and full hexadecimal colors and mixes sRGB red/blue symmetrically', () => {
  assert.deepEqual(parseMixerHex('#f00'), { hex: '#FF0000', r: 255, g: 0, b: 0 });
  const result = mixColors([{ hex: '#ff0000', weight: 50 }, { hex: '#0000ff', weight: 50 }], 'srgb');
  assert.equal(result.hex, '#800080');
  assert.deepEqual([result.r, result.g, result.b], [128, 0, 128]);
  assert.deepEqual(result.hsl, { h: 300, s: 100, l: 25 });
});

test('linear-light blending is explicit and differs from gamma-encoded sRGB', () => {
  const linear = mixColors([{ hex: '#f00', weight: 1 }, { hex: '#00f', weight: 1 }], 'linear');
  const srgb = mixColors([{ hex: '#f00', weight: 1 }, { hex: '#00f', weight: 1 }], 'srgb');
  assert.equal(linear.hex, '#BC00BC');
  assert.equal(srgb.hex, '#800080');
  assert.notEqual(linear.hex, srgb.hex);
});

test('weighted multi-color blending ignores zero weights and normalizes proportions', () => {
  const a = mixColors([{ hex: '#ffffff', weight: 0 }, { hex: '#000000', weight: 1 }, { hex: '#ffffff', weight: 1 }], 'srgb');
  const b = mixColors([{ hex: '#000000', weight: 20 }, { hex: '#ffffff', weight: 20 }], 'srgb');
  assert.equal(a.hex, b.hex);
  assert.equal(a.hex, '#808080');
});

test('color ramps include exact endpoints and evenly spaced swatches', () => {
  assert.deepEqual(buildColorRamp('#000', '#fff', 3, 'srgb'), ['#000000', '#808080', '#FFFFFF']);
  assert.deepEqual(buildColorRamp('#f00', '#00f', 2), ['#FF0000', '#0000FF']);
});

test('rejects malformed colors, unsupported modes, excessive values and zero total weight', () => {
  assert.throws(() => parseMixerHex('#12'), /hexadecimal/u);
  assert.throws(() => mixColors([{ hex: '#000', weight: 1 }]), /2 and 8/u);
  assert.throws(() => mixColors([{ hex: '#000', weight: 1 }, { hex: '#fff', weight: 1 }], 'paint'), /sRGB/u);
  assert.throws(() => mixColors([{ hex: '#000', weight: -1 }, { hex: '#fff', weight: 1 }]), /weight/u);
  assert.throws(() => mixColors([{ hex: '#000', weight: 0 }, { hex: '#fff', weight: 0 }]), /above zero/u);
  assert.throws(() => buildColorRamp('#000', '#fff', 17), /2 to 16/u);
});
