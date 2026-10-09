import { announce, clearResult, readToolCopy } from '../controller-helpers.mjs';
import { exportJsonExcel, parseJsonForExcel, prepareJsonExcel } from './logic.mjs';

const root = document.querySelector('[data-tool="json-to-excel"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const input = form.elements.namedItem('jsonInput');
  const dataset = form.elements.namedItem('dataset');
  const result = root.querySelector('[data-result]');
  const head = root.querySelector('[data-json-excel-head]');
  const body = root.querySelector('[data-json-excel-body]');
  const counts = root.querySelector('[data-json-excel-count]');
  let prepared = null;
  let explicitDataset = false;

  function clear() {
    prepared = null;
    clearResult(root);
    head.replaceChildren(); body.replaceChildren(); counts.textContent = '';
  }

  function updateDatasets(options) {
    const validSelection = options.some(({ key }) => key === dataset.value);
    const selected = explicitDataset && validSelection ? dataset.value : (options.find(({ key }) => key !== '$root')?.key ?? '$root');
    dataset.replaceChildren();
    for (const option of options) {
      const item = document.createElement('option');
      item.value = option.key; item.textContent = `${option.key === '$root' ? copy.fields.rootObject : option.label} (${option.count})`;
      dataset.append(item);
    }
    dataset.value = selected;
  }

  function render(preview) {
    const headerRow = document.createElement('tr');
    for (const name of preview.headers.slice(0, 12)) {
      const cell = document.createElement('th'); cell.scope = 'col'; cell.textContent = name; headerRow.append(cell);
    }
    head.replaceChildren(headerRow);
    const rows = preview.rows.slice(1, 26).map((row) => {
      const tr = document.createElement('tr');
      for (const value of row.slice(0, 12)) { const cell = document.createElement('td'); cell.textContent = value == null ? '' : String(value); tr.append(cell); }
      return tr;
    });
    body.replaceChildren(...rows);
    counts.textContent = `${copy.fields.rowCount}: ${preview.recordCount} · ${copy.fields.columnCount}: ${preview.headers.length}`;
    result.hidden = false;
  }

  function previewJson() {
    clear(); announce(root, '');
    try {
      updateDatasets(parseJsonForExcel(input.value).map(({ key, label, records }) => ({ key, label, count: records.length })));
      prepared = prepareJsonExcel(input.value, dataset.value);
      render(prepared);
      announce(root, copy.messages.previewReady, 'success');
    } catch (error) {
      clear(); announce(root, copy.messages[error.message] ?? copy.messages.invalid, 'error');
    }
  }

  form.addEventListener('submit', (event) => { event.preventDefault(); previewJson(); });
  dataset.addEventListener('change', () => { explicitDataset = true; if (input.value.trim()) previewJson(); });
  input.addEventListener('input', () => { explicitDataset = false; clear(); });
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => { explicitDataset = false; input.value = copy.exampleJson; dataset.value = '$root'; previewJson(); });
  root.querySelector('[data-action="download"]')?.addEventListener('click', () => {
    if (!prepared) { announce(root, copy.messages.noPreview, 'error'); return; }
    try {
      const bytes = exportJsonExcel(prepared);
      const url = URL.createObjectURL(new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
      const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'json-data.xlsx'; anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      announce(root, copy.messages.downloaded, 'success');
    } catch (error) { announce(root, copy.messages[error.message] ?? copy.messages.invalid, 'error'); }
  });
  form.addEventListener('reset', () => queueMicrotask(() => { explicitDataset = false; clear(); dataset.replaceChildren(new Option(copy.fields.datasetHint, '$root')); announce(root, ''); }));
}
