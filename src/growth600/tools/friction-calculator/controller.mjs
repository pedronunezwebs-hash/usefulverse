import { calculateFriction, frictionUnits } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="friction-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const format = (value) => numberFormat(document.documentElement.lang || 'en', value, 3);
  let outputText = '';
  function updateMode() {
    const mode = form.elements.namedItem('mode').value;
    for (const group of root.querySelectorAll('[data-friction-fields]')) group.hidden = group.dataset.frictionFields !== mode;
    clearResult(root);
    outputText = '';
  }
  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      const mode = form.elements.namedItem('mode').value;
      const forceUnit = form.elements.namedItem('forceUnit').value;
      const forceFactor = frictionUnits.force[forceUnit];
      const result = calculateFriction({
        mode,
        normalForce: mode === 'normal' ? readNumber(form, 'normalForce', { min: 0, max: 1_000_000_000 }) : undefined,
        mass: mode === 'incline' ? readNumber(form, 'mass', { min: 0.000001, max: 1_000_000_000 }) : undefined,
        massUnit: form.elements.namedItem('massUnit').value,
        angleDegrees: mode === 'incline' ? readNumber(form, 'angle', { min: 0, max: 90 }) : 0,
        gravity: mode === 'incline' ? readNumber(form, 'gravity', { min: 0.000001, max: 100 }) : 9.80665,
        staticCoefficient: readNumber(form, 'staticCoefficient', { min: 0, max: 10 }),
        kineticCoefficient: readNumber(form, 'kineticCoefficient', { min: 0, max: 10 }),
        appliedForce: readNumber(form, 'appliedForce', { min: -1_000_000_000, max: 1_000_000_000 }),
        forceUnit,
        motionState: form.elements.namedItem('motionState').value,
      });
      const force = (value) => `${format(value / forceFactor)} ${forceUnit}`;
      const direction = result.frictionDirection === 0 ? copy.messages.noDirection
        : result.mode === 'incline' ? result.frictionDirection > 0 ? copy.messages.downhill : copy.messages.uphill
          : result.frictionDirection > 0 ? copy.messages.positiveDirection : copy.messages.negativeDirection;
      const regime = copy.messages[result.regime];
      const rows = [
        [copy.messages.normalForce, force(result.normalForceN)],
        [copy.messages.gravityComponent, force(result.gravityAlongSurfaceN)],
        [copy.messages.requiredStatic, force(result.requiredStaticFrictionN)],
        [copy.messages.maximumStatic, force(result.maximumStaticFrictionN)],
        [copy.messages.frictionMagnitude, force(result.frictionMagnitudeN)],
        [copy.messages.frictionDirection, direction],
        [copy.messages.regime, regime],
        [copy.messages.netForce, force(result.netForceN)],
      ];
      if (result.accelerationMps2 !== null) rows.push([copy.messages.acceleration, `${format(result.accelerationMps2)} m/s²`]);
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    form.elements.namedItem('mode').value = 'incline';
    form.elements.namedItem('mass').value = '10';
    form.elements.namedItem('massUnit').value = 'kg';
    form.elements.namedItem('angle').value = '30';
    form.elements.namedItem('gravity').value = '9.80665';
    form.elements.namedItem('staticCoefficient').value = '0.4';
    form.elements.namedItem('kineticCoefficient').value = '0.3';
    form.elements.namedItem('appliedForce').value = '0';
    form.elements.namedItem('motionState').value = 'rest';
    updateMode();
    calculate();
  });
  form.elements.namedItem('mode').addEventListener('change', updateMode);
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => { outputText = ''; updateMode(); announce(root, ''); }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
  updateMode();
}
