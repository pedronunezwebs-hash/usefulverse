import { calculatePaycheck } from './logic.mjs';

const root = document.querySelector('[data-tool="us-paycheck-calculator"]');
if (root) {
  const form = root.querySelector('[data-pending-form]'); const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]'); const status = root.querySelector('[data-status]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const format = (value) => new Intl.NumberFormat(document.documentElement.lang || 'en-US', { style: 'currency', currency: 'USD' }).format(value);
  const addLine = (parent, label, value, emphasized = false) => {
    const row = document.createElement('p'); const term = document.createElement(emphasized ? 'strong' : 'span'); term.textContent = `${label}: `; row.append(term, document.createTextNode(value)); parent.append(row);
  };
  form.addEventListener('submit', (event) => {
    event.preventDefault(); content.replaceChildren(); status.textContent = ''; status.classList.remove('status--error');
    const fields = Object.fromEntries([...form.querySelectorAll('[data-input]')].map((input) => [input.dataset.input, input.value]));
    try {
      const estimate = calculatePaycheck(fields); const summary = document.createElement('section'); summary.className = 'pending-paycheck-summary';
      summary.append(document.createElement('h3')).lastChild.textContent = copy.fields.paycheckResult;
      addLine(summary, copy.fields.grossPerPay, format(estimate.grossPerPay));
      addLine(summary, copy.fields.deductionsPerPay, format(estimate.deductionsPerPay));
      addLine(summary, copy.fields.netPerPay, format(estimate.netPerPay), true);
      addLine(summary, copy.fields.annualGross, format(estimate.annualGross));
      addLine(summary, copy.fields.annualNet, format(estimate.annualNet), true);
      addLine(summary, copy.fields.deductionRate, `${new Intl.NumberFormat(document.documentElement.lang || 'en-US', { style: 'percent', maximumFractionDigits: 2 }).format(estimate.deductionRate)}`);
      const breakdown = document.createElement('details'); const heading = document.createElement('summary'); heading.textContent = copy.fields.deductionBreakdown; breakdown.append(heading);
      for (const [key, amount] of Object.entries(estimate.breakdown)) addLine(breakdown, copy.fields[key], format(amount));
      summary.append(breakdown);
      const official = document.createElement('a'); official.href = 'https://www.irs.gov/individuals/tax-withholding-estimator'; official.target = '_blank'; official.rel = 'noopener noreferrer'; official.textContent = copy.fields.officialEstimator; summary.append(official);
      content.append(summary);
    } catch {
      const message = document.createElement('p'); message.textContent = copy.messages.error; message.className = 'status status--error'; content.append(message);
    }
    result.hidden = false;
  });
  form.addEventListener('reset', () => queueMicrotask(() => { content.replaceChildren(); result.hidden = true; status.textContent = ''; status.classList.remove('status--error'); }));
}
