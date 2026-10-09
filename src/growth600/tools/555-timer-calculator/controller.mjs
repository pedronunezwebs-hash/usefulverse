import { parseLocalizedNumber } from '../../../advanced-logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';
import { calculate555Astable, calculate555Monostable } from './logic.mjs';

const root = document.querySelector('[data-tool="555-timer-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  let outputText = '';
  const language = () => document.documentElement.lang || 'en';
  const format = (value, digits = 6) => numberFormat(language(), value, digits);
  function formatTime(seconds) {
    const units = [[86400, 'd'], [3600, 'h'], [60, 'min'], [1, 's'], [1e-3, 'ms'], [1e-6, 'μs'], [1e-9, 'ns'], [1e-12, 'ps']];
    const [scale, unit] = units.find(([factor]) => Math.abs(seconds) >= factor) ?? [1, 's'];
    return `${format(seconds / scale)} ${unit}`;
  }
  function formatFrequency(hertz) {
    const [scale, unit] = hertz >= 1e6 ? [1e6, 'MHz'] : hertz >= 1e3 ? [1e3, 'kHz'] : [1, 'Hz'];
    return `${format(hertz / scale)} ${unit}`;
  }
  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      const read = (name) => parseLocalizedNumber(form.elements.namedItem(name).value, language());
      const resistanceScale = { ohm: 1, kohm: 1e3, Mohm: 1e6 }[form.elements.namedItem('resistanceUnit').value];
      const capacitanceScale = { F: 1, mF: 1e-3, uF: 1e-6, nF: 1e-9, pF: 1e-12 }[form.elements.namedItem('capacitanceUnit').value];
      if (!resistanceScale || !capacitanceScale) throw new RangeError('Unsupported component unit.');
      const capacitanceFarads = read('capacitance') * capacitanceScale;
      let rows;
      if (form.elements.namedItem('mode').value === 'astable') {
        const result = calculate555Astable({ rAOhms: read('resistanceA') * resistanceScale, rBOhms: read('resistanceB') * resistanceScale, capacitanceFarads });
        rows = [
          [copy.fields.resultFrequency, formatFrequency(result.frequencyHz)],
          [copy.fields.resultPeriod, formatTime(result.periodSeconds)],
          [copy.fields.resultHigh, formatTime(result.highSeconds)],
          [copy.fields.resultLow, formatTime(result.lowSeconds)],
          [copy.fields.resultWaveformDuty, `${format(result.waveformDutyPercent, 4)}%`],
          [copy.fields.resultDischargeDuty, `${format(result.dischargeDutyPercent, 4)}%`],
        ];
        if (result.aboveTypicalNe555Frequency) rows.push([copy.fields.frequencyNote, copy.fields.highFrequencyWarning]);
      } else if (form.elements.namedItem('mode').value === 'monostable') {
        const result = calculate555Monostable({ resistanceOhms: read('resistance') * resistanceScale, capacitanceFarads });
        rows = [[copy.fields.resultPulse, formatTime(result.pulseSeconds)]];
      } else throw new RangeError('Choose a supported circuit mode.');
      showRows(root, rows);
      outputText = `${rows.map(([label, value]) => `${label}: ${value}`).join('\n')}\n\n${copy.fields.formulaNote}`;
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }
  function updateMode() {
    const mode = form.elements.namedItem('mode').value;
    for (const section of root.querySelectorAll('[data-555-mode]')) section.hidden = section.getAttribute('data-555-mode') !== mode;
    clearResult(root); outputText = ''; announce(root, '');
  }
  form.elements.namedItem('mode').addEventListener('change', updateMode);
  form.addEventListener('input', () => { clearResult(root); outputText = ''; announce(root, ''); });
  form.addEventListener('change', () => { clearResult(root); outputText = ''; announce(root, ''); });
  form.addEventListener('submit', calculate);
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    const mode = form.elements.namedItem('mode').value;
    form.elements.namedItem('resistanceUnit').value = 'kohm';
    form.elements.namedItem('capacitanceUnit').value = 'uF';
    form.elements.namedItem('capacitance').value = '10';
    if (mode === 'astable') {
      form.elements.namedItem('resistanceA').value = '10';
      form.elements.namedItem('resistanceB').value = '10';
    } else form.elements.namedItem('resistance').value = '100';
    form.requestSubmit();
  });
  form.addEventListener('reset', () => setTimeout(() => { updateMode(); announce(root, ''); }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
}
