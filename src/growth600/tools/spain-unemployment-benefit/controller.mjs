import { estimateSpainContributoryBenefit2026 } from './logic.mjs';

const root = document.querySelector('[data-spain-unemployment-benefit]');
if (root) {
  const copy = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const form = root.querySelector('form'); const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]'); const status = root.querySelector('[data-status]');
  const money = (value) => new Intl.NumberFormat(document.documentElement.lang || 'es', { style: 'currency', currency: 'EUR' }).format(value);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      const estimate = estimateSpainContributoryBenefit2026(form.elements.namedItem('base').value, form.elements.namedItem('day').value, form.elements.namedItem('children').value);
      const list = document.createElement('dl');
      for (const [label, value] of [[copy.fields.regulatoryBase, money(estimate.regulatoryBase)], [copy.fields.appliedRate, `${estimate.rate * 100}%`], [copy.fields.benefitMinimum, money(estimate.minimum)], [copy.fields.benefitMaximum, money(estimate.maximum)], [copy.fields.monthlyBenefit, money(estimate.monthlyAmount)]]) {
        const dt = document.createElement('dt'); dt.textContent = label; const dd = document.createElement('dd'); dd.textContent = value; list.append(dt, dd);
      }
      content.replaceChildren(list); result.hidden = false; status.textContent = copy.messages.complete; status.classList.remove('status--error');
    } catch (error) { status.textContent = copy.messages[error?.code] ?? copy.messages.error; status.classList.add('status--error'); result.hidden = true; }
  });
  form.addEventListener('reset', () => queueMicrotask(() => { content.replaceChildren(); result.hidden = true; status.textContent = ''; status.classList.remove('status--error'); }));
}
