import assert from 'node:assert/strict';
import test from 'node:test';
import { tools } from './catalog.mjs';
import { locales, localizedTool } from './locales.mjs';
import { renderToolPage } from './template.mjs';

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
