import { calculateWeekNumber } from './logic.mjs';
import { announce, clearResult, copyText, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="week-number-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const locale = document.documentElement.lang || 'en';
  let output = '';
  const formatDate = (date) => new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' }).format(date);

  function calculate(event) {
    event?.preventDefault();
    clearResult(root);
    output = '';
    try {
      const result = calculateWeekNumber({
        date: form.elements.namedItem('date').value,
        mode: form.elements.namedItem('mode').value,
        weekStart: form.elements.namedItem('weekStart').value,
      });
      const weekYear = result.mode === 'iso' ? result.weekYear : result.calendarYear;
      const rows = [
        [copy.messages.weekNumber, String(result.week)],
        [copy.messages.weekYear, String(weekYear)],
        [copy.messages.weekStarts, formatDate(result.weekStart)],
        [copy.messages.weekEnds, formatDate(result.weekEnd)],
      ];
      showRows(root, rows);
      output = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  function updateMode() {
    const custom = form.elements.namedItem('mode').value === 'custom';
    const row = root.querySelector('[data-week-input="custom"]');
    if (row) row.hidden = !custom;
  }

  form.addEventListener('change', (event) => {
    if (event.target?.name === 'mode') updateMode();
  });
  form.addEventListener('submit', calculate);
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    form.elements.namedItem('date').value = '2021-01-01';
    form.elements.namedItem('mode').value = 'iso';
    updateMode();
    calculate();
  });
  form.addEventListener('reset', () => setTimeout(() => { output = ''; clearResult(root); announce(root, ''); }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (output) copyText(root, output, copy); });
  updateMode();
}
