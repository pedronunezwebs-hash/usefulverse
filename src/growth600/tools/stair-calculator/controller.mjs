import { calculateStairGeometry } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="stair-calculator"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const unitField = form.elements.namedItem('unit');
  const locale = document.documentElement.lang || 'en';
  const messages = copy.messages;
  const diagram = root.querySelector('[data-stair-diagram]');
  let outputText = '';
  const format = (value) => numberFormat(locale, value, 2);

  function drawProfile(result) {
    const width = 420;
    const height = 170;
    const margin = 18;
    const treads = result.treadCount;
    const runMm = result.totalRun * ({ m: 1000, cm: 10, mm: 1, in: 25.4, ft: 304.8 })[result.unit];
    const riseMm = result.totalRise * ({ m: 1000, cm: 10, mm: 1, in: 25.4, ft: 304.8 })[result.unit];
    const scale = Math.min((width - 2 * margin) / runMm, (height - 2 * margin) / riseMm);
    const treadPx = result.treadDepth * ({ m: 1000, cm: 10, mm: 1, in: 25.4, ft: 304.8 })[result.unit] * scale;
    const risePx = result.riserHeight * ({ m: 1000, cm: 10, mm: 1, in: 25.4, ft: 304.8 })[result.unit] * scale;
    const baseY = height - margin;
    let x = margin;
    let y = baseY;
    const pathParts = [`M ${x} ${y}`];
    const point = (value) => Number(value.toFixed(2));
    for (let index = 0; index < result.riserCount; index += 1) {
      y -= risePx;
      pathParts.push(`V ${point(y)}`);
      if (index < treads) {
        x += treadPx;
        pathParts.push(`H ${point(x)}`);
      }
    }
    const path = document.createElementNS(diagram.namespaceURI, 'path');
    path.setAttribute('d', pathParts.join(' '));
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-width', '3');
    path.setAttribute('stroke-linejoin', 'round');
    path.setAttribute('stroke-linecap', 'round');
    diagram.replaceChildren(path);
    diagram.setAttribute('viewBox', `0 0 ${width} ${height}`);
    diagram.setAttribute('aria-label', `${messages.diagram}: ${result.riserCount} · ${format(result.riserHeight)} ${result.unit} · ${result.treadCount}`);
  }

  function calculate(event) {
    event?.preventDefault();
    clearResult(root);
    diagram.replaceChildren();
    outputText = '';
    try {
      const unit = unitField.value;
      const result = calculateStairGeometry(
        readNumber(form, 'totalRise', { min: 0 }),
        readNumber(form, 'riserCount', { min: 2, max: 100, integer: true }),
        readNumber(form, 'treadDepth', { min: 0 }),
        unit,
      );
      const rows = [
        [copy.fields.totalRise, `${format(result.totalRise)} ${unit}`],
        [messages.riserHeight, `${format(result.riserHeight)} ${unit}`],
        [copy.fields.treadDepth, `${format(result.treadDepth)} ${unit}`],
        [messages.treadCount, `${result.treadCount}`],
        [messages.totalRun, `${format(result.totalRun)} ${unit}`],
        [messages.angle, `${format(result.angleDegrees)}°`],
        [messages.stringerLength, `${format(result.stringerLength)} ${unit}`],
      ];
      showRows(root, rows);
      drawProfile(result);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, messages.calculated, 'success');
    } catch {
      announce(root, messages.checkInputs, 'error');
    }
  }

  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    unitField.value = 'm';
    form.elements.namedItem('totalRise').value = '2.8';
    form.elements.namedItem('riserCount').value = '16';
    form.elements.namedItem('treadDepth').value = '0.28';
    calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => {
    setTimeout(() => {
      outputText = '';
      for (const field of form.querySelectorAll('[aria-invalid]')) field.removeAttribute('aria-invalid');
      clearResult(root);
      diagram.replaceChildren();
      announce(root, '');
    }, 0);
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
    if (outputText) copyText(root, outputText, copy);
  });
}
