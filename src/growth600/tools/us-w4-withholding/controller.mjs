import { estimateUsW4Withholding } from './logic.mjs';

const root = document.querySelector('[data-us-w4-withholding]');
if (root) {
  const copy = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const form = root.querySelector('form'); const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]'); const status = root.querySelector('[data-status]');
  const money = (amount) => new Intl.NumberFormat(document.documentElement.lang || 'en', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      const estimate = estimateUsW4Withholding({
        wagesPerPeriod: form.elements.namedItem('wages').value,
        frequency: form.elements.namedItem('frequency').value,
        filingStatus: form.elements.namedItem('filingStatus').value,
        step2: form.elements.namedItem('step2').checked,
        step3Credits: form.elements.namedItem('step3').value,
        step4aOtherIncome: form.elements.namedItem('step4a').value,
        step4bDeductions: form.elements.namedItem('step4b').value,
        step4cExtra: form.elements.namedItem('step4c').value,
      });
      const rows = [[copy.fields.adjustedAnnualWages, money(estimate.adjustedAnnualWages)], [copy.fields.perPaycheck, money(estimate.withholding)], [copy.fields.annualizedWithholding, money(estimate.withholding * estimate.periods)], [copy.fields.taxYear, String(estimate.taxYear)]];
      const list = document.createElement('dl');
      for (const [label, value] of rows) { const dt = document.createElement('dt'); dt.textContent = label; const dd = document.createElement('dd'); dd.textContent = value; list.append(dt, dd); }
      content.replaceChildren(list); result.hidden = false; status.textContent = copy.messages.complete; status.classList.remove('status--error');
    } catch (error) { status.textContent = copy.messages[error?.code] ?? copy.messages.error; status.classList.add('status--error'); result.hidden = true; }
  });
  form.addEventListener('reset', () => queueMicrotask(() => { content.replaceChildren(); result.hidden = true; status.textContent = ''; status.classList.remove('status--error'); }));
}
