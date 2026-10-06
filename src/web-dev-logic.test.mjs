import test from 'node:test';
import assert from 'node:assert/strict';
import { buildApiRequest, createHtmlTable, createPwaManifest } from './web-dev-logic.mjs';

test('API request builder emits cURL and Fetch without making a request', () => {
  assert.equal(buildApiRequest({ url: 'https://example.test/a', method: 'POST', headers: '{"Content-Type":"application/json"}', body: '{"name":"Ada"}' }),
    "curl --request POST --header 'Content-Type: application/json' --data-raw '{\"name\":\"Ada\"}' 'https://example.test/a'");
  assert.match(buildApiRequest({ url: 'https://example.test', method: 'GET', output: 'fetch' }), /fetch\("https:\/\/example\.test\/",/u);
});

test('API request builder validates method, protocol, headers, GET bodies and bounds', () => {
  assert.throws(() => buildApiRequest({ url: 'file:///tmp/x' }), /HTTP or HTTPS/u);
  assert.throws(() => buildApiRequest({ url: 'https://user:pass@example.test' }), /without embedded credentials/u);
  assert.throws(() => buildApiRequest({ url: 'https://example.test', method: 'TRACE' }), /supported HTTP method/u);
  assert.throws(() => buildApiRequest({ url: 'https://example.test', headers: '{"Bad Name":"x"}' }), /Invalid header name/u);
  assert.throws(() => buildApiRequest({ url: 'https://example.test', headers: '{"X-Test":"ok\\r\\nInjected: yes"}' }), /Invalid value/u);
  assert.throws(() => buildApiRequest({ url: 'https://example.test', body: 'x' }), /cannot include/u);
  assert.throws(() => buildApiRequest({ url: 'https://example.test', body: 'x'.repeat(100_001), method: 'POST' }), /limited/u);
});

test('HTML table generator safely escapes cells and builds semantic headers', () => {
  const html = createHtmlTable({ data: 'Name\tNote\nAda\t<admin & "owner">', caption: 'People & roles' });
  assert.match(html, /<caption>People &amp; roles<\/caption>/u);
  assert.match(html, /<th scope="col">Name<\/th>/u);
  assert.match(html, /&lt;admin &amp; &quot;owner&quot;&gt;/u);
  assert.doesNotMatch(html, /<admin/u);
});

test('HTML table generator validates dimensions, rectangular rows and heading-only data', () => {
  assert.throws(() => createHtmlTable({ data: '' }), /Paste/u);
  assert.throws(() => createHtmlTable({ data: 'a\tb\n1' }), /same/u);
  assert.throws(() => createHtmlTable({ data: 'Only heading', headers: true }), /data row/u);
  assert.throws(() => createHtmlTable({ data: 'x'.repeat(20_001) }), /20,000/u);
});

test('PWA manifest uses validated same-origin paths and standard display/color values', () => {
  const value = JSON.parse(createPwaManifest({ name: 'My App', shortName: 'App', startUrl: '/app/' }));
  assert.equal(value.name, 'My App');
  assert.equal(value.start_url, '/app/');
  assert.equal(value.display, 'standalone');
  assert.throws(() => createPwaManifest({ name: 'x', shortName: 'x', startUrl: '//evil.test' }), /same-site/u);
  assert.throws(() => createPwaManifest({ name: 'x', shortName: 'x', startUrl: '/../evil' }), /same-site/u);
  assert.throws(() => createPwaManifest({ name: 'x', shortName: 'x', themeColor: 'red' }), /hexadecimal/u);
  assert.throws(() => createPwaManifest({ name: 'x'.repeat(81), shortName: 'x' }), /80 characters/u);
});
