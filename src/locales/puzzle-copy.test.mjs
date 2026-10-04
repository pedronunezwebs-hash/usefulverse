import test from 'node:test';
import assert from 'node:assert/strict';
import { locales, localizedTool } from '../locales.mjs';
import { opportunityTools } from '../opportunity-tools.mjs';
import { wordSearchBody, wordSearchDescription } from './puzzle-copy.mjs';

test('word-search help copy is present in every locale and no longer claims Unicode is stripped', () => {
  const tool = opportunityTools.find(({ id }) => id === 'word-search-maker');
  assert.ok(tool);
  assert.deepEqual(Object.keys(wordSearchBody).sort(), Object.keys(locales).sort());
  assert.deepEqual(Object.keys(wordSearchDescription).sort(), Object.keys(locales).sort());
  for (const language of Object.keys(locales)) {
    const localized = localizedTool(tool, language);
    const body = localized.body;
    assert.equal(body, wordSearchBody[language], `${language} must use its corrected copy`);
    assert.equal(localized.description, wordSearchDescription[language], `${language} must use accurate description`);
    assert.doesNotMatch(body, /non-Latin characters are removed|no latinos? se eliminan|非拉丁文字.*移除|ラテン文字以外.*削除/iu);
  }
});
