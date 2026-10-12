import assert from 'node:assert/strict';
import test from 'node:test';
import { localeEntries } from '../../../locales.mjs';
import { renderGrowthForm } from '../../forms.mjs';
import copies from '../../locales/text-to-speech-final.mjs';
import { textToSpeechEnglishCopy } from '../../locales/text-to-speech.en.mjs';

function structure(value) {
  if (Array.isArray(value)) return value.map(structure);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value)
      .filter(([key]) => !['copyLanguage', 'localizationStatus', 'localizationAcceptedBy', 'localizationAcceptedAt', 'title'].includes(key))
      .map(([key, child]) => [key, structure(child)]));
  }
  return typeof value;
}

test('Text to Speech has complete static copy and renders its accessible controls in all 36 locales', () => {
  assert.equal(localeEntries.length, 36);
  assert.equal(Object.keys(copies).length, 36);
  for (const { key } of localeEntries) {
    const copy = copies[key];
    assert.ok(copy, key);
    assert.equal(copy.copyLanguage, key, key);
    assert.deepEqual(structure(copy), structure(textToSpeechEnglishCopy), `${key}: copy structure`);
    assert.ok(Array.from(copy.title).length <= 60, `${key}: title length`);
    assert.ok(Array.from(copy.description).length <= 160, `${key}: description length`);
    assert.match(copy.title, /UsefulVerse/u, `${key}: branded title`);
    assert.equal(copy.additionalFaqs.length, 3, `${key}: FAQs`);
    assert.ok(copy.fields.remoteNotice && copy.fields.privacyNote && copy.privacyAnswer, `${key}: privacy disclosure`);
    assert.ok(copy.actions.play && copy.actions.pause && copy.actions.resume && copy.actions.stop && copy.actions.clear, `${key}: playback controls`);
    assert.ok(Object.values(copy.messages).every((value) => typeof value === 'string' && value.trim()), `${key}: non-empty messages`);
    if (key !== 'en') {
      assert.equal(copy.localizationStatus, 'machine-accepted', key);
      assert.equal(copy.localizationAcceptedBy, 'site-owner', key);
      assert.match(copy.localizationAcceptedAt, /^\d{4}-\d{2}-\d{2}$/u, key);
      assert.notEqual(copy.name, textToSpeechEnglishCopy.name, `${key}: localized tool name`);
      assert.notEqual(copy.intro, textToSpeechEnglishCopy.intro, `${key}: localized introduction`);
    }
    const html = renderGrowthForm('text-to-speech', copy);
    for (const marker of ['name="text"', 'name="voice"', 'name="showRemote"', 'name="rate"', 'name="pitch"', 'data-action="play"', 'data-action="pause"', 'data-action="resume"', 'data-action="stop"', 'data-action="clear"', 'aria-live="polite"']) {
      assert.ok(html.includes(marker), `${key}: rendered ${marker}`);
    }
    assert.ok(html.includes(copy.fields.textLabel), `${key}: rendered localized label`);
  }
});

test('Portuguese description uses Portuguese script instead of the Gujarati translation accidentally returned by the translator', () => {
  assert.match(copies.pt.description, /Leia texto em voz alta/u);
  assert.doesNotMatch(copies.pt.description, /[\u0A80-\u0AFF]/u);
});
