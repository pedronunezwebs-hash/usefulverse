import { estimateRothConversion } from './logic.mjs';

const root = document.querySelector('[data-tool="us-roth-conversion"]');
if (root) {
  const form = root.querySelector('[data-roth-conversion-form]');
  const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  const status = root.querySelector('[data-status]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const format = (value) => new Intl.NumberFormat(document.documentElement.lang || 'en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(value);
  const addLine = (parent, label, value) => {
    const row = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = `${label}: `;
    row.append(strong, document.createTextNode(format(value)));
    parent.append(row);
  };
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    content.replaceChildren();
    status.textContent = '';
    status.classList.remove('status--error');
    try {
      const values = Object.fromEntries(new FormData(form));
      const estimate = estimateRothConversion({ amount: values.amount, currentRatePercent: values.currentRate, futureRatePercent: values.futureRate, annualReturnPercent: values.annualReturn, years: values.years });
      addLine(content, copy.fields.taxDue, estimate.taxDueNow);
      addLine(content, copy.fields.rothExternal, estimate.rothIfTaxPaidOutside);
      addLine(content, copy.fields.rothWithheld, estimate.rothIfTaxWithheld);
      addLine(content, copy.fields.traditionalAfterTax, estimate.traditionalAfterTax);
      const note = document.createElement('p');
      note.className = 'hint';
      note.textContent = copy.fields.accuracyNote;
      content.append(note);
      const source = document.createElement('a');
      source.href = 'https://www.irs.gov/publications/p17';
      source.target = '_blank';
      source.rel = 'noopener noreferrer';
      source.textContent = copy.fields.officialSource;
      content.append(source);
      status.textContent = copy.messages.complete;
      result.hidden = false;
    } catch {
      status.textContent = copy.messages.error;
      status.classList.add('status--error');
      result.hidden = true;
    }
  });
  form.addEventListener('reset', () => queueMicrotask(() => {
    content.replaceChildren();
    result.hidden = true;
    status.textContent = '';
    status.classList.remove('status--error');
  }));
}
