import { calculatePrayerTimes } from './logic.mjs';
import { announce, clearResult, copyText, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="prayer-times-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  let outputText = '';
  const names = ['fajr', 'sunrise', 'dhuhr', 'asr', 'sunset', 'maghrib', 'isha'];

  function calculate(event) {
    event?.preventDefault();
    clearResult(root);
    outputText = '';
    try {
      const result = calculatePrayerTimes({
        date: form.elements.namedItem('date').value,
        latitude: form.elements.namedItem('latitude').value,
        longitude: form.elements.namedItem('longitude').value,
        utcOffsetHours: form.elements.namedItem('utcOffsetHours').value,
        method: form.elements.namedItem('method').value,
        asrMethod: form.elements.namedItem('asrMethod').value,
        highLatitudeMethod: form.elements.namedItem('highLatitudeMethod').value,
        ramadan: form.elements.namedItem('ramadan').checked,
      });
      const rows = names.map((name) => [copy.messages[name], result.times[name] ?? copy.messages.unavailable]);
      rows.push([copy.messages.methodLabel, copy.fields[result.method === 'makkahRamadan' ? 'makkah' : result.method]]);
      rows.push([copy.messages.asrLabel, copy.fields[result.asrMethod]]);
      rows.push([copy.messages.offsetLabel, `UTC${result.utcOffsetHours >= 0 ? '+' : ''}${result.utcOffsetHours}`]);
      showRows(root, rows);
      if (result.highLatitudeAdjusted) announce(root, copy.messages.highLatitudeAdjusted, 'status');
      else announce(root, copy.messages.calculated, 'success');
      outputText = [...rows.map(([label, value]) => `${label}: ${value}`), ...(result.highLatitudeAdjusted ? [copy.messages.highLatitudeAdjusted] : [])].join('\n');
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
    form.elements.namedItem('date').value = '2026-03-20';
    form.elements.namedItem('latitude').value = '40.7128';
    form.elements.namedItem('longitude').value = '-74.006';
    form.elements.namedItem('utcOffsetHours').value = '-4';
    form.elements.namedItem('method').value = 'isna';
    form.elements.namedItem('asrMethod').value = 'standard';
    form.elements.namedItem('highLatitudeMethod').value = 'angle';
    form.elements.namedItem('ramadan').checked = false;
    calculate();
    announce(root, copy.messages.exampleLoaded, 'status');
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
    if (outputText) copyText(root, outputText, copy);
  });
}
