import assert from 'node:assert/strict';
import test from 'node:test';
import { createPilotCorpus } from './pilot-corpus.mjs';

test('the pilot has all 37 locales, three source tools and 40 real reference strings', () => {
  const corpus = createPilotCorpus();
  assert.equal(corpus.locales.length, 37);
  assert.equal(new Set(corpus.locales).size, 37);
  assert.ok(corpus.locales.includes('nb-NO'));
  assert.equal(corpus.tools.length, 3);
  assert.equal(corpus.referenceUnits, 40);
  assert.equal(new Set(corpus.units.map(({ key }) => key)).size, corpus.units.length);
  assert.ok(corpus.units.some(({ reference, source }) => reference && source.includes('{duration}')));
  assert.ok(corpus.units.some(({ reference, source }) => reference && source.includes('No.')));
});

test('legacy candidates retain missing translations rather than silently copying English', () => {
  const corpus = createPilotCorpus();
  const row = corpus.units.find(({ key }) => key === 'dxf-viewer.fields.cancel');
  assert.equal(row.legacy.ja, null);
  assert.equal(typeof row.legacy['nb-NO'], 'string');
  assert.equal(corpus.sourceDigest, createPilotCorpus().sourceDigest);
  assert.ok(corpus.units.every(({ key, source_hash }) => key && /^[a-f0-9]{64}$/u.test(source_hash)));
});
