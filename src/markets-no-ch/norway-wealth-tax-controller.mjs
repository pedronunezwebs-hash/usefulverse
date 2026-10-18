import { calculateNorwayWealthTax, compareNorwayWealthTaxSensitivity } from './norway-wealth-tax.mjs';

const root = document.querySelector('[data-market-tool="norwayWealthTax"]');
const copy = JSON.parse(root.querySelector('[data-tool-copy]').textContent);
const f = copy.fields;
const output = root.querySelector('[data-wealth-results]');
const formatCurrency = (value) => new Intl.NumberFormat(document.documentElement.lang, { style: 'currency', currency: 'NOK', maximumFractionDigits: 0 }).format(value);
let lastResult = null;

function readInput() {
  return {
    primaryHome: Number(root.querySelector('#wealth-primary-home').value),
    secondaryHome: Number(root.querySelector('#wealth-secondary-home').value),
    shares: Number(root.querySelector('#wealth-shares').value),
    businessAssets: Number(root.querySelector('#wealth-business-assets').value),
    cashOther: Number(root.querySelector('#wealth-cash-other').value),
    debt: Number(root.querySelector('#wealth-debt').value),
    jointlyTaxed: root.querySelector('#wealth-jointly-taxed').checked,
    municipalRate: Number(root.querySelector('#wealth-municipal-rate').value) / 100,
  };
}

function cell(text, tag = 'td') {
  const element = document.createElement(tag);
  element.textContent = text;
  return element;
}

function tableFor(sensitivity) {
  const table = document.createElement('table');
  const caption = document.createElement('caption');
  caption.textContent = `${f.assumptions} · ${f.year ?? 2026}`;
  table.append(caption);
  const headings = document.createElement('thead');
  const headingRow = document.createElement('tr');
  headingRow.append(cell(f.scenario ?? 'Scenario', 'th'), cell(f.lowEstimate, 'th'), cell(f.baseEstimate, 'th'), cell(f.highEstimate, 'th'));
  headings.append(headingRow);
  table.append(headings);
  const body = document.createElement('tbody');
  const rows = [
    [f.assets, 'fullAssetTotal'],
    [f.assessedAssets, 'taxableAssets'],
    [f.debt, 'debt'],
    [f.debtReduction, 'debtReduction'],
    [f.deductibleDebt, 'deductibleDebt'],
    [f.netWealth, 'netWealth'],
    [f.allowance, 'allowance'],
    [f.taxableWealth, 'taxableWealth'],
    [f.municipalTax, 'municipalTax'],
    [f.stateTax, 'stateTax'],
    [f.stateFirstBand, 'stateFirstBandTax'],
    [f.stateSecondBand, 'stateSecondBandTax'],
    [f.totalTax, 'totalTax'],
  ];
  for (const [label, key] of rows) {
    const row = document.createElement('tr');
    row.append(cell(label, 'th'), ...[sensitivity.low, sensitivity.base, sensitivity.high].map((result) => cell(formatCurrency(result[key]))));
    body.append(row);
  }
  table.append(body);
  return table;
}

function calculate() {
  try {
    const input = readInput();
    const percentage = Number(root.querySelector('#wealth-sensitivity').value);
    lastResult = compareNorwayWealthTaxSensitivity(input, percentage);
    const note = document.createElement('p');
    note.className = 'hint';
    note.textContent = f.noOfficial;
    output.replaceChildren(tableFor(lastResult), note);
    output.hidden = false;
    root.querySelector('[data-action="exportWealth"]').disabled = false;
    root.querySelector('[data-action="printWealth"]').disabled = false;
  } catch {
    lastResult = null;
    output.textContent = copy.messages.invalid;
    output.hidden = false;
    root.querySelector('[data-action="exportWealth"]').disabled = true;
    root.querySelector('[data-action="printWealth"]').disabled = true;
  }
}

function reset() {
  root.querySelector('#wealth-primary-home').value = '6000000';
  root.querySelector('#wealth-secondary-home').value = '0';
  root.querySelector('#wealth-shares').value = '0';
  root.querySelector('#wealth-business-assets').value = '0';
  root.querySelector('#wealth-cash-other').value = '500000';
  root.querySelector('#wealth-debt').value = '2000000';
  root.querySelector('#wealth-municipal-rate').value = '0.35';
  root.querySelector('#wealth-jointly-taxed').checked = false;
  root.querySelector('#wealth-sensitivity').value = '0.10';
  output.replaceChildren();
  output.hidden = true;
  lastResult = null;
  root.querySelector('[data-action="exportWealth"]').disabled = true;
  root.querySelector('[data-action="printWealth"]').disabled = true;
}

root.querySelector('[data-action="calculateWealth"]').addEventListener('click', calculate);
root.querySelector('[data-action="resetWealth"]').addEventListener('click', reset);
root.querySelector('[data-action="printWealth"]').addEventListener('click', () => { if (lastResult) window.print(); });
root.querySelector('[data-action="exportWealth"]').addEventListener('click', () => {
  if (!lastResult) return;
  const csvCell = (value) => `"${String(value).replaceAll('"', '""')}"`;
  const records = [
    [f.scenario ?? 'Scenario', f.lowEstimate, f.baseEstimate, f.highEstimate],
    ...[
      [f.assets, 'fullAssetTotal'], [f.assessedAssets, 'taxableAssets'], [f.debt, 'debt'],
      [f.debtReduction, 'debtReduction'], [f.deductibleDebt, 'deductibleDebt'], [f.netWealth, 'netWealth'],
      [f.allowance, 'allowance'], [f.taxableWealth, 'taxableWealth'], [f.municipalTax, 'municipalTax'],
      [f.stateTax, 'stateTax'], [f.stateFirstBand, 'stateFirstBandTax'], [f.stateSecondBand, 'stateSecondBandTax'],
      [f.totalTax, 'totalTax'],
    ].map(([label, key]) => [label, lastResult.low[key], lastResult.base[key], lastResult.high[key]]),
  ];
  const csv = `\uFEFF${records.map((row) => row.map(csvCell).join(',')).join('\r\n')}`;
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'norway-wealth-tax-estimate-2026.csv';
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
});
