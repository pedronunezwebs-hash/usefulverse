import { estimateAcaPremiumTaxCredit } from './logic.mjs';

const root = document.querySelector('[data-aca-subsidy]');
if (root) {
  const form = root.querySelector('form');
  const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  const status = root.querySelector('[data-status]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const money = new Intl.NumberFormat(document.documentElement.lang || 'en-US', { style: 'currency', currency: 'USD' });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    content.replaceChildren();
    try {
      const estimate = estimateAcaPremiumTaxCredit({
        householdIncome: form.elements.namedItem('income').value,
        familySize: form.elements.namedItem('familySize').value,
        region: form.elements.namedItem('region').value,
        benchmarkPremium: form.elements.namedItem('benchmark').value,
        enrollmentPremium: form.elements.namedItem('enrollment').value,
      });
      const rows = [
        [copy.fields.fpl, money.format(estimate.fpl)],
        [copy.fields.fplPercent, `${estimate.fplPercent}%`],
        [copy.fields.applicableRate, `${estimate.applicablePercent}%`],
        [copy.fields.expectedContribution, money.format(estimate.expectedAnnualContribution)],
        [copy.fields.annualCredit, money.format(estimate.annualCredit)],
        [copy.fields.monthlyCredit, money.format(estimate.monthlyCredit)],
        [copy.fields.monthlyNetPremium, money.format(estimate.monthlyNetPremium)],
      ];
      const table = document.createElement('table');
      const body = document.createElement('tbody');
      for (const [label, value] of rows) {
        const row = document.createElement('tr');
        const heading = document.createElement('th');
        const cell = document.createElement('td');
        heading.scope = 'row';
        heading.textContent = label;
        cell.textContent = value;
        row.append(heading, cell);
        body.append(row);
      }
      table.append(body);
      content.append(table);
      status.textContent = copy.messages[estimate.eligibilityBand];
      status.classList.remove('status--error');
      result.hidden = false;
    } catch (error) {
      status.textContent = copy.messages[error?.code] ?? copy.messages.error;
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
