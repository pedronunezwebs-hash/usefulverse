import { julianDateToUtc, utcToJulianDate } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="julian-date-converter"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const direction = form.elements.namedItem('direction');
  const utcField = root.querySelector('[data-jd-input="utc"]');
  const valueField = root.querySelector('[data-jd-input="value"]');
  const locale = document.documentElement.lang || 'en';
  let output = '';

  function updateMode() {
    const toUtc = direction.value === 'to-utc';
    utcField.hidden = toUtc;
    valueField.hidden = !toUtc;
  }

  function calculate(event) {
    event?.preventDefault(); clearResult(root); output = '';
    try {
      const rows = direction.value === 'to-utc'
        ? (() => {
          const result = julianDateToUtc({ value: form.elements.namedItem('julianValue').value, kind: form.elements.namedItem('dateKind').value });
          return [[copy.messages.utc, result.utc], [copy.messages.jd, numberFormat(locale, result.jd, 8)], [copy.messages.mjd, numberFormat(locale, result.mjd, 8)], [copy.messages.calendar, copy.messages.calendarValue], [copy.messages.timeScale, result.timeScale], [copy.messages.precision, `±${result.precisionMilliseconds} ms`]];
        })()
        : (() => {
          const input = form.elements.namedItem('utcDate').value.trim();
          const result = utcToJulianDate(input.endsWith('Z') ? input : `${input}Z`);
          return [[copy.messages.jd, numberFormat(locale, result.jd, 8)], [copy.messages.mjd, numberFormat(locale, result.mjd, 8)], [copy.messages.dayFraction, numberFormat(locale, result.dayFraction, 10)], [copy.messages.calendar, copy.messages.calendarValue], [copy.messages.timeScale, result.timeScale]];
        })();
      showRows(root, rows);
      output = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  form.addEventListener('input', () => { output = ''; clearResult(root); announce(root, ''); });
  form.addEventListener('change', () => { updateMode(); output = ''; clearResult(root); announce(root, ''); });
  form.addEventListener('submit', calculate);
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    direction.value = 'to-jd'; form.elements.namedItem('utcDate').value = '2000-01-01T12:00:00';
    form.elements.namedItem('julianValue').value = '2451545'; form.elements.namedItem('dateKind').value = 'jd';
    updateMode(); calculate(); announce(root, copy.messages.exampleLoaded, 'status');
  });
  form.addEventListener('reset', () => setTimeout(() => { updateMode(); output = ''; clearResult(root); announce(root, ''); }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (output) copyText(root, output, copy); });
  updateMode();
}
