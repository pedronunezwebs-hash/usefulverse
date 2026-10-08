import { calculatePoolVolume } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="pool-volume-calculator"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const locale = document.documentElement.lang || 'en';
  const messages = copy.messages;
  let outputText = '';
  const format = (value) => numberFormat(locale, value, 2);

  function updateFields() {
    const shape = form.elements.namedItem('shape').value;
    for (const group of root.querySelectorAll('[data-pool-dimensions]')) {
      const active = group.dataset.poolDimensions === shape;
      group.hidden = !active;
      for (const input of group.querySelectorAll('input')) input.required = active;
    }
    const sloped = form.elements.namedItem('floor').value === 'sloped';
    const deepGroup = root.querySelector('[data-pool-deep-depth]');
    deepGroup.hidden = !sloped;
    form.elements.namedItem('deepDepth').required = sloped;
  }

  function calculate(event) {
    event?.preventDefault();
    clearResult(root);
    outputText = '';
    try {
      const shape = form.elements.namedItem('shape').value;
      const floor = form.elements.namedItem('floor').value;
      const result = calculatePoolVolume({
        shape,
        length: ['rectangle', 'oval'].includes(shape) ? readNumber(form, shape === 'oval' ? 'ovalLength' : 'length', { min: 0.01, max: 100_000 }) : undefined,
        width: ['rectangle', 'oval'].includes(shape) ? readNumber(form, shape === 'oval' ? 'ovalWidth' : 'width', { min: 0.01, max: 100_000 }) : undefined,
        diameter: shape === 'circle' ? readNumber(form, 'diameter', { min: 0.01, max: 100_000 }) : undefined,
        floor,
        shallowDepth: readNumber(form, 'shallowDepth', { min: 0.01, max: 100_000 }),
        deepDepth: floor === 'sloped' ? readNumber(form, 'deepDepth', { min: 0.01, max: 100_000 }) : undefined,
        dimensionUnit: form.elements.namedItem('dimensionUnit').value,
      });
      const rows = [
        [messages.averageDepth, `${format(result.averageDepthM)} m`],
        [messages.volume, `${format(result.volumeM3)} m³`],
        [messages.liters, `${format(result.liters)} L`],
        [messages.usGallons, format(result.usGallons)],
        [messages.imperialGallons, format(result.imperialGallons)],
      ];
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, messages.calculated, 'success');
    } catch {
      announce(root, messages.checkInputs, 'error');
    }
  }

  const shapeField = form.elements.namedItem('shape');
  const floorField = form.elements.namedItem('floor');
  updateFields();
  shapeField.addEventListener('change', updateFields);
  floorField.addEventListener('change', updateFields);
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    shapeField.value = 'rectangle'; floorField.value = 'flat';
    form.elements.namedItem('dimensionUnit').value = 'm';
    form.elements.namedItem('length').value = '2'; form.elements.namedItem('width').value = '3';
    form.elements.namedItem('shallowDepth').value = '1'; form.elements.namedItem('deepDepth').value = '';
    updateFields(); calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => {
    outputText = '';
    for (const field of form.querySelectorAll('[aria-invalid]')) field.removeAttribute('aria-invalid');
    updateFields(); clearResult(root); announce(root, '');
  }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
}
