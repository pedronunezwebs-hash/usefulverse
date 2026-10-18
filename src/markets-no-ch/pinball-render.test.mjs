import test from 'node:test';
import assert from 'node:assert/strict';
import { marketTools } from './catalog.mjs';
import { renderPage } from './render.mjs';
import { english } from './copy-en.mjs';
import { pinballEnglish } from './pinball-copy-en.mjs';
import { localeEntries } from '../locales.mjs';

const locales = [...localeEntries.map((entry) => ({ ...entry, rtl: ['ar', 'ur', 'fa'].includes(entry.key) })), { key: 'nb', code: 'nb-NO', name: 'Norsk bokmål', prefix: '/nb', rtl: false }];
const tool = marketTools.find((item) => item.mode === 'pinball');
const copy = { ...english, ...pinballEnglish, actions: english.actions, messages: english.messages };

test('Pinball renders its original playable table and usable controls in all 37 locales', () => {
  assert.ok(tool);
  for (const locale of locales) {
    const html = renderPage({ tool, locale, locales, copy, baseOrigin: 'https://example.test' });
    assert.ok(html.includes('pinball-controller.mjs'), `${locale.key} loads game logic`);
    assert.ok(html.includes('data-pinball-canvas') && html.includes('role="img"'), `${locale.key} exposes an accessible playfield`);
    assert.ok(html.includes('data-pinball-left') && html.includes('data-pinball-right'), `${locale.key} has accessible flipper controls`);
    assert.ok(html.includes('data-pinball-launch') && html.includes('data-pinball-new'), `${locale.key} can start and launch a game`);
    assert.ok(html.includes(`lang="${locale.code}" dir="${locale.rtl ? 'rtl' : 'ltr'}"`), `${locale.key} uses its language and direction`);
  }
});
