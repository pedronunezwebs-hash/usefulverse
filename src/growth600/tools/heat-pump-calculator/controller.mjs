import { calculateHeatPump } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="heat-pump-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const format = (value) => numberFormat(document.documentElement.lang || 'en', value, 2);
  let outputText = '';
  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      const result = calculateHeatPump({
        heatOutput: readNumber(form, 'heatOutput', { min: 0, max: 10_000_000 }),
        heatOutputUnit: form.elements.namedItem('heatOutputUnit').value,
        cop: readNumber(form, 'cop', { min: 0.1, max: 30 }),
        electricityRatePerKwh: readNumber(form, 'electricityRatePerKwh', { min: 0, max: 1_000_000 }),
        hoursPerDay: readNumber(form, 'hoursPerDay', { min: 0, max: 24 }),
        currency: form.elements.namedItem('currency').value,
      });
      const money = (value) => `${format(value)} ${result.currency}`;
      const rows = [
        [copy.messages.heatOutputKw, `${format(result.heatOutputKw)} kW`],
        [copy.messages.electricalInput, `${format(result.electricalInputKw)} kW`],
        [copy.messages.dailyEnergy, `${format(result.dailyEnergyKwh)} kWh`],
        [copy.messages.monthlyEnergy, `${format(result.monthlyEnergyKwh)} kWh`],
        [copy.messages.dailyCost, money(result.dailyCost)],
        [copy.messages.monthlyCost, money(result.monthlyCost)],
        [copy.messages.resistanceDailyEnergy, `${format(result.resistanceDailyEnergyKwh)} kWh`],
        [copy.messages.resistanceDailyCost, money(result.resistanceDailyCost)],
        [copy.messages.dailyEnergyDifference, `${format(result.dailyEnergyDifferenceKwh)} kWh`],
        [copy.messages.dailyCostDifference, money(result.dailyCostDifference)],
      ];
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    for (const [name, value] of Object.entries({ heatOutput: '10', heatOutputUnit: 'kW', cop: '5', electricityRatePerKwh: '0.2', hoursPerDay: '1', currency: 'USD' })) form.elements.namedItem(name).value = value;
    calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => { outputText = ''; clearResult(root); announce(root, ''); }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
}
