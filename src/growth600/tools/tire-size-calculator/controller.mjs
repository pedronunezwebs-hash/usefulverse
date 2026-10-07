import { compareMetricTireSizes, parseMetricTireSize } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="tire-size-calculator"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const originalField = form.elements.namedItem('originalSize');
  const replacementField = form.elements.namedItem('replacementSize');
  const speedField = form.elements.namedItem('indicatedSpeed');
  const speedUnitField = form.elements.namedItem('speedUnit');
  const locale = document.documentElement.lang || 'en';
  const messages = copy.messages;
  let outputText = '';

  const format = (value, digits = 1) => numberFormat(locale, value, digits);
  const signed = (value, digits = 1) => `${value > 0 ? '+' : ''}${format(value, digits)}`;

  function syncSpeedBounds() {
    speedField.min = '1';
    speedField.max = speedUnitField.value === 'mph' ? '200' : '300';
  }

  syncSpeedBounds();
  speedUnitField.addEventListener('change', syncSpeedBounds);

  function calculate(event) {
    event?.preventDefault();
    clearResult(root);
    outputText = '';
    originalField.removeAttribute('aria-invalid');
    replacementField.removeAttribute('aria-invalid');
    try {
      const originalInput = originalField.value;
      const replacementInput = replacementField.value;
      let original;
      let replacement;
      try { original = parseMetricTireSize(originalInput); } catch {
        originalField.setAttribute('aria-invalid', 'true');
        originalField.focus();
        throw new RangeError();
      }
      try { replacement = parseMetricTireSize(replacementInput); } catch {
        replacementField.setAttribute('aria-invalid', 'true');
        replacementField.focus();
        throw new RangeError();
      }
      const unit = speedUnitField.value;
      const speed = readNumber(form, 'indicatedSpeed', { min: 1, max: unit === 'mph' ? 200 : 300 });
      const result = compareMetricTireSizes(originalInput, replacementInput, speed, unit);
      const rows = [
        [`${messages.diameter} (${originalInput.trim().toUpperCase()})`, `${format(original.diameterMm)} mm`],
        [`${messages.diameter} (${replacementInput.trim().toUpperCase()})`, `${format(replacement.diameterMm)} mm`],
        [`${messages.sidewall} (${originalInput.trim().toUpperCase()})`, `${format(original.sidewallMm)} mm`],
        [`${messages.sidewall} (${replacementInput.trim().toUpperCase()})`, `${format(replacement.sidewallMm)} mm`],
        [`${messages.circumference} (${originalInput.trim().toUpperCase()})`, `${format(original.circumferenceMm)} mm`],
        [`${messages.circumference} (${replacementInput.trim().toUpperCase()})`, `${format(replacement.circumferenceMm)} mm`],
        [messages.revolutions, `${format(replacement.revolutionsPerKm, 0)} /km`],
        [messages.diameterDifference, `${signed(result.diameterDifferenceMm)} mm`],
        [messages.diameterChange, `${signed(result.diameterChangePercent, 2)}%`],
        [messages.groundClearance, `${signed(result.groundClearanceChangeMm)} mm`],
        [messages.actualSpeed, `${format(result.estimatedActualSpeed)} ${unit}`],
      ];
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, result.identicalSize ? messages.sameSize : messages.calculated, 'success');
    } catch {
      announce(root, messages.checkInputs, 'error');
    }
  }

  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    originalField.value = '205/55R16';
    replacementField.value = '225/45R17';
    form.elements.namedItem('indicatedSpeed').value = '100';
    speedUnitField.value = 'km/h';
    syncSpeedBounds();
    originalField.removeAttribute('aria-invalid');
    replacementField.removeAttribute('aria-invalid');
    calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => {
    setTimeout(() => {
      outputText = '';
      originalField.removeAttribute('aria-invalid');
      replacementField.removeAttribute('aria-invalid');
      speedField.removeAttribute('aria-invalid');
      syncSpeedBounds();
      clearResult(root);
      announce(root, '');
    }, 0);
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
    if (outputText) copyText(root, outputText, copy);
  });
}
