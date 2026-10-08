import { calculateHorsepower } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="horsepower-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const mode = form.elements.namedItem('mode');
  const format = (value) => numberFormat(document.documentElement.lang || 'en', value, 6);
  let outputText = '';

  function syncMode() {
    const shown = {
      torque: mode.value !== 'solve-torque',
      rpm: mode.value !== 'solve-rpm',
      power: mode.value !== 'solve-power',
    };
    for (const [name, visible] of Object.entries(shown)) {
      root.querySelector(`[data-horsepower-field="${name}"]`).hidden = !visible;
      form.elements.namedItem(name).required = visible;
    }
  }

  function calculate(event) {
    event?.preventDefault();
    clearResult(root);
    outputText = '';
    try {
      const result = calculateHorsepower({
        mode: mode.value,
        torque: form.elements.namedItem('torque').value,
        torqueUnit: form.elements.namedItem('torqueUnit').value,
        rpm: form.elements.namedItem('rpm').value,
        power: form.elements.namedItem('power').value,
        powerUnit: form.elements.namedItem('powerUnit').value,
      });
      const rows = [
        [copy.messages.torque, `${format(result.torque)} ${result.torqueUnit}`],
        [copy.messages.rpm, `${format(result.rpm)} RPM`],
        [copy.messages.watts, `${format(result.powerValues.W)} W`],
        [copy.messages.kilowatts, `${format(result.powerValues.kW)} kW`],
        [copy.messages.horsepower, `${format(result.powerValues.hp)} hp`],
        [copy.messages.metricHorsepower, `${format(result.powerValues.PS)} PS`],
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
    mode.value = 'solve-power';
    form.elements.namedItem('torque').value = '100';
    form.elements.namedItem('torqueUnit').value = 'Nm';
    form.elements.namedItem('rpm').value = '1000';
    form.elements.namedItem('powerUnit').value = 'kW';
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
