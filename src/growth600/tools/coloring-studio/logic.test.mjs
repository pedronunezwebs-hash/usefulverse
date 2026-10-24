import test from 'node:test';
import assert from 'node:assert/strict';
import { getColoringTemplate, isColoringColor, coloringTemplateIds } from './logic.mjs';

test('the gallery contains the three original bounded SVG templates', () => {
  assert.deepEqual([...coloringTemplateIds].sort(), ['butterfly', 'flower', 'rocket']);
  for (const id of coloringTemplateIds) {
    const template = getColoringTemplate(id);
    assert.match(template.viewBox, /^0 0 400 400$/u);
    assert.ok(template.regions.length >= 5);
    assert.ok(template.lines.length >= 1);
    assert.equal(new Set(template.regions.map(({ id: regionId }) => regionId)).size, template.regions.length);
    for (const region of template.regions) assert.match(region.d, /^[\w\s.,()+-]+$/u);
    for (const line of template.lines) assert.match(line.d, /^[\w\s.,()+-]+$/u);
  }
});

test('unknown gallery entries are rejected instead of producing arbitrary SVG', () => {
  assert.throws(() => getColoringTemplate('../untrusted'), RangeError);
  assert.throws(() => getColoringTemplate(''), RangeError);
});

test('color values accept six-digit hexadecimal colors only', () => {
  assert.equal(isColoringColor('#12aBcF'), true);
  for (const value of ['red', '#fff', '#12345678', 'url(https://example.test)', '']) {
    assert.equal(isColoringColor(value), false);
  }
});
