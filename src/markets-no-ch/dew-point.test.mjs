import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateDewPoint, compareSurfaceToDewPoint, humidityCurve, saturationVapourPressureHpa } from './dew-point.mjs';

test('20 °C and 50% RH yield a dew point near 9.3 °C and absolute humidity near 8.6 g/m³', () => {
  const result = calculateDewPoint({ temperatureC: 20, relativeHumidity: 50 });
  assert.ok(Math.abs(result.dewPointC - 9.26) < 0.15);
  assert.ok(Math.abs(result.absoluteHumidityGm3 - 8.64) < 0.15);
  assert.equal(result.phase, 'water');
});

test('at saturation the dew or frost point equals air temperature', () => {
  for (const temperatureC of [-40, -10, -0.1, 0, 20, 60]) {
    const result = calculateDewPoint({ temperatureC, relativeHumidity: 100 });
    assert.ok(Math.abs(result.dewPointC - temperatureC) < 1e-10, `${temperatureC} °C`);
  }
});

test('uses the WMO water and ice saturation expressions on opposite sides of zero', () => {
  const water = saturationVapourPressureHpa(20);
  const ice = saturationVapourPressureHpa(-10);
  assert.ok(Math.abs(water - 23.37) < 0.15);
  assert.ok(Math.abs(ice - 2.60) < 0.1);
});

test('surface comparison reports possible condensation only at or below the dew/frost point', () => {
  const below = compareSurfaceToDewPoint({ temperatureC: 20, relativeHumidity: 50, surfaceTemperatureC: 8 });
  const above = compareSurfaceToDewPoint({ temperatureC: 20, relativeHumidity: 50, surfaceTemperatureC: 12 });
  assert.equal(below.condensationPossible, true);
  assert.ok(Math.abs(below.differenceC - (8 - below.dewPointC)) < 1e-12);
  assert.equal(above.condensationPossible, false);
});

test('humidity curve covers the full supported 1–100% range and matches the entered RH at 50%', () => {
  const curve = humidityCurve({ temperatureC: 20 });
  assert.equal(curve.length, 11);
  assert.equal(curve[0].relativeHumidity, 1);
  const selected = curve.find((point) => point.relativeHumidity === 50);
  assert.ok(Math.abs(selected.absoluteHumidityGm3 - calculateDewPoint({ temperatureC: 20, relativeHumidity: 50 }).absoluteHumidityGm3) < 1e-12);
  assert.ok(curve.every((point, index) => index === 0 || point.absoluteHumidityGm3 > curve[index - 1].absoluteHumidityGm3));
});

test('humidity curves stay inside the model domain at the coldest supported air temperature', () => {
  const curve = humidityCurve({ temperatureC: -45 });
  assert.equal(curve.at(-1).relativeHumidity, 100);
  assert.ok(curve.every((point) => point.relativeHumidity >= 1 && point.relativeHumidity <= 100));
});

test('rejects impossible humidity, blank/non-finite input and temperatures outside the published range', () => {
  for (const relativeHumidity of [0, -1, 100.1, NaN]) assert.throws(() => calculateDewPoint({ temperatureC: 20, relativeHumidity }));
  for (const temperatureC of [-45.1, 60.1, Infinity, '']) assert.throws(() => calculateDewPoint({ temperatureC, relativeHumidity: 50 }));
  assert.throws(() => calculateDewPoint({ temperatureC: -45, relativeHumidity: 1 }), /outside the supported formula range/);
  assert.throws(() => calculateDewPoint({ temperatureC: 0, relativeHumidity: 1 }), /outside the supported formula range/);
  assert.throws(() => compareSurfaceToDewPoint({ temperatureC: 20, relativeHumidity: 50, surfaceTemperatureC: 60.1 }));
});
