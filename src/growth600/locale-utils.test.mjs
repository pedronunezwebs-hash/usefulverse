import test from 'node:test';
import assert from 'node:assert/strict';
import { materializeGrowthLocale, growthLocaleStringPaths } from './locale-utils.mjs';

test('materializes each indexed string without mutating the English source', () => {
  const source = Object.freeze({ _home: { copyLanguage: 'en', title: 'Home' }, sample: { copyLanguage: 'en', label: 'Name', message: 'Hello {name}' } });
  assert.deepEqual(growthLocaleStringPaths(source), [['_home', 'title'], ['sample', 'label'], ['sample', 'message']]);
  const localized = materializeGrowthLocale(source, ['Inicio', 'Nombre', 'Hola {name}'], 'es');
  assert.equal(localized._home.copyLanguage, 'es');
  assert.equal(localized.sample.message, 'Hola {name}');
  assert.equal(source.sample.label, 'Name');
});

test('rejects missing, blank and changed interpolation values', () => {
  const source = { tool: { copyLanguage: 'en', message: 'Hello {name}' } };
  assert.throws(() => materializeGrowthLocale(source, [], 'es'), /requires 1/u);
  assert.throws(() => materializeGrowthLocale(source, ['  '], 'es'), /empty value/u);
  assert.throws(() => materializeGrowthLocale(source, ['Hola'], 'es'), /interpolation tokens/u);
});
