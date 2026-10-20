import assert from 'node:assert/strict';
import test from 'node:test';
import { createBoxMesh, exportMeshObj, extrudeMeshFace, transformMesh } from './logic.mjs';

test('creates a bounded box and exports a valid one-based OBJ mesh', () => {
  const mesh = createBoxMesh({ width: 2, height: 4, depth: 6 });
  assert.equal(mesh.vertices.length, 8);
  assert.equal(mesh.faces.length, 6);
  const obj = exportMeshObj(mesh);
  assert.equal((obj.match(/^v /gmu) ?? []).length, 8);
  assert.equal((obj.match(/^f /gmu) ?? []).length, 6);
  assert.match(obj, /^f 1 4 3 2$/mu);
});

test('extrudes the selected face into a closed prism with side faces', () => {
  const mesh = extrudeMeshFace(createBoxMesh(), 1, 2);
  assert.equal(mesh.vertices.length, 12);
  assert.equal(mesh.faces.length, 10);
  assert.deepEqual(mesh.vertices[8], [-0.5, -0.5, 2.5]);
  assert.equal(exportMeshObj(mesh).split('\n').filter((line) => line.startsWith('f ')).length, 10);
});

test('applies scale, rotation and translation without changing topology', () => {
  const mesh = transformMesh(createBoxMesh(), { scale: [2,1,1], rotateDegrees: [0,0,90], translate: [3,4,5] });
  assert.deepEqual(mesh.vertices[0].map((n) => Number(n.toFixed(6))), [3.5,3,4.5]);
  assert.equal(mesh.faces.length, 6);
});

test('rejects unsafe dimensions, zero extrusion, invalid faces and degenerate export indices', () => {
  assert.throws(() => createBoxMesh({ width: -1 }), /dimensions/u);
  assert.throws(() => createBoxMesh({ width: 1001 }), /width/u);
  assert.throws(() => extrudeMeshFace(createBoxMesh(), 0, 0), /extrusion/u);
  assert.throws(() => extrudeMeshFace(createBoxMesh(), 99, 1), /extrusion/u);
  const mesh = createBoxMesh(); mesh.faces[0] = [0, 1, 500];
  assert.throws(() => exportMeshObj(mesh), /mesh/u);
});
