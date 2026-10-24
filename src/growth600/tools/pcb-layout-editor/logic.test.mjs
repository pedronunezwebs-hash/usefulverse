import test from 'node:test';
import assert from 'node:assert/strict';
import { addPcbPart, createPcbBoard, exportPcbArtifacts, pcbFootprints, removePcbPart, renderPcbPreviewSvg, routePcbTrack } from './logic.mjs';

test('creates bounded boards and places rotated through-hole footprints immutably', () => {
  const board = createPcbBoard({ width: 50, height: 30, grid: 0.5 });
  const withParts = addPcbPart(addPcbPart(board, { ref: 'R1', footprint: 'resistor', x: 8, y: 8 }), { ref: 'J1', footprint: 'header-2', x: 20, y: 8, rotation: 90 });
  assert.equal(board.parts.length, 0);
  assert.equal(withParts.parts.length, 2);
  assert.equal(pcbFootprints['dip-8'].padCount, 8);
  assert.throws(() => createPcbBoard({ width: 9, height: 40 }), { code: 'invalid-dimension' });
  assert.throws(() => addPcbPart(withParts, { ref: 'r1', footprint: 'led', x: 30, y: 20 }), { code: 'duplicate-reference' });
  assert.throws(() => addPcbPart(withParts, { ref: 'U1', footprint: 'unknown', x: 20, y: 20 }), { code: 'invalid-footprint' });
  assert.throws(() => addPcbPart(withParts, { ref: 'U1', footprint: 'dip-8', x: 1, y: 1 }), { code: 'outside-board' });
  assert.throws(() => addPcbPart(withParts, { ref: 'U1', footprint: 'led', x: 25, y: 15, rotation: 45 }), { code: 'invalid-rotation' });
});

test('routes named nets between real pad centers and removes dependent tracks with parts', () => {
  const board = addPcbPart(addPcbPart(createPcbBoard(), { ref: 'R1', footprint: 'resistor', x: 10, y: 10 }), { ref: 'D1', footprint: 'led', x: 25, y: 10 });
  const routed = routePcbTrack(board, { net: 'SIGNAL', from: { ref: 'R1', pad: 2 }, to: { ref: 'D1', pad: 1 }, waypoints: [{ x: 18, y: 15 }], width: 0.25 });
  assert.equal(board.tracks.length, 0);
  assert.deepEqual(routed.tracks[0].points, [[13.81, 10], [18, 15], [23.73, 10]]);
  assert.throws(() => routePcbTrack(board, { net: 'N', from: { ref: 'R1', pad: 9 }, to: { ref: 'D1', pad: 1 } }), { code: 'invalid-endpoint' });
  assert.throws(() => routePcbTrack(board, { net: 'N', from: { ref: 'R1', pad: 1 }, to: { ref: 'R1', pad: 1 } }), { code: 'invalid-endpoint' });
  assert.throws(() => routePcbTrack(board, { net: 'N', from: { ref: 'R1', pad: 1 }, to: { ref: 'D1', pad: 1 }, waypoints: [{ x: 100, y: 10 }] }), { code: 'outside-board' });
  assert.equal(removePcbPart(routed, 'R1').tracks.length, 0);
  assert.throws(() => removePcbPart(board, 'U9'), { code: 'missing-part' });
});

test('exports consistent Gerber copper/profile and Excellon drill files', () => {
  const board = routePcbTrack(
    addPcbPart(addPcbPart(createPcbBoard({ width: 50, height: 30 }), { ref: 'R1', footprint: 'resistor', x: 10, y: 10 }), { ref: 'J1', footprint: 'header-2', x: 25, y: 10 }),
    { net: 'GND', from: { ref: 'R1', pad: 1 }, to: { ref: 'J1', pad: 1 }, width: 0.3 },
  );
  const files = exportPcbArtifacts(board);
  assert.deepEqual(Object.keys(files), ['F.Cu.gbr', 'Edge.Cuts.gbr', 'PTH.drl']);
  assert.match(files['F.Cu.gbr'], /%FSLAX36Y36\*%/u);
  assert.match(files['F.Cu.gbr'], /%MOMM\*%/u);
  assert.match(files['F.Cu.gbr'], /%TF\.FileFunction,Copper,L1,Top\*%/u);
  assert.match(files['F.Cu.gbr'], /D01\*/u);
  assert.match(files['F.Cu.gbr'], /D03\*/u);
  assert.match(files['Edge.Cuts.gbr'], /Profile,NP/u);
  assert.match(files['Edge.Cuts.gbr'], /M02\*/u);
  assert.match(files['PTH.drl'], /^M48\nMETRIC,TZ\n/u);
  assert.match(files['PTH.drl'], /T01C0\.800/u);
  assert.match(files['PTH.drl'], /X006190Y010000/u);
  assert.match(files['PTH.drl'], /M30\n$/u);
});

test('renders a bounded SVG board preview and rejects markup in references', () => {
  const board = addPcbPart(createPcbBoard({ width: 40, height: 20 }), { ref: 'R_1', footprint: 'resistor', x: 10, y: 10 });
  const svg = renderPcbPreviewSvg(board);
  assert.match(svg, /<svg xmlns=/u);
  assert.match(svg, />R_1</u);
  assert.match(svg, /<circle\b/gu);
  assert.throws(() => addPcbPart(board, { ref: '<script>', footprint: 'led', x: 20, y: 10 }), { code: 'invalid-name' });
  assert.throws(() => exportPcbArtifacts(null), { code: 'invalid-board' });
});
