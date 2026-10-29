import assert from 'node:assert/strict';
import test from 'node:test';
import { createSources, isProse } from './autopilot-source.mjs';

test('all 1000 catalog owners have English copy without claiming a full legacy runtime audit', async () => {
  const corpus = await createSources();
  assert.equal(corpus.tools, 1000);
  assert.ok(!corpus.documents.some(d => ['pending-tools', 'text-to-binary'].includes(d.toolId)), 'source modules must not be re-extracted as extra tools');
  assert.deepEqual(corpus.coverage.recoveredMetadataOnly, []);
  assert.deepEqual(corpus.coverage.metadataOnly, []);
  assert.match(corpus.coverage.note, /legacy JS still needs extraction/u);
  assert.equal(corpus.destinationLocales.length, 36);
  assert.equal(new Set(corpus.units.map(u => u.key)).size, corpus.units.length);
  assert.ok(corpus.units.every(u => u.source_hash.length === 64 && u.context));
});
test('technical constants, formulas and URLs are not sent as prose', () => {
  for (const text of ['UsefulVerse', 'PDF', '45', 'cm', '`a=5`', 'https://example.com/a']) assert.equal(isProse(text), false);
  assert.equal(isProse('Your files stay on your device.'), true);
});
