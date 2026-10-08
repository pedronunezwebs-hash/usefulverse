import { calculateBrickMaterials } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="brick-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const locale = document.documentElement.lang || 'en';
  const format = (value, places = 1) => numberFormat(locale, value, places);
  let outputText = '';

  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      const openingCount = readNumber(form, 'openingCount', { min: 0, max: 1000, integer: true });
      const bagYieldText = form.elements.namedItem('bagYieldLiters').value.trim();
      const result = calculateBrickMaterials({
        wallLength: readNumber(form, 'wallLength', { min: Number.MIN_VALUE, max: 10_000 }),
        wallHeight: readNumber(form, 'wallHeight', { min: Number.MIN_VALUE, max: 10_000 }),
        wallUnit: form.elements.namedItem('wallUnit').value,
        brickLength: readNumber(form, 'brickLength', { min: 1, max: 100_000 }),
        brickHeight: readNumber(form, 'brickHeight', { min: 1, max: 100_000 }),
        brickDepth: readNumber(form, 'brickDepth', { min: 1, max: 100_000 }),
        brickUnit: form.elements.namedItem('brickUnit').value,
        joint: readNumber(form, 'joint', { min: 0, max: 1000 }),
        jointUnit: form.elements.namedItem('jointUnit').value,
        openingWidth: readNumber(form, 'openingWidth', { min: 0, max: 100_000 }),
        openingHeight: readNumber(form, 'openingHeight', { min: 0, max: 100_000 }),
        openingCount,
        wythes: readNumber(form, 'wythes', { min: 1, max: 4, integer: true }),
        wastePercent: readNumber(form, 'wastePercent', { min: 0, max: 50 }),
        bagYieldLiters: bagYieldText ? readNumber(form, 'bagYieldLiters', { min: 0.1, max: 100_000 }) : null,
      });
      const wallUnit = form.elements.namedItem('wallUnit').value;
      const rows = [
        [copy.messages.grossArea, `${format(wallUnit === 'ft' ? result.grossAreaFt2 : result.grossAreaM2)} ${wallUnit === 'ft' ? 'ft²' : 'm²'}`],
        [copy.messages.netArea, `${format(wallUnit === 'ft' ? result.netAreaFt2 : result.netAreaM2)} ${wallUnit === 'ft' ? 'ft²' : 'm²'}`],
        [copy.messages.courses, format(result.courses, 0)],
        [copy.messages.bricksPerCourse, format(result.bricksPerCourse, 0)],
        [copy.messages.bricksBeforeWaste, format(result.bricksBeforeWaste, 0)],
        [copy.messages.bricksToOrder, format(result.bricksToOrder, 0)],
        [copy.messages.mortarVolume, `${format(result.mortarLiters, 1)} L (${format(result.mortarCubicFeet, 2)} ft³)`],
      ];
      if (result.mortarBags !== null) rows.push([copy.messages.mortarBags, format(result.mortarBags, 0)]);
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    form.elements.namedItem('wallLength').value = '10'; form.elements.namedItem('wallHeight').value = '8';
    form.elements.namedItem('wallUnit').value = 'ft'; form.elements.namedItem('brickLength').value = '7.625';
    form.elements.namedItem('brickHeight').value = '2.25'; form.elements.namedItem('brickDepth').value = '3.625';
    form.elements.namedItem('brickUnit').value = 'in'; form.elements.namedItem('joint').value = '0.375';
    form.elements.namedItem('jointUnit').value = 'in'; form.elements.namedItem('openingWidth').value = '3';
    form.elements.namedItem('openingHeight').value = '7'; form.elements.namedItem('openingCount').value = '1';
    form.elements.namedItem('wythes').value = '1'; form.elements.namedItem('wastePercent').value = '5';
    form.elements.namedItem('bagYieldLiters').value = ''; calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => { outputText = ''; clearResult(root); announce(root, ''); }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
}
