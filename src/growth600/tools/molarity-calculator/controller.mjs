import { calculateMolarity } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="molarity-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const modeField = form.elements.namedItem('mode');
  const fieldGroups = [...root.querySelectorAll('[data-molarity-fields]')];
  const format = (value) => numberFormat(document.documentElement.lang || 'en', value, 6);
  let outputText = '';
  const fieldsByMode = {
    concentration: ['moles', 'volume', 'volumeUnit'],
    moles: ['molarity', 'volume', 'volumeUnit'],
    volume: ['moles', 'molarity', 'volumeUnit'],
    'solute-mass': ['molarity', 'volume', 'volumeUnit', 'molarMass'],
    'prepare-solution': ['molarity', 'volume', 'volumeUnit', 'molarMass'],
  };
  function syncMode() {
    for (const group of fieldGroups) group.hidden = !fieldsByMode[modeField.value].includes(group.dataset.molarityFields);
  }
  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      const selected = new Set(fieldsByMode[modeField.value]);
      const read = (name, min = 0, max = 1_000_000_000) => selected.has(name) ? readNumber(form, name, { min, max }) : undefined;
      const result = calculateMolarity({
        mode: modeField.value,
        moles: read('moles'),
        molarity: read('molarity'),
        volume: read('volume'),
        volumeUnit: form.elements.namedItem('volumeUnit').value,
        molarMass: read('molarMass', Number.MIN_VALUE),
      });
      const label = copy.messages[result.resultKey];
      const rows = [[label, `${format(result.value)} ${result.unit}`]];
      if (result.mode === 'prepare-solution') rows.push([copy.messages.finalVolume, `${format(result.volumeLiters)} L`]);
      showRows(root, rows);
      outputText = rows.map(([rowLabel, value]) => `${rowLabel}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }
  modeField.addEventListener('change', syncMode);
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    modeField.value = 'concentration';
    for (const [name, value] of Object.entries({ moles: '1', volume: '2', volumeUnit: 'L' })) form.elements.namedItem(name).value = value;
    syncMode(); calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => { outputText = ''; syncMode(); clearResult(root); announce(root, ''); }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
  syncMode();
}
