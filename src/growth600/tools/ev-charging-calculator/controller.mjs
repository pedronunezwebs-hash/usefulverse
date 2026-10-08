import { calculateEvCharging } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="ev-charging-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const format = (value, digits = 2) => numberFormat(document.documentElement.lang || 'en', value, digits);
  let outputText = '';
  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      const result = calculateEvCharging({
        batteryCapacityKwh: readNumber(form, 'batteryCapacityKwh', { min: 0.001, max: 1_000_000 }),
        startSocPercent: readNumber(form, 'startSocPercent', { min: 0, max: 100 }),
        targetSocPercent: readNumber(form, 'targetSocPercent', { min: 0, max: 100 }),
        chargerPowerKw: readNumber(form, 'chargerPowerKw', { min: 0.001, max: 1_000_000 }),
        efficiencyPercent: readNumber(form, 'efficiencyPercent', { min: 0.1, max: 100 }),
        electricityRatePerKwh: readNumber(form, 'electricityRatePerKwh', { optional: true, min: 0, max: 1_000_000 }),
        currency: form.elements.namedItem('currency').value.trim().toUpperCase(),
      });
      const rows = [
        [copy.messages.batteryEnergy, `${format(result.batteryEnergyKwh)} kWh`],
        [copy.messages.gridEnergy, `${format(result.gridEnergyKwh)} kWh`],
        [copy.messages.chargingTime, `${format(result.chargingHours)} h (${format(result.chargingMinutes)} min)`],
        ...(result.estimatedCost === null ? [] : [[copy.messages.estimatedCost, `${result.currency} ${format(result.estimatedCost)}`]]),
      ];
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    for (const [name, value] of Object.entries({ batteryCapacityKwh: '50', startSocPercent: '20', targetSocPercent: '80', chargerPowerKw: '7.2', efficiencyPercent: '90', electricityRatePerKwh: '0.15', currency: 'USD' })) form.elements.namedItem(name).value = value;
    calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => { outputText = ''; clearResult(root); announce(root, ''); }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
}
