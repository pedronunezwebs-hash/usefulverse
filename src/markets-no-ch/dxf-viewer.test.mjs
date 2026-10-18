import test from 'node:test';
import assert from 'node:assert/strict';

const header = ['$INSUNITS', '70', '4'];
const pair = (code, value) => [String(code), String(value)];
const fixture = (includeUnits = true) => [
  ...pair(0, 'SECTION'), ...pair(2, 'HEADER'), ...(includeUnits ? [...pair(9, '$INSUNITS'), ...header.slice(1)] : []), ...pair(0, 'ENDSEC'),
  ...pair(0, 'SECTION'), ...pair(2, 'ENTITIES'),
  ...pair(0, 'LINE'), ...pair(8, 'Base'), ...pair(10, 0), ...pair(20, 0), ...pair(30, 0), ...pair(11, 10), ...pair(21, 0), ...pair(31, 0),
  ...pair(0, 'ARC'), ...pair(8, 'Detail'), ...pair(10, 10), ...pair(20, 10), ...pair(40, 2), ...pair(50, 0), ...pair(51, 90),
  ...pair(0, 'CIRCLE'), ...pair(8, 'Detail'), ...pair(10, 5), ...pair(20, 5), ...pair(40, 1),
  ...pair(0, 'LWPOLYLINE'), ...pair(8, 'Base'), ...pair(90, 3), ...pair(70, 1), ...pair(10, 0), ...pair(20, 0), ...pair(10, 10), ...pair(20, 0), ...pair(10, 10), ...pair(20, 10),
  ...pair(0, 'TEXT'), ...pair(8, 'Notes'), ...pair(10, 2), ...pair(20, 3), ...pair(40, 1), ...pair(1, 'Local drawing'),
  ...pair(0, 'ENDSEC'), ...pair(0, 'EOF'),
].join('\n');

test('DXF worker preserves supported 2D geometry, units and unsupported entity counts', async () => {
  const replies = [];
  globalThis.self = { postMessage: (message) => replies.push(message) };
  await import('./dxf-viewer-worker.mjs');
  const bytes = new TextEncoder().encode(fixture());
  const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  self.onmessage({ data: { buffer } });
  const reply = replies.at(-1);
  assert.equal(reply.ok, true);
  assert.equal(reply.unit, 'mm');
  assert.deepEqual(reply.layers.map(({ name }) => name), ['Base', 'Detail', 'Notes']);
  assert.equal(reply.totalEntities, 5);
  assert.equal(reply.shownEntities, 4);
  assert.equal(reply.unsupportedCounts.TEXT, 1);
  assert.equal(reply.entities[0].type, 'LINE');
  assert.deepEqual(reply.bounds, { minX: 0, minY: 0, maxX: 12, maxY: 12 });
  assert.equal(reply.records <= 200_000, true);

  const legacyText = Buffer.from(fixture().replaceAll('Base', 'Café'), 'latin1');
  const legacyBuffer = legacyText.buffer.slice(legacyText.byteOffset, legacyText.byteOffset + legacyText.byteLength);
  self.onmessage({ data: { buffer: legacyBuffer } });
  assert.equal(replies.at(-1).ok, true);
  assert.equal(replies.at(-1).layers.some(({ name }) => name === 'Café'), true);

  const unitlessBytes = new TextEncoder().encode(fixture(false));
  const unitlessBuffer = unitlessBytes.buffer.slice(unitlessBytes.byteOffset, unitlessBytes.byteOffset + unitlessBytes.byteLength);
  self.onmessage({ data: { buffer: unitlessBuffer } });
  assert.equal(replies.at(-1).ok, true);
  assert.equal(replies.at(-1).unit, null);

  const binary = new TextEncoder().encode('AutoCAD Binary DXF\r\n\u001a\u0000');
  self.onmessage({ data: { buffer: binary.buffer } });
  assert.equal(replies.at(-1).ok, false);
  assert.equal(replies.at(-1).error, 'binary');

  const excessive = new TextEncoder().encode('0\nEOF\n'.repeat(200_001));
  self.onmessage({ data: { buffer: excessive.buffer } });
  assert.equal(replies.at(-1).ok, false);
  assert.equal(replies.at(-1).error, 'geometryTooLarge');
  delete globalThis.self;
});
