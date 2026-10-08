import { calculateHelocScenario } from './logic.mjs';
import { announce, clearResult, copyText, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="heloc-calculator"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const locale = document.documentElement.lang || 'en';
  let outputText = '';

  function calculate(event) {
    event?.preventDefault();
    clearResult(root);
    try {
      const scenario = calculateHelocScenario({
        creditLimit: readNumber(form, 'creditLimit', { min: 0.01, max: 100_000_000 }),
        balance: readNumber(form, 'balance', { min: 0, max: 100_000_000 }),
        annualAprPercent: readNumber(form, 'annualAprPercent', { min: 0, max: 100 }),
        drawMonths: readNumber(form, 'drawMonths', { min: 1, max: 360, integer: true }),
        repaymentMonths: readNumber(form, 'repaymentMonths', { min: 1, max: 360, integer: true }),
        currency: form.elements.namedItem('currency').value,
      });
      const money = (value) => new Intl.NumberFormat(locale, { style: 'currency', currency: scenario.currency, maximumFractionDigits: 2 }).format(value);
      const rows = [
        [copy.messages.availableCredit, money(scenario.availableCredit)],
        [copy.messages.interestOnlyPayment, money(scenario.interestOnlyPayment)],
        [copy.messages.repaymentPayment, money(scenario.repaymentPayment)],
        [copy.messages.paymentChange, money(scenario.paymentChange)],
        [copy.messages.drawInterest, money(scenario.drawInterest)],
        [copy.messages.repaymentInterest, money(scenario.repaymentInterest)],
        [copy.messages.totalInterest, money(scenario.totalInterest)],
        [copy.messages.totalPayments, money(scenario.totalPayments)],
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
  form.addEventListener('reset', () => setTimeout(() => { outputText = ''; clearResult(root); announce(root, ''); }, 0));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    form.elements.namedItem('currency').value = 'USD';
    form.elements.namedItem('creditLimit').value = '25000';
    form.elements.namedItem('balance').value = '12000';
    form.elements.namedItem('annualAprPercent').value = '10';
    form.elements.namedItem('drawMonths').value = '120';
    form.elements.namedItem('repaymentMonths').value = '240';
    calculate();
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
}
