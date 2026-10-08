export const CSV_LIMITS = Object.freeze({ bytes: 5 * 1024 * 1024, rows: 2000, columns: 40, cells: 50000, previewRows: 100 });

function countFields(record, delimiter) {
  let count = 1;
  let quoted = false;
  for (let index = 0; index < record.length; index += 1) {
    if (record[index] === '"') {
      if (quoted && record[index + 1] === '"') index += 1;
      else quoted = !quoted;
    } else if (!quoted && record[index] === delimiter) count += 1;
  }
  return count;
}

export function detectCsvDelimiter(text) {
  const source = String(text ?? '').replace(/^\uFEFF/u, '').slice(0, 65536);
  const candidates = [',', ';', '\t', '|'];
  const scores = candidates.map((delimiter) => {
    const records = [];
    let start = 0;
    let quoted = false;
    for (let index = 0; index < source.length && records.length < 12; index += 1) {
      if (source[index] === '"') {
        if (quoted && source[index + 1] === '"') index += 1;
        else quoted = !quoted;
      } else if (!quoted && (source[index] === '\n' || source[index] === '\r')) {
        const record = source.slice(start, index);
        if (record.trim()) records.push(countFields(record, delimiter));
        if (source[index] === '\r' && source[index + 1] === '\n') index += 1;
        start = index + 1;
      }
    }
    if (start < source.length && records.length < 12 && source.slice(start).trim()) records.push(countFields(source.slice(start), delimiter));
    const average = records.length ? records.reduce((sum, count) => sum + count, 0) / records.length : 1;
    const consistency = records.length ? records.filter((count) => count === Math.round(average)).length / records.length : 0;
    return { delimiter, score: average > 1 ? (average - 1) * consistency : 0 };
  });
  return scores.sort((a, b) => b.score - a.score)[0]?.delimiter ?? ',';
}

export function parseCsv(text, { delimiter = 'auto', hasHeader = true, limits = CSV_LIMITS } = {}) {
  if (typeof text !== 'string' || !text.trim()) throw new TypeError('Choose a non-empty CSV file.');
  const source = text.replace(/^\uFEFF/u, '');
  const separator = delimiter === 'auto' ? detectCsvDelimiter(source) : delimiter;
  if (![',', ';', '\t', '|'].includes(separator)) throw new TypeError('Choose a supported separator.');
  const records = [];
  let row = [];
  let field = '';
  let quoted = false;
  let quoteClosed = false;
  let cells = 0;
  const pushField = () => {
    row.push(field);
    field = '';
    quoteClosed = false;
    cells += 1;
    if (row.length > limits.columns) throw new RangeError(`CSV contains more than ${limits.columns} columns.`);
    if (cells > limits.cells) throw new RangeError(`CSV contains more than ${limits.cells} cells.`);
  };
  const pushRow = () => {
    pushField();
    records.push(row);
    row = [];
    if (records.length > limits.rows + (hasHeader ? 1 : 0)) throw new RangeError(`CSV contains more than ${limits.rows} data rows.`);
  };

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (quoted) {
      if (char === '"' && source[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
        quoteClosed = true;
      } else field += char;
      continue;
    }
    if (char === '"') {
      if (field.length || quoteClosed) throw new TypeError('A quote appears inside an unquoted CSV field.');
      quoted = true;
    } else if (char === separator) pushField();
    else if (char === '\n' || char === '\r') {
      pushRow();
      if (char === '\r' && source[index + 1] === '\n') index += 1;
    } else if (quoteClosed) {
      if (char !== ' ' && char !== '\t') throw new TypeError('Unexpected text after a closing CSV quote.');
    } else field += char;
  }
  if (quoted) throw new TypeError('A quoted CSV field is missing its closing quote.');
  if (field.length || row.length || quoteClosed) pushRow();
  while (records.length && records.at(-1).every((value) => !value.trim())) records.pop();
  if (!records.length) throw new TypeError('The CSV file has no printable rows.');
  const width = Math.max(...records.map((record) => record.length));
  if (records.length * width > limits.cells) throw new RangeError(`CSV normalization would create more than ${limits.cells} cells.`);
  const normalized = records.map((record) => [...record, ...Array(Math.max(0, width - record.length)).fill('')]);
  const rawHeaders = hasHeader ? normalized.shift() : [];
  const headers = hasHeader
    ? rawHeaders.map((value, index) => value.trim() || `Column ${index + 1}`)
    : Array.from({ length: width }, (_, index) => `Column ${index + 1}`);
  const rows = hasHeader ? normalized : normalized;
  if (hasHeader && !headers.length) throw new TypeError('The CSV file has no columns.');
  return { headers, rows, delimiter: separator, dataRows: rows.length, columnCount: headers.length };
}

export function assertCsvSize(byteLength, limits = CSV_LIMITS) {
  if (!Number.isFinite(byteLength) || byteLength <= 0) throw new TypeError('Choose a non-empty CSV file.');
  if (byteLength > limits.bytes) throw new RangeError('The CSV file exceeds the 5 MiB local limit.');
  return true;
}
