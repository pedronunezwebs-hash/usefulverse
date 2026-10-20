import assert from 'node:assert/strict';
import test from 'node:test';
import { createCandidateSourceDocuments, summarizeCandidateSources } from './prepare-candidate-sources.mjs';

test('the 300 candidate packets retain the source object required by the approved-copy exporter', async () => {
  const documents = await createCandidateSourceDocuments();
  assert.equal(documents.length, 300);
  assert.ok(documents.every(({ sourceCopy, units }) => sourceCopy && units.length && units.every(({ key, locales }) =>
    !/\.(?:relatedTools|outputName|localizationReviewers|localizationLastReviewedAt)(?:\.|$)/u.test(key)
    && locales.length === 36 && locales.includes('nb-NO') && locales.includes('te'))));
  assert.ok(documents.some(({ toolId }) => toolId === 'i-ching-oracle'));
  assert.ok(documents.every(({ toolId }) => toolId !== 'sunrise-sunset-calculator'));
  const first = summarizeCandidateSources(documents);
  assert.equal(first.sourceDigest, summarizeCandidateSources(await createCandidateSourceDocuments()).sourceDigest);
  assert.equal(first.status, 'source-extracted-not-approved');
  assert.ok(first.uniqueSourceStrings < first.sourceUnits);
});
