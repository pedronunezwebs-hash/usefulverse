import assert from 'node:assert/strict';
import test from 'node:test';
import { tools } from './catalog.mjs';
import { localePath, locales, localizedTool } from './locales.mjs';
import { relatedToolIds, renderHome, renderToolPage } from './template.mjs';

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

test('result follow-up is hidden initially, offers at most three localized related tools and can be dismissed', () => {
  const tool = tools.find((item) => item.id === 'pdf-to-image');
  for (const language of Object.keys(locales)) {
    const html = renderToolPage(localizedTool(tool, language), '', language);
    const panel = html.match(/<aside class="tool-follow-up"[\s\S]*?<\/aside>/u)?.[0] ?? '';
    const related = html.match(/<section class="related-tools">[\s\S]*?<\/section>/u)?.[0] ?? '';
    const ids = relatedToolIds[tool.id];
    assert.match(panel, /data-tool-follow-up hidden/u, `${language} panel starts hidden`);
    assert.match(panel, /data-tool-follow-up-dismiss/u, `${language} panel has a dismiss control`);
    assert.equal((panel.match(/class="tool-card\b/gu) ?? []).length, 0, `${language} cards wait for a result`);
    assert.equal((related.match(/class="tool-card\b/gu) ?? []).length, 3, `${language} offers exactly three related tools`);
    for (const id of ids) assert.ok(related.includes(`href="${localePath(language, id)}"`), `${language} links to ${id} in its own locale`);
    assert.ok(!ids.includes(tool.id), `${language} recommendations omit the current tool`);
  }
});

test('contextual result links point to existing, distinct tools and match the completed task', () => {
  const ids = new Set(tools.map((tool) => tool.id));
  for (const [source, recommendations] of Object.entries(relatedToolIds)) {
    assert.ok(ids.has(source), `Unknown recommendation source ${source}`);
    assert.ok(recommendations.length <= 3, `${source} exceeds the three-link limit`);
    assert.equal(new Set(recommendations).size, recommendations.length, `${source} repeats a suggestion`);
    assert.ok(!recommendations.includes(source), `${source} recommends itself`);
    for (const target of recommendations) assert.ok(ids.has(target), `${source} points to missing ${target}`);
  }
  assert.deepEqual(relatedToolIds['pdf-to-image'], ['image-cropper', 'image-resizer-compressor', 'image-format-converter']);
  assert.deepEqual(relatedToolIds['video-compressor'], ['media-converter', 'audio-compressor', 'media-transcriber']);
  assert.deepEqual(relatedToolIds['media-transcriber'], ['subtitle-converter', 'word-counter', 'audio-compressor']);
  assert.ok(!relatedToolIds['video-compressor'].includes('pdf-tools'));
});

test('Japanese existing tools include localized amida and Japanese-era utilities without exposing Japanese-only UI elsewhere', () => {
  const picker = tools.find((tool) => tool.id === 'random-name-picker');
  const dates = tools.find((tool) => tool.id === 'date-calculator');
  const japanesePicker = renderToolPage(localizedTool(picker, 'ja'), '', 'ja');
  const englishPicker = renderToolPage(localizedTool(picker, 'en'), '', 'en');
  const japaneseDates = renderToolPage(localizedTool(dates, 'ja'), '', 'ja');
  const englishDates = renderToolPage(localizedTool(dates, 'en'), '', 'en');
  assert.match(japanesePicker, /あみだくじを作成/u);
  assert.match(japanesePicker, /あみだくじ/u);
  assert.doesNotMatch(englishPicker, /あみだくじ/u);
  assert.match(japaneseDates, /data-action="japanese-era"/u);
  assert.match(japaneseDates, /和暦に変換/u);
  assert.match(japaneseDates, /西暦を和暦に変換できますか/u);
  assert.match(localizedTool(dates, 'ja').keywords, /西暦 和暦 変換/u);
  assert.match(japaneseDates, /西暦を令和・平成に変換/u);
  assert.doesNotMatch(englishDates, /和暦/u);
});
