import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';
import { parseLocalizedNumber } from '../../../advanced-logic.mjs';
import { calculateFireTarget } from './logic.mjs';

const root = document.querySelector('[data-tool="fire-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const locale = () => document.documentElement.lang || 'en';
  let output = '';
  const format = (value) => numberFormat(locale(), value, 2);
  const calculate = (event) => {
    event?.preventDefault(); clearResult(root); output = '';
    try {
      const read = (name) => parseLocalizedNumber(form.elements.namedItem(name).value, locale());
      const result = calculateFireTarget({
        annualSpending: read('annualSpending'), withdrawalRatePercent: read('withdrawalRatePercent'),
        currentPortfolio: read('currentPortfolio'), monthlyContribution: read('monthlyContribution'),
        expectedAnnualReturnPercent: read('expectedAnnualReturnPercent'), inflationPercent: read('inflationPercent'),
      });
      const rows = [
        [copy.fields.targetAmount, format(result.targetAmount)],
        [copy.fields.realAnnualGrowthPercent, `${format(result.realAnnualGrowthPercent)}%`],
        [copy.fields.monthsToTarget, result.monthsToTarget === null ? copy.fields.unreachable : String(result.monthsToTarget)],
        [copy.fields.yearsToTarget, result.yearsToTarget === null ? copy.fields.unreachable : format(result.yearsToTarget)],
        [copy.fields.projectedBalance, format(result.projectedBalance)],
      ];
      showRows(root, rows);
      output = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch { announce(root, copy.messages.checkInputs, 'error'); }
  };
  form.addEventListener('submit', calculate);
  form.addEventListener('input', () => { clearResult(root); output = ''; announce(root, ''); });
  form.addEventListener('reset', () => setTimeout(() => { clearResult(root); output = ''; announce(root, ''); }, 0));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    for (const [name, value] of Object.entries({ annualSpending: '40000', withdrawalRatePercent: '4', currentPortfolio: '100000', monthlyContribution: '1000', expectedAnnualReturnPercent: '6', inflationPercent: '2' })) form.elements.namedItem(name).value = value;
    calculate();
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (output) copyText(root, output, copy); });
}
