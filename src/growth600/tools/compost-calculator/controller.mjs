import { calculateCompostMix } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="compost-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const locale = document.documentElement.lang || 'en';
  const format = (value, places = 2) => numberFormat(locale, value, places);
  let outputText = '';
  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      const massUnit = form.elements.namedItem('massUnit').value;
      const toDisplayMass = (kg) => massUnit === 'lb' ? kg / 0.45359237 : kg;
      const materials = [1, 2, 3, 4].map((index) => ({
        name: form.elements.namedItem(`name${index}`).value,
        wetMass: readNumber(form, `wetMass${index}`, { optional: true, min: 0.001, max: 1_000_000 }),
        moisturePercent: readNumber(form, `moisture${index}`, { optional: true, min: 0, max: 99.9 }),
        carbonPercent: readNumber(form, `carbon${index}`, { optional: true, min: 0.01, max: 100 }),
        carbonNitrogenRatio: readNumber(form, `ratio${index}`, { optional: true, min: 0.1, max: 1000 }),
      }));
      const result = calculateCompostMix({
        materials, massUnit,
        targetMoisturePercent: readNumber(form, 'targetMoisturePercent', { optional: true, min: 0, max: 90 }),
      });
      const mass = (value) => `${format(toDisplayMass(value))} ${massUnit}`;
      const rows = [
        ...result.materials.map((item) => [`${copy.messages.perMaterial}: ${item.name}`, `${mass(item.wetMassKg)} · C:N ${format(item.carbonNitrogenRatio, 1)}`]),
        [copy.messages.wetMass, mass(result.wetMassKg)],
        [copy.messages.dryMass, mass(result.dryMassKg)],
        [copy.messages.waterMass, mass(result.waterKg)],
        [copy.messages.carbonMass, mass(result.carbonKg)],
        [copy.messages.nitrogenMass, mass(result.nitrogenKg)],
        [copy.messages.mixRatio, `${format(result.carbonNitrogenRatio, 1)}:1`],
        [copy.messages.mixMoisture, `${format(result.moisturePercent)}%`],
        ...(result.targetMoisturePercent === null ? [] : [[copy.messages.targetMoisture, `${format(result.targetMoisturePercent)}%`]]),
        ...(result.waterToAddKg === null ? [] : [[copy.messages.waterToAdd, mass(result.waterToAddKg)]]),
        ...(result.waterToRemoveKg === null ? [] : [[copy.messages.waterToRemove, mass(result.waterToRemoveKg)]]),
      ];
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    for (const [name, value] of Object.entries({ massUnit: 'kg', targetMoisturePercent: '55', name1: 'Dry leaves', wetMass1: '10', moisture1: '20', carbon1: '45', ratio1: '60', name2: 'Food scraps', wetMass2: '10', moisture2: '70', carbon2: '45', ratio2: '15', name3: '', wetMass3: '', moisture3: '', carbon3: '', ratio3: '', name4: '', wetMass4: '', moisture4: '', carbon4: '', ratio4: '' })) form.elements.namedItem(name).value = value;
    calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => { outputText = ''; clearResult(root); announce(root, ''); }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
}
