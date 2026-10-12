import test from 'node:test';
import assert from 'node:assert/strict';
import { accessLogRowsToCsv, analyzeAccessLog, filterAccessLogRows, LOG_ANALYZER_MAX_BYTES, LOG_ANALYZER_MAX_LINES, parseAccessLogLine } from './logic.mjs';

const sample = [
  '203.0.113.10 - - [10/Oct/2000:13:55:36 -0700] "GET /index.html?campaign=x HTTP/1.1" 200 2326 "https://example.test/" "Mozilla/5.0"',
  '2001:db8::1 - - [11/Oct/2000:14:00:00 +0000] "POST /api/items HTTP/2" 404 0 "-" "Test Agent"',
  '192.0.2.4 - - [11/Oct/2000:14:05:00 +0000] "GET /index.html HTTP/1.1" 200 - "-" "Test Agent"',
].join('\n');

test('parses NCSA combined logs, normalizes query-free paths and respects offsets', () => {
  const row = parseAccessLogLine(sample.split('\n')[0]);
  assert.equal(row.path, '/index.html');
  assert.equal(row.method, 'GET');
  assert.equal(row.status, 200);
  assert.equal(row.day, '2000-10-10');
  assert.equal(row.date.toISOString(), '2000-10-10T20:55:36.000Z');
  assert.equal(parseAccessLogLine('not a log'), null);
  assert.equal(parseAccessLogLine('203.0.113.1 - - [31/Feb/2000:13:55:36 +0000] "GET / HTTP/1.1" 200 1'), null);
});

test('aggregates totals and flags invalid non-empty lines', () => {
  const result = analyzeAccessLog(`${sample}\nmalformed`);
  assert.equal(result.totalLines, 4);
  assert.equal(result.validLines, 3);
  assert.equal(result.invalidLines, 1);
  assert.equal(result.transferredBytes, 2326n);
  assert.deepEqual(result.statusCounts, [[200, 2], [404, 1]]);
  assert.equal(result.topPaths[0][0], '/index.html');
});

test('the page example is exactly five valid requests, one invalid line and 4,129 bytes', () => {
  const text = [
    '203.0.113.10 - - [10/Oct/2000:13:55:36 -0700] "GET /index.html?campaign=x HTTP/1.1" 200 2326 "https://example.test/" "Mozilla/5.0"',
    '2001:db8::1 - - [11/Oct/2000:14:00:00 +0000] "POST /api/items HTTP/2" 404 0 "-" "Test Agent"',
    '192.0.2.4 - - [11/Oct/2000:14:05:00 +0000] "GET /index.html HTTP/1.1" 200 - "-" "Test Agent"',
    '198.51.100.7 - - [11/Oct/2000:14:10:00 +0000] "GET /docs?secret=removed-from-summary HTTP/1.1" 200 750 "-" "Example"',
    '198.51.100.8 - - [12/Oct/2000:09:00:00 +0000] "GET /missing HTTP/1.1" 500 1053 "-" "Example"',
    'This example line is intentionally invalid',
  ].join('\n');
  const result = analyzeAccessLog(text);
  assert.equal(result.validLines, 5);
  assert.equal(result.invalidLines, 1);
  assert.equal(result.transferredBytes, 4129n);
  assert.deepEqual(result.statusCounts, [[200, 3], [404, 1], [500, 1]]);
  assert.deepEqual(result.topPaths.map(([path]) => path), ['/index.html', '/api/items', '/docs', '/missing']);
});

test('filters are composable and exclude query-string values from search', () => {
  const rows = analyzeAccessLog(sample).rows;
  assert.equal(filterAccessLogRows(rows, { status: 404 }).length, 1);
  assert.equal(filterAccessLogRows(rows, { method: 'GET', from: '2000-10-11' }).length, 1);
  assert.equal(filterAccessLogRows(rows, { search: 'campaign=x' }).length, 0);
});

test('CSV escapes values, neutralizes formulas and omits client IP by default', () => {
  const rows = [{ ip: '192.0.2.1', date: new Date('2025-01-01T00:00:00Z'), method: 'GET', path: '/"=SUM(A1:A2)', status: 200, bytes: 10, referer: '=SUM(A1:A2)', userAgent: 'agent' }];
  const csv = accessLogRowsToCsv(rows);
  assert.match(csv, /^date,method,path,status,bytes,referer,userAgent/u);
  assert.doesNotMatch(csv, /192\.0\.2\.1/u);
  assert.match(csv, /"\/""=SUM\(A1:A2\)"/u);
  assert.match(csv, /"'=SUM\(A1:A2\)"/u);
  assert.match(accessLogRowsToCsv(rows, { includeClientIp: true }), /192\.0\.2\.1/u);
});

test('rejects oversized and excessive-line input before parsing', () => {
  assert.throws(() => analyzeAccessLog('é'.repeat(6), { maxBytes: 10 }), RangeError);
  assert.throws(() => analyzeAccessLog('x\nx\nx', { maxLines: 2 }), RangeError);
  assert.ok(LOG_ANALYZER_MAX_BYTES > 0 && LOG_ANALYZER_MAX_LINES > 0);
});
