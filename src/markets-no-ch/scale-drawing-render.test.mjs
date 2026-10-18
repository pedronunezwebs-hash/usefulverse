import test from 'node:test';
import assert from 'node:assert/strict';
import { localeEntries } from '../locales.mjs';
import { english } from './copy-en.mjs';
import { marketTools } from './catalog.mjs';
import { renderPage } from './render.mjs';
import { translationsByLocale } from './translations.mjs';
import { scaleDrawingEnglish } from './scale-drawing-copy-en.mjs';
import { scaleDrawingTranslationsByLocale } from './scale-drawing-translations.mjs';

const locales = [...localeEntries.map((entry) => ({ ...entry, rtl: ['ar', 'ur', 'fa'].includes(entry.key) })), { key: 'nb', code: 'nb-NO', name: 'Norsk bokmål', prefix: '/nb', rtl: false }];
const tool = marketTools.find((entry) => entry.mode === 'scaleDrawing');
const copy = { ...english, ...scaleDrawingEnglish, actions: english.actions, messages: english.messages };
const escape = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
const uniqueSourceStrings = (value) => {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(uniqueSourceStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(uniqueSourceStrings);
  return [];
};

test('scale-drawing copy is statically translated and renders complete metadata/actions on all 37 routes', () => {
  assert.ok(tool, 'catalog entry exists');
  assert.equal(locales.length, 37);
  assert.equal(Object.keys(scaleDrawingTranslationsByLocale).length, 36);
  const expectedKeys = Object.keys(scaleDrawingEnglish);
  for (const [language, dictionary] of Object.entries(scaleDrawingTranslationsByLocale)) {
    assert.equal(Object.keys(dictionary).length, new Set(uniqueSourceStrings(scaleDrawingEnglish)).size, `${language} has each unique source string`);
    const combined = { ...(translationsByLocale[language] ?? {}), ...dictionary };
    for (const key of expectedKeys) {
      if (key === 'fields' || key === 'faq') continue;
      assert.ok(combined[scaleDrawingEnglish[key]]?.trim(), `${language} includes ${key}`);
    }
    for (const [source, translated] of Object.entries(dictionary)) {
      assert.ok(typeof translated === 'string' && translated.trim(), `${language} has nonblank copy for ${source}`);
      assert.ok(!/⟦Q\d{3}⟧|UVROW|Obteniendo traducción|Resultados de traducción disponibles/iu.test(translated), `${language} has no capture residue`);
    }
    const locale = locales.find((entry) => entry.key === language);
    assert.ok(locale, `${language} has a route`);
    const html = renderPage({ tool, locale, locales, copy });
    assert.ok(html.includes(`<title>${escape(dictionary[scaleDrawingEnglish.title])}</title>`), `${language} title is localized`);
    assert.ok(html.includes(`<h1>${escape(dictionary[scaleDrawingEnglish.name])}</h1>`), `${language} heading is localized`);
    assert.match(html, new RegExp(`<html lang="${locale.code}" dir="${locale.rtl ? 'rtl' : 'ltr'}">`, 'u'));
    assert.equal((html.match(/rel="alternate" hreflang=/gu) ?? []).length, 38, `${language} includes full hreflang set`);
    for (const action of ['calculateScale', 'sampleScale', 'clearScale', 'exportScaleCsv', 'printScale']) assert.ok(html.includes(`data-action="${action}"`), `${language} includes ${action}`);
    assert.ok(html.includes('scale-drawing-controller.mjs'));
    assert.ok(html.includes('data-scale-table') && html.includes('data-scale-bar') && html.includes('width="100mm"'));
    assert.ok(!html.includes('fetch('), 'the published tool does not call an API');
  }
});

test('English page communicates print-size limitations and disables exports until calculation', () => {
  const locale = locales.find((entry) => entry.key === 'en');
  const html = renderPage({ tool, locale, locales, copy });
  assert.ok(html.includes('<title>Scale Drawing Calculator — Free Drawing &amp; Print Scale</title>'));
  assert.ok(html.includes('role="status" aria-live="polite"'));
  assert.ok(html.includes('Turn off Fit to page'));
  assert.ok(html.includes('data-action="exportScaleCsv" disabled'));
  assert.ok(html.includes('data-action="printScale" disabled'));
  assert.ok(html.includes('id="scale-source"') && html.includes('id="scale-target"'));
});
