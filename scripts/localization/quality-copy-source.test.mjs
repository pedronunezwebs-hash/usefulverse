import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createSources } from './autopilot-source.mjs';

const ids = ['date-calculator', 'time-duration-calculator', 'roman-numeral-converter', 'barcode-generator', 'fraction-calculator', 'prime-number-checker', 'percentage-calculator', 'number-to-words-converter', 'ratio-proportion-calculator', 'discount-calculator', 'random-number-generator', 'average-calculator', 'age-calculator', 'fuel-cost-calculator'];
const corpus = await createSources();
for (const id of ids) test(id + ' English quality copy reaches the corpus without translating controls or routes', async () => {
  const document = JSON.parse(await readFile(new URL('../../translation-sources/' + id + '.json', import.meta.url)));
  const extracted = corpus.documents.find(d => d.toolId === id);
  assert.equal(extracted.coverage, 'improved-source');
  assert.deepEqual(extracted.sourceCopy, document.sourceCopy);
  assert.equal(document.sourceCopy.examples.length, 4);
  assert.equal(document.nonTranslatableCopy.examples.length, 4);
  assert.equal(document.nonTranslatableCopy.related?.length, 3, 'routing belongs outside translated prose');
  for (const r of document.sourceCopy.related) {
    assert.equal(r.id, undefined);
    assert.equal(r.host, undefined);
    assert.ok(r.title && r.text);
  }
  for (const e of document.sourceCopy.examples) assert.equal(e.id, undefined);
  for (const r of document.nonTranslatableCopy.related) {
    assert.match(r.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/u);
    if (r.host) assert.equal(r.host, 'tools.usefulverse.com');
  }
  const units = corpus.units.filter(u => u.key.startsWith(id + '.'));
  assert.ok(units.length > 90);
  assert.ok(units.some(u => u.source === document.sourceCopy.intro));
  assert.ok(units.some(u => u.source === document.sourceCopy.faq[0].answer));
  assert.ok(units.every(u => !/\.copy\.(?:examples\.\d+\.id|related\.\d+\.(?:id|host))$/u.test(u.key)));
  assert.ok(units.every(u => !u.key.includes('.nonTranslatableCopy.')));
});
