import { estimateFranceIncomeTax2025 } from './logic.mjs';

const root = document.querySelector('[data-france-income-tax]');
if (root) {
  const copy = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const form = root.querySelector('form'); const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]'); const status = root.querySelector('[data-status]');
  const formatMoney = (amount) => new Intl.NumberFormat(document.documentElement.lang || 'fr', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);
  const formatPercent = (amount) => new Intl.NumberFormat(document.documentElement.lang || 'fr', { style: 'percent', maximumFractionDigits: 1 }).format(amount);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      const estimate = estimateFranceIncomeTax2025(form.elements.namedItem('income').value);
      const list = document.createElement('dl');
      for (const [label, value] of [[copy.fields.taxableIncomePerPart, formatMoney(estimate.taxableIncomePerPart)], [copy.fields.grossTax, formatMoney(estimate.tax)], [copy.fields.effectiveRate, formatPercent(estimate.effectiveRate)], [copy.fields.marginalRate, formatPercent(estimate.marginalRate)], [copy.fields.taxYear, copy.fields.taxYearValue]]) {
        const dt = document.createElement('dt'); dt.textContent = label; const dd = document.createElement('dd'); dd.textContent = value; list.append(dt, dd);
      }
      content.replaceChildren(list); result.hidden = false; status.textContent = copy.messages.complete; status.classList.remove('status--error');
    } catch (error) { status.textContent = copy.messages[error?.code] ?? copy.messages.error; status.classList.add('status--error'); result.hidden = true; }
  });
  form.addEventListener('reset', () => queueMicrotask(() => { content.replaceChildren(); result.hidden = true; status.textContent = ''; status.classList.remove('status--error'); }));
}
