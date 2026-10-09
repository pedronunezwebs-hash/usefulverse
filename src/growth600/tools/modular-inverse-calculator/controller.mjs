import { parseLocalizedNumber } from '../../../advanced-logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';
import { calculateModularInverse } from './logic.mjs';

const root = document.querySelector('[data-tool="modular-inverse-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  let outputText = '';
  const locale = () => document.documentElement.lang || 'en';
  const format = (value) => numberFormat(locale(), value, 0);

  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      const read = (name) => parseLocalizedNumber(form.elements.namedItem(name).value, locale());
      const result = calculateModularInverse(read('a'), read('modulus'));
      const rows = [
        [copy.fields.resultStatus, result.exists ? copy.fields.existsLabel : copy.fields.missingLabel],
        [copy.fields.resultGcd, format(result.gcd)],
        [copy.fields.resultResidue, `${format(result.residue)} (mod ${format(result.modulus)})`],
      ];
      if (result.exists) {
        rows.push([copy.fields.resultInverse, format(result.inverse)]);
        rows.push([copy.fields.verification, `${format(result.input)} × ${format(result.inverse)} ≡ 1 (mod ${format(result.modulus)})`]);
        rows.push([copy.fields.bezout, `${format(result.bezoutA)} × ${format(result.residue)} + ${format(result.bezoutModulus)} × ${format(result.modulus)} = 1`]);
      }
      result.steps.forEach((step, index) => rows.push([
        `${copy.fields.step} ${format(index + 1)}`,
        `${format(step.dividend)} = ${format(step.quotient)} × ${format(step.divisor)} + ${format(step.remainder)} · (${format(step.coefficientA)} × ${format(result.residue)} + ${format(step.coefficientModulus)} × ${format(result.modulus)})`,
      ]));
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, result.exists ? copy.messages.calculated : copy.messages.noInverse, result.exists ? 'success' : 'error');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  form.addEventListener('submit', calculate);
  form.addEventListener('input', () => { clearResult(root); outputText = ''; announce(root, ''); });
  form.addEventListener('reset', () => setTimeout(() => { clearResult(root); outputText = ''; announce(root, ''); }, 0));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    form.elements.namedItem('a').value = '3';
    form.elements.namedItem('modulus').value = '7';
    calculate();
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
}
