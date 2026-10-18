import test from 'node:test';
import assert from 'node:assert/strict';
import { localeEntries } from '../locales.mjs';
import { english } from './copy-en.mjs';
import { marketTools } from './catalog.mjs';
import { renderPage } from './render.mjs';
import { translationsByLocale } from './translations.mjs';
import { remainingToolsEnglish } from './remaining-tools-copy-en.mjs';
import { relatedMarketMetadataTranslationsByLocale } from './related-market-metadata-translations.mjs';
import { legacyMarketCopyTranslationsByLocale } from './legacy-market-copy-translations.mjs';
import { norwayEmployerCostEnglish } from './norway-employer-cost-copy-en.mjs';

const locales = [...localeEntries.map((entry) => ({ ...entry, rtl: ['ar', 'ur', 'fa'].includes(entry.key) })), { key: 'nb', code: 'nb-NO', name: 'Norsk bokmål', prefix: '/nb', rtl: false }];
const pilot = marketTools[0];
const copy = { ...english, ...(remainingToolsEnglish[pilot.mode] ?? english[pilot.mode]), actions: english.actions, messages: english.messages };

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
    assert.ok(html.includes('UsefulVerse'), `${key} preserves the product brand`);
    assert.ok(html.includes('data-tool-copy'));
  }
  const spanish = renderPage({ tool: pilot, locale: locales.find((entry) => entry.key === 'es'), locales, copy });
  assert.match(spanish, /<title>[^<]+<\/title>/u);
  assert.doesNotMatch(spanish, /Verso útil/u);
  assert.match(renderPage({ tool: pilot, locale: locales.find((entry) => entry.key === 'ar'), locales, copy }), /<html lang="ar" dir="rtl">/u);
});

test('all market catalog names, titles and descriptions have a locale entry', () => {
  const ids = new Set([
    'switzerland-unemployment-benefit-calculator', 'switzerland-tenancy-notice-planner',
    'switzerland-property-gains-tax-calculator', 'switzerland-inheritance-gift-tax-calculator',
    'switzerland-child-support-budget-calculator', 'norway-holiday-pay-calculator',
    'norway-income-tax-calculator', 'norway-wealth-tax-calculator', 'swiss-qr-bill-generator',
    'grade-scale-generator',
  ]);
  const sources = new Set(marketTools.filter(({ id }) => ids.has(id)).flatMap(({ name, title, description }) => [name, title, description]));
  for (const locale of locales.filter(({ key }) => key !== 'en')) {
    const dictionary = relatedMarketMetadataTranslationsByLocale[locale.key];
    assert.ok(dictionary, `${locale.key} metadata dictionary exists`);
    for (const source of sources) assert.ok(dictionary[source]?.trim(), `${locale.key} metadata translation missing for ${source}`);
  }
});

test('legacy market calculator and generator copy is translated before rendering', () => {
  const tool = marketTools.find(({ id }) => id === 'norway-holiday-pay-calculator');
  const legacyCopy = { ...english, ...english.holidayPay, actions: english.actions, messages: english.messages };
  const html = renderPage({ tool, locale: locales.find(({ key }) => key === 'es'), locales, copy: legacyCopy });
  assert.match(html, /<title>Calculadora de pago de vacaciones/u);
  assert.doesNotMatch(html, /Enter the feriepengegrunnlag|Holiday-pay basis \(NOK\)|Reset choices/u);
});

test('complete legacy market copy packs cover every active locale', () => {
  const sources = new Set();
  const collect = (value) => {
    if (typeof value === 'string') sources.add(value);
    else if (Array.isArray(value)) value.forEach(collect);
    else if (value && typeof value === 'object') Object.values(value).forEach(collect);
  };
  for (const key of ['holidayPay', 'norwayTax', 'norwayWealthTax', 'swissQrBill', 'grades']) collect(english[key]);
  for (const locale of locales.filter(({ key }) => key !== 'en')) {
    const dictionary = legacyMarketCopyTranslationsByLocale[locale.key];
    assert.ok(dictionary, `${locale.key} legacy copy dictionary exists`);
    for (const source of sources) assert.ok(dictionary[source]?.trim(), `${locale.key} legacy copy missing ${source}`);
  }
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

test('recovered tax and Swiss validation tools render their controller contracts', () => {
  const cases = [
    ['norwayTax', ['data-tax-results', 'data-action="calculateTax"', 'norway-tax-controller.mjs']],
    ['swissUid', ['data-uid-results', 'data-action="validateUid"', 'swiss-uid-controller.mjs']],
    ['swissCoordinates', ['data-coordinate-results', 'data-action="convertCoordinates"', 'swiss-coordinate-controller.mjs']],
    ['frequencyTone', ['data-frequency-tone', 'data-tone-play', 'frequency-tone-generator-controller.mjs']],
    ['norwayCompanyCar', ['data-company-car-result', 'data-company-car-calculate', 'norway-company-car-controller.mjs']],
  ];
  for (const [mode, selectors] of cases) {
    const tool = marketTools.find((entry) => entry.mode === mode);
    assert.ok(tool, `missing catalog entry for ${mode}`);
    const html = renderPage({ tool, locale: locales.find((entry) => entry.key === 'en'), locales, copy: { ...english, ...english[mode], actions: english.actions, messages: english.messages } });
    for (const selector of selectors) assert.ok(html.includes(selector), `${mode} is missing ${selector}`);
  }
});

test('market metadata for related Norway and Swiss tools is localized before the links are rendered', () => {
  const targetIds = [
    'switzerland-unemployment-benefit-calculator', 'switzerland-tenancy-notice-planner',
    'switzerland-property-gains-tax-calculator', 'switzerland-inheritance-gift-tax-calculator',
    'switzerland-child-support-budget-calculator', 'norway-holiday-pay-calculator',
    'norway-income-tax-calculator', 'norway-wealth-tax-calculator',
  ];
  const employerTool = marketTools.find((entry) => entry.mode === 'norwayEmployerCost');
  assert.ok(employerTool);
  const tool = { ...employerTool, related: targetIds };
  const html = renderPage({ tool, locale: locales.find((entry) => entry.key === 'es'), locales, copy: { ...english, ...norwayEmployerCostEnglish, actions: english.actions, messages: english.messages } });
  for (const id of targetIds) {
    const candidate = marketTools.find((entry) => entry.id === id);
    const translatedName = relatedMarketMetadataTranslationsByLocale.es[candidate.name];
    assert.ok(translatedName, `${id} has a Spanish market name`);
    assert.ok(html.includes(`>${translatedName}</a>`), `${id} uses its localized name in the related-tools list`);
  }
  assert.ok(html.includes('UsefulVerse'), 'the product name remains unchanged');
});
