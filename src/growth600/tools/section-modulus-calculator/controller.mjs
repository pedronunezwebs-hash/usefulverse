import { calculateSectionProperties } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="section-modulus-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const shapeField = form.elements.namedItem('shape');
  const shapeGroups = [...root.querySelectorAll('[data-section-shape]')];
  let outputText = '';
  const format = (value) => numberFormat(document.documentElement.lang || 'en', value, 6);
  const requiredByShape = {
    rectangle: ['width', 'height'], circle: ['diameter'], 'hollow-rectangle': ['outerWidth', 'outerHeight', 'innerWidth', 'innerHeight'],
    'hollow-circle': ['outerDiameter', 'innerDiameter'], triangle: ['width', 'height'],
  };
  function syncShape() {
    for (const group of shapeGroups) group.hidden = !group.dataset.sectionShape.split(' ').includes(shapeField.value);
  }
  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      const shape = shapeField.value;
      const dimensions = Object.fromEntries(requiredByShape[shape].map((name) => [name, readNumber(form, name, { min: 1e-10, max: 1e6 })]));
      const result = calculateSectionProperties({ shape, ...dimensions });
      const unit = form.elements.namedItem('unit').value;
      const rows = [
        [copy.messages.area, `${format(result.area)} ${unit}²`],
        [copy.messages.centroidX, `${format(result.centroidX)} ${unit}`],
        [copy.messages.centroidY, `${format(result.centroidY)} ${unit}`],
        [copy.messages.ix, `${format(result.ix)} ${unit}⁴`],
        [copy.messages.iy, `${format(result.iy)} ${unit}⁴`],
        [copy.messages.zxTop, `${format(result.zxTop)} ${unit}³`],
        [copy.messages.zxBottom, `${format(result.zxBottom)} ${unit}³`],
        [copy.messages.zy, `${format(result.zy)} ${unit}³`],
      ];
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }
  shapeField.addEventListener('change', syncShape);
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => { outputText = ''; syncShape(); clearResult(root); announce(root, ''); }, 0));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    shapeField.value = 'rectangle'; form.elements.namedItem('width').value = '10'; form.elements.namedItem('height').value = '10';
    form.elements.namedItem('unit').value = 'mm'; syncShape(); calculate(); announce(root, copy.messages.exampleLoaded, 'status');
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
  syncShape();
}
