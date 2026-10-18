import assert from 'node:assert/strict';
import test from 'node:test';
import { borderRadiusPreviewStyle, buildBorderRadiusCss, normalizeRadii } from './logic.mjs';

test('all zero radii produce a valid rectangle and no slash', () => {
  const result = buildBorderRadiusCss({ horizontal: [0, 0, 0, 0], vertical: [0, 0, 0, 0], unit: 'px' });
  assert.equal(result.value, '0px 0px 0px 0px');
  assert.equal(result.css, '.shape {\n  border-radius: 0px 0px 0px 0px;\n}');
});

test('four independent elliptical corners produce horizontal and vertical shorthand', () => {
  const result = buildBorderRadiusCss({ horizontal: [10, 20, 30, 40], vertical: [5, 15, 25, 35], unit: 'px' });
  assert.equal(result.value, '10px 20px 30px 40px / 5px 15px 25px 35px');
  assert.equal(borderRadiusPreviewStyle({ horizontal: [25, 25, 25, 25], vertical: [25, 25, 25, 25] }), '25px 25px 25px 25px');
});

test('percent values are bounded and browser-overlap normalization is not falsely clamped', () => {
  assert.equal(buildBorderRadiusCss({ horizontal: [80, 80, 80, 80], unit: '%' }).value, '80% 80% 80% 80%');
  assert.throws(() => normalizeRadii({ horizontal: [101, 0, 0, 0], unit: '%' }), /between 0 and 100/u);
  assert.throws(() => normalizeRadii({ horizontal: [501, 0, 0, 0], unit: 'px' }), /between 0 and 500/u);
  assert.throws(() => normalizeRadii({ horizontal: [0, 0, 0], unit: 'px' }), /four horizontal/u);
  assert.throws(() => normalizeRadii({ horizontal: [0, 0, 0, 0], unit: 'em' }), /px or percent/u);
});
