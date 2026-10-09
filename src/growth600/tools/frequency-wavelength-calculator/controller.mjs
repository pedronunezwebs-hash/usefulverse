import { calculateWaveRelation } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="frequency-wavelength-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const speedField = form.elements.namedItem('speed');
  const mediumField = form.elements.namedItem('medium');
  let outputText = '';
  const speedPresets = { vacuum: 299792458, air: 299702547, water: 224844343, glass: 199861639, custom: '' };
  const factors = {
    frequency: { Hz: 1, kHz: 1e3, MHz: 1e6, GHz: 1e9, THz: 1e12 },
    wavelength: { nm: 1e-9, 'μm': 1e-6, mm: 1e-3, cm: 1e-2, m: 1, km: 1e3 },
    speed: { 'm/s': 1, 'km/s': 1e3 },
  };
  const format = (value) => {
    const locale = document.documentElement.lang || 'en';
    return Math.abs(value) >= 1e9 || (value !== 0 && Math.abs(value) < 1e-6)
      ? new Intl.NumberFormat(locale, { notation: 'scientific', maximumSignificantDigits: 7 }).format(value)
      : numberFormat(locale, value, 9);
  };
  const fields = ['frequency', 'wavelength', 'speed'];
  function updatePreset() {
    speedField.value = String(speedPresets[mediumField.value] ?? '');
    if (mediumField.value !== 'custom') form.elements.namedItem('speedUnit').value = 'm/s';
  }
  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      const value = (name) => form.elements.namedItem(name).value.trim();
      const result = calculateWaveRelation({
        frequency: value('frequency'), frequencyUnit: value('frequencyUnit'),
        wavelength: value('wavelength'), wavelengthUnit: value('wavelengthUnit'),
        speed: value('speed'), speedUnit: value('speedUnit'),
      });
      const data = [
        ['frequency', result.frequencyHz / factors.frequency[value('frequencyUnit')], value('frequencyUnit')],
        ['wavelength', result.wavelengthM / factors.wavelength[value('wavelengthUnit')], value('wavelengthUnit')],
        ['speed', result.speedMps / factors.speed[value('speedUnit')], value('speedUnit')],
      ];
      const rows = [
        [copy.messages.solved, `${format(result.value / factors[result.variable][value(`${result.variable}Unit`)])} ${value(`${result.variable}Unit`)}`],
        ...data.map(([key, number, unit]) => [copy.messages[key], `${format(number)} ${unit}`]),
        [copy.messages.formula, 'v = f × λ'],
      ];
      showRows(root, rows);
      outputText = rows.map(([label, shown]) => `${label}: ${shown}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }
  mediumField.addEventListener('change', updatePreset);
  for (const field of fields) form.elements.namedItem(field).addEventListener('input', () => {
    if (field === 'speed' && mediumField.value !== 'custom') mediumField.value = 'custom';
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => { outputText = ''; clearResult(root); announce(root, ''); }, 0));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    form.elements.namedItem('frequency').value = '100';
    form.elements.namedItem('frequencyUnit').value = 'MHz';
    form.elements.namedItem('wavelength').value = '';
    form.elements.namedItem('wavelengthUnit').value = 'm';
    mediumField.value = 'custom';
    speedField.value = '300000000';
    form.elements.namedItem('speedUnit').value = 'm/s';
    calculate(); announce(root, copy.messages.exampleLoaded, 'status');
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
}
