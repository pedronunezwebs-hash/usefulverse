import { calculateMulch } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="mulch-calculator"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const shape = form.elements.namedItem('shape');
  const locale = document.documentElement.lang || 'en';
  const messages = copy.messages;
  const display = (value, places = 2) => numberFormat(locale, value, places);
  let outputText = '';

  function syncShape() {
    for (const group of root.querySelectorAll('[data-mulch-dimensions]')) {
      const active = group.dataset.mulchDimensions === shape.value;
      group.hidden = !active;
      for (const input of group.querySelectorAll('input')) input.required = active;
    }
  }

  function calculate(event) {
    event?.preventDefault();
    clearResult(root);
    outputText = '';
    try {
      const unit = form.elements.namedItem('dimensionUnit').value;
      const areaUnit = unit === 'ft' ? 'ft2' : 'm2';
      const priceValue = form.elements.namedItem('pricePerBag').value.trim();
      const currency = form.elements.namedItem('currency').value;
      const result = calculateMulch({
        shape: shape.value,
        length: shape.value === 'rectangle' ? readNumber(form, 'length', { min: Number.MIN_VALUE }) : undefined,
        width: shape.value === 'rectangle' ? readNumber(form, 'width', { min: Number.MIN_VALUE }) : undefined,
        diameter: shape.value === 'circle' ? readNumber(form, 'diameter', { min: Number.MIN_VALUE }) : undefined,
        bedCount: readNumber(form, 'bedCount', { min: 1, max: 1000 }),
        areaUnit,
        depth: readNumber(form, 'depth', { min: Number.MIN_VALUE }),
        depthUnit: form.elements.namedItem('depthUnit').value,
        bagVolume: readNumber(form, 'bagVolume', { min: Number.MIN_VALUE }),
        bagUnit: form.elements.namedItem('bagUnit').value,
        wastePercent: readNumber(form, 'wastePercent', { min: 0, max: 50 }),
        pricePerBag: priceValue ? readNumber(form, 'pricePerBag', { min: 0, max: 1_000_000 }) : null,
        currency,
      });
      const area = unit === 'ft' ? `${display(result.areaM2 / 0.09290304)} ft²` : `${display(result.areaM2)} m²`;
      const depth = `${display(result.depthM / (form.elements.namedItem('depthUnit').value === 'in' ? 0.0254 : form.elements.namedItem('depthUnit').value === 'mm' ? 0.001 : 0.01))} ${form.elements.namedItem('depthUnit').value}`;
      const rows = [
        [messages.bedArea, area], [messages.mulchDepth, depth],
        [messages.volume, `${display(result.volumeM3, 3)} m³`],
        [messages.orderVolume, `${display(result.orderVolumeM3, 3)} m³`],
        [messages.cubicYards, `${display(result.orderVolumeYd3, 2)} yd³`],
        [messages.bags, display(result.bags, 0)],
      ];
      if (result.estimatedCost !== null) {
        const formattedCost = new Intl.NumberFormat(locale, { style: 'currency', currency: result.currency, maximumFractionDigits: 2 }).format(result.estimatedCost);
        rows.push([messages.estimatedCost, formattedCost]);
      } else rows.push([messages.estimatedCost, messages.costNotEntered]);
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, messages.calculated, 'success');
    } catch {
      announce(root, messages.checkInputs, 'error');
    }
  }

  form.addEventListener('submit', calculate);
  shape.addEventListener('change', syncShape);
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    shape.value = 'rectangle';
    form.elements.namedItem('dimensionUnit').value = 'm';
    form.elements.namedItem('length').value = '5';
    form.elements.namedItem('width').value = '4';
    form.elements.namedItem('bedCount').value = '1';
    form.elements.namedItem('depth').value = '5';
    form.elements.namedItem('depthUnit').value = 'cm';
    form.elements.namedItem('bagVolume').value = '50';
    form.elements.namedItem('bagUnit').value = 'L';
    form.elements.namedItem('wastePercent').value = '0';
    form.elements.namedItem('pricePerBag').value = '';
    syncShape();
    calculate();
  });
  form.addEventListener('reset', () => setTimeout(() => { syncShape(); clearResult(root); outputText = ''; announce(root, ''); }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
  syncShape();
}
