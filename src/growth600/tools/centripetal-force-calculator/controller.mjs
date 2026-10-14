import { calculateCentripetal } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';

export function mountCentripetalForceCalculator(root, copy) {
  const form = root.querySelector('#tool-form');
  const mode = form.elements.namedItem('mode');
  const speedFields = root.querySelector('[data-speed-fields]');
  const frequencyFields = root.querySelector('[data-frequency-fields]');
  let output = '';
  const clear = () => { clearResult(root); output = ''; };
  const updateMode = () => {
    const speedMode = mode.value === 'speed';
    speedFields.hidden = !speedMode; frequencyFields.hidden = speedMode;
    for (const control of speedFields.querySelectorAll('input,select')) { control.disabled = !speedMode; control.required = speedMode; }
    for (const control of frequencyFields.querySelectorAll('input,select')) { control.disabled = speedMode; control.required = !speedMode; }
    clear();
  };
  const calculate = (event) => {
    event?.preventDefault(); clear();
    try {
      const result = calculateCentripetal(Object.fromEntries(new FormData(form).entries()));
      const rows = [
        [copy.messages.acceleration, `${numberFormat(document.documentElement.lang || 'en', result.accelerationMs2, 6)} m/s²`],
        [copy.messages.force, `${numberFormat(document.documentElement.lang || 'en', result.forceN, 6)} N (${numberFormat(document.documentElement.lang || 'en', result.forceLbf, 6)} lbf)`],
        [copy.messages.speed, `${numberFormat(document.documentElement.lang || 'en', result.speedMs, 6)} m/s`],
        [copy.messages.frequency, `${numberFormat(document.documentElement.lang || 'en', result.frequencyHz, 6)} Hz`],
        [copy.messages.rpm, `${numberFormat(document.documentElement.lang || 'en', result.rpm, 6)} rpm`],
        [copy.messages.angularVelocity, `${numberFormat(document.documentElement.lang || 'en', result.angularVelocityRadS, 6)} rad/s`],
        [copy.messages.period, `${numberFormat(document.documentElement.lang || 'en', result.periodS, 6)} s`],
      ];
      showRows(root, rows);
      output = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch { announce(root, copy.messages.checkInputs, 'error'); }
  };
  mode.addEventListener('change', updateMode);
  form.addEventListener('input', clear);
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => { updateMode(); clear(); announce(root, ''); }, 0));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    form.elements.namedItem('mass').value = '2'; form.elements.namedItem('massUnit').value = 'kg';
    form.elements.namedItem('radius').value = '0.5'; form.elements.namedItem('radiusUnit').value = 'm';
    if (mode.value === 'speed') {
      form.elements.namedItem('speed').value = '4'; form.elements.namedItem('speedUnit').value = 'm/s';
    } else {
      form.elements.namedItem('frequency').value = '2'; form.elements.namedItem('frequencyUnit').value = 'Hz';
    }
    calculate();
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (output) copyText(root, output, copy); });
  updateMode();
}

const root = document.querySelector('[data-tool="centripetal-force-calculator"]');
if (root) mountCentripetalForceCalculator(root, readToolCopy(root));
