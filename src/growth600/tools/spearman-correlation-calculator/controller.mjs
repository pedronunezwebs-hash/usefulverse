import { announce, clearResult, readToolCopy } from '../controller-helpers.mjs';
import { calculateSpearman } from './logic.mjs';

const root = document.querySelector('[data-tool="spearman-correlation-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const result = root.querySelector('[data-result]');
  const rhoOutput = root.querySelector('[data-result-rho]');
  const countOutput = root.querySelector('[data-result-count]');
  const tiesOutput = root.querySelector('[data-result-ties]');
  const content = root.querySelector('[data-result-content]');
  let calculation;
  let objectUrl;
  const format = (value) => new Intl.NumberFormat(document.documentElement.lang || 'en', { maximumSignificantDigits: 7 }).format(value);
  const csvCell = (value) => `"${String(value).replaceAll('"', '""')}"`;

  function clear() {
    clearResult(root);
    rhoOutput.textContent = '';
    countOutput.textContent = '';
    tiesOutput.textContent = '';
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
    for (const text of ['x', 'y', copy.fields.rankX, copy.fields.rankY]) {
      const cell = document.createElement('th');
      cell.scope = 'col';
      cell.textContent = text;
      headerRow.append(cell);
    }
    head.append(headerRow);
    const body = document.createElement('tbody');
    for (const pair of pairs) {
      const row = document.createElement('tr');
      for (const value of [pair.x, pair.y, pair.rankX, pair.rankY]) {
        const cell = document.createElement('td');
        cell.textContent = format(value);
        row.append(cell);
      }
      body.append(row);
    }
    table.append(caption, head, body);
    content.append(table);
  }

  function renderRankChart(pairs) {
    const namespace = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(namespace, 'svg');
    svg.classList.add('spearman-rank-chart');
    svg.setAttribute('viewBox', '0 0 320 220');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', copy.fields.chartLabel);
    const axis = document.createElementNS(namespace, 'path');
    axis.setAttribute('d', 'M 38 12 V 184 H 308');
    axis.setAttribute('fill', 'none');
    axis.setAttribute('stroke', 'currentColor');
    axis.setAttribute('stroke-width', '1.5');
    axis.setAttribute('aria-hidden', 'true');
    svg.append(axis);
    const maxRank = Math.max(pairs.length, 1);
    for (const pair of pairs) {
      const point = document.createElementNS(namespace, 'circle');
      point.setAttribute('cx', String(42 + ((pair.rankX - 0.5) / maxRank) * 260));
      point.setAttribute('cy', String(180 - ((pair.rankY - 0.5) / maxRank) * 160));
      point.setAttribute('r', pairs.length > 120 ? '2' : '3.5');
      point.setAttribute('fill', 'currentColor');
      point.setAttribute('aria-hidden', 'true');
      svg.append(point);
    }
    content.append(svg);
  }

  function calculate() {
    clear();
    try {
      calculation = calculateSpearman(form.elements.namedItem('pairs').value);
      rhoOutput.textContent = `${copy.fields.resultRho}: ${format(calculation.rho)}`;
      countOutput.textContent = `${copy.fields.resultCount}: ${format(calculation.count)}`;
      const hasTies = calculation.tiedX.length || calculation.tiedY.length;
      tiesOutput.textContent = hasTies ? copy.fields.tiesNote : '';
      renderRankChart(calculation.pairs);
      renderTable(calculation.pairs);
      result.hidden = false;
      announce(root, copy.messages.calculated, 'success');
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
      const rows = [[copy.fields.resultRho, calculation.rho], [copy.fields.resultCount, calculation.count], [], ['x', 'y', copy.fields.rankX, copy.fields.rankY], ...calculation.pairs.map(({ x, y, rankX, rankY }) => [x, y, rankX, rankY])];
      const csv = rows.map((row) => row.map(csvCell).join(',')).join('\r\n');
      const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' });
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = 'spearman-correlation-ranks.csv';
      link.click();
      announce(root, copy.messages.downloaded, 'success');
    } catch {
      announce(root, copy.messages.downloadUnavailable, 'error');
    }
  });
  window.addEventListener('pagehide', () => { if (objectUrl) URL.revokeObjectURL(objectUrl); }, { once: true });
}
