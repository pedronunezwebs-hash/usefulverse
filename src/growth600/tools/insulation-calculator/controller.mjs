import { calculateInsulation } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="insulation-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const locale = document.documentElement.lang || 'en';
  const format = (value, places = 3) => numberFormat(locale, value, places);
  let outputText = '';
  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      const layers = Array.from({ length: 4 }, (_, index) => ({
        name: form.elements.namedItem(`layerName${index + 1}`).value,
        resistance: readNumber(form, `layerResistance${index + 1}`, { optional: true, min: 0, max: 1000 }),
        quantity: readNumber(form, `layerQuantity${index + 1}`, { min: 1, max: 100, integer: true }),
      }));
      const result = calculateInsulation({ layers, unit: form.elements.namedItem('unit').value });
      const rows = [
        [copy.messages.layerTotal, format(result.layerCount, 0)],
        ...result.layers.map(({ name, resistance, quantity, contribution }) => [`${name} × ${format(quantity, 0)}`, `${format(resistance)} × ${format(quantity, 0)} = ${format(contribution)} ${result.unit}`]),
        [copy.messages.totalR, `R-${format(result.rValue)}`],
        [copy.messages.totalRsi, `RSI ${format(result.rsi)}`],
        ...(result.uFactorUs === null ? [] : [[copy.messages.uFactorUs, format(result.uFactorUs, 5)], [copy.messages.uFactorSi, format(result.uFactorSi, 5)]]),
      ];
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    for (const [name, value] of Object.entries({ unit: 'R', layerName1: 'Layer 1', layerResistance1: '2', layerQuantity1: '1', layerName2: 'Layer 2', layerResistance2: '3', layerQuantity2: '1', layerName3: '', layerResistance3: '', layerQuantity3: '1', layerName4: '', layerResistance4: '', layerQuantity4: '1' })) form.elements.namedItem(name).value = value;
    calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => { outputText = ''; clearResult(root); announce(root, ''); }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
}
