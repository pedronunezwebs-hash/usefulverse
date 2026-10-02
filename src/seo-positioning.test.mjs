import assert from 'node:assert/strict';
import test from 'node:test';
import { tools } from './catalog.mjs';
import { locales, localizedTool } from './locales.mjs';
import { renderHome, renderToolPage } from './template.mjs';

const decode = (value) => value
  .replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>')
  .replaceAll('&quot;', '"').replaceAll('&#039;', "'");

test('free/no-usage-cap positioning stays inside metadata limits for every localized tool', () => {
  for (const language of Object.keys(locales)) {
    for (const tool of tools) {
      const html = renderToolPage(localizedTool(tool, language), '', language);
      const title = decode(html.match(/<title>([^<]+)<\/title>/u)?.[1] ?? '');
      const description = decode(html.match(/<meta name="description" content="([^"]*)"/u)?.[1] ?? '');
      assert.ok(title.length >= 15 && title.length <= 65, `${language}/${tool.id} title length ${title.length}: ${title}`);
      assert.ok(description.length >= 25 && description.length <= 155, `${language}/${tool.id} description length ${description.length}`);
    }
  }
});

test('home-page titles and descriptions also obey the same positioning and length rules', () => {
  for (const language of Object.keys(locales)) {
    const html = renderHome(tools, ['All'], '', language);
    const title = decode(html.match(/<title>([^<]+)<\/title>/u)?.[1] ?? '');
    const description = decode(html.match(/<meta name="description" content="([^"]*)"/u)?.[1] ?? '');
    assert.ok(title.length >= 15 && title.length <= 65, `${language} home title length ${title.length}`);
    assert.ok(description.length >= 25 && description.length <= 155, `${language} home description length ${description.length}`);
    assert.doesNotMatch(title, /UsefulVerse.*UsefulVerse/u, `${language} home title repeats the brand`);
    assert.match(title, /UsefulVerse$/u, `${language} home title should end with the brand`);
    if (language === 'en') assert.match(title, /Free · no limits/u);
    if (language === 'es') assert.match(title, /Gratis · sin límites/u);
  }
});
