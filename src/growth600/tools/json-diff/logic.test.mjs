import test from 'node:test';
import assert from 'node:assert/strict';
import { compareJsonDocuments, JSON_DIFF_LIMITS, parseJsonDocument } from './logic.mjs';

test('object key order is ignored but nested value changes are reported', () => {
  const result = compareJsonDocuments('{"b":2,"a":{"x":1}}', '{"a":{"x":3},"b":2}');
  assert.deepEqual(result.summary, { added: 0, removed: 0, changed: 1 });
  assert.equal(result.changes[0].path, '/a/x');
  assert.deepEqual(result.patch, [{ op: 'replace', path: '/a/x', value: 3 }]);
});

test('index mode reports insertion as positional changes; ID mode matches reordered records', () => {
  const before = '[{"id":"a","v":1},{"id":"b","v":2}]';
  const after = '[{"id":"b","v":3},{"id":"a","v":1}]';
  assert.ok(compareJsonDocuments(before, after).summary.changed > 0);
  const byId = compareJsonDocuments(before, after, { arrayKey: 'id' });
  assert.deepEqual(byId.summary, { added: 0, removed: 0, changed: 1 });
  assert.equal(byId.changes[0].path, '/[@b]/v');
});

test('detects additions, removals and JSON Pointer escaping', () => {
  const result = compareJsonDocuments('{"a/b":{"~key":1},"gone":true}', '{"a/b":{"~key":2},"new":null}');
  assert.deepEqual(result.summary, { added: 1, removed: 1, changed: 1 });
  assert.ok(result.changes.some(({ path }) => path === '/a~1b/~0key'));
  assert.ok(result.patch.some(({ path, op }) => path === '/a~1b/~0key' && op === 'replace'));
});

test('generated patch is valid JSON Patch and transforms arrays and objects', () => {
  const before = { list: [1, 2, 3], remove: true };
  const after = { list: [0, 1, 4, 5], add: 'ok' };
  const patch = compareJsonDocuments(JSON.stringify(before), JSON.stringify(after)).patch;
  const copy = structuredClone(before);
  const parentAt = (root, path) => path.split('/').slice(1, -1).reduce((node, part) => node[part.replaceAll('~1', '/').replaceAll('~0', '~')], root);
  for (const op of patch) {
    const parts = op.path.split('/').slice(1).map((part) => part.replaceAll('~1', '/').replaceAll('~0', '~'));
    if (!parts.length) throw new Error('Root patch not expected in this fixture');
    const parent = parentAt(copy, op.path);
    const key = parts.at(-1);
    if (op.op === 'remove') Array.isArray(parent) ? parent.splice(Number(key), 1) : delete parent[key];
    if (op.op === 'replace') parent[key] = op.value;
    if (op.op === 'add') Array.isArray(parent) ? parent.splice(key === '-' ? parent.length : Number(key), 0, op.value) : parent[key] = op.value;
  }
  assert.deepEqual(copy, after);
  assert.ok(patch.some(({ path, op }) => path === '/list/-' && op === 'add'));
});

test('rejects malformed, empty, oversized and deeply nested inputs', () => {
  assert.throws(() => parseJsonDocument(''), /enter a JSON document/u);
  assert.throws(() => parseJsonDocument('{bad}'), /invalid JSON syntax/u);
  assert.throws(() => parseJsonDocument(' '.repeat(JSON_DIFF_LIMITS.characters + 1)), /too large/u);
  const deep = `${'['.repeat(JSON_DIFF_LIMITS.depth + 2)}0${']'.repeat(JSON_DIFF_LIMITS.depth + 2)}`;
  assert.throws(() => parseJsonDocument(deep), /too deep/u);
});

test('rejects duplicate or missing keys in keyed arrays', () => {
  assert.throws(() => compareJsonDocuments('[{"id":1},{"id":1}]', '[{"id":1}]', { arrayKey: 'id' }), /duplicate keys/u);
  assert.throws(() => compareJsonDocuments('[{"x":1}]', '[{"x":2}]', { arrayKey: 'id' }), /selected key/u);
});

test('flags primitive root replacement and preserves null distinctions', () => {
  const result = compareJsonDocuments('null', '0');
  assert.deepEqual(result.summary, { added: 0, removed: 0, changed: 1 });
  assert.equal(result.patch[0].path, '');
  assert.equal(result.patch[0].op, 'replace');
});
