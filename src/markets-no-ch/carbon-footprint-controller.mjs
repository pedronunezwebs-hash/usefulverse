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
    const rows = Object.keys(labels).map((key) => {
      const before = comparison.baseline.bySector[key]; const after = comparison.scenario.bySector[key];
      return `<tr><th scope="row">${labels[key]}</th><td>${format(before.activity)} ${before.unit}</td><td>${format(before.factorKgPerUnit)} kg/${before.unit}</td><td>${format(before.emissionsKg)}</td><td>${format(after.emissionsKg)}</td></tr>`;
    }).join('');
    const diff = comparison.differenceKg;
    results.innerHTML = `<div class="carbon-totals"><p>${copy.baselineTotal}<strong>${format(comparison.baseline.totalKg)} kg CO2e</strong></p><p>${copy.scenarioTotal}<strong>${format(comparison.scenario.totalKg)} kg CO2e</strong></p><p>${copy.difference}<strong>${diff > 0 ? '+' : ''}${format(diff)} kg CO2e</strong></p></div><div class="table-scroll"><table><thead><tr><th scope="col">${copy.fields?.sector ?? 'Sector'}</th><th scope="col">${copy.activity}</th><th scope="col">${copy.factor}</th><th scope="col">${copy.baselineEmissions}</th><th scope="col">${copy.scenarioEmissions}</th></tr></thead><tbody>${rows}<tr><th scope="row">Total</th><td colspan="2">${copy.status.replace('{count}', '5')}</td><td>${format(comparison.baseline.totalKg)}</td><td>${format(comparison.scenario.totalKg)}</td></tr></tbody></table></div>`;
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
