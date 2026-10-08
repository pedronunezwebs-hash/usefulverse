import { calculateElectricityCost } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="electricity-cost-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const locale = document.documentElement.lang || 'en';
  const format = (value, places = 2) => numberFormat(locale, value, places);
  let outputText = '';
  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      const currency = form.elements.namedItem('currency').value.trim().toUpperCase();
      const money = new Intl.NumberFormat(locale, { style: 'currency', currency });
      const appliances = [1, 2, 3, 4].map((index) => ({
        name: form.elements.namedItem(`applianceName${index}`).value,
        power: readNumber(form, `power${index}`, { optional: true, min: 0.01, max: 10_000_000 }),
        powerUnit: form.elements.namedItem(`powerUnit${index}`).value,
        quantity: readNumber(form, `quantity${index}`, { optional: true, min: 1, max: 10_000, integer: true }),
        hoursPerDay: readNumber(form, `hours${index}`, { optional: true, min: 0, max: 24 }),
        activeDays: readNumber(form, `activeDays${index}`, { optional: true, min: 0, max: 31, integer: true }),
      }));
      const result = calculateElectricityCost({
        appliances,
        ratePerKwh: readNumber(form, 'ratePerKwh', { min: 0, max: 1_000_000 }),
        billingDays: readNumber(form, 'billingDays', { min: 1, max: 31, integer: true }),
        fixedCharge: readNumber(form, 'fixedCharge', { min: 0, max: 1_000_000 }),
      });
      const rows = [
        ...result.appliances.map((item) => [`${copy.messages.applianceBreakdown}: ${item.name}`, `${format(item.energyKwh, 3)} kWh · ${money.format(item.energyCost)}`]),
        [copy.messages.energyKwh, `${format(result.energyKwh, 3)} kWh`],
        [copy.messages.energyCost, money.format(result.energyCost)],
        [copy.messages.fixedCharge, money.format(result.fixedCharge)],
        [copy.messages.totalCost, money.format(result.totalCost)],
        [copy.messages.averageDailyKwh, `${format(result.averageDailyKwh, 3)} kWh`],
        [copy.messages.averageDailyCost, money.format(result.averageDailyCost)],
      ];
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    for (const [name, value] of Object.entries({ ratePerKwh: '0.2', billingDays: '1', fixedCharge: '0', currency: 'USD', applianceName1: 'Example appliance', power1: '1000', powerUnit1: 'W', quantity1: '1', hours1: '1', activeDays1: '1', applianceName2: '', power2: '', powerUnit2: 'W', quantity2: '', hours2: '', activeDays2: '', applianceName3: '', power3: '', powerUnit3: 'W', quantity3: '', hours3: '', activeDays3: '', applianceName4: '', power4: '', powerUnit4: 'W', quantity4: '', hours4: '', activeDays4: '' })) form.elements.namedItem(name).value = value;
    calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => { outputText = ''; clearResult(root); announce(root, ''); }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
}
