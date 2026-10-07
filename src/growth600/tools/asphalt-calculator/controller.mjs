import { calculateAsphalt } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="asphalt-calculator"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const locale = document.documentElement.lang || 'en';
  const messages = copy.messages;
  let outputText = '';
  const display = (value, places = 2) => numberFormat(locale, value, places);

  function calculate(event) {
    event?.preventDefault();
    clearResult(root);
    outputText = '';
    try {
      const result = calculateAsphalt({
        area: readNumber(form, 'area', { min: 0 }),
        areaUnit: form.elements.namedItem('areaUnit').value,
        compactedThickness: readNumber(form, 'compactedThickness', { min: 0 }),
        thicknessUnit: form.elements.namedItem('thicknessUnit').value,
        density: readNumber(form, 'density', { min: 0 }),
        densityUnit: form.elements.namedItem('densityUnit').value,
        wastePercent: readNumber(form, 'wastePercent', { min: 0, max: 30 }),
        pricePerTonne: readNumber(form, 'pricePerTonne', { optional: true, min: 0 }),
      });
      const rows = [
        [messages.compactedVolume, `${display(result.compactedVolumeM3, 3)} m³`],
        [messages.orderVolume, `${display(result.orderVolumeM3, 3)} m³`],
        [messages.metricTonnes, `${display(result.metricTonnes, 3)} t`],
        [messages.shortTons, `${display(result.usShortTons, 3)} US short tons`],
      ];
      if (result.estimatedCost !== null) rows.push([messages.estimatedCost, display(result.estimatedCost)]);
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, messages.calculated, 'success');
    } catch {
      announce(root, messages.checkInputs, 'error');
    }
  }

  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    form.elements.namedItem('area').value = '100';
    form.elements.namedItem('areaUnit').value = 'm2';
    form.elements.namedItem('compactedThickness').value = '50';
    form.elements.namedItem('thicknessUnit').value = 'mm';
    form.elements.namedItem('density').value = '2400';
    form.elements.namedItem('densityUnit').value = 'kgm3';
    form.elements.namedItem('wastePercent').value = '0';
    form.elements.namedItem('pricePerTonne').value = '';
    calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => {
    setTimeout(() => {
      outputText = '';
      for (const field of form.querySelectorAll('[aria-invalid]')) field.removeAttribute('aria-invalid');
      clearResult(root);
      announce(root, '');
    }, 0);
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
    if (outputText) copyText(root, outputText, copy);
  });
}
