import { announce } from '../controller-helpers.mjs';
import { calculateCpiInflation, calculateCustomInflation } from './logic.mjs';

const root = document.querySelector('[data-tool="inflation-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]').textContent);
  const mode = root.querySelector('#inflation-mode');
  const cpiFields = root.querySelector('[data-inflation-cpi-fields]');
  const customFields = root.querySelector('[data-inflation-custom-fields]');
  const results = root.querySelector('[data-inflation-results]');
  const amount = root.querySelector('#inflation-amount');
  const status = root.querySelector('[data-status]');
  const numberLocale = copy.copyLanguage.replace('_', '-');
  const formatter = new Intl.NumberFormat(numberLocale, { maximumFractionDigits: 2 });
  const percentFormatter = new Intl.NumberFormat(numberLocale, { maximumFractionDigits: 2, signDisplay: 'always' });

  function setMode() {
    const custom = mode.value === 'custom-rate';
    cpiFields.hidden = custom;
    customFields.hidden = !custom;
    for (const input of customFields.querySelectorAll('input')) input.disabled = !custom;
    for (const input of cpiFields.querySelectorAll('input')) input.disabled = custom;
    results.hidden = true;
  }

  mode.addEventListener('change', setMode);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    status.textContent = '';
    try {
      const data = new FormData(form);
      const result = mode.value === 'custom-rate'
        ? calculateCustomInflation({ amount: data.get('amount'), annualRatePercent: data.get('annualRatePercent'), years: data.get('years') })
        : calculateCpiInflation({ amount: data.get('amount'), startYear: data.get('startYear'), endYear: data.get('endYear') });
      const equivalentRate = result.dataset === 'user-rate'
        ? result.annualizedRatePercent
        : ((result.priceLevelRatio ** (1 / result.years)) - 1) * 100;
      root.querySelector('[data-inflation-summary]').textContent = mode.value === 'custom-rate'
        ? copy.messages.customSummary.replace('{years}', formatter.format(result.years))
        : copy.messages.cpiSummary.replace('{start}', String(result.startYear)).replace('{end}', String(result.endYear));
      root.querySelector('[data-inflation-adjusted]').textContent = formatter.format(result.adjustedAmount);
      root.querySelector('[data-inflation-cumulative]').textContent = `${percentFormatter.format(result.cumulativeChangePercent)}%`;
      root.querySelector('[data-inflation-annualized]').textContent = `${percentFormatter.format(equivalentRate)}%`;
      results.hidden = false;
      announce(root, copy.messages.calculated, 'success');
    } catch (error) {
      results.hidden = true;
      announce(root, error instanceof RangeError ? copy.messages.invalid : copy.messages.invalid, 'error');
    }
  });

  root.querySelector('[data-action="example"]').addEventListener('click', () => {
    mode.value = 'us-cpi';
    root.querySelector('#inflation-start-year').value = '2020';
    root.querySelector('#inflation-end-year').value = '2025';
    amount.value = '100';
    setMode();
    form.requestSubmit();
  });

  root.querySelector('[data-action="reset"]').addEventListener('click', () => {
    form.reset();
    setMode();
    results.hidden = true;
    status.textContent = '';
  });

  setMode();
}
