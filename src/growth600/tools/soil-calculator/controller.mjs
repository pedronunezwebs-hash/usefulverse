import { calculateSoil } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="soil-calculator"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const locale = document.documentElement.lang || 'en';
  const messages = copy.messages;
  let outputText = '';
  const display = (value, places = 3) => numberFormat(locale, value, places);

  function setShape(shape) {
    for (const group of root.querySelectorAll('[data-soil-dimensions]')) {
      const active = group.dataset.soilDimensions === shape;
      group.hidden = !active;
      for (const input of group.querySelectorAll('input')) input.required = active;
    }
  }

  function calculate(event) {
    event?.preventDefault();
    clearResult(root);
    outputText = '';
    try {
      const shape = form.elements.namedItem('shape').value;
      const result = calculateSoil({
        shape,
        length: shape === 'rectangle' ? readNumber(form, 'length', { min: 0 }) : undefined,
        width: shape === 'rectangle' ? readNumber(form, 'width', { min: 0 }) : undefined,
        diameter: shape === 'circle' ? readNumber(form, 'diameter', { min: 0 }) : undefined,
        depth: readNumber(form, 'depth', { min: 0 }),
        dimensionUnit: form.elements.namedItem('dimensionUnit').value,
        containerCount: readNumber(form, 'containerCount', { min: 1, max: 10_000 }),
        wastePercent: readNumber(form, 'wastePercent', { min: 0, max: 50 }),
        bagVolume: readNumber(form, 'bagVolume', { optional: true, min: 0 }),
        bagUnit: form.elements.namedItem('bagUnit').value,
      });
      const rows = [
        [messages.volumePerContainer, `${display(result.volumePerContainerM3)} m³`],
        [messages.totalVolume, `${display(result.totalVolumeM3)} m³`],
        [messages.orderVolume, `${display(result.orderVolumeM3)} m³`],
      ];
      if (result.bagsToBuy !== null) rows.push([messages.bagsToBuy, display(result.bagsToBuy, 0)]);
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, messages.calculated, 'success');
    } catch {
      announce(root, messages.checkInputs, 'error');
    }
  }

  const shapeField = form.elements.namedItem('shape');
  setShape(shapeField.value);
  shapeField.addEventListener('change', () => setShape(shapeField.value));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    shapeField.value = 'rectangle';
    form.elements.namedItem('dimensionUnit').value = 'm';
    form.elements.namedItem('length').value = '1';
    form.elements.namedItem('width').value = '1';
    form.elements.namedItem('diameter').value = '';
    form.elements.namedItem('depth').value = '1';
    form.elements.namedItem('containerCount').value = '1';
    form.elements.namedItem('wastePercent').value = '0';
    form.elements.namedItem('bagVolume').value = '';
    setShape('rectangle');
    calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => {
    setTimeout(() => {
      outputText = '';
      for (const field of form.querySelectorAll('[aria-invalid]')) field.removeAttribute('aria-invalid');
      setShape(shapeField.value);
      clearResult(root);
      announce(root, '');
    }, 0);
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
    if (outputText) copyText(root, outputText, copy);
  });
}
