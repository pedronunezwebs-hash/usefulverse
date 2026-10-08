import { decodeResistorBands, encodeResistorValue } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="resistor-color-code-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const mode = form.elements.namedItem('mode');
  const bandCount = form.elements.namedItem('bands');
  const decodeGroup = root.querySelector('[data-resistor-decode]');
  const encodeGroup = root.querySelector('[data-resistor-encode]');
  const tcrGroup = root.querySelector('[data-resistor-tcr]');
  const formatter = (value) => numberFormat(document.documentElement.lang || 'en', value, 8);
  let outputText = '';

  function syncMode() {
    const decoding = mode.value === 'decode';
    const count = Number(bandCount.value);
    decodeGroup.hidden = !decoding;
    encodeGroup.hidden = decoding;
    tcrGroup.hidden = decoding || count !== 6;
    form.elements.namedItem('resistanceOhms').required = !decoding;
    for (let index = 1; index <= 6; index += 1) {
      const control = form.elements.namedItem(`band${index}`);
      const visible = decoding && index <= count;
      control.closest('.field').hidden = !visible;
      control.required = visible;
    }
  }

  function colorList(colors) { return colors.map((value, index) => `${copy.fields[`band${index + 1}`]}: ${copy.fields[value]}`).join(', '); }

  function calculate(event) {
    event?.preventDefault();
    clearResult(root);
    outputText = '';
    try {
      const count = Number(bandCount.value);
      let rows;
      if (mode.value === 'decode') {
        const colors = Array.from({ length: count }, (_, index) => form.elements.namedItem(`band${index + 1}`).value);
        const result = decodeResistorBands({ bands: count, colors });
        rows = [
          [copy.messages.resistance, `${formatter(result.ohms)} Ω`],
          [copy.messages.tolerance, `±${formatter(result.tolerancePercent)}%`],
          [copy.messages.bands, colorList(result.colors)],
        ];
        if (result.temperatureCoefficientPpm !== null) rows.push([copy.messages.temperatureCoefficient, `${formatter(result.temperatureCoefficientPpm)} ppm/K`]);
      } else {
        const result = encodeResistorValue({
          ohms: form.elements.namedItem('resistanceOhms').value,
          bands: count,
          tolerancePercent: form.elements.namedItem('tolerance').value,
          temperatureCoefficientPpm: form.elements.namedItem('temperatureCoefficient').value,
        });
        rows = [
          [copy.messages.requestedResistance, `${formatter(result.requestedOhms)} Ω`],
          [copy.messages.nominalResistance, `${formatter(result.nominalOhms)} Ω`],
          [copy.messages.tolerance, `±${formatter(result.tolerancePercent)}%`],
          [copy.messages.bands, colorList(result.colors)],
        ];
        if (result.rounded) rows.push([copy.messages.rounding, copy.messages.nearestNominal]);
        if (result.temperatureCoefficientPpm !== null) rows.push([copy.messages.temperatureCoefficient, `${formatter(result.temperatureCoefficientPpm)} ppm/K`]);
      }
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  mode.addEventListener('change', syncMode);
  bandCount.addEventListener('change', syncMode);
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    mode.value = 'decode';
    bandCount.value = '4';
    ['brown', 'black', 'red', 'gold'].forEach((value, index) => { form.elements.namedItem(`band${index + 1}`).value = value; });
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
