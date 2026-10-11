import { calculateSpecificHeat } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="specific-heat-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const mode = form.elements.namedItem('mode');
  const solveFor = form.elements.namedItem('solveFor');
  const singleFields = root.querySelector('[data-specific-single]');
  const mixingFields = root.querySelector('[data-specific-mixing]');
  const format = (value, digits = 6) => numberFormat(document.documentElement.lang || 'en', value, digits);
  const massToKg = { kg: 1, g: 0.001, lb: 0.45359237, oz: 0.028349523125 };
  const specificHeatToSi = { 'J/kg°C': 1, 'kJ/kg°C': 1000, 'J/g°C': 1000, 'cal/g°C': 4184, 'BTU/lb°F': 4186.8 };
  const energyToJ = { J: 1, kJ: 1000, cal: 4.184, kcal: 4184, BTU: 1055.05585262 };
  let outputText = '';

  function syncFields() {
    const mixing = mode.value === 'mixing';
    const fahrenheit = form.elements.namedItem('temperatureUnit').value === '°F';
    singleFields.hidden = mixing;
    singleFields.disabled = mixing;
    mixingFields.hidden = !mixing;
    mixingFields.disabled = !mixing;
    const differenceMin = fahrenheit ? -1800000 : -1000000;
    const differenceMax = fahrenheit ? 1800000 : 1000000;
    root.querySelector('#specific-heat-delta').min = differenceMin;
    root.querySelector('#specific-heat-delta').max = differenceMax;
    for (const input of [root.querySelector('#specific-heat-temp-one'), root.querySelector('#specific-heat-temp-two')]) {
      input.min = fahrenheit ? -459.67 : -273.15;
      input.max = fahrenheit ? 1800032 : 1000000;
    }
    const solved = solveFor.value;
    root.querySelectorAll('[data-specific-field]').forEach((wrapper) => {
      const disabled = wrapper.dataset.specificField === solved;
      wrapper.hidden = disabled;
      const input = wrapper.querySelector('input');
      input.disabled = disabled;
      input.required = !disabled;
    });
    clearResult(root);
    outputText = '';
    announce(root, '');
  }

  function calculate(event) {
    event?.preventDefault();
    clearResult(root);
    outputText = '';
    try {
      const common = {
        massUnit: form.elements.namedItem('massUnit').value,
        specificHeatUnit: form.elements.namedItem('specificHeatUnit').value,
        temperatureUnit: form.elements.namedItem('temperatureUnit').value,
        energyUnit: form.elements.namedItem('energyUnit').value,
      };
      const result = mode.value === 'mixing'
        ? calculateSpecificHeat({
          ...common, mode: 'mixing',
          mass1: readNumber(form, 'mass1', { min: 0, max: 1e9 }),
          specificHeat1: readNumber(form, 'specificHeat1', { min: 0, max: 1e8 }),
          temperature1: readNumber(form, 'temperature1', { min: common.temperatureUnit === '°F' ? -459.67 : -273.15, max: common.temperatureUnit === '°F' ? 1800032 : 1e6 }),
          mass2: readNumber(form, 'mass2', { min: 0, max: 1e9 }),
          specificHeat2: readNumber(form, 'specificHeat2', { min: 0, max: 1e8 }),
          temperature2: readNumber(form, 'temperature2', { min: common.temperatureUnit === '°F' ? -459.67 : -273.15, max: common.temperatureUnit === '°F' ? 1800032 : 1e6 }),
          heatLoss: readNumber(form, 'heatLoss', { min: -1e15, max: 1e15 }),
        })
        : calculateSpecificHeat({
          ...common, mode: 'single', solveFor: solveFor.value,
          mass: solveFor.value === 'mass' ? undefined : readNumber(form, 'mass', { min: 0, max: 1e9 }),
          specificHeat: solveFor.value === 'specificHeat' ? undefined : readNumber(form, 'specificHeat', { min: 0, max: 1e8 }),
          temperatureChange: solveFor.value === 'temperatureChange' ? undefined : readNumber(form, 'temperatureChange', { min: common.temperatureUnit === '°F' ? -1800000 : -1e6, max: common.temperatureUnit === '°F' ? 1800000 : 1e6 }),
          heatEnergy: solveFor.value === 'energy' ? undefined : readNumber(form, 'heatEnergy', { min: -1e15, max: 1e15 }),
        });
      let rows;
      if (result.mode === 'mixing') {
        const temperature = common.temperatureUnit === '°F' ? result.finalTemperatureC * 9 / 5 + 32 : result.finalTemperatureC;
        rows = [
          [copy.messages.finalTemperature, `${format(temperature)} ${common.temperatureUnit}`],
          [copy.messages.heatLoss, `${format(result.heatLossJ / energyToJ[common.energyUnit])} ${common.energyUnit}`],
        ];
      } else {
        const solved = result.solved;
        const quantity = solved === 'energy' ? result.value / energyToJ[common.energyUnit]
          : solved === 'mass' ? result.value / massToKg[common.massUnit]
            : solved === 'specificHeat' ? result.value / specificHeatToSi[common.specificHeatUnit]
              : common.temperatureUnit === '°F' ? result.value * 9 / 5 : result.value;
        const unit = solved === 'energy' ? common.energyUnit
          : solved === 'mass' ? common.massUnit
            : solved === 'specificHeat' ? common.specificHeatUnit
              : common.temperatureUnit;
        const key = solved === 'energy' ? 'heatEnergy' : solved === 'mass' ? 'mass' : solved === 'specificHeat' ? 'specificHeat' : 'temperatureChange';
        rows = [[copy.messages[key], `${format(quantity)} ${unit}`]];
      }
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  mode.addEventListener('change', syncFields);
  solveFor.addEventListener('change', syncFields);
  form.elements.namedItem('temperatureUnit').addEventListener('change', syncFields);
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    mode.value = 'single';
    solveFor.value = 'energy';
    for (const [name, value] of Object.entries({ mass: '1', specificHeat: '1000', temperatureChange: '10', heatEnergy: '10000', massUnit: 'kg', specificHeatUnit: 'J/kg°C', temperatureUnit: '°C', energyUnit: 'J' })) form.elements.namedItem(name).value = value;
    syncFields();
    calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => { syncFields(); clearResult(root); announce(root, ''); }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
  syncFields();
}
