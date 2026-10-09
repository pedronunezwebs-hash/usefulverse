import test from 'node:test';
import assert from 'node:assert/strict';
import { exportJsonExcel, JSON_EXCEL_LIMITS, parseJsonForExcel, prepareJsonExcel } from './logic.mjs';
import { unzipSync } from 'fflate';

test('converts object arrays to flattened columns and preserves identifier strings and JSON types', () => {
  const prepared = prepareJsonExcel('{"records":[{"id":"001","profile":{"city":"Oslo"},"active":true,"amount":12.5},{"id":"002","profile":{"city":"Lima"},"note":null}]}', 'records');
  assert.deepEqual(prepared.headers, ['id', 'profile.city', 'active', 'amount', 'note']);
  assert.deepEqual(prepared.rows[1], ['001', 'Oslo', true, 12.5, '']);
  assert.equal(prepared.rows[2][4], 'null');
});

test('offers explicit top-level array datasets and one-row root-object mode', () => {
  const text = '{"users":[{"id":"001"}],"orders":[{"total":9}],"version":1}';
  assert.deepEqual(parseJsonForExcel(text).map(({ key }) => key), ['$root', 'users', 'orders']);
  assert.equal(prepareJsonExcel(text, 'users').rows[1][0], '001');
  assert.deepEqual(prepareJsonExcel('{"version":1,"name":"x"}').rows, [['version', 'name'], [1, 'x']]);
});

test('nested arrays stay readable JSON text and hostile formula strings are exported as inert strings', () => {
  const prepared = prepareJsonExcel('{"rows":[{"cells":[1,2],"formula":"=1+1"}]}', 'rows');
  assert.equal(prepared.rows[1][0], '[1,2]');
  const files = unzipSync(exportJsonExcel(prepared));
  const worksheet = new TextDecoder().decode(files['xl/worksheets/sheet1.xml']);
  assert.match(worksheet, /<c r="B2" t="inlineStr"><is><t xml:space="preserve">=1\+1<\/t>/u);
  assert.doesNotMatch(worksheet, /<f>/u);
});

test('input, depth, rows, value size, column, cell and export limits fail with stable codes', () => {
  assert.throws(() => prepareJsonExcel(''), /emptyInput/u);
  assert.throws(() => prepareJsonExcel('{'), /invalidJson/u);
  assert.throws(() => prepareJsonExcel(`x${' '.repeat(JSON_EXCEL_LIMITS.inputBytes)}`), /tooLarge/u);
  assert.throws(() => parseJsonForExcel(`${'['.repeat(JSON_EXCEL_LIMITS.depth + 2)}0${']'.repeat(JSON_EXCEL_LIMITS.depth + 2)}`), /tooDeep/u);
  assert.throws(() => parseJsonForExcel(JSON.stringify(Array.from({ length: JSON_EXCEL_LIMITS.rows + 1 }, () => 0))), /tooManyRows/u);
  assert.throws(() => prepareJsonExcel(JSON.stringify([{ value: 'x'.repeat(JSON_EXCEL_LIMITS.valueChars + 1) }])), /valueTooLong/u);
  assert.throws(() => prepareJsonExcel(JSON.stringify([Object.fromEntries(Array.from({ length: JSON_EXCEL_LIMITS.columns + 1 }, (_, index) => [`k${index}`, index]))])), /tooManyColumns/u);
  assert.throws(() => exportJsonExcel(null), /noPreview/u);
});
