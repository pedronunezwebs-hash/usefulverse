import { calculateVoltageDrop } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="voltage-drop-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const powerFactorField = root.querySelector('[data-power-factor-field]');
  const circuitField = form.elements.namedItem('circuit');
  const format = (value) => numberFormat(document.documentElement.lang || 'en', value, 3);
  let outputText = '';
  const syncCircuit = () => { powerFactorField.hidden = circuitField.value === 'dc'; };
  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      const length = readNumber(form, 'oneWayLength', { min: 0, max: 1_000_000 });
      const lengthUnit = form.elements.namedItem('lengthUnit').value;
      const result = calculateVoltageDrop({
        material: form.elements.namedItem('material').value,
        circuit: circuitField.value,
        oneWayLengthM: length * (lengthUnit === 'ft' ? 0.3048 : 1),
        currentA: readNumber(form, 'currentA', { min: 0, max: 1_000_000 }),
        crossSectionMm2: readNumber(form, 'crossSectionMm2', { min: 0.0001, max: 1_000_000 }),
        supplyVoltageV: readNumber(form, 'supplyVoltageV', { min: 0.001, max: 10_000_000 }),
        powerFactor: circuitField.value === 'dc' ? 1 : readNumber(form, 'powerFactor', { min: 0, max: 1 }),
      });
      const rows = [
        [copy.messages.voltageDrop, `${format(result.voltageDropV)} V`],
        [copy.messages.voltageDropPercent, `${format(result.voltageDropPercent)}%`],
        [copy.messages.estimatedReceivingVoltage, `${format(result.estimatedReceivingVoltageV)} V`],
        [copy.messages.resistancePerConductor, `${format(result.resistanceOhmPerConductor)} Ω/m`],
      ];
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }
  circuitField.addEventListener('change', syncCircuit);
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    for (const [name, value] of Object.entries({ circuit: 'single-phase', material: 'copper', oneWayLength: '30', lengthUnit: 'm', currentA: '20', crossSectionMm2: '2.5', supplyVoltageV: '230', powerFactor: '1' })) form.elements.namedItem(name).value = value;
    syncCircuit(); calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => { outputText = ''; syncCircuit(); clearResult(root); announce(root, ''); }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
  syncCircuit();
}
