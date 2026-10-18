import test from 'node:test';
import assert from 'node:assert/strict';
import { carbonElectricitySourceData } from './carbon-electricity-factors.mjs';
import { calculateCarbonScenario, carbonScenariosCsv, compareCarbonScenarios, getCarbonElectricityFactor } from './carbon-footprint.mjs';

test('returns dated open electricity generation factors for Switzerland and Norway', () => {
  assert.equal(getCarbonElectricityFactor({ country: 'CH', year: 2025 }).gramsPerKwh, 39.077);
  assert.equal(getCarbonElectricityFactor({ country: 'NO', year: 2025 }).gramsPerKwh, 28.05);
  assert.equal(getCarbonElectricityFactor({ country: 'CH', year: 2025 }).kilogramsPerKwh, 0.039077);
  assert.equal(carbonElectricitySourceData.license, 'CC BY 4.0');
  assert.equal(carbonElectricitySourceData.dataThrough.CH, 2025);
  assert.equal(carbonElectricitySourceData.dataThrough.NO, 2025);
  assert.match(carbonElectricitySourceData.sourceFileLastModified, /^\d{4}-\d{2}-\d{2}$/u);
  assert.throws(() => getCarbonElectricityFactor({ country: 'CH', year: 1999 }), RangeError);
  assert.throws(() => getCarbonElectricityFactor({ country: 'UK', year: 2025 }), RangeError);
});

test('calculates separate activity-based sectors and does not require factors for zero activities', () => {
  const result = calculateCarbonScenario({
    electricityKwh: 100,
    heatingKwh: 0,
    transportKm: 0,
    flightPassengerKm: 0,
    otherAmount: 0,
    country: 'CH',
    year: 2025,
  });
  assert.ok(Math.abs(result.bySector.electricity.emissionsKg - 3.9077) < 1e-9);
  assert.ok(Math.abs(result.totalKg - 3.9077) < 1e-9);
  assert.equal(result.bySector.electricity.source, 'Ember generation factor');
});

test('calculates sourced custom heating, ground travel, flight, and other factors', () => {
  const result = calculateCarbonScenario({
    heatingKwh: 100, heatingFactor: 0.2, heatingSource: 'Supplier statement 2025',
    transportKm: 50, transportFactor: 0.1, transportBasis: 'passenger-km', transportSource: 'Transit report 2024',
    flightPassengerKm: 1000, flightFactor: 0.15, flightSource: 'Carrier report 2025',
    otherAmount: 2, otherUnit: 'items', otherFactor: 3, otherSource: 'Product EPD 2025',
  });
  assert.equal(result.bySector.heating.emissionsKg, 20);
  assert.equal(result.bySector.transport.emissionsKg, 5);
  assert.equal(result.bySector.flights.emissionsKg, 150);
  assert.equal(result.bySector.other.emissionsKg, 6);
  assert.equal(result.totalKg, 181);
});

test('compares scenarios with fixed country/year factors and exports a CSV by sector', () => {
  const baseline = calculateCarbonScenario({ electricityKwh: 1000, country: 'NO', year: 2024 });
  const scenario = calculateCarbonScenario({ electricityKwh: 500, country: 'NO', year: 2024 });
  const comparison = compareCarbonScenarios({ baseline, scenario });
  assert.equal(comparison.differenceKg, -14.8215);
  assert.equal(comparison.reductionPercent, 50);
  assert.match(carbonScenariosCsv(comparison), /"electricity","1000","500","kWh"/u);
  assert.match(carbonScenariosCsv(comparison), /"Total"/u);
  assert.throws(() => compareCarbonScenarios({ baseline, scenario: calculateCarbonScenario({ electricityKwh: 1, country: 'CH', year: 2024 }) }), RangeError);
  const customBaseline = calculateCarbonScenario({ heatingKwh: 10, heatingFactor: 0.2, heatingSource: 'Report A' });
  const customScenario = calculateCarbonScenario({ heatingKwh: 5, heatingFactor: 0.3, heatingSource: 'Report B' });
  assert.throws(() => compareCarbonScenarios({ baseline: customBaseline, scenario: customScenario }), /identical factor/u);
});

test('rejects mismatched units, invalid values, missing sources, and oversized user factors', () => {
  assert.throws(() => calculateCarbonScenario({ electricityKwh: -1 }), RangeError);
  assert.throws(() => calculateCarbonScenario({ transportKm: 1, transportFactor: 0.1 }), /source/iu);
  assert.throws(() => calculateCarbonScenario({ transportKm: 1, transportFactor: 0.1, transportSource: 'Report', transportBasis: 'vehicle' }), /vehicle-km or passenger-km/iu);
  assert.throws(() => calculateCarbonScenario({ heatingKwh: 1, heatingFactor: 1_000_001, heatingSource: 'Report' }), /factor/iu);
  assert.throws(() => calculateCarbonScenario({ otherAmount: 1, otherFactor: 1, otherUnit: '', otherSource: 'Report' }), /unit/iu);
});
