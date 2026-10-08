import assert from 'node:assert/strict';
import test from 'node:test';
import { CSS_NAMED_COLORS, findClosestCssColors, normalizeHexColor } from './logic.mjs';

test('palette contains unique standardized RGB values and groups aliases', () => {
  assert.equal(CSS_NAMED_COLORS.length, 139);
  assert.equal(new Set(CSS_NAMED_COLORS.map(({ hex }) => hex)).size, 139);
  assert.deepEqual(CSS_NAMED_COLORS.find(({ hex }) => hex === '#00ffff').aliases, ['aqua', 'cyan']);
  assert.deepEqual(CSS_NAMED_COLORS.find(({ hex }) => hex === '#ff00ff').aliases, ['fuchsia', 'magenta']);
  assert.deepEqual(CSS_NAMED_COLORS.find(({ hex }) => hex === '#808080').aliases, ['gray', 'grey']);
});

test('hex input accepts optional hash and expands shorthand without changing its color', () => {
  assert.equal(normalizeHexColor('#f0a'), '#FF00AA');
  assert.equal(normalizeHexColor('6495ed'), '#6495ED');
  assert.equal(findClosestCssColors('#f00').matches[0].name, 'red');
  assert.equal(findClosestCssColors('#f00').matches[0].distance, 0);
});

test('exact standard names are reported separately and do not duplicate aliases in results', () => {
  const result = findClosestCssColors('#00FFFF');
  assert.equal(result.exactMatch, true);
  assert.equal(result.matches[0].name, 'aqua');
  assert.deepEqual(result.matches[0].aliases, ['aqua', 'cyan']);
  assert.equal(result.matches.filter(({ hex }) => hex === '#00ffff').length, 1);
});

test('nearby non-standard colors return stable perceptual matches in ascending distance', () => {
  const result = findClosestCssColors('#6495ED');
  assert.equal(result.exactMatch, true);
  assert.equal(result.matches[0].name, 'cornflowerblue');
  assert.ok(result.matches.every(({ distance }, index, all) => index === 0 || distance >= all[index - 1].distance));
  const near = findClosestCssColors('#638FEA');
  assert.equal(near.exactMatch, false);
  assert.equal(near.matches[0].name, 'cornflowerblue');
  assert.ok(near.matches[0].distance > 0);
});

test('input and result limits reject malformed values', () => {
  for (const invalid of ['', '#12', '#12345', '#1234567', 'red', '##fff', '12345g']) assert.throws(() => findClosestCssColors(invalid));
  for (const limit of [0, 21, 1.5, '5']) assert.throws(() => findClosestCssColors('#fff', { limit }));
  assert.throws(() => normalizeHexColor(null), /hex color/u);
});
