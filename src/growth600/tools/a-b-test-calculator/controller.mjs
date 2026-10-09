import { parseLocalizedNumber } from '../../../advanced-logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';
import { calculateAbTest } from './logic.mjs';

const root = document.querySelector('[data-tool="a-b-test-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  let outputText = '';
  const locale = () => document.documentElement.lang || 'en';
  const number = (value, digits = 2) => numberFormat(locale(), value, digits);
  const percent = (value) => new Intl.NumberFormat(locale(), { style: 'percent', maximumFractionDigits: 2 }).format(value);
  const read = (name) => parseLocalizedNumber(form.elements.namedItem(name).value, locale());

  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      const result = calculateAbTest({
        visitorsA: read('visitorsA'), conversionsA: read('conversionsA'),
        visitorsB: read('visitorsB'), conversionsB: read('conversionsB'),
      });
      const pValue = result.pValue < 0.0001 ? '< 0.0001' : number(result.pValue, 4);
      const rows = [
        [copy.fields.rateA, percent(result.rateA)],
        [copy.fields.rateB, percent(result.rateB)],
        [copy.fields.difference, `${number(result.percentagePointDifference, 2)} ${copy.fields.percentagePoints}`],
        [copy.fields.relativeLift, result.relativeLift === null ? copy.fields.notAvailable : percent(result.relativeLift)],
        [copy.fields.intervalA, `${percent(result.intervalA.lower)} – ${percent(result.intervalA.upper)}`],
        [copy.fields.intervalB, `${percent(result.intervalB.lower)} – ${percent(result.intervalB.upper)}`],
        [copy.fields.intervalDifference, `${number(result.differenceInterval.lower * 100, 2)} – ${number(result.differenceInterval.upper * 100, 2)} ${copy.fields.percentagePoints}`],
        [copy.fields.pValue, pValue],
        [copy.fields.conclusion, result.significantAtFivePercent ? copy.fields.significant : copy.fields.inconclusive],
        [copy.fields.method, copy.fields.methodNote],
      ];
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, result.significantAtFivePercent ? copy.messages.significant : copy.messages.inconclusive, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  form.addEventListener('submit', calculate);
  form.addEventListener('input', () => { clearResult(root); outputText = ''; announce(root, ''); });
  form.addEventListener('reset', () => setTimeout(() => { clearResult(root); outputText = ''; announce(root, ''); }, 0));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    form.elements.namedItem('visitorsA').value = '500';
    form.elements.namedItem('conversionsA').value = '30';
    form.elements.namedItem('visitorsB').value = '500';
    form.elements.namedItem('conversionsB').value = '40';
    calculate();
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
}
