import { calculateRoofing, SQFT_TO_M2 } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="roofing-calculator"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const locale = document.documentElement.lang || 'en';
  const messages = copy.messages;
  let outputText = '';
  const format = (value, places = 2) => numberFormat(locale, value, places);

  function calculate(event) {
    event?.preventDefault();
    clearResult(root);
    outputText = '';
    try {
      const result = calculateRoofing({
        projectedArea: readNumber(form, 'projectedArea', { min: 0.1, max: 100_000_000 }),
        areaUnit: form.elements.namedItem('areaUnit').value,
        rise: readNumber(form, 'rise', { min: 0, max: 100_000 }),
        run: readNumber(form, 'run', { min: 0.001, max: 100_000 }),
        pitchUnit: form.elements.namedItem('pitchUnit').value,
        wastePercent: readNumber(form, 'wastePercent', { min: 0, max: 30 }),
        bundlesPerSquare: readNumber(form, 'bundlesPerSquare', { min: 0.1, max: 20 }),
        pricePerBundle: readNumber(form, 'pricePerBundle', { optional: true, min: 0, max: 1_000_000 }),
      });
      const areaUnit = form.elements.namedItem('areaUnit').value;
      const area = (squareMetres) => `${format(areaUnit === 'ft2' ? squareMetres / SQFT_TO_M2 : squareMetres)} ${areaUnit === 'ft2' ? 'ft²' : 'm²'}`;
      const pitchRisePer12 = (result.riseM / result.runM) * 12;
      const rows = [
        [messages.projectedArea, area(result.projectedAreaM2)],
        [messages.roofArea, area(result.roofAreaM2)],
        [messages.extraArea, area(result.orderAreaM2)],
        [messages.pitch, `${format(pitchRisePer12)}:12`],
        [messages.slopeFactor, `×${format(result.slopeFactor, 3)}`],
        [messages.roofingSquares, format(result.roofingSquares)],
        [messages.bundles, format(result.bundles)],
      ];
      if (result.estimatedCost !== null) rows.push([messages.estimatedCost, format(result.estimatedCost)]);
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, messages.calculated, 'success');
    } catch {
      announce(root, messages.checkInputs, 'error');
    }
  }

  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    for (const [name, value] of Object.entries({ projectedArea: '1200', areaUnit: 'ft2', rise: '6', run: '12', pitchUnit: 'in', wastePercent: '10', bundlesPerSquare: '3', pricePerBundle: '' })) form.elements.namedItem(name).value = value;
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
