import { calculateDilution } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="dilution-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const modeField = form.elements.namedItem('mode');
  const stepField = root.querySelector('[data-dilution-steps]');
  const format = (value) => numberFormat(document.documentElement.lang || 'en', value, 6);
  let outputText = '';
  const syncMode = () => { stepField.hidden = modeField.value !== 'serial'; };
  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      const result = calculateDilution({
        mode: modeField.value,
        stockConcentration: readNumber(form, 'stockConcentration', { min: Number.MIN_VALUE, max: 1_000_000_000 }),
        targetConcentration: readNumber(form, 'targetConcentration', { min: Number.MIN_VALUE, max: 1_000_000_000 }),
        finalVolume: readNumber(form, 'finalVolume', { min: Number.MIN_VALUE, max: 1_000_000_000 }),
        volumeUnit: form.elements.namedItem('volumeUnit').value,
        steps: modeField.value === 'serial' ? readNumber(form, 'steps', { min: 1, max: 20 }) : 1,
      });
      const rows = result.mode === 'direct' ? [
        [copy.messages.stockAliquot, `${format(result.stockVolume)} ${result.volumeUnit}`],
        [copy.messages.diluent, `${format(result.diluentVolume)} ${result.volumeUnit}`],
        [copy.messages.dilutionFactor, `${format(result.dilutionFactor)}×`],
      ] : [
        [copy.messages.steps, format(result.steps)],
        [copy.messages.perStepFactor, `${format(result.perStepFactor)}×`],
        [copy.messages.transferVolume, `${format(result.transferVolume)} ${result.volumeUnit}`],
        [copy.messages.diluent, `${format(result.diluentVolume)} ${result.volumeUnit}`],
        [copy.messages.totalDilutionFactor, `${format(result.totalDilutionFactor)}×`],
      ];
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }
  modeField.addEventListener('change', syncMode);
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    modeField.value = 'direct';
    for (const [name, value] of Object.entries({ stockConcentration: '10', targetConcentration: '2', finalVolume: '1', volumeUnit: 'L', steps: '2' })) form.elements.namedItem(name).value = value;
    syncMode(); calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => { outputText = ''; syncMode(); clearResult(root); announce(root, ''); }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
  syncMode();
}
