import { estimateCanadaCppEi } from './logic.mjs';

const root = document.querySelector('[data-canada-payroll]');
if (root) {
  const copy = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const form = root.querySelector('form'); const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]'); const status = root.querySelector('[data-status]');
  const money = (amount) => new Intl.NumberFormat(document.documentElement.lang || 'en', { style: 'currency', currency: 'CAD', maximumFractionDigits: 2 }).format(amount);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      const estimate = estimateCanadaCppEi(form.elements.namedItem('income').value, form.elements.namedItem('age').value);
      const rows = [[copy.fields.cppBase, money(estimate.cppBase)], [copy.fields.cppFirstAdditional, money(estimate.cppFirstAdditional)], [copy.fields.cppSecondAdditional, money(estimate.cppSecondAdditional)], [copy.fields.cppEmployee, money(estimate.cppEmployee)], [copy.fields.eiEmployee, money(estimate.eiEmployee)], [copy.fields.employeeTotal, money(estimate.employeeTotal)], [copy.fields.cppEmployer, money(estimate.cppEmployer)], [copy.fields.eiEmployer, money(estimate.eiEmployer)], [copy.fields.employerTotal, money(estimate.employerTotal)], [copy.fields.combinedTotal, money(estimate.combinedTotal)], [copy.fields.tableYear, '2026']];
      const list = document.createElement('dl');
      for (const [label, value] of rows) { const dt = document.createElement('dt'); dt.textContent = label; const dd = document.createElement('dd'); dd.textContent = value; list.append(dt, dd); }
      content.replaceChildren(list); result.hidden = false; status.textContent = copy.messages.complete; status.classList.remove('status--error');
    } catch (error) { status.textContent = copy.messages[error?.code] ?? copy.messages.error; status.classList.add('status--error'); result.hidden = true; }
  });
  form.addEventListener('reset', () => queueMicrotask(() => { content.replaceChildren(); result.hidden = true; status.textContent = ''; status.classList.remove('status--error'); }));
}
