import { calculateDensity } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="density-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const mode = form.elements.namedItem('mode');
  const solveFields = root.querySelector('[data-density-solve]');
  const mixtureFields = root.querySelector('[data-density-mixture]');
  const format = (value) => numberFormat(document.documentElement.lang || 'en', value, 6);
  let outputText = '';

  function syncMode() {
    const isMix = mode.value === 'mix';
    solveFields.hidden = isMix;
    mixtureFields.hidden = !isMix;
    form.elements.namedItem('components').required = isMix;
  }

  function calculate(event) {
    event?.preventDefault();
    clearResult(root);
    outputText = '';
    try {
      const result = calculateDensity({
        mode: mode.value,
        massKg: form.elements.namedItem('massKg').value.trim(),
        volumeM3: form.elements.namedItem('volumeM3').value.trim(),
        densityKgM3: form.elements.namedItem('densityKgM3').value.trim(),
        components: form.elements.namedItem('components').value,
      });
      const rows = [
        [copy.messages.mass, `${format(result.massKg)} kg`],
        [copy.messages.volume, `${format(result.volumeM3)} m³`],
        [copy.messages.density, `${format(result.densityKgM3)} kg/m³`],
        [copy.messages.densityMetric, `${format(result.densityGcm3)} g/cm³`],
        [copy.messages.densityImperial, `${format(result.densityLbFt3)} lb/ft³`],
      ];
      if (result.mode === 'mix') rows.push([copy.messages.componentCount, format(result.componentCount, 0)]);
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  mode.addEventListener('change', syncMode);
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    mode.value = 'solve';
    form.elements.namedItem('massKg').value = '10';
    form.elements.namedItem('volumeM3').value = '2';
    form.elements.namedItem('densityKgM3').value = '';
    form.elements.namedItem('components').value = '';
    syncMode();
    calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => {
    outputText = '';
    syncMode();
    clearResult(root);
    announce(root, '');
  }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
    if (outputText) copyText(root, outputText, copy);
  });
  syncMode();
}
