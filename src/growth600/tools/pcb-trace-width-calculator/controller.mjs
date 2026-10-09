import { calculatePcbTraceWidth } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';
import { parseLocalizedNumber } from '../../../advanced-logic.mjs';

const root = document.querySelector('[data-tool="pcb-trace-width-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const mode = form.elements.namedItem('mode');
  const locale = () => document.documentElement.lang || 'en';
  const parseNumber = (value) => parseLocalizedNumber(value, locale());
  const format = (value, digits = 6) => numberFormat(locale(), value, digits);
  let output = '';

  function syncMode() {
    for (const group of root.querySelectorAll('[data-pcb-trace-inputs]')) {
      const active = group.dataset.pcbTraceInputs === mode.value;
      group.hidden = !active;
      for (const input of group.querySelectorAll('input, select')) input.required = active;
    }
  }

  function calculate(event) {
    event?.preventDefault();
    clearResult(root);
    output = '';
    try {
      const values = {
        mode: mode.value,
        conductor: form.elements.namedItem('conductor').value,
        copperWeightOz: parseNumber(form.elements.namedItem('copperWeightOz').value),
        temperatureRiseC: parseNumber(form.elements.namedItem('temperatureRiseC').value),
      };
      if (mode.value === 'required-width') values.currentA = parseNumber(form.elements.namedItem('currentA').value);
      else {
        values.width = parseNumber(form.elements.namedItem('width').value);
        values.widthUnit = form.elements.namedItem('widthUnit').value;
      }
      const result = calculatePcbTraceWidth(values);
      const rows = [
        [copy.fields.resultModel, result.conductor === 'external' ? copy.messages.externalModel : copy.messages.internalModel],
        [copy.fields.resultWidth, `${format(result.widthMm)} mm · ${format(result.widthMil)} mil`],
        [copy.fields.resultMil, `${format(result.widthMil)} mil`],
        [copy.fields.resultMm, `${format(result.widthMm)} mm`],
        [copy.fields.resultCurrent, `${format(result.currentA)} A`],
        [copy.fields.resultArea, `${format(result.areaMil2)} mil²`],
      ];
      showRows(root, rows);
      output = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  mode.addEventListener('change', () => { syncMode(); clearResult(root); output = ''; announce(root, ''); });
  form.addEventListener('input', () => { clearResult(root); output = ''; announce(root, ''); });
  form.addEventListener('submit', calculate);
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    form.elements.namedItem('conductor').value = 'external';
    form.elements.namedItem('copperWeightOz').value = '1';
    form.elements.namedItem('temperatureRiseC').value = '10';
    if (mode.value === 'required-width') form.elements.namedItem('currentA').value = '2';
    else { form.elements.namedItem('width').value = '1'; form.elements.namedItem('widthUnit').value = 'mm'; }
    syncMode();
    calculate();
  });
  form.addEventListener('reset', () => setTimeout(() => { output = ''; syncMode(); clearResult(root); announce(root, ''); }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (output) copyText(root, output, copy); });
  syncMode();
}
