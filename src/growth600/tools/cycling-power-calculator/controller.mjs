import { calculateCyclingPower, convertCyclingUnits } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="cycling-power-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const unitSystem = form.elements.namedItem('unitSystem');
  const labels = {
    metric: { mass: `${copy.fields.mass} (kg)`, speed: `${copy.fields.speed} (km/h)`, wind: `${copy.fields.headwind} (km/h)` },
    imperial: { mass: `${copy.fields.mass} (lb)`, speed: `${copy.fields.speed} (mph)`, wind: `${copy.fields.headwind} (mph)` },
  };
  let outputText = '';
  let activeUnitSystem = unitSystem.value;
  const format = (value, digits = 2) => numberFormat(document.documentElement.lang || 'en', value, digits);

  function convertVisibleInputs(from, to) {
    const getInput = (name) => form.elements.namedItem(name);
    const toNumber = (name) => getInput(name).value.trim() === '' ? Number.NaN : Number(getInput(name).value);
    const converted = convertCyclingUnits({ mass: toNumber('mass'), speed: toNumber('speed'), headwind: toNumber('headwind'), from, to });
    for (const [name, value] of Object.entries(converted)) {
      if (Number.isFinite(value)) getInput(name).value = String(Number(value.toPrecision(7)));
    }
  }

  function updateUnits() {
    const metric = unitSystem.value === 'metric';
    form.querySelector('label[for="cycling-mass"]').textContent = labels[metric ? 'metric' : 'imperial'].mass;
    form.querySelector('label[for="cycling-speed"]').textContent = labels[metric ? 'metric' : 'imperial'].speed;
    form.querySelector('label[for="cycling-wind"]').textContent = labels[metric ? 'metric' : 'imperial'].wind;
    form.elements.namedItem('mass').min = metric ? '20' : '44.1';
    form.elements.namedItem('mass').max = metric ? '250' : '551.2';
    form.elements.namedItem('speed').min = '0.1';
    form.elements.namedItem('speed').max = metric ? '100' : '62.2';
    form.elements.namedItem('headwind').min = metric ? '-100' : '-62.2';
    form.elements.namedItem('headwind').max = metric ? '100' : '62.2';
    activeUnitSystem = unitSystem.value;
  }

  function estimate(event) {
    event?.preventDefault();
    clearResult(root); outputText = '';
    try {
      const read = (name) => form.elements.namedItem(name).value;
      const result = calculateCyclingPower({
        mass: Number(read('mass')), speed: Number(read('speed')), gradientPercent: Number(read('gradientPercent')),
        headwind: Number(read('headwind')), rollingResistance: Number(read('rollingResistance')), dragArea: Number(read('dragArea')),
        airDensity: Number(read('airDensity')), drivetrainEfficiency: Number(read('drivetrainEfficiency')), unitSystem: read('unitSystem'),
      });
      const rows = [
        [copy.messages.riderPower, `${format(result.riderWatts)} W`],
        [copy.messages.wattsPerKg, `${format(result.wattsPerKg, 3)} W/kg`],
        [copy.messages.aerodynamicPower, `${format(result.aeroWatts)} W`],
        [copy.messages.rollingPower, `${format(result.rollingWatts)} W`],
        [copy.messages.climbingPower, `${format(result.climbingWatts)} W`],
        [copy.messages.wheelPower, `${format(result.wheelWatts)} W`],
      ];
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  unitSystem.addEventListener('change', () => {
    const nextUnitSystem = unitSystem.value;
    convertVisibleInputs(activeUnitSystem, nextUnitSystem);
    updateUnits(); clearResult(root); outputText = '';
  });
  form.addEventListener('input', () => { clearResult(root); outputText = ''; });
  form.addEventListener('submit', estimate);
  form.addEventListener('reset', () => setTimeout(() => { clearResult(root); outputText = ''; announce(root, ''); updateUnits(); }, 0));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    unitSystem.value = 'metric';
    for (const [name, value] of Object.entries({ mass: '85', speed: '30', gradientPercent: '0', headwind: '0', rollingResistance: '0.004', dragArea: '0.32', airDensity: '1.225', drivetrainEfficiency: '97' })) form.elements.namedItem(name).value = value;
    updateUnits(); estimate();
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
  updateUnits();
}
