import { calculateCustomerAcquisitionCost } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="customer-acquisition-cost-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  let output = '';
  const format = (value, currency) => new Intl.NumberFormat(document.documentElement.lang || 'en', { style: 'currency', currency, maximumFractionDigits: 2 }).format(value);
  function calculate(event) {
    event?.preventDefault();
    clearResult(root); output = '';
    try {
      const data = Object.fromEntries(new FormData(form).entries());
      const result = calculateCustomerAcquisitionCost(data);
      const rows = [
        [copy.fields.totalSpend, format(result.totalSpend, result.currency)],
        [copy.fields.customers, numberFormat(document.documentElement.lang || 'en', result.customers)],
        [copy.fields.cac, format(result.cac, result.currency)],
        [copy.fields.monthlyGrossProfit, format(result.monthlyGrossProfit, result.currency)],
        [copy.fields.payback, result.paybackMonths === null ? copy.fields.notAvailable : `${numberFormat(document.documentElement.lang || 'en', result.paybackMonths, 2)} ${copy.fields.months}`],
      ];
      showRows(root, rows);
      output = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch { announce(root, copy.messages.checkInputs, 'error'); }
  }
  form.addEventListener('input', () => { output = ''; clearResult(root); announce(root, ''); });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => { output = ''; clearResult(root); announce(root, ''); }, 0));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    for (const [name, value] of Object.entries({ marketingSpend: '1000', salesSpend: '0', toolsSpend: '0', agencySpend: '0', otherSpend: '0', newCustomers: '10', currency: 'USD', monthlyRevenuePerCustomer: '50', grossMarginPercent: '80' })) form.elements.namedItem(name).value = value;
    calculate();
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (output) copyText(root, output, copy); });
}
