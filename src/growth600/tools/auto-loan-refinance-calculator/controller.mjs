import { compareAutoLoanRefinance } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="auto-loan-refinance-calculator"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const locale = document.documentElement.lang || 'en';
  const money = (value) => numberFormat(locale, value, 2);
  let outputText = '';

  function calculate(event) {
    event?.preventDefault();
    clearResult(root);
    try {
      const result = compareAutoLoanRefinance({
        balance: readNumber(form, 'balance', { min: Number.MIN_VALUE }),
        currentApr: readNumber(form, 'currentApr', { min: 0, max: 100 }),
        currentMonths: readNumber(form, 'currentMonths', { min: 1, max: 1200, integer: true }),
        newApr: readNumber(form, 'newApr', { min: 0, max: 100 }),
        newMonths: readNumber(form, 'newMonths', { min: 1, max: 1200, integer: true }),
        fees: readNumber(form, 'fees', { optional: true, min: 0 }) ?? 0,
        feeTreatment: form.elements.namedItem('feeTreatment').value,
      });
      const breakEven = result.breakEvenMonths === null ? copy.messages.noBreakEven : copy.messages.monthCount.replace('{count}', numberFormat(locale, result.breakEvenMonths, 0));
      const rows = [
        [copy.messages.currentPayment, money(result.currentPayment)],
        [copy.messages.newPayment, money(result.refinancePayment)],
        [copy.messages.paymentDifference, money(result.monthlyDifference)],
        [copy.messages.currentTotal, money(result.currentTotal)],
        [copy.messages.newTotal, money(result.refinanceTotal)],
        [copy.messages.estimatedDifference, money(result.estimatedSavings)],
        [copy.messages.breakEven, breakEven],
      ];
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.estimateOnly, 'success');
    } catch {
      outputText = '';
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => {
    setTimeout(() => { outputText = ''; clearResult(root); announce(root, ''); }, 0);
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
    if (outputText) copyText(root, outputText, copy);
  });
}
