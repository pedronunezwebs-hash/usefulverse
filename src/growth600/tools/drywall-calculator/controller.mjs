import { calculateDrywall, DRYWALL_LENGTH_TO_M } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="drywall-calculator"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const locale = document.documentElement.lang || 'en';
  const messages = copy.messages;
  let outputText = '';
  const format = (value) => numberFormat(locale, value, 2);

  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      const unit = form.elements.namedItem('unit').value;
      const result = calculateDrywall({
        roomLength: readNumber(form, 'roomLength', { min: 0.1, max: 10_000 }),
        roomWidth: readNumber(form, 'roomWidth', { min: 0.1, max: 10_000 }),
        wallHeight: readNumber(form, 'wallHeight', { min: 0.1, max: 10_000 }),
        openingArea: readNumber(form, 'openingArea', { optional: true, min: 0, max: 100_000_000 }) ?? 0,
        roomCount: readNumber(form, 'roomCount', { min: 1, max: 100, integer: true }),
        includeCeiling: form.elements.namedItem('includeCeiling').value,
        boardWidth: readNumber(form, 'boardWidth', { min: 0.1, max: 100 }),
        boardHeight: readNumber(form, 'boardHeight', { min: 0.1, max: 100 }),
        wastePercent: readNumber(form, 'wastePercent', { min: 0, max: 30 }),
        screwsPerBoard: readNumber(form, 'screwsPerBoard', { min: 1, max: 200, integer: true }),
        pricePerBoard: readNumber(form, 'pricePerBoard', { optional: true, min: 0, max: 1_000_000 }),
        unit,
      });
      const factor = DRYWALL_LENGTH_TO_M[unit];
      const area = (squareMeters) => `${format(squareMeters / (factor ** 2))} ${unit}²`;
      const rows = [
        [messages.wallArea, area(result.wallAreaM2)],
        [messages.ceilingArea, area(result.ceilingAreaM2)],
        [messages.totalArea, area(result.totalAreaM2)],
        [messages.boardCount, format(result.boards)],
        [messages.boardCoverage, area(result.boardCoverageM2)],
        [messages.estimatedScrews, format(result.estimatedScrews)],
        [messages.jointSeams, `${format(result.approximateJointSeamLengthM / factor)} ${unit}`],
      ];
      if (result.estimatedCost !== null) rows.push([messages.estimatedCost, format(result.estimatedCost)]);
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, messages.calculated, 'success');
    } catch (error) {
      if (error.message.startsWith('Opening area per room')) {
        const opening = form.elements.namedItem('openingArea');
        opening.setAttribute('aria-invalid', 'true');
        opening.focus();
      }
      announce(root, messages.checkInputs, 'error');
    }
  }

  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    for (const [name, value] of Object.entries({ unit: 'm', roomLength: '4', roomWidth: '3', wallHeight: '2.5', roomCount: '1', openingArea: '0', includeCeiling: 'true', boardWidth: '1.2', boardHeight: '2.4', wastePercent: '0', screwsPerBoard: '32', pricePerBoard: '' })) form.elements.namedItem(name).value = value;
    calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => {
    outputText = '';
    for (const field of form.querySelectorAll('[aria-invalid]')) field.removeAttribute('aria-invalid');
    clearResult(root); announce(root, '');
  }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
}
