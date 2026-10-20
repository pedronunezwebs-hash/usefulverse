import { estimateJapanIncomeTax2026 } from './logic.mjs';

const root = document.querySelector('[data-japan-income-tax]');
if (root) {
  const copy = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const form = root.querySelector('form'); const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]'); const status = root.querySelector('[data-status]');
  const money = (amount) => new Intl.NumberFormat(document.documentElement.lang || 'ja', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 }).format(amount);
  const date = () => { const parts = new Intl.DateTimeFormat('en', { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date()); const get = (type) => parts.find((item) => item.type === type)?.value; return `${get('year')}-${get('month')}-${get('day')}`; };
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      const estimate = estimateJapanIncomeTax2026(form.elements.namedItem('income').value, date());
      const rows = [[copy.fields.taxableIncome, money(estimate.taxableIncome)], [copy.fields.baseIncomeTax, money(estimate.baseIncomeTax)], [copy.fields.reconstructionTax, money(estimate.reconstructionTax)], [copy.fields.combinedBeforeRounding, money(estimate.combinedBeforeRounding)], [copy.fields.nationalTaxDue, money(estimate.nationalTaxDue)], [copy.fields.marginalRate, `${estimate.marginalRate * 100}%`], [copy.fields.effectiveRate, new Intl.NumberFormat(document.documentElement.lang || 'ja', { style: 'percent', maximumFractionDigits: 1 }).format(estimate.effectiveRate)]];
      const list = document.createElement('dl');
      for (const [label, value] of rows) { const dt = document.createElement('dt'); dt.textContent = label; const dd = document.createElement('dd'); dd.textContent = value; list.append(dt, dd); }
      content.replaceChildren(list); result.hidden = false; status.textContent = copy.messages.complete; status.classList.remove('status--error');
    } catch (error) { status.textContent = copy.messages[error?.code] ?? copy.messages.error; status.classList.add('status--error'); result.hidden = true; }
  });
  form.addEventListener('reset', () => queueMicrotask(() => { content.replaceChildren(); result.hidden = true; status.textContent = ''; status.classList.remove('status--error'); }));
}
