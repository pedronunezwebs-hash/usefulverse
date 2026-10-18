import test from 'node:test';
import assert from 'node:assert/strict';
import { localeEntries } from '../locales.mjs';
import { english } from './copy-en.mjs';
import { marketTools } from './catalog.mjs';
import { renderPage } from './render.mjs';
import { norwayParentalBenefitEnglish } from './norway-parental-benefit-copy-en.mjs';
import { norwayParentalBenefitTranslationsByLocale } from './norway-parental-benefit-translations.mjs';
import { norwayUnemploymentBenefitEnglish } from './norway-unemployment-benefit-copy-en.mjs';
import { norwayUnemploymentBenefitTranslationsByLocale } from './norway-unemployment-benefit-translations.mjs';
import { translationsByLocale } from './translations.mjs';
import { manualMarketMetadataOverridesByLocale } from './manual-localization-quality-overrides.mjs';

const tool = marketTools.find(({ mode }) => mode === 'norwayParentalBenefit');
const common = { ...english, ...norwayParentalBenefitEnglish, actions: english.actions, messages: english.messages };
const allLocales = [...localeEntries, { key: 'nb', code: 'nb-NO', name: 'Norsk bokmål', prefix: '/nb' }];
const escapeHtml = (value) => value.replace(/[&<>"']/gu, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const uniqueSourceStrings = (value) => {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(uniqueSourceStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(uniqueSourceStrings);
  return [];
};

test('parental-benefit planner renders global-language routes with Norway jurisdiction explicit', () => {
  assert.ok(tool);
  assert.equal(Object.keys(norwayParentalBenefitTranslationsByLocale).length, 36);
  const htmlByLocale = new Map();
  for (const locale of allLocales) {
    const html = renderPage({ tool, locale, locales: allLocales, copy: common });
    htmlByLocale.set(locale.key, html);
    assert.match(html, /norway-parental-benefit-controller\.mjs/u, `${locale.key} controller`);
    assert.match(html, /data-parental-tool/u, `${locale.key} controls`);
    assert.match(html, /https:\/\/www\.nav\.no\/foreldrepenger/u, `${locale.key} official NAV link`);
    assert.match(html, /<title>[^<]+<\/title>/u, `${locale.key} page title`);
    if (locale.key !== 'en') {
      const dictionary = norwayParentalBenefitTranslationsByLocale[locale.key];
      assert.ok(dictionary, `${locale.key} translation pack`);
      assert.equal(Object.keys(dictionary).length, new Set(uniqueSourceStrings(norwayParentalBenefitEnglish)).size, `${locale.key} static tool-specific strings`);
      const expectedHeading = locale.key === 'nb'
        ? manualMarketMetadataOverridesByLocale.nb[norwayParentalBenefitEnglish.name]
        : dictionary[norwayParentalBenefitEnglish.name];
      assert.ok(html.includes(`<h1>${escapeHtml(expectedHeading)}</h1>`), `${locale.key} translated heading`);
      assert.ok(dictionary[norwayParentalBenefitEnglish.fields.scope].length > 25, `${locale.key} has an explicit dated Norway scope`);
      assert.ok(html.includes(norwayUnemploymentBenefitTranslationsByLocale[locale.key][norwayUnemploymentBenefitEnglish.name]), `${locale.key} localizes the related Norway tool title`);
      assert.ok(!Object.values(dictionary).some((value) => /UVP\d{4}X|127\.0\.0\.1|AXWebArea/iu.test(value)), `${locale.key} has no capture artifacts`);
      assert.ok(!Object.keys(translationsByLocale[locale.key] ?? {}).includes(norwayParentalBenefitEnglish.fields.scope), `${locale.key} scope is specific to this tool`);
    }
  }
  assert.equal(htmlByLocale.size, 37);
  for (const locale of allLocales.filter(({ rtl }) => rtl)) assert.match(htmlByLocale.get(locale.key), /dir="rtl"/u, `${locale.key} direction`);
});
