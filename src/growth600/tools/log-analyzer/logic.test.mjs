import test from 'node:test';
import assert from 'node:assert/strict';
import { accessLogSummaryCsv, analyzeAccessLogs, LOG_MAX_BYTES, LOG_MAX_LINES, parseCombinedAccessLogLine } from './logic.mjs';

const sample = [
  '192.0.2.10 - - [10/Oct/2026:08:10:00 +0000] "GET /private/user?email=person@example.com HTTP/1.1" 200 125 "-" "Private Browser UA"',
  '198.51.100.9 - - [10/Oct/2026:09:15:00 +0200] "POST /orders/123 HTTP/1.1" 404 50 "https://example.test/?secret=x" "Another UA"',
  '203.0.113.7 - - [11/Oct/2026:00:01:00 -0700] "GET / HTTP/1.1" 503 - "-" "-"',
  'not an Apache combined log line',
].join('\n');

test('parses combined Apache/Nginx fields and converts timestamp offsets to UTC', () => {
  const parsed = parseCombinedAccessLogLine('192.0.2.1 - - [10/Oct/2026:09:15:00 +0200] "GET /x HTTP/1.1" 200 12 "-" "-"');
  assert.equal(parsed.timestamp.toISOString(), '2026-10-10T07:15:00.000Z');
  assert.deepEqual({ day: parsed.day, method: parsed.method, status: parsed.status, bytes: parsed.bytes }, { day: '2026-10-10', method: 'GET', status: 200, bytes: 12 });
  assert.equal(parseCombinedAccessLogLine('192.0.2.1 - - [31/Feb/2026:09:15:00 +0000] "GET /x HTTP/1.1" 200 12 "-" "-"'), null);
});

test('aggregates by status, method, and UTC date; filters locally without exposing source fields', () => {
  const all = analyzeAccessLogs(sample);
  assert.equal(all.totalLines, 4);
  assert.equal(all.parsedLines, 3);
  assert.equal(all.invalidLines, 1);
  assert.equal(all.matchedRequests, 3);
  assert.equal(all.transferredBytes, 175);
  assert.deepEqual(all.byStatus, [{ status: 200, requests: 1 }, { status: 404, requests: 1 }, { status: 503, requests: 1 }]);
  assert.deepEqual(all.byMethod, [{ method: 'GET', requests: 2 }, { method: 'POST', requests: 1 }]);
  assert.deepEqual(all.byDay, [{ day: '2026-10-10', requests: 2 }, { day: '2026-10-11', requests: 1 }]);
  const filtered = analyzeAccessLogs(sample, { statusClass: '4xx', fromDate: '2026-10-10', toDate: '2026-10-10' });
  assert.equal(filtered.matchedRequests, 1);
  assert.deepEqual(filtered.byStatus, [{ status: 404, requests: 1 }]);
  const csv = accessLogSummaryCsv(all);
  assert.match(csv, /"status","404","1"/u);
  assert.match(csv, /"method","POST","1"/u);
  assert.doesNotMatch(csv, /192\.0\.2\.10|person@example|Private Browser UA|secret=x|\/orders\/123/u);
});

test('counts malformed lines but never returns their source contents; rejects invalid limits and filters', () => {
  assert.throws(() => analyzeAccessLogs('  \n'), /supported log/u);
  const broken = analyzeAccessLogs('private invalid source data\n\ninvalid\n');
  assert.equal(broken.invalidLines, 2);
  assert.deepEqual(broken.invalidLineNumbers, [1, 3]);
  assert.equal('rawLines' in broken, false);
  assert.throws(() => analyzeAccessLogs('x', { statusClass: '1xx' }), /2xx–5xx/u);
  assert.throws(() => analyzeAccessLogs('x', { fromDate: '2026-10-02', toDate: '2026-10-01' }), /start date/u);
  assert.throws(() => analyzeAccessLogs('x', { fromDate: '2026-02-30' }), /valid calendar dates/u);
  assert.throws(() => analyzeAccessLogs('x'.repeat(LOG_MAX_BYTES + 1)), /10 MiB/u);
  assert.throws(() => analyzeAccessLogs(`${'\n'.repeat(LOG_MAX_LINES)}x`), /100,000-line/u);
  assert.throws(() => analyzeAccessLogs('192.0.2.1 - - [10/Oct/2026:08:10:00 +0000] "GET / HTTP/1.1" 200 9007199254740991 "-" "-"\n192.0.2.2 - - [10/Oct/2026:08:10:00 +0000] "GET / HTTP/1.1" 200 1 "-" "-"'), /safe calculation range/u);
  assert.throws(() => accessLogSummaryCsv(null), /Analyze a log/u);
});
