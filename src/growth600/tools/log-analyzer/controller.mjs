import { announce } from '../controller-helpers.mjs';
import { accessLogRowsToCsv, analyzeAccessLog, filterAccessLogRows, LOG_ANALYZER_MAX_BYTES } from './logic.mjs';

const root = document.querySelector('[data-tool="log-analyzer"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]').textContent);
  const fields = copy.fields;
  const actions = copy.actions;
  const messages = copy.messages;
  const fileInput = root.querySelector('#log-file');
  const textInput = root.querySelector('#log-paste');
  const results = root.querySelector('[data-log-results]');
  const select = (selector) => root.querySelector(selector);
  let analysis = null;

  function localizeNumber(value) { return new Intl.NumberFormat(copy.copyLanguage).format(value); }
  function addOption(selectElement, value, label) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    selectElement.append(option);
  }

  function renderBreakdown(target, pairs) {
    target.replaceChildren();
    const max = Math.max(1, ...pairs.map(([, count]) => count));
    for (const [label, count] of pairs.slice(0, 10)) {
      const row = document.createElement('div');
      row.className = 'log-analyzer__bar-row';
      const caption = document.createElement('span'); caption.textContent = String(label);
      const bar = document.createElement('span'); bar.className = 'log-analyzer__bar'; bar.setAttribute('aria-hidden', 'true');
      const fill = document.createElement('span'); fill.style.width = `${Math.max(2, Math.min(100, count / max * 100))}%`; bar.append(fill);
      const total = document.createElement('strong'); total.textContent = localizeNumber(count);
      row.append(caption, bar, total); target.append(row);
    }
    if (!pairs.length) { const empty = document.createElement('p'); empty.textContent = '—'; target.append(empty); }
  }

  function getFilteredRows() {
    const value = (name) => select(`[data-filter="${name}"]`).value;
    return filterAccessLogRows(analysis?.rows ?? [], { search: value('search'), status: value('status'), method: value('method'), from: value('from'), to: value('to') });
  }

  function renderRows() {
    if (!analysis) return;
    const filtered = getFilteredRows();
    const body = select('[data-log-rows]'); body.replaceChildren();
    for (const row of filtered.slice(0, 200)) {
      const tr = document.createElement('tr');
      for (const value of [row.date.toISOString(), row.method, row.path, row.status, localizeNumber(row.bytes)]) {
        const cell = document.createElement('td'); cell.textContent = String(value); tr.append(cell);
      }
      body.append(tr);
    }
    select('[data-log-shown]').textContent = fields.shown.replace('{count}', localizeNumber(Math.min(filtered.length, 200))).replace('{total}', localizeNumber(filtered.length));
    if (filtered.length === 0) { const tr = document.createElement('tr'); const cell = document.createElement('td'); cell.colSpan = 5; cell.textContent = fields.noMatches; tr.append(cell); body.append(tr); }
    return filtered;
  }

  function populateFilters() {
    const statuses = select('#log-status-filter'); const methods = select('#log-method-filter');
    statuses.replaceChildren(); methods.replaceChildren();
    addOption(statuses, 'all', fields.all); addOption(methods, 'all', fields.all);
    for (const [status] of analysis.statusCounts) addOption(statuses, String(status), String(status));
    for (const [method] of analysis.methodCounts) addOption(methods, method, method);
  }

  function renderAnalysis() {
    select('[data-log-summary]').replaceChildren();
    const summary = [
      [fields.totalRequests, analysis.validLines], [fields.invalidLines, analysis.invalidLines],
      [fields.transferred, analysis.transferredBytes],
    ];
    for (const [label, number] of summary) {
      const card = document.createElement('div'); card.className = 'log-analyzer__stat';
      const caption = document.createElement('span'); caption.textContent = label;
      const value = document.createElement('strong'); value.textContent = localizeNumber(number);
      card.append(caption, value); select('[data-log-summary]').append(card);
    }
    const invalid = select('[data-log-invalid]');
    invalid.hidden = analysis.invalidLines === 0;
    invalid.textContent = analysis.invalidLines ? `${fields.invalidLines}: ${localizeNumber(analysis.invalidLines)}. ${messages.invalidDetails}` : '';
    renderBreakdown(select('[data-log-statuses]'), analysis.statusCounts);
    renderBreakdown(select('[data-log-methods]'), analysis.methodCounts);
    renderBreakdown(select('[data-log-paths]'), analysis.topPaths);
    renderBreakdown(select('[data-log-days]'), analysis.dailyCounts);
    populateFilters();
    results.hidden = false;
    renderRows();
  }

  async function readInput() {
    if (fileInput.files?.length) {
      const file = fileInput.files[0];
      if (file.size > LOG_ANALYZER_MAX_BYTES) throw new RangeError(messages.fileTooLarge);
      return file.text();
    }
    return textInput.value;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
      const text = await readInput();
      const next = analyzeAccessLog(text);
      if (next.validLines === 0) { analysis = null; results.hidden = true; announce(root, messages.noRows, 'error'); return; }
      analysis = next;
      renderAnalysis();
      announce(root, messages.analyzed, 'success');
    } catch (error) {
      announce(root, error instanceof RangeError ? (error.message.includes('line') ? messages.tooManyLines : messages.fileTooLarge) : messages.readError, 'error');
    }
  });

  root.querySelector('[data-action="example"]').addEventListener('click', () => {
    fileInput.value = '';
    textInput.value = [
      '203.0.113.10 - - [10/Oct/2000:13:55:36 -0700] "GET /index.html?campaign=x HTTP/1.1" 200 2326 "example.test/" "Mozilla/5.0"',
      '2001:db8::1 - - [11/Oct/2000:14:00:00 +0000] "POST /api/items HTTP/2" 404 0 "-" "Test Agent"',
      '192.0.2.4 - - [11/Oct/2000:14:05:00 +0000] "GET /index.html HTTP/1.1" 200 - "-" "Test Agent"',
      '198.51.100.7 - - [11/Oct/2000:14:10:00 +0000] "GET /docs?secret=removed-from-summary HTTP/1.1" 200 750 "-" "Example"',
      '198.51.100.8 - - [12/Oct/2000:09:00:00 +0000] "GET /missing HTTP/1.1" 500 1053 "-" "Example"',
      'This example line is intentionally invalid',
    ].join('\n');
    textInput.focus(); announce(root, messages.exampleLoaded, 'success');
  });

  for (const control of root.querySelectorAll('[data-filter]')) control.addEventListener('input', renderRows);
  root.querySelector('[data-action="export"]').addEventListener('click', () => {
    if (!analysis) return;
    const csv = accessLogRowsToCsv(getFilteredRows(), { includeClientIp: select('[data-log-include-ip]').checked });
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'usefulverse-access-log-analysis.csv'; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 0); announce(root, messages.exported, 'success');
  });

  root.querySelector('[data-action="clear"]').addEventListener('click', () => {
    analysis = null; form.reset(); results.hidden = true; select('[data-log-summary]').replaceChildren();
    announce(root, messages.cleared, 'info');
  });
  root.querySelector('[data-action="reset"]').addEventListener('click', () => {
    for (const control of root.querySelectorAll('[data-filter]')) control.value = control.type === 'date' ? '' : 'all';
    const search = select('[data-filter="search"]'); search.value = '';
    renderRows(); announce(root, messages.filtersReset, 'info');
  });
}
