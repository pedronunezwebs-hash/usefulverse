import { calculateCarbonScenario, carbonScenariosCsv, compareCarbonScenarios, getCarbonElectricityFactor } from './carbon-footprint.mjs';

export function initCarbonFootprint(documentRef = document) {
  const tool = documentRef.querySelector('[data-market-tool="carbonFootprint"]');
  if (!tool) return;
  let copy;
  try { copy = JSON.parse(documentRef.querySelector('[data-tool-copy]')?.textContent ?? '{}').fields; }
  catch { copy = {}; }
  const q = (selector) => tool.querySelector(selector);
  const status = q('[data-carbon-status]'); const results = q('[data-carbon-results]');
  const exportButton = q('[data-carbon-export]');
  let current = null;
  const number = (id) => {
    const value = q(`#${id}`)?.value;
    if (value === '' || value == null) return 0;
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) throw new RangeError(copy.invalid);
    return parsed;
  };
  const factor = (id) => q(`#${id}`)?.value === '' ? undefined : Number(q(`#${id}`).value);
  const value = (id) => q(`#${id}`)?.value ?? '';
  const scenario = (prefix) => calculateCarbonScenario({
    country: value('carbon-country'), year: Number(value('carbon-year')),
    electricityKwh: number(`${prefix}-electricity`),
    heatingKwh: number(`${prefix}-heating`), heatingFactor: factor('carbon-heating-factor'), heatingSource: value('carbon-heating-source'),
    transportKm: number(`${prefix}-transport`), transportFactor: factor('carbon-transport-factor'), transportBasis: value('carbon-transport-basis'), transportSource: value('carbon-transport-source'),
    flightPassengerKm: number(`${prefix}-flights`), flightFactor: factor('carbon-flight-factor'), flightSource: value('carbon-flight-source'),
    otherAmount: number(`${prefix}-other`), otherUnit: value('carbon-other-unit'), otherFactor: factor('carbon-other-factor'), otherSource: value('carbon-other-source'),
  });
  const format = (amount) => new Intl.NumberFormat(documentRef.documentElement.lang || 'en', { maximumFractionDigits: 2 }).format(amount);
  const render = (comparison) => {
    const labels = { electricity: copy.electricity, heating: copy.heating, transport: copy.transport, flights: copy.flights, other: copy.other };
    const node = (tag, text, scope) => { const item = documentRef.createElement(tag); item.textContent = String(text); if (scope) item.scope = scope; return item; };
    results.replaceChildren();
    const totals = documentRef.createElement('div'); totals.className = 'carbon-totals';
    const diff = comparison.differenceKg;
    for (const [label, amount] of [[copy.baselineTotal, comparison.baseline.totalKg], [copy.scenarioTotal, comparison.scenario.totalKg], [copy.difference, diff]]) {
      const paragraph = documentRef.createElement('p');
      paragraph.append(node('span', label), node('strong', `${amount > 0 && label === copy.difference ? '+' : ''}${format(amount)} kg CO2e`));
      totals.append(paragraph);
    }
    const table = documentRef.createElement('table');
    const head = documentRef.createElement('thead'); const headRow = documentRef.createElement('tr');
    for (const label of [copy.fields?.sector ?? 'Sector', copy.activity, copy.factor, copy.baselineEmissions, copy.scenarioEmissions]) headRow.append(node('th', label, 'col'));
    head.append(headRow);
    const body = documentRef.createElement('tbody');
    for (const key of Object.keys(labels)) {
      const before = comparison.baseline.bySector[key]; const after = comparison.scenario.bySector[key];
      const row = documentRef.createElement('tr');
      row.append(node('th', labels[key], 'row'), node('td', `${format(before.activity)} ${before.unit}`), node('td', `${format(before.factorKgPerUnit)} kg/${before.unit}`), node('td', format(before.emissionsKg)), node('td', format(after.emissionsKg)));
      body.append(row);
    }
    const total = documentRef.createElement('tr');
    const totalLabel = node('th', 'Total', 'row'); const totalDescription = node('td', copy.status.replace('{count}', '5')); totalDescription.colSpan = 2;
    total.append(totalLabel, totalDescription, node('td', format(comparison.baseline.totalKg)), node('td', format(comparison.scenario.totalKg)));
    body.append(total); table.append(head, body);
    const scroll = documentRef.createElement('div'); scroll.className = 'table-scroll'; scroll.append(table);
    results.append(totals, scroll);
    results.hidden = false;
    status.textContent = copy.reduction.replace('{percent}', format(comparison.reductionPercent ?? 0));
    exportButton.disabled = false;
  };
  const validateGrid = () => {
    const grid = getCarbonElectricityFactor({ country: value('carbon-country'), year: Number(value('carbon-year')) });
    q('[data-carbon-grid-factor]').textContent = `${grid.gramsPerKwh} gCO2e/kWh · ${grid.countryName} · ${grid.year}`;
  };
  q('[data-carbon-country]').addEventListener('change', () => { try { validateGrid(); } catch { status.textContent = copy.invalid; } });
  q('[data-carbon-year]').addEventListener('change', () => { try { validateGrid(); } catch { status.textContent = copy.invalid; } });
  q('[data-carbon-calculate]').addEventListener('click', () => {
    try {
      const baseline = scenario('baseline'); const after = scenario('scenario');
      current = compareCarbonScenarios({ baseline, scenario: after }); render(current);
    } catch (error) { status.textContent = error instanceof Error ? error.message : copy.invalid; results.hidden = true; exportButton.disabled = true; current = null; }
  });
  q('[data-carbon-sample]').addEventListener('click', () => {
    q('[data-carbon-country]').value = 'CH'; q('[data-carbon-year]').value = q('[data-carbon-year]').options[0]?.value ?? '';
    q('#baseline-electricity').value = '3500'; q('#scenario-electricity').value = '2800';
    for (const prefix of ['baseline', 'scenario']) for (const field of ['heating', 'transport', 'flights', 'other']) q(`#${prefix}-${field}`).value = '0';
    for (const id of ['carbon-heating-factor','carbon-transport-factor','carbon-flight-factor','carbon-other-factor']) q(`#${id}`).value = '';
    for (const id of ['carbon-heating-source','carbon-transport-source','carbon-flight-source','carbon-other-source','carbon-other-unit']) q(`#${id}`).value = '';
    validateGrid(); status.textContent = copy.ready; results.hidden = true; exportButton.disabled = true; current = null;
  });
  q('[data-carbon-clear]').addEventListener('click', () => {
    tool.querySelectorAll('input').forEach((input) => { if (input.type === 'number') input.value = ''; else input.value = ''; });
    q('[data-carbon-country]').value = 'CH'; q('[data-carbon-year]').value = q('[data-carbon-year]').options[0]?.value ?? '';
    q('[data-carbon-transport-basis]').value = 'vehicle-km';
    results.replaceChildren(); results.hidden = true; exportButton.disabled = true; current = null; validateGrid(); status.textContent = copy.ready;
  });
  exportButton.addEventListener('click', () => {
    if (!current) return;
    const url = URL.createObjectURL(new Blob([`\ufeff${carbonScenariosCsv(current)}`], { type: 'text/csv;charset=utf-8' }));
    const link = documentRef.createElement('a'); link.href = url; link.download = 'carbon-footprint-scenarios.csv'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  validateGrid();
}

if (typeof document !== 'undefined') initCarbonFootprint(document);
