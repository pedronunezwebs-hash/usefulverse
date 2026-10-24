import test from 'node:test';
import assert from 'node:assert/strict';
import { getTranslationPackReleaseIssues } from './translation-release-gate.mjs';

const makePack = (locales) => Object.fromEntries(locales.map((locale) => [locale, locale === 'en'
  ? { localizationStatus: 'source-english' }
  : { localizationStatus: 'human-reviewed', localizationReviewers: ['Reviewer'], localizationLastReviewedAt: '2026-10-20' }]));

test('release gate requires every locale pack and reports missing packs together', () => {
  const issues = getTranslationPackReleaseIssues(['alpha', 'beta'], new Map(), ['en', 'es']);
  assert.deepEqual(issues, ['alpha: missing translation pack', 'beta: missing translation pack']);
});

test('release gate accepts source English and human-reviewed translations with provenance', () => {
  const packs = new Map([['alpha', makePack(['en', 'es'])]]);
  assert.deepEqual(getTranslationPackReleaseIssues(['alpha'], packs, ['en', 'es']), []);
});

test('release gate requires every locale and rejects unreviewed or unprovenanced copy', () => {
  const packs = new Map([['alpha', {
    en: { localizationStatus: 'source-english' },
    es: { localizationStatus: 'machine-draft' },
    fr: { localizationStatus: 'human-reviewed', localizationReviewers: [], localizationLastReviewedAt: '2026-02-31' },
  }]]);
  assert.deepEqual(getTranslationPackReleaseIssues(['alpha'], packs, ['en', 'es', 'fr', 'de']), [
    'alpha/es: requires human review, reviewer names, and a valid review date',
    'alpha/fr: requires human review, reviewer names, and a valid review date',
    'alpha/de: missing locale copy',
  ]);
});

test('release gate rejects untranslated English source markers', () => {
  const packs = new Map([['alpha', { en: { localizationStatus: 'approved' } }]]);
  assert.deepEqual(getTranslationPackReleaseIssues(['alpha'], packs, ['en']), [
    'alpha/en: canonical source must be marked source-english',
  ]);
});
