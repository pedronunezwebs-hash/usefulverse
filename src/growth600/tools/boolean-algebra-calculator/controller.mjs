import { announce, clearResult, copyText, readToolCopy } from '../controller-helpers.mjs';
import { calculateBooleanAlgebra } from './logic.mjs';

const root = document.querySelector('[data-tool="boolean-algebra-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  let calculation;

  function clear() {
    clearResult(root);
    content.replaceChildren();
    calculation = undefined;
  }

  function cell(tag, text) {
    const element = document.createElement(tag);
    element.textContent = text;
    return element;
  }

  function renderTable() {
    const wrap = document.createElement('div'); wrap.className = 'boolean-algebra-table-wrap';
    const table = document.createElement('table');
    table.className = 'boolean-algebra-table';
    table.setAttribute('aria-label', copy.fields.truthTableLabel);
    const head = document.createElement('thead'), header = document.createElement('tr');
    for (const variable of calculation.variables) header.append(cell('th', variable));
    header.append(cell('th', copy.fields.result)); head.append(header); table.append(head);
    const body = document.createElement('tbody');
    for (const row of calculation.rows) {
      const tr = document.createElement('tr');
      for (const variable of calculation.variables) tr.append(cell('td', row.assignment[variable] ? '1' : '0'));
      tr.append(cell('td', row.result ? '1' : '0')); body.append(tr);
    }
    table.append(body); wrap.append(table);
    return wrap;
  }

  function renderKmap() {
    if (!calculation.kmap) return null;
    const section = document.createElement('section'); section.className = 'boolean-algebra-kmap';
    const heading = cell('h3', copy.fields.kmapTitle); section.append(heading);
    const table = document.createElement('table'); table.setAttribute('aria-label', copy.fields.kmapTitle);
    const head = document.createElement('thead'), header = document.createElement('tr');
    header.append(cell('th', `${calculation.kmap.rowVariables.join('')} / ${calculation.kmap.columnVariables.join('')}`));
    for (const label of calculation.kmap.columnLabels) header.append(cell('th', label));
    head.append(header); table.append(head);
    const body = document.createElement('tbody');
    calculation.kmap.cells.forEach((cells, index) => {
      const tr = document.createElement('tr'); tr.append(cell('th', calculation.kmap.rowLabels[index]));
      cells.forEach((value) => tr.append(cell('td', value ? '1' : '0'))); body.append(tr);
    });
    table.append(body); section.append(table); return section;
  }

  function calculate(event) {
    event?.preventDefault(); clear();
    try {
      calculation = calculateBooleanAlgebra({ expression: form.elements.namedItem('expression').value });
      const summary = document.createElement('dl'); summary.className = 'boolean-algebra-summary';
      for (const [label, value] of [[copy.fields.simplifiedSop, calculation.sop], [copy.fields.simplifiedPos, calculation.pos], [copy.fields.variables, calculation.variables.join(', ')], [copy.fields.minterms, calculation.minterms.join(', ') || '—']]) {
        summary.append(cell('dt', label), cell('dd', value));
      }
      content.append(summary, renderTable());
      const kmap = renderKmap(); if (kmap) content.append(kmap);
      result.hidden = false;
      announce(root, copy.messages.calculated, 'success');
    } catch { announce(root, copy.messages.checkInputs, 'error'); }
  }

  function summary() {
    if (!calculation) return '';
    return `${copy.fields.simplifiedSop}: ${calculation.sop}\n${copy.fields.simplifiedPos}: ${calculation.pos}\n${copy.fields.variables}: ${calculation.variables.join(', ')}\n${copy.fields.minterms}: ${calculation.minterms.join(', ') || '—'}`;
  }

  form.addEventListener('submit', calculate);
  form.addEventListener('input', () => { clear(); announce(root, ''); });
  form.addEventListener('reset', () => queueMicrotask(() => { clear(); announce(root, ''); }));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    form.elements.namedItem('expression').value = 'A OR NOT A';
    calculate(); announce(root, copy.messages.exampleLoaded, 'success');
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (calculation) copyText(root, summary(), copy); });
}
