import assert from 'node:assert/strict';
import test from 'node:test';
import { ui } from '../locales.mjs';

test('Filipino scientific calculator controls use clear, understandable labels', () => {
  assert.equal(ui.tl.Clear, 'Burahin');
  assert.equal(ui.tl.Expression, 'Ekspresyong matematikal');
  assert.match(ui.tl['Supports arithmetic, powers, percentages, trigonometry, roots and logarithms.'], /square root/u);
});
