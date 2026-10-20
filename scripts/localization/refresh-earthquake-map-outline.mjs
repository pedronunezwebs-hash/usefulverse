import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const revision = 'ca96624a56bd078437bca8184e78163e5039ad19';
const sourceUrl = `https://raw.githubusercontent.com/nvkelso/natural-earth-vector/${revision}/geojson/ne_110m_land.geojson`;
const response = await fetch(sourceUrl);
if (!response.ok) throw new Error(`Natural Earth outline download failed (${response.status}).`);
const geojson = await response.json();
if (!Array.isArray(geojson.features) || geojson.features.length < 100) throw new Error('Unexpected Natural Earth land GeoJSON.');
const width = 960, height = 480, pad = 32;
const project = ([longitude, latitude]) => [pad + ((longitude + 180) / 360) * (width - pad * 2), pad + ((90 - latitude) / 180) * (height - pad * 2)];
const squaredDistanceToSegment = (point, start, end) => {
  const dx = end[0] - start[0], dy = end[1] - start[1];
  if (!dx && !dy) return (point[0] - start[0]) ** 2 + (point[1] - start[1]) ** 2;
  const t = Math.max(0, Math.min(1, ((point[0] - start[0]) * dx + (point[1] - start[1]) * dy) / (dx * dx + dy * dy)));
  return (point[0] - start[0] - t * dx) ** 2 + (point[1] - start[1] - t * dy) ** 2;
};
function simplify(points, tolerance = 0.65) {
  if (points.length <= 5) return points;
  const keep = new Uint8Array(points.length); keep[0] = 1; keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]], limit = tolerance * tolerance;
  while (stack.length) {
    const [first, last] = stack.pop(); let best = limit, index = -1;
    for (let i = first + 1; i < last; i++) { const distance = squaredDistanceToSegment(points[i], points[first], points[last]); if (distance > best) { best = distance; index = i; } }
    if (index >= 0) { keep[index] = 1; stack.push([first, index], [index, last]); }
  }
  return points.filter((_, index) => keep[index]);
}
function rings(geometry) {
  if (!geometry) return [];
  if (geometry.type === 'Polygon') return geometry.coordinates;
  if (geometry.type === 'MultiPolygon') return geometry.coordinates.flat();
  return [];
}
const paths = [];
for (const feature of geojson.features) for (const ring of rings(feature.geometry)) {
  if (!Array.isArray(ring) || ring.length < 4) continue;
  const points = simplify(ring.map(project));
  if (points.length < 4) continue;
  paths.push(`${points.map(([x,y],index)=>`${index?'L':'M'}${x.toFixed(1)},${y.toFixed(1)}`).join('')}Z`);
}
if (paths.length < 100) throw new Error(`Unexpected simplified coastline path count: ${paths.length}`);
const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="presentation" aria-hidden="true" data-source="Natural Earth public-domain 1:110m land data; ${revision}"><path fill="#78947a" fill-rule="evenodd" d="${paths.join('')}"/></svg>\n`;
await writeFile(resolve('src/growth600/tools/earthquake-map/world-land.svg'), svg);
console.log(`Wrote Natural Earth 1:110m land outline: ${paths.length} rings, ${Buffer.byteLength(svg)} bytes.`);
