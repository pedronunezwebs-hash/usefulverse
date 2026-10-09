import { createXlsx } from '../../../pdf-office.mjs';

export const JSON_EXCEL_LIMITS = Object.freeze({ inputBytes: 2_000_000, nodes: 50_000, depth: 32, rows: 20_000, columns: 200, cells: 200_000, valueChars: 32_000, workbookBytes: 12 * 1024 * 1024 });

function fail(code) { throw new Error(code); }
function plainObject(value) { return value !== null && typeof value === 'object' && !Array.isArray(value); }

function inspectValueTree(root) {
  const stack = [{ value: root, depth: 0 }]; let nodes = 0;
  while (stack.length) {
    const { value, depth } = stack.pop();
    nodes += 1;
    if (nodes > JSON_EXCEL_LIMITS.nodes) fail('tooManyValues');
    if (depth > JSON_EXCEL_LIMITS.depth) fail('tooDeep');
    if (Array.isArray(value)) {
      if (value.length > JSON_EXCEL_LIMITS.rows) fail('tooManyRows');
      for (const item of value) stack.push({ value: item, depth: depth + 1 });
    } else if (plainObject(value)) {
      for (const item of Object.values(value)) stack.push({ value: item, depth: depth + 1 });
    }
  }
}

export function parseJsonForExcel(text) {
  if (typeof text !== 'string' || !text.trim()) fail('emptyInput');
  if (new TextEncoder().encode(text).byteLength > JSON_EXCEL_LIMITS.inputBytes) fail('tooLarge');
  let value;
  try { value = JSON.parse(text); } catch { fail('invalidJson'); }
  inspectValueTree(value);
  const datasets = Array.isArray(value)
    ? [{ key: '$root', label: 'JSON array', records: value }]
    : plainObject(value)
      ? [{ key: '$root', label: 'Root object (one row)', records: [value] }, ...Object.entries(value).filter(([, child]) => Array.isArray(child)).map(([key, records]) => ({ key, label: key, records }))]
      : [{ key: '$root', label: 'JSON value (one row)', records: [{ Value: value }] }];
  if (!datasets.length) fail('noData');
  return datasets;
}

function escapePathSegment(value) { return value.replaceAll('\\', '\\\\').replaceAll('.', '\\.'); }
function cellValue(value) {
  if (value === null) return 'null';
  if (Array.isArray(value) || plainObject(value)) return JSON.stringify(value);
  if (typeof value === 'number' && !Number.isFinite(value)) fail('invalidNumber');
  return value;
}

function flattenRecord(record) {
  if (!plainObject(record)) return new Map([['Value', cellValue(record)]]);
  const output = new Map(); const stack = Object.entries(record).reverse().map(([key, value]) => ({ key: escapePathSegment(key), value, depth: 1 }));
  while (stack.length) {
    const item = stack.pop();
    if (item.depth > JSON_EXCEL_LIMITS.depth) fail('tooDeep');
    if (plainObject(item.value) && Object.keys(item.value).length) {
      const children = Object.entries(item.value).reverse();
      for (const [key, value] of children) stack.push({ key: `${item.key}.${escapePathSegment(key)}`, value, depth: item.depth + 1 });
      continue;
    }
    const value = plainObject(item.value) ? '{}' : cellValue(item.value);
    if (typeof value === 'string' && value.length > JSON_EXCEL_LIMITS.valueChars) fail('valueTooLong');
    output.set(item.key || 'Value', value);
  }
  if (!output.size) output.set('Value', '{}');
  return output;
}

export function prepareJsonExcel(text, datasetKey = '$root') {
  const datasets = parseJsonForExcel(text); const selected = datasets.find((dataset) => dataset.key === datasetKey);
  if (!selected) fail('invalidDataset');
  const records = selected.records.length ? selected.records : [];
  if (!records.length) fail('emptyDataset');
  const flattened = records.map(flattenRecord); const headers = [...new Set(flattened.flatMap((record) => [...record.keys()]))];
  if (headers.length > JSON_EXCEL_LIMITS.columns) fail('tooManyColumns');
  if ((flattened.length + 1) * headers.length > JSON_EXCEL_LIMITS.cells) fail('tooManyCells');
  const rows = [headers, ...flattened.map((record) => headers.map((header) => record.has(header) ? record.get(header) : ''))];
  return { dataset: selected.label, headers, rows, recordCount: records.length, datasetOptions: datasets.map(({ key, label, records: rowsForOption }) => ({ key, label, count: rowsForOption.length })) };
}

export function exportJsonExcel(prepared, sheetName = 'JSON data') {
  if (!prepared || !Array.isArray(prepared.rows)) fail('noPreview');
  const bytes = createXlsx(prepared.rows, sheetName, { preserveStrings: true });
  if (bytes.byteLength > JSON_EXCEL_LIMITS.workbookBytes) fail('workbookTooLarge');
  return bytes;
}
