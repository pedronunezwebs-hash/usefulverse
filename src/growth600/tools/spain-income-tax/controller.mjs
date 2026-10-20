import { estimateSpainNationalIncomeTax2025 } from './logic.mjs';

const root = document.querySelector('[data-spain-income-tax]');
if (root) {
  const copy = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const form = root.querySelector('form'); const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]'); const status = root.querySelector('[data-status]');
  const money = (value) => new Intl.NumberFormat(document.documentElement.lang || 'es', { style: 'currency', currency: 'EUR' }).format(value);
  const percent = (value) => new Intl.NumberFormat(document.documentElement.lang || 'es', { style: 'percent', maximumFractionDigits: 1 }).format(value);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      const estimate = estimateSpainNationalIncomeTax2025(form.elements.namedItem('base').value);
      const list = document.createElement('dl');
      for (const [label, value] of [[copy.fields.taxableBaseAfterMinimum, money(estimate.taxableBaseAfterMinimum)], [copy.fields.nationalTaxComponent, money(estimate.tax)], [copy.fields.marginalRate, percent(estimate.marginalRate)], [copy.fields.effectiveRate, percent(estimate.effectiveRate)]]) {
        const dt = document.createElement('dt'); dt.textContent = label; const dd = document.createElement('dd'); dd.textContent = value; list.append(dt, dd);
      }
      content.replaceChildren(list); result.hidden = false; status.textContent = copy.messages.complete; status.classList.remove('status--error');
    } catch (error) { status.textContent = copy.messages[error?.code] ?? copy.messages.error; status.classList.add('status--error'); result.hidden = true; }
  });
  form.addEventListener('reset', () => queueMicrotask(() => { content.replaceChildren(); result.hidden = true; status.textContent = ''; status.classList.remove('status--error'); }));
}
