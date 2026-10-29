import test from 'node:test';
import assert from 'node:assert/strict';
import { inspectDeliveredHTML, verifyStaticDelivery } from './verify-static-delivery.mjs';
const page = { path: '/tools/example/', status: 200, noindex: false,
  headers: new Headers({ 'cache-control': 'public, max-age=0, must-revalidate', 'x-content-type-options': 'nosniff', 'x-frame-options': 'DENY' }),
  body: '<html><head><link rel="canonical" href="https://usefulverse.com/tools/example/"><meta name="description" content="Example"></head><h1>Example</h1></html>' };
test('valid homepage headings can contain line breaks and styled spans', () => {
  assert.deepEqual(inspectDeliveredHTML({ ...page, body: page.body.replace('<h1>Example</h1>', '<h1>Do the small things<br><span>faster.</span></h1>') }), []);
});
test('delivered HTML requires revalidation, canonical and security headers', () => {
  assert.deepEqual(inspectDeliveredHTML(page), []);
  const headers = new Headers(page.headers); headers.set('cache-control', 'public, max-age=31536000, immutable'); headers.delete('x-frame-options');
  assert.deepEqual(inspectDeliveredHTML({ ...page, headers }), ['security-headers', 'html-cache']);
});
test('noindex assertions cannot pass by normalizing an old host or an HTTP noindex on existing pages', () => {
  assert.ok(inspectDeliveredHTML({ ...page, body: page.body.replace('https://usefulverse.com', 'https://tools.usefulverse.com') }).includes('canonical-or-old-host'));
  assert.ok(inspectDeliveredHTML({ ...page, noindex: true }).includes('indexation'));
  const headers = new Headers(page.headers); headers.set('x-robots-tag', 'noindex,follow');
  assert.ok(inspectDeliveredHTML({ ...page, headers }).includes('indexation'));
});
test('runtime verifier refuses non-loopback, credentials and extra URL paths before any request', async () => {
  for (const origin of ['https://usefulverse.com/', 'http://example.com/', 'http://user:password@127.0.0.1/', 'http://127.0.0.1/path', 'http://127.0.0.1/?x=1']) await assert.rejects(verifyStaticDelivery({ origin }), /loopback/u);
});
