import assert from 'node:assert/strict';
import test from 'node:test';
import { createHash } from 'node:crypto';
import { applyAutomaticPackage } from './automatic-packages.mjs';
const hash = s => createHash('sha256').update(s).digest('hex');

test('export adapter applies only exact English hash and context, preserving changed sources', () => {
  const source = { title: 'Download file', actions: { save: 'Save the file' } };
  const pack = { schemaVersion: 1, toolId: 'example-tool', locale: 'es', semantic_policy: 'current', release_approved: false, native_review: false,
    entries: { 'example-tool.copy.title': { source_hash: hash(source.title), context: 'example-tool UI copy.title', translation: 'Descargar archivo' },
      'example-tool.copy.actions.save': { source_hash: hash('Old source'), context: 'Shared UI copy.actions.save', translation: 'Guardar' } } };
  const result = applyAutomaticPackage(source, 'example-tool', 'es', pack, 'current');
  assert.equal(result.copy.title, 'Descargar archivo');
  assert.equal(result.copy.actions.save, source.actions.save);
  assert.equal(result.applied, 1); assert.equal(result.stale.length, 1); assert.equal(result.releaseApproved, false);
  assert.equal(source.title, 'Download file');
  for (const change of [{ semantic_policy: 'old' }, { release_approved: true }, { locale: 'fr' }])
    assert.throws(() => applyAutomaticPackage(source, 'example-tool', 'es', { ...pack, ...change }, 'current'));
});


test('a refined package also binds the current quality recipe', () => {
  const source = { title: 'Save file' };
  const pack = { schemaVersion: 1, toolId: 'sample-tool', locale: 'es', semantic_policy: 'semantic', quality_policy: 'quality',
    release_approved: false, native_review: false, entries: {} };
  assert.throws(() => applyAutomaticPackage(source, 'sample-tool', 'es', pack, 'semantic'));
  assert.throws(() => applyAutomaticPackage(source, 'sample-tool', 'es', pack, 'semantic', 'old-quality'));
  assert.equal(applyAutomaticPackage(source, 'sample-tool', 'es', pack, 'semantic', 'quality').applied, 0);
});
