import { announce, readToolCopy } from '../controller-helpers.mjs';
import { assertCsvSize, CSV_LIMITS, parseCsv } from './logic.mjs';

const root = document.querySelector('[data-tool="csv-to-pdf"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const fileInput = form.elements.namedItem('file');
  const result = root.querySelector('[data-result]');
  const preview = root.querySelector('[data-csv-preview]');
  const summary = root.querySelector('[data-csv-summary]');
  const previewNote = root.querySelector('[data-csv-preview-note]');
  const copy = readToolCopy(root);
  let tableData = null;
  let baseName = 'csv-table';

  function clearTable() {
    tableData = null;
    summary.textContent = '';
    previewNote.textContent = '';
    preview.tHead.replaceChildren();
    preview.tBodies[0]?.replaceChildren();
    result.hidden = true;
  }

  function renderTable(data) {
    tableData = data;
    const headRow = document.createElement('tr');
    for (const value of data.headers) {
      const cell = document.createElement('th');
      cell.scope = 'col';
      cell.textContent = value;
      headRow.append(cell);
    }
    preview.tHead.replaceChildren(headRow);
    const body = preview.tBodies[0] ?? preview.createTBody();
    body.replaceChildren();
    for (const row of data.rows.slice(0, CSV_LIMITS.previewRows)) {
      const tr = document.createElement('tr');
      for (const value of row) {
        const cell = document.createElement('td');
        cell.textContent = value;
        tr.append(cell);
      }
      body.append(tr);
    }
    summary.textContent = `${data.dataRows} ${copy.fields.resultCount} · ${data.columnCount} ${copy.fields.columnCount}`;
    previewNote.textContent = data.dataRows > CSV_LIMITS.previewRows ? `${copy.fields.previewLimit} ${CSV_LIMITS.previewRows}` : '';
    result.hidden = false;
    announce(root, copy.messages.ready, 'success');
  }

  function decodeBytes(buffer, encoding) {
    try {
      return new TextDecoder(encoding, { fatal: false }).decode(buffer);
    } catch {
      throw new TypeError('Choose a text encoding supported by this browser.');
    }
  }

  function getBaseName(name) {
    const base = name.replace(/\.csv$/iu, '').normalize('NFKC').replace(/[^\p{L}\p{N}_-]+/gu, '-').replace(/^-+|-+$/gu, '').slice(0, 80);
    return base || 'csv-table';
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearTable();
    const file = fileInput.files?.[0];
    if (!file) {
      announce(root, copy.messages.noFile, 'error');
      fileInput.focus();
      return;
    }
    if (!/\.csv$/iu.test(file.name)) {
      announce(root, copy.messages.invalidFile, 'error');
      fileInput.focus();
      return;
    }
    try {
      assertCsvSize(file.size);
      const text = decodeBytes(await file.arrayBuffer(), form.elements.encoding.value);
      const selectedDelimiter = form.elements.separator.value === 'tab' ? '\t' : form.elements.separator.value;
      tableData = parseCsv(text, { delimiter: selectedDelimiter, hasHeader: form.elements.hasHeader.checked });
      baseName = getBaseName(file.name);
      renderTable(tableData);
    } catch (error) {
      clearTable();
      announce(root, /5 MiB/u.test(error.message) ? copy.messages.fileTooLarge : copy.messages.invalidCsv, 'error');
    }
  });

  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    fileInput.value = '';
    form.elements.hasHeader.checked = true;
    form.elements.separator.value = 'auto';
    baseName = 'csv-example';
    try {
      renderTable(parseCsv('Item,Quantity,Note\nNotebook,2,"A5, ruled"\nPencil,3,"HB\nwooden"\nMarker,1,Blue'));
      announce(root, copy.messages.exampleLoaded, 'success');
    } catch {
      clearTable();
      announce(root, copy.messages.invalidCsv, 'error');
    }
  });

  form.addEventListener('reset', () => {
    setTimeout(() => {
      clearTable();
      baseName = 'csv-table';
      announce(root, '');
    }, 0);
  });

  root.querySelector('[data-action="print"]')?.addEventListener('click', () => {
    if (!tableData) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      announce(root, copy.messages.printBlocked, 'error');
      return;
    }
    const documentToPrint = printWindow.document;
    documentToPrint.documentElement.lang = document.documentElement.lang || 'en';
    const title = documentToPrint.createElement('title');
    title.textContent = baseName;
    const style = documentToPrint.createElement('style');
    const pageSize = form.elements.pageSize.value === 'letter' ? 'Letter' : 'A4';
    const orientation = form.elements.orientation.value === 'portrait' ? 'portrait' : 'landscape';
    const margin = form.elements.margin.value === 'narrow' ? '8mm' : '14mm';
    style.textContent = `@page{size:${pageSize} ${orientation};margin:${margin}}body{font:9pt/1.35 system-ui,sans-serif;color:#111}h1{font-size:16pt;margin:0 0 10mm}table{width:100%;border-collapse:collapse;table-layout:fixed}thead{display:table-header-group}tr{break-inside:avoid}th,td{border:1px solid #777;padding:3mm;text-align:start;vertical-align:top;overflow-wrap:anywhere;word-break:break-word}th{background:#eee}caption{text-align:start;margin-bottom:4mm}@media print{a{color:inherit}}`;
    documentToPrint.head.replaceChildren(title, style);
    const heading = documentToPrint.createElement('h1');
    heading.textContent = baseName;
    const table = documentToPrint.createElement('table');
    const caption = documentToPrint.createElement('caption');
    caption.textContent = copy.fields.tableLabel;
    table.append(caption);
    const thead = table.createTHead();
    const headerRow = documentToPrint.createElement('tr');
    for (const value of tableData.headers) {
      const th = documentToPrint.createElement('th');
      th.scope = 'col';
      th.textContent = value;
      headerRow.append(th);
    }
    thead.append(headerRow);
    const tbody = table.createTBody();
    for (const row of tableData.rows) {
      const tr = documentToPrint.createElement('tr');
      for (const value of row) {
        const td = documentToPrint.createElement('td');
        td.textContent = value;
        tr.append(td);
      }
      tbody.append(tr);
    }
    documentToPrint.body.replaceChildren(heading, table);
    printWindow.addEventListener('afterprint', () => printWindow.close(), { once: true });
    printWindow.focus();
    setTimeout(() => printWindow.print(), 100);
  });
}
