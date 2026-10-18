import { compareSwissVehicleTax, swissVehicleTaxCsv } from './switzerland-vehicle-tax.mjs';

export function initSwissVehicleTax(documentRef = document) {
  const tool = documentRef.querySelector('[data-market-tool="swissVehicleTax"]');
  if (!tool) return;
  let copy;
  try { copy = JSON.parse(documentRef.querySelector('[data-tool-copy]')?.textContent ?? '{}').fields; } catch { return; }
  if (!copy) return;
  const q = (selector) => tool.querySelector(selector);
  const status = q('[data-swiss-tax-status]');
  const results = q('[data-swiss-tax-results]');
  const summary = q('[data-swiss-tax-summary]');
  const head = q('[data-swiss-tax-head]');
  const body = q('[data-swiss-tax-body]');
  const exportButton = q('[data-action="exportSwissTax"]');
  const number = new Intl.NumberFormat(documentRef.documentElement.lang || 'en', { maximumFractionDigits: 0 });
  let currentResult = null;

  const element = (tag, text, className) => {
    const node = documentRef.createElement(tag);
    node.textContent = text;
    if (className) node.className = className;
    return node;
  };
  const buildSummary = (result) => {
    summary.replaceChildren();
    const values = [[copy.minimum, result.summary.minimum], [copy.maximum, result.summary.maximum], [copy.average, result.summary.mean]];
    const dl = documentRef.createElement('dl');
    dl.className = 'swiss-tax-summary';
    for (const [label, value] of values) {
      const item = documentRef.createElement('div');
      item.append(element('dt', label), element('dd', `CHF ${number.format(value)}`));
      dl.append(item);
    }
    summary.append(dl);
  };
  const calculate = () => {
    try {
      const result = compareSwissVehicleTax({
        vehicleId: q('#swiss-tax-vehicle').value,
        comparisonVehicleId: q('#swiss-tax-comparison').value,
        canton: q('#swiss-tax-canton').value,
        order: q('#swiss-tax-order').value,
      });
      currentResult = result;
      status.textContent = copy.status.replace('{count}', String(result.summary.count));
      head.replaceChildren();
      const header = documentRef.createElement('tr');
      const labels = [copy.canton, `${copy.annualTax} · ${result.vehicle.name}`];
      if (result.comparison) labels.push(`${copy.secondTax} · ${result.comparison.name}`, copy.difference);
      for (const label of labels) header.append(element('th', label));
      head.append(header);
      body.replaceChildren();
      for (const row of result.rows) {
        const tr = documentRef.createElement('tr');
        tr.append(element('th', `${row.code} · ${row.name}`), element('td', `CHF ${number.format(row.tax)}`));
        if (result.comparison) tr.append(element('td', `CHF ${number.format(row.comparisonTax)}`), element('td', `CHF ${number.format(row.difference)}`));
        body.append(tr);
      }
      buildSummary(result);
      results.hidden = false;
      exportButton.disabled = false;
    } catch {
      currentResult = null;
      results.hidden = true;
      exportButton.disabled = true;
      status.textContent = copy.invalid;
    }
  };

  q('[data-action="compareSwissTax"]').addEventListener('click', calculate);
  q('[data-action="loadSwissTaxSample"]').addEventListener('click', () => {
    q('#swiss-tax-vehicle').value = 'tayron-phev';
    q('#swiss-tax-comparison').value = 'model-y';
    q('#swiss-tax-canton').value = 'ALL';
    q('#swiss-tax-order').value = 'asc';
    calculate();
  });
  q('[data-action="clearSwissTax"]').addEventListener('click', () => {
    q('#swiss-tax-vehicle').value = 'tayron-phev';
    q('#swiss-tax-comparison').value = '';
    q('#swiss-tax-canton').value = 'ALL';
    q('#swiss-tax-order').value = 'asc';
    results.hidden = true;
    summary.replaceChildren(); head.replaceChildren(); body.replaceChildren();
    exportButton.disabled = true; currentResult = null; status.textContent = copy.ready;
  });
  exportButton.addEventListener('click', () => {
    if (!currentResult) return;
    const url = URL.createObjectURL(new Blob([`\ufeff${swissVehicleTaxCsv(currentResult)}`], { type: 'text/csv;charset=utf-8' }));
    const link = documentRef.createElement('a');
    link.href = url; link.download = 'swiss-vehicle-tax-comparison-2026.csv'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
}

if (typeof document !== 'undefined') initSwissVehicleTax(document);
