import { calculateKineticEnergy } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="kinetic-energy-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const mode = form.elements.namedItem('mode');
  const solveFields = root.querySelector('[data-kinetic-solve]');
  const energyInput = root.querySelector('[data-kinetic-energy-input]');
  const format = (value) => numberFormat(document.documentElement.lang || 'en', value, 6);
  let outputText = '';

  function syncMode() {
    const solveSpeed = mode.value === 'solve-speed';
    solveFields.hidden = solveSpeed;
    energyInput.hidden = !solveSpeed;
    form.elements.namedItem('velocityMps').required = !solveSpeed;
    form.elements.namedItem('kineticEnergyJ').required = solveSpeed;
  }

  function calculate(event) {
    event?.preventDefault();
    clearResult(root);
    outputText = '';
    try {
      const result = calculateKineticEnergy({
        mode: mode.value,
        massKg: form.elements.namedItem('massKg').value,
        velocityMps: form.elements.namedItem('velocityMps').value,
        kineticEnergyJ: form.elements.namedItem('kineticEnergyJ').value,
        heightM: form.elements.namedItem('heightM').value || '0',
        gravityMps2: form.elements.namedItem('gravityMps2').value || '9.80665',
      });
      const rows = [
        [copy.messages.velocity, `${format(result.velocityMps)} m/s`],
        [copy.messages.kineticEnergy, `${format(result.kineticEnergyJ)} J`],
        [copy.messages.potentialEnergy, `${format(result.potentialEnergyJ)} J`],
        [copy.messages.totalEnergy, `${format(result.totalMechanicalEnergyJ)} J`],
      ];
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  mode.addEventListener('change', syncMode);
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    mode.value = 'energy';
    for (const [name, value] of Object.entries({ massKg: '2', velocityMps: '3', kineticEnergyJ: '', heightM: '0', gravityMps2: '9.80665' })) form.elements.namedItem(name).value = value;
    syncMode();
    calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => {
    outputText = '';
    syncMode();
    clearResult(root);
    announce(root, '');
  }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
    if (outputText) copyText(root, outputText, copy);
  });
  syncMode();
}
