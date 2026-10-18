import test from 'node:test';
import assert from 'node:assert/strict';
import { localeEntries } from '../locales.mjs';
import { english } from './copy-en.mjs';
import { amerikanerCardGameEnglish } from './amerikaner-card-game-copy-en.mjs';
import { renderPage } from './render.mjs';

const locales = [...localeEntries.map((entry) => ({ ...entry, rtl: ['ar', 'ur', 'fa'].includes(entry.key) })), { key: 'nb', code: 'nb-NO', name: 'Norsk bokmål', prefix: '/nb', rtl: false }];
const tool = {
  id: 'amerikaner-card-game', mode: 'amerikanerCardGame', name: amerikanerCardGameEnglish.name,
  title: amerikanerCardGameEnglish.title, description: amerikanerCardGameEnglish.description,
  category: 'games', related: ['war-card-game'],
};
const copy = { ...english, ...amerikanerCardGameEnglish, actions: english.actions, messages: english.messages };

test('Amerikaner renders accessible local-play controls, rules and cited Norwegian source', () => {
  const locale = locales.find(({ key }) => key === 'en');
  const html = renderPage({ tool, locale, locales, copy });
  for (const selector of ['data-amerikaner-players', 'data-amerikaner-bid-panel', 'data-amerikaner-lead-panel', 'data-amerikaner-play-panel', 'data-amerikaner-hand', 'data-amerikaner-trick', 'data-amerikaner-scoreboard', 'data-tool-copy']) {
    assert.ok(html.includes(selector), `missing ${selector}`);
  }
  assert.match(html, /Norwegian Amerikaner trick-taking game/iu);
  assert.match(html, /src="\/assets\/amerikaner-card-game-controller\.mjs"/iu);
  assert.match(html, /norske-kortspill\.no\/spill\/amerikaner/iu);
  assert.match(html, /role="status" aria-live="polite"/iu);
});

test('Amerikaner localizes the actual Norwegian variant and preserves the meaning across distant locales', () => {
  const toolTranslations = [
    { key: 'es', title: 'Juego de cartas Amerikaner en línea', intro: 'Juega al Amerikaner noruego' },
    { key: 'nb', title: 'Kortspillet Amerikaner på nett', intro: 'Spill det norske kortspillet Amerikaner' },
    { key: 'ur', title: 'Amerikaner کارڈ گیم آن لائن', intro: 'ناروے کے تاش کے کھیل' },
    { key: 'zh_tw', title: 'Amerikaner 紙牌遊戲線上版', intro: '挪威 Amerikaner 紙牌遊戲' },
    { key: 'tl', title: 'Amerikaner', intro: 'larong Norwegian Amerikaner' },
  ];
  for (const expected of toolTranslations) {
    const locale = locales.find(({ key }) => key === expected.key) ?? { key: 'nb', code: 'nb-NO', name: 'Norsk bokmål', prefix: '/nb', rtl: false };
    const html = renderPage({ tool, locale, locales, copy });
    assert.ok(html.includes(expected.title), `title not localized for ${expected.key}`);
    assert.ok(html.includes(expected.intro), `Norwegian variant context missing for ${expected.key}`);
    assert.ok(!html.includes('⟪UVROW'), `translation capture marker leaked for ${expected.key}`);
    assert.match(html, /norske-kortspill\.no\/spill\/amerikaner/iu);
  }
});
