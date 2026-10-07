import { calculateGearRatio } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="gear-ratio-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const format = (value, digits = 3) => numberFormat(document.documentElement.lang || 'en', value, digits);
  let outputText = '';

  function calculate(event) {
    event?.preventDefault();
    clearResult(root);
    outputText = '';
    try {
      const result = calculateGearRatio({
        stages: form.elements.namedItem('stages').value,
        inputRpm: form.elements.namedItem('inputRpm').value.trim(),
        inputTorque: form.elements.namedItem('inputTorque').value.trim(),
        efficiencyPercent: form.elements.namedItem('efficiencyPercent').value.trim(),
        driveType: form.elements.namedItem('driveType').value,
      });
      const rows = [
        [copy.messages.overallRatio, `${format(result.ratio)}:1 (${result.ratio > 1 ? copy.messages.reduction : result.ratio < 1 ? copy.messages.speedIncrease : copy.messages.noRatioChange})`],
        [copy.messages.outputSpeed, `${format(result.outputRpm)} RPM`],
        [copy.messages.stageCount, format(result.stageCount, 0)],
        [copy.messages.direction, result.outputDirection === 'same' ? copy.messages.sameDirection : copy.messages.reversedDirection],
      ];
      if (result.idealOutputTorque !== null) {
        rows.push([copy.messages.idealOutputTorque, `${format(result.idealOutputTorque)} N·m`]);
        if (result.efficiencyPercent !== null) rows.push([copy.messages.estimatedOutputTorque, `${format(result.estimatedOutputTorque)} N·m`]);
      }
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      const stages = form.elements.namedItem('stages');
      stages.setAttribute('aria-invalid', 'true');
      stages.focus();
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  form.elements.namedItem('stages').addEventListener('input', (event) => event.currentTarget.removeAttribute('aria-invalid'));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    form.elements.namedItem('stages').value = '20:40';
    form.elements.namedItem('inputRpm').value = '1500';
    form.elements.namedItem('inputTorque').value = '10';
    form.elements.namedItem('efficiencyPercent').value = '';
    form.elements.namedItem('driveType').value = 'gears';
    calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => {
    outputText = '';
    form.elements.namedItem('stages').removeAttribute('aria-invalid');
    clearResult(root);
    announce(root, '');
  }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
    if (outputText) copyText(root, outputText, copy);
  });
}
