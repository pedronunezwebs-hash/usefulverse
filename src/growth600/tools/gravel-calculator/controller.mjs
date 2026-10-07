import { calculateCircularArea, calculateGravel, calculateRectangularArea, calculateTriangularArea } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="gravel-calculator"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const shape = form.elements.namedItem('shape');
  const dimensionGroups = [...form.querySelectorAll('[data-shape-dimensions]')];
  const locale = document.documentElement.lang || 'en';
  const messages = copy.messages;
  const factors = { m: 1, cm: 0.01, ft: 0.3048, in: 0.0254 };
  const display = (value, places = 2) => numberFormat(locale, value, places);

  function syncShape() {
    for (const group of dimensionGroups) {
      const active = group.dataset.shapeDimensions === shape.value;
      group.hidden = !active;
      for (const input of group.querySelectorAll('input')) input.disabled = !active;
    }
  }

  function calculate(event) {
    event?.preventDefault();
    clearResult(root);
    try {
      const factor = factors[form.elements.namedItem('dimensionUnit').value];
      const area = shape.value === 'rectangle'
        ? calculateRectangularArea(readNumber(form, 'length', { min: Number.MIN_VALUE }) * factor, readNumber(form, 'width', { min: Number.MIN_VALUE }) * factor)
        : shape.value === 'circle'
          ? calculateCircularArea(readNumber(form, 'diameter', { min: Number.MIN_VALUE }) * factor)
          : calculateTriangularArea(readNumber(form, 'base', { min: Number.MIN_VALUE }) * factor, readNumber(form, 'triangleHeight', { min: Number.MIN_VALUE }) * factor);
      const depth = readNumber(form, 'depth', { min: Number.MIN_VALUE }) * factors[form.elements.namedItem('depthUnit').value];
      const waste = readNumber(form, 'waste', { min: 0, max: 100 });
      const rawDensity = readNumber(form, 'density', { optional: true, min: Number.MIN_VALUE });
      const density = rawDensity === null ? null : rawDensity * (form.elements.namedItem('densityUnit').value === 'lbft3' ? 16.01846337396 : 1);
      const rawBag = readNumber(form, 'bagSize', { optional: true, min: Number.MIN_VALUE });
      const bagKg = rawBag === null ? null : rawBag * (form.elements.namedItem('bagUnit').value === 'lb' ? 0.45359237 : 1);
      const result = calculateGravel({ areaM2: area, depthM: depth, densityKgM3: density, wastePercent: waste, bagKg });
      const rows = [
        [messages.area, `${display(area)} m²`],
        [messages.volume, `${display(result.volumeM3, 3)} m³`],
        [messages.orderVolume, `${display(result.orderVolumeM3, 3)} m³`],
      ];
      if (result.weightKg !== null) rows.push([messages.estimatedWeight, `${display(result.weightKg)} kg`]);
      if (result.bags !== null) rows.push([messages.bagsToBuy, display(result.bags, 0)]);
      showRows(root, rows);
      announce(root, messages.calculated, 'success');
    } catch {
      announce(root, messages.checkInputs, 'error');
    }
  }

  shape.addEventListener('change', syncShape);
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => {
    setTimeout(() => { syncShape(); clearResult(root); announce(root, ''); }, 0);
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
    const text = [...root.querySelectorAll('[data-result-content] dt')].map((term) => `${term.textContent}: ${term.nextElementSibling?.textContent ?? ''}`).join('\n');
    if (text) copyText(root, text, copy);
  });
  syncShape();
}
