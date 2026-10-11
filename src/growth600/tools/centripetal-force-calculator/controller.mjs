import { parseLocalizedNumber } from '../../../advanced-logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';
import { calculateCentripetalForce } from './logic.mjs';

const root = document.querySelector('[data-tool="centripetal-force-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const locale = () => document.documentElement.lang || 'en';
  let summary = '';
  const parse = (name) => parseLocalizedNumber(form.elements.namedItem(name).value, locale());
  const format = (value, digits = 4) => numberFormat(locale(), value, digits);
  function clear() { clearResult(root); summary = ''; }
  function updateMode() {
    const rotation = form.elements.namedItem('mode').value === 'rotation';
    const speedRow = root.querySelector('[data-motion-input="speed"]');
    const rotationRow = root.querySelector('[data-motion-input="rotation"]');
    if (speedRow) { speedRow.hidden = rotation; speedRow.querySelectorAll('input,select').forEach((field) => { field.disabled = rotation; field.required = !rotation; }); }
    if (rotationRow) { rotationRow.hidden = !rotation; rotationRow.querySelectorAll('input,select').forEach((field) => { field.disabled = !rotation; field.required = rotation; }); }
  }
  function calculate(event) {
    event?.preventDefault(); clear();
    try {
      const mode = form.elements.namedItem('mode').value;
      const estimate = calculateCentripetalForce({
        mass: parse('mass'), massUnit: form.elements.namedItem('massUnit').value,
        radius: parse('radius'), lengthUnit: form.elements.namedItem('lengthUnit').value,
        mode,
        speed: mode === 'speed' ? parse('speed') : 0, speedUnit: form.elements.namedItem('speedUnit').value,
        frequency: mode === 'rotation' ? parse('frequency') : 0, frequencyUnit: form.elements.namedItem('frequencyUnit').value,
      });
      const rows = [
        [copy.fields.centripetalForce, `${format(estimate.forceNewtons)} N`],
        [copy.fields.poundForce, `${format(estimate.forcePoundForce)} lbf`],
        [copy.fields.acceleration, `${format(estimate.accelerationMetersPerSecondSquared)} m/s²`],
        [copy.fields.gForce, `${format(estimate.gForce)} g`],
        [copy.fields.speedResult, `${format(estimate.speedMetersPerSecond)} m/s`],
        [copy.fields.frequencyResult, `${format(estimate.rotationalFrequencyHz)} Hz`],
      ];
      showRows(root, rows); summary = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch { announce(root, copy.messages.checkInputs, 'error'); }
  }
  form.addEventListener('input', () => { clear(); announce(root, ''); });
  form.addEventListener('change', (event) => { if (event.target?.name === 'mode') updateMode(); });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => queueMicrotask(() => { clear(); updateMode(); announce(root, ''); }));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    form.elements.namedItem('mass').value = '2'; form.elements.namedItem('massUnit').value = 'kg';
    form.elements.namedItem('radius').value = '3'; form.elements.namedItem('lengthUnit').value = 'm';
    form.elements.namedItem('mode').value = 'speed'; form.elements.namedItem('speed').value = '4';
    form.elements.namedItem('speedUnit').value = 'm/s'; updateMode(); calculate();
    announce(root, copy.messages.exampleLoaded, 'success');
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (summary) copyText(root, summary, copy); });
  updateMode();
}
