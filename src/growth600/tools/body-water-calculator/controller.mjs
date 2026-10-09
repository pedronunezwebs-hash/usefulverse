import { parseLocalizedNumber } from '../../../advanced-logic.mjs';
import { estimateTotalBodyWater } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="body-water-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const format = (value, digits = 2) => numberFormat(document.documentElement.lang || 'en', value, digits);
  let outputText = '';
  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      const read = (name) => parseLocalizedNumber(form.elements.namedItem(name).value, document.documentElement.lang || 'en');
      const heightInput = read('height');
      const weightInput = read('weight');
      const heightCm = form.elements.namedItem('heightUnit').value === 'in' ? heightInput * 2.54 : heightInput;
      const weightKg = form.elements.namedItem('weightUnit').value === 'lb' ? weightInput / 2.2046226218 : weightInput;
      const result = estimateTotalBodyWater({ age: read('age'), heightCm, weightKg, equation: form.elements.namedItem('equation').value });
      const rows = [
        [copy.fields.resultLiters, `${format(result.liters)} L`],
        [copy.fields.resultPercent, `${format(result.percent)}%`],
      ];
      showRows(root, rows);
      outputText = `${rows.map(([label, value]) => `${label}: ${value}`).join('\n')}\n\n${copy.fields.equationNote}`;
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }
  form.addEventListener('input', () => { clearResult(root); outputText = ''; announce(root, ''); });
  form.addEventListener('change', () => { clearResult(root); outputText = ''; announce(root, ''); });
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    for (const [name, value] of Object.entries({ equation: 'male', age: '30', height: '175', heightUnit: 'cm', weight: '70', weightUnit: 'kg' })) form.elements.namedItem(name).value = value;
    calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => { outputText = ''; clearResult(root); announce(root, ''); }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
}
