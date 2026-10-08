import assert from 'node:assert/strict';
import test from 'node:test';
import { assertCsvSize, CSV_LIMITS, detectCsvDelimiter, parseCsv } from './logic.mjs';

test('parses comma CSV with quoted delimiters, escaped quotes and CRLF', () => {
  const result = parseCsv('Name,Note\r\n"Doe, Jane","said ""hello"""\r\n');
  assert.deepEqual(result.headers, ['Name', 'Note']);
  assert.deepEqual(result.rows, [['Doe, Jane', 'said "hello"']]);
  assert.equal(result.dataRows, 1);
});

test('preserves quoted newlines, Unicode and leading zeroes as plain text', () => {
  const result = parseCsv('\uFEFFCode;Description;Value\n0012;"café\nand tea";=1+1', { delimiter: 'auto' });
  assert.equal(result.delimiter, ';');
  assert.deepEqual(result.rows, [['0012', 'café\nand tea', '=1+1']]);
});

test('detects tabs and pipes while supporting explicit separator selection', () => {
  assert.equal(detectCsvDelimiter('a\tb\n1\t2'), '\t');
  assert.equal(detectCsvDelimiter('a|b\n1|2'), '|');
  assert.deepEqual(parseCsv('a;b\n1;2', { delimiter: ';' }).rows, [['1', '2']]);
});

test('supports headerless data and supplies stable generated column names', () => {
  const result = parseCsv('001,Two\n003,Four', { hasHeader: false });
  assert.deepEqual(result.headers, ['Column 1', 'Column 2']);
  assert.deepEqual(result.rows, [['001', 'Two'], ['003', 'Four']]);
});

test('pads short rows and substitutes blank header labels without dropping text', () => {
  const result = parseCsv(',Second,Third\na,b\n');
  assert.deepEqual(result.headers, ['Column 1', 'Second', 'Third']);
  assert.deepEqual(result.rows, [['a', 'b', '']]);
});

test('rejects unmatched quotes, quote misuse and unsupported separators', () => {
  assert.throws(() => parseCsv('a,b\n"unfinished,2'), /closing quote/u);
  assert.throws(() => parseCsv('a,b\n1"oops,2'), /inside an unquoted/u);
  assert.throws(() => parseCsv('a,b\n"1"oops,2'), /after a closing/u);
  assert.throws(() => parseCsv('a,b', { delimiter: ':' }), /supported separator/u);
});

test('bounds row, column and cell counts before a printable table is returned', () => {
  assert.throws(() => parseCsv('a\n1\n2', { limits: { ...CSV_LIMITS, rows: 1 } }), /more than 1 data rows/u);
  assert.throws(() => parseCsv('a,b,c', { limits: { ...CSV_LIMITS, columns: 2 } }), /more than 2 columns/u);
  assert.throws(() => parseCsv('a,b\n1,2\n3,4', { limits: { ...CSV_LIMITS, cells: 5 } }), /more than 5 cells/u);
});

test('rejects invalid and oversized files using byte lengths', () => {
  assert.throws(() => parseCsv(' \n '), /non-empty/u);
  assert.equal(assertCsvSize(1), true);
  assert.throws(() => assertCsvSize(0), /non-empty/u);
  assert.throws(() => assertCsvSize(CSV_LIMITS.bytes + 1), /5 MiB/u);
});

test('a very long field is kept as data and never interpreted as markup', () => {
  const malicious = '<img src=x onerror=alert(1)>';
  const result = parseCsv(`text\n"${malicious}"`);
  assert.equal(result.rows[0][0], malicious);
});
