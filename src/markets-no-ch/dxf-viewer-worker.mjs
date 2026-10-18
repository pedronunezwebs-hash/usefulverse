import DxfParser from 'dxf-parser';
import log from 'loglevel';

log.disableAll();

const MAX_RECORDS = 200_000;
const EPSILON = 1e-9;
const finite = (value) => Number.isFinite(value);
const nearZero = (value) => finite(value) && Math.abs(value) <= EPSILON;
const unitTable = Object.freeze({ 0: null, 1: 'in', 2: 'ft', 3: 'mi', 4: 'mm', 5: 'cm', 6: 'm', 7: 'km', 8: 'uin', 9: 'mil', 10: 'yd', 11: 'angstrom', 12: 'nm', 13: 'micron', 14: 'dm', 15: 'dam', 16: 'hm', 17: 'gm', 18: 'au', 19: 'ly', 20: 'pc' });

function point(x, y, z = 0) {
  if (!finite(x) || !finite(y) || !nearZero(z)) throw new Error('unsupported');
  return [x, y];
}

function arcSweep(start, end) {
  let sweep = end - start;
  while (sweep < 0) sweep += Math.PI * 2;
  while (sweep >= Math.PI * 2) sweep -= Math.PI * 2;
  return sweep;
}

function toSupportedEntity(entity) {
  const layer = typeof entity.layer === 'string' && entity.layer ? entity.layer : '0';
  if (entity.visible === false) return null;
  if (entity.type === 'LINE') {
    if (!Array.isArray(entity.vertices) || entity.vertices.length < 2) throw new Error('unsupported');
    return { type: 'LINE', layer, points: entity.vertices.map((item) => point(item.x, item.y, item.z)) };
  }
  if (entity.type === 'CIRCLE') {
    if (!finite(entity.radius) || entity.radius <= 0) throw new Error('unsupported');
    return { type: 'CIRCLE', layer, center: point(entity.center?.x, entity.center?.y, entity.center?.z), radius: entity.radius };
  }
  if (entity.type === 'ARC') {
    if (!finite(entity.radius) || entity.radius <= 0 || !finite(entity.startAngle) || !finite(entity.endAngle)) throw new Error('unsupported');
    return { type: 'ARC', layer, center: point(entity.center?.x, entity.center?.y, entity.center?.z), radius: entity.radius, start: entity.startAngle, sweep: arcSweep(entity.startAngle, entity.endAngle) };
  }
  if (entity.type === 'LWPOLYLINE' || entity.type === 'POLYLINE') {
    if (!Array.isArray(entity.vertices) || entity.vertices.length < 2 || entity.vertices.some((item) => Math.abs(item.bulge ?? 0) > EPSILON)) throw new Error('unsupported');
    return { type: 'POLYLINE', layer, closed: Boolean(entity.shape), points: entity.vertices.map((item) => point(item.x, item.y, item.z)) };
  }
  throw new Error('unsupported');
}

function boundsFor(entities) {
  const bounds = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
  const add = (x, y) => {
    if (!finite(x) || !finite(y)) throw new Error('invalid');
    bounds.minX = Math.min(bounds.minX, x); bounds.maxX = Math.max(bounds.maxX, x);
    bounds.minY = Math.min(bounds.minY, y); bounds.maxY = Math.max(bounds.maxY, y);
  };
  for (const entity of entities) {
    if (entity.type === 'LINE' || entity.type === 'POLYLINE') entity.points.forEach(([x, y]) => add(x, y));
    else if (entity.type === 'CIRCLE') {
      add(entity.center[0] - entity.radius, entity.center[1] - entity.radius);
      add(entity.center[0] + entity.radius, entity.center[1] + entity.radius);
    } else if (entity.type === 'ARC') {
      const { center: [cx, cy], radius, start, sweep } = entity;
      const angleIncluded = (angle) => ((angle - start + Math.PI * 2) % (Math.PI * 2)) <= sweep + EPSILON;
      const addAngle = (angle) => add(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
      addAngle(start); addAngle(start + sweep);
      for (const angle of [0, Math.PI / 2, Math.PI, Math.PI * 1.5]) if (angleIncluded(angle)) addAngle(angle);
    }
  }
  if (!finite(bounds.minX)) throw new Error('empty');
  return bounds;
}

self.onmessage = ({ data }) => {
  try {
    if (!(data.buffer instanceof ArrayBuffer) || data.buffer.byteLength > 10 * 1024 * 1024) throw new Error('invalid');
    const bytes = new Uint8Array(data.buffer);
    if (bytes.length > 0 && bytes.subarray(0, 22).includes(0)) throw new Error('binary');
    let text;
    try { text = new TextDecoder('utf-8', { fatal: true }).decode(bytes); }
    catch { text = new TextDecoder('windows-1252').decode(bytes); }
    text = text.replace(/^\uFEFF/u, '');
    const lines = text.split(/\r?\n/u);
    if (lines.length > MAX_RECORDS * 2) throw new Error('geometryTooLarge');
    let recordCount = 0;
    for (const line of lines) if (line.trim() !== '') recordCount += 1;
    recordCount = Math.ceil(recordCount / 2);
    if (recordCount > MAX_RECORDS) throw new Error('geometryTooLarge');
    const parser = new DxfParser();
    const drawing = parser.parseSync(text);
    if (!drawing || !Array.isArray(drawing.entities)) throw new Error('invalid');
    const unsupportedCounts = Object.create(null);
    const entities = [];
    for (const source of drawing.entities) {
      try {
        const entity = toSupportedEntity(source);
        if (entity) entities.push(entity);
      } catch {
        unsupportedCounts[source.type ?? 'UNKNOWN'] = (unsupportedCounts[source.type ?? 'UNKNOWN'] ?? 0) + 1;
      }
    }
    if (!entities.length) throw new Error('empty');
    const layerTable = drawing.tables?.layer?.layers ?? {};
    const layerNames = new Set(Object.keys(layerTable));
    for (const entity of drawing.entities) if (typeof entity.layer === 'string' && entity.layer) layerNames.add(entity.layer);
    for (const entity of entities) layerNames.add(entity.layer);
    const layers = [...layerNames].sort((a, b) => a.localeCompare(b)).map((name) => ({ name, visible: layerTable[name]?.visible !== false && layerTable[name]?.frozen !== true }));
    const unitCode = Number(drawing.header?.$INSUNITS ?? 0);
    self.postMessage({ ok: true, entities, bounds: boundsFor(entities), layers, unit: unitTable[unitCode] ?? null, unitCode: Number.isInteger(unitCode) ? unitCode : 0, totalEntities: drawing.entities.length, shownEntities: entities.length, unsupportedCounts, records: recordCount });
  } catch (error) {
    self.postMessage({ ok: false, error: ['binary', 'geometryTooLarge', 'empty'].includes(error?.message) ? error.message : 'invalid' });
  }
};
