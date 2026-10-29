import { estimatePhilippinesSss } from './logic.mjs';

const root = document.querySelector('[data-philippines-sss]');
if (root) {
  const copy = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const form = root.querySelector('form');
  const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  const status = root.querySelector('[data-status]');
  const locale = document.documentElement.lang || 'en';
  const money = (amount) => new Intl.NumberFormat(locale, { style: 'currency', currency: 'PHP', maximumFractionDigits: 2 }).format(amount);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      const estimate = estimatePhilippinesSss(form.elements.namedItem('salary').value);
      const rows = [
        [copy.fields.msc, money(estimate.msc)], [copy.fields.employerRegular, money(estimate.employerRegular)],
        [copy.fields.employerMpf, money(estimate.employerMpf)], [copy.fields.employerEc, money(estimate.ecEmployer)],
        [copy.fields.employerTotal, money(estimate.employerTotal)], [copy.fields.employeeRegular, money(estimate.employeeRegular)],
        [copy.fields.employeeMpf, money(estimate.employeeMpf)], [copy.fields.employeeTotal, money(estimate.employeeTotal)],
        [copy.fields.combinedTotal, money(estimate.combinedTotal)], [copy.fields.tableYear, String(estimate.tableYear)],
      ];
      const list = document.createElement('dl');
      for (const [label, value] of rows) { const dt = document.createElement('dt'); dt.textContent = label; const dd = document.createElement('dd'); dd.textContent = value; list.append(dt, dd); }
      content.replaceChildren(list); result.hidden = false; status.textContent = copy.messages.complete; status.classList.remove('status--error');
    } catch (error) { status.textContent = copy.messages[error?.code] ?? copy.messages.error; status.classList.add('status--error'); result.hidden = true; }
  });
  form.addEventListener('reset', () => queueMicrotask(() => { content.replaceChildren(); result.hidden = true; status.textContent = ''; status.classList.remove('status--error'); }));
}
