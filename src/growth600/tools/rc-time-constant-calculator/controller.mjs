import { calculateRcTransient } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="rc-time-constant-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const locale = () => document.documentElement.lang || 'en';
  const format = (value, digits = 6) => numberFormat(locale(), value, digits);
  const timeSymbols = { s: 's', ms: 'ms', us: 'μs' };
  const mode = form.elements.namedItem('mode');
  const timeField = root.querySelector('[data-rc-time-field]');
  const targetField = root.querySelector('[data-rc-target-field]');
  let output = '';

  function syncMode() {
    const findTime = mode.value === 'time';
    timeField.hidden = findTime;
    targetField.hidden = !findTime;
    const elapsed = timeField.querySelector('input');
    const target = targetField.querySelector('input');
    elapsed.disabled = findTime;
    elapsed.required = !findTime;
    target.disabled = !findTime;
    target.required = findTime;
    clearResult(root);
    output = '';
    announce(root, '');
  }

  function displayTime(value, scale, symbol) { return `${format(value / scale)} ${symbol}`; }

  function addChart(result) {
    const content = root.querySelector('[data-result-content]');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 420 190');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', copy.fields.graphLabel);
    svg.dataset.rcChart = '';
    const axis = document.createElementNS(svg.namespaceURI, 'line');
    axis.setAttribute('x1', '42'); axis.setAttribute('y1', '18'); axis.setAttribute('x2', '42'); axis.setAttribute('y2', '155');
    const baseline = document.createElementNS(svg.namespaceURI, 'line');
    baseline.setAttribute('x1', '42'); baseline.setAttribute('y1', '155'); baseline.setAttribute('x2', '405'); baseline.setAttribute('y2', '155');
    const line = document.createElementNS(svg.namespaceURI, 'polyline');
    const span = Math.max(result.timeSeconds ?? result.tauSeconds * 5, result.tauSeconds * 5);
    const points = Array.from({ length: 49 }, (_, index) => {
      const fraction = index / 48;
      const time = span * fraction;
      const voltage = result.finalVoltage + (result.initialVoltage - result.finalVoltage) * Math.exp(-time / result.tauSeconds);
      const x = 42 + fraction * 363;
      const y = 18 + (1 - (voltage - result.finalVoltage) / (result.initialVoltage - result.finalVoltage)) * 137;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    });
    line.setAttribute('points', points.join(' '));
    const xLabel = document.createElementNS(svg.namespaceURI, 'text');
    xLabel.setAttribute('x', '220'); xLabel.setAttribute('y', '181'); xLabel.setAttribute('text-anchor', 'middle');
    xLabel.textContent = `${copy.fields.timeAxis} (0–${format(span)} s)`;
    const yLabel = document.createElementNS(svg.namespaceURI, 'text');
    yLabel.setAttribute('x', '8'); yLabel.setAttribute('y', '14');
    yLabel.textContent = copy.fields.voltageAxis;
    svg.append(axis, baseline, line, xLabel, yLabel);
    content.append(svg);
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearResult(root);
    output = '';
    try {
      const timeScale = { s: 1, ms: 1e-3, us: 1e-6 }[form.elements.namedItem('timeUnit').value];
      if (!timeScale) throw new RangeError('Choose a time unit.');
      const timeSymbol = timeSymbols[form.elements.namedItem('timeUnit').value];
      const result = calculateRcTransient({
        resistance: readNumber(form, 'resistance', { min: Number.MIN_VALUE, max: 1e12 }),
        resistanceUnit: form.elements.namedItem('resistanceUnit').value,
        capacitance: readNumber(form, 'capacitance', { min: Number.MIN_VALUE, max: 1e12 }),
        capacitanceUnit: form.elements.namedItem('capacitanceUnit').value,
        initialVoltage: readNumber(form, 'initialVoltage', { min: -1e9, max: 1e9 }),
        finalVoltage: readNumber(form, 'finalVoltage', { min: -1e9, max: 1e9 }),
        ...(mode.value === 'time'
          ? { targetVoltage: readNumber(form, 'targetVoltage', { min: -1e9, max: 1e9 }) }
          : { time: readNumber(form, 'time', { min: 0, max: 1e12 }) * timeScale }),
      });
      const rows = [
        [copy.fields.timeConstant, displayTime(result.tauSeconds, timeScale, timeSymbol)],
        [result.mode === 'time' ? copy.fields.timeToTarget : copy.fields.voltageAtTime, result.mode === 'time' ? displayTime(result.timeSeconds, timeScale, timeSymbol) : `${format(result.voltage)} V`],
        [copy.fields.riseTime, displayTime(result.rise10To90Seconds, timeScale, timeSymbol)],
        [copy.fields.responseFraction, `${format(result.ratio)} (${format(result.ratio * 100)}%)`],
      ];
      showRows(root, rows);
      addChart(result);
      output = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  });

  mode.addEventListener('change', syncMode);
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    mode.value = 'voltage';
    for (const [name, value] of Object.entries({ resistance: '1000', resistanceUnit: 'ohm', capacitance: '100', capacitanceUnit: 'uF', initialVoltage: '0', finalVoltage: '5', time: '0.1', targetVoltage: '3.16' })) form.elements.namedItem(name).value = value;
    syncMode();
    form.requestSubmit();
  });
  form.addEventListener('reset', () => setTimeout(() => { syncMode(); clearResult(root); announce(root, ''); }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (output) copyText(root, output, copy); });
  syncMode();
}
