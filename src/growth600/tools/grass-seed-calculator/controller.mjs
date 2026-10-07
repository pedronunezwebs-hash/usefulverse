import { calculateGrassSeed } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="grass-seed-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const locale = document.documentElement.lang || 'en';
  const format = (value, places = 2) => numberFormat(locale, value, places);
  let outputText = '';
  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      const result = calculateGrassSeed({
        area: readNumber(form, 'area', { min: 0.01, max: 100_000_000 }),
        areaUnit: form.elements.namedItem('areaUnit').value,
        seedingRate: readNumber(form, 'seedingRate', { min: 0, max: 1_000_000 }),
        rateUnit: form.elements.namedItem('rateUnit').value,
        wastePercent: readNumber(form, 'wastePercent', { min: 0, max: 50 }),
        varietyA: form.elements.namedItem('varietyA').value,
        percentA: readNumber(form, 'percentA', { min: 0, max: 100 }),
        varietyB: form.elements.namedItem('varietyB').value,
        percentB: readNumber(form, 'percentB', { min: 0, max: 100 }),
        bagSize: readNumber(form, 'bagSize', { min: 0, max: 1_000_000 }),
        bagUnit: form.elements.namedItem('bagUnit').value,
      });
      const rows = [
        [copy.messages.area, `${format(result.areaInSelectedUnit)} ${copy.actions[result.areaUnit]}`],
        [copy.messages.baseSeed, `${format(result.baseKg)} kg (${format(result.baseKg / 0.45359237)} lb)`],
        [copy.messages.extraSeed, `${format(result.extraPercent)}%`],
        [copy.messages.totalSeed, `${format(result.totalKg)} kg (${format(result.totalLb)} lb)`],
        ...result.components.filter(({ sharePercent }) => sharePercent > 0).map(({ name, sharePercent, weightKg }) => [name, `${format(sharePercent)}% · ${format(weightKg)} kg`]),
        ...(result.bagsNeeded === null ? [] : [[copy.messages.bags, `${format(result.bagsNeeded, 0)} (${format(result.estimatedPackedKg)} kg total package weight)`]]),
      ];
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    for (const [name, value] of Object.entries({ area: '100', areaUnit: 'm2', seedingRate: '30', rateUnit: 'g-m2', wastePercent: '0', varietyA: 'Perennial ryegrass', percentA: '70', varietyB: 'Fine fescue', percentB: '30', bagSize: '1', bagUnit: 'kg' })) form.elements.namedItem(name).value = value;
    calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => { outputText = ''; clearResult(root); announce(root, ''); }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
}
