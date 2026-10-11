import { parseLocalizedNumber } from '../../../advanced-logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';
import { calculateLifetimeValue } from './logic.mjs';

const root = document.querySelector('[data-tool="lifetime-value-calculator"]');
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
      const estimate = calculateLifetimeValue({
        monthlyRevenue: parse('monthlyRevenue'), grossMarginPercent: parse('grossMarginPercent'), monthlyChurnPercent: parse('monthlyChurnPercent'),
        customerAcquisitionCost: parse('customerAcquisitionCost'), currency,
      });
      const rows = [
        [copy.fields.monthlyGrossProfit, money(estimate.monthlyGrossProfit, currency)],
        [copy.fields.expectedLifetimeMonths, numberFormat(locale(), estimate.expectedLifetimeMonths, 2)],
        [copy.fields.lifetimeValue, money(estimate.lifetimeValue, currency)],
        ...(estimate.cacPaybackMonths === null ? [] : [[copy.fields.cacPaybackMonths, numberFormat(locale(), estimate.cacPaybackMonths, 2)]]),
        ...(estimate.lifetimeValueToCac === null ? [] : [[copy.fields.lifetimeValueToCac, `${numberFormat(locale(), estimate.lifetimeValueToCac, 2)}×`]]),
      ];
      showRows(root, rows); summary = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      result.hidden = false; announce(root, copy.messages.calculated, 'success');
    } catch { announce(root, copy.messages.checkInputs, 'error'); }
  }
  form.addEventListener('input', () => { clear(); announce(root, ''); });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => queueMicrotask(() => { clear(); announce(root, ''); }));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    form.elements.namedItem('monthlyRevenue').value = '100'; form.elements.namedItem('grossMarginPercent').value = '50';
    form.elements.namedItem('monthlyChurnPercent').value = '5'; form.elements.namedItem('customerAcquisitionCost').value = '0';
    form.elements.namedItem('currencyCode').value = 'USD'; calculate(); announce(root, copy.messages.exampleLoaded, 'success');
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (summary) copyText(root, summary, copy); });
}
