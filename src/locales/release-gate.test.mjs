import assert from 'node:assert/strict';
import test from 'node:test';
import { localeApprovalGaps, localizedGuideGaps } from './release-gate.mjs';

const guides = [{ slug: 'grades' }, { slug: 'docs' }];

test('release gate reports locales with no guide pack and incomplete route coverage', () => {
  const locales = { en: {}, es: {}, fr: {}, it: {}, bg: {} };
  const packs = {
    es: { guides: [{ slug: 'grades' }] },
    fr: { guides: [{ slug: 'docs' }, { slug: 'grades' }] },
    it: { guides: guides.map((guide) => ({ ...guide })) },
  };

  assert.deepEqual(localizedGuideGaps(locales, packs, guides), [
    'es: 1/2 guides',
    'fr: guide routes do not match the canonical set',
    'bg: no translated guide pack',
  ]);
});

test('release gate accepts matching localized routes and ignores the English source', () => {
  const locales = { en: {}, es: {}, it: {} };
  const packs = {
    es: { guides: guides.map((guide) => ({ ...guide })) },
    it: { guides: guides.map((guide) => ({ ...guide })) },
  };

  assert.deepEqual(localizedGuideGaps(locales, packs, guides), []);
});

test('locale publication gate keeps draft or incomplete reviews out of release', () => {
  const reviewStatus = {
    it: { status: 'draft' },
    ca: { status: 'approved', reviewer: 'Reviewer' },
    nl: { status: 'approved', reviewer: 'Reviewer', reviewedAt: '2026-10-02' },
  };

  assert.deepEqual(localeApprovalGaps(reviewStatus, ['it', 'ca', 'nl', 'sv']), [
    'it: translation has neither linguistic approval nor explicit owner acceptance',
    'ca: translation has neither linguistic approval nor explicit owner acceptance',
    'sv: translation has neither linguistic approval nor explicit owner acceptance',
  ]);
});

test('locale publication gate accepts only explicitly approved reviews with reviewer and date', () => {
  const reviewStatus = {
    it: { status: 'approved', reviewer: 'Language reviewer', reviewedAt: '2026-10-02' },
    ca: { status: 'approved', reviewer: 'Language reviewer', reviewedAt: '2026-10-02' },
  };

  assert.deepEqual(localeApprovalGaps(reviewStatus, ['it', 'ca']), []);
});
