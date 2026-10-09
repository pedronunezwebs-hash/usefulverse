import { announce, clearResult, copyText, readToolCopy } from '../controller-helpers.mjs';
import { applyCsvEdit, countCsvEditorTypeIssues, csvEditorCellMatchesType, CSV_EDITOR_LIMITS, parseCsvForEditing, serializeCsvForEditing } from './logic.mjs';

const root = document.querySelector('[data-tool="csv-editor"]');
if (root) {
  const form = root.querySelector('#tool-form'); const copy = readToolCopy(root);
  const fileField = form.elements.namedItem('csvFile'); const textField = form.elements.namedItem('csvText');
  const delimiterField = form.elements.namedItem('delimiter'); const headerField = form.elements.namedItem('hasHeader');
  const searchField = form.elements.namedItem('search'); const exportDelimiterField = form.elements.namedItem('exportDelimiter');
  const bomField = form.elements.namedItem('bom'); const body = root.querySelector('[data-csv-body]'); const head = root.querySelector('[data-csv-head]');
  const summary = root.querySelector('[data-csv-summary]'); const pageLabel = root.querySelector('[data-csv-page]'); const empty = root.querySelector('[data-csv-empty]');
  const PAGE_SIZE = 25; let table = null; let page = 0; let undo = []; let redo = []; let typeIssues = 0;
  const message = (key) => copy.messages[key] ?? copy.messages.invalid;
  const element = (tag, text, className) => { const node = document.createElement(tag); if (text !== undefined) node.textContent = text; if (className) node.className = className; return node; };

  function rowsMatching() {
    const query = searchField.value.trim().toLocaleLowerCase();
    return table.rows.map((row, index) => ({ row, index })).filter(({ row }) => !query || row.some((value) => value.toLocaleLowerCase().includes(query)));
  }
  function announceSummary(filtered) {
    summary.textContent = `${copy.fields.rowsSummary}: ${table.rows.length} · ${copy.fields.columnsSummary}: ${table.headers.length} · ${copy.fields.filteredSummary}: ${filtered.length} · ${copy.fields.typeSummary}: ${typeIssues}`;
  }
  function render() {
    if (!table) return;
    const matching = rowsMatching(); const pageCount = Math.max(1, Math.ceil(matching.length / PAGE_SIZE)); page = Math.min(page, pageCount - 1);
    head.replaceChildren(); body.replaceChildren(); announceSummary(matching);
    const headerRow = element('tr');
    table.headers.forEach((value, column) => {
      const cell = element('th'); cell.scope = 'col';
      const input = element('input'); input.type = 'text'; input.name = `headers[${column}]`; input.value = value; input.maxLength = CSV_EDITOR_LIMITS.cellChars;
      input.setAttribute('aria-label', `${copy.fields.column} ${column + 1}`);
      input.addEventListener('change', () => edit({ type: 'setHeader', column, value: input.value }));
      const type = element('select'); type.name = `columnTypes[${column}]`; type.setAttribute('aria-label', `${copy.fields.columnType}: ${value || `${copy.fields.column} ${column + 1}`}`);
      for (const [key, label] of [['text', copy.fields.textType], ['number', copy.fields.numberType], ['date', copy.fields.dateType], ['boolean', copy.fields.booleanType]]) {
        const option = element('option', label); option.value = key; option.selected = table.columnTypes[column] === key; type.append(option);
      }
      type.addEventListener('change', () => edit({ type: 'setColumnType', column, value: type.value }));
      const remove = element('button', copy.actions.deleteColumn, 'button button--secondary'); remove.type = 'button'; remove.disabled = table.headers.length <= 1; remove.dataset.action = 'deleteColumn'; remove.dataset.column = String(column);
      cell.append(input, type, remove); headerRow.append(cell);
    });
    const rowHeader = element('th', copy.fields.row); rowHeader.scope = 'col'; headerRow.append(rowHeader); head.append(headerRow);
    const shown = matching.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
    for (const { row, index } of shown) {
      const tr = element('tr');
      row.forEach((value, column) => {
        const td = element('td'); const input = element('input'); input.type = 'text'; input.name = `cells[${index}][${column}]`; input.value = value; input.maxLength = CSV_EDITOR_LIMITS.cellChars;
        const mismatched = !csvEditorCellMatchesType(value, table.columnTypes[column]);
        input.setAttribute('aria-label', `${copy.fields.row} ${index + 1}, ${table.headers[column] || `${copy.fields.column} ${column + 1}`}${mismatched ? `, ${copy.fields.typeSummary}` : ''}`);
        input.setAttribute('aria-describedby', 'csv-type-hint');
        if (mismatched) { input.setAttribute('aria-invalid', 'true'); input.title = copy.fields.typeHint; }
        input.addEventListener('change', () => edit({ type: 'setCell', row: index, column, value: input.value })); td.append(input); tr.append(td);
      });
      const actionCell = element('td'); const remove = element('button', copy.actions.deleteRow, 'button button--secondary'); remove.type = 'button'; remove.dataset.action = 'deleteRow'; remove.dataset.row = String(index); actionCell.append(remove); tr.append(actionCell); body.append(tr);
    }
    empty.hidden = matching.length > 0; pageLabel.textContent = `${copy.fields.page} ${page + 1} ${copy.fields.of} ${pageCount}`;
    root.querySelector('[data-action="previous"]').disabled = page === 0;
    root.querySelector('[data-action="next"]').disabled = page >= pageCount - 1;
    root.querySelector('[data-action="undo"]').disabled = undo.length === 0;
    root.querySelector('[data-action="redo"]').disabled = redo.length === 0;
  }
  function record(entry) { undo.push(entry); if (undo.length > CSV_EDITOR_LIMITS.history) undo.shift(); redo = []; }
  function edit(change) {
    try { const result = applyCsvEdit(table, change); table = result.table; typeIssues = countCsvEditorTypeIssues(table); record(result.inverse); render(); announce(root, ''); }
    catch (error) { announce(root, message(error.message), 'error'); }
  }
  function clear() {
    table = null; page = 0; undo = []; redo = []; typeIssues = 0; fileField.value = ''; textField.value = ''; searchField.value = '';
    root.querySelector('[data-result]').hidden = true; head.replaceChildren(); body.replaceChildren(); clearResult(root); announce(root, '');
  }
  function loadCsv(text) {
    table = parseCsvForEditing(text, { delimiter: delimiterField.value, hasHeader: headerField.checked });
    undo = []; redo = []; page = 0; typeIssues = countCsvEditorTypeIssues(table); searchField.value = ''; exportDelimiterField.value = table.delimiter;
    root.querySelector('[data-result]').hidden = false; render(); announce(root, message('loaded'), 'success');
  }
  function exportText() { return serializeCsvForEditing(table, { delimiter: exportDelimiterField.value, bom: bomField.checked }); }

  form.addEventListener('submit', async (event) => {
    event.preventDefault(); announce(root, '');
    try {
      const file = fileField.files?.[0];
      if (file) {
        if (file.size > CSV_EDITOR_LIMITS.fileBytes) throw new Error('tooLarge');
        let text;
        try { text = await file.text(); } catch { throw new Error('fileReadError'); }
        loadCsv(text);
      } else loadCsv(textField.value);
    } catch (error) {
      const key = ['emptyInput', 'tooLarge', 'tooManyRows', 'tooManyColumns', 'tooManyCells', 'cellTooLong', 'invalidDelimiter', 'unclosedQuote', 'unexpectedQuote', 'textAfterQuote', 'fileReadError'].includes(error.message) ? error.message : 'invalid';
      announce(root, message(key), 'error');
    }
  });
  searchField.addEventListener('input', () => { page = 0; render(); });
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    fileField.value = ''; textField.value = 'Name,Notes,Score\r\nAda,"Says ""hello"", then\nleaves",9\r\nLin,"Comma, and newline\ninside a quoted cell",8';
    delimiterField.value = 'auto'; headerField.checked = true; loadCsv(textField.value);
  });
  root.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]'); if (!button || button.disabled || !table) return;
    const action = button.dataset.action;
    if (action === 'addRow') edit({ type: 'appendRow' });
    else if (action === 'addColumn') edit({ type: 'appendColumn', header: `${copy.fields.column} ${table.headers.length + 1}` });
    else if (action === 'deleteRow') edit({ type: 'deleteRow', row: Number(button.dataset.row) });
    else if (action === 'deleteColumn') edit({ type: 'deleteColumn', column: Number(button.dataset.column) });
    else if (action === 'previous') { page = Math.max(0, page - 1); render(); }
    else if (action === 'next') { page += 1; render(); }
    else if (action === 'undo' && undo.length) { const change = undo.pop(); const result = applyCsvEdit(table, change); table = result.table; typeIssues = countCsvEditorTypeIssues(table); redo.push(result.inverse); render(); }
    else if (action === 'redo' && redo.length) { const change = redo.pop(); const result = applyCsvEdit(table, change); table = result.table; typeIssues = countCsvEditorTypeIssues(table); undo.push(result.inverse); render(); }
    else if (action === 'copy') { try { copyText(root, exportText(), copy); } catch { announce(root, message('invalid'), 'error'); } }
    else if (action === 'export') {
      try { const url = URL.createObjectURL(new Blob([exportText()], { type: 'text/csv;charset=utf-8' })); const link = element('a'); link.href = url; link.download = 'csv-edited.csv'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); announce(root, message('exported'), 'success'); }
      catch { announce(root, message('invalid'), 'error'); }
    }
  });
  form.addEventListener('reset', () => queueMicrotask(clear));
}
