import { announce } from '../controller-helpers.mjs';
import { parseLocalizedNumber } from '../../../advanced-logic.mjs';
import { calculateDebtToIncome } from './logic.mjs';

const root = document.querySelector('[data-tool="debt-to-income-ratio-calculator"]');
if (root) {
  const copy = JSON.parse(root.querySelector('[data-tool-copy]').textContent);
  const form = root.querySelector('#tool-form');
  const output = root.querySelector('[data-dti-result]');
  const valuesNode = root.querySelector('[data-dti-values]');
  const status = root.querySelector('[data-status]');
  let latest = null;
  const locale = () => document.documentElement.lang || 'en';
  const read = (name) => parseLocalizedNumber(form.elements.namedItem(name).value, locale());
  const formatAmount = (value) => new Intl.NumberFormat(locale(), { maximumFractionDigits: 2 }).format(value);
  const formatPercent = (value) => `${new Intl.NumberFormat(locale(), { maximumFractionDigits: 2 }).format(value)}%`;
  function notify(message, kind = '') { status.textContent = message; announce(root, message, kind); }
  function render(result) {
    latest = result;
    const rows = [
      [copy.fields.housingRatio, formatPercent(result.housingRatio)],
      [copy.fields.totalRatio, formatPercent(result.totalRatio)],
      [copy.fields.totalDebt, formatAmount(result.totalMonthlyDebt)],
    ];
    valuesNode.replaceChildren();
    for (const [term, value] of rows) {
      const dt = document.createElement('dt'); dt.textContent = term;
      const dd = document.createElement('dd'); dd.textContent = value;
      valuesNode.append(dt, dd);
    }
    output.hidden = false;
    notify(copy.messages.calculated, 'success');
  }
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      render(calculateDebtToIncome({
        grossMonthlyIncome: read('grossMonthlyIncome'),
        housingPayment: read('housingPayment'),
        monthlyDebts: ['debt1', 'debt2', 'debt3', 'debt4'].map(read),
      }));
    } catch { latest = null; output.hidden = true; notify(copy.messages.checkInputs, 'error'); }
  });
  root.addEventListener('click', async (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'example') {
      form.elements.namedItem('grossMonthlyIncome').value = '5000';
      form.elements.namedItem('housingPayment').value = '1200';
      form.elements.namedItem('debt1').value = '500';
      form.elements.namedItem('debt2').value = '300';
      form.elements.namedItem('debt3').value = '0';
      form.elements.namedItem('debt4').value = '0';
      try { render(calculateDebtToIncome({ grossMonthlyIncome: 5000, housingPayment: 1200, monthlyDebts: [500, 300] })); }
      catch { notify(copy.messages.checkInputs, 'error'); }
    } else if (action === 'copy' && latest) {
      const text = `${copy.fields.housingRatio}: ${formatPercent(latest.housingRatio)}\n${copy.fields.totalRatio}: ${formatPercent(latest.totalRatio)}\n${copy.fields.totalDebt}: ${formatAmount(latest.totalMonthlyDebt)}`;
      try { await navigator.clipboard.writeText(text); notify(copy.messages.copied, 'success'); }
      catch { notify(copy.messages.copyUnavailable, 'error'); }
    }
  });
  form.addEventListener('reset', () => { setTimeout(() => { latest = null; output.hidden = true; status.textContent = ''; }, 0); });
}
