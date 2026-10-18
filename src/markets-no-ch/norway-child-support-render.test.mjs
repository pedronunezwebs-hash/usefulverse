import test from 'node:test';
import assert from 'node:assert/strict';
import { localeEntries } from '../locales.mjs';
import { english } from './copy-en.mjs';
import { marketTools } from './catalog.mjs';
import { renderPage } from './render.mjs';
import { norwayChildSupportEnglish } from './norway-child-support-copy-en.mjs';
import { norwayChildSupportTranslationsByLocale } from './norway-child-support-translations.mjs';
import { translationsByLocale } from './translations.mjs';
import { manualMarketMetadataOverridesByLocale } from './manual-localization-quality-overrides.mjs';

const tool = marketTools.find(({ mode }) => mode === 'norwayChildSupport');
const common = { ...english, ...norwayChildSupportEnglish, actions: english.actions, messages: english.messages };
const allLocales = [...localeEntries, { key: 'nb', code: 'nb-NO', name: 'Norsk bokmål', prefix: '/nb' }];
const escapeHtml = (value) => value.replace(/[&<>"']/gu, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
const uniqueSourceStrings = (value) => {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(uniqueSourceStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(uniqueSourceStrings);
  return [];
};

test('Norwegian child-support estimator renders globally accessible language routes with Norway law explicit', () => {
  assert.ok(tool);
  assert.equal(Object.keys(norwayChildSupportTranslationsByLocale).length, 36);
  const htmlByLocale = new Map();
  for (const locale of allLocales) {
    const html = renderPage({ tool, locale, locales: allLocales, copy: common });
    htmlByLocale.set(locale.key, html);
    assert.match(html, /norway-child-support-controller\.mjs/u, `${locale.key} controller`);
    assert.match(html, /data-child-support-tool/u, `${locale.key} controls`);
    assert.match(html, /https:\/\/www\.nav\.no\/barnebidrag/u, `${locale.key} NAV source`);
    assert.match(html, /https:\/\/lovdata\.no\/nav\/rundskriv\/v1-55-02/u, `${locale.key} 2026 rate table`);
    assert.match(html, /<title>[^<]+<\/title>/u, `${locale.key} title`);
    if (locale.key !== 'en') {
      const dictionary = norwayChildSupportTranslationsByLocale[locale.key];
      assert.ok(dictionary, `${locale.key} translation pack`);
      assert.equal(Object.keys(dictionary).length, new Set(uniqueSourceStrings(norwayChildSupportEnglish)).size, `${locale.key} static tool-specific strings`);
      const expectedHeading = locale.key === 'nb'
        ? manualMarketMetadataOverridesByLocale.nb[norwayChildSupportEnglish.name]
        : dictionary[norwayChildSupportEnglish.name];
      assert.ok(html.includes(`<h1>${escapeHtml(expectedHeading)}</h1>`), `${locale.key} translated heading`);
      assert.match(dictionary[norwayChildSupportEnglish.fields.scope], /\p{N}/u, `${locale.key} retains dated rates`);
      assert.ok(!Object.values(dictionary).some((value) => /UVS\d{4}X|127\.0\.0\.1|AXWebArea/iu.test(value)), `${locale.key} has no capture artifacts`);
      assert.ok(!Object.keys(translationsByLocale[locale.key] ?? {}).includes(norwayChildSupportEnglish.fields.scope), `${locale.key} scope is specific to this tool`);
    }
  }
  assert.equal(htmlByLocale.size, 37);
  for (const locale of allLocales.filter(({ rtl }) => rtl)) assert.match(htmlByLocale.get(locale.key), /dir="rtl"/u, `${locale.key} direction`);
});
