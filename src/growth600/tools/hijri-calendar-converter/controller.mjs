import { gregorianToHijri, hijriToGregorian, isHijriLeapYear } from './logic.mjs';
import { announce, clearResult, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="hijri-calendar-converter"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const mode = form.elements.namedItem('mode');
  const gregorianFields = root.querySelector('[data-gregorian-fields]');
  const hijriFields = root.querySelector('[data-hijri-fields]');

  function syncMode() {
    const gregorianFirst = mode.value === 'gregorian-to-hijri';
    gregorianFields.hidden = !gregorianFirst;
    hijriFields.hidden = gregorianFirst;
    for (const input of gregorianFields.querySelectorAll('input')) input.required = gregorianFirst;
    for (const input of hijriFields.querySelectorAll('input, select')) input.required = !gregorianFirst;
  }

  function convert(event) {
    event?.preventDefault();
    clearResult(root);
    const language = document.documentElement.lang || 'en';
    const localizedNumber = (value) => numberFormat(language, value, 0);
    try {
      const result = mode.value === 'gregorian-to-hijri'
        ? gregorianToHijri({ year: form.elements.namedItem('gregorianYear').value, month: form.elements.namedItem('gregorianMonth').value, day: form.elements.namedItem('gregorianDay').value })
        : hijriToGregorian({ year: form.elements.namedItem('hijriYear').value, month: form.elements.namedItem('hijriMonth').value, day: form.elements.namedItem('hijriDay').value });
      const rows = mode.value === 'gregorian-to-hijri'
        ? [[copy.messages.hijriLabel, `${localizedNumber(result.day)} ${copy.fields.hijriMonths[result.month - 1]} ${localizedNumber(result.year)}`], [copy.messages.leapYear, localizedNumber(result.year)]]
        : [[copy.messages.gregorianLabel, new Intl.DateTimeFormat(({ pt: 'pt-BR', zh_tw: 'zh-TW', tl: 'fil-PH', sw: 'sw-KE' })[language] || language, { calendar: 'gregory', dateStyle: 'long', timeZone: 'UTC' }).format(new Date(Date.UTC(result.year, result.month - 1, result.day)))]];
      if (mode.value === 'gregorian-to-hijri') rows[1][1] = `${localizedNumber(result.year)} · ${copy.messages.leapYear}: ${isHijriLeapYear(result.year) ? copy.messages.leapYes : copy.messages.leapNo}`;
      showRows(root, rows);
      announce(root, copy.messages.converted, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  mode.addEventListener('change', syncMode);
  form.addEventListener('submit', convert);
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    if (mode.value === 'gregorian-to-hijri') {
      form.elements.namedItem('gregorianYear').value = '2024';
      form.elements.namedItem('gregorianMonth').value = '3';
      form.elements.namedItem('gregorianDay').value = '11';
    } else {
      form.elements.namedItem('hijriYear').value = '1445';
      form.elements.namedItem('hijriMonth').value = '9';
      form.elements.namedItem('hijriDay').value = '1';
    }
    convert();
  });
  form.addEventListener('reset', () => setTimeout(() => { clearResult(root); announce(root, ''); syncMode(); }, 0));
  syncMode();
}
