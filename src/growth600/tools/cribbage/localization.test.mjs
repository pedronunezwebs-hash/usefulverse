import assert from 'node:assert/strict';
import test from 'node:test';
import { REQUIRED_GROWTH_COPY, REQUIRED_TOOL_ACTIONS, REQUIRED_TOOL_FIELDS, REQUIRED_TOOL_MESSAGES } from '../../locale-contract.mjs';
import { cribbageEnglishCopy } from '../../locales/cribbage.en.mjs';
import { cribbageSpanishCopy } from '../../locales/cribbage.es.mjs';

test('Cribbage English and Spanish copies contain required controls, FAQs and metadata', () => {
  for (const [locale, copy] of [['en', cribbageEnglishCopy], ['es', cribbageSpanishCopy]]) {
    assert.equal(copy.copyLanguage, locale);
    assert.ok(Array.from(copy.title).length <= 60 && Array.from(copy.description).length <= 160);
    assert.equal(copy.additionalFaqs.length, 3);
    for (const key of REQUIRED_GROWTH_COPY) assert.ok(copy[key]?.trim(), `${locale}:${key}`);
    for (const key of REQUIRED_TOOL_FIELDS.cribbage) assert.ok(copy.fields[key]?.trim(), `${locale}:fields.${key}`);
    for (const key of REQUIRED_TOOL_ACTIONS.cribbage) assert.ok(copy.actions[key]?.trim(), `${locale}:actions.${key}`);
    for (const key of REQUIRED_TOOL_MESSAGES.cribbage) assert.ok(copy.messages[key]?.trim(), `${locale}:messages.${key}`);
  }
  assert.equal(cribbageSpanishCopy.localizationStatus, 'machine-accepted');
  assert.equal(cribbageSpanishCopy.localizationAcceptedBy, 'site-owner');
});
