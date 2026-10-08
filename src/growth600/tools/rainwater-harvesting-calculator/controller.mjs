import { calculateRainwaterHarvesting, parseMonthlyValues } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="rainwater-harvesting-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const format = (value) => numberFormat(document.documentElement.lang || 'en', value, 1);
  const volumeFactor = () => form.elements.namedItem('tankUnit').value === 'gal' ? 3.785411784 : 1;
  let outputText = '';
  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      const unitFactor = volumeFactor();
      const result = calculateRainwaterHarvesting({
        catchmentArea: readNumber(form, 'catchmentArea', { min: 0.001, max: 1_000_000_000 }),
        areaUnit: form.elements.namedItem('areaUnit').value,
        rainfallValues: parseMonthlyValues(form.elements.namedItem('rainfallValues').value, copy.fields.rainfallValues, { max: 100_000 }),
        rainfallUnit: form.elements.namedItem('rainfallUnit').value,
        runoffPercent: readNumber(form, 'runoffPercent', { min: 0, max: 100 }),
        tankCapacity: readNumber(form, 'tankCapacity', { min: 0.001, max: 1_000_000_000 }),
        tankUnit: form.elements.namedItem('tankUnit').value,
        startingStorage: readNumber(form, 'startingStorage', { min: 0, max: 1_000_000_000 }),
        monthlyDemandValues: parseMonthlyValues(form.elements.namedItem('monthlyDemandValues').value, copy.fields.monthlyDemandValues),
      });
      const unit = form.elements.namedItem('tankUnit').value;
      const rows = [
        [copy.messages.totalCollected, `${format(result.totalCollectedLiters / unitFactor)} ${unit}`],
        [copy.messages.totalDemand, `${format(result.totalDemandLiters / unitFactor)} ${unit}`],
        [copy.messages.totalOverflow, `${format(result.totalOverflowLiters / unitFactor)} ${unit}`],
        [copy.messages.unmetDemand, `${format(result.totalUnmetDemandLiters / unitFactor)} ${unit}`],
        [copy.messages.endingStorage, `${format(result.endingStorageLiters / unitFactor)} ${unit}`],
        ...result.months.map((month) => [copy.messages.months[month.month - 1], `${copy.messages.rainfall}: ${format(month.rainfall)} ${result.rainfallUnit}; ${copy.messages.collected}: ${format(month.collectedLiters / unitFactor)} ${unit}; ${copy.messages.demand}: ${format(month.demandLiters / unitFactor)} ${unit}; ${copy.messages.overflow}: ${format(month.overflowLiters / unitFactor)} ${unit}; ${copy.messages.storage}: ${format(month.endingStorageLiters / unitFactor)} ${unit}`]),
      ];
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    form.elements.namedItem('catchmentArea').value = '100';
    form.elements.namedItem('areaUnit').value = 'm2';
    form.elements.namedItem('rainfallUnit').value = 'mm';
    form.elements.namedItem('runoffPercent').value = '100';
    form.elements.namedItem('tankCapacity').value = '1000';
    form.elements.namedItem('tankUnit').value = 'L';
    form.elements.namedItem('startingStorage').value = '0';
    form.elements.namedItem('rainfallValues').value = ['10', ...Array(11).fill('0')].join('\n');
    form.elements.namedItem('monthlyDemandValues').value = Array(12).fill('0').join('\n');
    calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => { outputText = ''; clearResult(root); announce(root, ''); }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
}
