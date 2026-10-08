import { calculateBatteryRuntime } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="battery-runtime-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const locale = document.documentElement.lang || 'en';
  const format = (value, digits = 2) => numberFormat(locale, value, digits);
  let outputText = '';
  function setMode() {
    const mode = form.elements.namedItem('capacityMode').value;
    for (const panel of root.querySelectorAll('[data-battery-input]')) panel.hidden = panel.dataset.batteryInput !== mode;
  }
  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      const capacityMode = form.elements.namedItem('capacityMode').value;
      const result = calculateBatteryRuntime({
        mode: capacityMode,
        capacityEnergy: readNumber(form, 'capacityEnergy', { optional: true, min: 0.001, max: 1_000_000_000 }),
        energyUnit: form.elements.namedItem('energyUnit').value,
        capacityAh: readNumber(form, 'capacityAh', { optional: true, min: 0.001, max: 1_000_000_000 }),
        voltage: readNumber(form, 'voltage', { optional: true, min: 0.01, max: 1_000_000 }),
        loadWatts: readNumber(form, 'loadWatts', { min: 0.001, max: 100_000_000 }),
        depthOfDischargePercent: readNumber(form, 'depthOfDischargePercent', { min: 0, max: 100 }),
        efficiencyPercent: readNumber(form, 'efficiencyPercent', { min: 0.1, max: 100 }),
      });
      const rows = [
        [copy.messages.nominalEnergy, `${format(result.nominalEnergyWh)} Wh`],
        [copy.messages.usableEnergy, `${format(result.usableEnergyWh)} Wh`],
        [copy.messages.runtimeHours, `${format(result.runtimeHours)} h`],
        [copy.messages.runtimeDays, `${format(result.runtimeDays)} d`],
      ];
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }
  form.elements.namedItem('capacityMode').addEventListener('change', setMode);
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    for (const [name, value] of Object.entries({ capacityMode: 'energy', capacityEnergy: '100', energyUnit: 'Wh', capacityAh: '', voltage: '', loadWatts: '10', depthOfDischargePercent: '100', efficiencyPercent: '100' })) form.elements.namedItem(name).value = value;
    setMode(); calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => { outputText = ''; clearResult(root); announce(root, ''); setMode(); }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
  setMode();
}
