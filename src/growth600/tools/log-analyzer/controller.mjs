import { accessLogSummaryCsv, analyzeAccessLogs, LOG_MAX_BYTES } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="log-analyzer"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const results = root.querySelector('[data-log-results]');
  let currentAnalysis = null;
  const setText = (selector, value) => { root.querySelector(selector).textContent = String(value); };
  function table(selector, entries, key, keyLabel, captionText) {
    const target = root.querySelector(selector);
    target.replaceChildren();
    const caption = document.createElement('caption'); caption.textContent = captionText; target.append(caption);
    const head = document.createElement('thead'); const headerRow = document.createElement('tr');
    for (const label of [keyLabel, copy.fields.requests]) { const th = document.createElement('th'); th.scope = 'col'; th.textContent = label; headerRow.append(th); }
    head.append(headerRow); target.append(head);
    const body = document.createElement('tbody');
    for (const entry of entries) { const row = document.createElement('tr'); for (const value of [entry[key], entry.requests]) { const cell = document.createElement('td'); cell.textContent = String(value); row.append(cell); } body.append(row); }
    target.append(body);
  }
  function show(analysis) {
    currentAnalysis = analysis;
    for (const [key, selector] of Object.entries({ totalLines: '[data-total-lines]', parsedLines: '[data-parsed-lines]', invalidLines: '[data-invalid-lines]', matchedRequests: '[data-matched-requests]', transferredBytes: '[data-transferred-bytes]' })) setText(selector, analysis[key].toLocaleString());
    setText('[data-invalid-numbers]', analysis.invalidLineNumbers.length ? analysis.invalidLineNumbers.join(', ') : '—');
    table('[data-status-table]', analysis.byStatus, 'status', copy.fields.statusLabel, copy.fields.statusTable);
    table('[data-method-table]', analysis.byMethod, 'method', copy.fields.methodLabel, copy.fields.methodTable);
    table('[data-day-table]', analysis.byDay, 'day', copy.fields.dateLabel, copy.fields.dayTable);
    setText('[data-no-matches]', analysis.matchedRequests ? '' : copy.fields.noData);
    results.hidden = false;
  }
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    currentAnalysis = null; results.hidden = true;
    form.elements.namedItem('logs').value = [
      '192.0.2.10 - - [10/Oct/2026:08:10:00 +0000] "GET / HTTP/1.1" 200 125 "-" "Example browser"',
      '198.51.100.9 - - [10/Oct/2026:09:15:00 +0200] "GET /missing HTTP/1.1" 404 50 "-" "Example browser"',
      '203.0.113.7 - - [11/Oct/2026:00:01:00 -0700] "POST /submit HTTP/1.1" 503 - "-" "Example browser"',
      'This line is intentionally unsupported',
    ].join('\n');
    form.elements.namedItem('statusClass').value = 'all'; form.elements.namedItem('fromDate').value = ''; form.elements.namedItem('toDate').value = '';
    announce(root, '');
  });
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
      let text = form.elements.namedItem('logs').value;
      const file = form.elements.namedItem('file').files?.[0];
      if (file) {
        if (file.size > LOG_MAX_BYTES) throw new RangeError(copy.messages.fileTooLarge);
        text = await file.text();
      }
      const analysis = analyzeAccessLogs(text, { statusClass: form.elements.namedItem('statusClass').value, fromDate: form.elements.namedItem('fromDate').value, toDate: form.elements.namedItem('toDate').value });
      show(analysis);
      announce(root, analysis.matchedRequests ? copy.messages.analyzed : copy.messages.noMatches, 'success');
    } catch (error) {
      currentAnalysis = null; results.hidden = true;
      announce(root, error instanceof Error ? error.message : copy.messages.checkInput, 'error');
    }
  });
  const invalidateResults = () => { currentAnalysis = null; results.hidden = true; };
  form.addEventListener('input', invalidateResults);
  form.addEventListener('change', invalidateResults);
  root.querySelector('[data-action="export-csv"]')?.addEventListener('click', () => {
    if (!currentAnalysis) { announce(root, copy.messages.noAnalysis, 'error'); return; }
    const blob = new Blob([accessLogSummaryCsv(currentAnalysis)], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob); const anchor = document.createElement('a');
    anchor.href = url; anchor.download = 'access-log-summary.csv'; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1_000);
    announce(root, copy.messages.downloaded, 'success');
  });
  form.addEventListener('reset', () => { currentAnalysis = null; results.hidden = true; announce(root, ''); });
}
