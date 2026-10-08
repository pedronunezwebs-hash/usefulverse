import assert from 'node:assert/strict';
import test from 'node:test';
import { addMindMapNode, createMindMap, editMindMapNode, exportMindMapSvg, getMindMapRows, moveMindMapNode, removeMindMapNode, reorderMindMapNode, restoreMindMap, toggleMindMapNode } from './logic.mjs';

test('mind map builds and edits a branching idea tree', () => {
  let map = createMindMap('UsefulVerse');
  map = addMindMapNode(map, 'idea-1', 'Tools');
  map = addMindMapNode(map, 'idea-1', 'Languages');
  map = addMindMapNode(map, 'idea-2', 'PDF utilities');
  assert.deepEqual(getMindMapRows(map).map(({ text, depth }) => [text, depth]), [['UsefulVerse', 0], ['Tools', 1], ['PDF utilities', 2], ['Languages', 1]]);
  map = editMindMapNode(map, 'idea-3', 'Locales');
  assert.equal(getMindMapRows(map)[3].text, 'Locales');
});

test('moving nodes changes branches but refuses self-parenting, root moves and cycles', () => {
  let map = createMindMap('Root');
  map = addMindMapNode(map, 'idea-1', 'A');
  map = addMindMapNode(map, 'idea-1', 'B');
  map = addMindMapNode(map, 'idea-2', 'A child');
  map = moveMindMapNode(map, 'idea-4', 'idea-3');
  assert.equal(map.nodes.find(({ id }) => id === 'idea-4').parentId, 'idea-3');
  for (const [id, parent] of [['idea-1', 'idea-2'], ['idea-2', 'idea-2'], ['idea-3', 'idea-4']]) assert.throws(() => moveMindMapNode(map, id, parent));
});

test('collapse, sibling order and subtree deletion are predictable', () => {
  let map = createMindMap('Root');
  map = addMindMapNode(map, 'idea-1', 'First');
  map = addMindMapNode(map, 'idea-1', 'Second');
  map = addMindMapNode(map, 'idea-2', 'Nested');
  assert.equal(getMindMapRows(toggleMindMapNode(map, 'idea-2')).some(({ id }) => id === 'idea-4'), false);
  map = reorderMindMapNode(map, 'idea-3', -1);
  assert.deepEqual(map.nodes.slice(1, 3).map(({ text }) => text), ['Second', 'First']);
  map = removeMindMapNode(map, 'idea-2');
  assert.deepEqual(map.nodes.map(({ text }) => text), ['Root', 'Second']);
  assert.throws(() => removeMindMapNode(map, 'idea-1'));
});

test('JSON import validates one connected acyclic root and bounded text', () => {
  const map = createMindMap('Safe <topic>');
  assert.deepEqual(restoreMindMap(JSON.parse(JSON.stringify(map))), map);
  assert.throws(() => restoreMindMap({ ...map, nodes: [{ ...map.nodes[0], parentId: 'missing' }] }));
  assert.throws(() => restoreMindMap({ ...map, nodes: [{ ...map.nodes[0], text: '<script>' }, { id: 'x', parentId: 'x', text: 'cycle', collapsed: false }] }));
});

test('SVG export includes collapsed descendants and escapes user-supplied text', () => {
  let map = createMindMap('<script>alert(1)</script>');
  map = addMindMapNode(map, 'idea-1', 'Child & more');
  map = toggleMindMapNode(map, 'idea-1');
  const svg = exportMindMapSvg(map);
  assert.match(svg, /&lt;script&gt;/u);
  assert.match(svg, /Child &amp; more/u);
  assert.equal((svg.match(/<rect /gu) ?? []).length, 2);
});
