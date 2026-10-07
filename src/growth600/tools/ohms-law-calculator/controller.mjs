import { calculateEquivalentResistance, solveOhmsLaw } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="ohms-law-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const modeField = form.elements.namedItem('mode');
  const solverFields = root.querySelector('[data-ohms-solver]');
  const networkFields = root.querySelector('[data-ohms-network]');
  const format = (value) => numberFormat(document.documentElement.lang || 'en', value, 6);
  let outputText = '';
  const syncMode = () => {
    const network = modeField.value === 'network';
    solverFields.hidden = network;
    networkFields.hidden = !network;
    form.elements.namedItem('resistorValues').required = network;
  };
  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      let rows;
      if (modeField.value === 'network') {
        const values = form.elements.namedItem('resistorValues').value.trim().split(/[\s,]+/u).filter(Boolean).map(Number);
        const result = calculateEquivalentResistance(values, form.elements.namedItem('topology').value);
        rows = [
          [copy.messages.equivalentResistance, `${format(result.resistance)} Ω`],
          [copy.messages.resistorCount, format(result.count)],
          [copy.messages.topology, result.topology === 'series' ? copy.fields.series : copy.fields.parallel],
        ];
      } else {
        const values = Object.fromEntries(['voltage', 'current', 'resistance', 'power'].map((name) => [name, form.elements.namedItem(name).value.trim()]));
        const result = solveOhmsLaw(values);
        rows = [
          [copy.messages.solvedVoltage, `${format(result.voltage)} V`],
          [copy.messages.solvedCurrent, `${format(result.current)} A`],
          [copy.messages.solvedResistance, `${format(result.resistance)} Ω`],
          [copy.messages.solvedPower, `${format(result.power)} W`],
        ];
      }
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }
  modeField.addEventListener('change', syncMode);
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    modeField.value = 'solve';
    for (const [name, value] of Object.entries({ voltage: '12', current: '', resistance: '6', power: '' })) form.elements.namedItem(name).value = value;
    syncMode(); calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => { outputText = ''; syncMode(); clearResult(root); announce(root, ''); }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
  syncMode();
}
