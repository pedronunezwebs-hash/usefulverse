import { calculatePavers } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="paver-calculator"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const locale = document.documentElement.lang || 'en';
  const messages = copy.messages;
  const display = (value, places = 2) => numberFormat(locale, value, places);
  let outputText = '';

  function calculate(event) {
    event?.preventDefault();
    clearResult(root);
    outputText = '';
    try {
      const surfaceUnit = form.elements.namedItem('surfaceUnit').value;
      const moduleUnit = form.elements.namedItem('moduleUnit').value;
      const baseDepthUnit = form.elements.namedItem('baseDepthUnit').value;
      const paverPrice = form.elements.namedItem('pricePerPaver').value.trim();
      const basePrice = form.elements.namedItem('basePricePerM3').value.trim();
      const currency = form.elements.namedItem('currency').value;
      const result = calculatePavers({
        length: readNumber(form, 'length', { min: Number.MIN_VALUE }),
        width: readNumber(form, 'width', { min: Number.MIN_VALUE }),
        surfaceUnit,
        moduleLength: readNumber(form, 'moduleLength', { min: 1 }),
        moduleWidth: readNumber(form, 'moduleWidth', { min: 1 }),
        moduleUnit,
        paversPerModule: readNumber(form, 'paversPerModule', { min: 1, max: 1000, integer: true }),
        paverWastePercent: readNumber(form, 'paverWastePercent', { min: 0, max: 50 }),
        baseDepth: readNumber(form, 'baseDepth', { min: 0, max: 100 }),
        baseDepthUnit,
        baseWastePercent: readNumber(form, 'baseWastePercent', { min: 0, max: 50 }),
        pricePerPaver: paverPrice ? readNumber(form, 'pricePerPaver', { min: 0, max: 1_000_000 }) : null,
        basePricePerM3: basePrice ? readNumber(form, 'basePricePerM3', { min: 0, max: 1_000_000 }) : null,
        currency,
      });
      const area = surfaceUnit === 'ft' ? `${display(result.areaFt2)} ft²` : `${display(result.areaM2)} m²`;
      const perimeter = surfaceUnit === 'ft' ? `${display(result.perimeterFt)} ft` : `${display(result.perimeterM)} m`;
      const money = (value) => new Intl.NumberFormat(locale, { style: 'currency', currency: result.currency, maximumFractionDigits: 2 }).format(value);
      const rows = [
        [messages.area, area], [messages.perimeter, perimeter],
        [messages.moduleCount, `${display(result.modulesAlongLength, 0)} × ${display(result.modulesAlongWidth, 0)} = ${display(result.repeatModules, 0)}`],
        [messages.paversBeforeWaste, display(result.paversBeforeWaste, 0)], [messages.paversToBuy, display(result.paversToBuy, 0)],
        [messages.baseVolume, `${display(result.baseVolumeM3, 3)} m³`], [messages.baseOrderVolume, `${display(result.baseOrderVolumeM3, 3)} m³`],
        [messages.paverCost, result.paverCost === null ? messages.costNotEntered : money(result.paverCost)],
        [messages.baseCost, result.baseCost === null ? messages.costNotEntered : money(result.baseCost)],
      ];
      if (result.estimatedCost !== null) rows.push([messages.totalCost, money(result.estimatedCost)]);
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, messages.calculated, 'success');
    } catch {
      announce(root, messages.checkInputs, 'error');
    }
  }

  form.addEventListener('submit', calculate);
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    form.elements.namedItem('length').value = '10';
    form.elements.namedItem('width').value = '10';
    form.elements.namedItem('surfaceUnit').value = 'm';
    form.elements.namedItem('moduleLength').value = '40';
    form.elements.namedItem('moduleWidth').value = '40';
    form.elements.namedItem('moduleUnit').value = 'cm';
    form.elements.namedItem('paversPerModule').value = '1';
    form.elements.namedItem('paverWastePercent').value = '0';
    form.elements.namedItem('baseDepth').value = '10';
    form.elements.namedItem('baseDepthUnit').value = 'cm';
    form.elements.namedItem('baseWastePercent').value = '0';
    form.elements.namedItem('pricePerPaver').value = '';
    form.elements.namedItem('basePricePerM3').value = '';
    calculate();
  });
  form.addEventListener('reset', () => setTimeout(() => { clearResult(root); outputText = ''; announce(root, ''); }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
}
