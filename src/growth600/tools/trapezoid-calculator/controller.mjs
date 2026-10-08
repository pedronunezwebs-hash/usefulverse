import { calculateTrapezoid } from './logic.mjs';
import { announce, clearResult, copyText, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="trapezoid-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const diagram = root.querySelector('[data-trapezoid-shape]');
  let outputText = '';

  function format(value) {
    return new Intl.NumberFormat(document.documentElement.lang || 'en', { maximumFractionDigits: 4 }).format(value);
  }

  function updateDiagram(result) {
    const minimumX = Math.min(0, result.topOffset);
    const maximumX = Math.max(result.baseA, result.topOffset + result.baseB);
    const scale = Math.min(300 / (maximumX - minimumX), 140 / result.height);
    const x = (value) => 30 + ((value - minimumX) * scale);
    const bottomY = 180;
    const topY = bottomY - (result.height * scale);
    const points = [[x(0), bottomY], [x(result.baseA), bottomY], [x(result.topOffset + result.baseB), topY], [x(result.topOffset), topY]];
    diagram.setAttribute('points', points.map(([pointX, pointY]) => `${pointX.toFixed(2)},${pointY.toFixed(2)}`).join(' '));
    const heightLine = root.querySelector('[data-trapezoid-height-line]');
    heightLine.setAttribute('x1', x(result.topOffset).toFixed(2));
    heightLine.setAttribute('x2', x(result.topOffset).toFixed(2));
    heightLine.setAttribute('y1', topY.toFixed(2));
    heightLine.setAttribute('y2', bottomY.toFixed(2));
  }

  function calculate(event) {
    event?.preventDefault();
    clearResult(root);
    outputText = '';
    try {
      const result = calculateTrapezoid(Object.fromEntries(['baseA', 'baseB', 'height', 'topOffset'].map((name) => [name, form.elements.namedItem(name).value])));
      const unit = form.elements.namedItem('unit').value;
      const areaUnit = `${unit}²`;
      const rows = [
        [copy.messages.area, `${format(result.area)} ${areaUnit}`],
        [copy.messages.leftSide, `${format(result.leftSide)} ${unit}`],
        [copy.messages.rightSide, `${format(result.rightSide)} ${unit}`],
        [copy.messages.perimeter, `${format(result.perimeter)} ${unit}`],
      ];
      updateDiagram(result);
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => {
    outputText = '';
    clearResult(root);
    announce(root, '');
  }, 0));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    form.elements.namedItem('baseA').value = '6';
    form.elements.namedItem('baseB').value = '4';
    form.elements.namedItem('height').value = '3';
    form.elements.namedItem('topOffset').value = '1';
    calculate();
    announce(root, copy.messages.exampleLoaded, 'status');
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
    if (outputText) copyText(root, outputText, copy);
  });
}
