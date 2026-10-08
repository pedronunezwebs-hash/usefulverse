import { calculateWallpaper, WALLPAPER_LENGTH_TO_M } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="wallpaper-calculator"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const locale = document.documentElement.lang || 'en';
  const messages = copy.messages;
  let outputText = '';
  const format = (value) => numberFormat(locale, value, 2);

  function calculate(event) {
    event?.preventDefault();
    clearResult(root);
    outputText = '';
    try {
      const unit = form.elements.namedItem('unit').value;
      const factor = WALLPAPER_LENGTH_TO_M[unit];
      const areaFactor = factor ** 2;
      const result = calculateWallpaper({
        perimeter: readNumber(form, 'perimeter', { min: 0.1, max: 100_000 }),
        wallHeight: readNumber(form, 'wallHeight', { min: 0.1, max: 100 }),
        openingsArea: readNumber(form, 'openingsArea', { optional: true, min: 0, max: 1_000_000 }) ?? 0,
        rollWidth: readNumber(form, 'rollWidth', { min: 0.05, max: 20 }),
        rollLength: readNumber(form, 'rollLength', { min: 0.1, max: 200 }),
        patternRepeat: readNumber(form, 'patternRepeat', { optional: true, min: 0, max: 10 }) ?? 0,
        wastePercent: readNumber(form, 'wastePercent', { min: 0, max: 50 }),
        unit,
      });
      const rows = [
        [messages.netArea, `${format(result.netWallAreaM2 / areaFactor)} ${unit === 'm' ? 'm²' : 'ft²'}`],
        [messages.strips, format(result.stripsNeeded)],
        [messages.dropLength, `${format(result.dropLengthM / factor)} ${unit}`],
        [messages.dropsPerRoll, format(result.dropsPerRoll)],
        [messages.stripsToOrder, format(result.stripsToOrder)],
        [messages.rolls, format(result.rollsNeeded)],
      ];
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, messages.calculated, 'success');
    } catch {
      announce(root, messages.checkInputs, 'error');
    }
  }

  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    for (const [name, value] of Object.entries({ unit: 'm', perimeter: '12', wallHeight: '2.4', openingsArea: '0', rollWidth: '0.53', rollLength: '10.05', patternRepeat: '0.32', wastePercent: '10' })) form.elements.namedItem(name).value = value;
    calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => {
    outputText = '';
    for (const field of form.querySelectorAll('[aria-invalid]')) field.removeAttribute('aria-invalid');
    clearResult(root);
    announce(root, '');
  }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
}
