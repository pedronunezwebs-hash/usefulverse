import test from 'node:test';
import assert from 'node:assert/strict';
import { locales } from './locales.mjs';
import { opportunityToolMarkup } from './opportunity-template.mjs';
import { opportunityTools } from './opportunity-tools.mjs';
import { readingLogContent } from './locales/reading-log-content.mjs';
import { readingLogUiKeys } from './locales/reading-log-source.mjs';
import { relatedToolIds } from './template.mjs';

test('reading log has complete localized controls and contextual links in all 36 locales', () => {
  const tool = opportunityTools.find(({ id }) => id === 'reading-log');
  assert.ok(tool);
  assert.equal(Object.keys(locales).length, 36);
  assert.deepEqual(relatedToolIds['reading-log'], ['reading-speed-test', 'study-planner', 'habit-tracker']);
  for (const language of Object.keys(locales)) {
    const content = readingLogContent(language);
    const markup = opportunityToolMarkup(tool.id, language, content.ui, content.copy[0]);
    assert.equal(Object.keys(content.ui).length, readingLogUiKeys.length, `${language}: complete message set`);
    assert.equal(content.copy.length, 6, `${language}: localized SEO/content fields`);
    assert.ok(content.copy.every((value) => value.trim()), `${language}: non-empty localized copy`);
    for (const control of ['data-reading-log-add-form', 'data-reading-log-title', 'data-reading-log-total', 'data-reading-log-books', 'data-reading-log-progress-form', 'data-reading-log-goal-form', 'data-reading-log-save', 'data-reading-log-load', 'data-reading-log-delete', 'data-reading-log-download', 'data-reading-log-import', 'data-reading-log-clear']) {
      if (control === 'data-reading-log-progress-form') continue; // Added per-book at runtime.
      assert.ok(markup.includes(control), `${language}: ${control}`);
    }
    assert.match(markup, /data-reading-log-messages=/u, `${language}: route-scoped runtime translations`);
    if (language !== 'en') assert.ok(!/Minutes read today|Book title|Reading log saved on this device/u.test(content.ui['Minutes read today'] + content.ui['Book title'] + content.ui['Reading log saved on this device']), `${language}: translated core labels`);
  }
});
