import test from 'node:test';
import assert from 'node:assert/strict';
import { materializeGrowthLocale, growthLocaleStringPaths, registerGrowthLocaleExtension } from './locale-utils.mjs';

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

test('localized extensions inherit shared labels without changing positional locale contracts', () => {
  const source = { gravel: { copyLanguage: 'en', label: 'Length', actions: { calculate: 'Calculate', reset: 'Reset' }, messages: { calculated: 'Done.' } } };
  const copies = {
    en: { copyLanguage: 'en', title: 'Tire tool', fields: { current: 'Current tire' }, actions: { example: 'Example' }, messages: { same: 'Same size.' } },
    es: { copyLanguage: 'es', title: 'Herramienta de neumáticos', fields: { current: 'Neumático actual' }, actions: { example: 'Ejemplo' }, messages: { same: 'Misma medida.' } },
  };
  registerGrowthLocaleExtension(source, 'tires', copies, 'gravel');
  assert.deepEqual(growthLocaleStringPaths(source), [['gravel', 'label'], ['gravel', 'actions', 'calculate'], ['gravel', 'actions', 'reset'], ['gravel', 'messages', 'calculated']]);
  const localized = materializeGrowthLocale(source, ['Longitud', 'Calcular', 'Reiniciar', 'Hecho.'], 'es');
  assert.equal(localized.gravel.label, 'Longitud');
  assert.equal(localized.tires.title, 'Herramienta de neumáticos');
  assert.deepEqual(localized.tires.actions, { calculate: 'Calcular', reset: 'Reiniciar', example: 'Ejemplo' });
  assert.deepEqual(localized.tires.messages, { calculated: 'Hecho.', same: 'Misma medida.' });
  assert.equal(localized.tires.copyLanguage, 'es');
  assert.equal(source.tires.title, 'Tire tool');
});

test('localized extensions fail closed when a language translation is missing', () => {
  const source = { gravel: { copyLanguage: 'en', label: 'Length' } };
  registerGrowthLocaleExtension(source, 'tires', { en: { copyLanguage: 'en', title: 'Tire tool' } }, 'gravel');
  assert.throws(() => materializeGrowthLocale(source, ['Longitud'], 'es'), /extension tires is missing for es/u);
});
