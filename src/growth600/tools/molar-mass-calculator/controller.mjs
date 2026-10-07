import { calculateMolarMass } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="molar-mass-calculator"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const input = form.elements.namedItem('formula');
  const locale = document.documentElement.lang || 'en';
  let outputText = '';

  function calculate(event) {
    event?.preventDefault();
    clearResult(root);
    try {
      if (!input.value.trim()) throw new TypeError();
      const result = calculateMolarMass(input.value);
      const rows = Object.entries(result.counts).map(([element, count]) => [`${element} (${copy.messages.atomCount})`, numberFormat(locale, count, 0)]);
      rows.push([copy.messages.molarMass, `${numberFormat(locale, result.molarMass, 6)} g/mol`]);
      showRows(root, rows);
      outputText = `${result.formula}: ${numberFormat(locale, result.molarMass, 6)} g/mol`;
      announce(root, copy.messages.calculated, 'success');
    } catch {
      outputText = '';
      announce(root, copy.messages.invalidFormula, 'error');
      input.setAttribute('aria-invalid', 'true');
      input.focus();
    }
  }

  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => {
    setTimeout(() => { outputText = ''; clearResult(root); announce(root, ''); input.removeAttribute('aria-invalid'); }, 0);
  });
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    input.value = 'Ca(OH)2';
    input.removeAttribute('aria-invalid');
    calculate();
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
    if (outputText) copyText(root, outputText, copy);
  });
}
