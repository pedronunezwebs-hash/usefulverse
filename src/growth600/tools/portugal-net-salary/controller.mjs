import { estimatePortugalNetSalary2026 } from './logic.mjs';

const root = document.querySelector('[data-portugal-net-salary]');
if (root) {
  const copy = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const form = root.querySelector('form'); const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]'); const status = root.querySelector('[data-status]');
  const money = (value) => new Intl.NumberFormat(document.documentElement.lang || 'pt', { style: 'currency', currency: 'EUR' }).format(value);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      const estimate = estimatePortugalNetSalary2026(form.elements.namedItem('gross').value);
      const list = document.createElement('dl');
      for (const [label, value] of [[copy.fields.grossMonthly, money(estimate.grossMonthly)], [copy.fields.irsWithholding, money(estimate.irsWithholding)], [copy.fields.socialSecurity, money(estimate.socialSecurity)], [copy.fields.netMonthly, money(estimate.netMonthly)], [copy.fields.marginalRate, `${estimate.marginalRate * 100}%`]]) {
        const dt = document.createElement('dt'); dt.textContent = label; const dd = document.createElement('dd'); dd.textContent = value; list.append(dt, dd);
      }
      content.replaceChildren(list); result.hidden = false; status.textContent = copy.messages.complete; status.classList.remove('status--error');
    } catch (error) { status.textContent = copy.messages[error?.code] ?? copy.messages.error; status.classList.add('status--error'); result.hidden = true; }
  });
  form.addEventListener('reset', () => queueMicrotask(() => { content.replaceChildren(); result.hidden = true; status.textContent = ''; status.classList.remove('status--error'); }));
}
