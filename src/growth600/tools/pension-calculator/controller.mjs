import { parseLocalizedNumber } from '../../../advanced-logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';
import { calculatePension } from './logic.mjs';

const root = document.querySelector('[data-tool="pension-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  const locale = () => document.documentElement.lang || 'en';
  const parse = (name) => parseLocalizedNumber(form.elements.namedItem(name).value, locale());
  let summary = '';
  function clear() { clearResult(root); content.replaceChildren(); summary = ''; }
  function money(amount, currency) {
    try { return new Intl.NumberFormat(locale(), { style: 'currency', currency, currencyDisplay: 'code', maximumFractionDigits: 2 }).format(amount); }
    catch { return `${numberFormat(locale(), amount, 2)} ${currency}`; }
  }
  function calculate(event) {
    event?.preventDefault(); clear();
    try {
      const currency = form.elements.namedItem('currencyCode').value.trim().toUpperCase();
      if (!/^[A-Z]{3}$/u.test(currency)) throw new RangeError('currency');
      const estimate = calculatePension({
        finalSalary: parse('finalSalary'), yearsOfService: parse('yearsOfService'), accrualPercent: parse('accrualPercent'),
        commutationPercent: parse('commutationPercent'), commutationFactor: parse('commutationFactor'),
      });
      const rows = [
        [copy.fields.annualPension, money(estimate.annualPension, currency)],
        [copy.fields.monthlyPension, money(estimate.monthlyPension, currency)],
        [copy.fields.convertedAnnualPension, money(estimate.convertedAnnualPension, currency)],
        [copy.fields.lumpSum, money(estimate.lumpSum, currency)],
        [copy.fields.remainingAnnualPension, money(estimate.remainingAnnualPension, currency)],
      ];
      showRows(root, rows); summary = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      result.hidden = false; announce(root, copy.messages.calculated, 'success');
    } catch { announce(root, copy.messages.checkInputs, 'error'); }
  }
  form.addEventListener('input', () => { clear(); announce(root, ''); });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => queueMicrotask(() => { clear(); announce(root, ''); }));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    form.elements.namedItem('finalSalary').value = '50000'; form.elements.namedItem('yearsOfService').value = '30';
    form.elements.namedItem('accrualPercent').value = '2'; form.elements.namedItem('commutationPercent').value = '0';
    form.elements.namedItem('commutationFactor').value = '12'; form.elements.namedItem('currencyCode').value = 'USD';
    calculate(); announce(root, copy.messages.exampleLoaded, 'success');
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (summary) copyText(root, summary, copy); });
}
