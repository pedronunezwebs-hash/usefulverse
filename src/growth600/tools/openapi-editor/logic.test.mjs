import test from 'node:test';
import assert from 'node:assert/strict';
import { JSON_SCHEMA, load } from 'js-yaml';
import { lintOpenApi, MAX_OPENAPI_BYTES, parseOpenApi } from './logic.mjs';

const valid = {
  openapi: '3.1.0', info: { title: 'Sample API', version: '1.0.0' },
  paths: { '/items/{itemId}': { get: { operationId: 'getItem', parameters: [{ name: 'itemId', in: 'path', required: true }], responses: { '200': { description: 'An item' } } } } },
};

test('OpenAPI lint accepts a basic 3.1 contract and extracts operation preview data', () => {
  const report = lintOpenApi(valid);
  assert.deepEqual(report.issues, []);
  assert.deepEqual(report.operations, [{ method: 'GET', path: '/items/{itemId}', summary: '', operationId: 'getItem', responses: ['200'] }]);
});

test('OpenAPI lint reports missing version, info, paths and path parameter requirements', () => {
  const report = lintOpenApi({ openapi: '2.0', info: {}, paths: { 'items/{id}': { get: { responses: {} } } } });
  assert.deepEqual(report.issues.map(({ code }) => code), ['version', 'info', 'invalidPath', 'operationId', 'responses', 'pathParameter']);
});

test('operations must have unique operation IDs and described valid responses', () => {
  const document = structuredClone(valid);
  document.paths['/items/{itemId}'].get.responses = { foo: {}, '200': {}, default: { description: 'Fallback' } };
  document.paths['/other'] = { post: { operationId: 'getItem', responses: { '201': { description: 'Created' } } } };
  const codes = lintOpenApi(document).issues.map(({ code }) => code);
  assert.ok(codes.includes('responseDescription'));
  assert.ok(codes.includes('duplicateOperationId'));
});

test('only local JSON Pointer references are accepted and unresolved references are reported', () => {
  const document = structuredClone(valid);
  document.components = { schemas: { 'Item/Value': { type: 'string' } } };
  document.paths['/items/{itemId}'].get.responses['200'].content = { 'application/json': { schema: { $ref: '#/components/schemas/Item~1Value' } } };
  assert.deepEqual(lintOpenApi(document).issues, []);
  document.paths['/items/{itemId}'].get.responses['200'].content['application/json'].schema.$ref = 'https://example.test/openapi.json';
  assert.ok(lintOpenApi(document).issues.some(({ code }) => code === 'remoteReference'));
  document.paths['/items/{itemId}'].get.responses['200'].content['application/json'].schema.$ref = '#/components/schemas/Missing';
  assert.ok(lintOpenApi(document).issues.some(({ code }) => code === 'unresolvedReference'));
});

test('invalid roots and oversized documents return bounded errors', () => {
  assert.equal(lintOpenApi([]).issues[0].code, 'rootObject');
  assert.throws(() => parseOpenApi('x'.repeat(MAX_OPENAPI_BYTES + 1), 'json'), RangeError);
  assert.throws(() => parseOpenApi('', 'auto'), TypeError);
});

test('JSON parsing detects the format and uses the bundled YAML parser only when requested', () => {
  assert.equal(parseOpenApi(JSON.stringify(valid)).format, 'json');
  const source = 'openapi: 3.1.0\ninfo:\n  title: Sample\n  version: 1.0.0\npaths:\n  /health:\n    get:\n      operationId: health\n      responses:\n        "200":\n          description: OK\n';
  assert.throws(() => parseOpenApi(source), /yamlUnavailable/u);
  const parsed = parseOpenApi(source, 'yaml', (text) => ({ openapi: '3.1.0', info: { title: 'Sample', version: '1.0.0' }, paths: { '/health': { get: { operationId: 'health', responses: { 200: { description: 'OK' } } } } } }));
  assert.equal(parsed.format, 'yaml');
  assert.deepEqual(lintOpenApi(parsed.document).issues, []);
});

test('the pinned YAML parser accepts the example shape and rejects alias expansion', () => {
  const yaml = `openapi: 3.1.0\ninfo:\n  title: Sample\n  version: 1.0.0\npaths:\n  /health:\n    get:\n      operationId: health\n      responses:\n        "200":\n          description: OK\n`;
  const parsed = parseOpenApi(yaml, 'yaml', (text, options) => load(text, { ...options, schema: JSON_SCHEMA }));
  assert.deepEqual(lintOpenApi(parsed.document).issues, []);
  assert.throws(() => parseOpenApi('openapi: 3.1.0\ninfo: &data {title: Test, version: 1}\ncopy: *data\n', 'yaml', (text, options) => load(text, { ...options, schema: JSON_SCHEMA })));
});

test('the input cap measures UTF-8 bytes rather than just characters', () => {
  assert.throws(() => parseOpenApi('é'.repeat(Math.floor(MAX_OPENAPI_BYTES / 2) + 1), 'json'), RangeError);
});
