import { calculateMiterAngles } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="miter-angle-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const compoundFields = root.querySelector('[data-compound-fields]');
  const modeField = form.elements.namedItem('mode');
  const format = (value) => numberFormat(document.documentElement.lang || 'en', value, 2);
  let outputText = '';
  const syncMode = () => { compoundFields.hidden = modeField.value !== 'compound'; };
  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      const result = calculateMiterAngles({
        mode: modeField.value,
        cornerAngle: readNumber(form, 'cornerAngle', { min: 1, max: 179 }),
        springAngle: modeField.value === 'compound' ? readNumber(form, 'springAngle', { min: 0, max: 90 }) : 38,
      });
      const rows = [
        [copy.messages.miterSetting, `${format(result.miterSawAngle)}°`],
        [copy.messages.bevelSetting, `${format(result.bevelSawAngle)}°`],
        [copy.messages.halfCorner, `${format(result.halfCornerAngle)}°`],
      ];
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }
  modeField.addEventListener('change', syncMode);
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    modeField.value = 'compound';
    form.elements.namedItem('cornerAngle').value = '90';
    form.elements.namedItem('springAngle').value = '38';
    syncMode();
    calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => { outputText = ''; syncMode(); clearResult(root); announce(root, ''); }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
  syncMode();
}
