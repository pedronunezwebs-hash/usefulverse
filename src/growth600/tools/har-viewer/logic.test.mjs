import test from 'node:test';
import assert from 'node:assert/strict';
import { filterHarEntries, HAR_LIMITS, parseHarDocument, summarizeHarBytes } from './logic.mjs';

function har(entries) { return JSON.stringify({ log: { version: '1.2', creator: { name: 'fixture', version: '1' }, entries } }); }
function entry({ url = 'https://example.com/api?token=do-not-show&x=private', method = 'GET', status = 200, time = 20, size = 100, startedDateTime = '2026-01-01T00:00:00Z' } = {}) {
  return { startedDateTime, time, request: { method, url, headers: [{ name: 'Authorization', value: 'secret' }] }, response: { status, statusText: 'OK', bodySize: size, content: { size, mimeType: 'application/json', text: 'never displayed' } }, timings: { wait: time } };
}

test('HAR parser accepts entries and redacts query values, userinfo, and non-HTTP URLs', () => {
  const result = parseHarDocument(har([entry(), entry({ url: 'data:text/plain,secret' })]));
  assert.equal(result.summary.total, 2);
  assert.equal(result.entries[0].url, 'https://example.com/api?token=%5Bredacted%5D&x=%5Bvalue+hidden%5D');
  assert.equal(result.entries[1].url, '(non-HTTP request URL hidden)');
  assert.equal(result.entries[0].mimeType, 'application/json');
  assert.equal(JSON.stringify(result).includes('do-not-show'), false);
  assert.equal(JSON.stringify(result).includes('never displayed'), false);
  assert.equal(JSON.stringify(result).includes('secret'), false);
});

test('summaries count HTTP errors, bytes, summed request time, and build normalized waterfall bars', () => {
  const result = parseHarDocument(har([entry({ time: 20, size: 100 }), entry({ status: 503, time: 80, size: 900, startedDateTime: '2026-01-01T00:00:00.010Z' })]));
  assert.deepEqual(result.summary, { total: 2, failed: 1, totalDuration: 100, totalBytes: 1000, slowestMs: 80 });
  assert.equal(result.entries[0].offsetPercent, 0);
  assert.ok(result.entries[1].offsetPercent > 0);
  assert.ok(result.entries.every((item) => item.widthPercent > 0 && item.widthPercent <= 100));
});

test('HAR filters use sanitized URL and status/method filters', () => {
  const entries = parseHarDocument(har([entry(), entry({ method: 'POST', status: 500, url: 'https://example.com/write' })])).entries;
  assert.equal(filterHarEntries(entries, { query: 'example.com', method: 'POST', status: 'errors' }).length, 1);
  assert.equal(filterHarEntries(entries, { query: 'do-not-show' }).length, 0);
  assert.equal(filterHarEntries(entries, { status: 'successful' }).length, 1);
});

test('HAR parser rejects empty, malformed, unsupported, oversized, deep, and excessive-entry input', () => {
  assert.throws(() => parseHarDocument(' '), /empty-input/u);
  assert.throws(() => parseHarDocument('{'), /invalid-json/u);
  assert.throws(() => parseHarDocument(JSON.stringify({ entries: [] })), /invalid-har/u);
  assert.throws(() => parseHarDocument(JSON.stringify({ log: { version: '1.1', entries: [] } })), /invalid-har/u);
  assert.throws(() => parseHarDocument(`x${' '.repeat(HAR_LIMITS.bytes)}`), /too-large/u);
  assert.throws(() => parseHarDocument(har([entry(), { request: {}, response: null }])), /invalid-har/u);
  assert.throws(() => parseHarDocument(har(Array(HAR_LIMITS.entries + 1).fill(entry()))), /too-many-entries/u);
  const deep = `${'{"a":'.repeat(HAR_LIMITS.depth + 2)}0${'}'.repeat(HAR_LIMITS.depth + 2)}`;
  assert.throws(() => parseHarDocument(deep), /too-deep/u);
});

test('byte formatter uses readable binary units and rejects invalid values', () => {
  assert.equal(summarizeHarBytes(1024), '1.0 KB');
  assert.equal(summarizeHarBytes(1024 * 1024), '1.00 MB');
  assert.equal(summarizeHarBytes(-1), '—');
});
