import { calculateRentalYield } from './logic.mjs';
import { announce, copyText, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="rental-yield-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const resultSection = root.querySelector('[data-rental-result]');
  const fields = ['grossRent', 'vacancyLoss', 'effectiveRent', 'expenses', 'noi', 'monthlyNet'];
  let summary = '';

  function number(value, digits = 2) {
    try { return new Intl.NumberFormat(copy.copyLanguage === 'zh_tw' ? 'zh-TW' : copy.copyLanguage, { maximumFractionDigits: digits }).format(value); }
    catch { return new Intl.NumberFormat(undefined, { maximumFractionDigits: digits }).format(value); }
  }

  function show(data) {
    const currency = form.elements.namedItem('currencySymbol').value.trim();
    const money = (value) => `${currency}${currency ? ' ' : ''}${number(value)}`;
    const values = [data.grossAnnualRent, data.vacancyLoss, data.effectiveAnnualRent, data.totalAnnualExpenses, data.netOperatingIncome, data.monthlyNetIncome];
    fields.forEach((key, index) => { root.querySelector(`[data-${key.replace(/[A-Z]/gu, (letter) => `-${letter.toLowerCase()}`)}]`).textContent = money(values[index]); });
    root.querySelector('[data-gross-yield]').textContent = `${number(data.grossYieldPercent, 3)}%`;
    root.querySelector('[data-net-yield]').textContent = `${number(data.netYieldPercent, 3)}%`;
    summary = [
      `${copy.fields.grossYieldPercent}: ${number(data.grossYieldPercent, 3)}%`,
      `${copy.fields.netYieldPercent}: ${number(data.netYieldPercent, 3)}%`,
      `${copy.fields.grossAnnualRent}: ${money(data.grossAnnualRent)}`,
      `${copy.fields.netOperatingIncome}: ${money(data.netOperatingIncome)}`,
    ].join('\n');
    resultSection.hidden = false;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      const data = calculateRentalYield(Object.fromEntries(['propertyPrice', 'monthlyRent', 'vacancyPercent', 'annualPropertyTax', 'annualMaintenance', 'annualInsurance', 'annualAssociationFees', 'annualOtherExpenses'].map((key) => [key, form.elements.namedItem(key).value])));
      show(data);
      announce(root, copy.messages.calculated, 'success');
    } catch {
      resultSection.hidden = true;
      summary = '';
      announce(root, copy.messages.checkInputs, 'error');
    }
  });

  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    const example = { propertyPrice: 200000, monthlyRent: 1000, vacancyPercent: 5, annualPropertyTax: 1800, annualMaintenance: 900, annualInsurance: 600, annualAssociationFees: 300, annualOtherExpenses: 0 };
    for (const [key, value] of Object.entries(example)) form.elements.namedItem(key).value = String(value);
    form.elements.namedItem('currencySymbol').value = '$';
    form.requestSubmit();
  });
  form.addEventListener('reset', () => {
    resultSection.hidden = true;
    summary = '';
    announce(root, '');
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
    if (summary) copyText(root, summary, copy);
    else announce(root, copy.messages.checkInputs, 'error');
  });
}
