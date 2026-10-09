import { announce, clearResult, readToolCopy } from '../controller-helpers.mjs';
import { calculateWilcoxonSignedRank } from './logic.mjs';

const root = document.querySelector('[data-tool="wilcoxon-signed-rank-test-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const result = root.querySelector('[data-result]');
  const outputs = Object.fromEntries(['status', 'count', 'zero', 'ties', 'positive', 'negative', 'p', 'method'].map((key) => [key, root.querySelector(`[data-result-${key}]`)]));
  const content = root.querySelector('[data-result-content]');
  let calculation;
  let objectUrl;
  const format = (value) => value === null || value === undefined ? '—' : new Intl.NumberFormat(document.documentElement.lang || 'en', { maximumSignificantDigits: 7 }).format(value);
  const csvCell = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;

  function clear() {
    clearResult(root);
    for (const output of Object.values(outputs)) output.textContent = '';
    content.replaceChildren();
    calculation = undefined;
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = undefined;
  }

  function renderTable(pairs) {
    const table = document.createElement('table');
    table.className = 'spearman-result-table';
    table.setAttribute('aria-label', copy.fields.resultTable);
    const caption = document.createElement('caption');
    caption.textContent = copy.fields.resultTable;
    const head = document.createElement('thead');
    const headerRow = document.createElement('tr');
    for (const label of [copy.fields.before, copy.fields.after, copy.fields.difference, copy.fields.absoluteRank, copy.fields.signedRank]) {
      const cell = document.createElement('th');
      cell.scope = 'col';
      cell.textContent = label;
      headerRow.append(cell);
    }
    head.append(headerRow);
    const body = document.createElement('tbody');
    for (const pair of pairs) {
      const row = document.createElement('tr');
      for (const value of [pair.before, pair.after, pair.difference, pair.absoluteRank, pair.signedRank]) {
        const cell = document.createElement('td');
        cell.textContent = format(value);
        row.append(cell);
      }
      body.append(row);
    }
    table.append(caption, head, body);
    const scroller = document.createElement('div');
    scroller.className = 'wilcoxon-result-scroll';
    scroller.append(table);
    content.append(scroller);
  }

  function calculate() {
    clear();
    try {
      calculation = calculateWilcoxonSignedRank(form.elements.namedItem('pairs').value);
      outputs.status.textContent = calculation.status === 'all-zero' ? copy.messages.allZero : copy.fields.resultStatus;
      outputs.count.textContent = `${copy.fields.resultCount}: ${format(calculation.count)} (${format(calculation.nonzeroCount)} ${copy.fields.nonzeroLabel})`;
      outputs.zero.textContent = `${copy.fields.zeroCount}: ${format(calculation.zeroDifferenceCount)}`;
      outputs.ties.textContent = `${copy.fields.tiedCount}: ${format(calculation.tiedGroups?.length ?? 0)}`;
      outputs.positive.textContent = `${copy.fields.positiveRankSum}: ${format(calculation.positiveRankSum)}`;
      outputs.negative.textContent = `${copy.fields.negativeRankSum}: ${format(calculation.negativeRankSum)}`;
      outputs.p.textContent = calculation.pValue === null ? '' : `${copy.fields.pValue}: ${format(calculation.pValue)}`;
      const methodCopy = { exact: copy.fields.methodExact, approximation: copy.fields.methodApproximation, unavailable: copy.fields.methodNotAvailable };
      outputs.method.textContent = methodCopy[calculation.methodKey] ?? calculation.method;
      renderTable(calculation.pairs ?? []);
      result.hidden = false;
      announce(root, calculation.status === 'all-zero' ? copy.messages.allZero : copy.messages.calculated, calculation.status === 'all-zero' ? 'info' : 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  form.addEventListener('submit', (event) => { event.preventDefault(); calculate(); });
  form.addEventListener('input', () => { clear(); announce(root, ''); });
  form.addEventListener('reset', () => queueMicrotask(() => { clear(); announce(root, ''); }));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    form.elements.namedItem('pairs').value = copy.examplePairs;
    calculate();
    announce(root, copy.messages.exampleLoaded, 'success');
  });
  root.querySelector('[data-action="downloadCsv"]')?.addEventListener('click', () => {
    if (!calculation) return announce(root, copy.messages.checkInputs, 'error');
    try {
      const rows = [
        [copy.fields.resultCount, calculation.count],
        [copy.fields.zeroCount, calculation.zeroDifferenceCount],
        [copy.fields.positiveRankSum, calculation.positiveRankSum],
        [copy.fields.negativeRankSum, calculation.negativeRankSum],
        [copy.fields.pValue, calculation.pValue ?? copy.messages.allZero],
        [copy.fields.method, methodCopy[calculation.methodKey] ?? calculation.method],
        [],
        [copy.fields.before, copy.fields.after, copy.fields.difference, copy.fields.absoluteRank, copy.fields.signedRank],
        ...(calculation.pairs ?? []).map(({ before, after, difference, absoluteRank, signedRank }) => [before, after, difference, absoluteRank, signedRank]),
      ];
      const csv = rows.map((row) => row.map(csvCell).join(',')).join('\r\n');
      const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' });
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = 'wilcoxon-signed-rank-results.csv';
      link.click();
      announce(root, copy.messages.downloaded, 'success');
    } catch {
      announce(root, copy.messages.downloadUnavailable, 'error');
    }
  });
  window.addEventListener('pagehide', () => { if (objectUrl) URL.revokeObjectURL(objectUrl); }, { once: true });
}
