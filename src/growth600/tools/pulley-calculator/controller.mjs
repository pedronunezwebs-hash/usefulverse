import { calculatePulley } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';
import { parseLocalizedNumber } from '../../../advanced-logic.mjs';

const root = document.querySelector('[data-tool="pulley-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const locale = () => document.documentElement.lang || 'en';
  const parseNumber = (value) => parseLocalizedNumber(value, locale());
  const format = (value, digits = 3) => numberFormat(locale(), value, digits);
  const visual = root.querySelector('[data-pulley-visual]');
  const svg = root.querySelector('[data-pulley-sketch]');
  let output = '';

  function drawSketch(result) {
    svg.replaceChildren();
    const ns = 'http://www.w3.org/2000/svg';
    const node = (tag, attrs = {}, text = '') => {
      const element = document.createElementNS(ns, tag);
      for (const [key, value] of Object.entries(attrs)) element.setAttribute(key, String(value));
      if (text) element.textContent = text;
      return element;
    };
    const centerY = 103;
    const leftX = 135;
    const rightX = 405;
    const maxDia = Math.max(result.driverDiameterMm, result.drivenDiameterMm);
    const scale = 72 / maxDia;
    const driverR = Math.max(5, result.driverDiameterMm * scale);
    const drivenR = Math.max(5, result.drivenDiameterMm * scale);
    const delta = Math.min(0.98, Math.max(-0.98, (drivenR - driverR) / (rightX - leftX)));
    const tangentY = Math.sqrt(1 - delta ** 2);
    const topStart = [leftX + driverR * delta, centerY - driverR * tangentY];
    const topEnd = [rightX + drivenR * delta, centerY - drivenR * tangentY];
    const bottomStart = [leftX - driverR * delta, centerY + driverR * tangentY];
    const bottomEnd = [rightX - drivenR * delta, centerY + drivenR * tangentY];
    const path = `M ${topStart[0]} ${topStart[1]} L ${topEnd[0]} ${topEnd[1]} A ${drivenR} ${drivenR} 0 1 1 ${bottomEnd[0]} ${bottomEnd[1]} L ${bottomStart[0]} ${bottomStart[1]} A ${driverR} ${driverR} 0 1 1 ${topStart[0]} ${topStart[1]}`;
    svg.append(
      node('title', {}, copy.fields.sketchTitle),
      node('desc', {}, copy.fields.sketchDescription),
      node('path', { d: path, fill: 'none', stroke: 'currentColor', 'stroke-width': 5, 'stroke-linecap': 'round' }),
      node('circle', { cx: leftX, cy: centerY, r: driverR, fill: 'var(--surface, white)', stroke: 'currentColor', 'stroke-width': 3 }),
      node('circle', { cx: rightX, cy: centerY, r: drivenR, fill: 'var(--surface, white)', stroke: 'currentColor', 'stroke-width': 3 }),
      node('circle', { cx: leftX, cy: centerY, r: 3, fill: 'currentColor' }),
      node('circle', { cx: rightX, cy: centerY, r: 3, fill: 'currentColor' }),
      node('text', { x: leftX, y: 202, 'text-anchor': 'middle', fill: 'currentColor', 'font-size': 13 }, copy.fields.driverDiameter),
      node('text', { x: rightX, y: 202, 'text-anchor': 'middle', fill: 'currentColor', 'font-size': 13 }, copy.fields.drivenDiameter),
      node('line', { x1: leftX, y1: centerY + 82, x2: rightX, y2: centerY + 82, stroke: 'currentColor', 'stroke-width': 1, 'stroke-dasharray': '4 4' }),
      node('text', { x: (leftX + rightX) / 2, y: centerY + 101, 'text-anchor': 'middle', fill: 'currentColor', 'font-size': 12 }, `${copy.fields.centerDistance}: ${format(result.centerDistance)} ${result.unit}`),
    );
  }

  function calculate(event) {
    event?.preventDefault();
    clearResult(root);
    output = '';
    try {
      const result = calculatePulley({
        driverDiameter: parseNumber(form.elements.namedItem('driverDiameter').value),
        drivenDiameter: parseNumber(form.elements.namedItem('drivenDiameter').value),
        centerDistance: parseNumber(form.elements.namedItem('centerDistance').value),
        inputRpm: parseNumber(form.elements.namedItem('inputRpm').value),
        unit: form.elements.namedItem('unit').value,
      });
      const lengthUnit = result.unit;
      const rows = [
        [copy.messages.beltLength, `${format(result.beltLength)} ${lengthUnit} (${format(result.beltLengthMm)} mm)`],
        [copy.messages.outputRpm, `${format(result.outputRpm)} RPM`],
        [copy.messages.speedRatio, `${format(result.speedRatio)}:1`],
        [copy.messages.beltSpeed, `${format(result.beltSpeedMetersPerSecond)} m/s (${format(result.beltSpeedFeetPerMinute)} ft/min)`],
        [copy.messages.smallWrap, `${format(result.smallWrapDegrees)}°`],
        [copy.messages.model, copy.messages.openBelt],
      ];
      showRows(root, rows);
      output = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      drawSketch(result);
      visual.hidden = false;
      announce(root, copy.messages.calculated, 'success');
    } catch {
      visual.hidden = true;
      form.elements.namedItem('driverDiameter').focus();
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  for (const name of ['driverDiameter', 'drivenDiameter', 'centerDistance', 'inputRpm']) {
    form.elements.namedItem(name).addEventListener('input', (event) => event.currentTarget.removeAttribute('aria-invalid'));
  }
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    form.elements.namedItem('driverDiameter').value = '100';
    form.elements.namedItem('drivenDiameter').value = '200';
    form.elements.namedItem('centerDistance').value = '500';
    form.elements.namedItem('inputRpm').value = '1500';
    form.elements.namedItem('unit').value = 'mm';
    calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => {
    output = '';
    visual.hidden = true;
    for (const name of ['driverDiameter', 'drivenDiameter', 'centerDistance', 'inputRpm']) form.elements.namedItem(name).removeAttribute('aria-invalid');
    clearResult(root);
    announce(root, '');
  }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
    if (output) copyText(root, output, copy);
  });
}
