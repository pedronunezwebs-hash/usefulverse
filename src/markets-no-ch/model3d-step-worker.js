importScripts('./occt-import-js.js');

const MAX_VERTICES = 1_000_000;

self.onmessage = async ({ data }) => {
  try {
    const importer = await occtimportjs({
      locateFile: (path) => new URL(path, self.location.href).href,
    });
    const result = importer.ReadStepFile(new Uint8Array(data.buffer), {
      linearUnit: data.linearUnit,
      linearDeflectionType: 'bounding_box_ratio',
      linearDeflection: 0.001,
      angularDeflection: 0.5,
    });
    if (!result?.success || !Array.isArray(result.meshes) || !result.meshes.length) throw new Error('invalid');
    const meshes = [];
    let vertices = 0;
    for (const item of result.meshes) {
      const positions = new Float32Array(item.attributes?.position?.array ?? []);
      const normals = new Float32Array(item.attributes?.normal?.array ?? []);
      const indices = new Uint32Array(item.index?.array ?? []);
      if (!positions.length || positions.length % 3 || normals.length !== positions.length || !indices.length || indices.length % 3) throw new Error('invalid');
      vertices += positions.length / 3;
      if (vertices > MAX_VERTICES) throw new Error('geometryTooLarge');
      for (const value of positions) if (!Number.isFinite(value)) throw new Error('invalid');
      for (const value of normals) if (!Number.isFinite(value)) throw new Error('invalid');
      meshes.push({ positions, normals, indices, vertices: positions.length / 3, triangles: indices.length / 3 });
    }
    const transfers = meshes.flatMap((mesh) => [mesh.positions.buffer, mesh.normals.buffer, mesh.indices.buffer]);
    self.postMessage({ ok: true, meshes, units: data.linearUnit }, transfers);
  } catch (error) {
    self.postMessage({ ok: false, error: ['geometryTooLarge', 'invalid'].includes(error?.message) ? error.message : 'invalid' });
  }
};
