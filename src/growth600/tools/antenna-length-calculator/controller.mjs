import { calculateAntennaLength } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="antenna-length-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const format = (value) => numberFormat(document.documentElement.lang || 'en', value, 7);
  let output = '';
  const frequencyInput = form.elements.namedItem('frequency');
  const frequencyUnit = form.elements.namedItem('frequencyUnit');

  function updateFrequencyBounds() {
    const factor = { Hz: 1, kHz: 1e3, MHz: 1e6, GHz: 1e9 }[frequencyUnit.value];
    frequencyInput.min = String(1e-3 / factor);
    frequencyInput.max = String(1e12 / factor);
  }
  updateFrequencyBounds();
  frequencyUnit.addEventListener('change', updateFrequencyBounds);

  function calculate(event) {
    event?.preventDefault(); clearResult(root); output = '';
    try {
      const formData = new FormData(form);
      const result = calculateAntennaLength(Object.fromEntries(formData.entries()));
      const rows = [
        [copy.fields.mode, result.mode === 'dipole' ? copy.fields.dipole : copy.fields.monopole],
        [copy.messages.wavelength, `${format(result.wavelengthM)} m`],
        [copy.messages.idealLength, `${format(result.idealLengthM)} m`],
        [copy.messages.adjustedLength, `${format(result.adjustedLengthM)} m`],
        ...(result.mode === 'dipole' ? [[copy.messages.elementLength, `${format(result.elementLengthM)} m`]] : []),
        [copy.messages.imperialAdjusted, `${format(result.adjustedLengthFeet)} ft`],
        [copy.messages.factor, format(result.shorteningFactor)],
        [copy.messages.formula, result.mode === 'dipole' ? 'L = (c / f) × 1/2 × factor' : 'L = (c / f) × 1/4 × factor'],
      ];
      showRows(root, rows);
      output = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch { announce(root, copy.messages.checkInputs, 'error'); }
  }

  form.addEventListener('input', () => { output = ''; clearResult(root); announce(root, ''); });
  form.addEventListener('change', () => { output = ''; clearResult(root); announce(root, ''); });
  form.addEventListener('submit', calculate);
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    form.elements.namedItem('mode').value = 'dipole';
    frequencyInput.value = '100';
    frequencyUnit.value = 'MHz';
    updateFrequencyBounds();
    form.elements.namedItem('shorteningFactor').value = '0.95';
    calculate(); announce(root, copy.messages.exampleLoaded || copy.messages.calculated, 'status');
  });
  form.addEventListener('reset', () => setTimeout(() => { output = ''; clearResult(root); announce(root, ''); }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (output) copyText(root, output, copy); });
}
