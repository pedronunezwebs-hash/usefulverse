const MAX_NODES = 500;
const MAX_TEXT = 160;
const MAX_DEPTH = 40;
const MAX_ID_LENGTH = 64;

function cleanText(value, label = 'Idea') {
  const result = String(value ?? '').trim();
  if (!result || result.length > MAX_TEXT) throw new RangeError(`${label} must contain 1 to ${MAX_TEXT} characters.`);
  return result;
}

function assertMap(map) {
  if (!map || map.schemaVersion !== 1 || !Array.isArray(map.nodes) || map.nodes.length < 1 || map.nodes.length > MAX_NODES) throw new TypeError('A valid mind map is required.');
  const ids = new Set();
  for (const node of map.nodes) {
    if (!node || typeof node.id !== 'string' || !node.id || node.id.length > MAX_ID_LENGTH || ids.has(node.id) || typeof node.text !== 'string' || !node.text.trim() || node.text.length > MAX_TEXT || !(node.parentId === null || typeof node.parentId === 'string') || typeof node.collapsed !== 'boolean') throw new TypeError('The mind map has an invalid node.');
    ids.add(node.id);
  }
  const roots = map.nodes.filter(({ parentId }) => parentId === null);
  if (roots.length !== 1 || map.nodes[0] !== roots[0]) throw new TypeError('A mind map must have exactly one root.');
  for (const node of map.nodes) if (node.parentId !== null && !ids.has(node.parentId)) throw new TypeError('The mind map refers to a missing parent.');
  const children = new Map(map.nodes.map(({ id }) => [id, []]));
  for (const node of map.nodes) if (node.parentId !== null) children.get(node.parentId).push(node.id);
  const reached = new Set();
  const visit = (id, depth) => {
    if (depth > MAX_DEPTH || reached.has(id)) throw new TypeError('The mind map contains a cycle or is too deep.');
    reached.add(id);
    for (const child of children.get(id)) visit(child, depth + 1);
  };
  visit(roots[0].id, 0);
  if (reached.size !== map.nodes.length) throw new TypeError('The mind map contains unreachable nodes.');
  return map;
}

function nextId(map) {
  const used = new Set(map.nodes.map(({ id }) => id));
  let index = 1;
  while (used.has(`idea-${index}`)) index += 1;
  return `idea-${index}`;
}

function updated(map, nodes) {
  return Object.freeze({ schemaVersion: 1, nodes: Object.freeze(nodes.map((node) => Object.freeze({ ...node }))) });
}

export function createMindMap(topic) {
  return updated({ schemaVersion: 1, nodes: [] }, [{ id: 'idea-1', parentId: null, text: cleanText(topic, 'Topic'), collapsed: false }]);
}

export function addMindMapNode(map, parentId, text, id = nextId(map)) {
  assertMap(map);
  if (!map.nodes.some(({ id: nodeId }) => nodeId === parentId)) throw new RangeError('Choose an existing parent idea.');
  if (map.nodes.length >= MAX_NODES) throw new RangeError(`A map can contain at most ${MAX_NODES} ideas.`);
  if (typeof id !== 'string' || !id || id.length > MAX_ID_LENGTH || map.nodes.some((node) => node.id === id)) throw new RangeError('Choose a unique node identifier.');
  const nodes = map.nodes.map((node) => node.id === parentId ? { ...node, collapsed: false } : { ...node });
  nodes.push({ id, parentId, text: cleanText(text), collapsed: false });
  return updated(map, nodes);
}

export function editMindMapNode(map, id, text) {
  assertMap(map);
  if (!map.nodes.some((node) => node.id === id)) throw new RangeError('Choose an existing idea.');
  return updated(map, map.nodes.map((node) => ({ ...node, text: node.id === id ? cleanText(text) : node.text })));
}

export function removeMindMapNode(map, id) {
  assertMap(map);
  const node = map.nodes.find((item) => item.id === id);
  if (!node) throw new RangeError('Choose an existing idea.');
  if (node.parentId === null) throw new RangeError('The central topic cannot be removed.');
  const removeIds = new Set([id]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const item of map.nodes) if (removeIds.has(item.parentId) && !removeIds.has(item.id)) { removeIds.add(item.id); changed = true; }
  }
  return updated(map, map.nodes.filter((item) => !removeIds.has(item.id)));
}

export function moveMindMapNode(map, id, parentId) {
  assertMap(map);
  const node = map.nodes.find((item) => item.id === id);
  if (!node || !map.nodes.some((item) => item.id === parentId)) throw new RangeError('Choose existing ideas.');
  if (node.parentId === null) throw new RangeError('The central topic cannot be moved.');
  if (id === parentId) throw new RangeError('An idea cannot be its own parent.');
  const descendants = new Set([id]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const item of map.nodes) if (descendants.has(item.parentId) && !descendants.has(item.id)) { descendants.add(item.id); changed = true; }
  }
  if (descendants.has(parentId)) throw new RangeError('Moving this idea would create a cycle.');
  const allRows = getMindMapRows(map, true);
  const parentDepth = allRows.find(({ id: rowId }) => rowId === parentId)?.depth;
  const nodeDepth = allRows.find(({ id: rowId }) => rowId === id)?.depth;
  const subtreeHeight = Math.max(...allRows.filter(({ id: rowId }) => descendants.has(rowId)).map(({ depth }) => depth - nodeDepth));
  if (parentDepth + 1 + subtreeHeight > MAX_DEPTH) throw new RangeError(`A map can be no deeper than ${MAX_DEPTH} branches.`);
  return updated(map, map.nodes.map((item) => ({ ...item, parentId: item.id === id ? parentId : item.parentId })));
}

export function reorderMindMapNode(map, id, direction) {
  assertMap(map);
  if (direction !== -1 && direction !== 1) throw new RangeError('Direction must be up or down.');
  const node = map.nodes.find((item) => item.id === id);
  if (!node || node.parentId === null) throw new RangeError('Only child ideas can be reordered.');
  const siblings = map.nodes.filter((item) => item.parentId === node.parentId);
  const index = siblings.findIndex((item) => item.id === id);
  const neighbor = siblings[index + direction];
  if (!neighbor) return map;
  const first = map.nodes.findIndex((item) => item.id === id);
  const second = map.nodes.findIndex((item) => item.id === neighbor.id);
  const nodes = map.nodes.map((item) => ({ ...item }));
  [nodes[first], nodes[second]] = [nodes[second], nodes[first]];
  return updated(map, nodes);
}

export function toggleMindMapNode(map, id) {
  assertMap(map);
  const node = map.nodes.find((item) => item.id === id);
  if (!node) throw new RangeError('Choose an existing idea.');
  const hasChildren = map.nodes.some((item) => item.parentId === id);
  if (!hasChildren) return map;
  return updated(map, map.nodes.map((item) => ({ ...item, collapsed: item.id === id ? !item.collapsed : item.collapsed })));
}

export function getMindMapRows(map, includeCollapsed = false) {
  assertMap(map);
  const children = new Map(map.nodes.map(({ id }) => [id, []]));
  for (const node of map.nodes) if (node.parentId !== null) children.get(node.parentId).push(node);
  const rows = [];
  const visit = (node, depth) => {
    rows.push(Object.freeze({ ...node, depth }));
    if (includeCollapsed || !node.collapsed) for (const child of children.get(node.id)) visit(child, depth + 1);
  };
  visit(map.nodes[0], 0);
  return rows;
}

export function restoreMindMap(value) {
  assertMap(value);
  return updated(value, value.nodes);
}

const escapeXml = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');

export function exportMindMapSvg(map) {
  const rows = getMindMapRows(map, true);
  const width = Math.max(320, 48 + Math.max(...rows.map(({ depth }) => depth)) * 232 + 208);
  const height = Math.max(104, rows.length * 76 + 28);
  const positions = new Map(rows.map((row, index) => [row.id, { x: 24 + row.depth * 232, y: 16 + index * 76 }]));
  const edges = rows.filter(({ parentId }) => parentId !== null).map(({ id, parentId }) => {
    const from = positions.get(parentId); const to = positions.get(id);
    return `<path d="M ${from.x + 196} ${from.y + 26} H ${to.x - 16} V ${to.y + 26} H ${to.x}" fill="none" stroke="#73809a" stroke-width="2"/>`;
  }).join('');
  const boxes = rows.map(({ id, text }) => {
    const { x, y } = positions.get(id);
    const short = [...text].length > 27 ? `${[...text].slice(0, 26).join('')}…` : text;
    return `<g><rect x="${x}" y="${y}" width="196" height="52" rx="12" fill="#fff" stroke="#23304a" stroke-width="2"/><text x="${x + 12}" y="${y + 31}" font-family="system-ui,sans-serif" font-size="14" fill="#172033">${escapeXml(short)}</text></g>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Mind map">${edges}${boxes}</svg>`;
}
