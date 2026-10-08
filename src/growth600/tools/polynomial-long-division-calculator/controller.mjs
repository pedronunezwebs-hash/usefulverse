import { calculatePolynomialLongDivision } from './logic.mjs';
import { announce, clearResult, copyText, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="polynomial-long-division-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  let outputText = '';

  function calculate(event) {
    event?.preventDefault();
    clearResult(root);
    outputText = '';
    try {
      const result = calculatePolynomialLongDivision(
        form.elements.namedItem('dividend').value,
        form.elements.namedItem('divisor').value,
      );
      const rows = [
        [copy.messages.quotient, result.quotient],
        [copy.messages.remainder, result.remainder],
        ...result.steps.flatMap((step, index) => [
          [`${copy.messages.step} ${index + 1} · ${copy.messages.quotientTerm}`, step.quotientTerm],
          [copy.messages.subtract, `(${step.subtractTerm})`],
          [copy.messages.newRemainder, step.remainder],
        ]),
      ];
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => {
    outputText = '';
    clearResult(root);
    announce(root, '');
  }, 0));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    form.elements.namedItem('dividend').value = 'x^2 - 1';
    form.elements.namedItem('divisor').value = 'x - 1';
    calculate();
    announce(root, copy.messages.exampleLoaded, 'status');
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
    if (outputText) copyText(root, outputText, copy);
  });
}
