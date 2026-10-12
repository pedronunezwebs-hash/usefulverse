import { parseLocalizedNumber } from '../../../advanced-logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';
import { calculateOvertime } from './logic.mjs';

const root = document.querySelector('[data-tool="overtime-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const locale = () => document.documentElement.lang || 'en';
  let output = '';
  const format = (value) => numberFormat(locale(), value, 2);

  function calculate(event) {
    event?.preventDefault(); clearResult(root); output = '';
    try {
      const read = (name) => parseLocalizedNumber(form.elements.namedItem(name).value, locale());
      const result = calculateOvertime({ totalHours: read('totalHours'), hourlyRate: read('hourlyRate'), thresholdHours: read('thresholdHours'), overtimeMultiplier: read('overtimeMultiplier') });
      const rows = [
        [copy.fields.regularHours, `${format(result.regularHours)} h`],
        [copy.fields.overtimeHours, `${format(result.overtimeHours)} h`],
        [copy.fields.regularPay, format(result.regularPay)],
        [copy.fields.overtimePay, format(result.overtimePay)],
        [copy.fields.totalPay, format(result.totalPay)],
      ];
      if (result.blendedHourlyRate !== null) rows.push([copy.fields.blendedHourlyRate, format(result.blendedHourlyRate)]);
      showRows(root, rows); output = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch { announce(root, copy.messages.checkInputs, 'error'); }
  }

  form.addEventListener('submit', calculate);
  form.addEventListener('input', () => { clearResult(root); output = ''; announce(root, ''); });
  form.addEventListener('reset', () => setTimeout(() => { clearResult(root); output = ''; announce(root, ''); }, 0));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    for (const [name, value] of Object.entries({ totalHours: '45', hourlyRate: '20', thresholdHours: '40', overtimeMultiplier: '1.5' })) form.elements.namedItem(name).value = value;
    calculate();
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (output) copyText(root, output, copy); });
}
