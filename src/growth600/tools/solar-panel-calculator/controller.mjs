import { calculateSolarPanel } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="solar-panel-calculator"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const locale = document.documentElement.lang || 'en';
  const messages = copy.messages;
  const modeField = form.elements.namedItem('mode');
  let outputText = '';
  const format = (value, places = 2) => numberFormat(locale, value, places);

  function syncMode() {
    const sizing = modeField.value === 'sizing';
    const target = form.elements.namedItem('dailyTargetKwh');
    const count = form.elements.namedItem('panelCount');
    root.querySelector('[data-solar-target]').hidden = !sizing;
    root.querySelector('[data-solar-count]').hidden = sizing;
    target.required = sizing;
    count.required = !sizing;
  }

  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      const readOptional = (name, max) => readNumber(form, name, { optional: true, min: 0, max });
      const rateValue = form.elements.namedItem('electricityRate').value.trim();
      const costValue = form.elements.namedItem('systemCost').value.trim();
      const panelLength = readOptional('panelLengthM', 5);
      const panelWidth = readOptional('panelWidthM', 5);
      if ((panelLength === null) !== (panelWidth === null)) {
        const missing = panelLength === null ? form.elements.namedItem('panelLengthM') : form.elements.namedItem('panelWidthM');
        missing.setAttribute('aria-invalid', 'true'); missing.focus(); throw new RangeError();
      }
      const currency = form.elements.namedItem('currency').value;
      const result = calculateSolarPanel({
        mode: modeField.value,
        panelCount: modeField.value === 'production' ? readNumber(form, 'panelCount', { min: 1, max: 10_000, integer: true }) : undefined,
        dailyTargetKwh: modeField.value === 'sizing' ? readNumber(form, 'dailyTargetKwh', { min: 0.1, max: 1000 }) : null,
        panelWatts: readNumber(form, 'panelWatts', { min: 50, max: 2000 }),
        peakSunHours: readNumber(form, 'peakSunHours', { min: 0.1, max: 14 }),
        lossPercent: readNumber(form, 'lossPercent', { min: 0, max: 60 }),
        panelLengthM: panelLength, panelWidthM: panelWidth,
        electricityRate: rateValue ? readNumber(form, 'electricityRate', { min: 0, max: 100 }) : null,
        systemCost: costValue ? readNumber(form, 'systemCost', { min: 0, max: 1_000_000_000 }) : null,
        currency,
      });
      const money = (value) => new Intl.NumberFormat(locale, { style: 'currency', currency: result.currency, maximumFractionDigits: 2 }).format(value);
      const rows = [
        [messages.panelCount, format(result.panelCount, 0)],
        [messages.systemSize, `${format(result.systemSizeKw, 2)} kW`],
        [messages.dailyProduction, `${format(result.dailyProductionKwh)} kWh`],
        [messages.monthlyProduction, `${format(result.monthlyProductionKwh)} kWh`],
        [messages.annualProduction, `${format(result.annualProductionKwh)} kWh`],
      ];
      if (result.panelAreaM2 !== null) rows.push([messages.panelArea, `${format(result.panelAreaM2)} m²`]);
      if (result.annualBillOffset !== null) rows.push([messages.annualSavings, money(result.annualBillOffset)]);
      if (result.systemCost !== null) rows.push([messages.simplePayback, result.simplePaybackYears === null ? messages.paybackUnavailable : `${format(result.simplePaybackYears)} ${copy.actions.years}`]);
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, messages.calculated, 'success');
    } catch {
      announce(root, messages.checkInputs, 'error');
    }
  }

  modeField.addEventListener('change', syncMode);
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    modeField.value = 'production'; syncMode();
    form.elements.namedItem('panelCount').value = '10';
    form.elements.namedItem('panelWatts').value = '100';
    form.elements.namedItem('peakSunHours').value = '5';
    form.elements.namedItem('lossPercent').value = '0';
    form.elements.namedItem('panelLengthM').value = '1';
    form.elements.namedItem('panelWidthM').value = '0.5';
    form.elements.namedItem('electricityRate').value = '0.15';
    form.elements.namedItem('systemCost').value = '5000';
    calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => {
    outputText = ''; for (const field of form.querySelectorAll('[aria-invalid]')) field.removeAttribute('aria-invalid');
    syncMode(); clearResult(root); announce(root, '');
  }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
  syncMode();
}
