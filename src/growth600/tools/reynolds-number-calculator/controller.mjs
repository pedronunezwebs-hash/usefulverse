import { calculateReynoldsNumber } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="reynolds-number-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const locale = () => document.documentElement.lang || 'en';
  const format = (value, digits = 8) => numberFormat(locale(), value, digits);
  let outputText = '';

  function updateMode() {
    const type = form.elements.namedItem('viscosityType').value;
    for (const field of root.querySelectorAll('[data-reynolds-field]')) {
      field.hidden = field.dataset.reynoldsField === 'dynamic' ? type !== 'dynamic' : type !== 'kinematic';
    }
  }

  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      const read = (name) => form.elements.namedItem(name).value.trim();
      const result = calculateReynoldsNumber({
        velocity: read('velocity'), velocityUnit: read('velocityUnit'), characteristicLength: read('characteristicLength'), lengthUnit: read('lengthUnit'),
        viscosityType: read('viscosityType'), density: read('density'), densityUnit: read('densityUnit'), dynamicViscosity: read('dynamicViscosity'), dynamicViscosityUnit: read('dynamicViscosityUnit'),
        kinematicViscosity: read('kinematicViscosity'), kinematicViscosityUnit: read('kinematicViscosityUnit'), geometry: read('geometry'),
      });
      const regimeLabel = { laminar: copy.messages.laminarRegime, transitional: copy.messages.transitionalRegime, turbulent: copy.messages.turbulentRegime, 'context-dependent': copy.messages.contextDependent }[result.regime];
      const rows = [[copy.messages.reynoldsNumber, format(result.reynoldsNumber, 5)], [copy.messages.flowContext, result.geometry === 'pipe' ? copy.fields.pipeFlow : copy.fields.externalFlow], [copy.messages.regime, regimeLabel], [copy.messages.velocity, `${format(result.velocityMps)} m/s`], [copy.messages.characteristicLength, `${format(result.lengthM)} m`], [copy.messages.kinematicViscosity, `${format(result.kinematicViscosityM2s, 10)} m²/s`]];
      if (result.densityKgM3 !== null) rows.push([copy.messages.density, `${format(result.densityKgM3)} kg/m³`]);
      if (result.dynamicViscosityPas !== null) rows.push([copy.messages.dynamicViscosity, `${format(result.dynamicViscosityPas, 10)} Pa·s`]);
      rows.push([copy.messages.formula, result.viscosityType === 'dynamic' ? copy.messages.dynamicFormula : copy.messages.kinematicFormula]);
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  form.elements.namedItem('viscosityType').addEventListener('change', () => { updateMode(); clearResult(root); });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => { outputText = ''; clearResult(root); announce(root, ''); updateMode(); }, 0));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    for (const [name, value] of Object.entries({ geometry: 'pipe', viscosityType: 'dynamic', velocity: '1', velocityUnit: 'm/s', characteristicLength: '0.05', lengthUnit: 'm', density: '998.2', densityUnit: 'kg/m³', dynamicViscosity: '1.002', dynamicViscosityUnit: 'mPa·s', kinematicViscosity: '', kinematicViscosityUnit: 'cSt' })) form.elements.namedItem(name).value = value;
    updateMode(); calculate();
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
  updateMode();
}
