import { calculateWallFraming } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="wall-framing-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const locale = document.documentElement.lang || 'en';
  const format = (value, places = 2) => numberFormat(locale, value, places);
  let outputText = '';
  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      const openings = [1, 2, 3].map((index) => ({
        start: readNumber(form, `openingStart${index}`, { optional: true, min: 0, max: 100_000 }),
        width: readNumber(form, `openingWidth${index}`, { optional: true, min: 0.01, max: 100_000 }),
        breaksBottomPlate: form.elements.namedItem(`breakBottomPlate${index}`).checked,
      }));
      if (openings.some(({ start, width }) => (start === null) !== (width === null))) throw new RangeError('Each opening needs a start and width.');
      const result = calculateWallFraming({
        wallLength: readNumber(form, 'wallLength', { min: 0.1, max: 100_000 }),
        wallHeight: readNumber(form, 'wallHeight', { min: 0.1, max: 100 }),
        wallUnit: form.elements.namedItem('wallUnit').value,
        spacing: readNumber(form, 'spacing', { min: 0.01, max: 100_000 }),
        spacingUnit: form.elements.namedItem('spacingUnit').value,
        openings,
        topPlateRows: readNumber(form, 'topPlateRows', { min: 1, max: 5, integer: true }),
        bottomPlateRows: readNumber(form, 'bottomPlateRows', { min: 0, max: 3, integer: true }),
      });
      const unit = result.wallUnit;
      const rows = [
        [copy.messages.studCount, format(result.studCount, 0)],
        [copy.messages.studPositions, result.studPositions.map((position) => format(position)).join(', ') + ` ${unit}`],
        [copy.messages.studLinearLength, `${format(result.studLinearLength)} ${unit}`],
        [copy.messages.openings, format(result.openingCount, 0)],
        [copy.messages.topPlateMaterial, `${format(result.topPlateLength)} ${unit} (${format(result.topPlateRows, 0)} ${copy.messages.rows})`],
        [copy.messages.bottomPlateMaterial, `${format(result.bottomPlateLength)} ${unit} (${format(result.bottomPlateRows, 0)} ${copy.messages.rows})`],
        [copy.messages.totalPlateMaterial, `${format(result.totalPlateLength)} ${unit}`],
      ];
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    for (const [name, value] of Object.entries({ wallLength: '8', wallHeight: '8', wallUnit: 'ft', spacing: '16', spacingUnit: 'in', openingStart1: '2', openingWidth1: '3', openingStart2: '', openingWidth2: '', openingStart3: '', openingWidth3: '', topPlateRows: '2', bottomPlateRows: '1' })) form.elements.namedItem(name).value = value;
    form.elements.namedItem('breakBottomPlate1').checked = true;
    form.elements.namedItem('breakBottomPlate2').checked = false;
    form.elements.namedItem('breakBottomPlate3').checked = false;
    calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => { outputText = ''; clearResult(root); announce(root, ''); }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
}
