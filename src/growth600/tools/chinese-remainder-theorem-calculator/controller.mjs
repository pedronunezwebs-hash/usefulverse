import { announce, clearResult, copyText, readToolCopy, showRows } from '../controller-helpers.mjs';
import { calculateChineseRemainder } from './logic.mjs';

const root = document.querySelector('[data-tool="chinese-remainder-theorem-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const format = (value) => new Intl.NumberFormat(document.documentElement.lang || 'en', { maximumFractionDigits: 0 }).format(value);
  let outputText = '';

  function clear() {
    clearResult(root);
    outputText = '';
  }

  function calculate(event) {
    event?.preventDefault();
    clear();
    try {
      const result = calculateChineseRemainder(form.elements.namedItem('congruences').value);
      const rows = [];
      if (result.status === 'incompatible') {
        rows.push(
          [copy.fields.resultStatus, copy.messages.incompatible],
          [copy.fields.conflictAt, format(result.conflictIndex + 1)],
          [copy.fields.conflictGcd, format(result.conflictGcd)],
          [copy.fields.difference, format(result.difference)],
        );
        showRows(root, rows);
        outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
        announce(root, copy.messages.incompatible, 'info');
        return;
      }

      rows.push(
        [copy.fields.resultStatus, copy.messages.calculated],
        [copy.fields.resultResidue, format(result.residue)],
        [copy.fields.resultModulus, format(result.modulus)],
        [copy.fields.combinedEquation, `x ≡ ${format(result.residue)} (mod ${format(result.modulus)})`],
        [copy.fields.equationCount, format(result.congruences.length)],
      );
      result.steps.forEach((step, index) => rows.push([
        `${copy.fields.stepLabel} ${format(index + 1)}`,
        `x ≡ ${format(step.resultResidue)} (mod ${format(step.resultModulus)})`,
      ]));
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  form.addEventListener('submit', calculate);
  form.addEventListener('input', () => { clear(); announce(root, ''); });
  form.addEventListener('reset', () => queueMicrotask(() => { clear(); announce(root, ''); }));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    form.elements.namedItem('congruences').value = copy.exampleCongruences;
    calculate();
    announce(root, copy.messages.exampleLoaded, 'success');
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
    if (outputText) copyText(root, outputText, copy);
  });
}
