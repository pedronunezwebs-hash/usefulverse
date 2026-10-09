import { calculateFlowRate, convertFlowValue } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="flow-rate-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const locale = () => document.documentElement.lang || 'en';
  const format = (value) => numberFormat(locale(), value, 8);
  const siUnits = { area: 'm²', velocity: 'm/s', flow: 'm³/s', volume: 'm³' };
  const unitInput = { area: ['area', 'areaUnit'], velocity: ['velocity', 'velocityUnit'], flow: ['flowRate', 'flowUnit'], volume: ['tankVolume', 'volumeUnit'] };
  const selectedUnits = Object.fromEntries(Object.entries(unitInput).map(([dimension, [, selector]]) => [dimension, form.elements.namedItem(selector).value]));
  let outputText = '';

  function updateMode() {
    const mode = form.elements.namedItem('mode').value;
    const required = {
      flow: ['area', 'velocity'], area: ['flowRate', 'velocity'], velocity: ['flowRate', 'area'], 'fill-time': ['flowRate', 'tankVolume'],
    }[mode];
    for (const field of root.querySelectorAll('[data-flow-field]')) {
      const name = field.dataset.flowField;
      field.hidden = !required.includes(name);
      const input = form.elements.namedItem(name);
      if (input) input.required = required.includes(name);
    }
  }

  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      const read = (name) => form.elements.namedItem(name).value.trim();
      const mode = read('mode');
      const result = calculateFlowRate({
        mode, area: read('area'), areaUnit: read('areaUnit'), velocity: read('velocity'), velocityUnit: read('velocityUnit'),
        flowRate: read('flowRate'), flowUnit: read('flowUnit'), volume: mode === 'fill-time' ? read('tankVolume') : '', volumeUnit: read('volumeUnit'), timeUnit: read('timeUnit'),
      });
      const display = (siValue, dimension) => convertFlowValue(siValue, dimension, siUnits[dimension], selectedUnits[dimension]);
      const rows = [[copy.messages.solved, `${format(result.primaryValue)} ${result.primaryUnit}`]];
      if (mode !== 'flow') rows.push([copy.messages.flowRate, `${format(display(result.flowM3s, 'flow'))} ${selectedUnits.flow}`]);
      if (result.areaM2 !== null && mode !== 'area') rows.push([copy.messages.area, `${format(display(result.areaM2, 'area'))} ${selectedUnits.area}`]);
      if (result.velocityMps !== null && mode !== 'velocity') rows.push([copy.messages.velocity, `${format(display(result.velocityMps, 'velocity'))} ${selectedUnits.velocity}`]);
      if (result.volumeM3 !== null) rows.push([copy.messages.volume, `${format(display(result.volumeM3, 'volume'))} ${selectedUnits.volume}`]);
      if (result.fillTimeSeconds !== null && mode !== 'fill-time') rows.push([copy.messages.fillTime, `${format(convertFlowValue(result.fillTimeSeconds, 'time', 's', read('timeUnit')))} ${read('timeUnit')}`]);
      rows.push([copy.messages.formula, copy.messages.formulaValue]);
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  for (const [dimension, [inputName, unitName]] of Object.entries(unitInput)) {
    form.elements.namedItem(unitName).addEventListener('change', () => {
      const input = form.elements.namedItem(inputName);
      const nextUnit = form.elements.namedItem(unitName).value;
      if (input.value.trim()) {
        try { input.value = String(convertFlowValue(input.value, dimension, selectedUnits[dimension], nextUnit)); }
        catch { form.elements.namedItem(unitName).value = selectedUnits[dimension]; announce(root, copy.messages.checkInputs, 'error'); return; }
      }
      selectedUnits[dimension] = nextUnit; clearResult(root);
    });
  }
  form.elements.namedItem('mode').addEventListener('change', () => { updateMode(); clearResult(root); });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => { outputText = ''; clearResult(root); announce(root, ''); updateMode(); for (const dimension of Object.keys(unitInput)) selectedUnits[dimension] = form.elements.namedItem(unitInput[dimension][1]).value; }, 0));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    for (const [name, value] of Object.entries({ mode: 'flow', area: '2', areaUnit: 'm²', velocity: '3', velocityUnit: 'm/s', flowRate: '', flowUnit: 'm³/s', tankVolume: '', volumeUnit: 'm³', timeUnit: 'min' })) form.elements.namedItem(name).value = value;
    for (const dimension of Object.keys(unitInput)) selectedUnits[dimension] = form.elements.namedItem(unitInput[dimension][1]).value;
    updateMode(); calculate();
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
  updateMode();
}
