import { calculateEffectiveInterest } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="effective-interest-rate-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const format = (value) => `${numberFormat(document.documentElement.lang || 'en', value, 7)}%`;
  let output = '';

  function calculate(event) {
    event?.preventDefault();
    clearResult(root);
    output = '';
    try {
      const result = calculateEffectiveInterest(Object.fromEntries(new FormData(form).entries()));
      const rows = [
        [copy.messages.apr, format(result.aprPercent)],
        [copy.messages.apy, format(result.apyPercent)],
        ...(result.periodicRatePercent === null ? [] : [[copy.messages.periodicRate, format(result.periodicRatePercent)]]),
        [copy.messages.compounding, copy.fields[result.frequency]],
        [copy.messages.formula, result.frequency === 'continuous'
          ? (result.mode === 'apr-to-apy' ? 'APY = e^APR − 1' : 'APR = ln(1 + APY)')
          : (result.mode === 'apr-to-apy' ? 'APY = (1 + APR ÷ m)^m − 1' : 'APR = m × ((1 + APY)^(1/m) − 1)')],
      ];
      showRows(root, rows);
      output = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  form.addEventListener('input', () => { output = ''; clearResult(root); announce(root, ''); });
  form.addEventListener('change', () => { output = ''; clearResult(root); announce(root, ''); });
  form.addEventListener('submit', calculate);
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    form.elements.namedItem('mode').value = 'apr-to-apy';
    form.elements.namedItem('ratePercent').value = '12';
    form.elements.namedItem('frequency').value = 'monthly';
    calculate();
    announce(root, copy.messages.exampleLoaded, 'status');
  });
  form.addEventListener('reset', () => setTimeout(() => { output = ''; clearResult(root); announce(root, ''); }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (output) copyText(root, output, copy); });
}
