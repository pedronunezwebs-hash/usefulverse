import { calculateNorwayIncomeTax } from './norway-income-tax.mjs';

const root = document.querySelector('[data-market-tool="norwayTax"]');
const copy = JSON.parse(root.querySelector('[data-tool-copy]').textContent);
const f = copy.fields;
const output = root.querySelector('[data-tax-results]');
const formatCurrency = (value) => new Intl.NumberFormat(document.documentElement.lang, { style: 'currency', currency: 'NOK', maximumFractionDigits: 0 }).format(value);
let lastResults = null;

function scenarios() {
  return [
    { label: f.firstScenario, type: root.querySelector('#tax-a-type').value, income: Number(root.querySelector('#tax-a-amount').value) },
    { label: f.secondScenario, type: root.querySelector('#tax-b-type').value, income: Number(root.querySelector('#tax-b-amount').value) },
  ];
}

function updateNotice(id) {
  const type = root.querySelector(`#${id}-type`).value;
  root.querySelector(`[data-tax-notice="${id}"]`).textContent = type === 'pension' ? f.pensionNotice : f.salaryNotice;
}

function cell(text, tag = 'td') {
  const element = document.createElement(tag);
  element.textContent = text;
  return element;
}

function render(results) {
  const table = document.createElement('table');
  const caption = cell(f.sourceNote, 'caption');
  table.append(caption);
  const head = document.createElement('thead');
  const heading = document.createElement('tr');
  heading.append(cell(f.scenario, 'th'), ...results.map(({ label }) => cell(label, 'th')));
  head.append(heading);
  table.append(head);
  const body = document.createElement('tbody');
  const rows = [
    [f.annualTax, ({ tax }) => formatCurrency(tax)],
    [f.monthlyTax, ({ tax }) => formatCurrency(Math.round(tax / 12))],
    [f.annualNet, ({ net }) => formatCurrency(net)],
    [f.monthlyNet, ({ net }) => formatCurrency(Math.round(net / 12))],
    [f.ordinaryTax, ({ ordinaryIncomeTax }) => formatCurrency(ordinaryIncomeTax)],
    [f.bracketTax, ({ bracketTax }) => formatCurrency(bracketTax)],
    [f.insurance, ({ nationalInsurance }) => formatCurrency(nationalInsurance)],
    [f.pensionCredit, ({ pensionCredit }) => formatCurrency(pensionCredit)],
    [f.basis, ({ standardDeduction, personalAllowance, zoneDeduction }) => formatCurrency(standardDeduction + personalAllowance + zoneDeduction)],
    [f.effectiveRate, ({ effectiveRate }) => new Intl.NumberFormat(document.documentElement.lang, { style: 'percent', maximumFractionDigits: 1 }).format(effectiveRate)],
  ];
  for (const [label, value] of rows) {
    const row = document.createElement('tr');
    row.append(cell(label, 'th'), ...results.map((result) => cell(value(result))));
    body.append(row);
  }
  table.append(body);
  const note = document.createElement('p');
  note.className = 'hint';
  note.textContent = f.notOfficial;
  output.replaceChildren(table, note);
  output.hidden = false;
  root.querySelector('[data-action="exportTax"]').disabled = false;
  root.querySelector('[data-action="printTax"]').disabled = false;
}

function run() {
  try {
    const zone = root.querySelector('#tax-zone').value;
    lastResults = scenarios().map((scenario) => ({ label: `${scenario.label} · ${scenario.type === 'pension' ? f.pension : f.salary}`, ...calculateNorwayIncomeTax({ income: scenario.income, type: scenario.type, zone }) }));
    render(lastResults);
  } catch {
    lastResults = null;
    output.textContent = copy.messages.invalid;
    output.hidden = false;
    root.querySelector('[data-action="exportTax"]').disabled = true;
  }
}

for (const id of ['tax-a', 'tax-b']) {
  root.querySelector(`#${id}-type`).addEventListener('change', () => updateNotice(id));
  updateNotice(id);
}
root.querySelector('[data-action="calculateTax"]').addEventListener('click', run);
root.querySelector('[data-action="resetTax"]').addEventListener('click', () => {
  root.querySelector('#tax-zone').value = 'standard';
  root.querySelector('#tax-a-type').value = 'salary';
  root.querySelector('#tax-a-amount').value = '600000';
  root.querySelector('#tax-b-type').value = 'salary';
  root.querySelector('#tax-b-amount').value = '500000';
  for (const id of ['tax-a', 'tax-b']) updateNotice(id);
  output.replaceChildren(); output.hidden = true; lastResults = null;
  root.querySelector('[data-action="exportTax"]').disabled = true;
  root.querySelector('[data-action="printTax"]').disabled = true;
});
root.querySelector('[data-action="printTax"]').addEventListener('click', () => { if (lastResults) window.print(); });
root.querySelector('[data-action="exportTax"]').addEventListener('click', () => {
  if (!lastResults) return;
  const csvCell = (value) => `"${String(value).replaceAll('"', '""')}"`;
  const records = [
    [f.scenario, ...lastResults.map(({ label }) => label)],
    [f.annualTax, ...lastResults.map(({ tax }) => tax)],
    [f.annualNet, ...lastResults.map(({ net }) => net)],
    [f.ordinaryTax, ...lastResults.map(({ ordinaryIncomeTax }) => ordinaryIncomeTax)],
    [f.bracketTax, ...lastResults.map(({ bracketTax }) => bracketTax)],
    [f.insurance, ...lastResults.map(({ nationalInsurance }) => nationalInsurance)],
    [f.pensionCredit, ...lastResults.map(({ pensionCredit }) => pensionCredit)],
  ];
  const csv = `\uFEFF${records.map((row) => row.map(csvCell).join(',')).join('\r\n')}`;
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'norway-tax-estimate-2026.csv'; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
});
