import { estimateIndiaHraExemption } from './logic.mjs';

const root = document.querySelector('[data-india-hra]');
if (root) {
  const copy = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const form = root.querySelector('form'); const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]'); const status = root.querySelector('[data-status]');
  const money = (value) => new Intl.NumberFormat(document.documentElement.lang || 'en-IN', { style: 'currency', currency: 'INR' }).format(value);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      const estimate = estimateIndiaHraExemption(form.elements.namedItem('basic').value, form.elements.namedItem('da').value, form.elements.namedItem('hra').value, form.elements.namedItem('rent').value, form.elements.namedItem('city').value);
      const list = document.createElement('dl');
      for (const [label, value] of [[copy.fields.salary, money(estimate.salary)], [copy.fields.actualHraCandidate, money(estimate.candidates.actualHra)], [copy.fields.rentCandidate, money(estimate.candidates.rentLessTenPercent)], [copy.fields.cityCandidate, money(estimate.candidates.citySalaryLimit)], [copy.fields.exemption, money(estimate.exemption)], [copy.fields.taxableHra, money(estimate.taxableHra)]]) {
        const dt = document.createElement('dt'); dt.textContent = label; const dd = document.createElement('dd'); dd.textContent = value; list.append(dt, dd);
      }
      content.replaceChildren(list); result.hidden = false; status.textContent = copy.messages.complete; status.classList.remove('status--error');
    } catch (error) { status.textContent = copy.messages[error?.code] ?? copy.messages.error; status.classList.add('status--error'); result.hidden = true; }
  });
  form.addEventListener('reset', () => queueMicrotask(() => { content.replaceChildren(); result.hidden = true; status.textContent = ''; status.classList.remove('status--error'); }));
}
