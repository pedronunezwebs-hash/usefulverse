import { calculatePond } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="pond-volume-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const locale = document.documentElement.lang || 'en';
  const format = (value, places = 2) => numberFormat(locale, value, places);
  let outputText = '';
  function setDimensions() {
    const shape = form.elements.namedItem('shape').value;
    for (const panel of root.querySelectorAll('[data-pond-dimensions]')) panel.hidden = panel.dataset.pondDimensions !== shape;
  }
  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      const result = calculatePond({
        shape: form.elements.namedItem('shape').value,
        dimensionUnit: form.elements.namedItem('dimensionUnit').value,
        length: readNumber(form, 'length', { optional: true, min: 0.1, max: 100_000 }),
        width: readNumber(form, 'width', { optional: true, min: 0.1, max: 100_000 }),
        diameter: readNumber(form, 'diameter', { optional: true, min: 0.1, max: 100_000 }),
        averageDepth: readNumber(form, 'averageDepth', { min: 0.01, max: 100_000 }),
        maximumDepth: readNumber(form, 'maximumDepth', { min: 0.01, max: 100_000 }),
        edgeOverlap: readNumber(form, 'edgeOverlap', { min: 0, max: 100_000 }),
        fillPercent: readNumber(form, 'fillPercent', { min: 1, max: 100 }),
      });
      const unit = result.dimensionUnit;
      const areaUnit = unit === 'ft' ? 'ft²' : 'm²';
      const rows = [
        [copy.messages.footprint, `${format(result.footprintM2 / (unit === 'ft' ? 0.09290304 : 1))} ${areaUnit}`],
        [copy.messages.geometricCapacity, `${format(result.geometricCapacityM3, 3)} m³`],
        [copy.messages.filledVolume, `${format(result.filledVolumeM3, 3)} m³ (${format(result.fillPercent)}%)`],
        [copy.messages.liters, `${format(result.liters, 0)} L`],
        [copy.messages.usGallons, format(result.usGallons, 1)],
        [copy.messages.imperialGallons, format(result.imperialGallons, 1)],
        [copy.messages.linerLength, `${format(result.linerLength)} ${unit}`],
        [copy.messages.linerWidth, `${format(result.linerWidth)} ${unit}`],
        [copy.messages.linerArea, `${format(result.linerArea)} ${areaUnit}`],
      ];
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }
  form.elements.namedItem('shape').addEventListener('change', setDimensions);
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    for (const [name, value] of Object.entries({ shape: 'rectangle', dimensionUnit: 'm', length: '5', width: '3', ovalLength: '', ovalWidth: '', diameter: '', averageDepth: '0.6', maximumDepth: '0.8', edgeOverlap: '0.3', fillPercent: '90' })) form.elements.namedItem(name).value = value;
    setDimensions(); calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => { outputText = ''; clearResult(root); announce(root, ''); setDimensions(); }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
  setDimensions();
}
