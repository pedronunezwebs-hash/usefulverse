import test from 'node:test';
import assert from 'node:assert/strict';
import breathingCopies from '../../locales/breathing-exercise-final.mjs';
import { breathingPhaseAt, normalizeBreathingConfig } from './logic.mjs';

test('translated breathing exercise copies have complete controls, messages, FAQs and safe metadata', () => {
  const english = breathingCopies.en;
  assert.deepEqual(Object.keys(breathingCopies).sort(), ['am', 'ar', 'bg', 'bn', 'ca', 'de', 'el', 'en', 'es', 'fa', 'fr', 'gu', 'ha', 'hi', 'id', 'it', 'ja', 'ko', 'mr', 'ms', 'nl', 'pl', 'pt', 'ru', 'sv', 'sw', 'ta', 'te', 'th', 'tl', 'tr', 'uk', 'ur', 'vi', 'zh', 'zh_tw']);

  for (const [locale, copy] of Object.entries(breathingCopies)) {
    assert.equal(copy.copyLanguage, locale, `${locale} identifies its copy language`);
    assert.ok(['approved', 'machine-accepted'].includes(copy.localizationStatus), `${locale} has an explicit localization status`);
    assert.ok(copy.name.trim().length > 0, `${locale} has a localized name`);
    assert.ok(copy.title.length <= 60, `${locale} title is within 60 characters`);
    assert.ok(copy.title.includes('UsefulVerse'), `${locale} title retains the brand`);
    assert.ok(copy.description.length <= 160, `${locale} description is within 160 characters`);
    assert.ok(copy.intro.length > 0 && copy.howQuestion.length > 0 && copy.howAnswer.length > 0);
    assert.ok(copy.privacyQuestion.length > 0 && copy.privacyAnswer.length > 0);
    assert.deepEqual(Object.keys(copy.fields).sort(), Object.keys(english.fields).sort(), `${locale} field keys match`);
    assert.deepEqual(Object.keys(copy.actions).sort(), Object.keys(english.actions).sort(), `${locale} action keys match`);
    assert.deepEqual(Object.keys(copy.messages).sort(), Object.keys(english.messages).sort(), `${locale} message keys match`);
    assert.equal(copy.additionalFaqs.length, 3, `${locale} has all three breathing-specific FAQs`);
    for (const [section, values] of Object.entries({ fields: copy.fields, actions: copy.actions, messages: copy.messages })) {
      for (const [key, value] of Object.entries(values)) assert.ok(typeof value === 'string' && value.trim().length > 0, `${locale}.${section}.${key} is nonempty`);
    }
    const config = normalizeBreathingConfig(copy.example);
    assert.equal(breathingPhaseAt(config, 0).phase, 'inhale', `${locale} example starts with an inhale`);
    assert.equal(breathingPhaseAt(config, 60).phase, 'complete', `${locale} example ends on time`);
  }
});
