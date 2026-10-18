import test from 'node:test';
import assert from 'node:assert/strict';
import { localeEntries } from '../locales.mjs';
import { english } from './copy-en.mjs';
import { marketTools } from './catalog.mjs';
import { renderPage } from './render.mjs';
import { translationsByLocale } from './translations.mjs';
import { swissWheelOffsetEnglish } from './swiss-wheel-offset-copy-en.mjs';
import { swissWheelOffsetTranslationsByLocale } from './swiss-wheel-offset-translations.mjs';

const locales = [...localeEntries.map((entry) => ({ ...entry, rtl: ['ar', 'ur', 'fa'].includes(entry.key) })), { key: 'nb', code: 'nb-NO', name: 'Norsk bokmål', prefix: '/nb', rtl: false }];
const tool = marketTools.find((entry) => entry.mode === 'swissWheelOffset');
const copy = { ...english, ...swissWheelOffsetEnglish, actions: english.actions, messages: english.messages };
const escaped = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');

test('wheel-offset copy is complete and statically translated for all 37 routes', () => {
  assert.ok(tool, 'catalog entry exists');
  assert.equal(locales.length, 37);
  assert.equal(Object.keys(swissWheelOffsetTranslationsByLocale).length, 36);
  const expectedKeys = Object.keys(swissWheelOffsetEnglish);
  for (const [language, dictionary] of Object.entries(swissWheelOffsetTranslationsByLocale)) {
    assert.equal(Object.keys(dictionary).length, 59, `${language} has every unique source string`);
    const combined = { ...(translationsByLocale[language] ?? {}), ...dictionary };
    for (const key of expectedKeys) {
      if (key === 'fields' || key === 'faq') continue;
      assert.ok(combined[swissWheelOffsetEnglish[key]]?.trim(), `${language} missing ${key}`);
    }
    for (const [source, translated] of Object.entries(dictionary)) {
      assert.ok(typeof translated === 'string' && translated.trim(), `${language} has blank source ${source}`);
      assert.ok(!/UVROW|checkbox|Focused UI element|Resultados de traducción disponibles/iu.test(translated), `${language} contains marker/debug residue`);
    }
    const locale = locales.find((entry) => entry.key === language);
    assert.ok(locale, `${language} has a route`);
    const html = renderPage({ tool, locale, locales, copy });
    const title = dictionary[swissWheelOffsetEnglish.title];
    const name = dictionary[swissWheelOffsetEnglish.name];
    assert.ok(html.includes(`<title>${escaped(title)}</title>`), `${language} title is rendered`);
    assert.ok(html.includes(`<h1>${escaped(name)}</h1>`), `${language} H1 is rendered`);
    assert.match(html, new RegExp(`<html lang="${locale.code}" dir="${locale.rtl ? 'rtl' : 'ltr'}">`, 'u'));
    assert.equal((html.match(/rel="alternate" hreflang=/gu) ?? []).length, 38, `${language} has the full hreflang set`);
    assert.ok(html.includes('data-action="compareWheels"') && html.includes('data-action="sampleWheels"') && html.includes('data-action="clearWheels"') && html.includes('data-action="exportWheelCsv"'), `${language} has all actions`);
    assert.ok(html.includes('swiss-wheel-offset-controller.mjs'));
    assert.ok(html.includes('data-wheel-diagram') && html.includes('data-wheel-summary'));
    assert.ok(!html.includes('fetch('), 'the tool does not submit measurements to an API');
  }
});

test('English wheel-offset page states limits and presents accessible local controls', () => {
  const locale = locales.find((entry) => entry.key === 'en');
  const html = renderPage({ tool, locale, locales, copy });
  assert.ok(html.includes('<title>Wheel Offset Calculator — Free ET &amp; Rim Position Comparison</title>'));
  assert.ok(html.includes('role="status" aria-live="polite"'));
  assert.ok(html.includes('role="img" aria-label="Wheel position comparison"'));
  assert.ok(html.includes('not a vehicle compatibility, safety, legal or homologation check'));
  assert.ok(html.includes('id="wheel-current-width"') && html.includes('id="wheel-new-width"'));
  assert.ok(html.includes('id="wheel-inner-clearance"') && html.includes('id="wheel-outer-clearance"'));
});
