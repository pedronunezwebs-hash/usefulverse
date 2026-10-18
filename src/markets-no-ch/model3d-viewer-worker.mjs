import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const MAX_VERTICES = 1_000_000;

function gltfJson(buffer, extension) {
  if (extension === '.gltf') return JSON.parse(new TextDecoder().decode(buffer));
  const view = new DataView(buffer);
  if (view.byteLength < 20 || view.getUint32(0, true) !== 0x46546c67 || view.getUint32(4, true) !== 2) throw new Error('invalid');
  let offset = 12;
  while (offset + 8 <= view.byteLength) {
    const length = view.getUint32(offset, true);
    const type = view.getUint32(offset + 4, true);
    offset += 8;
    if (offset + length > view.byteLength) throw new Error('invalid');
    if (type === 0x4e4f534a) return JSON.parse(new TextDecoder().decode(new Uint8Array(buffer, offset, length)).trim());
    offset += length;
  }
  throw new Error('invalid');
}

function rejectExternalResources(json) {
  for (const item of json.buffers ?? []) if (item.uri && !item.uri.startsWith('data:')) throw new Error('external');
  for (const item of json.images ?? []) if (item.uri && !item.uri.startsWith('data:')) throw new Error('external');
}

function serializeGeometry(geometry) {
  const position = geometry.getAttribute('position');
  if (!position || position.count > MAX_VERTICES) throw new Error('geometryTooLarge');
  if (!geometry.getAttribute('normal')) geometry.computeVertexNormals();
  const normal = geometry.getAttribute('normal');
  const index = geometry.index;
  const positions = new Float32Array(position.count * 3);
  const normals = new Float32Array(position.count * 3);
  for (let i = 0; i < position.count; i += 1) {
    positions[i * 3] = position.getX(i); positions[i * 3 + 1] = position.getY(i); positions[i * 3 + 2] = position.getZ(i);
    normals[i * 3] = normal.getX(i); normals[i * 3 + 1] = normal.getY(i); normals[i * 3 + 2] = normal.getZ(i);
  }
  const indices = index ? new Uint32Array(index.array) : null;
  return { positions, normals, indices, vertices: position.count, triangles: index ? Math.floor(index.count / 3) : Math.floor(position.count / 3) };
}

function collect(root) {
  const meshes = [];
  let vertices = 0;
  root.traverse((item) => {
    if (!item.isMesh) return;
    const geometry = item.geometry.clone();
    geometry.applyMatrix4(item.matrixWorld);
    const mesh = serializeGeometry(geometry);
    vertices += mesh.vertices;
    if (vertices > MAX_VERTICES) throw new Error('geometryTooLarge');
    meshes.push(mesh);
    geometry.dispose();
  });
  if (!meshes.length) throw new Error('empty');
  return meshes;
}

self.onmessage = async ({ data }) => {
  const { id, buffer, extension } = data;
  try {
    let meshes;
    if (extension === '.stl') {
      meshes = [serializeGeometry(new STLLoader().parse(buffer))];
    } else if (extension === '.obj') {
      const root = new OBJLoader().parse(new TextDecoder().decode(buffer));
      root.updateMatrixWorld(true);
      meshes = collect(root);
    } else if (extension === '.gltf' || extension === '.glb') {
      rejectExternalResources(gltfJson(buffer, extension));
      const loader = new GLTFLoader();
      const gltf = await new Promise((resolve, reject) => loader.parse(buffer, '', resolve, reject));
      gltf.scene.updateMatrixWorld(true);
      meshes = collect(gltf.scene);
    } else throw new Error('unsupported');
    const transfers = [];
    for (const mesh of meshes) transfers.push(mesh.positions.buffer, mesh.normals.buffer, ...(mesh.indices ? [mesh.indices.buffer] : []));
    self.postMessage({ id, ok: true, meshes }, transfers);
  } catch (error) {
    self.postMessage({ id, ok: false, error: ['external', 'geometryTooLarge', 'unsupported', 'empty'].includes(error?.message) ? error.message : 'invalid' });
  }
};
