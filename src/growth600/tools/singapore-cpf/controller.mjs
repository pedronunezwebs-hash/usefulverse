import { estimateSingaporeCpf2026 } from './logic.mjs';

const root = document.querySelector('[data-singapore-cpf]');
if (root) {
  const copy = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const form = root.querySelector('form'); const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]'); const status = root.querySelector('[data-status]');
  const money = (amount) => new Intl.NumberFormat(document.documentElement.lang || 'en', { style: 'currency', currency: 'SGD', maximumFractionDigits: 0 }).format(amount);
  const asOf = () => {
    const parts = new Intl.DateTimeFormat('en', { timeZone: 'Asia/Singapore', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
    const part = (type) => parts.find((item) => item.type === type)?.value;
    return `${part('year')}-${part('month')}-${part('day')}`;
  };
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      const estimate = estimateSingaporeCpf2026(form.elements.namedItem('age').value, form.elements.namedItem('wage').value, asOf());
      const rows = [[copy.fields.cappedWage, money(estimate.wageSubjectToCpf)], [copy.fields.employerRate, `${estimate.employerRate}%`], [copy.fields.employeeRate, `${estimate.employeeRate}%`], [copy.fields.employer, money(estimate.employer)], [copy.fields.employee, money(estimate.employee)], [copy.fields.total, money(estimate.total)], [copy.fields.tableYear, '2026']];
      const list = document.createElement('dl');
      for (const [label, value] of rows) { const dt = document.createElement('dt'); dt.textContent = label; const dd = document.createElement('dd'); dd.textContent = value; list.append(dt, dd); }
      content.replaceChildren(list); result.hidden = false; status.textContent = copy.messages.complete; status.classList.remove('status--error');
    } catch (error) { status.textContent = copy.messages[error?.code] ?? copy.messages.error; status.classList.add('status--error'); result.hidden = true; }
  });
  form.addEventListener('reset', () => queueMicrotask(() => { content.replaceChildren(); result.hidden = true; status.textContent = ''; status.classList.remove('status--error'); }));
}
