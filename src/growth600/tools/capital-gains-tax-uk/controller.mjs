import { estimateUkCapitalGains } from '../uk-capital-gains/logic.mjs';

const root = document.querySelector('[data-uk-capital-gains]');
if (root) {
  const copy = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const form = root.querySelector('form'); const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]'); const status = root.querySelector('[data-status]');
  const money = (amount) => new Intl.NumberFormat(document.documentElement.lang || 'en', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
  const ukDate = () => { const parts = new Intl.DateTimeFormat('en', { timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date()); const get = (type) => parts.find((item) => item.type === type)?.value; return `${get('year')}-${get('month')}-${get('day')}`; };
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      const estimate = estimateUkCapitalGains({ netGainsAfterLosses: form.elements.namedItem('gains').value, taxableIncome: form.elements.namedItem('income').value }, ukDate());
      const rows = [[copy.fields.annualExemptAmount, money(estimate.allowance)], [copy.fields.chargeableGains, money(estimate.chargeableGains)], [copy.fields.basicRateGains, money(estimate.basicRateGains)], [copy.fields.higherRateGains, money(estimate.higherRateGains)], [copy.fields.basicTax, money(estimate.basicTax)], [copy.fields.higherTax, money(estimate.higherTax)], [copy.fields.estimatedTax, money(estimate.estimatedTax)], [copy.fields.taxYear, estimate.taxYear]];
      const list = document.createElement('dl');
      for (const [label, value] of rows) { const dt = document.createElement('dt'); dt.textContent = label; const dd = document.createElement('dd'); dd.textContent = value; list.append(dt, dd); }
      content.replaceChildren(list); result.hidden = false; status.textContent = copy.messages.complete; status.classList.remove('status--error');
    } catch (error) { status.textContent = copy.messages[error?.code] ?? copy.messages.error; status.classList.add('status--error'); result.hidden = true; }
  });
  form.addEventListener('reset', () => queueMicrotask(() => { content.replaceChildren(); result.hidden = true; status.textContent = ''; status.classList.remove('status--error'); }));
}
