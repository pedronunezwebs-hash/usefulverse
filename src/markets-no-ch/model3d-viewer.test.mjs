import test from 'node:test';
import assert from 'node:assert/strict';

class NodeProgressEvent extends Event {
  constructor(type, init = {}) { super(type); Object.assign(this, init); }
}

test('the local parser preserves mesh bounds and rejects external glTF resources', async () => {
  globalThis.ProgressEvent ??= NodeProgressEvent;
  const replies = [];
  globalThis.self = { postMessage: (message) => replies.push(message) };
  await import('./model3d-viewer-worker.mjs');

  const obj = new TextEncoder().encode([
    'v 0 0 0', 'v 10 0 0', 'v 10 10 0', 'v 0 10 0',
    'v 0 0 10', 'v 10 0 10', 'v 10 10 10', 'v 0 10 10',
    'f 1 2 3 4', 'f 5 8 7 6', 'f 1 5 6 2',
    'f 2 6 7 3', 'f 3 7 8 4', 'f 5 1 4 8',
  ].join('\n'));
  await self.onmessage({ data: { id: 1, buffer: obj.buffer, extension: '.obj' } });
  const cube = replies.at(-1);
  assert.equal(cube.ok, true);
  assert.equal(cube.meshes[0].triangles, 12);
  for (let axis = 0; axis < 3; axis += 1) {
    const values = cube.meshes[0].positions.filter((_, index) => index % 3 === axis);
    assert.equal(Math.min(...values), 0);
    assert.equal(Math.max(...values), 10);
  }

  const stl = new TextEncoder().encode(`solid sample\nfacet normal 0 0 1\nouter loop\nvertex 0 0 0\nvertex 10 0 0\nvertex 0 10 10\nendloop\nendfacet\nendsolid sample`);
  await self.onmessage({ data: { id: 2, buffer: stl.buffer, extension: '.stl' } });
  assert.equal(replies.at(-1).ok, true);
  assert.equal(replies.at(-1).meshes[0].triangles, 1);
  assert.equal(Math.max(...replies.at(-1).meshes[0].positions.filter((_, index) => index % 3 === 2)), 10);

  const positions = new Float32Array([0, 0, 0, 10, 0, 0, 0, 10, 10]);
  const binary = Buffer.from(positions.buffer);
  const gltf = {
    asset: { version: '2.0' },
    buffers: [{ uri: `data:application/octet-stream;base64,${binary.toString('base64')}`, byteLength: binary.byteLength }],
    bufferViews: [{ buffer: 0, byteOffset: 0, byteLength: binary.byteLength }],
    accessors: [{ bufferView: 0, componentType: 5126, count: 3, type: 'VEC3', min: [0, 0, 0], max: [10, 10, 10] }],
    meshes: [{ primitives: [{ attributes: { POSITION: 0 } }] }],
    nodes: [{ mesh: 0 }], scenes: [{ nodes: [0] }], scene: 0,
  };
  const gltfBytes = new TextEncoder().encode(JSON.stringify(gltf));
  await self.onmessage({ data: { id: 3, buffer: gltfBytes.buffer, extension: '.gltf' } });
  const triangle = replies.at(-1);
  assert.equal(triangle.ok, true);
  assert.equal(triangle.meshes[0].triangles, 1);
  assert.equal(triangle.meshes[0].positions[7], 10);

  const glbJson = { ...gltf, buffers: [{ byteLength: binary.byteLength }] };
  const jsonBytes = Buffer.from(JSON.stringify(glbJson));
  const jsonChunk = Buffer.concat([jsonBytes, Buffer.alloc((4 - (jsonBytes.length % 4)) % 4, 0x20)]);
  const binChunk = Buffer.concat([binary, Buffer.alloc((4 - (binary.length % 4)) % 4)]);
  const totalLength = 12 + 8 + jsonChunk.length + 8 + binChunk.length;
  const glbHeader = Buffer.alloc(12); glbHeader.writeUInt32LE(0x46546c67, 0); glbHeader.writeUInt32LE(2, 4); glbHeader.writeUInt32LE(totalLength, 8);
  const jsonHeader = Buffer.alloc(8); jsonHeader.writeUInt32LE(jsonChunk.length, 0); jsonHeader.writeUInt32LE(0x4e4f534a, 4);
  const binHeader = Buffer.alloc(8); binHeader.writeUInt32LE(binChunk.length, 0); binHeader.writeUInt32LE(0x004e4942, 4);
  const glb = Buffer.concat([glbHeader, jsonHeader, jsonChunk, binHeader, binChunk]);
  const glbBuffer = glb.buffer.slice(glb.byteOffset, glb.byteOffset + glb.byteLength);
  await self.onmessage({ data: { id: 4, buffer: glbBuffer, extension: '.glb' } });
  assert.equal(replies.at(-1).ok, true);
  assert.equal(replies.at(-1).meshes[0].triangles, 1);

  const remote = new TextEncoder().encode(JSON.stringify({
    asset: { version: '2.0' }, buffers: [{ uri: 'https://example.invalid/mesh.bin', byteLength: 0 }],
  }));
  await self.onmessage({ data: { id: 5, buffer: remote.buffer, extension: '.gltf' } });
  assert.equal(replies.at(-1).ok, false);
  assert.equal(replies.at(-1).error, 'external');

  await self.onmessage({ data: { id: 6, buffer: new ArrayBuffer(8), extension: '.step' } });
  assert.equal(replies.at(-1).ok, false);
  assert.equal(replies.at(-1).error, 'unsupported');

  delete globalThis.self;
});
