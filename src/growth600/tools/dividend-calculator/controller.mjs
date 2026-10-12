import { parseLocalizedNumber } from '../../../advanced-logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';
import { calculateDividendProjection } from './logic.mjs';

const root = document.querySelector('[data-tool="dividend-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  const locale = () => document.documentElement.lang || 'en';
  const parse = (name) => parseLocalizedNumber(form.elements.namedItem(name).value, locale());
  let summary = '';

  function clear() { clearResult(root); content.replaceChildren(); summary = ''; }
  function money(value, currency) {
    try { return new Intl.NumberFormat(locale(), { style: 'currency', currency, maximumFractionDigits: 2 }).format(value); }
    catch { return `${numberFormat(locale(), value, 2)} ${currency}`; }
  }

  function calculate(event) {
    event?.preventDefault(); clear();
    try {
      const currency = form.elements.namedItem('currencyCode').value.trim().toUpperCase();
      if (!/^[A-Z]{3}$/u.test(currency)) throw new RangeError('currency');
      const estimate = calculateDividendProjection({
        shares: parse('shares'), sharePrice: parse('sharePrice'), annualDividendPerShare: parse('annualDividendPerShare'),
        paymentsPerYear: parse('paymentsPerYear'), dividendGrowthPercent: parse('dividendGrowthPercent'),
        priceGrowthPercent: parse('priceGrowthPercent'), years: parse('years'),
        reinvestDividends: form.elements.namedItem('reinvestDividends').checked,
      });
      const rows = [
        [copy.fields.startingInvestment, money(estimate.startingInvestment, currency)],
        [copy.fields.currentAnnualIncome, money(estimate.currentAnnualIncome, currency)],
        [copy.fields.currentIncomePerPayment, money(estimate.currentIncomePerPayment, currency)],
        [copy.fields.currentYield, `${numberFormat(locale(), estimate.currentYield, 2)}%`],
        [copy.fields.yieldOnCost, `${numberFormat(locale(), estimate.yieldOnCost, 2)}%`],
        [copy.fields.projectedShares, numberFormat(locale(), estimate.projectedShares, 4)],
        [copy.fields.projectedSharePrice, money(estimate.projectedSharePrice, currency)],
        [copy.fields.projectedAnnualIncome, money(estimate.projectedAnnualIncome, currency)],
        [copy.fields.projectedPortfolioValue, money(estimate.projectedPortfolioValue, currency)],
        ...(estimate.reinvestDividends ? [[copy.fields.totalReinvested, money(estimate.totalReinvested, currency)]] : []),
      ];
      const checkpoints = [...new Set([1, Math.min(5, estimate.years), Math.min(10, estimate.years), estimate.years])];
      for (const year of checkpoints) {
        const point = estimate.annualRows[year - 1];
        rows.push([`${copy.fields.year} ${numberFormat(locale(), year, 0)} · ${copy.fields.projectedAnnualIncome}`, money(point.annualIncome, currency)]);
        rows.push([`${copy.fields.year} ${numberFormat(locale(), year, 0)} · ${copy.fields.projectedPortfolioValue}`, money(point.portfolioValue, currency)]);
      }
      showRows(root, rows);
      summary = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      result.hidden = false;
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  form.addEventListener('input', () => { clear(); announce(root, ''); });
  form.addEventListener('change', () => { clear(); announce(root, ''); });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => queueMicrotask(() => { clear(); announce(root, ''); }));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    form.elements.namedItem('shares').value = '100';
    form.elements.namedItem('sharePrice').value = '40';
    form.elements.namedItem('annualDividendPerShare').value = '2';
    form.elements.namedItem('paymentsPerYear').value = '4';
    form.elements.namedItem('dividendGrowthPercent').value = '0';
    form.elements.namedItem('priceGrowthPercent').value = '0';
    form.elements.namedItem('years').value = '10';
    form.elements.namedItem('reinvestDividends').checked = false;
    form.elements.namedItem('currencyCode').value = 'USD';
    calculate(); announce(root, copy.messages.exampleLoaded, 'success');
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (summary) copyText(root, summary, copy); });
}
