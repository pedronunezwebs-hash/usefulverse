import { calculateAcceleration } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="acceleration-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const mode = form.elements.namedItem('mode');
  const units = form.elements.namedItem('units');
  const format = (value) => numberFormat(document.documentElement.lang || 'en', value, 6);
  let outputText = '';

  function syncMode() {
    const visible = {
      acceleration: ['initialVelocity', 'finalVelocity', 'timeSeconds'],
      time: ['initialVelocity', 'finalVelocity', 'acceleration'],
      'final-velocity': ['initialVelocity', 'acceleration', 'timeSeconds'],
      displacement: ['initialVelocity', 'acceleration', 'timeSeconds', 'initialPosition'],
    }[mode.value];
    for (const name of ['initialVelocity', 'finalVelocity', 'acceleration', 'timeSeconds', 'initialPosition']) {
      const field = form.elements.namedItem(name);
      const wrapper = root.querySelector(`[data-acceleration-field="${name}"]`);
      const shown = visible.includes(name);
      wrapper.hidden = !shown;
      field.required = shown && name !== 'initialPosition';
    }
  }

  function calculate(event) {
    event?.preventDefault();
    clearResult(root);
    outputText = '';
    try {
      const result = calculateAcceleration({
        mode: mode.value,
        units: units.value,
        initialVelocity: form.elements.namedItem('initialVelocity').value || '0',
        finalVelocity: form.elements.namedItem('finalVelocity').value || '0',
        acceleration: form.elements.namedItem('acceleration').value || '0',
        timeSeconds: form.elements.namedItem('timeSeconds').value || '0',
        initialPosition: form.elements.namedItem('initialPosition').value || '0',
      });
      const velocityUnit = units.value === 'metric' ? 'm/s' : 'ft/s';
      const accelerationUnit = units.value === 'metric' ? 'm/s²' : 'ft/s²';
      const distanceUnit = units.value === 'metric' ? 'm' : 'ft';
      const rows = [
        [copy.messages.acceleration, `${format(result.acceleration)} ${accelerationUnit}`],
        [copy.messages.time, `${format(result.timeSeconds)} s`],
        [copy.messages.initialVelocity, `${format(result.initialVelocity)} ${velocityUnit}`],
        [copy.messages.finalVelocity, `${format(result.finalVelocity)} ${velocityUnit}`],
        [copy.messages.displacement, `${format(result.displacement)} ${distanceUnit}`],
        [copy.messages.initialPosition, `${format(result.initialPosition)} ${distanceUnit}`],
        [copy.messages.finalPosition, `${format(result.finalPosition)} ${distanceUnit}`],
      ];
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
    mode.value = 'acceleration';
    units.value = 'metric';
    for (const [name, value] of Object.entries({ initialVelocity: '0', finalVelocity: '20', acceleration: '4', timeSeconds: '5', initialPosition: '0' })) form.elements.namedItem(name).value = value;
    syncMode();
    calculate();
  });
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
