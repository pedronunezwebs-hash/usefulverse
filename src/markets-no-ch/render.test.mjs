import test from 'node:test';
import assert from 'node:assert/strict';
import { localeEntries } from '../locales.mjs';
import { english } from './copy-en.mjs';
import { marketTools } from './catalog.mjs';
import { renderPage } from './render.mjs';
import { translationsByLocale } from './translations.mjs';

const locales = [...localeEntries.map((entry) => ({ ...entry, rtl: ['ar', 'ur', 'fa'].includes(entry.key) })), { key: 'nb', code: 'nb-NO', name: 'Norsk bokmål', prefix: '/nb', rtl: false }];
const pilot = marketTools[0];
const copy = { ...english, ...english[pilot.mode], actions: english.actions, messages: english.messages };

test('static pilot translations cover all 37 routes without losing protected tokens', () => {
  assert.equal(locales.length, 37);
  assert.equal(Object.keys(translationsByLocale).length, 36);
  const tokens = /\{[^}]+\}|https?:\/\/\S+|UsefulVerse|\b(?:A4|SVG|CSV|PDF|URL|HTML|CSS|JSON)\b/g;
  for (const [language, dictionary] of Object.entries(translationsByLocale)) {
    assert.equal(Object.keys(dictionary).length, 147, `${language} string count`);
    for (const [source, translated] of Object.entries(dictionary)) {
      assert.ok(translated.trim(), `${language} empty translation for ${source}`);
      for (const token of source.match(tokens) ?? []) assert.ok((translated.match(tokens) ?? []).includes(token), `${language} lost ${token} in ${source}`);
    }
  }
});

test('localized pages emit correct language, canonical, and complete hreflang set', () => {
  for (const key of ['en', 'es', 'ar', 'zh_tw', 'nb']) {
    const locale = locales.find((entry) => entry.key === key);
    const html = renderPage({ tool: pilot, locale, locales, copy });
    assert.match(html, new RegExp(`<html lang="${locale.code}" dir="${locale.rtl ? 'rtl' : 'ltr'}">`, 'u'));
    assert.ok(html.includes(`<link rel="canonical" href="https://tools.usefulverse.com${locale.prefix}/tools/${pilot.id}/">`));
    assert.equal((html.match(/rel="alternate" hreflang=/gu) ?? []).length, 38);
    assert.ok(html.includes('Norsk bokmål'));
    assert.ok(html.includes('data-tool-copy'));
  }
  assert.match(renderPage({ tool: pilot, locale: locales.find((entry) => entry.key === 'es'), locales, copy }), /<html lang="es" dir="ltr">[\s\S]*?<title>Generador de papel cuadriculado/u);
  assert.match(renderPage({ tool: pilot, locale: locales.find((entry) => entry.key === 'ar'), locales, copy }), /<html lang="ar" dir="rtl">/u);
});

test('pet age draft renders English-only comparison controls with its dedicated controller', () => {
  const tool = marketTools.find((entry) => entry.mode === 'petAge');
  assert.ok(tool);
  const petCopy = { ...english, ...english.petAge, actions: english.actions, messages: english.messages };
  const html = renderPage({ tool, locale: locales.find((entry) => entry.key === 'en'), locales, copy: petCopy });
  assert.match(html, /data-pet-rows/u);
  assert.match(html, /data-pet-template/u);
  assert.match(html, /data-action="comparePets"/u);
  assert.match(html, /pet-age-controller\.mjs/u);
  assert.match(html, /FelineVMA cat-age chart \(2025\)/u);
  assert.doesNotMatch(html, /\/assets\/controller\.mjs/u);
});
