import { calculateMomentum } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="momentum-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const mode = form.elements.namedItem('mode');
  const restitutionField = root.querySelector('[data-restitution-field]');
  const speedFactors = { 'm/s': 1, 'km/h': 1 / 3.6, 'ft/s': 0.3048 };
  const format = (value) => numberFormat(document.documentElement.lang || 'en', value, 6);
  let outputText = '';

  function syncMode() {
    restitutionField.hidden = mode.value !== 'collision';
    form.elements.namedItem('restitution').required = mode.value === 'collision';
  }

  function calculate(event) {
    event?.preventDefault();
    clearResult(root);
    outputText = '';
    try {
      const result = calculateMomentum({
        mode: mode.value,
        mass1: form.elements.namedItem('mass1').valueAsNumber,
        mass2: form.elements.namedItem('mass2').valueAsNumber,
        massUnit: form.elements.namedItem('massUnit').value,
        velocity1: form.elements.namedItem('velocity1').valueAsNumber,
        velocity2: form.elements.namedItem('velocity2').valueAsNumber,
        speedUnit: form.elements.namedItem('speedUnit').value,
        restitution: form.elements.namedItem('restitution').valueAsNumber,
      });
      const rows = [
        [copy.messages.momentumBefore, `${format(result.momentumBeforeKgMps)} kg·m/s`],
        [copy.messages.kineticEnergyBefore, `${format(result.kineticEnergyBeforeJ)} J`],
      ];
      if (mode.value === 'collision') {
        const speedUnit = form.elements.namedItem('speedUnit').value;
        const speedFactor = speedFactors[speedUnit];
        rows.push(
          [copy.messages.finalVelocity1, `${format(result.finalVelocity1Mps / speedFactor)} ${speedUnit}`],
          [copy.messages.finalVelocity2, `${format(result.finalVelocity2Mps / speedFactor)} ${speedUnit}`],
          [copy.messages.momentumAfter, `${format(result.momentumAfterKgMps)} kg·m/s`],
          [copy.messages.kineticEnergyAfter, `${format(result.kineticEnergyAfterJ)} J`],
          [copy.messages.energyLoss, `${format(result.kineticEnergyLossJ)} J`],
        );
      }
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  mode.addEventListener('change', () => {
    syncMode();
    outputText = '';
    clearResult(root);
    announce(root, '');
  });
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    mode.value = 'collision';
    for (const [name, value] of Object.entries({ mass1: '1', mass2: '1', massUnit: 'kg', velocity1: '2', velocity2: '-1', speedUnit: 'm/s', restitution: '1' })) form.elements.namedItem(name).value = value;
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
