import { calculateBalusterSpacing } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="baluster-spacing-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const locale = document.documentElement.lang || 'en';
  const format = (value) => numberFormat(locale, value, 3);
  let outputText = '';
  function setMode() {
    const mode = form.elements.namedItem('mode').value;
    for (const panel of root.querySelectorAll('[data-baluster-input]')) panel.hidden = panel.dataset.balusterInput !== mode;
  }
  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      const result = calculateBalusterSpacing({
        mode: form.elements.namedItem('mode').value,
        openingWidth: readNumber(form, 'openingWidth', { min: 0.1, max: 1_000_000 }),
        balusterWidth: readNumber(form, 'balusterWidth', { min: 0.01, max: 100_000 }),
        unit: form.elements.namedItem('unit').value,
        balusterCount: readNumber(form, 'balusterCount', { optional: true, min: 1, max: 1000, integer: true }),
        maximumGap: readNumber(form, 'maximumGap', { optional: true, min: 0.01, max: 1_000_000 }),
      });
      const rows = [
        [copy.messages.balusterCount, format(result.balusterCount)],
        [copy.messages.gapCount, format(result.gapCount)],
        [copy.messages.uniformClearGap, `${format(result.clearGap)} ${result.unit}`],
        [copy.messages.totalBalusterWidth, `${format(result.totalBalusterWidth)} ${result.unit}`],
        [copy.messages.totalClearGap, `${format(result.totalClearGap)} ${result.unit}`],
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
    for (const [name, value] of Object.entries({ mode: 'max-gap', openingWidth: '1200', balusterWidth: '40', unit: 'mm', balusterCount: '', maximumGap: '100' })) form.elements.namedItem(name).value = value;
    setMode(); calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => { outputText = ''; clearResult(root); announce(root, ''); setMode(); }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
  setMode();
}
