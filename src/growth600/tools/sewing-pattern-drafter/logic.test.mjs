import test from 'node:test';
import assert from 'node:assert/strict';
import { createHalfCircleSkirtSvg, draftHalfCircleSkirt } from './logic.mjs';

test('half-circle skirt radius produces the requested waist arc', () => {
  const draft = draftHalfCircleSkirt({ waistMm: 760, easeMm: 20, lengthMm: 550, seamAllowanceMm: 10, hemAllowanceMm: 25 });
  assert.ok(Math.abs(Math.PI * draft.radiusMm - 780) < 1e-9);
  assert.equal(draft.hemStitchRadiusMm - draft.radiusMm, 550);
  assert.ok(draft.cutHemRadiusMm > draft.hemStitchRadiusMm);
});

test('invalid, overlarge and unsafe measurements are rejected', () => {
  for (const input of [{ waistMm: 0, lengthMm: 500 }, { waistMm: 800, lengthMm: 1 }, { waistMm: 800, lengthMm: 500, seamAllowanceMm: 500 }, { waistMm: 300, lengthMm: 300, seamAllowanceMm: 50 }]) assert.throws(() => draftHalfCircleSkirt(input));
});

test('SVG is physical-scale, includes seam and cut lines, and escapes its title', () => {
  const svg = createHalfCircleSkirtSvg(draftHalfCircleSkirt({ waistMm: 760, lengthMm: 550 }), '<pattern>');
  assert.match(svg, /width="\d+\.\d+mm"/u);
  assert.match(svg, /&lt;pattern&gt;/u);
  assert.match(svg, /50 mm print check/u);
  assert.match(svg, /Full-scale sewing pattern in millimetres/u);
  assert.match(svg, /stroke-dasharray/u);
});
