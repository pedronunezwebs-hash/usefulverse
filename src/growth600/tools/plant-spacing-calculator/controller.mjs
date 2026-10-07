import { calculatePlantSpacing } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="plant-spacing-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const format = (value) => numberFormat(document.documentElement.lang || 'en', value, 2);
  let outputText = '';
  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      const result = calculatePlantSpacing({
        bedLength: readNumber(form, 'bedLength', { min: 0.001, max: 1_000_000 }),
        bedWidth: readNumber(form, 'bedWidth', { min: 0.001, max: 1_000_000 }),
        inRowSpacing: readNumber(form, 'inRowSpacing', { min: 0.001, max: 1_000_000 }),
        rowSpacing: readNumber(form, 'rowSpacing', { min: 0.001, max: 1_000_000 }),
        unit: form.elements.namedItem('unit').value,
        pattern: form.elements.namedItem('pattern').value,
      });
      const rows = [
        [copy.messages.totalPlants, format(result.totalPlants)],
        [copy.messages.rows, format(result.rowCount)],
        [copy.messages.plantsPerRow, `${format(result.plantsPerEvenRow)} / ${format(result.plantsPerOddRow)}`],
        [copy.messages.bedArea, `${format(result.areaInSelectedUnit)} ${copy.actions.squareUnits}`],
        [copy.messages.plantDensity, `${format(result.densityPerSelectedArea)} ${copy.messages.plantsPerArea}`],
      ];
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    for (const [name, value] of Object.entries({ bedLength: '5', bedWidth: '3', inRowSpacing: '0.5', rowSpacing: '0.5', unit: 'm', pattern: 'grid' })) form.elements.namedItem(name).value = value;
    calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => { outputText = ''; clearResult(root); announce(root, ''); }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
}
