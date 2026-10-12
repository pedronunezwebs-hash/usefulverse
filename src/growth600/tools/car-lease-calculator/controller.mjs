import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';
import { parseLocalizedNumber } from '../../../advanced-logic.mjs';
import { calculateCarLease } from './logic.mjs';

const root = document.querySelector('[data-tool="car-lease-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const locale = () => document.documentElement.lang || 'en';
  let output = '';
  const format = (value) => numberFormat(locale(), value, 2);
  const calculate = (event) => {
    event?.preventDefault(); clearResult(root); output = '';
    try {
      const read = (name) => parseLocalizedNumber(form.elements.namedItem(name).value, locale());
      const result = calculateCarLease({
        capitalizedCost: read('capitalizedCost'), residualValue: read('residualValue'), termMonths: read('termMonths'),
        moneyFactor: read('moneyFactor'), capCostReduction: read('capCostReduction'), taxPercent: read('taxPercent'),
      });
      const rows = [
        [copy.fields.monthlyDepreciation, format(result.monthlyDepreciation)],
        [copy.fields.monthlyRentCharge, format(result.monthlyRentCharge)],
        [copy.fields.monthlyPretaxPayment, format(result.monthlyPretaxPayment)],
        [copy.fields.estimatedMonthlyTax, format(result.estimatedMonthlyTax)],
        [copy.fields.estimatedMonthlyPayment, format(result.estimatedMonthlyPayment)],
        [copy.fields.estimatedPaymentsPlusCapReduction, format(result.estimatedPaymentsPlusCapReduction)],
      ];
      showRows(root, rows);
      output = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch { announce(root, copy.messages.checkInputs, 'error'); }
  };
  form.addEventListener('submit', calculate);
  form.addEventListener('input', () => { clearResult(root); output = ''; announce(root, ''); });
  form.addEventListener('reset', () => setTimeout(() => { clearResult(root); output = ''; announce(root, ''); }, 0));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    for (const [name, value] of Object.entries({ capitalizedCost: '30000', residualValue: '18000', termMonths: '36', moneyFactor: '0.002', capCostReduction: '2000', taxPercent: '8' })) form.elements.namedItem(name).value = value;
    calculate();
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (output) copyText(root, output, copy); });
}
