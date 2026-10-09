import { calculateIdealGasLaw, convertIdealGasValue } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="ideal-gas-law-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const dimensions = ['pressure', 'volume', 'amount', 'temperature'];
  const unitFor = (dimension) => form.elements.namedItem(`${dimension}Unit`);
  const selectedUnits = Object.fromEntries(dimensions.map((dimension) => [dimension, unitFor(dimension).value]));
  let outputText = '';
  const locale = () => document.documentElement.lang || 'en';
  const format = (value) => numberFormat(locale(), value, 9);
  const factors = {
    pressure: { Pa: 1, kPa: 1e3, MPa: 1e6, bar: 1e5, atm: 101325, torr: 133.32236842105263, psi: 6894.757293168 },
    volume: { 'm³': 1, L: 1e-3, mL: 1e-6, 'ft³': 0.028316846592 },
    amount: { mol: 1, mmol: 1e-3, kmol: 1e3 },
  };
  const displayValue = (result, dimension) => {
    if (dimension === 'temperature') {
      const kelvin = result.temperatureK;
      return unitFor(dimension).value === '°C' ? kelvin - 273.15 : kelvin;
    }
    const siKey = { pressure: 'pressurePa', volume: 'volumeM3', amount: 'amountMol' }[dimension];
    return result[siKey] / factors[dimension][unitFor(dimension).value];
  };

  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      const read = (name) => form.elements.namedItem(name).value.trim();
      const result = calculateIdealGasLaw({
        pressure: read('pressure'), pressureUnit: read('pressureUnit'),
        volume: read('volume'), volumeUnit: read('volumeUnit'),
        amount: read('amount'), amountUnit: read('amountUnit'),
        temperature: read('temperature'), temperatureUnit: read('temperatureUnit'),
      });
      const rows = [
        [copy.messages.solved, `${format(displayValue(result, result.variable))} ${unitFor(result.variable).value}`],
        ...dimensions.map((dimension) => [copy.messages[dimension], `${format(displayValue(result, dimension))} ${unitFor(dimension).value}`]),
        [copy.messages.formula, 'PV = nRT'],
      ];
      showRows(root, rows);
      outputText = rows.map(([label, shown]) => `${label}: ${shown}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  for (const dimension of dimensions) {
    unitFor(dimension).addEventListener('change', () => {
      const input = form.elements.namedItem(dimension);
      const nextUnit = unitFor(dimension).value;
      if (input.value.trim()) {
        try { input.value = String(convertIdealGasValue(input.value, dimension, selectedUnits[dimension], nextUnit)); }
        catch { unitFor(dimension).value = selectedUnits[dimension]; announce(root, copy.messages.checkInputs, 'error'); return; }
      }
      selectedUnits[dimension] = nextUnit;
      clearResult(root);
    });
  }
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => {
    outputText = ''; clearResult(root); announce(root, '');
    for (const dimension of dimensions) selectedUnits[dimension] = unitFor(dimension).value;
  }, 0));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    for (const [name, value] of Object.entries({ pressure: '1', pressureUnit: 'atm', volume: '', volumeUnit: 'L', amount: '1', amountUnit: 'mol', temperature: '273.15', temperatureUnit: 'K' })) {
      form.elements.namedItem(name).value = value;
    }
    for (const dimension of dimensions) selectedUnits[dimension] = unitFor(dimension).value;
    calculate(); announce(root, copy.messages.exampleLoaded, 'status');
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
}
