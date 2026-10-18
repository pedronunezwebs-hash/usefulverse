import test from 'node:test';
import assert from 'node:assert/strict';
import { compareSwissVehicleTax, swissVehicleTaxCantons, swissVehicleTaxCsv, swissVehicleTaxVehicles } from './switzerland-vehicle-tax.mjs';

test('contains six TCS 2026 reference vehicles and all 26 cantons', () => {
  assert.equal(swissVehicleTaxVehicles.length, 6);
  assert.equal(swissVehicleTaxCantons.length, 26);
  assert.equal(new Set(swissVehicleTaxCantons.map(({ code }) => code)).size, 26);
  assert.ok(swissVehicleTaxCantons.every(({ annualChf }) => Object.keys(annualChf).length === 6));
});

test('matches selected 2026 published reference values and sorts lowest to highest', () => {
  const result = compareSwissVehicleTax({ vehicleId: 'tayron-phev' });
  assert.equal(result.rows.length, 26);
  assert.deepEqual(result.rows.slice(0, 3).map(({ code, tax }) => [code, tax]), [['VD', 66], ['GR', 95], ['GE', 123]]);
  assert.deepEqual(result.rows.slice(-2).map(({ code, tax }) => [code, tax]), [['AI', 650], ['AR', 762]]);
  assert.equal(result.summary.minimum, 66);
  assert.equal(result.summary.maximum, 762);
});

test('compares two different examples and shows first-minus-second canton deltas', () => {
  const result = compareSwissVehicleTax({ vehicleId: 'tayron-phev', comparisonVehicleId: 'model-y', canton: 'BE' });
  assert.equal(result.rows.length, 1);
  assert.deepEqual(result.rows[0], { code: 'BE', name: 'Bern', tax: 535, comparisonTax: 109, difference: 426 });
});

test('rejects unsupported vehicles, same-car comparisons, cantons and sort options', () => {
  assert.throws(() => compareSwissVehicleTax({ vehicleId: 'custom-car' }), /reference vehicle/u);
  assert.throws(() => compareSwissVehicleTax({ vehicleId: 'model-y', comparisonVehicleId: 'model-y' }), /different second/u);
  assert.throws(() => compareSwissVehicleTax({ vehicleId: 'model-y', canton: 'XX' }), /canton/u);
  assert.throws(() => compareSwissVehicleTax({ vehicleId: 'model-y', order: 'random' }), /sort order/u);
});

test('exports all visible values as quoted CSV with the exact selection metadata', () => {
  const result = compareSwissVehicleTax({ vehicleId: 'model-y', comparisonVehicleId: 'spring-electric', canton: 'ALL' });
  const csv = swissVehicleTaxCsv(result);
  assert.match(csv, /Tesla Model Y Performance AWD · electric/u);
  assert.match(csv, /Dacia Spring Electric 65 Extreme · electric/u);
  assert.match(csv, /"BE","Bern","109","61","48"/u);
  assert.equal(csv.split('\r\n').length, 27);
  assert.throws(() => swissVehicleTaxCsv(null), /Calculate/u);
});
