import { calculateAcPower } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="three-phase-power-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const locale = () => document.documentElement.lang || 'en';
  const format = (value) => numberFormat(locale(), value, 8);
  let outputText = '';

  function updateMode() {
    const threePhase = form.elements.namedItem('system').value === 'three-phase';
    for (const field of root.querySelectorAll('[data-ac-field="three-phase"]')) field.hidden = !threePhase;
  }

  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      const read = (name) => form.elements.namedItem(name).value.trim();
      const rawVoltage = read('lineVoltage'); const rawCurrent = read('lineCurrent'); const rawPowerFactor = read('powerFactor');
      if (!rawVoltage || !rawCurrent || !rawPowerFactor) throw new RangeError('Enter voltage, current, and power factor.');
      const result = calculateAcPower({ system: read('system'), topology: read('topology'), lineVoltage: Number(rawVoltage), voltageUnit: read('voltageUnit'), lineCurrent: Number(rawCurrent), currentUnit: read('currentUnit'), powerFactor: Number(rawPowerFactor) });
      const rows = [[copy.messages.activePower, `${format(result.activePowerW)} W`], [copy.messages.apparentPower, `${format(result.apparentPowerVA)} VA`], [copy.messages.reactivePower, `${format(result.reactivePowerVar)} var`], [copy.messages.lineVoltage, `${format(result.lineVoltageV)} V`], [copy.messages.lineCurrent, `${format(result.lineCurrentA)} A`]];
      if (result.system === 'three-phase') rows.push([copy.messages.phaseVoltage, `${format(result.phaseVoltageV)} V`], [copy.messages.phaseCurrent, `${format(result.phaseCurrentA)} A`]);
      rows.push([copy.messages.powerFactor, format(result.powerFactor)], [copy.messages.formula, result.system === 'three-phase' ? copy.messages.threePhaseFormula : copy.messages.singlePhaseFormula]);
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  form.elements.namedItem('system').addEventListener('change', () => { updateMode(); clearResult(root); });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => { outputText = ''; clearResult(root); announce(root, ''); updateMode(); }, 0));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    for (const [name, value] of Object.entries({ system: 'three-phase', topology: 'star', lineVoltage: '400', voltageUnit: 'V', lineCurrent: '10', currentUnit: 'A', powerFactor: '0.8' })) form.elements.namedItem(name).value = value;
    updateMode(); calculate();
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
  updateMode();
}
