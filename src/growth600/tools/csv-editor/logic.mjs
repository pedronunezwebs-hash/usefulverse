export const CSV_EDITOR_LIMITS = Object.freeze({
  fileBytes: 5 * 1024 * 1024,
  rows: 5_000,
  columns: 80,
  cells: 80_000,
  cellChars: 20_000,
  history: 50,
});

const DELIMITERS = [',', ';', '\t', '|'];
const CELL_TYPES = ['text', 'number', 'date', 'boolean'];
function fail(code) { throw new Error(code); }
function byteLength(text) { return new TextEncoder().encode(text).byteLength; }

export function detectCsvEditorDelimiter(text) {
  const source = String(text).replace(/^\uFEFF/u, '');
  const sample = [];
  let quoted = false; let counts = Object.fromEntries(DELIMITERS.map((delimiter) => [delimiter, 0]));
  for (let index = 0; index < source.length && sample.length < 12; index += 1) {
    const char = source[index];
    if (char === '"') {
      if (quoted && source[index + 1] === '"') index += 1;
      else quoted = !quoted;
    } else if (!quoted && DELIMITERS.includes(char)) counts[char] += 1;
    else if (!quoted && (char === '\n' || char === '\r')) {
      if (Object.values(counts).some(Boolean)) sample.push(counts);
      counts = Object.fromEntries(DELIMITERS.map((delimiter) => [delimiter, 0]));
      if (char === '\r' && source[index + 1] === '\n') index += 1;
    }
  }
  if (Object.values(counts).some(Boolean) && sample.length < 12) sample.push(counts);
  if (!sample.length) return ',';
  const score = (delimiter) => {
    const values = sample.map((line) => line[delimiter]); const nonzero = values.filter((value) => value > 0);
    if (!nonzero.length) return 0;
    const average = nonzero.reduce((sum, value) => sum + value, 0) / nonzero.length;
    const consistency = nonzero.filter((value) => value === Math.round(average)).length / sample.length;
    return average * consistency;
  };
  return DELIMITERS.reduce((best, delimiter) => score(delimiter) > score(best) ? delimiter : best, ',');
}

export function parseCsvForEditing(text, { delimiter = 'auto', hasHeader = true, limits = CSV_EDITOR_LIMITS } = {}) {
  if (typeof text !== 'string' || !text.trim()) fail('emptyInput');
  if (byteLength(text) > limits.fileBytes) fail('tooLarge');
  const source = text.replace(/^\uFEFF/u, '');
  const separator = delimiter === 'auto' ? detectCsvEditorDelimiter(source) : delimiter;
  if (!DELIMITERS.includes(separator)) fail('invalidDelimiter');
  const records = []; let row = []; let field = ''; let quoted = false; let quoteClosed = false; let cells = 0;
  const pushField = () => {
    cells += 1; if (cells > limits.cells) fail('tooManyCells');
    row.push(field); field = ''; quoteClosed = false;
  };
  const pushRow = () => {
    pushField(); if (records.length >= limits.rows + (hasHeader ? 1 : 0)) fail('tooManyRows');
    records.push(row); row = [];
  };
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (quoted) {
      if (char === '"' && source[index + 1] === '"') { field += '"'; index += 1; }
      else if (char === '"') { quoted = false; quoteClosed = true; }
      else field += char;
      if (field.length > limits.cellChars) fail('cellTooLong');
      continue;
    }
    if (char === '"' && field.length === 0 && !quoteClosed) { quoted = true; continue; }
    if (char === '"' && field.length) fail('unexpectedQuote');
    if (char === separator) { pushField(); continue; }
    if (char === '\n' || char === '\r') {
      if (char === '\r' && source[index + 1] === '\n') index += 1;
      pushRow(); continue;
    }
    if (quoteClosed && /\s/u.test(char)) continue;
    if (quoteClosed) fail('textAfterQuote');
    field += char;
    if (field.length > limits.cellChars) fail('cellTooLong');
  }
  if (quoted) fail('unclosedQuote');
  if (field.length || row.length || (source.length && !/[\r\n]$/u.test(source))) pushRow();
  while (records.length && records.at(-1).every((value) => value === '')) records.pop();
  if (!records.length) fail('emptyInput');
  const width = Math.max(...records.map((record) => record.length));
  if (width > limits.columns) fail('tooManyColumns');
  const rectangular = records.map((record) => Array.from({ length: width }, (_, index) => record[index] ?? ''));
  const headers = hasHeader ? rectangular.shift() : Array.from({ length: width }, (_, index) => `Column ${index + 1}`);
  const rows = rectangular;
  if (rows.length > limits.rows || rows.length * width > limits.cells) fail('tooManyCells');
  return { headers, rows, columnTypes: Array(width).fill('text'), delimiter: separator, hasHeader: Boolean(hasHeader) };
}

function validTable(table) {
  if (!table || !Array.isArray(table.headers) || !Array.isArray(table.rows) || !Array.isArray(table.columnTypes) || table.columnTypes.length !== table.headers.length || !table.headers.length) fail('invalidTable');
  if (table.headers.length > CSV_EDITOR_LIMITS.columns || table.rows.length > CSV_EDITOR_LIMITS.rows || table.headers.length * table.rows.length > CSV_EDITOR_LIMITS.cells) fail('tooManyCells');
  if (table.columnTypes.some((type) => !CELL_TYPES.includes(type))) fail('invalidTable');
  if (table.headers.some((header) => typeof header !== 'string' || header.length > CSV_EDITOR_LIMITS.cellChars)
    || table.rows.some((row) => !Array.isArray(row) || row.length !== table.headers.length || row.some((cell) => typeof cell !== 'string' || cell.length > CSV_EDITOR_LIMITS.cellChars))) fail('invalidTable');
}

export function csvEditorCellMatchesType(value, type) {
  if (typeof value !== 'string' || !CELL_TYPES.includes(type)) fail('invalidCell');
  if (type === 'text' || value.trim() === '') return true;
  if (type === 'number') return /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/iu.test(value.trim()) && Number.isFinite(Number(value));
  if (type === 'boolean') return /^(?:true|false|0|1)$/iu.test(value.trim());
  if (type === 'date') {
    if (!/^\d{4}-\d{2}-\d{2}$/u.test(value)) return false;
    const date = new Date(`${value}T00:00:00.000Z`);
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }
  return false;
}

export function countCsvEditorTypeIssues(table) {
  validTable(table);
  return table.rows.reduce((count, row) => count + row.reduce((rowCount, value, column) => rowCount + (csvEditorCellMatchesType(value, table.columnTypes[column]) ? 0 : 1), 0), 0);
}

export function applyCsvEdit(table, edit) {
  validTable(table);
  if (!edit || typeof edit.type !== 'string') fail('invalidEdit');
  const next = { ...table, headers: [...table.headers], rows: table.rows.map((row) => [...row]) };
  let inverse;
  if (edit.type === 'setCell') {
    const { row, column, value } = edit;
    if (!Number.isInteger(row) || !next.rows[row] || !Number.isInteger(column) || column < 0 || column >= next.headers.length || typeof value !== 'string') fail('invalidCell');
    if (value.length > CSV_EDITOR_LIMITS.cellChars) fail('cellTooLong');
    inverse = { type: 'setCell', row, column, value: next.rows[row][column] }; next.rows[row][column] = value;
  } else if (edit.type === 'setHeader') {
    const { column, value } = edit;
    if (!Number.isInteger(column) || column < 0 || column >= next.headers.length || typeof value !== 'string') fail('invalidColumn');
    if (value.length > CSV_EDITOR_LIMITS.cellChars) fail('cellTooLong');
    inverse = { type: 'setHeader', column, value: next.headers[column] }; next.headers[column] = value;
  } else if (edit.type === 'appendRow') {
    if (next.rows.length >= CSV_EDITOR_LIMITS.rows || next.rows.length * next.headers.length >= CSV_EDITOR_LIMITS.cells) fail('tooManyRows');
    const row = Array.isArray(edit.row) ? [...edit.row] : Array(next.headers.length).fill('');
    if (row.length !== next.headers.length || row.some((cell) => typeof cell !== 'string' || cell.length > CSV_EDITOR_LIMITS.cellChars)) fail('invalidRow');
    next.rows.push(row); inverse = { type: 'deleteRow', row: next.rows.length - 1 };
  } else if (edit.type === 'insertRow') {
    if (next.rows.length >= CSV_EDITOR_LIMITS.rows || next.rows.length * next.headers.length >= CSV_EDITOR_LIMITS.cells) fail('tooManyRows');
    if (!Number.isInteger(edit.row) || edit.row < 0 || edit.row > next.rows.length || !Array.isArray(edit.values) || edit.values.length !== next.headers.length || edit.values.some((cell) => typeof cell !== 'string')) fail('invalidRow');
    next.rows.splice(edit.row, 0, [...edit.values]); inverse = { type: 'deleteRow', row: edit.row };
  } else if (edit.type === 'deleteRow') {
    if (!Number.isInteger(edit.row) || edit.row < 0 || edit.row >= next.rows.length) fail('invalidRow');
    const [values] = next.rows.splice(edit.row, 1); inverse = { type: 'insertRow', row: edit.row, values };
  } else if (edit.type === 'appendColumn') {
    if (next.headers.length >= CSV_EDITOR_LIMITS.columns || next.headers.length * Math.max(1, next.rows.length) >= CSV_EDITOR_LIMITS.cells) fail('tooManyColumns');
    next.headers.push(typeof edit.header === 'string' ? edit.header : `Column ${next.headers.length + 1}`);
    next.columnTypes.push('text'); next.rows.forEach((row) => row.push('')); inverse = { type: 'deleteColumn', column: next.headers.length - 1 };
  } else if (edit.type === 'insertColumn') {
    if (next.headers.length >= CSV_EDITOR_LIMITS.columns || next.headers.length * Math.max(1, next.rows.length) >= CSV_EDITOR_LIMITS.cells) fail('tooManyColumns');
    const columnType = edit.columnType ?? 'text';
    if (!Number.isInteger(edit.column) || edit.column < 0 || edit.column > next.headers.length || typeof edit.header !== 'string' || edit.header.length > CSV_EDITOR_LIMITS.cellChars || !CELL_TYPES.includes(columnType) || !Array.isArray(edit.values) || edit.values.length !== next.rows.length || edit.values.some((cell) => typeof cell !== 'string' || cell.length > CSV_EDITOR_LIMITS.cellChars)) fail('invalidColumn');
    next.headers.splice(edit.column, 0, edit.header); next.columnTypes.splice(edit.column, 0, columnType); next.rows.forEach((row, index) => row.splice(edit.column, 0, edit.values[index]));
    inverse = { type: 'deleteColumn', column: edit.column };
  } else if (edit.type === 'deleteColumn') {
    if (next.headers.length <= 1 || !Number.isInteger(edit.column) || edit.column < 0 || edit.column >= next.headers.length) fail('invalidColumn');
    const header = next.headers.splice(edit.column, 1)[0]; const columnType = next.columnTypes.splice(edit.column, 1)[0]; const values = next.rows.map((row) => row.splice(edit.column, 1)[0]);
    inverse = { type: 'insertColumn', column: edit.column, header, columnType, values };
  } else if (edit.type === 'setColumnType') {
    const { column, value } = edit;
    if (!Number.isInteger(column) || column < 0 || column >= next.headers.length || !CELL_TYPES.includes(value)) fail('invalidColumn');
    inverse = { type: 'setColumnType', column, value: next.columnTypes[column] }; next.columnTypes[column] = value;
  } else if (edit.type === 'setHeaderMode') {
    inverse = { type: 'setHeaderMode', value: Boolean(next.hasHeader) }; next.hasHeader = Boolean(edit.value);
  } else fail('invalidEdit');
  validTable(next);
  return { table: next, inverse };
}

export function serializeCsvForEditing(table, { delimiter = table?.delimiter, bom = false } = {}) {
  validTable(table);
  if (!DELIMITERS.includes(delimiter)) fail('invalidDelimiter');
  const quote = (value) => {
    const text = String(value);
    return text.includes('"') || text.includes(delimiter) || /[\r\n]/u.test(text) || /^\s|\s$/u.test(text)
      ? `"${text.replaceAll('"', '""')}"` : text;
  };
  const records = [...(table.hasHeader ? [table.headers] : []), ...table.rows];
  const output = records.map((row) => row.map(quote).join(delimiter)).join('\r\n');
  return `${bom ? '\uFEFF' : ''}${output}`;
}
