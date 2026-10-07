import { calculateFertilizer } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="fertilizer-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const locale = document.documentElement.lang || 'en';
  const format = (value) => numberFormat(locale, value, 3);
  let outputText = '';
  function setMode() {
    const mode = form.elements.namedItem('mode').value;
    for (const panel of root.querySelectorAll('[data-fertilizer-input]')) panel.hidden = panel.dataset.fertilizerInput !== mode;
  }
  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      const result = calculateFertilizer({
        mode: form.elements.namedItem('mode').value,
        productMass: readNumber(form, 'productMass', { optional: true, min: 0.001, max: 1_000_000 }),
        massUnit: form.elements.namedItem('massUnit').value,
        area: readNumber(form, 'area', { optional: true, min: 0.01, max: 1_000_000_000 }),
        areaUnit: form.elements.namedItem('areaUnit').value,
        productRate: readNumber(form, 'productRate', { optional: true, min: 0.000001, max: 1_000_000 }),
        rateUnit: form.elements.namedItem('rateUnit').value,
        nitrogenPercent: readNumber(form, 'nitrogenPercent', { min: 0, max: 100 }),
        phosphatePercent: readNumber(form, 'phosphatePercent', { min: 0, max: 100 }),
        potashPercent: readNumber(form, 'potashPercent', { min: 0, max: 100 }),
      });
      const rows = [
        [copy.messages.productMass, `${format(result.productMass)} ${result.massUnit}`],
        [copy.messages.nitrogenMass, `${format(result.nitrogenMass)} ${result.massUnit} (${format(result.nitrogenPercent)}%)`],
        [copy.messages.phosphateMass, `${format(result.phosphateMass)} ${result.massUnit} (${format(result.phosphatePercent)}%)`],
        [copy.messages.potashMass, `${format(result.potashMass)} ${result.massUnit} (${format(result.potashPercent)}%)`],
      ];
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }
  form.elements.namedItem('mode').addEventListener('change', setMode);
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    for (const [name, value] of Object.entries({ mode: 'product', productMass: '10', massUnit: 'kg', area: '', areaUnit: 'm2', productRate: '', rateUnit: 'kg100m2', nitrogenPercent: '20', phosphatePercent: '10', potashPercent: '10' })) form.elements.namedItem(name).value = value;
    setMode(); calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => { outputText = ''; clearResult(root); announce(root, ''); setMode(); }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
  setMode();
}
