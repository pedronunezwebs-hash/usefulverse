import { calculateRoofPitch } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="roof-pitch-calculator"]');
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
      const result = calculateRoofPitch({
        rise: readNumber(form, 'rise', { min: 0.001, max: 100_000 }),
        run: readNumber(form, 'run', { min: 0.001, max: 100_000 }),
        overhang: readNumber(form, 'overhang', { optional: true, min: 0, max: 100_000 }),
        unit,
      });
      const rows = [
        [messages.pitch, `${format(result.pitchRisePer12)}:12`],
        [messages.slopePercent, `${format(result.slopePercent)}%`],
        [messages.angleDegrees, `${format(result.angleDegrees)}°`],
        [messages.angleRadians, `${format(result.angleRadians)} rad`],
        [messages.rafterLength, `${format(result.rafterLengthM / ({ m: 1, cm: 0.01, mm: 0.001, ft: 0.3048, in: 0.0254 })[unit])} ${unit}`],
      ];
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, messages.calculated, 'success');
    } catch {
      announce(root, messages.checkInputs, 'error');
    }
  }
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    form.elements.namedItem('unit').value = 'm';
    form.elements.namedItem('rise').value = '3';
    form.elements.namedItem('run').value = '3';
    form.elements.namedItem('overhang').value = '0';
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
