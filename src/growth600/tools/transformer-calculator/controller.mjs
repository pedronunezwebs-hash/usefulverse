import { calculateTransformer } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="transformer-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const mode = form.elements.namedItem('mode');
  let outputText = '';
  const format = (value) => numberFormat(document.documentElement.lang || 'en', value, 6);
  const fieldsByMode = {
    voltage: ['primaryVoltage', 'primaryTurns', 'secondaryTurns'],
    ratio: ['primaryVoltage', 'secondaryVoltage'],
    current: ['primaryCurrent', 'primaryTurns', 'secondaryTurns', 'efficiencyPercent'],
  };
  function syncMode() {
    const active = new Set(fieldsByMode[mode.value] ?? []);
    for (const input of form.querySelectorAll('[data-transformer-field]')) {
      const enabled = active.has(input.name);
      input.closest('.field').hidden = !enabled;
      input.required = enabled;
      input.disabled = !enabled;
    }
  }
  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      const values = Object.fromEntries(['primaryVoltage', 'secondaryVoltage', 'primaryTurns', 'secondaryTurns', 'primaryCurrent', 'efficiencyPercent'].map((name) => [name, form.elements.namedItem(name).value]));
      const result = calculateTransformer({ ...values, mode: mode.value });
      const rows = [[copy.messages.turnsRatio, `Ns / Np = ${format(result.turnsRatio)}`], [copy.messages.direction, copy.messages[result.direction]]];
      if (result.mode === 'voltage') rows.push([copy.messages.primaryVoltage, `${format(result.primaryVoltage)} V`], [copy.messages.secondaryVoltage, `${format(result.secondaryVoltage)} V`]);
      if (result.mode === 'ratio') rows.push([copy.messages.primaryVoltage, `${format(result.primaryVoltage)} V`], [copy.messages.secondaryVoltage, `${format(result.secondaryVoltage)} V`]);
      if (result.mode === 'current') rows.push([copy.messages.primaryCurrent, `${format(result.primaryCurrent)} A`], [copy.messages.secondaryCurrent, `${format(result.secondaryCurrent)} A`], [copy.messages.efficiency, `${format(result.efficiencyPercent)}%`]);
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }
  mode.addEventListener('change', syncMode);
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    mode.value = 'voltage';
    for (const [name, value] of Object.entries({ primaryVoltage: '120', primaryTurns: '100', secondaryTurns: '50' })) form.elements.namedItem(name).value = value;
    syncMode(); calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => { outputText = ''; syncMode(); clearResult(root); announce(root, ''); }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
  syncMode();
}
