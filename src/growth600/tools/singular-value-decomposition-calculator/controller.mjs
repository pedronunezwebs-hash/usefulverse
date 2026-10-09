import { announce, clearResult, readToolCopy } from '../controller-helpers.mjs';
import { calculateSvd } from './logic.mjs';

const root = document.querySelector('[data-tool="singular-value-decomposition-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  const rankOutput = root.querySelector('[data-result-rank]');
  const valuesOutput = root.querySelector('[data-result-singular-values]');
  const errorOutput = root.querySelector('[data-result-error]');
  let decomposition;
  let objectUrl;
  const format = (value) => new Intl.NumberFormat(document.documentElement.lang || 'en', { maximumSignificantDigits: 6 }).format(value);
  const csvCell = (value) => `"${String(value).replaceAll('"', '""')}"`;
  const csvRow = (...values) => values.map(csvCell).join(',');

  function clear() {
    clearResult(root);
    content.replaceChildren();
    rankOutput.textContent = '';
    valuesOutput.textContent = '';
    errorOutput.textContent = '';
    decomposition = undefined;
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = undefined;
  }

  function appendMatrix(label, matrix) {
    const section = document.createElement('section');
    section.className = 'svd-result-matrix';
    const heading = document.createElement('h3');
    heading.textContent = label;
    const table = document.createElement('table');
    table.className = 'svd-result-matrix__table';
    table.setAttribute('aria-label', label);
    const body = document.createElement('tbody');
    for (const row of matrix) {
      const tr = document.createElement('tr');
      for (const value of row) {
        const cell = document.createElement('td');
        cell.textContent = format(value);
        tr.append(cell);
      }
      body.append(tr);
    }
    table.append(body);
    section.append(heading, table);
    content.append(section);
  }

  function run() {
    clear();
    try {
      decomposition = calculateSvd(form.elements.namedItem('matrix').value);
      const { input, u, singularValues, vt, reconstruction, rank, relativeReconstructionError, residualFrobenius } = decomposition;
      const sigma = Array.from({ length: singularValues.length }, (_, row) => Array.from({ length: singularValues.length }, (_, column) => row === column ? singularValues[row] : 0));
      rankOutput.textContent = `${copy.fields.resultRank}: ${rank}`;
      valuesOutput.textContent = `${copy.fields.resultSingularValues}: ${singularValues.map(format).join(', ')}`;
      errorOutput.textContent = `${copy.fields.resultReconstructionError}: ${format(relativeReconstructionError)} · ${copy.fields.resultFrobenius}: ${format(residualFrobenius)}`;
      appendMatrix(copy.fields.resultOriginal, input);
      appendMatrix(copy.fields.resultU, u);
      appendMatrix(copy.fields.resultSigma, sigma);
      appendMatrix(copy.fields.resultVt, vt);
      appendMatrix(copy.fields.resultReconstructed, reconstruction);
      result.hidden = false;
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  form.addEventListener('submit', (event) => { event.preventDefault(); run(); });
  form.addEventListener('input', () => { clear(); announce(root, ''); });
  form.addEventListener('reset', () => queueMicrotask(() => { clear(); announce(root, ''); }));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    form.elements.namedItem('matrix').value = '3 0\n0 2';
    run();
    announce(root, copy.messages.exampleLoaded, 'success');
  });
  root.querySelector('[data-action="downloadCsv"]')?.addEventListener('click', () => {
    if (!decomposition) return announce(root, copy.messages.checkInputs, 'error');
    try {
      const rows = [
        csvRow(copy.fields.resultRank, decomposition.rank),
        csvRow(copy.fields.resultReconstructionError, decomposition.relativeReconstructionError),
        '',
        csvRow(`${copy.fields.resultOriginal} (${decomposition.rows}x${decomposition.columns})`),
        ...decomposition.input.map((row) => csvRow(...row)),
        '',
        csvRow(`${copy.fields.resultU} (${decomposition.rows}x${decomposition.compactDimension})`),
        ...decomposition.u.map((row) => csvRow(...row)),
        '',
        csvRow(`${copy.fields.resultSigma} (${decomposition.compactDimension}x${decomposition.compactDimension})`),
        ...Array.from({ length: decomposition.compactDimension }, (_, row) => csvRow(...Array.from({ length: decomposition.compactDimension }, (_, column) => row === column ? decomposition.singularValues[row] : 0))),
        '',
        csvRow(`${copy.fields.resultVt} (${decomposition.compactDimension}x${decomposition.columns})`),
        ...decomposition.vt.map((row) => csvRow(...row)),
        '',
        csvRow(`${copy.fields.resultReconstructed} (${decomposition.rows}x${decomposition.columns})`),
        ...decomposition.reconstruction.map((row) => csvRow(...row)),
      ];
      const blob = new Blob([`\uFEFF${rows.join('\r\n')}`], { type: 'text/csv;charset=utf-8' });
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = 'svd-matrix-decomposition.csv';
      link.click();
      announce(root, copy.messages.downloaded, 'success');
    } catch {
      announce(root, copy.messages.downloadUnavailable, 'error');
    }
  });
  window.addEventListener('pagehide', () => { if (objectUrl) URL.revokeObjectURL(objectUrl); }, { once: true });
}
