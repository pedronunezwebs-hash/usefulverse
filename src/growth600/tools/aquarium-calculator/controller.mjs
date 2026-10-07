import { calculateAquarium } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="aquarium-calculator"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const locale = document.documentElement.lang || 'en';
  const format = (value) => numberFormat(locale, value, 2);
  let outputText = '';

  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      const result = calculateAquarium({
        length: readNumber(form, 'length', { min: 0.01, max: 100_000 }),
        width: readNumber(form, 'width', { min: 0.01, max: 100_000 }),
        height: readNumber(form, 'height', { min: 0.01, max: 100_000 }),
        substrateDepth: readNumber(form, 'substrateDepth', { min: 0, max: 100_000 }),
        substrateSolidPercent: readNumber(form, 'substrateSolidPercent', { min: 0, max: 100 }),
        airGap: readNumber(form, 'airGap', { min: 0, max: 100_000 }),
        unit: form.elements.namedItem('dimensionUnit').value,
      });
      const rows = [
        [copy.messages.tankVolume, `${format(result.tankVolumeLiters)} L`],
        [copy.messages.substrateDisplacement, `${format(result.substrateDisplacementLiters)} L`],
        [copy.messages.airSpace, `${format(result.airSpaceLiters)} L`],
        [copy.messages.waterVolume, `${format(result.waterLiters)} L`],
        [copy.actions.usGallons, format(result.usGallons)],
        [copy.actions.imperialGallons, format(result.imperialGallons)],
        [copy.messages.waterMassKg, `${format(result.waterMassKg)} kg`],
        [copy.messages.waterMassLb, `${format(result.waterMassLb)} lb`],
      ];
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    for (const [name, value] of Object.entries({ dimensionUnit: 'cm', length: '60', width: '30', height: '36', substrateDepth: '5', substrateSolidPercent: '50', airGap: '3' })) form.elements.namedItem(name).value = value;
    calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => { outputText = ''; clearResult(root); announce(root, ''); }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
}
