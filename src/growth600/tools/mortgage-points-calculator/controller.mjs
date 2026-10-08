import { calculateMortgagePoints } from './logic.mjs';
import { announce, clearResult, copyText, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="mortgage-points-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  let outputText = '';

  function format(value) {
    return new Intl.NumberFormat(document.documentElement.lang || 'en', { maximumFractionDigits: 2 }).format(value);
  }

  function calculate(event) {
    event?.preventDefault();
    clearResult(root);
    outputText = '';
    try {
      const result = calculateMortgagePoints(Object.fromEntries(['principal', 'termMonths', 'rateWithoutPoints', 'rateWithPoints', 'pointsPercent', 'horizonMonths'].map((name) => [name, form.elements.namedItem(name).value])));
      const months = (value) => value === null ? copy.messages.noBreakEven : `${format(value)} ${copy.fields.monthsLabel}`;
      const rows = [
        [copy.messages.pointCost, format(result.upfrontCost)],
        [copy.messages.paymentWithoutPoints, format(result.paymentWithoutPoints)],
        [copy.messages.paymentWithPoints, format(result.paymentWithPoints)],
        [copy.messages.monthlyPaymentSavings, format(result.monthlyPaymentSavings)],
        [copy.messages.lifetimeInterestSavings, format(result.lifetimeInterestSavings)],
        [`${copy.messages.balanceWithoutPoints} (${format(result.horizonMonths)} ${copy.fields.monthsLabel})`, format(result.balanceWithoutPointsAtHorizon)],
        [`${copy.messages.balanceWithPoints} (${format(result.horizonMonths)} ${copy.fields.monthsLabel})`, format(result.balanceWithPointsAtHorizon)],
        [copy.messages.netBenefitAtHorizon, format(result.netBenefitAtHorizon)],
        [copy.messages.paymentOnlyBreakEven, result.paymentOnlyBreakEvenMonths === null ? copy.messages.noMonthlySavings : months(result.paymentOnlyBreakEvenMonths)],
        [copy.messages.netBreakEven, result.netBreakEvenMonth === null ? copy.messages.noBreakEven : months(result.netBreakEvenMonth)],
      ];
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => {
    outputText = '';
    clearResult(root);
    announce(root, '');
  }, 0));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    form.elements.namedItem('principal').value = '200000';
    form.elements.namedItem('termMonths').value = '360';
    form.elements.namedItem('rateWithoutPoints').value = '7.25';
    form.elements.namedItem('rateWithPoints').value = '7';
    form.elements.namedItem('pointsPercent').value = '1';
    form.elements.namedItem('horizonMonths').value = '60';
    calculate();
    announce(root, copy.messages.exampleLoaded, 'status');
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
    if (outputText) copyText(root, outputText, copy);
  });
}
