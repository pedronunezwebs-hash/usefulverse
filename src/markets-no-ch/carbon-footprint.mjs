import { carbonElectricityFactors, carbonElectricitySourceData } from './carbon-electricity-factors.mjs';

export const carbonFootprintSource = Object.freeze({
  name: 'Ember · Yearly Electricity Data',
  url: 'https://ember-energy.org/data/yearly-electricity-data/',
  license: 'CC BY 4.0',
  licenseUrl: 'https://ember-energy.org/creative-commons/',
  retrieved: carbonElectricitySourceData.retrieved,
  sourceFileLastModified: carbonElectricitySourceData.sourceFileLastModified,
  dataThrough: carbonElectricitySourceData.dataThrough,
});

export const carbonElectricityYears = Object.freeze(Object.fromEntries(
  Object.entries(carbonElectricityFactors).map(([country, years]) => [country, Object.freeze(Object.keys(years).map(Number).sort((a, b) => a - b))]),
));
export const carbonElectricityLatestYear = Math.min(...Object.values(carbonElectricityYears).map((years) => years.at(-1)));

const countries = Object.freeze({ CH: 'Switzerland', NO: 'Norway' });
const sectors = Object.freeze(['electricity', 'heating', 'transport', 'flights', 'other']);
const finiteRange = (value, min, max) => Number.isFinite(Number(value)) && Number(value) >= min && Number(value) <= max;

export function getCarbonElectricityFactor({ country = 'CH', year = carbonElectricityLatestYear } = {}) {
  const yearKey = String(year);
  if (!countries[country] || !Object.hasOwn(carbonElectricityFactors[country], yearKey)) {
    const available = carbonElectricityYears[country] ?? [];
    const range = available.length ? `${available[0]}–${available.at(-1)}` : '2000–latest';
    throw new RangeError(`Choose Switzerland or Norway and a year with published Ember data (${range}).`);
  }
  const gramsPerKwh = carbonElectricityFactors[country][yearKey];
  return Object.freeze({
    country,
    countryName: countries[country],
    year: Number(yearKey),
    gramsPerKwh,
    kilogramsPerKwh: gramsPerKwh / 1000,
    source: carbonFootprintSource,
    boundary: 'CO2 from electricity generation divided by gross generation; excludes upstream lifecycle emissions and grid import/loss adjustments.',
  });
}

function checkedActivity(value, label) {
  if (!finiteRange(value, 0, 1_000_000_000)) throw new RangeError(`${label} must be between 0 and 1,000,000,000.`);
  return Number(value);
}

function checkedFactor(value, label) {
  if (!finiteRange(value, 0, 1_000_000)) throw new RangeError(`${label} must be between 0 and 1,000,000 kg CO2e per unit.`);
  return Number(value);
}

export function calculateCarbonScenario({ electricityKwh = 0, heatingKwh = 0, heatingFactor, heatingSource = '', transportKm = 0, transportFactor, transportBasis = 'vehicle-km', transportSource = '', flightPassengerKm = 0, flightFactor, flightSource = '', otherAmount = 0, otherUnit = '', otherFactor, otherSource = '', country = 'CH', year = carbonElectricityLatestYear } = {}) {
  const grid = getCarbonElectricityFactor({ country, year });
  const inputs = {
    electricity: checkedActivity(electricityKwh, 'Electricity use'),
    heating: checkedActivity(heatingKwh, 'Heating use'),
    transport: checkedActivity(transportKm, 'Ground transport distance'),
    flights: checkedActivity(flightPassengerKm, 'Flight passenger-distance'),
    other: checkedActivity(otherAmount, 'Other activity'),
  };
  if (!['vehicle-km', 'passenger-km'].includes(transportBasis)) throw new RangeError('Choose vehicle-km or passenger-km for the ground transport factor.');
  if (inputs.other > 0 && !String(otherUnit).trim()) throw new RangeError('Name the unit used by the other activity factor.');

  const definitions = [
    ['electricity', inputs.electricity, grid.kilogramsPerKwh, 'kWh', 'Ember generation factor'],
    ['heating', inputs.heating, inputs.heating ? checkedFactor(heatingFactor, 'Heating factor') : 0, 'kWh', heatingSource],
    ['transport', inputs.transport, inputs.transport ? checkedFactor(transportFactor, 'Ground transport factor') : 0, 'km', transportSource],
    ['flights', inputs.flights, inputs.flights ? checkedFactor(flightFactor, 'Flight factor') : 0, 'passenger-km', flightSource],
    ['other', inputs.other, inputs.other ? checkedFactor(otherFactor, 'Other factor') : 0, String(otherUnit).trim(), otherSource],
  ];
  for (const [sector, activity, factor, , source] of definitions) {
    if (sector !== 'electricity' && activity > 0 && (!String(source).trim() || String(source).trim().length > 200)) {
      throw new RangeError(`Add a source (up to 200 characters) for the ${sector} factor.`);
    }
    if (sector !== 'electricity' && activity > 0 && factor === 0) throw new RangeError(`A positive activity needs a factor above zero for ${sector}.`);
  }
  const bySector = Object.fromEntries(definitions.map(([sector, activity, factor, unit, source]) => [sector, Object.freeze({ activity, factorKgPerUnit: factor, unit, emissionsKg: activity * factor, source: String(source ?? '') })]));
  const totalKg = sectors.reduce((sum, sector) => sum + bySector[sector].emissionsKg, 0);
  return Object.freeze({ country, year: Number(year), grid, bySector: Object.freeze(bySector), totalKg });
}

export function compareCarbonScenarios({ baseline, scenario } = {}) {
  if (!baseline || !scenario) throw new TypeError('Provide both a baseline and a comparison scenario.');
  if (baseline.country !== scenario.country || baseline.year !== scenario.year) throw new RangeError('Both scenarios must use the same country and electricity-factor year.');
  for (const sector of sectors) {
    const before = baseline.bySector?.[sector]; const after = scenario.bySector?.[sector];
    if (!before || !after || before.factorKgPerUnit !== after.factorKgPerUnit || before.unit !== after.unit || before.source !== after.source) {
      throw new RangeError(`Both scenarios must use identical factor, unit, and source assumptions for ${sector}.`);
    }
  }
  const differenceKg = scenario.totalKg - baseline.totalKg;
  return Object.freeze({ baseline, scenario, differenceKg, reductionPercent: baseline.totalKg > 0 ? (1 - scenario.totalKg / baseline.totalKg) * 100 : null });
}

export function carbonScenariosCsv(comparison) {
  if (!comparison?.baseline?.bySector || !comparison?.scenario?.bySector) throw new TypeError('Calculate two scenarios before exporting.');
  const quote = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  const header = ['Sector', 'Baseline activity', 'Scenario activity', 'Unit', 'Factor kg CO2e/unit', 'Baseline kg CO2e', 'Scenario kg CO2e', 'Factor source'];
  const rows = sectors.map((sector) => {
    const before = comparison.baseline.bySector[sector]; const after = comparison.scenario.bySector[sector];
    return [sector, before.activity, after.activity, before.unit || after.unit, before.factorKgPerUnit, before.emissionsKg, after.emissionsKg, before.source];
  });
  rows.push(['Total', '', '', '', '', comparison.baseline.totalKg, comparison.scenario.totalKg, '']);
  return [header, ...rows].map((row) => row.map(quote).join(',')).join('\r\n');
}
