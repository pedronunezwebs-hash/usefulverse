import { calculate529Plan } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="529-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const locale = document.documentElement.lang || 'en';
  const currency = form.elements.namedItem('currency');
  let output = '';
  const money = (value) => new Intl.NumberFormat(locale, { style: 'currency', currency: currency.value, maximumFractionDigits: 0 }).format(value);

  function calculate(event) {
    event?.preventDefault(); clearResult(root); output = '';
    try {
      const result = calculate529Plan({
        currentSavings: readNumber(form, 'currentSavings', { min: 0, max: 1_000_000_000 }),
        monthlyContribution: readNumber(form, 'monthlyContribution', { min: 0, max: 10_000_000 }),
        yearsUntilCollege: readNumber(form, 'yearsUntilCollege', { min: 0, max: 50, integer: true }),
        annualCostToday: readNumber(form, 'annualCostToday', { min: 0, max: 1_000_000_000 }),
        collegeYears: readNumber(form, 'collegeYears', { min: 1, max: 8, integer: true }),
        tuitionInflationPercent: readNumber(form, 'tuitionInflationPercent', { min: 0, max: 30 }),
        annualReturnPercent: readNumber(form, 'annualReturnPercent', { min: 0, max: 30 }),
        scholarshipPerYear: readNumber(form, 'scholarshipPerYear', { min: 0, max: 1_000_000_000 }),
      });
      const rows = [
        [copy.messages.target, money(result.targetAtEnrollment)],
        [copy.messages.grossCost, money(result.totalGrossCost)],
        [copy.messages.scholarships, money(result.totalScholarship)],
        [copy.messages.projectedSavings, money(result.projectedSavings)],
        [copy.messages.fundingGap, money(result.fundingGap)],
        [copy.messages.monthlyNeeded, result.monthlyContributionNeeded === null ? copy.messages.noTime : money(result.monthlyContributionNeeded)],
        ...(result.amountNeededNow === null ? [] : [[copy.messages.amountNeededNow, money(result.amountNeededNow)]]),
        [copy.messages.assumption, numberFormat(locale, result.annualReturnPercent, 2) + '%'],
      ];
      showRows(root, rows);
      output = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  form.addEventListener('input', () => { output = ''; clearResult(root); announce(root, ''); });
  form.addEventListener('change', () => { output = ''; clearResult(root); announce(root, ''); });
  form.addEventListener('submit', calculate);
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    form.elements.namedItem('currentSavings').value = '5000';
    form.elements.namedItem('monthlyContribution').value = '200';
    form.elements.namedItem('yearsUntilCollege').value = '10';
    form.elements.namedItem('annualCostToday').value = '10000';
    form.elements.namedItem('collegeYears').value = '4';
    form.elements.namedItem('tuitionInflationPercent').value = '3';
    form.elements.namedItem('annualReturnPercent').value = '5';
    form.elements.namedItem('scholarshipPerYear').value = '2000';
    currency.value = 'USD';
    calculate(); announce(root, copy.messages.exampleLoaded, 'status');
  });
  form.addEventListener('reset', () => setTimeout(() => { output = ''; clearResult(root); announce(root, ''); }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (output) copyText(root, output, copy); });
}
