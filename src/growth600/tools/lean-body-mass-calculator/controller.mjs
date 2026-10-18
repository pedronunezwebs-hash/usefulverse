import { calculateLeanBodyMass } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="lean-body-mass-calculator"]');
if (root) {
  const copy = readToolCopy(root);
  const method = root.querySelector('[data-method]');
  const units = root.querySelector('[data-units]');
  const equation = root.querySelector('[data-equation]');
  const weight = root.querySelector('[data-weight]');
  const height = root.querySelector('[data-height]');
  const bodyFat = root.querySelector('[data-body-fat]');
  const output = root.querySelector('[data-output]');
  const details = root.querySelector('[data-result-details]');
  const formula = root.querySelector('[data-formula]');
  const number = (value) => new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(value);
  const inputNumber = (value) => String(Number(value.toFixed(3)));

  function updateUnits(convert = false) {
    const imperial = units.value === 'imperial';
    if (convert) {
      weight.value = inputNumber(Number(weight.value) * (imperial ? 2.2046226218 : 0.45359237));
      height.value = inputNumber(Number(height.value) * (imperial ? 0.3937007874 : 2.54));
    }
    root.querySelector('[data-weight-label]').textContent = copy.fields.weight + (imperial ? ' (lb)' : ' (kg)');
    root.querySelector('[data-height-label]').textContent = copy.fields.height + (imperial ? ' (in)' : ' (cm)');
    weight.min = imperial ? '44.092' : '20'; weight.max = imperial ? '771.618' : '350';
    height.min = imperial ? '39.37' : '100'; height.max = imperial ? '98.425' : '250';
  }

  function updateMode() {
    const usesBoer = method.value === 'boer';
    root.querySelector('[data-equation-fields]').hidden = !usesBoer;
    root.querySelector('[data-height-field]').hidden = !usesBoer;
    root.querySelector('[data-body-fat-field]').hidden = usesBoer;
    height.required = usesBoer;
    bodyFat.required = !usesBoer;
  }

  function calculate() {
    try {
      const result = calculateLeanBodyMass({ weight: Number(weight.value), height: Number(height.value), bodyFatPercent: Number(bodyFat.value), method: method.value, equation: equation.value, unitSystem: units.value });
      output.textContent = number(result.leanMass) + ' ' + result.unit;
      details.textContent = copy.messages.result.replace('{fatMass}', number(result.fatMass)).replace('{leanPercent}', number(result.leanPercent)).replace('{unit}', result.unit);
      formula.textContent = result.formula === 'body-fat' ? copy.fields.directFormula : result.formula === 'boer-male' ? copy.fields.boerMaleFormula : copy.fields.boerFemaleFormula;
      announce(root, copy.messages.calculated, 'success');
    } catch {
      output.textContent = '—'; details.textContent = ''; formula.textContent = '';
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  units.addEventListener('change', () => { updateUnits(true); calculate(); });
  method.addEventListener('change', () => { updateMode(); calculate(); });
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    units.value = 'metric'; method.value = 'body-fat'; weight.value = '80'; bodyFat.value = '20'; height.value = '175';
    updateUnits(); updateMode(); calculate();
  });
  root.querySelector('[data-action="reset"]')?.addEventListener('click', () => {
    units.value = 'metric'; method.value = 'body-fat'; equation.value = 'male'; weight.value = '80'; height.value = '175'; bodyFat.value = '20';
    updateUnits(); updateMode(); output.textContent = '—'; details.textContent = ''; formula.textContent = '';
    announce(root, copy.messages.checkInputs, 'info');
  });
  root.querySelector('form')?.addEventListener('submit', (event) => { event.preventDefault(); calculate(); });
  updateMode(); updateUnits(); calculate();
}
