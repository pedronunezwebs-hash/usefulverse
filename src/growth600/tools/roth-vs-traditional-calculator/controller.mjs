import { compareRothTraditional } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="roth-vs-traditional-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const result = root.querySelector('[data-roth-result]');
  const summary = root.querySelector('[data-roth-summary]');
  const currency = new Intl.NumberFormat(document.documentElement.lang || undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
  const money = (value) => currency.format(value);

  function hideResult() {
    result.hidden = true;
    summary.textContent = '';
  }

  function clearEstimate() {
    hideResult();
    announce(root, '');
  }

  form.addEventListener('input', clearEstimate);
  form.addEventListener('change', clearEstimate);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    try {
      const report = compareRothTraditional({
        annualContribution: form.elements.namedItem('annualContribution').value,
        currentTaxRatePercent: form.elements.namedItem('currentTaxRate').value,
        futureTaxRatePercent: form.elements.namedItem('futureTaxRate').value,
        annualReturnPercent: form.elements.namedItem('annualReturn').value,
        years: form.elements.namedItem('years').value,
      });
      root.querySelector('[data-roth-deposit]').textContent = money(report.rothAnnualDeposit);
      root.querySelector('[data-roth-after-tax]').textContent = money(report.rothAfterTaxBalance);
      root.querySelector('[data-traditional-before-tax]').textContent = money(report.traditionalPretaxBalance);
      root.querySelector('[data-traditional-after-tax]').textContent = money(report.traditionalAfterTaxBalance);
      root.querySelector('[data-traditional-tax]').textContent = money(report.traditionalEstimatedTax);
      root.querySelector('[data-tax-paid-now]').textContent = money(report.currentTaxPaidOnRothContributions);
      root.querySelector('[data-estimated-difference]').textContent = money(report.estimatedDifference);
      root.querySelector('[data-total-budget]').textContent = money(report.totalPretaxBudget);
      summary.textContent = `${copy.fields.years}: ${report.years} · ${copy.fields.annualReturn}: ${report.assumptions.annualReturnPercent}% · ${copy.fields.currentTaxRate}: ${report.assumptions.currentTaxRatePercent}% · ${copy.fields.futureTaxRate}: ${report.assumptions.futureTaxRatePercent}%`;
      result.hidden = false;
      announce(root, copy.messages.calculated, 'success');
    } catch {
      hideResult();
      announce(root, copy.messages.checkInputs, 'error');
    }
  });

  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    for (const [name, value] of Object.entries({ annualContribution: '6000', currentTaxRate: '22', futureTaxRate: '25', annualReturn: '6', years: '25' })) form.elements.namedItem(name).value = value;
    hideResult();
    announce(root, '');
  });
  form.addEventListener('reset', () => {
    hideResult();
    announce(root, '');
  });
}
