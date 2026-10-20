const MAX_COORDINATE = 1000;

function finite(value, label) {
  const number = Number(value);
  if (!Number.isFinite(number) || Math.abs(number) > MAX_COORDINATE) throw new Error(`invalid-${label}`);
  return number;
}

export function createBoxMesh({ width = 1, height = 1, depth = 1 } = {}) {
  const w = finite(width, 'width'), h = finite(height, 'height'), d = finite(depth, 'depth');
  if (w <= 0 || h <= 0 || d <= 0) throw new Error('invalid-dimensions');
  const x = w / 2, y = h / 2, z = d / 2;
  return {
    vertices: [[-x,-y,-z],[x,-y,-z],[x,y,-z],[-x,y,-z],[-x,-y,z],[x,-y,z],[x,y,z],[-x,y,z]],
    faces: [[0,3,2,1],[4,5,6,7],[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7]],
  };
}

export function extrudeMeshFace(mesh, faceIndex, distance) {
  const amount = finite(distance, 'distance');
  if (!amount || !mesh?.vertices || !mesh?.faces || !Number.isInteger(faceIndex) || !mesh.faces[faceIndex]) throw new Error('invalid-extrusion');
  const vertices = mesh.vertices.map((point) => [...point]);
  const faces = mesh.faces.map((face) => [...face]);
  const face = faces[faceIndex];
  if (face.length < 3 || face.some((index) => !vertices[index])) throw new Error('invalid-mesh');
  const a = vertices[face[0]], b = vertices[face[1]], c = vertices[face[2]];
  const u = b.map((v, i) => v - a[i]), v = c.map((n, i) => n - a[i]);
  const normal = [u[1]*v[2]-u[2]*v[1], u[2]*v[0]-u[0]*v[2], u[0]*v[1]-u[1]*v[0]];
  const magnitude = Math.hypot(...normal);
  if (!magnitude) throw new Error('invalid-face');
  const offset = normal.map((n) => n / magnitude * amount);
  const moved = face.map((index) => { const point = vertices[index]; vertices.push(point.map((n, axis) => n + offset[axis])); return vertices.length - 1; });
  faces[faceIndex] = moved;
  for (let i = 0; i < face.length; i += 1) {
    const next = (i + 1) % face.length;
    faces.push([face[i], face[next], moved[next], moved[i]]);
  }
  return { vertices, faces };
}

export function transformMesh(mesh, { translate = [0,0,0], scale = [1,1,1], rotateDegrees = [0,0,0] } = {}) {
  if (!mesh?.vertices || !mesh?.faces || translate.length !== 3 || scale.length !== 3 || rotateDegrees.length !== 3) throw new Error('invalid-mesh');
  const t = translate.map((n) => finite(n, 'translation'));
  const s = scale.map((n) => finite(n, 'scale'));
  const r = rotateDegrees.map((n) => finite(n, 'rotation')).map((n) => n * Math.PI / 180);
  if (s.some((n) => n <= 0)) throw new Error('invalid-scale');
  const vertices = mesh.vertices.map(([x0,y0,z0]) => {
    let x = finite(x0, 'vertex') * s[0], y = finite(y0, 'vertex') * s[1], z = finite(z0, 'vertex') * s[2];
    [y,z] = [y*Math.cos(r[0])-z*Math.sin(r[0]), y*Math.sin(r[0])+z*Math.cos(r[0])];
    [x,z] = [x*Math.cos(r[1])+z*Math.sin(r[1]), -x*Math.sin(r[1])+z*Math.cos(r[1])];
    [x,y] = [x*Math.cos(r[2])-y*Math.sin(r[2]), x*Math.sin(r[2])+y*Math.cos(r[2])];
    return [x+t[0],y+t[1],z+t[2]];
  });
  return { vertices, faces: mesh.faces.map((face) => [...face]) };
}

export function exportMeshObj(mesh) {
  if (!mesh?.vertices?.length || !mesh?.faces?.length) throw new Error('invalid-mesh');
  const lines = ['# UsefulVerse local mesh export'];
  for (const point of mesh.vertices) {
    if (!Array.isArray(point) || point.length !== 3 || point.some((n) => !Number.isFinite(n))) throw new Error('invalid-mesh');
    lines.push(`v ${point.map((n) => Number(n.toFixed(6))).join(' ')}`);
  }
  for (const face of mesh.faces) {
    if (face.length < 3 || face.some((index) => !Number.isInteger(index) || index < 0 || index >= mesh.vertices.length)) throw new Error('invalid-mesh');
    lines.push(`f ${face.map((index) => index + 1).join(' ')}`);
  }
  return `${lines.join('\n')}\n`;
}
