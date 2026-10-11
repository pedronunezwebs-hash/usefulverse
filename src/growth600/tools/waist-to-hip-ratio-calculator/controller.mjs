import { parseLocalizedNumber } from '../../../advanced-logic.mjs';
import { calculateWaistHipRatio } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="waist-to-hip-ratio-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const locale = () => document.documentElement.lang || 'en';
  const format = (value) => numberFormat(locale(), value, 4);
  let output = '';

  function calculate(event) {
    event?.preventDefault();
    clearResult(root);
    output = '';
    try {
      const result = calculateWaistHipRatio({
        waist: parseLocalizedNumber(form.elements.namedItem('waist').value, locale()),
        hip: parseLocalizedNumber(form.elements.namedItem('hip').value, locale()),
        unit: form.elements.namedItem('unit').value,
      });
      const rows = [[copy.fields.resultRatio, format(result.ratio)]];
      showRows(root, rows);
      output = `${rows[0][0]}: ${rows[0][1]}\n${copy.fields.formulaNote}`;
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  form.addEventListener('input', () => { clearResult(root); output = ''; announce(root, ''); });
  form.addEventListener('change', () => { clearResult(root); output = ''; announce(root, ''); });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => { clearResult(root); output = ''; announce(root, ''); }, 0));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    form.elements.namedItem('waist').value = '80';
    form.elements.namedItem('hip').value = '100';
    form.elements.namedItem('unit').value = 'cm';
    calculate();
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (output) copyText(root, output, copy); });
}
