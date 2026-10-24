import { calculateSelfEmploymentTax } from './logic.mjs';

const root = document.querySelector('[data-tool="us-self-employment-tax"]');
if (root) {
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const form = root.querySelector('[data-us-se-tax-form]');
  const result = root.querySelector('[data-us-se-tax-result]');
  const output = root.querySelector('[data-us-se-tax-output]');
  const status = root.querySelector('[data-status]');
  const currency = new Intl.NumberFormat(document.documentElement.lang || 'en-US', { style: 'currency', currency: 'USD' });
  const show = (label, value, strong = false) => {
    const row = document.createElement('p');
    const labelNode = document.createElement(strong ? 'strong' : 'span');
    labelNode.textContent = `${label}: `;
    row.append(labelNode, document.createTextNode(currency.format(value)));
    output.append(row);
  };
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    output.replaceChildren();
    status.textContent = '';
    try {
      const estimate = calculateSelfEmploymentTax({
        taxYear: 2026,
        netBusinessProfit: form.elements.namedItem('netBusinessProfit').value,
        socialSecurityWages: form.elements.namedItem('socialSecurityWages').value,
      });
      show(copy.fields.netEarnings, estimate.netEarnings);
      show(copy.fields.socialSecurityTaxableEarnings, estimate.socialSecurityTaxableEarnings);
      show(copy.fields.socialSecurityTax, estimate.socialSecurityTax);
      show(copy.fields.medicareTax, estimate.medicareTax);
      show(copy.fields.totalTax, estimate.totalTax, true);
      show(copy.fields.deductibleHalf, estimate.deductibleHalf);
      const note = document.createElement('p');
      note.textContent = estimate.qualifies ? copy.messages.calculated : copy.messages.belowThreshold;
      output.append(note);
      status.textContent = copy.messages.calculated;
      result.hidden = false;
    } catch {
      status.textContent = copy.messages.invalid;
      status.classList.add('status--error');
      result.hidden = true;
    }
  });
  form.addEventListener('reset', () => queueMicrotask(() => {
    output.replaceChildren(); result.hidden = true; status.textContent = ''; status.classList.remove('status--error');
  }));
}
