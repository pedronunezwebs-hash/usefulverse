import test from 'node:test';
import assert from 'node:assert/strict';
import { buildAnimationCss, buildClipPathCss, buildFilterCss } from './css-design-logic.mjs';

test('animation builder emits bounded CSS for each preset and rejects injected values', () => {
  for (const effect of ['fade', 'slide', 'bounce', 'rotate', 'pulse']) {
    assert.match(buildAnimationCss({ effect, duration: 0.8, delay: 0, iterations: '1', timing: 'ease' }), /@keyframes/u);
  }
  assert.match(buildAnimationCss({ effect: 'bounce', duration: 0.8, delay: 0, iterations: '1', timing: 'ease' }), /65%/u);
  assert.throws(() => buildAnimationCss({ effect: 'fade; } body {', duration: 1, delay: 0, iterations: '1', timing: 'ease' }), /supported CSS animation/u);
  assert.throws(() => buildAnimationCss({ effect: 'fade', duration: 99, delay: 0, iterations: '1', timing: 'ease' }), /Duration/u);
});

test('clip-path outputs only known static shapes', () => {
  assert.match(buildClipPathCss('triangle'), /polygon\(50% 0%, 100% 100%, 0% 100%\)/u);
  assert.throws(() => buildClipPathCss('url(javascript:alert(1))'), /supported clip-path/u);
});

test('filter generator validates each control and formats valid units', () => {
  const css = buildFilterCss({ brightness: 100, contrast: 120, grayscale: 0, hue: 20, invert: 0, sepia: 0, saturate: 100, blur: 2 });
  assert.match(css, /hue-rotate\(20deg\)/u);
  assert.match(css, /blur\(2px\)/u);
  assert.throws(() => buildFilterCss({ brightness: '100);color:red', contrast: 100, grayscale: 0, hue: 0, invert: 0, sepia: 0, saturate: 100, blur: 0 }), /brightness/u);
});
