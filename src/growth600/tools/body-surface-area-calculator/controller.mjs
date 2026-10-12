import { parseLocalizedNumber } from '../../../advanced-logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';
import { calculateBodySurfaceArea } from './logic.mjs';

const root = document.querySelector('[data-tool="body-surface-area-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const locale = () => document.documentElement.lang || 'en';
  const format = (value) => numberFormat(locale(), value, 3);
  let output = '';

  function calculate(event) {
    event?.preventDefault(); clearResult(root); output = '';
    try {
      const read = (name) => parseLocalizedNumber(form.elements.namedItem(name).value, locale());
      const result = calculateBodySurfaceArea({
        height: read('height'), heightUnit: form.elements.namedItem('heightUnit').value,
        weight: read('weight'), weightUnit: form.elements.namedItem('weightUnit').value,
      });
      const rows = [
        [copy.fields.mosteller, `${format(result.mosteller)} m²`],
        [copy.fields.duBois, `${format(result.duBois)} m²`],
        [copy.fields.difference, `${format(Math.abs(result.difference))} m²`],
      ];
      showRows(root, rows);
      output = `${rows.map(([label, value]) => `${label}: ${value}`).join('\n')}\n\n${copy.fields.formulaNote}\n${copy.fields.safetyNote}`;
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
    for (const [name, value] of Object.entries({ height: '170', heightUnit: 'cm', weight: '70', weightUnit: 'kg' })) form.elements.namedItem(name).value = value;
    calculate();
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (output) copyText(root, output, copy); });
}
