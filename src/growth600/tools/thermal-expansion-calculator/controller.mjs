import { calculateThermalExpansion } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="thermal-expansion-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const format = (value, digits = 6) => numberFormat(document.documentElement.lang || 'en', value, digits);
  let outputText = '';
  function updateMode() {
    const mode = form.elements.namedItem('mode').value;
    root.querySelectorAll('[data-thermal-unit]').forEach((wrapper) => {
      const active = wrapper.dataset.thermalUnit === mode;
      wrapper.hidden = !active;
      wrapper.querySelector('select').disabled = !active;
    });
  }
  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      const mode = form.elements.namedItem('mode').value;
      const result = calculateThermalExpansion({
        mode,
        initialDimension: readNumber(form, 'initialDimension', { min: 0, max: 1e12 }),
        dimensionUnit: form.elements.namedItem(`${mode === 'linear' ? 'length' : mode}Unit`).value,
        coefficient: readNumber(form, 'coefficient', { min: -0.01, max: 0.01 }),
        coefficientTemperatureUnit: form.elements.namedItem('coefficientTemperatureUnit').value,
        deltaTemperature: readNumber(form, 'deltaTemperature', { min: -10000, max: 10000 }),
        temperatureUnit: form.elements.namedItem('temperatureUnit').value,
      });
      const unit = result.dimensionUnit;
      const coefficientUnit = result.coefficientTemperatureUnit === 'C' ? copy.fields.perCelsiusShort : copy.fields.perFahrenheitShort;
      const rows = [
        [copy.messages.mode, mode === 'linear' ? copy.fields.linearMode : mode === 'area' ? copy.fields.areaMode : copy.fields.volumeMode],
        [copy.messages.initialDimension, `${format(result.initialDimension)} ${unit}`],
        [copy.messages.coefficient, `${format(result.coefficientPerInputUnit, 9)} ${coefficientUnit}`],
        [copy.messages.temperatureChange, `${format(result.deltaTemperature)} °${result.temperatureUnit}`],
        [copy.messages.dimensionChange, `${format(result.change)} ${unit}`],
        [copy.messages.finalDimension, `${format(result.finalDimension)} ${unit}`],
        [copy.messages.relativeChange, `${format(result.relativeChange * 100)}%`],
      ];
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }
  form.elements.namedItem('mode').addEventListener('change', () => { clearResult(root); outputText = ''; updateMode(); announce(root, ''); });
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    Object.entries({ mode: 'linear', initialDimension: '10', lengthUnit: 'm', coefficient: '0.000012', coefficientTemperatureUnit: 'C', deltaTemperature: '50', temperatureUnit: 'C' }).forEach(([name, value]) => { form.elements.namedItem(name).value = value; });
    updateMode(); calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => { outputText = ''; clearResult(root); updateMode(); announce(root, ''); }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
  updateMode();
}
