import { calculateDecibels } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="decibel-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const mode = form.elements.namedItem('mode');
  const format = (value) => numberFormat(document.documentElement.lang || 'en', value, 8);
  let outputText = '';

  function syncMode() {
    const kind = mode.value;
    const showRatio = ['power-ratio', 'amplitude-ratio'].includes(kind);
    const showDb = ['db-to-power', 'db-to-amplitude'].includes(kind);
    const showList = kind === 'sum-levels';
    const showGain = kind === 'apply-gain';
    root.querySelector('[data-decibel-ratio-note]').hidden = !showRatio;
    root.querySelector('[data-decibel-ratio]').hidden = !showRatio;
    root.querySelector('[data-decibel-input]').hidden = !showDb;
    root.querySelector('[data-decibel-levels]').hidden = !showList;
    root.querySelector('[data-decibel-gain]').hidden = !showGain;
    form.elements.namedItem('ratio').required = showRatio;
    form.elements.namedItem('inputDb').required = showDb;
    form.elements.namedItem('levels').required = showList;
    form.elements.namedItem('inputLevel').required = showGain;
    form.elements.namedItem('gainDb').required = showGain;
  }

  function calculate(event) {
    event?.preventDefault();
    clearResult(root); outputText = '';
    try {
      const result = calculateDecibels({
        mode: mode.value,
        ratio: form.elements.namedItem('ratio').value,
        inputDb: form.elements.namedItem('inputDb').value,
        levels: form.elements.namedItem('levels').value,
        inputLevel: form.elements.namedItem('inputLevel').value,
        gainDb: form.elements.namedItem('gainDb').value,
      });
      const rows = [[copy.messages.resultValue, `${format(result.db)} dB`]];
      if (Object.hasOwn(result, 'ratio')) rows.push([copy.messages.linearRatio, format(result.ratio)]);
      if (Object.hasOwn(result, 'count')) rows.push([copy.messages.levelCount, String(result.count)]);
      if (Object.hasOwn(result, 'inputLevel')) rows.push([copy.fields.inputLevel, `${format(result.inputLevel)} dB`], [copy.fields.gainDb, `${format(result.gainDb)} dB`]);
      rows.push([copy.fields.formula, result.formula]);
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  mode.addEventListener('change', syncMode);
  form.addEventListener('submit', calculate);
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    if (mode.value === 'power-ratio' || mode.value === 'amplitude-ratio') form.elements.namedItem('ratio').value = '10';
    else if (mode.value === 'db-to-power' || mode.value === 'db-to-amplitude') form.elements.namedItem('inputDb').value = mode.value === 'db-to-power' ? '10' : '20';
    else if (mode.value === 'sum-levels') form.elements.namedItem('levels').value = '70\n70';
    else { form.elements.namedItem('inputLevel').value = '72'; form.elements.namedItem('gainDb').value = '-6'; }
    calculate();
  });
  form.addEventListener('reset', () => setTimeout(() => { outputText = ''; clearResult(root); announce(root, ''); syncMode(); }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
  syncMode();
}
