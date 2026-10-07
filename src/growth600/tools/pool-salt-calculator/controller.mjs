import { calculatePoolSalt } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="pool-salt-calculator"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const locale = document.documentElement.lang || 'en';
  const messages = copy.messages;
  let outputText = '';
  const format = (value) => numberFormat(locale, value, 2);

  function calculate(event) {
    event?.preventDefault();
    clearResult(root);
    outputText = '';
    try {
      const bagUnit = form.elements.namedItem('bagUnit').value;
      const result = calculatePoolSalt({
        volume: readNumber(form, 'volume', { min: 0.01, max: 100_000_000 }),
        volumeUnit: form.elements.namedItem('volumeUnit').value,
        currentSalinityPpm: readNumber(form, 'currentSalinityPpm', { min: 0, max: 10_000 }),
        targetSalinityPpm: readNumber(form, 'targetSalinityPpm', { min: 0, max: 10_000 }),
        saltPurityPercent: readNumber(form, 'saltPurityPercent', { min: 1, max: 100 }),
        bagSize: readNumber(form, 'bagSize', { optional: true, min: 0.01, max: 10_000 }),
        bagUnit,
      });
      const rows = [
        [messages.poolVolume, `${format(result.poolVolumeL)} ${copy.actions.liters}`],
        [messages.currentSalinity, `${format(result.currentSalinityPpm)} ppm`],
        [messages.targetSalinity, `${format(result.targetSalinityPpm)} ppm`],
        [messages.increase, `${format(result.increasePpm)} ppm`],
        [messages.pureSalt, `${format(result.pureSaltKg)} kg`],
        [messages.saltToAdd, `${format(result.saltToAddKg)} kg / ${format(result.saltToAddLb)} lb`],
      ];
      if (result.bagsToBuy !== null) rows.push([messages.bags, format(result.bagsToBuy)]);
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, result.noSaltNeeded ? messages.noSaltNeeded : messages.calculated, result.noSaltNeeded ? 'info' : 'success');
    } catch {
      announce(root, messages.checkInputs, 'error');
    }
  }

  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    for (const [name, value] of Object.entries({ volumeUnit: 'l', volume: '1000', currentSalinityPpm: '0', targetSalinityPpm: '1000', saltPurityPercent: '100', bagUnit: 'kg', bagSize: '1' })) form.elements.namedItem(name).value = value;
    calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => {
    outputText = '';
    for (const field of form.querySelectorAll('[aria-invalid]')) field.removeAttribute('aria-invalid');
    clearResult(root); announce(root, '');
  }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
}
