import test from 'node:test';
import assert from 'node:assert/strict';
import { locales } from '../locales.mjs';
import { kanbanBoardContent } from './kanban-board-content.mjs';
import { kanbanBoardEnglishCopy, kanbanBoardUiKeys } from './kanban-board-source.mjs';

test('Kanban board UI and SEO copy exist for every published locale', () => {
  for (const language of Object.keys(locales)) {
    const { ui, copy } = kanbanBoardContent(language);
    for (const key of kanbanBoardUiKeys) {
      assert.equal(typeof ui[key], 'string', `${language} is missing UI key: ${key}`);
      assert.ok(ui[key].trim(), `${language} has an empty UI key: ${key}`);
      assert.doesNotMatch(ui[key], /@@KBN\d+@@|UVROW\d+X/u, `${language} contains a translation marker`);
    }
    assert.equal(copy.length, kanbanBoardEnglishCopy.length, `${language} has incomplete SEO copy`);
    assert.ok(copy.every((value) => typeof value === 'string' && value.trim()), `${language} has empty SEO copy`);
  }
  assert.equal(Object.keys(locales).length, 36);
});
