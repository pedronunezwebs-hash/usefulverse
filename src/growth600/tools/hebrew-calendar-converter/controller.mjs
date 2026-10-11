import { gregorianToHebrew, hebrewToGregorian, isHebrewLeapYear } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="hebrew-calendar-converter"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const mode = form.elements.namedItem('direction');
  const gregorianFields = root.querySelector('[data-gregorian-fields]');
  const hebrewFields = root.querySelector('[data-hebrew-fields]');
  const monthField = form.elements.namedItem('hebrewMonth');
  const hebrewYearField = form.elements.namedItem('hebrewYear');
  let output = '';
  const locale = () => document.documentElement.lang || 'en';
  const formatNumber = (value) => numberFormat(locale(), value, 0);

  function syncMonthOptions() {
    const previous = Number(monthField.value);
    const year = Number(hebrewYearField.value);
    let monthNames = copy.fields.commonMonths;
    try { if (Number.isInteger(year) && isHebrewLeapYear(year)) monthNames = copy.fields.leapMonths; } catch {}
    monthField.replaceChildren(...monthNames.map((name, index) => {
      const option = document.createElement('option');
      option.value = String(index + 1);
      option.textContent = name;
      return option;
    }));
    monthField.value = String(previous >= 1 && previous <= monthNames.length ? previous : 1);
  }

  function syncMode() {
    const gregorianFirst = mode.value === 'gregorian-to-hebrew';
    gregorianFields.hidden = !gregorianFirst;
    hebrewFields.hidden = gregorianFirst;
    for (const input of gregorianFields.querySelectorAll('input')) input.required = gregorianFirst;
    for (const input of hebrewFields.querySelectorAll('input, select')) input.required = !gregorianFirst;
    if (!gregorianFirst) syncMonthOptions();
  }

  function formatGregorianDate(date) {
    const language = ({ 'pt-br': 'pt-BR', zh_tw: 'zh-TW', tl: 'fil-PH', sw: 'sw-KE' })[locale()] || locale();
    const value = new Date(0);
    value.setUTCHours(0, 0, 0, 0);
    value.setUTCFullYear(date.year, date.month - 1, date.day);
    return new Intl.DateTimeFormat(language, { calendar: 'gregory', dateStyle: 'long', timeZone: 'UTC' }).format(value);
  }

  function convert(event) {
    event?.preventDefault();
    clearResult(root);
    output = '';
    try {
      let rows;
      if (mode.value === 'gregorian-to-hebrew') {
        const value = form.elements.namedItem('gregorianDate').value;
        const [year, month, day] = value.split('-').map(Number);
        const result = gregorianToHebrew({ year, month, day });
        const months = result.leapYear ? copy.fields.leapMonths : copy.fields.commonMonths;
        rows = [
          [copy.fields.hebrewDate, `${formatNumber(result.day)} ${months[result.month - 1]} ${formatNumber(result.year)}`],
          [copy.fields.yearType, result.leapYear ? copy.fields.leapYes : copy.fields.leapNo],
        ];
      } else {
        const result = hebrewToGregorian({
          year: hebrewYearField.value,
          month: monthField.value,
          day: form.elements.namedItem('hebrewDay').value,
        });
        rows = [[copy.fields.gregorianDate, formatGregorianDate(result)]];
      }
      showRows(root, rows);
      output = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.converted, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  mode.addEventListener('change', syncMode);
  hebrewYearField.addEventListener('input', syncMonthOptions);
  form.addEventListener('input', () => { clearResult(root); output = ''; announce(root, ''); });
  form.addEventListener('change', () => { clearResult(root); output = ''; announce(root, ''); });
  form.addEventListener('submit', convert);
  form.addEventListener('reset', () => setTimeout(() => { clearResult(root); output = ''; announce(root, ''); syncMode(); }, 0));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    if (mode.value === 'gregorian-to-hebrew') {
      form.elements.namedItem('gregorianDate').value = '2024-03-11';
    } else {
      hebrewYearField.value = '5784';
      syncMonthOptions();
      monthField.value = '7';
      form.elements.namedItem('hebrewDay').value = '1';
    }
    convert();
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (output) copyText(root, output, copy); });
  syncMode();
}
