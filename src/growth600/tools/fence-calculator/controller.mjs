import { calculateFence, FENCE_LENGTH_TO_M } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="fence-calculator"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const locale = document.documentElement.lang || 'en';
  const messages = copy.messages;
  let outputText = '';
  const format = (value) => numberFormat(locale, value, 2);
  const unit = () => form.elements.namedItem('unit').value;
  const materialUnit = () => form.elements.namedItem('materialUnit').value;
  const displayRun = (metres) => `${format(metres / FENCE_LENGTH_TO_M[unit()])} ${unit()}`;
  const displayMaterial = (metres) => `${format(metres / FENCE_LENGTH_TO_M[materialUnit()])} ${materialUnit()}`;

  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      const result = calculateFence({
        length: readNumber(form, 'length', { min: 0.1, max: 1_000_000 }),
        unit: unit(),
        gateCount: readNumber(form, 'gateCount', { min: 0, max: 20, integer: true }),
        gateWidth: readNumber(form, 'gateWidth', { min: 0.1, max: 1000 }),
        materialUnit: materialUnit(),
        postSpacing: readNumber(form, 'postSpacing', { min: 0.1, max: 1000 }),
        panelWidth: readNumber(form, 'panelWidth', { min: 0.1, max: 1000 }),
        picketWidth: readNumber(form, 'picketWidth', { min: 0.01, max: 1000 }),
        maxPicketGap: readNumber(form, 'maxPicketGap', { min: 0, max: 1_000 }),
        picketHeight: readNumber(form, 'picketHeight', { min: 0.1, max: 1000 }),
        wastePercent: readNumber(form, 'wastePercent', { min: 0, max: 30 }),
        pricePerPost: readNumber(form, 'pricePerPost', { optional: true, min: 0, max: 1_000_000 }),
        pricePerGate: readNumber(form, 'pricePerGate', { optional: true, min: 0, max: 1_000_000 }),
        pricePerPanel: readNumber(form, 'pricePerPanel', { optional: true, min: 0, max: 1_000_000 }),
        pricePerPicket: readNumber(form, 'pricePerPicket', { optional: true, min: 0, max: 1_000_000 }),
      });
      const rows = [
        [messages.totalRun, displayRun(result.totalLengthM)],
        [messages.gateOpening, `${readNumber(form, 'gateCount', { min: 0, max: 20, integer: true })} · ${displayMaterial(result.gateOpeningM)}`],
        [messages.fenceLength, displayRun(result.fenceLengthM)],
        [messages.sections, format(result.sectionCount)],
        [messages.averageSection, displayRun(result.averageSectionLengthM)],
        [messages.posts, format(result.postCount)],
        [messages.panels, `${format(result.orderedPanels)} (${format(result.panelCount)} + ${format(result.orderedPanels - result.panelCount)} ${messages.extra})`],
        [messages.pickets, `${format(result.orderedPickets)} (${format(result.picketCount)} + ${format(result.orderedPickets - result.picketCount)} ${messages.extra})`],
        [messages.picketGap, result.actualPicketGapM === null ? messages.onePicket : displayMaterial(result.actualPicketGapM)],
        [messages.picketLength, displayMaterial(result.orderedPicketLengthM)],
      ];
      if (result.estimatedPanelOptionCost !== null) rows.push([messages.panelCost, format(result.estimatedPanelOptionCost)]);
      if (result.estimatedPicketOptionCost !== null) rows.push([messages.picketCost, format(result.estimatedPicketOptionCost)]);
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, messages.calculated, 'success');
    } catch {
      announce(root, messages.checkInputs, 'error');
    }
  }

  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    for (const [name, value] of Object.entries({ unit: 'ft', length: '100', gateCount: '1', gateWidth: '48', materialUnit: 'in', postSpacing: '96', panelWidth: '96', picketWidth: '5.5', maxPicketGap: '2', picketHeight: '72', wastePercent: '10', pricePerPost: '', pricePerGate: '', pricePerPanel: '', pricePerPicket: '' })) form.elements.namedItem(name).value = value;
    calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => {
    outputText = '';
    for (const field of form.querySelectorAll('[aria-invalid]')) field.removeAttribute('aria-invalid');
    clearResult(root); announce(root, '');
  }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
}
