import { calculateRamp } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="ramp-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const format = (value) => numberFormat(document.documentElement.lang || 'en', value, 3);
  let outputText = '';
  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      const result = calculateRamp({
        rise: readNumber(form, 'rise', { min: 0.001, max: 1_000_000 }),
        slopeRatioDenominator: readNumber(form, 'slopeRatioDenominator', { min: 1, max: 1000, integer: true }),
        landingCount: readNumber(form, 'landingCount', { min: 0, max: 100, integer: true }),
        landingDepth: readNumber(form, 'landingDepth', { optional: true, min: 0.001, max: 1_000_000 }),
        unit: form.elements.namedItem('unit').value,
      });
      const rows = [
        [copy.messages.horizontalRun, `${format(result.horizontalRun)} ${result.unit}`],
        [copy.messages.rampSurface, `${format(result.rampSurface)} ${result.unit}`],
        [copy.messages.landings, `${format(result.landingCount)} × ${format(result.landingDepth ?? 0)} ${result.unit}`],
        [copy.messages.totalHorizontal, `${format(result.totalHorizontalLength)} ${result.unit}`],
        [copy.messages.slopePercent, `${format(result.slopePercent)}%`],
        [copy.messages.angle, `${format(result.slopeAngleDegrees)}°`],
      ];
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    for (const [name, value] of Object.entries({ rise: '1', slopeRatioDenominator: '12', landingCount: '0', landingDepth: '1.5', unit: 'm' })) form.elements.namedItem(name).value = value;
    calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => { outputText = ''; clearResult(root); announce(root, ''); }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
}
