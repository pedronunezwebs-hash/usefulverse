import test from 'node:test';
import assert from 'node:assert/strict';
import { marketTools } from './catalog.mjs';
import { renderPage } from './render.mjs';
import { english } from './copy-en.mjs';
import { snakesAndLaddersEnglish } from './snakes-and-ladders-copy-en.mjs';
import { snakesAndLaddersTranslationsByLocale } from './snakes-and-ladders-translations.mjs';
import { localeEntries } from '../locales.mjs';

const locales = [...localeEntries.map((entry) => ({ ...entry, rtl: ['ar', 'ur', 'fa'].includes(entry.key) })), { key: 'nb', code: 'nb-NO', name: 'Norsk bokmål', prefix: '/nb', rtl: false }];
const tool = marketTools.find((item) => item.mode === 'snakesAndLadders');
const copy = { ...english, ...snakesAndLaddersEnglish, actions: english.actions, messages: english.messages };

test('Snakes and Ladders is rendered with a complete localized original board in all 37 locales', () => {
  assert.ok(tool);
  for (const locale of locales) {
    const html = renderPage({ tool, locale, locales, copy, baseOrigin: 'https://example.test' });
    assert.equal((html.match(/data-snl-cell="\d+"/gu) ?? []).length, 100, `${locale.key} board has 100 cells`);
    assert.ok(html.includes('snakes-and-ladders-controller.mjs'), `${locale.key} loads game logic`);
    assert.ok(html.includes('role="grid"'), `${locale.key} exposes a labeled grid`);
    assert.ok(html.includes('data-snl-roll'), `${locale.key} has a die control`);
    assert.ok(html.includes(`lang="${locale.code}" dir="${locale.rtl ? 'rtl' : 'ltr'}"`), `${locale.key} uses its language and direction`);
  }
});
