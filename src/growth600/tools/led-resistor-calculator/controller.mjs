import { calculateLedResistor } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="led-resistor-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const format = (value) => numberFormat(document.documentElement.lang || 'en', value, 7);
  let outputText = '';

  function calculate(event) {
    event?.preventDefault();
    clearResult(root);
    outputText = '';
    try {
      const read = (name) => form.elements.namedItem(name).value.trim();
      const result = calculateLedResistor({
        supplyVoltage: read('supplyVoltage'), forwardVoltage: read('forwardVoltage'),
        ledCount: read('ledCount'), targetCurrentMa: read('targetCurrentMa'), series: read('series'),
      });
      const rows = [
        [copy.messages.totalLedVoltage, `${format(result.totalLedVoltage)} V`],
        [copy.messages.resistorVoltage, `${format(result.resistorVoltage)} V`],
        [copy.messages.requiredResistance, `${format(result.requiredResistanceOhms)} Ω`],
        [copy.messages.standardResistor, `${format(result.resistorOhms)} Ω (${result.standardSeries})`],
        [copy.messages.actualCurrent, `${format(result.actualCurrentMa)} mA`],
        [copy.messages.resistorPower, `${format(result.resistorPowerW)} W`],
        [copy.messages.minimumPowerRating, result.minimumPowerRatingW === null ? copy.messages.powerRatingExceeds : `${format(result.minimumPowerRatingW)} W`],
      ];
      showRows(root, rows.map(([label, value]) => [label, `\u2066${value}\u2069`]));
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => { outputText = ''; clearResult(root); announce(root, ''); }, 0));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    for (const [name, value] of Object.entries({ supplyVoltage: '12', forwardVoltage: '2', ledCount: '1', targetCurrentMa: '20', series: 'E12' })) {
      form.elements.namedItem(name).value = value;
    }
    calculate();
    announce(root, copy.messages.exampleLoaded, 'status');
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
}
