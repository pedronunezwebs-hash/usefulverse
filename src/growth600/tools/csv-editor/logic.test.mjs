import assert from 'node:assert/strict';
import test from 'node:test';
import { applyCsvEdit, countCsvEditorTypeIssues, csvEditorCellMatchesType, CSV_EDITOR_LIMITS, detectCsvEditorDelimiter, parseCsvForEditing, serializeCsvForEditing } from './logic.mjs';

test('parses quoted delimiters, escaped quotes, CRLF, embedded newlines and a UTF-8 BOM', () => {
  const table = parseCsvForEditing('\uFEFFname,notes,value\r\nAda,"Says ""hello"", then\nleaves",1\r\nLin,"comma, here",2\r\n');
  assert.equal(table.delimiter, ',');
  assert.deepEqual(table.headers, ['name', 'notes', 'value']);
  assert.deepEqual(table.rows, [['Ada', 'Says "hello", then\nleaves', '1'], ['Lin', 'comma, here', '2']]);
});

test('detects semicolon, tab and pipe delimiters without counting quoted punctuation', () => {
  assert.equal(detectCsvEditorDelimiter('a;b;c\n1;"x,y";3'), ';');
  assert.equal(detectCsvEditorDelimiter('a\tb\tc\n1\t2\t3'), '\t');
  assert.equal(detectCsvEditorDelimiter('a|b|c\n1|2|3'), '|');
});

test('pads ragged rows, supplies blank column names, and preserves all data when there is no header', () => {
  const withHeader = parseCsvForEditing('name,,amount\nAda,1\n', { hasHeader: true });
  assert.deepEqual(withHeader.headers, ['name', '', 'amount']);
  assert.deepEqual(withHeader.rows, [['Ada', '1', '']]);
  const withoutHeader = parseCsvForEditing('a,b\n1,2', { hasHeader: false });
  assert.deepEqual(withoutHeader.headers, ['Column 1', 'Column 2']);
  assert.deepEqual(withoutHeader.rows, [['a', 'b'], ['1', '2']]);
  assert.equal(serializeCsvForEditing(withoutHeader), 'a,b\r\n1,2');
});

test('CSV export quotes delimiters, quotes, newlines and edge spaces, and optionally writes BOM', () => {
  const table = parseCsvForEditing('a,b\n" edge ","say ""hi""\nand bye"');
  const csv = serializeCsvForEditing(table, { bom: true });
  assert.ok(csv.startsWith('\uFEFF'));
  assert.deepEqual(parseCsvForEditing(csv), table);
});

test('column types flag mismatches without changing source text, and support strict ISO dates and booleans', () => {
  const table = parseCsvForEditing('amount,date,active\n12.5,2024-02-29,true\nnot a number,2023-02-29,yes');
  assert.deepEqual(table.columnTypes, ['text', 'text', 'text']);
  const numberColumn = applyCsvEdit(table, { type: 'setColumnType', column: 0, value: 'number' });
  const dateColumn = applyCsvEdit(numberColumn.table, { type: 'setColumnType', column: 1, value: 'date' });
  const booleanColumn = applyCsvEdit(dateColumn.table, { type: 'setColumnType', column: 2, value: 'boolean' });
  assert.equal(countCsvEditorTypeIssues(booleanColumn.table), 3);
  assert.equal(csvEditorCellMatchesType('', 'number'), true);
  assert.equal(csvEditorCellMatchesType('1.25e2', 'number'), true);
  assert.equal(csvEditorCellMatchesType('2024-02-29', 'date'), true);
  assert.equal(csvEditorCellMatchesType('2023-02-29', 'date'), false);
  assert.equal(csvEditorCellMatchesType('TRUE', 'boolean'), true);
  assert.equal(csvEditorCellMatchesType('yes', 'boolean'), false);
  assert.equal(serializeCsvForEditing(booleanColumn.table), 'amount,date,active\r\n12.5,2024-02-29,true\r\nnot a number,2023-02-29,yes');
  assert.deepEqual(applyCsvEdit(booleanColumn.table, booleanColumn.inverse).table, dateColumn.table);
});

test('edits are immutable and inverses restore edited cells, deleted rows, columns and header changes', () => {
  const original = parseCsvForEditing('name,value\nAda,1\nLin,2');
  const changed = applyCsvEdit(original, { type: 'setCell', row: 0, column: 1, value: '9' });
  assert.equal(original.rows[0][1], '1');
  assert.deepEqual(applyCsvEdit(changed.table, changed.inverse).table, original);
  const deleted = applyCsvEdit(original, { type: 'deleteRow', row: 0 });
  assert.deepEqual(applyCsvEdit(deleted.table, deleted.inverse).table, original);
  const addedColumn = applyCsvEdit(original, { type: 'appendColumn', header: 'status' });
  assert.deepEqual(applyCsvEdit(addedColumn.table, addedColumn.inverse).table, original);
  const removedColumn = applyCsvEdit(original, { type: 'deleteColumn', column: 0 });
  assert.deepEqual(applyCsvEdit(removedColumn.table, removedColumn.inverse).table, original);
  const headerMode = applyCsvEdit(original, { type: 'setHeaderMode', value: false });
  assert.equal(headerMode.table.hasHeader, false);
  assert.deepEqual(applyCsvEdit(headerMode.table, headerMode.inverse).table, original);
});

test('appending/inserting/deleting rows and columns preserves rectangular structure', () => {
  const original = parseCsvForEditing('a,b\n1,2');
  let result = applyCsvEdit(original, { type: 'appendRow' });
  result = applyCsvEdit(result.table, { type: 'setCell', row: 1, column: 0, value: 'x,y' });
  assert.equal(serializeCsvForEditing(result.table), 'a,b\r\n1,2\r\n"x,y",');
  const undoCell = applyCsvEdit(result.table, result.inverse);
  const deleted = applyCsvEdit(undoCell.table, { type: 'deleteRow', row: 0 });
  assert.deepEqual(applyCsvEdit(deleted.table, deleted.inverse).table, undoCell.table);
  const insertedRow = applyCsvEdit(original, { type: 'insertRow', row: 0, values: ['first', 'row'] });
  assert.deepEqual(applyCsvEdit(insertedRow.table, insertedRow.inverse).table, original);
  const insertedColumn = applyCsvEdit(original, { type: 'insertColumn', column: 1, header: 'middle', values: ['x'] });
  assert.deepEqual(insertedColumn.table.headers, ['a', 'middle', 'b']);
  assert.deepEqual(applyCsvEdit(insertedColumn.table, insertedColumn.inverse).table, original);
});

test('round-trips edited quoted values across all supported separators and header modes', () => {
  for (const delimiter of [',', ';', '\t', '|']) {
    const table = parseCsvForEditing(`first${delimiter}second\r\n"a${delimiter}b"${delimiter}"line 1\nline 2"`, { delimiter });
    const changed = applyCsvEdit(table, { type: 'setCell', row: 0, column: 0, value: `quote " ${delimiter}` }).table;
    assert.deepEqual(parseCsvForEditing(serializeCsvForEditing(changed, { delimiter })), changed);
  }
});

test('rejects malformed quoting, excess input, ragged width and dangerous dimensions with stable errors', () => {
  assert.throws(() => parseCsvForEditing('a,b\n"unfinished,2'), /unclosedQuote/u);
  assert.throws(() => parseCsvForEditing('a,b\n"x"oops,2'), /textAfterQuote/u);
  assert.throws(() => parseCsvForEditing('x'.repeat(CSV_EDITOR_LIMITS.fileBytes + 1)), /tooLarge/u);
  assert.throws(() => parseCsvForEditing('a,b,c\n1,2,3', { limits: { ...CSV_EDITOR_LIMITS, columns: 2 } }), /tooManyColumns/u);
  assert.throws(() => parseCsvForEditing('a\n1\n2', { limits: { ...CSV_EDITOR_LIMITS, rows: 1 } }), /tooManyRows/u);
  assert.throws(() => parseCsvForEditing('a\n12345', { limits: { ...CSV_EDITOR_LIMITS, cellChars: 4 } }), /cellTooLong/u);
});

test('invalid edits and exports cannot exceed row, column, or cell bounds', () => {
  const table = parseCsvForEditing('a\n1');
  assert.throws(() => applyCsvEdit(table, { type: 'setCell', row: 4, column: 0, value: 'x' }), /invalidCell/u);
  assert.throws(() => applyCsvEdit(table, { type: 'deleteColumn', column: 0 }), /invalidColumn/u);
  assert.throws(() => serializeCsvForEditing(table, { delimiter: '\n' }), /invalidDelimiter/u);
});
